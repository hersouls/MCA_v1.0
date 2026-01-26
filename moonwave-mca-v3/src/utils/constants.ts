// ============================================
// Application Constants
// ============================================

// Backup Configuration
export const BACKUP_CONFIG = {
  CURRENT_VERSION: '3.0.0',
  SUPPORTED_VERSIONS: ['3.0.0', '3.0'],
  APP_NAME: 'Moonwave MCA',
  FILE_PREFIX: 'MCA_Backup',
} as const;

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

// Default Values
export const DEFAULT_PORTFOLIO_PARAMS = {
  peakPrice: 100000,
  strength: 1.0,
  startDrop: 12,
  steps: 20,
  targetBudget: 10000000,
  legacyQty: 0,
  legacyAvg: 0,
} as const;

export const DEFAULT_NOTIFICATION_PREFERENCES = {
  gapWarning: true,
  backupReminder: true,
  gradeChange: true,
};

// Color Palette Definitions (Light Mode Only)
export interface PaletteDefinition {
  id: string;
  name: string;
  nameKo: string;
  colors: {
    primary: string;
    secondary: string;
  };
}

export const COLOR_PALETTES: Record<string, PaletteDefinition> = {
  default: {
    id: 'default',
    name: 'Mint',
    nameKo: '민트',
    colors: {
      primary: '#2EFFB4',
      secondary: '#00A86B',
    },
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean',
    nameKo: '오션',
    colors: {
      primary: '#3B82F6',
      secondary: '#1D4ED8',
    },
  },
  rose: {
    id: 'rose',
    name: 'Rose',
    nameKo: '로즈',
    colors: {
      primary: '#F472B6',
      secondary: '#DB2777',
    },
  },
  purple: {
    id: 'purple',
    name: 'Purple',
    nameKo: '퍼플',
    colors: {
      primary: '#A78BFA',
      secondary: '#7C3AED',
    },
  },
  forest: {
    id: 'forest',
    name: 'Forest',
    nameKo: '포레스트',
    colors: {
      primary: '#34D399',
      secondary: '#059669',
    },
  },
};

export const DEFAULT_SETTINGS = {
  id: 'main',
  theme: 'system' as const,
  colorPalette: 'default' as const,
  initialCash: 0,
  notificationsEnabled: false,
  notificationPreferences: DEFAULT_NOTIFICATION_PREFERENCES,
  isMusicPlayerEnabled: false,
};

// Chart Colors - Trendy & Sophisticated (Neon Mint / Jade Green)
export const CHART_COLORS = {
  light: {
    primary: '#00A86B', // Jade Green (차트 가시성)
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    text: '#030303', // Near Black
    grid: '#dbd9d4', // Off White border
  },
  dark: {
    primary: '#2EFFB4', // Neon Mint (다크 대비)
    success: '#4ade80',
    warning: '#fbbf24',
    danger: '#f87171',
    text: '#EDECE8', // Off White
    grid: '#262626',
  },
} as const;

// Gap Threshold
export const GAP_WARNING_THRESHOLD = 3;

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

// ============================================
// UI Design Tokens
// ============================================

/** Tailwind breakpoint values (px) */
export const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

/** Form state CSS variable references */
export const FORM_STATE_TOKENS = {
  default: {
    border: 'var(--border)',
    background: 'transparent',
    text: 'var(--foreground)',
    ring: 'var(--ring)',
  },
  success: {
    border: 'var(--input-success-border)',
    background: 'var(--input-success-bg)',
    text: 'var(--input-success-text)',
    ring: 'var(--input-success-ring)',
  },
  warning: {
    border: 'var(--input-warning-border)',
    background: 'var(--input-warning-bg)',
    text: 'var(--input-warning-text)',
    ring: 'var(--input-warning-ring)',
  },
  error: {
    border: 'var(--input-error-border)',
    background: 'var(--input-error-bg)',
    text: 'var(--input-error-text)',
    ring: 'var(--input-error-ring)',
  },
  disabled: {
    border: 'var(--input-disabled-border)',
    background: 'var(--input-disabled-bg)',
    text: 'var(--input-disabled-text)',
    ring: 'var(--ring)',
  },
} as const;
