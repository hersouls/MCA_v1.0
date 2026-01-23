// ============================================
// Moonwave MCA v3.0 - Type Definitions
// ============================================

// Portfolio Types
export interface Portfolio {
  id?: number;
  name: string;
  stockCode?: string;
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

export interface PortfolioParams {
  peakPrice: number;
  strength: number;
  startDrop: number;
  steps: number;
  targetBudget: number;
  legacyQty: number;
  legacyAvg: number;
  ma120Price?: number;
  targetMultiple?: number;
  manualTargetPrice?: number;
  // Step-level data
  executionDates?: Record<number, string>;  // { step: 'YYYY-MM-DD' }
  stepMemos?: Record<number, string>;       // { step: 'memo text' }
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
  realQty: number;      // 체결 구간까지의 누적 실제 수량
  realAmount: number;   // 체결 구간까지의 누적 실제 금액
}

// Settings Types
export interface Settings {
  id: string;
  theme: ThemeMode;
  initialCash: number;
  notificationsEnabled: boolean;
  lastBackupDate?: Date;
}

export type ThemeMode = 'light' | 'dark' | 'system';

// History Types (for Undo/Redo)
export interface HistoryEntry {
  id?: number;
  timestamp: Date;
  action: string;
  portfolioId?: number;
  previousState: string;
  newState: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalExecutedAmount: number;
  totalOrderedAmount: number;
  remainingCash: number;
  burnRate: number;
  alertCount: number;
}

export interface PortfolioStats {
  // Amounts
  executedAmount: number;
  orderedAmount: number;
  totalExecutedAmount: number;
  totalOrderedAmount: number;

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

// Export/Import Types
export interface ExportData {
  version: string;
  exportDate: string;
  appName: string;
  portfolios: Portfolio[];
  trades: Trade[];
  settings: Settings;
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

// UI State Types
export interface UIState {
  view: 'dashboard' | 'detail';
  activePortfolioId: number | null;
  isLoading: boolean;
  toastMessage: string | null;
  toastType: 'success' | 'error' | 'info' | 'warning';
}

// Filter & Sort Types
export interface FilterOptions {
  favorites: boolean;
  status: PortfolioStatus | 'all';
  grade?: FundamentalGrade | 'all';
}

export interface SortOptions {
  field: 'name' | 'updatedAt' | 'executedAmount' | 'gap' | 'fundamentalScore';
  direction: 'asc' | 'desc';
}

// ============================================
// Fundamental Grade Types
// ============================================

export type FundamentalGrade = 'A' | 'B' | 'C' | 'D';
export type GrowthPotential = 'very_high' | 'high' | 'normal' | 'low';
export type ManagementQuality = 'excellent' | 'professional' | 'owner_risk';

export interface FundamentalInput {
  // 카테고리 I: 밸류에이션 (35점)
  per: number | null;                    // PER 배수
  pbr: number | null;                    // PBR 배수
  earningsSustainability: boolean;       // 이익 지속성 (5년 연속 흑자)
  isDualListed: boolean;                 // 중복 상장 여부

  // 카테고리 II: 주주환원 (40점)
  dividendYield: number | null;          // 배당수익률 (%)
  hasQuarterlyDividend: boolean;         // 분기 배당 실시
  consecutiveDividendYears: number;      // 배당 연속 인상 연수
  hasBuybackProgram: boolean;            // 자사주 매입/소각 실시
  annualCancellationRate: number;        // 연간 소각 비율 (%)
  treasuryStockRatio: number;            // 자사주 보유 비율 (%)

  // 카테고리 III: 성장/경영 (25점)
  growthPotential: GrowthPotential;      // 성장 잠재력
  managementQuality: ManagementQuality;  // 경영진 평가
  hasGlobalBrand: boolean;               // 글로벌 브랜드 보유
}

export interface FundamentalScores {
  per: number;                    // 0-20
  pbr: number;                    // 0-5
  earningsSustainability: number; // 0-5
  dualListing: number;            // 0-5
  dividendYield: number;          // 0-10
  quarterlyDividend: number;      // 0-5
  consecutiveDividend: number;    // 0-5
  buybackProgram: number;         // 0-7
  cancellationRate: number;       // 0-8
  treasuryStockRatio: number;     // 0-5
  growthPotential: number;        // 0-10
  management: number;             // 0-10
  globalBrand: number;            // 0-5
}

export interface FundamentalCategoryScores {
  valuation: number;              // 0-35
  shareholderReturn: number;      // 0-40
  growthManagement: number;       // 0-25
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

export interface FundamentalData extends FundamentalInput {
  dataSource: 'manual' | 'krx' | 'template' | 'clipboard' | 'api';
  lastUpdated: Date;
  notes?: string;
}

// Extended Portfolio with Fundamental Grade
export interface PortfolioWithGrade extends Portfolio {
  stockCode?: string;
  fundamentalData?: FundamentalData;
  fundamentalScore?: number;
  fundamentalGrade?: FundamentalGrade;
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
// Price History Types
// ============================================

export interface PriceEntry {
  id?: number;
  portfolioId: number;
  stockCode?: string;
  date: string;           // YYYY-MM-DD
  price: number;
  source: 'manual' | 'clipboard' | 'import';
  createdAt: Date;
}

export interface PriceHistory {
  entries: PriceEntry[];
  high52Week?: number;
  low52Week?: number;
  currentPrice?: number;
  trend: 'up' | 'down' | 'flat';
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
// Stock Template Types
// ============================================

export interface StockTemplate {
  id?: number;
  code: string;
  name: string;
  lastUpdated: Date;
  fundamentalData: Partial<FundamentalInput>;
  sector?: string;
  marketCap?: number;
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

export interface StockSearchResult {
  ticker: string;
  name: string;
  market: 'KOSPI' | 'KOSDAQ';
}

export interface StockSearchResponse {
  query: string;
  count: number;
  results: StockSearchResult[];
}
