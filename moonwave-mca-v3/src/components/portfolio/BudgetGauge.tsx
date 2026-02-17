// ============================================
// Budget Gauge Component
// 예산 소진 현황을 수평 Stacked Bar로 시각화
// ============================================

import { motion } from 'framer-motion';

import { Badge, Card } from '@/components/ui';
import type { BudgetUtilization } from '@/services/calculation';
import { formatAmountCompact } from '@/utils/format';
import { TEXTS } from '@/utils/texts';

interface BudgetGaugeProps {
  utilization: BudgetUtilization;
  market?: string;
}

export function BudgetGauge({ utilization, market }: BudgetGaugeProps) {
  const {
    executedAmount,
    orderedPendingAmount,
    remainingAmount,
    totalBudget,
    executedPct,
    orderedPct,
    remainingPct,
    isOverBudget,
  } = utilization;

  return (
    <Card>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">
          {TEXTS.PORTFOLIO.BUDGET_STATUS}
        </h3>
        {isOverBudget && (
          <Badge color="danger" size="sm">
            {TEXTS.PORTFOLIO.BUDGET_OVER}
          </Badge>
        )}
      </div>

      {/* Stacked Bar */}
      <div
        className={`h-3 rounded-full overflow-hidden flex bg-surface-active ${
          isOverBudget ? 'ring-2 ring-danger-500/30' : ''
        }`}
      >
        {executedPct > 0 && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${executedPct}%` }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            className="h-full bg-success-500 dark:bg-success-400"
          />
        )}
        {orderedPct > 0 && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${orderedPct}%` }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.25 }}
            className="h-full bg-warning-500 dark:bg-warning-400"
          />
        )}
        {!isOverBudget && remainingPct > 0 && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${remainingPct}%` }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
            className="h-full bg-surface-active"
          />
        )}
      </div>

      {/* Percentage Label */}
      <div className="flex justify-end mt-1">
        <span className="text-xs text-muted-foreground tabular-nums">
          {Math.round(executedPct + orderedPct)}%
        </span>
      </div>

      {/* Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
        <LegendItem
          color="bg-success-500 dark:bg-success-400"
          label={TEXTS.PORTFOLIO.BUDGET_EXECUTED}
          value={formatAmountCompact(executedAmount, market)}
        />
        <LegendItem
          color="bg-warning-500 dark:bg-warning-400"
          label={TEXTS.PORTFOLIO.BUDGET_PENDING}
          value={formatAmountCompact(orderedPendingAmount, market)}
        />
        <LegendItem
          color="bg-surface-active"
          label={TEXTS.PORTFOLIO.BUDGET_REMAINING}
          value={isOverBudget ? '-' : formatAmountCompact(remainingAmount, market)}
        />
      </div>

      {/* Budget Summary */}
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
        <span>
          {TEXTS.PORTFOLIO.BUDGET_TARGET}: {formatAmountCompact(totalBudget, market)}
        </span>
      </div>
    </Card>
  );
}

function LegendItem({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs">
      <span className={`w-2.5 h-2.5 rounded-sm flex-shrink-0 ${color}`} />
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground tabular-nums">{value}</span>
    </div>
  );
}
