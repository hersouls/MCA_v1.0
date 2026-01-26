// ============================================
// Mobile Navigation Component
// ============================================

import { usePortfolioStore, useSortedPortfolios } from '@/stores/portfolioStore';
import { useUIStore } from '@/stores/uiStore';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { clsx } from 'clsx';
import { BookOpen, Briefcase, LayoutDashboard, Plus, Settings, Star, X } from 'lucide-react';
import { Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface MobileNavProps {
  onAddPortfolio?: () => void;
}

export function MobileNav({ onAddPortfolio: _onAddPortfolio }: MobileNavProps) {
  const navigate = useNavigate();

  const isMobileMenuOpen = useUIStore((state) => state.isMobileMenuOpen);
  const closeMobileMenu = useUIStore((state) => state.closeMobileMenu);
  const openSettingsModal = useUIStore((state) => state.openSettingsModal);

  const portfolios = useSortedPortfolios();
  const activePortfolioId = usePortfolioStore((state) => state.activePortfolioId);

  const handleOpenSettings = () => {
    closeMobileMenu();
    openSettingsModal();
  };

  const handlePortfolioClick = (id: number) => {
    closeMobileMenu();
    navigate(`/portfolio/${id}`);
  };

  const setHeaderSearchOpen = useUIStore((state) => state.setHeaderSearchOpen);

  const handleAddPortfolio = () => {
    closeMobileMenu();
    setHeaderSearchOpen(true);
  };

  const favoritePortfolios = portfolios.filter((p) => p.isFavorite);
  const recentPortfolios = portfolios.filter((p) => !p.isFavorite).slice(0, 5);

  return (
    <Transition show={isMobileMenuOpen} as={Fragment}>
      <Dialog onClose={closeMobileMenu} className="relative z-50 lg:hidden" id="mobile-nav">
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
          <div className="fixed inset-0 bg-zinc-900/50 backdrop-blur-sm" aria-hidden="true" />
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
          <DialogPanel
            className="fixed inset-y-0 left-0 w-full max-w-xs bg-white dark:bg-zinc-950 shadow-xl flex flex-col"
            aria-labelledby="mobile-nav-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-zinc-200 dark:border-zinc-800 flex-shrink-0">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="" className="w-8 h-8 object-contain" aria-hidden="true" />
                <div className="flex flex-col">
                  <span
                    id="mobile-nav-title"
                    className="font-bold text-zinc-900 dark:text-zinc-100"
                  >
                    Moonwave MCA
                  </span>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400">v3.0</span>
                </div>
              </div>
              <button
                onClick={closeMobileMenu}
                className="p-2 -mr-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="메뉴 닫기"
              >
                <X className="w-5 h-5 text-zinc-600 dark:text-zinc-400" aria-hidden="true" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto py-4">
              {/* Main Navigation */}
              <nav className="px-2" aria-label="모바일 메인 메뉴">
                <ul className="space-y-1" role="menu">
                  <li role="none">
                    <Link
                      to="/dashboard"
                      onClick={closeMobileMenu}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[44px]"
                      role="menuitem"
                    >
                      <LayoutDashboard className="w-5 h-5" aria-hidden="true" />
                      <span className="font-medium">대시보드</span>
                    </Link>
                  </li>
                  <li role="none">
                    <button
                      onClick={handleOpenSettings}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 min-h-[44px]"
                      role="menuitem"
                    >
                      <Settings className="w-5 h-5" aria-hidden="true" />
                      <span className="font-medium">설정</span>
                    </button>
                  </li>
                </ul>
              </nav>

              {/* Add Portfolio Button */}
              <div className="px-2 mt-4">
                <button
                  onClick={handleAddPortfolio}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 min-h-[44px]"
                  aria-label="새 종목 추가"
                >
                  <Plus className="w-5 h-5" aria-hidden="true" />
                  <span className="font-medium">새 종목 추가</span>
                </button>
              </div>

              {/* Favorites */}
              {favoritePortfolios.length > 0 && (
                <section className="mt-6 px-2" aria-labelledby="mobile-favorites-heading">
                  <h2
                    id="mobile-favorites-heading"
                    className="px-4 mb-2 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider"
                  >
                    즐겨찾기
                  </h2>
                  <ul className="space-y-0.5" role="menu">
                    {favoritePortfolios.map((portfolio) => {
                      const isActive = activePortfolioId === portfolio.id;

                      return (
                        <li key={portfolio.id} role="none">
                          <button
                            onClick={() => handlePortfolioClick(portfolio.id!)}
                            className={clsx(
                              'w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 min-h-[44px]',
                              isActive
                                ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                            )}
                            role="menuitem"
                            aria-current={isActive ? 'page' : undefined}
                          >
                            <Star
                              className="w-4 h-4 text-warning-500 fill-warning-500"
                              aria-hidden="true"
                            />
                            <span className="truncate">{portfolio.name}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              )}

              {/* Recent Portfolios */}
              {recentPortfolios.length > 0 && (
                <section className="mt-6 px-2" aria-labelledby="mobile-recent-heading">
                  <h2
                    id="mobile-recent-heading"
                    className="px-4 mb-2 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider"
                  >
                    최근 종목
                  </h2>
                  <ul className="space-y-0.5" role="menu">
                    {recentPortfolios.map((portfolio) => {
                      const isActive = activePortfolioId === portfolio.id;

                      return (
                        <li key={portfolio.id} role="none">
                          <button
                            onClick={() => handlePortfolioClick(portfolio.id!)}
                            className={clsx(
                              'w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 min-h-[44px]',
                              isActive
                                ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                            )}
                            role="menuitem"
                            aria-current={isActive ? 'page' : undefined}
                          >
                            <Briefcase className="w-4 h-4" aria-hidden="true" />
                            <span className="truncate">{portfolio.name}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              )}
            </div>
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}

// Bottom Navigation for Mobile
export function BottomNav() {
  const navigate = useNavigate();
  const currentView = useUIStore((state) => state.currentView);
  const openSettingsModal = useUIStore((state) => state.openSettingsModal);
  const openHandbook = useUIStore((state) => state.openHandbook);
  const toggleMobileMenu = useUIStore((state) => state.toggleMobileMenu);

  const handleNavigate = (target: 'dashboard' | 'detail' | 'settings' | 'handbook') => {
    if (target === 'settings') {
      openSettingsModal();
      return;
    }
    if (target === 'handbook') {
      openHandbook();
      return;
    }
    if (target === 'dashboard') {
      navigate('/dashboard');
      return;
    }
    if (target === 'detail') {
      toggleMobileMenu();
      return;
    }
  };

  const navItems = [
    { id: 'dashboard' as const, label: '대시보드', icon: LayoutDashboard },
    { id: 'detail' as const, label: '종목 목록', icon: Briefcase },
    { id: 'handbook' as const, label: '핸드북', icon: BookOpen },
    { id: 'settings' as const, label: '설정', icon: Settings },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-lg border-t border-zinc-200 dark:border-zinc-800 safe-area-inset-bottom"
      aria-label="하단 메인 네비게이션"
    >
      <ul className="flex items-center justify-around h-16" role="menubar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <li key={item.id} className="flex-1" role="none">
              <button
                onClick={() => handleNavigate(item.id)}
                className={clsx(
                  'w-full flex flex-col items-center justify-center gap-1 py-2 transition-colors min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500',
                  isActive
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-zinc-400 dark:text-zinc-500 hover:text-primary-600 dark:hover:text-primary-400'
                )}
                role="menuitem"
                aria-current={isActive ? 'page' : undefined}
                aria-label={`${item.label}${isActive ? ' (현재 페이지)' : ''}`}
              >
                <Icon className="w-5 h-5" aria-hidden="true" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
