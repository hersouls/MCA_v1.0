// ============================================
// useBroadcast Hook
// 크로스탭 동기화 기능
// ============================================

import {
  broadcastPortfolioCreated,
  broadcastPortfolioDeleted,
  broadcastPortfolioUpdated,
  broadcastSettingsChanged,
  broadcastThemeChanged,
  broadcastTradeToggled,
  closeBroadcastChannel,
  getTabId,
  initBroadcastChannel,
  isBroadcastSupported,
  onPortfolioCreated,
  onPortfolioDeleted,
  onPortfolioUpdated,
  onSettingsChanged,
  onSyncRequest,
  onSyncResponse,
  onThemeChanged,
  onTradeToggled,
  requestSync,
  respondToSync,
} from '@/services/broadcast';
import type { Portfolio, Settings } from '@/types';
import { useEffect, useRef } from 'react';

interface BroadcastHandlers {
  onPortfolioCreated?: (portfolio: Portfolio) => void;
  onPortfolioUpdated?: (portfolio: Portfolio) => void;
  onPortfolioDeleted?: (portfolioId: number) => void;
  onTradeToggled?: (data: { portfolioId: number; step: number; status: string }) => void;
  onSettingsChanged?: (settings: Partial<Settings>) => void;
  onThemeChanged?: (theme: 'light' | 'dark' | 'system') => void;
  onSyncRequest?: (requesterId: string) => void;
  onSyncResponse?: (data: { portfolios: Portfolio[]; settings: Settings }) => void;
}

interface UseBroadcastReturn {
  // 상태
  isSupported: boolean;
  tabId: string;

  // 송신 액션
  broadcastPortfolioCreated: typeof broadcastPortfolioCreated;
  broadcastPortfolioUpdated: typeof broadcastPortfolioUpdated;
  broadcastPortfolioDeleted: typeof broadcastPortfolioDeleted;
  broadcastTradeToggled: typeof broadcastTradeToggled;
  broadcastSettingsChanged: typeof broadcastSettingsChanged;
  broadcastThemeChanged: typeof broadcastThemeChanged;
  requestSync: typeof requestSync;
  respondToSync: typeof respondToSync;
}

/**
 * Broadcast Channel 훅
 * 자동으로 채널 초기화 및 정리
 */
export function useBroadcast(handlers?: BroadcastHandlers): UseBroadcastReturn {
  const cleanupRef = useRef<(() => void)[]>([]);
  const handlersRef = useRef(handlers);

  // Keep handlers ref updated without triggering effect re-run
  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  useEffect(() => {
    // 채널 초기화
    initBroadcastChannel();

    // 이벤트 핸들러 등록 (using refs to avoid stale closures)
    cleanupRef.current.push(
      onPortfolioCreated((portfolio) => handlersRef.current?.onPortfolioCreated?.(portfolio))
    );
    cleanupRef.current.push(
      onPortfolioUpdated((portfolio) => handlersRef.current?.onPortfolioUpdated?.(portfolio))
    );
    cleanupRef.current.push(
      onPortfolioDeleted((portfolioId) => handlersRef.current?.onPortfolioDeleted?.(portfolioId))
    );
    cleanupRef.current.push(onTradeToggled((data) => handlersRef.current?.onTradeToggled?.(data)));
    cleanupRef.current.push(
      onSettingsChanged((settings) => handlersRef.current?.onSettingsChanged?.(settings))
    );
    cleanupRef.current.push(
      onThemeChanged((theme) => handlersRef.current?.onThemeChanged?.(theme))
    );
    cleanupRef.current.push(
      onSyncRequest((requesterId) => handlersRef.current?.onSyncRequest?.(requesterId))
    );
    cleanupRef.current.push(onSyncResponse((data) => handlersRef.current?.onSyncResponse?.(data)));

    // 정리
    return () => {
      cleanupRef.current.forEach((cleanup) => cleanup());
      cleanupRef.current = [];
      closeBroadcastChannel();
    };
  }, []); // Empty dependency - only run once on mount

  return {
    isSupported: isBroadcastSupported(),
    tabId: getTabId(),
    broadcastPortfolioCreated,
    broadcastPortfolioUpdated,
    broadcastPortfolioDeleted,
    broadcastTradeToggled,
    broadcastSettingsChanged,
    broadcastThemeChanged,
    requestSync,
    respondToSync,
  };
}
