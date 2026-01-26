// ============================================
// v2 → v3 Data Migration Service
// ============================================

import type { Portfolio, Trade, V2Data, V2Portfolio } from '@/types';
import { STORAGE_KEYS } from '@/utils/constants';
import { parseFormattedNumber } from '@/utils/format';
import { calculateBuyPrice, calculateQuantity } from '@/utils/tick';
import { addPortfolio, db, updateSettings } from './database';

/**
 * Get v2 data from localStorage
 */
function getV2Data(): V2Data | null {
  const v2DataStr = localStorage.getItem(STORAGE_KEYS.V2_DATA);
  if (!v2DataStr) return null;

  try {
    return JSON.parse(v2DataStr) as V2Data;
  } catch {
    console.error('Failed to parse v2 data');
    return null;
  }
}

/**
 * Convert v2 portfolio to v3 format
 */
function convertV2Portfolio(v2: V2Portfolio): Omit<Portfolio, 'id'> {
  // V2 portfolio ID was a timestamp (Date.now()), validate before converting
  const createdDate = new Date(v2.id);
  const isValidDate = !isNaN(createdDate.getTime()) && v2.id > 0;

  return {
    name: v2.name,
    isFavorite: v2.isFavorite || false,
    createdAt: isValidDate ? createdDate : new Date(),
    updatedAt: new Date(),
    params: {
      peakPrice: parseFormattedNumber(v2.params.peakPrice),
      strength: Number.parseFloat(v2.params.strength) || 1.0,
      startDrop: Number.parseFloat(v2.params.startDrop) || 10,
      steps: Number.parseInt(v2.params.steps) || 20,
      targetBudget: parseFormattedNumber(v2.params.targetBudget),
      legacyQty: parseFormattedNumber(v2.params.legacyQty),
      legacyAvg: parseFormattedNumber(v2.params.legacyAvg),
      ma120Price: parseFormattedNumber(v2.params.ma120Price) || undefined,
      targetMultiple: Number.parseFloat(v2.params.targetMultiple || '') || undefined,
      manualTargetPrice: parseFormattedNumber(v2.params.manualTargetPrice) || undefined,
    },
    memo: v2.portfolioMemo,
  };
}

/**
 * Create trades from v2 portfolio steps
 */
function createTradesFromV2(portfolioId: number, v2: V2Portfolio): Omit<Trade, 'id'>[] {
  const orderedSteps = v2.orderedSteps || [];
  const executedSteps = v2.executedSteps || [];
  const executionDates = v2.executionDates || {};
  const stepMemos = v2.stepMemos || {};

  const peakPrice = parseFormattedNumber(v2.params.peakPrice);
  const strength = Number.parseFloat(v2.params.strength) || 1.0;
  const startDrop = Number.parseFloat(v2.params.startDrop) || 10;

  const trades: Omit<Trade, 'id'>[] = [];

  for (const step of orderedSteps) {
    const dropRate = startDrop + (step - 1);
    const buyPrice = calculateBuyPrice(peakPrice, dropRate);
    const quantity = calculateQuantity(strength, step);
    const amount = buyPrice * quantity;

    const isExecuted = executedSteps.includes(step);
    const executionDate = executionDates[step];

    trades.push({
      portfolioId,
      step,
      status: isExecuted ? 'executed' : 'ordered',
      orderedAt: new Date(),
      executedAt: isExecuted && executionDate ? new Date(executionDate) : undefined,
      price: buyPrice,
      quantity,
      amount,
      memo: stepMemos[step],
    });
  }

  return trades;
}

/**
 * Migrate v2 data to v3 IndexedDB
 */
export async function migrateFromV2(): Promise<{
  success: boolean;
  portfolioCount: number;
  tradeCount: number;
  error?: string;
}> {
  const v2Data = getV2Data();
  if (!v2Data) {
    return { success: false, portfolioCount: 0, tradeCount: 0, error: 'No v2 data found' };
  }

  try {
    // Clear existing data
    await db.transaction('rw', [db.portfolios, db.trades, db.settings], async () => {
      await db.portfolios.clear();
      await db.trades.clear();
    });

    let portfolioCount = 0;
    let tradeCount = 0;

    // Migrate portfolios and trades
    for (const v2Portfolio of v2Data.portfolios) {
      const portfolio = convertV2Portfolio(v2Portfolio);
      const portfolioId = await addPortfolio(portfolio);

      const trades = createTradesFromV2(portfolioId, v2Portfolio);
      if (trades.length > 0) {
        await db.trades.bulkAdd(trades as Trade[]);
        tradeCount += trades.length;
      }

      portfolioCount++;
    }

    // Migrate settings
    const isDarkMode = localStorage.getItem(STORAGE_KEYS.DARK_MODE) === 'true';
    await updateSettings({
      id: 'main',
      theme: isDarkMode ? 'dark' : 'light',
      initialCash: v2Data.initialCash || 0,
      notificationsEnabled: false,
    });

    // Mark migration as complete
    localStorage.setItem(STORAGE_KEYS.V3_MIGRATED, 'true');

    return { success: true, portfolioCount, tradeCount };
  } catch (error) {
    console.error('Migration failed:', error);
    return {
      success: false,
      portfolioCount: 0,
      tradeCount: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
