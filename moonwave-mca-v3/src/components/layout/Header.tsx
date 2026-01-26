// ============================================
// Header Component
// ============================================

import { IconButton, Tooltip } from '@/components/ui';
import { NotificationDropdown } from '@/components/ui/NotificationDropdown';
import { useSettingsStore } from '@/stores/settingsStore';
import { useUIStore } from '@/stores/uiStore';
import type { ThemeMode } from '@/types';
import { BookOpen, Menu, Monitor, Moon, Plus, Search, Sun, X } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface HeaderProps {
  onAddPortfolio?: () => void;
}

export function Header({ onAddPortfolio: _onAddPortfolio }: HeaderProps) {
  const isMobileMenuOpen = useUIStore((state) => state.isMobileMenuOpen);
  const toggleMobileMenu = useUIStore((state) => state.toggleMobileMenu);
  const openHandbook = useUIStore((state) => state.openHandbook);

  const theme = useSettingsStore((state) => state.settings.theme);
  const setTheme = useSettingsStore((state) => state.setTheme);
  const searchQuery = useUIStore((state) => state.searchQuery);
  const setSearchQuery = useUIStore((state) => state.setSearchQuery);
  const isSearchOpen = useUIStore((state) => state.isHeaderSearchOpen);
  const setIsSearchOpen = useUIStore((state) => state.setHeaderSearchOpen);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  const cycleTheme = () => {
    const themeOrder: ThemeMode[] = ['light', 'dark', 'system'];
    const currentIndex = themeOrder.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    setTheme(themeOrder[nextIndex]);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="w-5 h-5" aria-hidden="true" />;
      case 'dark':
        return <Moon className="w-5 h-5" aria-hidden="true" />;
      default:
        return <Monitor className="w-5 h-5" aria-hidden="true" />;
    }
  };

  const themeLabels: Record<ThemeMode, string> = {
    light: '라이트 모드',
    dark: '다크 모드',
    system: '시스템 설정',
  };

  return (
    <header
      role="banner"
      className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-200 dark:border-zinc-800"
    >
      {/* Skip Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-500 focus:text-white focus:rounded-lg focus:outline-none"
      >
        메인 콘텐츠로 이동
      </a>

      <nav
        className="flex items-center justify-between h-16 px-4 lg:px-6 relative"
        aria-label="헤더 네비게이션"
      >
        {/* Mobile Search Overlay - Only Visible in Mobile when Open */}
        {isSearchOpen && (
          <div className="absolute inset-0 z-50 flex items-center bg-white dark:bg-zinc-950 px-4 md:hidden animate-fade-in">
            <div className="relative w-full group mr-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-zinc-400" />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="종목 검색 및 추가..."
                className="block w-full rounded-full border-0 py-2 pl-10 pr-2 text-zinc-900 ring-1 ring-inset ring-zinc-200 placeholder:text-zinc-400 focus:ring-1 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6 dark:bg-zinc-900 dark:text-zinc-100 dark:ring-zinc-700 dark:focus:ring-primary-400"
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }
                }}
              />
            </div>
            <IconButton
              onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery('');
              }}
              color="secondary"
              aria-label="검색 닫기"
            >
              <X className="w-5 h-5" />
            </IconButton>
          </div>
        )}

        {/* Left: Mobile menu button + Logo (Hidden when mobile search is open) */}
        <div className={`flex items-center gap-3 ${isSearchOpen ? 'hidden md:flex' : ''}`}>
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            aria-label={isMobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav"
          >
            <Menu className="w-5 h-5 text-zinc-600 dark:text-zinc-400" aria-hidden="true" />
          </button>

          {/* Logo - visible on mobile */}
          <a
            href="/dashboard"
            className="lg:hidden flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-lg"
            aria-label="대시보드로 이동"
          >
            <img src="/logo.png" alt="" className="w-8 h-8 object-contain" aria-hidden="true" />
            <span className="font-bold text-zinc-900 dark:text-zinc-100">MCA</span>
          </a>
        </div>

        {/* Center: Spacer */}
        <div className="flex-1" />

        {/* Right: Actions */}
        <div
          className={`flex items-center gap-1 ${isSearchOpen ? 'hidden md:flex' : ''}`}
          role="group"
          aria-label="헤더 액션"
        >
          {/* Notification dropdown */}
          <NotificationDropdown />

          {/* Handbook Button */}
          <div className="hidden sm:block">
            <Tooltip content="핸드북" placement="bottom">
              <IconButton plain color="secondary" onClick={() => openHandbook()} aria-label="핸드북 열기">
                <BookOpen className="w-5 h-5" aria-hidden="true" />
              </IconButton>
            </Tooltip>
          </div>

          {/* Theme toggle */}
          <Tooltip content={themeLabels[theme]} placement="bottom">
            <IconButton
              plain
              color="secondary"
              onClick={cycleTheme}
              aria-label={`테마 변경 (현재: ${themeLabels[theme]})`}
            >
              {getThemeIcon()}
            </IconButton>
          </Tooltip>

          {/* Desktop Search Slide-out (Visible on MD+, handles its own state) */}
          <div className="hidden md:flex items-center ml-2 relative">
            <div
              className={`flex items-center transition-all duration-300 ease-in-out overflow-hidden ${isSearchOpen ? 'w-64 opacity-100 mr-2' : 'w-0 opacity-0'
                }`}
            >
              <div className="relative w-full group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-zinc-400 group-hover:text-primary-500 transition-colors" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="종목 검색 및 추가..."
                  className="block w-full rounded-full border-0 py-1.5 pl-10 pr-8 text-zinc-900 ring-1 ring-inset ring-zinc-200 placeholder:text-zinc-400 focus:ring-1 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6 dark:bg-zinc-900/50 dark:text-zinc-100 dark:ring-zinc-700 dark:focus:ring-primary-400"
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-2 flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Trigger Button (Everywhere) */}
          <Tooltip content={isSearchOpen ? '닫기' : '새 종목 추가 (검색)'} placement="bottom">
            <IconButton
              color={isSearchOpen ? 'secondary' : 'primary'}
              onClick={() => {
                if (isSearchOpen) {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                } else {
                  setIsSearchOpen(true);
                }
              }}
              aria-label={isSearchOpen ? '검색 닫기' : '새 종목 추가'}
              className="transition-transform duration-300"
            >
              <Plus
                className={`w-5 h-5 transition-transform duration-300 ${isSearchOpen ? 'rotate-45' : 'rotate-0'
                  }`}
                aria-hidden="true"
              />
            </IconButton>
          </Tooltip>
        </div>
      </nav>
    </header>
  );
}
