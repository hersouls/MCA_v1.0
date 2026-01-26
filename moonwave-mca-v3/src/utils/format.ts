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
 * Format number as compact (M for millions) - Legacy
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
 * 한글 단위로 숫자 포맷 (만/억/조)
 * 천 단위 이하: 그대로 표시 (9,999 이하)
 * 만 단위: 1만 ~ 9,999만
 * 억 단위: 1억 ~ 9,999억
 * 조 단위: 1조 이상
 */
export function formatKoreanUnit(num: number): string {
  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';

  if (absNum >= 1_000_000_000_000) {
    // 조 단위 (1조 이상)
    const jo = absNum / 1_000_000_000_000;
    return `${sign}${jo >= 10 ? Math.floor(jo).toLocaleString('ko-KR') : jo.toFixed(1).replace(/\.0$/, '')}조`;
  }

  if (absNum >= 100_000_000) {
    // 억 단위 (1억 이상)
    const eok = absNum / 100_000_000;
    return `${sign}${eok >= 10 ? Math.floor(eok).toLocaleString('ko-KR') : eok.toFixed(1).replace(/\.0$/, '')}억`;
  }

  if (absNum >= 10_000) {
    // 만 단위 (1만 이상)
    const man = absNum / 10_000;
    return `${sign}${man >= 10 ? Math.floor(man).toLocaleString('ko-KR') : man.toFixed(1).replace(/\.0$/, '')}만`;
  }

  // 천 단위 이하: 그대로 표시
  return new Intl.NumberFormat('ko-KR').format(num);
}

/**
 * 한글 단위 통화 포맷 (원)
 */
export function formatKoreanCurrency(num: number): string {
  return `${formatKoreanUnit(num)}원`;
}

/**
 * Parse formatted number string to number
 */
export function parseFormattedNumber(str: string | undefined | null): number {
  if (!str) return 0;
  const cleaned = str.replace(/[^0-9.-]/g, '');
  const parsed = Number.parseFloat(cleaned);
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
 * Format input value with thousand separators (for input fields)
 */
export function formatInputValue(value: string): string {
  const numericValue = value.replace(/[^0-9]/g, '');
  if (!numericValue) return '';
  return Number.parseInt(numericValue, 10).toLocaleString('ko-KR');
}
