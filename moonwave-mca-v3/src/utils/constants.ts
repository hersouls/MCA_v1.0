// ============================================
// Application Constants
// ============================================

// App Info
export const APP_NAME = 'Moonwave MCA';
export const APP_VERSION = '3.0.0';

// Storage Keys
export const STORAGE_KEYS = {
  // Core
  V2_DATA: 'Moonwave_MCA_v12_Data',
  V3_MIGRATED: 'MCA_V3_MIGRATED',
  THEME: 'mca-theme',
  // Services
  BROADCAST_MESSAGE: 'mca-broadcast-message',
  ANALYTICS: 'mca-analytics',
  SESSION_START: 'mca-session-start',
  // v2 호환용
  DARK_MODE: 'darkMode',
} as const;

// Database
export const DB_NAME = 'MoonwaveMCA_v3';
export const DB_VERSION = 2;

// Default Values
export const DEFAULT_PORTFOLIO_PARAMS = {
  peakPrice: 100000,
  strength: 1.0,
  startDrop: 10,
  steps: 20,
  targetBudget: 10000000,
  legacyQty: 0,
  legacyAvg: 0,
} as const;

export const DEFAULT_SETTINGS = {
  id: 'main',
  theme: 'system' as const,
  initialCash: 0,
  notificationsEnabled: false,
};

// Chart Colors - Trendy & Sophisticated (Neon Mint / Jade Green)
export const CHART_COLORS = {
  light: {
    primary: '#00A86B',    // Jade Green (차트 가시성)
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    text: '#030303',       // Near Black
    grid: '#dbd9d4',       // Off White border
  },
  dark: {
    primary: '#2EFFB4',    // Neon Mint (다크 대비)
    success: '#4ade80',
    warning: '#fbbf24',
    danger: '#f87171',
    text: '#EDECE8',       // Off White
    grid: '#262626',
  },
} as const;

// Status Colors
export const STATUS_COLORS = {
  executed: {
    bg: 'bg-success-500',
    text: 'text-success-foreground',
    border: 'border-success-500',
  },
  ordered: {
    bg: 'bg-warning-500',
    text: 'text-warning-foreground',
    border: 'border-warning-500',
  },
  pending: {
    bg: 'bg-zinc-200 dark:bg-zinc-700',
    text: 'text-zinc-600 dark:text-zinc-400',
    border: 'border-zinc-300 dark:border-zinc-600',
  },
} as const;

// Portfolio Status Colors
// Icons: Use Lucide icon names (CheckCircle2, AlertTriangle, Circle)
export const PORTFOLIO_STATUS_COLORS = {
  normal: {
    badge: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400',
    border: 'border-success-200 dark:border-success-800',
    iconName: 'CheckCircle2' as const,
    iconColor: 'text-success-500',
    label: '정상 운용',
  },
  'gap-warning': {
    badge: 'bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400',
    border: 'border-danger-200 dark:border-danger-800',
    iconName: 'AlertTriangle' as const,
    iconColor: 'text-danger-500',
    label: '추가 주문 필요',
  },
  'no-orders': {
    badge: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
    border: 'border-zinc-200 dark:border-zinc-700',
    iconName: 'Circle' as const,
    iconColor: 'text-zinc-400',
    label: '주문 없음',
  },
} as const;

// Gap Threshold
export const GAP_WARNING_THRESHOLD = 3;

// Max History Entries (for Undo/Redo)
export const MAX_HISTORY_ENTRIES = 100;

// Keyboard Shortcuts
export const KEYBOARD_SHORTCUTS = {
  NEW_PORTFOLIO: { key: 'n', modifiers: ['ctrl'] },
  SAVE: { key: 's', modifiers: ['ctrl'] },
  EXPORT: { key: 'e', modifiers: ['ctrl'] },
  UNDO: { key: 'z', modifiers: ['ctrl'] },
  REDO: { key: 'z', modifiers: ['ctrl', 'shift'] },
  DASHBOARD: { key: 'd', modifiers: ['ctrl'] },
  SEARCH: { key: '/', modifiers: [] },
  CLOSE: { key: 'Escape', modifiers: [] },
} as const;

// Chart Configuration
export const CHART_CONFIG = {
  // 기본 크기
  DEFAULT_HEIGHT: 300,

  // 포인트 스타일
  POINT_RADIUS: 0,
  POINT_HOVER_RADIUS: 6,
  EXECUTED_POINT_RADIUS: 6,
  BORDER_WIDTH: 2.5,
  POINT_BORDER_WIDTH: 2,

  // 데이터 라벨
  DATA_LABEL: {
    PADDING: { top: 4, bottom: 4, left: 6, right: 6 },
    BORDER_RADIUS: 4,
    FONT_SIZE: 11,
    FONT_WEIGHT: 'bold' as const,
    OFFSET: 4,
  },

  // 레전드 & 툴팁
  LEGEND_PADDING: 16,
  TOOLTIP_PADDING: 12,

  // X축
  X_AXIS_MAX_ROTATION: 0,
  LABEL_SKIP_THRESHOLD: 10,

  // 배경 알파값
  BACKGROUND_ALPHA: {
    LIGHT: 0.05,
    DARK: 0.1,
  },
} as const;

// Fundamental Grade Configuration
export const FUNDAMENTAL_GRADE_CONFIG = {
  // Grade 임계값
  GRADES: {
    A: { min: 81, label: '적극 매수', color: '#22c55e' },
    B: { min: 70, label: '매수 고려', color: '#2EFFB4' },
    C: { min: 50, label: '신중 진입', color: '#f59e0b' },
    D: { min: 0, label: '매수 금지', color: '#ef4444' },
  },

  // 카테고리별 최대 점수
  CATEGORY_MAX: {
    VALUATION: 35,
    SHAREHOLDER_RETURN: 40,
    GROWTH_MANAGEMENT: 25,
  },

  // 개별 항목 최대 점수
  SCORE_MAX: {
    PER: 20,
    PBR: 5,
    EARNINGS_SUSTAINABILITY: 5,
    DUAL_LISTING: 5,
    DIVIDEND_YIELD: 10,
    QUARTERLY_DIVIDEND: 5,
    CONSECUTIVE_DIVIDEND: 5,
    BUYBACK_PROGRAM: 7,
    CANCELLATION_RATE: 8,
    TREASURY_STOCK: 5,
    GROWTH_POTENTIAL: 10,
    MANAGEMENT: 10,
    GLOBAL_BRAND: 5,
  },

  // 성장 잠재력 점수
  GROWTH_SCORES: {
    very_high: 10,
    high: 7,
    normal: 5,
    low: 3,
  } as Record<string, number>,

  // 경영진 품질 점수
  MANAGEMENT_SCORES: {
    excellent: 10,
    professional: 5,
    owner_risk: 0,
  } as Record<string, number>,

  // 총점
  TOTAL_MAX: 100,
} as const;

// Golden Ratio Design Constants (φ = 1.618)
export const GOLDEN_RATIO = 1.618;

export const GOLDEN_LAYOUT = {
  MAIN: 61.8,
  SIDE: 38.2,
} as const;

export const GOLDEN_TYPOGRAPHY = {
  BASE: 16,    // 16px - base
  LG: 26,      // 26px - 16 × 1.618
  XL: 42,      // 42px - 26 × 1.618
  XXL: 68,     // 68px - 42 × 1.618
  SCALE: 1.618,
} as const;

export const GOLDEN_SPACING = {
  XS: 6,       // ~6px - base / φ²
  SM: 10,      // ~10px - base / φ
  MD: 16,      // 16px - base
  LG: 26,      // ~26px - base × φ
  XL: 42,      // ~42px - base × φ²
} as const;
