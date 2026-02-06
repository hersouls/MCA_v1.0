// ============================================
// Stock Search Input Component
// 종목 검색 + 자동완성 드롭다운
// ============================================

import { type StockFundamentalData, useStockFundamental } from '@/hooks';
import { Loader2, Search, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface StockSearchInputProps {
  value: string;
  placeholder?: string;
  onSelect: (stock: { ticker: string; name: string; market: string }) => void;
  onFundamentalLoaded?: (data: StockFundamentalData) => void;
  className?: string;
  autoFocus?: boolean;
}

export function StockSearchInput({
  value,
  placeholder = '종목명 또는 종목코드 검색',
  onSelect,
  onFundamentalLoaded,
  className = '',
  autoFocus,
}: StockSearchInputProps) {
  const [searchQuery, setSearchQuery] = useState(value);
  const [isEditing, setIsEditing] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevValueRef = useRef(value);

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

  // value prop 변경 시 동기화 (외부 값이 변경될 때만, 편집 중이 아닐 때)
  useEffect(() => {
    if (prevValueRef.current !== value && !isEditing) {
      prevValueRef.current = value;
      queueMicrotask(() => {
        setSearchQuery(value);
      });
    }
  }, [value, isEditing]);

  // 검색어 변경 시 검색 실행 (API 호출만)
  useEffect(() => {
    if (isEditing && searchQuery.length >= 1) {
      searchByQuery(searchQuery);
    } else if (searchQuery.length === 0) {
      clearSearch();
    }
  }, [searchQuery, isEditing, searchByQuery, clearSearch]);

  // 드롭다운 닫기 헬퍼 (useEffect보다 먼저 선언)
  const closeDropdown = useCallback(() => {
    setIsDropdownOpen(false);
    setIsEditing(false);
  }, []);

  // 드롭다운 열기 헬퍼
  const openDropdown = useCallback(() => {
    setIsDropdownOpen(true);
  }, []);

  // 외부 클릭 감지 - 이벤트 핸들러이므로 setState 허용
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closeDropdown();
        setSearchQuery(value); // 원래 값으로 복원
        prevValueRef.current = value;
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [value, closeDropdown]);

  // 종목 선택 핸들러
  const handleSelectStock = useCallback(
    async (ticker: string, name: string, market: string) => {
      closeDropdown();
      const displayName = `${name} (${ticker})`;
      setSearchQuery(displayName);
      prevValueRef.current = displayName;

      // 부모에게 선택 알림
      onSelect({ ticker, name, market });

      // fundamental 데이터 로드
      await selectStock(ticker);
    },
    [onSelect, selectStock, closeDropdown]
  );

  // 입력 변경 핸들러
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setSearchQuery(newValue);
      if (newValue.length >= 1) {
        openDropdown();
      } else {
        setIsDropdownOpen(false);
      }
    },
    [openDropdown]
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
      closeDropdown();
      setSearchQuery(value);
      prevValueRef.current = value;
      inputRef.current?.blur();
    }
  };

  // 포커스 핸들러
  const handleFocus = useCallback(() => {
    setIsEditing(true);
    if (searchQuery.length >= 1) {
      openDropdown();
    }
  }, [searchQuery.length, openDropdown]);

  // 클리어 핸들러
  const handleClear = useCallback(() => {
    setSearchQuery('');
    clearSearch();
    setIsDropdownOpen(false);
    inputRef.current?.focus();
  }, [clearSearch]);

  // 드롭다운 표시 여부 계산 (파생 상태와 명시적 상태 결합)
  const showDropdown = isDropdownOpen && isEditing && searchQuery.length >= 1;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          autoFocus={autoFocus}
          placeholder={placeholder}
          className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-10 text-sm font-medium text-foreground focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
        {(isSearching || isLoading) && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
        {searchQuery && !isSearching && !isLoading && isEditing && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* 검색 결과 드롭다운 */}
      {showDropdown && searchResults.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-auto rounded-lg border border-border bg-card shadow-lg">
          {searchResults.map((result) => (
            <button
              key={result.ticker}
              onClick={() => handleSelectStock(result.ticker, result.name, result.market)}
              className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-surface-hover"
            >
              <span className="font-medium text-foreground">{result.name}</span>
              <span className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{result.ticker}</span>
                <span className="rounded bg-surface-hover px-1.5 py-0.5">
                  {result.market}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}

      {/* 검색 결과 없음 */}
      {showDropdown && !isSearching && searchResults.length === 0 && searchQuery.length >= 2 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-lg border border-border bg-card p-3 text-center text-sm text-muted-foreground shadow-lg">
          검색 결과가 없습니다
        </div>
      )}

      {/* 현재 로드된 종목 정보 표시 */}
      {stockData && !isEditing && (
        <div className="mt-1 text-xs text-muted-foreground">
          {stockData.market} · 현재가 {stockData.currentPrice?.toLocaleString()}원
        </div>
      )}
    </div>
  );
}
