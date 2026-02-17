// ============================================
// Execution Timeline Component
// 체결 이력을 시간순으로 시각화
// ============================================

import { clsx } from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Clock } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Card } from '@/components/ui';
import type { CalculatedTrade } from '@/types';
import { formatAmountCompact, formatPercent, formatPrice } from '@/utils/format';

interface ExecutionTimelineProps {
  trades: CalculatedTrade[];
  executionDates: Record<number, string>;
  market?: string;
}

const DEFAULT_VISIBLE = 5;

export function ExecutionTimeline({ trades, executionDates, market }: ExecutionTimelineProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const executedTrades = useMemo(() => [...trades.filter((t) => t.isExecuted)].reverse(), [trades]);

  if (executedTrades.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-dashed border-border bg-surface-hover py-8">
        <p className="text-sm text-muted-foreground">아직 체결된 구간이 없습니다</p>
      </div>
    );
  }

  const displayedTrades = isExpanded ? executedTrades : executedTrades.slice(0, DEFAULT_VISIBLE);
  const hasMore = executedTrades.length > DEFAULT_VISIBLE;

  const getGapColor = (gap: number) => {
    if (gap < -5) return 'text-success-600 dark:text-success-400';
    if (gap > 5) return 'text-danger-600 dark:text-danger-400';
    return 'text-muted-foreground';
  };

  return (
    <Card padding="md">
      <div className="relative">
        {/* Vertical connector line */}
        <div className="absolute left-[11px] top-0 bottom-0 w-px bg-border" />

        <AnimatePresence initial={false}>
          {displayedTrades.map((trade, index) => {
            const date = executionDates[trade.step];
            return (
              <motion.div
                key={trade.step}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ delay: index * 0.03, duration: 0.2 }}
                className="relative pl-8 pb-5 last:pb-0"
              >
                {/* Timeline dot */}
                <div className="absolute left-0 top-1 w-[22px] h-[22px] rounded-full bg-success-100 dark:bg-success-900/50 flex items-center justify-center z-10">
                  <div className="w-2.5 h-2.5 rounded-full bg-success-500" />
                </div>

                {/* Date label */}
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-medium text-muted-foreground">
                    {date || (
                      <span className="flex items-center gap-1 text-muted-foreground/60">
                        <Clock className="w-3 h-3" />
                        날짜 미입력
                      </span>
                    )}
                  </span>
                </div>

                {/* Trade info */}
                <div className="text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-foreground">{trade.step}구간 체결</span>
                    <span className="text-muted-foreground tabular-nums">
                      {formatPrice(trade.buyPrice, market)} × {trade.quantity}주 ={' '}
                      {formatAmountCompact(trade.amount, market)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="tabular-nums">누적: {trade.cumulativeQty}주</span>
                    <span className="text-border">|</span>
                    <span className="tabular-nums">
                      평단: {formatPrice(trade.avgPrice, market)}
                    </span>
                    <span className="text-border">|</span>
                    <span className={clsx('tabular-nums', getGapColor(trade.gap))}>
                      괴리율: {formatPercent(trade.gap)}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Expand/Collapse Toggle */}
      {hasMore && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 mt-3 pt-3 border-t border-border text-xs text-muted-foreground hover:text-foreground transition-colors w-full justify-center"
        >
          <span>
            {isExpanded ? '접기' : `더 보기 (${executedTrades.length - DEFAULT_VISIBLE}개)`}
          </span>
          <ChevronDown
            className={clsx('w-3.5 h-3.5 transition-transform', isExpanded && 'rotate-180')}
          />
        </button>
      )}
    </Card>
  );
}
