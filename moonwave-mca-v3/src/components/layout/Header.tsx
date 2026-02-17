// ============================================
// Header Component
// ============================================

import { IconButton, Tooltip } from '@/components/ui';
import { NotificationDropdown } from '@/components/ui/NotificationDropdown';
import { useSettingsStore } from '@/stores/settingsStore';
import { useUIStore } from '@/stores/uiStore';
import type { ThemeMode } from '@/types';
import { BookOpen, Menu, Monitor, Moon, Plus, Sun } from 'lucide-react';

export function Header() {
  const isMobileMenuOpen = useUIStore((state) => state.isMobileMenuOpen);
  const toggleMobileMenu = useUIStore((state) => state.toggleMobileMenu);
  const openHandbook = useUIStore((state) => state.openHandbook);
  const openStockSearch = useUIStore((state) => state.openStockSearch);

  const theme = useSettingsStore((state) => state.settings.theme);
  const setTheme = useSettingsStore((state) => state.setTheme);

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
      className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg border-b border-border"
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
        {/* Left: Mobile menu button + Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-surface-hover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            aria-label={isMobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav"
          >
            <Menu className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
          </button>

          {/* Logo - visible on mobile */}
          <a
            href="/dashboard"
            className="lg:hidden flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-lg"
            aria-label="대시보드로 이동"
          >
            <img src="/logo.png" alt="" className="w-8 h-8 object-contain" aria-hidden="true" />
            <span className="font-bold text-foreground">MCA</span>
          </a>
        </div>

        {/* Center: Spacer */}
        <div className="flex-1" />

        {/* Right: Actions */}
        <div
          className="flex items-center gap-1"
          role="group"
          aria-label="헤더 액션"
        >
          {/* Notification dropdown */}
          <NotificationDropdown />

          {/* Handbook Button */}
          <div className="hidden sm:block" data-tour="header-handbook">
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

          {/* Add Stock Button */}
          <div data-tour="header-search">
            <Tooltip content="새 종목 추가" placement="bottom">
              <IconButton
                color="primary"
                onClick={openStockSearch}
                aria-label="새 종목 추가"
              >
                <Plus className="w-5 h-5" aria-hidden="true" />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </nav>
    </header>
  );
}
