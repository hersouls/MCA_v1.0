// ============================================
// Exchange Rate Service
// USD/KRW 환율 조회 + 캐시 관리
// ============================================

import { isUSMarket } from '@/utils/market';
import {
  DEFAULT_EXCHANGE_RATE,
  EXCHANGE_RATE_CACHE_TTL,
  STORAGE_KEYS,
} from '@/utils/constants';

interface CachedExchangeRate {
  rate: number;
  timestamp: number;
}

const API_BASE_URL = import.meta.env.PROD
  ? '/api'
  : import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Fetch exchange rate with cache fallback chain:
 * API → localStorage cache (any age) → DEFAULT_EXCHANGE_RATE
 */
export async function fetchExchangeRate(): Promise<number> {
  // Check cache first (within TTL)
  const cached = getCachedRate();
  if (cached !== null) return cached;

  try {
    const response = await fetch(`${API_BASE_URL}/exchange-rate`);
    if (!response.ok) throw new Error('Exchange rate API failed');

    const data = await response.json();
    const rate = data.rate;

    setCachedRate(rate);
    return rate;
  } catch {
    // Fallback: last cached rate (regardless of age) or default
    const lastCached = getLastCachedRate();
    return lastCached ?? DEFAULT_EXCHANGE_RATE;
  }
}

/** Get cached rate if within TTL */
function getCachedRate(): number | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EXCHANGE_RATE);
    if (!raw) return null;
    const cached: CachedExchangeRate = JSON.parse(raw);
    if (Date.now() - cached.timestamp > EXCHANGE_RATE_CACHE_TTL) return null;
    return cached.rate;
  } catch {
    return null;
  }
}

/** Get last cached rate regardless of age */
function getLastCachedRate(): number | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EXCHANGE_RATE);
    if (!raw) return null;
    return JSON.parse(raw).rate;
  } catch {
    return null;
  }
}

/** Store rate in cache */
function setCachedRate(rate: number): void {
  try {
    const data: CachedExchangeRate = { rate, timestamp: Date.now() };
    localStorage.setItem(STORAGE_KEYS.EXCHANGE_RATE, JSON.stringify(data));
  } catch {
    // localStorage quota exceeded - ignore
  }
}

/** Convert amount to KRW based on market */
export function convertToKRW(amount: number, market?: string, rate?: number): number {
  if (!isUSMarket(market)) return amount;
  return amount * (rate ?? DEFAULT_EXCHANGE_RATE);
}
