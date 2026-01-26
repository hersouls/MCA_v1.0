// ============================================
// useShare Hook
// Web Share API 및 공유 기능
// ============================================

import { trackFeatureUsage } from '@/services/analytics';
import {
  copyShareLink,
  createPortfolioQRData,
  generateDeepLink,
  generateQRCodeDataURL,
  getAvailableShareMethods,
  isWebShareSupported,
  sharePortfolio,
} from '@/services/share';
import type { Portfolio } from '@/types';
import { useCallback, useState } from 'react';

interface UseShareReturn {
  // 상태
  isSupported: boolean;
  isSharing: boolean;
  error: string | null;
  availableMethods: string[];

  // 액션
  share: (portfolio: Portfolio) => Promise<boolean>;
  copyLink: (portfolio: Portfolio) => Promise<boolean>;
  generateQR: (portfolio: Portfolio) => Promise<string | null>;
}

/**
 * 공유 기능 훅
 */
export function useShare(): UseShareReturn {
  const [isSupported] = useState(isWebShareSupported);
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableMethods] = useState(getAvailableShareMethods);

  /**
   * 포트폴리오 공유 (Web Share API)
   */
  const share = useCallback(async (portfolio: Portfolio): Promise<boolean> => {
    setIsSharing(true);
    setError(null);

    try {
      const success = await sharePortfolio(portfolio);
      if (success) {
        trackFeatureUsage('share');
      }
      setIsSharing(false);
      return success;
    } catch (err) {
      const message = err instanceof Error ? err.message : '공유 실패';
      setError(message);
      setIsSharing(false);
      return false;
    }
  }, []);

  /**
   * 딥링크 복사
   */
  const copyLink = useCallback(async (portfolio: Portfolio): Promise<boolean> => {
    setError(null);

    try {
      const deepLink = generateDeepLink(portfolio.params);
      const success = await copyShareLink(deepLink);

      if (success) {
        trackFeatureUsage('share');
      } else {
        setError('링크 복사 실패');
      }

      return success;
    } catch (err) {
      const message = err instanceof Error ? err.message : '링크 복사 실패';
      setError(message);
      return false;
    }
  }, []);

  /**
   * QR 코드 생성
   */
  const generateQR = useCallback(async (portfolio: Portfolio): Promise<string | null> => {
    setError(null);

    try {
      const qrData = createPortfolioQRData(portfolio);
      const dataUrl = await generateQRCodeDataURL(qrData.payload, 256);

      if (dataUrl) {
        trackFeatureUsage('qrShare');
      }

      return dataUrl;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'QR 코드 생성 실패';
      setError(message);
      return null;
    }
  }, []);

  return {
    isSupported,
    isSharing,
    error,
    availableMethods,
    share,
    copyLink,
    generateQR,
  };
}
