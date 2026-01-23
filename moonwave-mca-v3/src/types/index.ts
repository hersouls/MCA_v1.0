// ============================================
// Moonwave MCA v3.0 - Type Definitions
// ============================================

// Portfolio Types
export interface Portfolio {
  id?: number;
  name: string;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
  params: PortfolioParams;
  memo?: string;
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
}

export interface SortOptions {
  field: 'name' | 'updatedAt' | 'executedAmount' | 'gap';
  direction: 'asc' | 'desc';
}
