// ============================================
// Next Action Banner Component
// 다음 매수 구간 정보를 컴팩트하게 표시
// ============================================

import { ArrowDown, CheckCircle2, Clock } from 'lucide-react';

import { Badge } from '@/components/ui';
import type { CalculatedTrade } from '@/types';
import { formatPrice } from '@/utils/format';
import { TEXTS } from '@/utils/texts';

interface NextActionBannerProps {
  nextActionStep: CalculatedTrade | null;
  pendingExecutionCount: number;
  market?: string;
}

export function NextActionBanner({
  nextActionStep,
  pendingExecutionCount,
  market,
}: NextActionBannerProps) {
  // 모든 구간 주문 완료 + 체결 대기 없음
  if (!nextActionStep && pendingExecutionCount === 0) {
    return (
      <div className="flex items-center gap-2 rounded-lg px-4 py-2.5 bg-success-50/50 dark:bg-success-900/20 border border-success-200/50 dark:border-success-800/30">
        <CheckCircle2 className="w-4 h-4 text-success-600 dark:text-success-400 flex-shrink-0" />
        <span className="text-sm font-medium text-success-700 dark:text-success-300">
          {TEXTS.PORTFOLIO.ALL_ORDERED}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 rounded-lg px-4 py-2.5 bg-primary-50/50 dark:bg-primary-900/20 border border-primary-200/50 dark:border-primary-800/30">
      {/* Next Buy Step */}
      {nextActionStep && (
        <div className="flex items-center gap-2">
          <ArrowDown className="w-4 h-4 text-primary-600 dark:text-primary-400 flex-shrink-0" />
          <span className="text-sm text-foreground">
            <span className="font-medium">{TEXTS.PORTFOLIO.NEXT_ACTION}:</span>{' '}
            <span className="tabular-nums">
              {nextActionStep.step}구간{' '}
              {formatPrice(nextActionStep.buyPrice, market)}{' '}
              <span className="text-muted-foreground">(-{nextActionStep.dropRate}%)</span>
            </span>
          </span>
        </div>
      )}

      {/* Separator */}
      {nextActionStep && pendingExecutionCount > 0 && (
        <span className="hidden sm:block text-border">|</span>
      )}

      {/* Pending Execution Count */}
      {pendingExecutionCount > 0 && (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-warning-600 dark:text-warning-400 flex-shrink-0" />
          <span className="text-sm text-foreground">
            {TEXTS.PORTFOLIO.PENDING_EXECUTION}:{' '}
            <Badge color="warning" size="sm">{pendingExecutionCount}개</Badge>
          </span>
        </div>
      )}
    </div>
  );
}
