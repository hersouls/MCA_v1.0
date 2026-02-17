// ============================================
// Portfolio Health Score Service
// 포트폴리오 건강도 스코어 계산
// ============================================

import type { Portfolio, PortfolioStats } from '@/types';

export interface HealthScore {
  total: number;
  gapScore: number;
  budgetScore: number;
  progressScore: number;
  fundamentalScore: number;
  label: 'good' | 'caution' | 'warning';
}

/**
 * Calculate a health score (0-100) for a portfolio.
 *
 * Components:
 * - Gap (30pts): no gap = 30, has gap = 0
 * - Budget (25pts): proportional to budget remaining (over-budget = 0)
 * - Progress (20pts): proportional to execution rate
 * - Fundamental (25pts): maps fundamentalScore (0-100) to 0-25 (default 50 if unset)
 */
export function calculateHealthScore(
  portfolio: Portfolio,
  stats: PortfolioStats
): HealthScore {
  // Gap score (30 pts)
  const gapScore = stats.hasGap ? 0 : 30;

  // Budget score (25 pts) — based on how much budget is used
  const targetBudget = portfolio.params.targetBudget;
  const totalUsed = stats.totalInvestment + stats.orderedAmount;
  let budgetScore: number;
  if (targetBudget <= 0) {
    budgetScore = 12; // neutral
  } else {
    const usageRate = totalUsed / targetBudget;
    if (usageRate > 1) {
      budgetScore = 0; // over budget
    } else if (usageRate >= 0.2 && usageRate <= 0.8) {
      budgetScore = 25; // healthy range
    } else {
      budgetScore = Math.round(usageRate <= 0.2
        ? usageRate * 5 * 25 // 0-20% → 0-25
        : (1 - (usageRate - 0.8) / 0.2) * 25 // 80-100% → 25-0
      );
    }
  }

  // Progress score (20 pts)
  const steps = portfolio.params.steps;
  const progressScore = steps > 0
    ? Math.round((stats.executedStepsCount / steps) * 20)
    : 5;

  // Fundamental score (25 pts) — maps 0-100 to 0-25, default 50 if unset
  const rawFundamental = portfolio.fundamentalScore ?? 50;
  const fundamentalScore = Math.round((rawFundamental / 100) * 25);

  const total = Math.min(100, gapScore + budgetScore + progressScore + fundamentalScore);
  const label: HealthScore['label'] = total >= 70 ? 'good' : total >= 40 ? 'caution' : 'warning';

  return { total, gapScore, budgetScore, progressScore, fundamentalScore, label };
}
