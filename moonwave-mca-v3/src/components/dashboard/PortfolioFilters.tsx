// ============================================
// Portfolio Filters & Sort Component
// 대시보드 필터 칩 + 정렬 드롭다운
// ============================================

import { useUIStore } from '@/stores/uiStore';
import { clsx } from 'clsx';
import { ArrowUpDown } from 'lucide-react';

type FilterType = 'all' | 'kr' | 'us' | 'gap' | 'grade-a';
type SortType = 'name' | 'progress' | 'investment' | 'updated';

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'kr', label: '한국' },
  { key: 'us', label: '미국' },
  { key: 'gap', label: '갭 주의' },
  { key: 'grade-a', label: '등급 A+' },
];

const SORTS: { key: SortType; label: string }[] = [
  { key: 'name', label: '이름순' },
  { key: 'progress', label: '진행률순' },
  { key: 'investment', label: '투입금액순' },
  { key: 'updated', label: '최근 수정순' },
];

export function PortfolioFilters() {
  const filter = useUIStore((state) => state.dashboardFilter);
  const sort = useUIStore((state) => state.dashboardSort);
  const setFilter = useUIStore((state) => state.setDashboardFilter);
  const setSort = useUIStore((state) => state.setDashboardSort);

  return (
    <div className="flex items-center justify-between gap-3 flex-wrap mb-6">
      {/* Filter Chips */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={clsx(
              'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all',
              filter === key
                ? 'bg-primary-500 text-white'
                : 'bg-surface-hover text-muted-foreground hover:text-foreground hover:bg-surface-active'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Sort Dropdown */}
      <div className="flex items-center gap-1.5">
        <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortType)}
          className="bg-transparent text-xs text-muted-foreground border-none focus:outline-none focus:ring-0 cursor-pointer"
        >
          {SORTS.map(({ key, label }) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
