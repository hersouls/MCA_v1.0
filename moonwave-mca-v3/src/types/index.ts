// ============================================
// Moonwave MCA v3.0 - Type Definitions
// ============================================

export * from './ui';

// Portfolio Types
export interface Portfolio {
  id?: number;
  name: string;
  stockCode?: string;
  market?: string;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
  params: PortfolioParams;
  memo?: string;
  // Fundamental Grade 데이터
  fundamentalData?: FundamentalData;
  fundamentalScore?: number;
  fundamentalGrade?: FundamentalGrade;
}

// 기보유 주식 개별 항목
export interface LegacyHolding {
  qty: number;
  avg: number;
  memo?: string; // 예: "1차 매수", "물타기" 등
}

export interface PortfolioParams {
  peakPrice: number;
  strength: number;
  startDrop: number;
  steps: number;
  targetBudget: number;
  legacyQty: number; // 합산된 총 수량 (계산용)
  legacyAvg: number; // 가중평균 단가 (계산용)
  legacyHoldings?: LegacyHolding[]; // 개별 기보유 항목 (최대 3개)
  ma120Price?: number;
  targetMultiple?: number;
  manualTargetPrice?: number;
  // Step-level data
  executionDates?: Record<number, string>; // { step: 'YYYY-MM-DD' }
  stepMemos?: Record<number, string>; // { step: 'memo text' }
}

// Trade Types
export interface Trade {
  id?: number;
  portfolioId: number;
  step: number;
  status: TradeStatus;
  orderedAt?: Date;
  executedAt?: Date;
  price: number;
  quantity: number;
  amount: number;
  memo?: string;
}

export type TradeStatus = 'pending' | 'ordered' | 'executed';

// Calculated Trade Data (for display)
export interface CalculatedTrade {
  step: number;
  dropRate: number;
  buyPrice: number;
  quantity: number;
  amount: number;
  cumulativeQty: number;
  cumulativeAmt: number;
  avgPrice: number;
  gap: number;
  isOrdered: boolean;
  isExecuted: boolean;
  // Real cumulative values (executed steps only, including legacy)
  realQty: number; // 체결 구간까지의 누적 실제 수량
  realAmount: number; // 체결 구간까지의 누적 실제 금액
}

// Settings Types
export interface NotificationPreferences {
  gapWarning: boolean;       // 주문 갭 경고
  backupReminder: boolean;   // 백업 알림
  gradeChange: boolean;      // 등급 변경 알림
}

export interface Settings {
  id: string;
  theme: ThemeMode;
  colorPalette: ColorPalette;
  initialCash: number;
  notificationsEnabled: boolean;
  notificationPreferences: NotificationPreferences;
  isMusicPlayerEnabled: boolean;
  lastBackupDate?: Date;
}

export type ThemeMode = 'light' | 'dark' | 'system';
export type ColorPalette = 'default' | 'ocean' | 'rose' | 'purple' | 'forest';

// History Types (for Undo/Redo)
export interface HistoryEntry {
  id?: number;
  timestamp: Date;
  action: string;
  portfolioId?: number;
  previousState: string;
  newState: string;
}

export interface PortfolioStats {
  // Amounts
  executedAmount: number;
  orderedAmount: number;
  totalExecutedAmount: number;
  totalOrderedAmount: number;
  totalInvestment: number; // 기보유 + 체결금액 합계

  // Counts
  orderedStepsCount: number;
  executedStepsCount: number;
  lastExecutedStep: number;
  lastOrderedStep: number;

  // Shares & Price
  totalShares: number;
  averagePrice: number;

  // Gap & Status
  gap: number;
  hasGap: boolean;
  status: PortfolioStatus;
}

export type PortfolioStatus = 'normal' | 'gap-warning' | 'no-orders';

// Simulation Types
export interface SimulationResult {
  targetPrice: number;
  expectedROE: number;
  expectedProfit: number;
}

// V2 Migration Types (Legacy)
export interface V2Portfolio {
  id: number;
  name: string;
  isFavorite?: boolean;
  params: {
    peakPrice: string;
    strength: string;
    startDrop: string;
    steps: string;
    targetBudget: string;
    legacyQty: string;
    legacyAvg: string;
    ma120Price?: string;
    targetMultiple?: string;
    manualTargetPrice?: string;
  };
  orderedSteps: number[];
  executedSteps: number[];
  portfolioMemo?: string;
  stepMemos?: Record<number, string>;
  executionDates?: Record<number, string>;
}

export interface V2Data {
  portfolios: V2Portfolio[];
  activeId: number;
  initialCash: number;
}

// ============================================
// Fundamental Grade Types (Korea Tech-Value Mix 2026)
// ============================================

export type FundamentalGrade = 'S' | 'A' | 'B' | 'C' | 'D'; // S등급 추가

// New Qualitative Types
export type GlobalScalability = 'high_growth' | 'expanding' | 'domestic_regulated';
export type MarketDominance = 'monopoly_top' | 'oligopoly_top3' | 'competitive';
export type FutureInvestment = 'high' | 'maintain' | 'decreasing';
export type TotalShareholderReturn = 'active_growth' | 'high_yield' | 'minimum' | 'none';
export type GovernanceRisk = 'clean' | 'shareholder_friendly' | 'defense_doubt';

export interface FundamentalInput {
  // Category 1: Valuation (35 pts)
  per: number | null;
  pbr: number | null;
  isDualListed: boolean; // 지주사/중복상장 여부 (단독=5, 비핵심=3, 핵심중복=0) -> 로직에서 처리

  // Category 2: Global Growth & Moat (40 pts)
  globalScalability: GlobalScalability | null; // 글로벌 확장성 (20)
  marketDominance: MarketDominance | null; // 시장 지배력 (10)
  futureInvestment: FutureInvestment | null; // 미래 투자 효율 (10)

  // Category 3: Shareholder Return & Risk (25 pts)
  dividendYield: number | null; // 배당수익률 (참조용, TSR 로직에 포함될 수 있음)
  totalShareholderReturn: TotalShareholderReturn | null; // 주주환원 의지 (15)
  governanceRisk: GovernanceRisk | null; // 거버넌스 리스크 (10)
}

export interface FundamentalScores {
  // Valuation
  per: number;
  pbr: number;
  dualListing: number;

  // Growth
  globalScalability: number;
  marketDominance: number;
  futureInvestment: number;

  // Shareholder Return
  totalShareholderReturn: number;
  governanceRisk: number;
}

export interface FundamentalCategoryScores {
  valuation: number;        // Max 35
  growthMoat: number;       // Max 40
  shareholderReturn: number;// Max 25
}

export interface FundamentalResult {
  scores: FundamentalScores;
  categoryScores: FundamentalCategoryScores;
  totalScore: number;
  grade: FundamentalGrade;
  gradeLabel: string;
  gradeColor: string;
  actionGuideline: string;
}

// Gemini Gem에서 받는 데이터 형식
// Gemini Gem에서 받는 데이터 형식 (Legacy Mapping or Direct)
export interface GeminiGemData {
  // 가치평가 (API에 없는 항목)
  earningsSustainability: boolean; // 이익 지속성
  isDualListed: boolean; // 중복 상장 여부

  // 주주환원 (API에 없는 항목)
  hasQuarterlyDividend: boolean; // 분기 배당
  consecutiveDividendYears: number; // 연속 배당 년수
  hasBuybackProgram: boolean; // 자사주 매입 프로그램
  annualCancellationRate: number; // 연간 소각률 (%)
  treasuryStockRatio: number; // 자사주 비율 (%)

  // 성장/경영 (Mapped to new types)
  globalScalability: GlobalScalability; // 성장 잠재력 -> 글로벌 확장성
  marketDominance: MarketDominance; // 시장 지배력
  futureInvestment: FutureInvestment; // 미래 투자
  governanceRisk: GovernanceRisk; // 경영진 평가 -> 거버넌스 리스크
}

export interface FundamentalData extends FundamentalInput {
  dataSource: 'manual' | 'krx' | 'template' | 'clipboard' | 'api' | 'mixed';
  lastUpdated: Date;
  notes?: string;
  gemData?: GeminiGemData; // Gem 데이터 별도 저장
}

// ============================================
// Clipboard & Parsing Types
// ============================================

export interface ParsedFinancialData {
  per?: number;
  pbr?: number;
  dividendYield?: number;
  treasuryStockRatio?: number;
  stockCode?: string;
  stockName?: string;
  currentPrice?: number;
  marketCap?: number;
}

export interface ClipboardParseResult {
  success: boolean;
  data: ParsedFinancialData;
  source: 'naver' | 'companyguide' | 'dart' | 'text' | 'json' | 'unknown';
  rawText: string;
}

// ============================================
// Share & Export Types
// ============================================

export interface ShareData {
  type: 'portfolio' | 'settings' | 'trade-list' | 'fundamental';
  title: string;
  text: string;
  url?: string;
  files?: File[];
}

export interface QRCodeData {
  type: 'portfolio' | 'settings' | 'deeplink';
  payload: string;
  compressed: boolean;
  chunks?: number;
  chunkIndex?: number;
}

export interface DeepLinkParams {
  name?: string;
  peakPrice?: number;
  strength?: number;
  startDrop?: number;
  steps?: number;
  targetBudget?: number;
}

// ============================================
// Analytics & Statistics Types
// ============================================

export interface DailyUsageStats {
  date: string;
  appOpens: number;
  portfolioViews: number;
  tradesExecuted: number;
  totalTimeSpent: number; // seconds
}

export interface PortfolioUsageStats {
  portfolioId: number;
  viewCount: number;
  lastViewed: Date;
  modificationCount: number;
  executionRate: number;
}

export interface FeatureUsageStats {
  autoFit: number;
  export: number;
  share: number;
  chartView: number;
  fundamentalGrade: number;
  qrShare: number;
  pdfExport: number;
  excelExport: number;
}

export interface UsageAnalytics {
  dailyStats: DailyUsageStats[];
  portfolioStats: Map<number, PortfolioUsageStats>;
  featureUsage: FeatureUsageStats;
  lastUpdated: Date;
}

// ============================================
// Broadcast Channel Types
// ============================================

export type BroadcastEventType =
  | 'portfolio-created'
  | 'portfolio-updated'
  | 'portfolio-deleted'
  | 'trade-toggled'
  | 'settings-changed'
  | 'theme-changed'
  | 'sync-request'
  | 'sync-response';

export interface BroadcastMessage {
  type: BroadcastEventType;
  payload: unknown;
  timestamp: number;
  tabId: string;
}

// ============================================
// Notification Types
// ============================================

export interface AppNotification {
  id: string;
  type: 'gap-warning' | 'backup-reminder' | 'price-alert' | 'grade-change';
  title: string;
  message: string;
  portfolioId?: number;
  createdAt: Date;
  read: boolean;
}

// ============================================
// PDF/Excel Export Types
// ============================================

export interface PDFReportOptions {
  includeChart: boolean;
  includeTradeList: boolean;
  includeFundamental: boolean;
  includeSimulation: boolean;
  pageSize: 'A4' | 'Letter';
  orientation: 'portrait' | 'landscape';
}

export interface ExcelExportOptions {
  includeAllSheets: boolean;
  sheets: ('summary' | 'trades' | 'history' | 'analysis')[];
  dateFormat: string;
  currencyFormat: string;
}

// ============================================
// Stock API Types
// ============================================

export interface StockFundamentalData {
  ticker: string;
  name: string;
  market: 'KOSPI' | 'KOSDAQ';
  per: number | null;
  pbr: number | null;
  dividendYield: number | null;
  eps: number | null;
  bps: number | null;
  dps: number | null;
  currentPrice: number | null;
  marketCap: number | null;
  fetchedAt: string;
}

// ============================================
// Backup/Restore Types
// ============================================

export interface BackupFile {
  version: string;
  appName: string;
  exportDate: string;
  data: {
    portfolios: Portfolio[];
    trades: Trade[];
    settings: Settings;
  };
}

export interface BackupValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  metadata?: {
    version: string;
    exportDate: string;
    portfolioCount: number;
    tradeCount: number;
  };
}
