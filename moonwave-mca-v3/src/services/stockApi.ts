// ============================================
// Stock API Client Service
// KRX 데이터 API 클라이언트
// ============================================

export interface StockFundamentalData {
  ticker: string;
  name: string;
  market: 'KOSPI' | 'KOSDAQ' | 'NYSE' | 'NASDAQ' | 'AMEX';
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
  market: 'KOSPI' | 'KOSDAQ' | 'NYSE' | 'NASDAQ' | 'AMEX';
}

export interface StockSearchResponse {
  query: string;
  count: number;
  results: StockSearchResult[];
}

// API Base URL (development vs production)
const API_BASE_URL = import.meta.env.PROD
  ? '/api' // Vercel production
  : import.meta.env.VITE_API_BASE_URL || '/api'; // Development proxy or local

// localStorage 캐시 키
const CACHE_PREFIX = 'mca_stock_';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24시간

interface CachedData<T> {
  data: T;
  timestamp: number;
}

// 캐시 저장
function setCache<T>(key: string, data: T): void {
  try {
    const cacheData: CachedData<T> = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(cacheData));
  } catch {
    // localStorage 용량 초과 시 무시
  }
}

// 캐시 조회
function getCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;

    const cached: CachedData<T> = JSON.parse(raw);
    if (Date.now() - cached.timestamp > CACHE_TTL) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }

    return cached.data;
  } catch {
    return null;
  }
}

// 캐시 삭제
export function clearStockCache(ticker?: string): void {
  if (ticker) {
    localStorage.removeItem(CACHE_PREFIX + ticker);
  } else {
    // 모든 주식 캐시 삭제
    const keys = Object.keys(localStorage).filter((k) => k.startsWith(CACHE_PREFIX));
    keys.forEach((k) => localStorage.removeItem(k));
  }
}

/**
 * 종목 기본 정보 조회
 * @param ticker 6자리 종목코드
 * @param useCache 캐시 사용 여부 (기본값: true)
 */
export async function fetchStockFundamental(
  ticker: string,
  useCache = true
): Promise<StockFundamentalData> {
  // US 티커 감지: 알파벳으로만 구성
  const isUS = /^[A-Za-z.]{1,6}$/.test(ticker.trim());
  const normalizedTicker = isUS ? ticker.toUpperCase() : ticker.padStart(6, '0');

  // 캐시 확인
  if (useCache) {
    const cached = getCache<StockFundamentalData>(normalizedTicker);
    if (cached) {
      return cached;
    }
  }

  const response = await fetch(`${API_BASE_URL}/stock/${normalizedTicker}`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `Failed to fetch stock data: ${response.status}`);
  }

  const data: StockFundamentalData = await response.json();

  // 캐시 저장
  setCache(normalizedTicker, data);

  return data;
}

/**
 * 종목 검색
 * @param query 검색어 (종목명 또는 종목코드)
 * @param limit 최대 결과 수 (기본값: 10)
 */
export async function searchStocks(
  query: string,
  limit = 10,
  market: 'kr' | 'us' = 'kr'
): Promise<StockSearchResult[]> {
  if (!query || query.length < 1) {
    return [];
  }

  const response = await fetch(
    `${API_BASE_URL}/stock/search?q=${encodeURIComponent(query)}&limit=${limit}&market=${market}`
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `Failed to search stocks: ${response.status}`);
  }

  const data: StockSearchResponse = await response.json();
  return data.results;
}

/**
 * 종목 기본 정보를 FundamentalInput 형식으로 변환
 */
export function toFundamentalInput(data: StockFundamentalData): {
  per: number | null;
  pbr: number | null;
  dividendYield: number | null;
} {
  return {
    per: data.per,
    pbr: data.pbr,
    dividendYield: data.dividendYield,
  };
}
