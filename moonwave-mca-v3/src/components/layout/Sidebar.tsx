// ============================================
// Sidebar Component (Desktop)
// ============================================

import { Tooltip } from '@/components/ui';
import { usePortfolioStore, useSortedPortfolios } from '@/stores/portfolioStore';
import { useUIStore } from '@/stores/uiStore';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { BookOpen, ChevronLeft, ChevronRight, HelpCircle, LayoutDashboard, Settings, Star } from 'lucide-react';

type View = 'dashboard' | 'detail' | 'settings';

interface SidebarProps {
  onNavigate?: (view: View) => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const currentView = useUIStore((state) => state.currentView);
  const setView = useUIStore((state) => state.setView);
  const isSidebarCollapsed = useUIStore((state) => state.isSidebarCollapsed);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const openSettingsModal = useUIStore((state) => state.openSettingsModal);
  const openHandbook = useUIStore((state) => state.openHandbook);
  const openFAQModal = useUIStore((state) => state.openFAQModal);

  const portfolios = useSortedPortfolios();
  const activePortfolioId = usePortfolioStore((state) => state.activePortfolioId);
  const setActivePortfolio = usePortfolioStore((state) => state.setActivePortfolio);

  const handleNavigate = (view: View | 'handbook' | 'faq') => {
    if (view === 'settings') {
      openSettingsModal();
      return;
    }
    if (view === 'handbook') {
      openHandbook();
      return;
    }
    if (view === 'faq') {
      openFAQModal();
      return;
    }
    setView(view as View);
    onNavigate?.(view as View);
  };

  const handlePortfolioClick = (id: number) => {
    setActivePortfolio(id);
    setView('detail');
    onNavigate?.('detail');
  };

  const navItems = [
    { id: 'dashboard' as const, label: '대시보드', icon: LayoutDashboard },
    { id: 'handbook' as const, label: '핸드북', icon: BookOpen },
    { id: 'faq' as const, label: 'FAQ', icon: HelpCircle },
    { id: 'settings' as const, label: '설정', icon: Settings },
  ];

  const favoritePortfolios = portfolios.filter((p) => p.isFavorite);

  return (
    <aside
      className={clsx(
        'hidden lg:flex flex-col h-screen bg-card border-r border-border',
        'transition-all duration-300 ease-in-out',
        isSidebarCollapsed ? 'w-16' : 'w-64'
      )}
      role="complementary"
      aria-label="사이드 네비게이션"
      aria-expanded={!isSidebarCollapsed}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-border">
        <a
          href="/dashboard"
          className="flex items-center gap-3 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-lg"
          aria-label="대시보드로 이동"
        >
          <img
            src="/logo.png"
            alt=""
            className="flex-shrink-0 w-8 h-8 object-contain"
            aria-hidden="true"
          />
          {!isSidebarCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-foreground truncate">
                Moonwave MCA
              </span>
              <span className="text-[10px] text-muted-foreground">v3.0</span>
            </div>
          )}
        </a>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4" aria-label="주 메뉴" data-tour="sidebar-nav">
        <ul className="space-y-1 px-2" role="menubar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            const navButton = (
              <button
                onClick={() => handleNavigate(item.id)}
                className={clsx(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                  isActive
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'text-muted-foreground hover:bg-surface-hover'
                )}
                role="menuitem"
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                {!isSidebarCollapsed && (
                  <span className="text-sm font-medium truncate">{item.label}</span>
                )}
              </button>
            );

            return (
              <li key={item.id} role="none">
                {isSidebarCollapsed ? (
                  <Tooltip content={item.label} placement="right">
                    {navButton}
                  </Tooltip>
                ) : (
                  navButton
                )}
              </li>
            );
          })}
        </ul>

        {/* Favorites Section */}
        {!isSidebarCollapsed && favoritePortfolios.length > 0 && (
          <section className="mt-6 px-2" aria-labelledby="favorites-heading">
            <h2
              id="favorites-heading"
              className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider"
            >
              즐겨찾기
            </h2>
            <ul className="space-y-0.5" role="menu">
              {favoritePortfolios.slice(0, 5).map((portfolio) => {
                const isActive = currentView === 'detail' && activePortfolioId === portfolio.id;

                return (
                  <li key={portfolio.id} role="none">
                    <button
                      onClick={() => handlePortfolioClick(portfolio.id!)}
                      className={clsx(
                        'w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                        isActive
                          ? 'bg-surface-active text-foreground'
                          : 'text-muted-foreground hover:bg-surface-hover'
                      )}
                      role="menuitem"
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <motion.span
                        whileTap={{ scale: 0.8 }}
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 0.3 }}
                        className="flex-shrink-0 inline-flex"
                      >
                        <Star
                          className="w-3.5 h-3.5 text-warning-500 fill-warning-500"
                          aria-hidden="true"
                        />
                      </motion.span>
                      <span className="text-sm truncate">{portfolio.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* Collapsed favorites indicator */}
        {isSidebarCollapsed && favoritePortfolios.length > 0 && (
          <div className="mt-6 px-2" aria-label={`즐겨찾기 ${favoritePortfolios.length}개`}>
            <div className="flex justify-center">
              <Tooltip content={`즐겨찾기 ${favoritePortfolios.length}개`} placement="right">
                <div className="w-8 h-8 rounded-lg bg-warning-100 dark:bg-warning-900/30 flex items-center justify-center cursor-default">
                  <Star className="w-4 h-4 text-warning-500 fill-warning-500" aria-hidden="true" />
                </div>
              </Tooltip>
            </div>
          </div>
        )}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-2 border-t border-border">
        {isSidebarCollapsed ? (
          <Tooltip content="사이드바 펼치기" placement="right">
            <button
              onClick={toggleSidebar}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:bg-surface-hover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              aria-label="사이드바 펼치기"
              aria-expanded={false}
            >
              <ChevronRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </Tooltip>
        ) : (
          <button
            onClick={toggleSidebar}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:bg-surface-hover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            aria-label="사이드바 접기"
            aria-expanded={true}
          >
            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
            <span className="text-sm">접기</span>
          </button>
        )}
      </div>
    </aside>
  );
}
