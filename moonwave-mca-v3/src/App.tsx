// ============================================
// Main App Component
// ============================================

import { useEffect, useState, useCallback } from 'react';
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

  const initializePortfolios = usePortfolioStore((state) => state.initialize);
  const initializeSettings = useSettingsStore((state) => state.initialize);
  const setGlobalLoading = useUIStore((state) => state.setGlobalLoading);
  const addPortfolio = usePortfolioStore((state) => state.addPortfolio);

  // Initialize app
  useEffect(() => {
    async function init() {
      try {
        setGlobalLoading(true, '앱 초기화 중...');

        // Check for v2 migration
        const migrated = localStorage.getItem('MCA_V3_MIGRATED');
        if (!migrated) {
          setIsMigrating(true);
          setGlobalLoading(true, '기존 데이터 마이그레이션 중...');

          const hasMigrated = await migrateFromV2();
          if (hasMigrated) {
            console.log('v2 → v3 마이그레이션 완료');
          }

          setIsMigrating(false);
        }

        // Initialize stores
        await Promise.all([initializeSettings(), initializePortfolios()]);

        setIsInitialized(true);
      } catch (error) {
        console.error('초기화 실패:', error);
      } finally {
        setGlobalLoading(false);
      }
    }

    init();
  }, [initializePortfolios, initializeSettings, setGlobalLoading]);

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
