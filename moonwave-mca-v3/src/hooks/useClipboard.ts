// ============================================
// useClipboard Hook
// 클립보드 데이터 파싱 및 자동 입력
// ============================================

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  parseClipboardData,
  readClipboard,
} from '@/services/clipboard';
import type { ClipboardParseResult } from '@/types';
import { trackFeatureUsage } from '@/services/analytics';

// Alias for consistency
export type ParseResult = ClipboardParseResult;

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
    parseText,
    clearResult,
  };
}

/**
 * 자동 클립보드 감지 훅
 * 페이지 포커스 시 클립보드 변경 감지
 */
export function useClipboardWatch(
  onDataParsed?: (result: ClipboardParseResult) => void,
  enabled = true
): { isWatching: boolean; toggle: () => void } {
  const [isWatching, setIsWatching] = useState(enabled);
  const lastClipboardTextRef = useRef<string>('');
  const onDataParsedRef = useRef(onDataParsed);
  const { isSupported } = useClipboard();

  // Keep callback ref updated
  useEffect(() => {
    onDataParsedRef.current = onDataParsed;
  }, [onDataParsed]);

  const toggle = useCallback(() => {
    setIsWatching((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!isWatching || !isSupported) return;

    const handleFocus = async () => {
      try {
        // 클립보드 권한이 있어야 작동
        const text = await navigator.clipboard.readText().catch(() => null);
        if (!text || text === lastClipboardTextRef.current) return;

        lastClipboardTextRef.current = text;
        const result = parseClipboardData(text);

        if (result?.success && onDataParsedRef.current) {
          onDataParsedRef.current(result);
        }
      } catch {
        // 클립보드 접근 실패 시 무시
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [isWatching, isSupported]);

  return { isWatching, toggle };
}

/**
 * 드래그 앤 드롭 파싱 훅
 */
export function useDropParse(
  onDataParsed?: (result: ClipboardParseResult) => void
): {
  isDragging: boolean;
  dragHandlers: {
    onDragOver: (e: React.DragEvent) => void;
    onDragEnter: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
  };
} {
  const [isDragging, setIsDragging] = useState(false);
  const { parseText } = useClipboard();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      // 텍스트 데이터 확인
      const text = e.dataTransfer.getData('text/plain');
      if (text) {
        const result = parseText(text);
        if (result.success && onDataParsed) {
          onDataParsed(result);
        }
        return;
      }

      // 파일 데이터 확인
      const files = Array.from(e.dataTransfer.files);
      const textFile = files.find(
        (f) =>
          f.type === 'text/plain' ||
          f.type === 'text/csv' ||
          f.type === 'application/json' ||
          f.name.endsWith('.txt') ||
          f.name.endsWith('.csv') ||
          f.name.endsWith('.json')
      );

      if (textFile) {
        try {
          const content = await textFile.text();
          const result = parseText(content);
          if (result.success && onDataParsed) {
            onDataParsed(result);
          }
        } catch (err) {
          console.error('Failed to read dropped file:', err);
        }
      }
    },
    [parseText, onDataParsed]
  );

  return {
    isDragging,
    dragHandlers: {
      onDragOver: handleDragOver,
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
    },
  };
}

export default useClipboard;
