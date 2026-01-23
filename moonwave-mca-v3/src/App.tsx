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
        useUIStore.getState().setGlobalLoading(true, '앱 초기화 중...');

        // Check for v2 migration
        const migrated = localStorage.getItem('MCA_V3_MIGRATED');
        if (!migrated) {
          setIsMigrating(true);
          useUIStore.getState().setGlobalLoading(true, '기존 데이터 마이그레이션 중...');

          const result = await migrateFromV2();
          if (result.success) {
            console.log('v2 → v3 마이그레이션 완료');
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
        console.error('초기화 실패:', error);
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
          message={isMigrating ? '기존 데이터를 마이그레이션 중입니다...' : '앱을 초기화하는 중...'}
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
