// ============================================
// Application Constants
// ============================================

// App Info
export const APP_NAME = 'Moonwave MCA';
export const APP_VERSION = '3.0.0';

// Storage Keys
export const STORAGE_KEYS = {
  V2_DATA: 'Moonwave_MCA_v12_Data',
  V3_MIGRATED: 'MCA_V3_MIGRATED',
  THEME: 'mca-theme',
} as const;

// Database
export const DB_NAME = 'MoonwaveMCA_v3';
export const DB_VERSION = 1;

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

// Chart Colors (for both light and dark mode)
export const CHART_COLORS = {
  light: {
    primary: '#2563eb',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    text: '#0f172a',
    grid: '#e2e8f0',
  },
  dark: {
    primary: '#3b82f6',
    success: '#16a34a',
    warning: '#d97706',
    danger: '#dc2626',
    text: '#fafafa',
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
export const PORTFOLIO_STATUS_COLORS = {
  normal: {
    badge: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400',
    border: 'border-success-200 dark:border-success-800',
    icon: '🟢',
    label: '정상 운용',
  },
  'gap-warning': {
    badge: 'bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400',
    border: 'border-danger-200 dark:border-danger-800',
    icon: '🚨',
    label: '추가 주문 필요',
  },
  'no-orders': {
    badge: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
    border: 'border-zinc-200 dark:border-zinc-700',
    icon: '⚪',
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
