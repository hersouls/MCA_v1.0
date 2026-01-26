// ============================================
// Analytics Service
// 로컬 사용 통계 및 패턴 분석
// ============================================

import type { FeatureUsageStats, PortfolioUsageStats, UsageAnalytics } from '@/types';
import { STORAGE_KEYS } from '@/utils/constants';

// ============================================
// Default Values
// ============================================

function createDefaultAnalytics(): UsageAnalytics {
  return {
    dailyStats: [],
    portfolioStats: new Map(),
    featureUsage: {
      autoFit: 0,
      export: 0,
      share: 0,
      chartView: 0,
      fundamentalGrade: 0,
      qrShare: 0,
      pdfExport: 0,
      excelExport: 0,
    },
    lastUpdated: new Date(),
  };
}

// ============================================
// Storage Operations
// ============================================

/**
 * 분석 데이터 로드
 */
function loadAnalytics(): UsageAnalytics {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
    if (!stored) return createDefaultAnalytics();

    const parsed = JSON.parse(stored);

    // Map 복원
    const portfolioStats = new Map<number, PortfolioUsageStats>();
    if (parsed.portfolioStats) {
      Object.entries(parsed.portfolioStats).forEach(([key, value]) => {
        portfolioStats.set(Number(key), {
          ...(value as PortfolioUsageStats),
          lastViewed: new Date((value as PortfolioUsageStats).lastViewed),
        });
      });
    }

    return {
      dailyStats: parsed.dailyStats || [],
      portfolioStats,
      featureUsage: parsed.featureUsage || createDefaultAnalytics().featureUsage,
      lastUpdated: new Date(parsed.lastUpdated),
    };
  } catch (error) {
    console.error('Failed to load analytics:', error);
    return createDefaultAnalytics();
  }
}

/**
 * 분석 데이터 저장
 */
function saveAnalytics(analytics: UsageAnalytics): void {
  try {
    // Map을 객체로 변환
    const portfolioStatsObj: Record<number, PortfolioUsageStats> = {};
    analytics.portfolioStats.forEach((value, key) => {
      portfolioStatsObj[key] = value;
    });

    const toSave = {
      dailyStats: analytics.dailyStats,
      portfolioStats: portfolioStatsObj,
      featureUsage: analytics.featureUsage,
      lastUpdated: analytics.lastUpdated.toISOString(),
    };

    localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(toSave));
  } catch (error) {
    console.error('Failed to save analytics:', error);
  }
}

/**
 * 기능 사용 기록
 */
export function trackFeatureUsage(feature: keyof FeatureUsageStats): void {
  const analytics = loadAnalytics();
  analytics.featureUsage[feature]++;
  analytics.lastUpdated = new Date();
  saveAnalytics(analytics);
}
