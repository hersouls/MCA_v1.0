// ============================================
// Market Detection & Currency Utilities
// ============================================

export type MarketType = 'KOSPI' | 'KOSDAQ' | 'NYSE' | 'NASDAQ' | 'AMEX';
export type CurrencyType = 'KRW' | 'USD';

const US_MARKETS: string[] = ['NYSE', 'NASDAQ', 'AMEX'];

/** Check if market is US (NYSE/NASDAQ/AMEX) */
export function isUSMarket(market?: string): boolean {
  if (!market) return false;
  return US_MARKETS.includes(market.toUpperCase());
}

/** Check if market is Korean (default when undefined) */
export function isKRMarket(market?: string): boolean {
  return !isUSMarket(market);
}

/** Derive currency from market */
export function getCurrency(market?: string): CurrencyType {
  return isUSMarket(market) ? 'USD' : 'KRW';
}

/** Get currency symbol */
export function getCurrencySymbol(market?: string): string {
  return isUSMarket(market) ? '$' : '\u20A9';
}

/** Get currency unit label for UI */
export function getCurrencyUnit(market?: string): string {
  return isUSMarket(market) ? '$' : '\uC6D0';
}

/** Detect market type from ticker pattern */
export function detectMarketFromTicker(ticker: string): 'KR' | 'US' | 'unknown' {
  if (/^\d{6}$/.test(ticker)) return 'KR';
  if (/^[A-Z]{1,5}$/.test(ticker.toUpperCase())) return 'US';
  return 'unknown';
}
