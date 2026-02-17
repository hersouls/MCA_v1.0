// ============================================
// Main App Component
// ============================================

import { useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { HandbookPanel } from '@/components/handbook/HandbookPanel';
import { OnboardingTour } from '@/components/onboarding/OnboardingTour';
import {
  BottomNav,
  Footer,
  Header,
  LoadingState,
  MobileNav,
  SettingsModal,
  Sidebar,
  TermsModal,
  FAQModal,
} from '@/components/layout';
import { StockSearchModal } from '@/components/portfolio/StockSearchModal';
import { ToastContainer } from '@/components/ui';

import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { migrateFromV2 } from '@/services/migration';
import { useExchangeRateStore } from '@/stores/exchangeRateStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { usePortfolioStore } from '@/stores/portfolioStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useUIStore } from '@/stores/uiStore';
import { STORAGE_KEYS } from '@/utils/constants';
import { TEXTS } from '@/utils/texts';

export function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const initRef = useRef(false);

  // Global keyboard shortcuts
  useKeyboardShortcuts();


  // Initialize app - run only once
  useEffect(() => {
    // Prevent double initialization (StrictMode or re-mount)
    if (initRef.current) return;
    initRef.current = true;

    async function init() {
      try {
        useUIStore.getState().setGlobalLoading(true, TEXTS.COMMON.APP_INIT);

        // Check for v2 migration
        const migrated = localStorage.getItem(STORAGE_KEYS.V3_MIGRATED);
        if (!migrated) {
          setIsMigrating(true);
          useUIStore.getState().setGlobalLoading(true, TEXTS.COMMON.MIGRATION_IN_PROGRESS);

          await migrateFromV2();

          setIsMigrating(false);
        }

        // Initialize stores using direct store access to avoid dependency issues
        await Promise.all([
          useSettingsStore.getState().initialize(),
          usePortfolioStore.getState().initialize(),
          useExchangeRateStore.getState().initialize(),
        ]);

        // Cleanup expired notifications first
        useNotificationStore.getState().cleanupExpired();

        // Check backup reminder notification
        const settings = useSettingsStore.getState().settings;
        useNotificationStore.getState().checkBackupReminder(settings.lastBackupDate);

        // Check gap warnings for all portfolios
        const { portfolios, portfolioStats } = usePortfolioStore.getState();
        useNotificationStore.getState().checkGapWarnings(portfolios, portfolioStats);

        setIsInitialized(true);
      } catch (error) {
        console.error(TEXTS.COMMON.INIT_FAILED, error);
        setIsInitialized(true); // Still show app even on error
      } finally {
        useUIStore.getState().setGlobalLoading(false);
      }
    }

    init();
  }, []); // Empty deps - run only on mount

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingState
          message={
            isMigrating ? TEXTS.COMMON.MIGRATION_IN_PROGRESS_LONG : TEXTS.COMMON.APP_INIT_LONG
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Navigation Drawer */}
      <MobileNav />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Header */}
        <Header />

        {/* Page Content - rendered by router */}
        <Outlet />

        {/* Footer */}
        <Footer />
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Toast Container */}
      <ToastContainer />

      {/* Settings Modal */}
      <SettingsModal />

      {/* Terms Modal */}
      <TermsModal />

      {/* Global Stock Search Modal */}
      <GlobalStockSearch />

      {/* Handbook Modal */}
      <HandbookPanel />

      {/* FAQ Modal */}
      <FAQModal />

      {/* Onboarding Tour */}
      <OnboardingTour />
    </div>
  );
}

// Global Stock Search Modal wrapper
function GlobalStockSearch() {
  const isOpen = useUIStore((state) => state.isStockSearchOpen);
  const closeStockSearch = useUIStore((state) => state.closeStockSearch);

  return <StockSearchModal open={isOpen} onClose={closeStockSearch} />;
}
