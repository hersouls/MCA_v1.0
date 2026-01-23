// ============================================
// Mobile Navigation Component
// ============================================

import { Fragment } from 'react';
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import { clsx } from 'clsx';
import {
  X,
  LayoutDashboard,
  Briefcase,
  Settings,
  Star,
  Plus,
} from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { usePortfolioStore, useSortedPortfolios } from '@/stores/portfolioStore';

type View = 'dashboard' | 'detail' | 'settings';

interface MobileNavProps {
  onNavigate?: (view: View) => void;
  onAddPortfolio?: () => void;
}

export function MobileNav({ onNavigate, onAddPortfolio }: MobileNavProps) {
  const isMobileMenuOpen = useUIStore((state) => state.isMobileMenuOpen);
  const closeMobileMenu = useUIStore((state) => state.closeMobileMenu);
  const currentView = useUIStore((state) => state.currentView);
  const setView = useUIStore((state) => state.setView);

  const portfolios = useSortedPortfolios();
  const activePortfolioId = usePortfolioStore((state) => state.activePortfolioId);
  const setActivePortfolio = usePortfolioStore((state) => state.setActivePortfolio);

  const handleNavigate = (view: View) => {
    setView(view);
    closeMobileMenu();
    onNavigate?.(view);
  };

  const handlePortfolioClick = (id: number) => {
    setActivePortfolio(id);
    setView('detail');
    closeMobileMenu();
    onNavigate?.('detail');
  };

  const handleAddPortfolio = () => {
    closeMobileMenu();
    onAddPortfolio?.();
  };

  const navItems = [
    { id: 'dashboard' as const, label: '대시보드', icon: LayoutDashboard },
    { id: 'settings' as const, label: '설정', icon: Settings },
  ];

  const favoritePortfolios = portfolios.filter((p) => p.isFavorite);
  const recentPortfolios = portfolios
    .filter((p) => !p.isFavorite)
    .slice(0, 5);

  return (
    <Transition show={isMobileMenuOpen} as={Fragment}>
      <Dialog onClose={closeMobileMenu} className="relative z-50 lg:hidden">
        {/* Backdrop */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-zinc-900/50 backdrop-blur-sm" />
        </TransitionChild>

        {/* Drawer */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="-translate-x-full"
          enterTo="translate-x-0"
          leave="ease-in duration-200"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-full"
        >
          <DialogPanel className="fixed inset-y-0 left-0 w-full max-w-xs bg-white dark:bg-zinc-950 shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="Moonwave"
                  className="w-8 h-8 object-contain"
                />
                <div className="flex flex-col">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">
                    Moonwave MCA
                  </span>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                    v3.0
                  </span>
                </div>
              </div>
              <button
                onClick={closeMobileMenu}
                className="p-2 -mr-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="메뉴 닫기"
              >
                <X className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto py-4">
              {/* Main Navigation */}
              <nav className="px-2">
                <ul className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentView === item.id;

                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => handleNavigate(item.id)}
                          className={clsx(
                            'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                            isActive
                              ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                          )}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* Add Portfolio Button */}
              <div className="px-2 mt-4">
                <button
                  onClick={handleAddPortfolio}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">새 종목 추가</span>
                </button>
              </div>

              {/* Favorites */}
              {favoritePortfolios.length > 0 && (
                <div className="mt-6 px-2">
                  <h3 className="px-4 mb-2 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                    즐겨찾기
                  </h3>
                  <ul className="space-y-0.5">
                    {favoritePortfolios.map((portfolio) => {
                      const isActive =
                        currentView === 'detail' && activePortfolioId === portfolio.id;

                      return (
                        <li key={portfolio.id}>
                          <button
                            onClick={() => handlePortfolioClick(portfolio.id!)}
                            className={clsx(
                              'w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-left',
                              isActive
                                ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                            )}
                          >
                            <Star className="w-4 h-4 text-warning-500 fill-warning-500" />
                            <span className="truncate">{portfolio.name}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/* Recent Portfolios */}
              {recentPortfolios.length > 0 && (
                <div className="mt-6 px-2">
                  <h3 className="px-4 mb-2 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                    최근 종목
                  </h3>
                  <ul className="space-y-0.5">
                    {recentPortfolios.map((portfolio) => {
                      const isActive =
                        currentView === 'detail' && activePortfolioId === portfolio.id;

                      return (
                        <li key={portfolio.id}>
                          <button
                            onClick={() => handlePortfolioClick(portfolio.id!)}
                            className={clsx(
                              'w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-left',
                              isActive
                                ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                            )}
                          >
                            <Briefcase className="w-4 h-4" />
                            <span className="truncate">{portfolio.name}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}

// Bottom Navigation for Mobile
export function BottomNav({ onNavigate }: Pick<MobileNavProps, 'onNavigate'>) {
  const currentView = useUIStore((state) => state.currentView);
  const setView = useUIStore((state) => state.setView);

  const handleNavigate = (view: View) => {
    setView(view);
    onNavigate?.(view);
  };

  const navItems = [
    { id: 'dashboard' as const, label: '대시보드', icon: LayoutDashboard },
    { id: 'detail' as const, label: '종목', icon: Briefcase },
    { id: 'settings' as const, label: '설정', icon: Settings },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-lg border-t border-zinc-200 dark:border-zinc-800 safe-area-inset-bottom">
      <ul className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <li key={item.id} className="flex-1">
              <button
                onClick={() => handleNavigate(item.id)}
                className={clsx(
                  'w-full flex flex-col items-center justify-center gap-1 py-2 transition-colors',
                  isActive
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-zinc-400 dark:text-zinc-500'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
