import { StockLogo } from '@/components/ui';
// Import JSON directly (Vite supports JSON imports)
import stockUniverse from '@/data/stockUniverse.json';
import { useUIStore } from '@/stores/uiStore';
import { clsx } from 'clsx';
import { Check, Plus } from 'lucide-react';
import { useMemo } from 'react';

interface StockQuickBarProps {
  onSelect?: (stock: (typeof stockUniverse)[0]) => void;
  savedTickers?: Set<string>; // Set of already saved tickers to show checked state
}

export function StockQuickBar({ onSelect, savedTickers = new Set() }: StockQuickBarProps) {
  const searchQuery = useUIStore((state) => state.searchQuery);
  const setSearchQuery = useUIStore((state) => state.setSearchQuery);

  // Filter stocks based on search query
  const results = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query || query.length < 1) return [];

    // Simple Hangul/English matching
    return stockUniverse
      .filter((stock) => stock.name.toLowerCase().includes(query) || stock.code.includes(query))
      .slice(0, 20); // Limit results for performance
  }, [searchQuery]);

  if (results.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-6 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
            검색 결과 <span className="text-primary-600 ml-1">{results.length}</span>
          </h3>
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            닫기
          </button>
        </div>

        {/* Horizontal Scroll Area */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
          {results.map((stock) => {
            const isSaved = savedTickers.has(stock.code);
            return (
              <button
                key={stock.code}
                onClick={() => !isSaved && onSelect?.(stock)}
                disabled={isSaved}
                className={clsx(
                  'flex items-center gap-3 p-3 rounded-xl min-w-[240px] text-left transition-all snap-start border',
                  isSaved
                    ? 'bg-zinc-100 border-zinc-200 opacity-60 cursor-default dark:bg-zinc-800 dark:border-zinc-700'
                    : 'bg-white border-zinc-200 hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 dark:bg-zinc-950 dark:border-zinc-700 dark:hover:border-primary-700'
                )}
              >
                {/* Logo */}
                <StockLogo code={stock.code} name={stock.name} size={40} />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-zinc-900 dark:text-zinc-100 truncate">
                    {stock.name}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <span className="font-mono">{stock.code}</span>
                    <span className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800">
                      {stock.market}
                    </span>
                  </div>
                </div>

                {/* Action Icon */}
                <div
                  className={clsx(
                    'w-8 h-8 flex items-center justify-center rounded-full',
                    isSaved
                      ? 'bg-zinc-200 text-zinc-500 dark:bg-zinc-700'
                      : 'bg-primary-50 text-primary-600 dark:bg-primary-900/30'
                  )}
                >
                  {isSaved ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
