// ============================================
// Trade Card Component (Mobile View)
// ============================================

import { Card, DateInput } from '@/components/ui';
import type { CalculatedTrade } from '@/types';
import { formatCurrency, formatKoreanUnit, formatPercent } from '@/utils/format';
import { clsx } from 'clsx';
import { AlertTriangle, Check, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TradeCardProps {
  trade: CalculatedTrade;
  executionDate?: string;
  memo?: string;
  onToggleOrdered: () => void;
  onToggleExecuted: () => void;
  onDateChange?: (date: string) => void;
  onMemoChange?: (memo: string) => void;
}

export function TradeCard({
  trade,
  executionDate = '',
  memo = '',
  onToggleOrdered,
  onToggleExecuted,
  onDateChange,
  onMemoChange,
}: TradeCardProps) {
  const [savedField, setSavedField] = useState<string | null>(null);

  // Clear savedField after 2 seconds
  useEffect(() => {
    if (savedField) {
      const timer = setTimeout(() => setSavedField(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [savedField]);

  const handleDateChange = (date: string) => {
    onDateChange?.(date);
    setSavedField('date');
  };

  const handleMemoChange = (value: string) => {
    onMemoChange?.(value);
    setSavedField('memo');
  };

  const getCardVariant = () => {
    if (trade.isExecuted)
      return 'border-success-300 dark:border-success-700 bg-success-50/50 dark:bg-success-900/20';
    if (trade.isOrdered)
      return 'border-warning-300 dark:border-warning-700 bg-warning-50/50 dark:bg-warning-900/20';
    return '';
  };

  const getGapColor = () => {
    if (!trade.isExecuted && !trade.isOrdered) return 'text-muted-foreground';
    if (trade.gap < -5) return 'text-success-600 dark:text-success-400';
    if (trade.gap > 5) return 'text-danger-600 dark:text-danger-400';
    return 'text-muted-foreground';
  };

  return (
    <Card variant="bordered" padding="sm" className={clsx('transition-colors', getCardVariant())}>
      {/* Header: Step + Status Buttons */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Step Badge */}
          <span
            className={clsx(
              'inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold',
              trade.isExecuted
                ? 'bg-success-100 text-success-700 dark:bg-success-900/50 dark:text-success-300'
                : trade.isOrdered
                  ? 'bg-warning-100 text-warning-700 dark:bg-warning-900/50 dark:text-warning-300'
                  : 'bg-surface-hover text-muted-foreground'
            )}
          >
            {trade.step}
          </span>
          {/* Price Info */}
          <div>
            <p className="text-sm font-semibold text-foreground tabular-nums">
              {formatCurrency(trade.buyPrice)}
            </p>
            <p className="text-xs text-muted-foreground">-{trade.dropRate}%</p>
          </div>
        </div>

        {/* Status Buttons */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-muted-foreground">주문</span>
            <button
              onClick={onToggleOrdered}
              className={clsx(
                'min-w-[44px] min-h-[44px] rounded-lg border-2 flex items-center justify-center transition-all',
                trade.isOrdered
                  ? 'bg-warning-500 border-warning-500 text-white'
                  : 'border-border hover:border-warning-400'
              )}
              aria-label={`${trade.step}구간 주문 ${trade.isOrdered ? '취소' : '등록'}`}
            >
              {trade.isOrdered && <Clock className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-muted-foreground">체결</span>
            <button
              onClick={onToggleExecuted}
              disabled={!trade.isOrdered}
              className={clsx(
                'min-w-[44px] min-h-[44px] rounded-lg border-2 flex items-center justify-center transition-all',
                trade.isExecuted
                  ? 'bg-success-500 border-success-500 text-white'
                  : trade.isOrdered
                    ? 'border-border hover:border-success-400'
                    : 'opacity-30 cursor-not-allowed border-border'
              )}
              aria-label={`${trade.step}구간 체결 ${trade.isExecuted ? '취소' : '등록'}`}
            >
              {trade.isExecuted && <Check className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Body: Key Stats Grid */}
      <div className="grid grid-cols-3 gap-3 text-sm">
        <div>
          <span className="text-muted-foreground text-xs block">수량</span>
          <p className="font-medium tabular-nums text-foreground">
            {trade.quantity.toLocaleString()}주
          </p>
        </div>
        <div>
          <span className="text-muted-foreground text-xs block">금액</span>
          <p className="font-medium tabular-nums text-foreground">
            {formatKoreanUnit(trade.amount)}
          </p>
        </div>
        <div>
          <span className="text-muted-foreground text-xs block">괴리율</span>
          <p className={clsx('font-medium tabular-nums flex items-center gap-1', getGapColor())}>
            {trade.isExecuted || trade.isOrdered ? (
              <>
                {trade.gap < -10 && <AlertTriangle className="w-3 h-3 text-danger-500" />}
                {formatPercent(trade.gap)}
              </>
            ) : (
              '-'
            )}
          </p>
        </div>
      </div>

      {/* Execution Info (체결 시에만 표시) */}
      {trade.isExecuted && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground text-xs block">평단가</span>
              <p className="font-bold text-primary-600 dark:text-primary-400 tabular-nums">
                {formatCurrency(trade.avgPrice)}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground text-xs block">실 수량</span>
              <p className="font-bold text-foreground tabular-nums">
                {trade.realQty.toLocaleString()}주
              </p>
            </div>
          </div>

          {/* Date & Memo Inputs */}
          <div className="mt-3 flex gap-2">
            <DateInput
              value={executionDate}
              onChange={handleDateChange}
              className={clsx(
                'flex-shrink-0 w-32',
                savedField === 'date' && '[&_input]:ring-2 [&_input]:ring-success-500'
              )}
              aria-label="체결일"
            />
            <input
              type="text"
              value={memo}
              onChange={(e) => handleMemoChange(e.target.value)}
              placeholder="메모"
              className={clsx(
                'flex-1 min-w-0 bg-transparent text-xs text-foreground placeholder-muted-foreground border border-border rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all',
                savedField === 'memo' && 'ring-2 ring-success-500'
              )}
              aria-label="메모"
            />
          </div>
        </div>
      )}
    </Card>
  );
}
