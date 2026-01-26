// ============================================
// useClipboard Hook
// 클립보드 데이터 파싱 및 자동 입력
// ============================================

import { trackFeatureUsage } from '@/services/analytics';
import {
  type GemParseResult,
  parseClipboardData,
  parseGeminiGemJson,
  readClipboard,
} from '@/services/clipboard';
import type { ClipboardParseResult } from '@/types';
import { useCallback, useState } from 'react';

// Check if clipboard API is supported
function checkClipboardSupport(): boolean {
  return typeof navigator !== 'undefined' && 'clipboard' in navigator;
}

interface UseClipboardReturn {
  // 상태
  isSupported: boolean;
  isParsing: boolean;
  lastResult: ClipboardParseResult | null;
  error: string | null;

  // 액션
  parseClipboard: () => Promise<ClipboardParseResult | null>;
  parseGemJson: () => Promise<GemParseResult | null>;
  parseText: (text: string) => ClipboardParseResult;
  clearResult: () => void;
}

/**
 * 클립보드 데이터 파싱 훅
 */
export function useClipboard(): UseClipboardReturn {
  const [isSupported] = useState(checkClipboardSupport);
  const [isParsing, setIsParsing] = useState(false);
  const [lastResult, setLastResult] = useState<ClipboardParseResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * 클립보드에서 데이터 읽고 파싱
   */
  const parseClipboard = useCallback(async (): Promise<ClipboardParseResult | null> => {
    if (!isSupported) {
      setError('클립보드 API가 지원되지 않습니다.');
      return null;
    }

    setIsParsing(true);
    setError(null);

    try {
      const text = await readClipboard();
      if (!text) {
        setError('클립보드가 비어있습니다.');
        setIsParsing(false);
        return null;
      }

      const result = parseClipboardData(text);
      setLastResult(result);

      if (result.success) {
        trackFeatureUsage('autoFit'); // 자동 파싱 사용 추적
      }

      setIsParsing(false);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : '클립보드 읽기 실패';
      setError(message);
      setIsParsing(false);
      return null;
    }
  }, [isSupported]);

  /**
   * Gemini Gem JSON 파싱
   */
  const parseGemJson = useCallback(async (): Promise<GemParseResult | null> => {
    if (!isSupported) {
      setError('클립보드 API가 지원되지 않습니다.');
      return null;
    }

    setIsParsing(true);
    setError(null);

    try {
      const text = await readClipboard();
      if (!text) {
        setError('클립보드가 비어있습니다.');
        setIsParsing(false);
        return null;
      }

      const result = parseGeminiGemJson(text);

      if (result.success) {
        trackFeatureUsage('fundamentalGrade');
      }

      setIsParsing(false);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gem JSON 파싱 실패';
      setError(message);
      setIsParsing(false);
      return null;
    }
  }, [isSupported]);

  /**
   * 직접 텍스트 파싱
   */
  const parseText = useCallback((text: string): ClipboardParseResult => {
    const result = parseClipboardData(text);
    setLastResult(result);
    return result;
  }, []);

  /**
   * 결과 초기화
   */
  const clearResult = useCallback(() => {
    setLastResult(null);
    setError(null);
  }, []);

  return {
    isSupported,
    isParsing,
    lastResult,
    error,
    parseClipboard,
    parseGemJson,
    parseText,
    clearResult,
  };
}
