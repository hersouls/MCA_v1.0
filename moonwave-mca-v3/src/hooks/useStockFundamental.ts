// ============================================
// useStockFundamental Hook
// 종목 기본 정보 자동 조회 및 폼 연동
// ============================================

import {
  type StockFundamentalData,
  type StockSearchResult,
  clearStockCache,
  fetchStockFundamental,
  searchStocks,
  toFundamentalInput,
} from '@/services/stockApi';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseStockFundamentalOptions {
  /** 디바운스 지연시간 (ms) */
  debounceMs?: number;
  /** 캐시 사용 여부 */
  useCache?: boolean;
  /** 자동 조회 여부 */
  autoFetch?: boolean;
  /** 데이터 로드 시 콜백 */
  onDataLoaded?: (data: StockFundamentalData) => void;
  /** 에러 발생 시 콜백 */
  onError?: (error: Error) => void;
}

export interface UseStockFundamentalReturn {
  // 조회된 데이터
  stockData: StockFundamentalData | null;
  // 검색 결과
  searchResults: StockSearchResult[];
  // 상태
  isLoading: boolean;
  isSearching: boolean;
  error: string | null;
  // 수동 오버라이드 여부
  isManuallyModified: boolean;
  // 액션
  fetchByTicker: (ticker: string) => Promise<void>;
  searchByQuery: (query: string) => void;
  selectStock: (ticker: string) => Promise<void>;
  clearSearch: () => void;
  clearCache: () => void;
  markAsModified: () => void;
  resetModified: () => void;
  // 변환된 데이터
  fundamentalInput: {
    per: number | null;
    pbr: number | null;
    dividendYield: number | null;
  } | null;
}

// 디바운스 훅 - 검색 쿼리 전용 (string 인자)
function useDebouncedSearch(
  callback: (query: string) => void,
  delay: number
): (query: string) => void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(callback);

  // 최신 콜백 참조 유지
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // 클린업
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (query: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(query);
      }, delay);
    },
    [delay]
  );
}

export function useStockFundamental(
  options: UseStockFundamentalOptions = {}
): UseStockFundamentalReturn {
  const { debounceMs = 500, useCache = true, onDataLoaded, onError } = options;

  const [stockData, setStockData] = useState<StockFundamentalData | null>(null);
  const [searchResults, setSearchResults] = useState<StockSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isManuallyModified, setIsManuallyModified] = useState(false);

  // 종목코드로 데이터 조회
  const fetchByTicker = useCallback(
    async (ticker: string) => {
      if (!ticker || ticker.length < 4) return;

      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchStockFundamental(ticker, useCache);
        setStockData(data);
        setIsManuallyModified(false);
        onDataLoaded?.(data);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : '종목 정보를 가져올 수 없습니다';
        setError(errorMsg);
        onError?.(err instanceof Error ? err : new Error(errorMsg));
      } finally {
        setIsLoading(false);
      }
    },
    [useCache, onDataLoaded, onError]
  );

  // 검색어로 종목 검색 (디바운스 적용)
  const searchByQueryInternal = useCallback(async (query: string) => {
    if (!query || query.length < 1) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    try {
      const results = await searchStocks(query, 10);
      setSearchResults(results);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const searchByQuery = useDebouncedSearch(searchByQueryInternal, debounceMs);

  // 검색 결과에서 종목 선택
  const selectStock = useCallback(
    async (ticker: string) => {
      setSearchResults([]);
      await fetchByTicker(ticker);
    },
    [fetchByTicker]
  );

  // 검색 결과 초기화
  const clearSearch = useCallback(() => {
    setSearchResults([]);
  }, []);

  // 캐시 삭제
  const clearCache = useCallback(() => {
    clearStockCache();
  }, []);

  // 수동 수정 표시
  const markAsModified = useCallback(() => {
    setIsManuallyModified(true);
  }, []);

  // 수동 수정 해제
  const resetModified = useCallback(() => {
    setIsManuallyModified(false);
  }, []);

  // FundamentalInput 형식으로 변환
  const fundamentalInput = stockData ? toFundamentalInput(stockData) : null;

  return {
    stockData,
    searchResults,
    isLoading,
    isSearching,
    error,
    isManuallyModified,
    fetchByTicker,
    searchByQuery,
    selectStock,
    clearSearch,
    clearCache,
    markAsModified,
    resetModified,
    fundamentalInput,
  };
}

// Re-export types for convenience
export type { StockFundamentalData, StockSearchResult } from '@/services/stockApi';
