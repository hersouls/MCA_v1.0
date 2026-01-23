// ============================================
// MCA Calculation Engine
// ============================================

import type {
  PortfolioParams,
  CalculatedTrade,
  PortfolioStats,
  PortfolioStatus,
  SimulationResult,
} from '@/types';
import { calculateBuyPrice, calculateQuantity } from '@/utils/tick';
import { GAP_WARNING_THRESHOLD } from '@/utils/constants';

/**
 * Calculate all trades for a portfolio
 */
export function calculateTrades(
  params: PortfolioParams,
  orderedSteps: number[],
  executedSteps: number[]
): CalculatedTrade[] {
  const { peakPrice, strength, startDrop, steps, legacyQty, legacyAvg } = params;

  const trades: CalculatedTrade[] = [];
  let cumulativeQty = legacyQty;
  let cumulativeAmt = legacyQty * legacyAvg;

  for (let i = 1; i <= steps; i++) {
    const dropRate = startDrop + (i - 1);
    const buyPrice = calculateBuyPrice(peakPrice, dropRate);
    const quantity = calculateQuantity(strength, i);
    const amount = buyPrice * quantity;

    const isOrdered = orderedSteps.includes(i);
    const isExecuted = executedSteps.includes(i);

    // Only add to cumulative if executed
    if (isExecuted) {
      cumulativeQty += quantity;
      cumulativeAmt += amount;
    }

    const avgPrice = cumulativeQty > 0 ? Math.round(cumulativeAmt / cumulativeQty) : 0;
    const gap = avgPrice > 0 ? ((buyPrice - avgPrice) / avgPrice) * 100 : 0;

    trades.push({
      step: i,
      dropRate,
      buyPrice,
      quantity,
      amount,
      cumulativeQty,
      cumulativeAmt,
      avgPrice,
      gap,
      isOrdered,
      isExecuted,
    });
  }

  return trades;
}

/**
 * Calculate portfolio statistics
 */
export function calculatePortfolioStats(
  params: PortfolioParams,
  orderedSteps: number[],
  executedSteps: number[]
): PortfolioStats {
  const { peakPrice, strength, startDrop, steps, legacyQty, legacyAvg } = params;

  let executedAmount = 0;
  let orderedAmount = 0;
  let totalShares = legacyQty;
  let totalAmount = legacyQty * legacyAvg;
  let lastExecutedStep = 0;
  let lastOrderedStep = 0;

  for (let i = 1; i <= steps; i++) {
    const dropRate = startDrop + (i - 1);
    const buyPrice = calculateBuyPrice(peakPrice, dropRate);
    const quantity = calculateQuantity(strength, i);
    const amount = buyPrice * quantity;

    if (executedSteps.includes(i)) {
      executedAmount += amount;
      totalShares += quantity;
      totalAmount += amount;
      lastExecutedStep = Math.max(lastExecutedStep, i);
    } else if (orderedSteps.includes(i)) {
      orderedAmount += amount;
    }

    if (orderedSteps.includes(i)) {
      lastOrderedStep = Math.max(lastOrderedStep, i);
    }
  }

  const gap = lastOrderedStep - lastExecutedStep;
  const hasGap = gap > GAP_WARNING_THRESHOLD;
  let status: PortfolioStatus = 'normal';

  if (lastOrderedStep === 0) {
    status = 'no-orders';
  } else if (hasGap) {
    status = 'gap-warning';
  }

  const averagePrice = totalShares > 0 ? Math.round(totalAmount / totalShares) : 0;

  return {
    executedAmount,
    orderedAmount,
    totalExecutedAmount: executedAmount,
    totalOrderedAmount: orderedAmount,
    orderedStepsCount: orderedSteps.length,
    executedStepsCount: executedSteps.length,
    totalShares,
    averagePrice,
    lastExecutedStep,
    lastOrderedStep,
    gap,
    hasGap,
    status,
  };
}

/**
 * Calculate simulation result for target price
 */
export function calculateSimulation(
  currentAmount: number,
  currentQty: number,
  targetPrice: number
): SimulationResult {
  if (currentQty === 0 || targetPrice === 0) {
    return {
      targetPrice: 0,
      expectedROE: 0,
      expectedProfit: 0,
    };
  }

  const expectedValue = targetPrice * currentQty;
  const expectedProfit = expectedValue - currentAmount;
  const expectedROE = (expectedProfit / currentAmount) * 100;

  return {
    targetPrice,
    expectedROE,
    expectedProfit,
  };
}

/**
 * Auto-calculate target price from MA120 and multiple
 */
export function calculateAutoTargetPrice(
  ma120Price: number | undefined,
  targetMultiple: number | undefined
): number | undefined {
  if (!ma120Price || !targetMultiple) return undefined;
  return Math.round(ma120Price * targetMultiple);
}

/**
 * Auto-fit parameters to match target budget
 * Uses binary search to find optimal strength
 */
export function autoFitParams(
  peakPrice: number,
  startDrop: number,
  steps: number,
  targetBudget: number
): { strength: number; steps: number } {
  const simulate = (s: number, st: number, sd: number): number => {
    let sum = 0;
    for (let i = 1; i <= s; i++) {
      const dropRate = sd + (i - 1);
      const buyPrice = calculateBuyPrice(peakPrice, dropRate);
      const quantity = calculateQuantity(st, i);
      sum += buyPrice * quantity;
    }
    return sum;
  };

  // Binary search for optimal strength
  let low = 0.01;
  let high = 50.0;
  let bestStrength = 1.0;
  let currentSteps = steps;

  for (let iter = 0; iter < 30; iter++) {
    const mid = (low + high) / 2;
    const simTotal = simulate(currentSteps, mid, startDrop);

    if (simTotal > targetBudget) {
      high = mid;
    } else {
      low = mid;
    }
    bestStrength = mid;
  }

  // If strength is too low, reduce steps
  if (bestStrength < 0.5) {
    bestStrength = 0.5;
    for (let s = currentSteps; s >= 1; s--) {
      if (simulate(s, bestStrength, startDrop) <= targetBudget * 1.1) {
        currentSteps = s;
        break;
      }
    }
  }

  return {
    strength: Math.round(bestStrength * 100) / 100,
    steps: currentSteps,
  };
}

/**
 * Get current invested amount and quantity from calculated trades
 */
export function getCurrentInvestment(trades: CalculatedTrade[]): {
  amount: number;
  quantity: number;
  avgPrice: number;
} {
  const executedTrades = trades.filter((t) => t.isExecuted);
  if (executedTrades.length === 0) {
    return { amount: 0, quantity: 0, avgPrice: 0 };
  }

  const lastExecuted = executedTrades[executedTrades.length - 1];
  return {
    amount: lastExecuted.cumulativeAmt,
    quantity: lastExecuted.cumulativeQty,
    avgPrice: lastExecuted.avgPrice,
  };
}

/**
 * Calculate total budget required for all steps
 */
export function calculateTotalBudget(params: PortfolioParams): number {
  const { peakPrice, strength, startDrop, steps } = params;
  let total = 0;

  for (let i = 1; i <= steps; i++) {
    const dropRate = startDrop + (i - 1);
    const buyPrice = calculateBuyPrice(peakPrice, dropRate);
    const quantity = calculateQuantity(strength, i);
    total += buyPrice * quantity;
  }

  return total;
}

/**
 * Calculate progress percentage
 */
export function calculateProgress(
  executedSteps: number[],
  totalSteps: number
): number {
  if (totalSteps === 0) return 0;
  return (executedSteps.length / totalSteps) * 100;
}
