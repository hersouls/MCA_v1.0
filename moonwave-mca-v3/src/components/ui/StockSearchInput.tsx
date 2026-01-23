// ============================================
// Stock Search Input Component
// 종목 검색 + 자동완성 드롭다운
// ============================================

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Loader2, X } from 'lucide-react';
import { useStockFundamental, type StockFundamentalData } from '@/hooks';

interface StockSearchInputProps {
  value: string;
  placeholder?: string;
  onSelect: (stock: { ticker: string; name: string; market: string }) => void;
  onFundamentalLoaded?: (data: StockFundamentalData) => void;
  className?: string;
}

export function StockSearchInput({
  value,
  placeholder = '종목명 또는 종목코드 검색',
  onSelect,
  onFundamentalLoaded,
  className = '',
}: StockSearchInputProps) {
  const [searchQuery, setSearchQuery] = useState(value);
  const [showResults, setShowResults] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 종목 검색 훅
  const {
    stockData,
    searchResults,
    isLoading,
    isSearching,
    searchByQuery,
    selectStock,
    clearSearch,
  } = useStockFundamental({
    debounceMs: 300,
    onDataLoaded: (data) => {
      onFundamentalLoaded?.(data);
    },
  });

  // value prop 변경 시 동기화
  useEffect(() => {
    if (!isEditing) {
      setSearchQuery(value);
    }
  }, [value, isEditing]);

  // 검색어 변경 시 검색 실행
  useEffect(() => {
    if (isEditing && searchQuery.length >= 1) {
      searchByQuery(searchQuery);
      setShowResults(true);
    } else if (searchQuery.length === 0) {
      clearSearch();
      setShowResults(false);
    }
  }, [searchQuery, isEditing, searchByQuery, clearSearch]);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowResults(false);
        setIsEditing(false);
        setSearchQuery(value); // 원래 값으로 복원
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [value]);

  // 종목 선택 핸들러
  const handleSelectStock = useCallback(
    async (ticker: string, name: string, market: string) => {
      setShowResults(false);
      setIsEditing(false);
      const displayName = `${name} (${ticker})`;
      setSearchQuery(displayName);

      // 부모에게 선택 알림
      onSelect({ ticker, name, market });

      // fundamental 데이터 로드
      await selectStock(ticker);
    },
    [onSelect, selectStock]
  );

  // Enter 키 핸들러
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const query = searchQuery.trim();

      // 6자리 이하 숫자면 직접 조회
      if (/^\d{1,6}$/.test(query)) {
        const ticker = query.padStart(6, '0');
        // API로 종목 정보 조회
        try {
          const res = await fetch(`/api/stock/search?q=${ticker}&limit=1`);
          if (res.ok) {
            const data = await res.json();
            if (data.results?.length > 0) {
              const found = data.results[0];
              await handleSelectStock(found.ticker, found.name, found.market);
              return;
            }
          }
        } catch {
          // 실패 시 무시
        }
      }

      // 검색 결과가 있으면 첫 번째 선택
      if (searchResults.length > 0) {
        const first = searchResults[0];
        await handleSelectStock(first.ticker, first.name, first.market);
      }
    } else if (e.key === 'Escape') {
      setShowResults(false);
      setIsEditing(false);
      setSearchQuery(value);
      inputRef.current?.blur();
    }
  };

  // 포커스 핸들러
  const handleFocus = () => {
    setIsEditing(true);
    if (searchQuery.length >= 1) {
      setShowResults(true);
    }
  };

  // 클리어 핸들러
  const handleClear = () => {
    setSearchQuery('');
    clearSearch();
    setShowResults(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder={placeholder}
          className="w-full rounded-lg border border-zinc-300 bg-white py-2 pl-9 pr-10 text-sm font-medium focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
        />
        {(isSearching || isLoading) && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-zinc-400" />
        )}
        {searchQuery && !isSearching && !isLoading && isEditing && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* 검색 결과 드롭다운 */}
      {showResults && searchResults.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-auto rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
          {searchResults.map((result) => (
            <button
              key={result.ticker}
              onClick={() => handleSelectStock(result.ticker, result.name, result.market)}
              className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-zinc-50 dark:hover:bg-zinc-700"
            >
              <span className="font-medium text-zinc-900 dark:text-white">
                {result.name}
              </span>
              <span className="flex items-center gap-2 text-xs text-zinc-500">
                <span>{result.ticker}</span>
                <span className="rounded bg-zinc-100 px-1.5 py-0.5 dark:bg-zinc-700">
                  {result.market}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}

      {/* 검색 결과 없음 */}
      {showResults && isEditing && searchQuery.length >= 2 && !isSearching && searchResults.length === 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-lg border border-zinc-200 bg-white p-3 text-center text-sm text-zinc-500 shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
          검색 결과가 없습니다
        </div>
      )}

      {/* 현재 로드된 종목 정보 표시 */}
      {stockData && !isEditing && (
        <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          {stockData.market} · 현재가 {stockData.currentPrice?.toLocaleString()}원
        </div>
      )}
    </div>
  );
}

export default StockSearchInput;
