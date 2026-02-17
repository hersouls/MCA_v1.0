// ============================================
// Portfolio Health Badge Component
// 포트폴리오 건강도 스코어를 원형 배지로 표시
// ============================================

import type { HealthScore } from '@/services/portfolioHealth';
import { Tooltip } from '@/components/ui/Tooltip';
import { clsx } from 'clsx';

interface PortfolioHealthBadgeProps {
  score: HealthScore;
  size?: 'sm' | 'md';
}

const colorMap = {
  good: 'bg-success-100 text-success-700 dark:bg-success-900/50 dark:text-success-300',
  caution: 'bg-warning-100 text-warning-700 dark:bg-warning-900/50 dark:text-warning-300',
  warning: 'bg-danger-100 text-danger-700 dark:bg-danger-900/50 dark:text-danger-300',
};

const sizeMap = {
  sm: 'w-7 h-7 text-[10px]',
  md: 'w-9 h-9 text-xs',
};

export function PortfolioHealthBadge({ score, size = 'sm' }: PortfolioHealthBadgeProps) {
  return (
    <Tooltip
      content={`건강도: ${score.total}점`}
      placement="bottom"
    >
      <span
        className={clsx(
          'inline-flex items-center justify-center rounded-full font-bold tabular-nums',
          sizeMap[size],
          colorMap[score.label]
        )}
        aria-label={`건강도 ${score.total}점`}
      >
        {score.total}
      </span>
    </Tooltip>
  );
}
