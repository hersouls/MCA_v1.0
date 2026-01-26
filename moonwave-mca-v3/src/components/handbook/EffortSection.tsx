// ============================================
// EffortSection Component
// Progressive Disclosure 래퍼 컴포넌트
// ============================================

import { useUIStore } from '@/stores/uiStore';
import { clsx } from 'clsx';
import { useMemo } from 'react';
import type { EffortLevel } from './constants/handbookContent';

interface EffortSectionProps {
  /** 이 콘텐츠가 표시되는 레벨 (단일 또는 배열) */
  level: EffortLevel | EffortLevel[];
  children: React.ReactNode;
  className?: string;
  /** 페이드 인 애니메이션 활성화 */
  fade?: boolean;
}

/**
 * 현재 Effort 레벨에 따라 콘텐츠 표시 여부 결정
 * - Low 선택 시: level="low" 콘텐츠만 표시
 * - Medium 선택 시: level="low" + level="medium" 표시
 * - High 선택 시: 모든 콘텐츠 표시
 */
function isContentVisible(contentLevels: EffortLevel[], currentLevel: EffortLevel): boolean {
  const levelRank: Record<EffortLevel, number> = {
    low: 1,
    medium: 2,
    high: 3,
  };

  const currentRank = levelRank[currentLevel];
  return contentLevels.some((level) => levelRank[level] <= currentRank);
}

export function EffortSection({ level, children, className, fade = true }: EffortSectionProps) {
  const currentLevel = useUIStore((state) => state.handbookEffortLevel);

  const shouldRender = useMemo(() => {
    const levels = Array.isArray(level) ? level : [level];
    return isContentVisible(levels, currentLevel);
  }, [level, currentLevel]);

  if (!shouldRender) return null;

  return (
    <div className={clsx(fade && 'animate-in fade-in duration-200', className)}>{children}</div>
  );
}
