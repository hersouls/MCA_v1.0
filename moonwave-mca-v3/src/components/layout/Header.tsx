// ============================================
// Header Component
// ============================================

import { useState } from 'react';
import {
  Menu,
  Search,
  Sun,
  Moon,
  Monitor,
  Bell,
  Plus,
} from 'lucide-react';
import { Button, IconButton, Input } from '@/components/ui';
import { useUIStore } from '@/stores/uiStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { usePortfolioStore } from '@/stores/portfolioStore';
import type { ThemeMode } from '@/types';

interface HeaderProps {
  onAddPortfolio?: () => void;
}

export function Header({ onAddPortfolio }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleMobileMenu = useUIStore((state) => state.toggleMobileMenu);
  const searchQuery = useUIStore((state) => state.searchQuery);
  const setSearchQuery = useUIStore((state) => state.setSearchQuery);

  const theme = useSettingsStore((state) => state.settings.theme);
  const setTheme = useSettingsStore((state) => state.setTheme);

  const portfolios = usePortfolioStore((state) => state.portfolios);
  const alertCount = portfolios.filter((_p) => {
    // Check for gap alerts (simplified)
    return false; // Will be implemented with actual alert logic
  }).length;

  const cycleTheme = () => {
    const themeOrder: ThemeMode[] = ['light', 'dark', 'system'];
    const currentIndex = themeOrder.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    setTheme(themeOrder[nextIndex]);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="w-5 h-5" />;
      case 'dark':
        return <Moon className="w-5 h-5" />;
      default:
        return <Monitor className="w-5 h-5" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left: Mobile menu button + Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="메뉴 열기"
          >
            <Menu className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
          </button>

          {/* Logo - visible on mobile */}
          <div className="lg:hidden flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Moonwave"
              className="w-8 h-8 object-contain"
            />
            <span className="font-bold text-zinc-900 dark:text-zinc-100">MCA</span>
          </div>
        </div>

        {/* Center: Search (desktop) */}
        <div className="hidden lg:flex flex-1 max-w-md mx-4">
          <Input
            placeholder="종목 검색..."
            value={searchQuery}
            onChange={(value) => setSearchQuery(String(value))}
            leftIcon={<Search className="w-4 h-4" />}
            className="w-full"
          />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1">
          {/* Mobile search toggle */}
          <IconButton
            plain
            color="secondary"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="lg:hidden"
            aria-label="검색"
          >
            <Search className="w-5 h-5" />
          </IconButton>

          {/* Alert button */}
          <div className="relative">
            <IconButton plain color="secondary" aria-label="알림">
              <Bell className="w-5 h-5" />
            </IconButton>
            {alertCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-danger-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {alertCount}
              </span>
            )}
          </div>

          {/* Theme toggle */}
          <IconButton
            plain
            color="secondary"
            onClick={cycleTheme}
            aria-label={`테마 변경 (현재: ${theme})`}
          >
            {getThemeIcon()}
          </IconButton>

          {/* Add portfolio button */}
          {onAddPortfolio && (
            <Button
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={onAddPortfolio}
              className="hidden sm:flex"
            >
              새 종목
            </Button>
          )}

          {/* Mobile add button */}
          {onAddPortfolio && (
            <IconButton
              color="primary"
              onClick={onAddPortfolio}
              className="sm:hidden"
              aria-label="새 종목 추가"
            >
              <Plus className="w-5 h-5" />
            </IconButton>
          )}
        </div>
      </div>

      {/* Mobile search bar */}
      {isSearchOpen && (
        <div className="lg:hidden px-4 pb-3">
          <Input
            placeholder="종목 검색..."
            value={searchQuery}
            onChange={(value) => setSearchQuery(String(value))}
            leftIcon={<Search className="w-4 h-4" />}
            autoFocus
          />
        </div>
      )}
    </header>
  );
}
