// ============================================
// Stock Search Modal Component
// 종목 검색 + 선택 → 포트폴리오 생성
// ============================================

import {
  searchIntegratedStocks,
  type IntegratedStock,
} from '@/data/integratedStocks';
import { useDebounce } from '@/hooks/useDebounce';
import { usePortfolioStore } from '@/stores/portfolioStore';
import { clsx } from 'clsx';
import { CheckCircle, Clock, Plus, Search, SearchX, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Dialog, DialogBody, DialogHeader } from '@/components/ui/Dialog';
import { StockLogo } from '@/components/ui/StockLogo';
import { useToast } from '@/components/ui/Toast';

// --- Recent search history helpers ---
const RECENT_SEARCHES_KEY = 'mca-recent-searches';
const MAX_RECENT = 10;

function getRecentSearches(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(0, MAX_RECENT) : [];
  } catch {
    return [];
  }
}

function saveRecentSearch(query: string) {
  const trimmed = query.trim();
  if (!trimmed) return;
  const prev = getRecentSearches().filter((q) => q !== trimmed);
  const next = [trimmed, ...prev].slice(0, MAX_RECENT);
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
}

function removeRecentSearch(query: string) {
  const next = getRecentSearches().filter((q) => q !== query);
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
}

function clearRecentSearches() {
  localStorage.removeItem(RECENT_SEARCHES_KEY);
}

// --- Main Component ---
interface StockSearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function StockSearchModal({ open, onClose }: StockSearchModalProps) {
  const navigate = useNavigate();
  const addPortfolio = usePortfolioStore((state) => state.addPortfolio);
  const portfolios = usePortfolioStore((state) => state.portfolios);
  const { success: toastSuccess, error: toastError } = useToast();

  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const debouncedQuery = useDebounce(query, 200);

  // Existing portfolio stock codes for duplicate detection
  const existingStockCodes = useMemo(
    () => new Set(portfolios.map((p) => p.stockCode).filter(Boolean)),
    [portfolios]
  );

  // Load recent searches when modal opens
  useEffect(() => {
    if (open) {
      setRecentSearches(getRecentSearches());
    }
  }, [open]);

  // Local search results (instant, fuzzy)
  const localResults = useMemo(() => {
    const trimmed = debouncedQuery.trim();
    if (!trimmed || trimmed.length < 2) return [];
    return searchIntegratedStocks(trimmed).slice(0, 10);
  }, [debouncedQuery]);

  // Close and reset state
  const handleClose = useCallback(() => {
    onClose();
    setQuery('');
    setError(null);
  }, [onClose]);

  // Select stock → create portfolio → navigate
  const handleSelectStock = useCallback(
    async (stock: IntegratedStock) => {
      if (existingStockCodes.has(stock.code)) return;

      try {
        const id = await addPortfolio({
          name: stock.name,
          code: stock.code,
          market: stock.market,
        });
        saveRecentSearch(query);
        setRecentSearches(getRecentSearches());
        toastSuccess(`${stock.name}이(가) 추가되었습니다`);
        handleClose();
        navigate(`/portfolio/${id}`);
      } catch (err) {
        console.error('[StockSearchModal] 종목 추가 실패:', err);
        toastError('종목 추가에 실패했습니다');
        setError('종목 추가에 실패했습니다. 다시 시도해주세요.');
      }
    },
    [existingStockCodes, addPortfolio, query, toastSuccess, toastError, handleClose, navigate]
  );

  // Recent search handlers
  const handleRecentClick = (term: string) => {
    setQuery(term);
  };

  const handleRemoveRecent = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    removeRecentSearch(term);
    setRecentSearches(getRecentSearches());
  };

  const handleClearAllRecent = () => {
    clearRecentSearches();
    setRecentSearches([]);
  };

  // Determine display states
  const trimmedQuery = query.trim();
  const showRecentHistory = !trimmedQuery && recentSearches.length > 0;
  const showHint = trimmedQuery.length > 0 && trimmedQuery.length < 2;
  const showNoResults =
    trimmedQuery.length >= 2 && localResults.length === 0 && !error;

  return (
    <Dialog open={open} onClose={handleClose} size="md">
      <DialogHeader title="종목 추가" onClose={handleClose} />
      <DialogBody className="-mt-2">
        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setError(null);
            }}
            placeholder="종목명 또는 코드 검색"
            className={clsx(
              'w-full pl-10 pr-10 py-3 bg-surface-hover rounded-lg text-foreground',
              'placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all',
              error ? 'ring-2 ring-danger-500' : 'focus:ring-primary-500'
            )}
            autoFocus
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-danger-500 mb-3">{error}</p>
        )}

        {/* Scrollable Results Area */}
        <div className="max-h-[50vh] overflow-y-auto -mx-2 px-2 space-y-1.5">
          {/* Recent Search History */}
          {showRecentHistory && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  최근 검색
                </p>
                <button
                  type="button"
                  onClick={handleClearAllRecent}
                  className="text-xs text-muted-foreground/70 hover:text-muted-foreground transition-colors"
                >
                  전체 삭제
                </button>
              </div>
              <div className="space-y-1">
                {recentSearches.map((term) => (
                  <div
                    key={term}
                    onClick={() => handleRecentClick(term)}
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-surface-hover cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Search className="w-3.5 h-3.5 text-muted-foreground/60 flex-shrink-0" />
                      <span className="text-sm text-foreground truncate">
                        {term}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleRemoveRecent(e, term)}
                      className="p-1 rounded hover:bg-surface-active opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                    >
                      <X className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hint: query too short */}
          {showHint && (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Search className="w-8 h-8 mb-2" />
              <p className="text-sm">2글자 이상 입력해주세요</p>
            </div>
          )}

          {/* No results */}
          {showNoResults && (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <SearchX className="w-10 h-10 mb-2" />
              <p className="text-sm font-medium">검색 결과가 없습니다</p>
              <p className="text-xs mt-1">다른 종목명이나 코드로 검색해보세요</p>
            </div>
          )}

          {/* Local Results */}
          {localResults.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-success-500" />
                검색 결과 ({localResults.length}건)
              </p>
              <div className="space-y-1.5">
                {localResults.map((stock) => {
                  const isRegistered = existingStockCodes.has(stock.code);
                  return (
                    <StockItem
                      key={`${stock.type}-${stock.code}`}
                      stock={stock}
                      isRegistered={isRegistered}
                      onClick={() => handleSelectStock(stock)}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Quick tip footer */}
        <p className="text-xs text-muted-foreground mt-4 pt-3 border-t border-border">
          한국: 종목명/코드로 검색 &bull; 미국: 티커(AAPL) 입력
        </p>
      </DialogBody>
    </Dialog>
  );
}

// --- Stock Item Sub-component ---
function StockItem({
  stock,
  isRegistered,
  onClick,
}: {
  stock: IntegratedStock;
  isRegistered: boolean;
  onClick: () => void;
}) {
  return (
    <Card
      variant="interactive"
      padding="sm"
      onClick={onClick}
      className={clsx(
        'flex items-center gap-3',
        isRegistered && 'pointer-events-none opacity-50'
      )}
    >
      <StockLogo
        code={stock.code}
        name={stock.name}
        market={stock.market}
        size={40}
      />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground truncate">{stock.name}</p>
        <p className="text-sm text-muted-foreground font-mono">
          {stock.code} &bull; {stock.market}
        </p>
      </div>
      {isRegistered ? (
        <Badge color="success" size="sm">등록됨</Badge>
      ) : (
        <Plus className="w-5 h-5 text-primary-500 flex-shrink-0" />
      )}
    </Card>
  );
}
