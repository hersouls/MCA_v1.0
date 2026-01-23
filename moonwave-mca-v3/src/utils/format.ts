// ============================================
// Number & Date Formatting Utilities
// ============================================

/**
 * Format number with thousand separators (Korean style)
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('ko-KR').format(num);
}

/**
 * Format number as currency (원)
 */
export function formatCurrency(num: number): string {
  return `${formatNumber(num)}원`;
}

/**
 * Format number as compact (M for millions)
 */
export function formatCompact(num: number): string {
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(1)}B`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return formatNumber(num);
}

/**
 * Parse formatted number string to number
 */
export function parseFormattedNumber(str: string | undefined | null): number {
  if (!str) return 0;
  const cleaned = str.replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Format percentage with sign
 */
export function formatPercent(num: number, decimals = 1): string {
  const sign = num >= 0 ? '+' : '';
  return `${sign}${num.toFixed(decimals)}%`;
}

/**
 * Format drop rate (always negative)
 */
export function formatDropRate(num: number): string {
  return `-${num.toFixed(1)}%`;
}

/**
 * Format date to ISO string (YYYY-MM-DD)
 */
export function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Format date to localized string
 */
export function formatDateLocalized(date: Date): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

/**
 * Format date and time
 */
export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Format input value with thousand separators (for input fields)
 */
export function formatInputValue(value: string): string {
  const numericValue = value.replace(/[^0-9]/g, '');
  if (!numericValue) return '';
  return parseInt(numericValue, 10).toLocaleString('ko-KR');
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
