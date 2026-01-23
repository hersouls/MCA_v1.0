// ============================================
// Analytics Service
// 로컬 사용 통계 및 패턴 분석
// ============================================

import type {
  DailyUsageStats,
  PortfolioUsageStats,
  FeatureUsageStats,
  UsageAnalytics,
} from '@/types';

// ============================================
// Storage Keys
// ============================================

const STORAGE_KEY = 'mca-analytics';
const SESSION_START_KEY = 'mca-session-start';

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

function getDefaultDailyStats(date: string): DailyUsageStats {
  return {
    date,
    appOpens: 0,
    portfolioViews: 0,
    tradesExecuted: 0,
    totalTimeSpent: 0,
  };
}

// ============================================
// Storage Operations
// ============================================

/**
 * 분석 데이터 로드
 */
export function loadAnalytics(): UsageAnalytics {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return createDefaultAnalytics();

    const parsed = JSON.parse(stored);

    // Map 복원
    const portfolioStats = new Map<number, PortfolioUsageStats>();
    if (parsed.portfolioStats) {
      Object.entries(parsed.portfolioStats).forEach(([key, value]) => {
        portfolioStats.set(Number(key), {
          ...value as PortfolioUsageStats,
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
export function saveAnalytics(analytics: UsageAnalytics): void {
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

    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (error) {
    console.error('Failed to save analytics:', error);
  }
}

// ============================================
// Session Management
// ============================================

/**
 * 세션 시작 기록
 */
export function startSession(): void {
  const now = Date.now();
  sessionStorage.setItem(SESSION_START_KEY, now.toString());

  // 앱 오픈 카운트 증가
  const analytics = loadAnalytics();
  const today = getTodayString();

  let todayStats = analytics.dailyStats.find((s) => s.date === today);
  if (!todayStats) {
    todayStats = getDefaultDailyStats(today);
    analytics.dailyStats.push(todayStats);
  }

  todayStats.appOpens++;
  analytics.lastUpdated = new Date();
  saveAnalytics(analytics);
}

/**
 * 세션 종료 시 시간 기록
 */
export function endSession(): void {
  const startTime = sessionStorage.getItem(SESSION_START_KEY);
  if (!startTime) return;

  const duration = Math.floor((Date.now() - Number(startTime)) / 1000); // 초 단위

  const analytics = loadAnalytics();
  const today = getTodayString();

  let todayStats = analytics.dailyStats.find((s) => s.date === today);
  if (!todayStats) {
    todayStats = getDefaultDailyStats(today);
    analytics.dailyStats.push(todayStats);
  }

  todayStats.totalTimeSpent += duration;
  analytics.lastUpdated = new Date();
  saveAnalytics(analytics);

  sessionStorage.removeItem(SESSION_START_KEY);
}

// ============================================
// Event Tracking
// ============================================

/**
 * 포트폴리오 조회 기록
 */
export function trackPortfolioView(portfolioId: number): void {
  const analytics = loadAnalytics();
  const today = getTodayString();

  // 일별 통계
  let todayStats = analytics.dailyStats.find((s) => s.date === today);
  if (!todayStats) {
    todayStats = getDefaultDailyStats(today);
    analytics.dailyStats.push(todayStats);
  }
  todayStats.portfolioViews++;

  // 포트폴리오별 통계
  let portfolioStats = analytics.portfolioStats.get(portfolioId);
  if (!portfolioStats) {
    portfolioStats = {
      portfolioId,
      viewCount: 0,
      lastViewed: new Date(),
      modificationCount: 0,
      executionRate: 0,
    };
    analytics.portfolioStats.set(portfolioId, portfolioStats);
  }
  portfolioStats.viewCount++;
  portfolioStats.lastViewed = new Date();

  analytics.lastUpdated = new Date();
  saveAnalytics(analytics);
}

/**
 * 거래 체결 기록
 */
export function trackTradeExecution(_portfolioId: number): void {
  // portfolioId reserved for future per-portfolio tracking
  void _portfolioId;

  const analytics = loadAnalytics();
  const today = getTodayString();

  let todayStats = analytics.dailyStats.find((s) => s.date === today);
  if (!todayStats) {
    todayStats = getDefaultDailyStats(today);
    analytics.dailyStats.push(todayStats);
  }
  todayStats.tradesExecuted++;

  analytics.lastUpdated = new Date();
  saveAnalytics(analytics);
}

/**
 * 포트폴리오 수정 기록
 */
export function trackPortfolioModification(portfolioId: number): void {
  const analytics = loadAnalytics();

  let portfolioStats = analytics.portfolioStats.get(portfolioId);
  if (!portfolioStats) {
    portfolioStats = {
      portfolioId,
      viewCount: 0,
      lastViewed: new Date(),
      modificationCount: 0,
      executionRate: 0,
    };
    analytics.portfolioStats.set(portfolioId, portfolioStats);
  }
  portfolioStats.modificationCount++;

  analytics.lastUpdated = new Date();
  saveAnalytics(analytics);
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

/**
 * 체결률 업데이트
 */
export function updateExecutionRate(_portfolioId: number, rate: number): void {
  const portfolioId = _portfolioId; // Use the parameter
  const analytics = loadAnalytics();

  let portfolioStats = analytics.portfolioStats.get(portfolioId);
  if (!portfolioStats) {
    portfolioStats = {
      portfolioId,
      viewCount: 0,
      lastViewed: new Date(),
      modificationCount: 0,
      executionRate: 0,
    };
    analytics.portfolioStats.set(portfolioId, portfolioStats);
  }
  portfolioStats.executionRate = rate;

  analytics.lastUpdated = new Date();
  saveAnalytics(analytics);
}

// ============================================
// Analysis & Insights
// ============================================

/**
 * 주간 통계 가져오기
 */
export function getWeeklyStats(): {
  appOpens: number;
  portfolioViews: number;
  tradesExecuted: number;
  totalTimeSpent: number;
  avgSessionTime: number;
} {
  const analytics = loadAnalytics();
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoStr = formatDateString(weekAgo);

  const weeklyStats = analytics.dailyStats.filter((s) => s.date >= weekAgoStr);

  const totals = weeklyStats.reduce(
    (acc, s) => ({
      appOpens: acc.appOpens + s.appOpens,
      portfolioViews: acc.portfolioViews + s.portfolioViews,
      tradesExecuted: acc.tradesExecuted + s.tradesExecuted,
      totalTimeSpent: acc.totalTimeSpent + s.totalTimeSpent,
    }),
    { appOpens: 0, portfolioViews: 0, tradesExecuted: 0, totalTimeSpent: 0 }
  );

  return {
    ...totals,
    avgSessionTime: totals.appOpens > 0 ? Math.round(totals.totalTimeSpent / totals.appOpens) : 0,
  };
}

/**
 * 가장 많이 본 포트폴리오 가져오기
 */
export function getMostViewedPortfolios(limit = 5): PortfolioUsageStats[] {
  const analytics = loadAnalytics();
  const sorted = Array.from(analytics.portfolioStats.values())
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, limit);

  return sorted;
}

/**
 * 가장 활발한 포트폴리오 (체결률 기준)
 */
export function getMostActivePortfolios(limit = 5): PortfolioUsageStats[] {
  const analytics = loadAnalytics();
  const sorted = Array.from(analytics.portfolioStats.values())
    .sort((a, b) => b.executionRate - a.executionRate)
    .slice(0, limit);

  return sorted;
}

/**
 * 기능 사용 순위
 */
export function getFeatureUsageRanking(): { feature: string; count: number }[] {
  const analytics = loadAnalytics();
  const ranking = Object.entries(analytics.featureUsage)
    .map(([feature, count]) => ({ feature, count }))
    .sort((a, b) => b.count - a.count);

  return ranking;
}

/**
 * 사용 패턴 분석 (시간대별)
 */
export function getUsagePatternByHour(): { hour: number; count: number }[] {
  // 간단한 시간대별 패턴 (현재 시간 기준)
  // 실제 구현 시 타임스탬프 기반으로 분석
  const hours = Array.from({ length: 24 }, (_, i) => ({ hour: i, count: 0 }));

  // 현재 시간에 가중치 부여 (예시)
  const currentHour = new Date().getHours();
  hours[currentHour].count = 1;

  return hours;
}

/**
 * 인사이트 생성
 */
export function generateInsights(): string[] {
  const insights: string[] = [];
  const weeklyStats = getWeeklyStats();

  // 앱 사용 빈도
  if (weeklyStats.appOpens >= 7) {
    insights.push('🏆 이번 주 매일 앱을 사용하셨네요! 꾸준한 투자 습관이 좋습니다.');
  } else if (weeklyStats.appOpens < 3) {
    insights.push('💡 정기적인 포트폴리오 점검을 권장합니다. 주 3회 이상 확인해보세요.');
  }

  // 체결 활동
  if (weeklyStats.tradesExecuted > 0) {
    insights.push(`📈 이번 주 ${weeklyStats.tradesExecuted}건의 체결이 있었습니다.`);
  }

  // 자주 보는 종목
  const mostViewed = getMostViewedPortfolios(1);
  if (mostViewed.length > 0 && mostViewed[0].viewCount > 10) {
    insights.push(`🔍 가장 자주 확인하는 종목이 있네요. (조회 ${mostViewed[0].viewCount}회)`);
  }

  // 기능 사용 권장
  const featureRanking = getFeatureUsageRanking();
  const unusedFeatures = featureRanking.filter((f) => f.count === 0);
  if (unusedFeatures.length > 0) {
    const featureNames: Record<string, string> = {
      pdfExport: 'PDF 리포트 내보내기',
      excelExport: 'Excel 내보내기',
      qrShare: 'QR 코드 공유',
      fundamentalGrade: 'Fundamental Grade 평가',
    };
    const suggestion = unusedFeatures.find((f) => featureNames[f.feature]);
    if (suggestion && featureNames[suggestion.feature]) {
      insights.push(`✨ ${featureNames[suggestion.feature]} 기능을 사용해보세요!`);
    }
  }

  return insights;
}

// ============================================
// Data Cleanup
// ============================================

/**
 * 오래된 데이터 정리 (90일 이상)
 */
export function cleanupOldData(daysToKeep = 90): void {
  const analytics = loadAnalytics();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
  const cutoffStr = formatDateString(cutoffDate);

  const originalCount = analytics.dailyStats.length;
  analytics.dailyStats = analytics.dailyStats.filter((s) => s.date >= cutoffStr);

  if (analytics.dailyStats.length < originalCount) {
    console.log(`Cleaned up ${originalCount - analytics.dailyStats.length} old analytics entries`);
    saveAnalytics(analytics);
  }
}

/**
 * 포트폴리오 삭제 시 통계 정리
 */
export function removePortfolioStats(portfolioId: number): void {
  const analytics = loadAnalytics();
  analytics.portfolioStats.delete(portfolioId);
  saveAnalytics(analytics);
}

/**
 * 모든 분석 데이터 초기화
 */
export function resetAnalytics(): void {
  localStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(SESSION_START_KEY);
}

// ============================================
// Utility Functions
// ============================================

function getTodayString(): string {
  return formatDateString(new Date());
}

function formatDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * 시간을 읽기 쉬운 형식으로 변환
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}초`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}분`;
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return mins > 0 ? `${hours}시간 ${mins}분` : `${hours}시간`;
}
