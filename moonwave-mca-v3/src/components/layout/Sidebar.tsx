// ============================================
// Sidebar Component (Desktop)
// ============================================

import { clsx } from 'clsx';
import {
  LayoutDashboard,
  Settings,
  ChevronLeft,
  ChevronRight,
  Star,
} from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { usePortfolioStore, useSortedPortfolios } from '@/stores/portfolioStore';

type View = 'dashboard' | 'detail' | 'settings';

interface SidebarProps {
  onNavigate?: (view: View) => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const currentView = useUIStore((state) => state.currentView);
  const setView = useUIStore((state) => state.setView);
  const isSidebarCollapsed = useUIStore((state) => state.isSidebarCollapsed);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  const portfolios = useSortedPortfolios();
  const activePortfolioId = usePortfolioStore((state) => state.activePortfolioId);
  const setActivePortfolio = usePortfolioStore((state) => state.setActivePortfolio);

  const handleNavigate = (view: View) => {
    setView(view);
    onNavigate?.(view);
  };

  const handlePortfolioClick = (id: number) => {
    setActivePortfolio(id);
    setView('detail');
    onNavigate?.('detail');
  };

  const navItems = [
    { id: 'dashboard' as const, label: '대시보드', icon: LayoutDashboard },
    { id: 'settings' as const, label: '설정', icon: Settings },
  ];

  const favoritePortfolios = portfolios.filter((p) => p.isFavorite);

  return (
    <aside
      className={clsx(
        'hidden lg:flex flex-col h-screen bg-zinc-50 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800',
        'transition-all duration-300 ease-in-out',
        isSidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3 overflow-hidden">
          <img
            src="/logo.png"
            alt="Moonwave"
            className="flex-shrink-0 w-8 h-8 object-contain"
          />
          {!isSidebarCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-zinc-900 dark:text-zinc-100 truncate">
                Moonwave MCA
              </span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                v3.0
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => handleNavigate(item.id)}
                  className={clsx(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isSidebarCollapsed && (
                    <span className="text-sm font-medium truncate">{item.label}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Favorites Section */}
        {!isSidebarCollapsed && favoritePortfolios.length > 0 && (
          <div className="mt-6 px-2">
            <h3 className="px-3 mb-2 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              즐겨찾기
            </h3>
            <ul className="space-y-0.5">
              {favoritePortfolios.slice(0, 5).map((portfolio) => {
                const isActive =
                  currentView === 'detail' && activePortfolioId === portfolio.id;

                return (
                  <li key={portfolio.id}>
                    <button
                      onClick={() => handlePortfolioClick(portfolio.id!)}
                      className={clsx(
                        'w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-left',
                        isActive
                          ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                      )}
                    >
                      <Star className="w-3.5 h-3.5 flex-shrink-0 text-warning-500 fill-warning-500" />
                      <span className="text-sm truncate">{portfolio.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Collapsed favorites indicator */}
        {isSidebarCollapsed && favoritePortfolios.length > 0 && (
          <div className="mt-6 px-2">
            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-lg bg-warning-100 dark:bg-warning-900/30 flex items-center justify-center">
                <Star className="w-4 h-4 text-warning-500 fill-warning-500" />
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-2 border-t border-zinc-200 dark:border-zinc-800">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          aria-label={isSidebarCollapsed ? '사이드바 펼치기' : '사이드바 접기'}
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">접기</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
