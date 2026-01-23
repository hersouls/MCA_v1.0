// ============================================
// IndexedDB Database Service (Dexie.js)
// ============================================

import Dexie, { type Table } from 'dexie';
import type { Portfolio, Trade, Settings, HistoryEntry } from '@/types';
import { DB_NAME, DEFAULT_SETTINGS } from '@/utils/constants';

class MCADatabase extends Dexie {
  portfolios!: Table<Portfolio, number>;
  trades!: Table<Trade, number>;
  settings!: Table<Settings, string>;
  history!: Table<HistoryEntry, number>;

  constructor() {
    super(DB_NAME);

    this.version(1).stores({
      portfolios: '++id, name, isFavorite, updatedAt',
      trades: '++id, portfolioId, step, status',
      settings: 'id',
      history: '++id, timestamp, portfolioId',
    });
  }
}

export const db = new MCADatabase();

// ============================================
// Portfolio Operations
// ============================================

export async function getAllPortfolios(): Promise<Portfolio[]> {
  return db.portfolios.toArray();
}

export async function getPortfolio(id: number): Promise<Portfolio | undefined> {
  return db.portfolios.get(id);
}

export async function addPortfolio(portfolio: Omit<Portfolio, 'id'>): Promise<number> {
  return db.portfolios.add(portfolio as Portfolio);
}

export async function updatePortfolio(
  id: number,
  updates: Partial<Portfolio>
): Promise<void> {
  await db.portfolios.update(id, {
    ...updates,
    updatedAt: new Date(),
  });
}

export async function deletePortfolio(id: number): Promise<void> {
  await db.transaction('rw', [db.portfolios, db.trades], async () => {
    await db.trades.where('portfolioId').equals(id).delete();
    await db.portfolios.delete(id);
  });
}

// ============================================
// Trade Operations
// ============================================

export async function getTradesForPortfolio(portfolioId: number): Promise<Trade[]> {
  return db.trades.where('portfolioId').equals(portfolioId).toArray();
}

export async function addTrade(trade: Omit<Trade, 'id'>): Promise<number> {
  return db.trades.add(trade as Trade);
}

export async function updateTrade(id: number, updates: Partial<Trade>): Promise<void> {
  await db.trades.update(id, updates);
}

export async function deleteTrade(id: number): Promise<void> {
  await db.trades.delete(id);
}

export async function upsertTrade(
  portfolioId: number,
  step: number,
  updates: Partial<Trade>
): Promise<void> {
  // Use transaction to prevent race conditions
  await db.transaction('rw', db.trades, async () => {
    const existing = await db.trades
      .where(['portfolioId', 'step'])
      .equals([portfolioId, step])
      .first();

    if (existing && existing.id !== undefined) {
      await db.trades.update(existing.id, updates);
    } else {
      await db.trades.add({
        portfolioId,
        step,
        status: 'pending',
        price: 0,
        quantity: 0,
        amount: 0,
        ...updates,
      } as Trade);
    }
  });
}

export async function bulkUpdateTrades(
  portfolioId: number,
  orderedSteps: number[],
  executedSteps: number[]
): Promise<void> {
  await db.transaction('rw', db.trades, async () => {
    // Delete existing trades for this portfolio
    await db.trades.where('portfolioId').equals(portfolioId).delete();

    // Add new trades
    const trades: Omit<Trade, 'id'>[] = orderedSteps.map((step) => ({
      portfolioId,
      step,
      status: executedSteps.includes(step) ? 'executed' : 'ordered',
      orderedAt: new Date(),
      executedAt: executedSteps.includes(step) ? new Date() : undefined,
      price: 0,
      quantity: 0,
      amount: 0,
    }));

    if (trades.length > 0) {
      await db.trades.bulkAdd(trades as Trade[]);
    }
  });
}

// ============================================
// Settings Operations
// ============================================

export async function getSettings(): Promise<Settings> {
  const settings = await db.settings.get('main');
  return settings || DEFAULT_SETTINGS;
}

export async function updateSettings(updates: Partial<Settings>): Promise<void> {
  const existing = await db.settings.get('main');
  if (existing) {
    await db.settings.update('main', updates);
  } else {
    await db.settings.add({ ...DEFAULT_SETTINGS, ...updates });
  }
}

// ============================================
// History Operations (Undo/Redo)
// ============================================

export async function addHistoryEntry(entry: Omit<HistoryEntry, 'id'>): Promise<number> {
  return db.history.add(entry as HistoryEntry);
}

export async function getRecentHistory(limit = 100): Promise<HistoryEntry[]> {
  return db.history.orderBy('timestamp').reverse().limit(limit).toArray();
}

export async function clearOldHistory(keepCount = 100): Promise<void> {
  const count = await db.history.count();
  if (count > keepCount) {
    const toDelete = await db.history
      .orderBy('timestamp')
      .limit(count - keepCount)
      .toArray();
    await db.history.bulkDelete(toDelete.map((h) => h.id!));
  }
}

// ============================================
// Database Utilities
// ============================================

export async function clearAllData(): Promise<void> {
  await db.transaction('rw', [db.portfolios, db.trades, db.settings, db.history], async () => {
    await db.portfolios.clear();
    await db.trades.clear();
    await db.settings.clear();
    await db.history.clear();
  });
}

export async function exportAllData(): Promise<{
  portfolios: Portfolio[];
  trades: Trade[];
  settings: Settings;
}> {
  const [portfolios, trades, settings] = await Promise.all([
    db.portfolios.toArray(),
    db.trades.toArray(),
    getSettings(),
  ]);

  return { portfolios, trades, settings };
}

export async function importData(data: {
  portfolios: Portfolio[];
  trades: Trade[];
  settings: Settings;
}): Promise<void> {
  await db.transaction('rw', [db.portfolios, db.trades, db.settings], async () => {
    await db.portfolios.clear();
    await db.trades.clear();

    if (data.portfolios.length > 0) {
      await db.portfolios.bulkAdd(data.portfolios);
    }
    if (data.trades.length > 0) {
      await db.trades.bulkAdd(data.trades);
    }
    await db.settings.put(data.settings);
  });
}
