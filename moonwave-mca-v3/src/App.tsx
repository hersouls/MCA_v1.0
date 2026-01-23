// ============================================
// Main App Component
// ============================================

import { useEffect, useState, useCallback, useRef } from 'react';
import { Outlet } from 'react-router-dom';

import { Header, Sidebar, MobileNav, BottomNav, LoadingState } from '@/components/layout';
import { ToastContainer } from '@/components/ui';

import { usePortfolioStore } from '@/stores/portfolioStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useUIStore } from '@/stores/uiStore';
import { migrateFromV2 } from '@/services/migration';
import { STORAGE_KEYS } from '@/utils/constants';
import { TEXTS } from '@/utils/texts';

export function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const initRef = useRef(false);

  const addPortfolio = usePortfolioStore((state) => state.addPortfolio);

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

          const result = await migrateFromV2();
          if (result.success) {
            console.log(TEXTS.COMMON.MIGRATION_COMPLETE);
          }

          setIsMigrating(false);
        }

        // Initialize stores using direct store access to avoid dependency issues
        await Promise.all([
          useSettingsStore.getState().initialize(),
          usePortfolioStore.getState().initialize(),
        ]);

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

  const handleAddPortfolio = useCallback(async () => {
    await addPortfolio();
  }, [addPortfolio]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <LoadingState
          message={isMigrating ? TEXTS.COMMON.MIGRATION_IN_PROGRESS_LONG : TEXTS.COMMON.APP_INIT_LONG}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-zinc-50 dark:bg-zinc-950">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Navigation Drawer */}
      <MobileNav onAddPortfolio={handleAddPortfolio} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Header */}
        <Header onAddPortfolio={handleAddPortfolio} />

        {/* Page Content - rendered by router */}
        <Outlet />
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}

export default App;
