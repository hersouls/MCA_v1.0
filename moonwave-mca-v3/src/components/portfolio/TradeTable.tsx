// ============================================
// MCA Trade Table Component
// Interactive table with order/execute toggles
// ============================================

import { Card, DateInput, Tooltip } from '@/components/ui';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { calculateTrades } from '@/services/calculation';
import type { CalculatedTrade, PortfolioParams } from '@/types';
import { formatAmountCompact, formatPercent, formatPrice } from '@/utils/format';
import { clsx } from 'clsx';
import { AlertTriangle, Check, Clock } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { TradeCard } from './TradeCard';

interface TradeTableProps {
  params: PortfolioParams;
  orderedSteps: number[];
  executedSteps: number[];
  onToggleOrdered: (step: number) => void;
  onToggleExecuted: (step: number) => void;
  executionDates?: Record<number, string>;
  stepMemos?: Record<number, string>;
  onDateChange?: (step: number, date: string) => void;
  onMemoChange?: (step: number, memo: string) => void;
  market?: string;
  highlightStep?: number;
}

export function TradeTable({
  params,
  orderedSteps,
  executedSteps,
  onToggleOrdered,
  onToggleExecuted,
  executionDates = {},
  stepMemos = {},
  onDateChange,
  onMemoChange,
  market,
  highlightStep,
}: TradeTableProps) {
  const trades = useMemo(
    () => calculateTrades(params, orderedSteps, executedSteps, market),
    [params, orderedSteps, executedSteps, market]
  );

  // Calculate totals
  const totals = useMemo(() => {
    const ordered = trades.filter((t) => t.isOrdered);
    const executed = trades.filter((t) => t.isExecuted);
    const lastExecuted = executed[executed.length - 1];

    return {
      orderedQty: ordered.reduce((sum, t) => sum + t.quantity, 0),
      orderedAmt: ordered.reduce((sum, t) => sum + t.amount, 0),
      executedQty: executed.reduce((sum, t) => sum + t.quantity, 0) + params.legacyQty,
      executedAmt:
        executed.reduce((sum, t) => sum + t.amount, 0) + params.legacyQty * params.legacyAvg,
      avgPrice: executed.length > 0 ? executed[executed.length - 1].avgPrice : 0,
      realQty: lastExecuted?.realQty ?? params.legacyQty,
      realAmount: lastExecuted?.realAmount ?? params.legacyQty * params.legacyAvg,
    };
  }, [trades, params.legacyQty, params.legacyAvg]);

  const handleDateChange = useCallback(
    (step: number, date: string) => {
      onDateChange?.(step, date);
    },
    [onDateChange]
  );

  const handleMemoChange = useCallback(
    (step: number, memo: string) => {
      onMemoChange?.(step, memo);
    },
    [onMemoChange]
  );

  const isMobile = useIsMobile();

  // Mobile: Card View
  if (isMobile) {
    return (
      <div className="space-y-3">
        {trades.map((trade) => (
          <TradeCard
            key={trade.step}
            trade={trade}
            executionDate={executionDates[trade.step] || ''}
            memo={stepMemos[trade.step] || ''}
            onToggleOrdered={() => onToggleOrdered(trade.step)}
            onToggleExecuted={() => onToggleExecuted(trade.step)}
            onDateChange={(date) => handleDateChange(trade.step, date)}
            onMemoChange={(memo) => handleMemoChange(trade.step, memo)}
            isHighlighted={trade.step === highlightStep}
          />
        ))}
        {/* Mobile Summary Card */}
        <Card variant="elevated" padding="md">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground text-xs block">체결 수량</span>
              <p className="font-bold text-foreground tabular-nums">
                {totals.realQty.toLocaleString()}주
              </p>
            </div>
            <div>
              <span className="text-muted-foreground text-xs block">체결 금액</span>
              <p className="font-bold text-foreground tabular-nums">
                {formatAmountCompact(totals.realAmount, market)}
              </p>
            </div>
            <div className="col-span-2">
              <span className="text-muted-foreground text-xs block">평균 단가</span>
              <p className="font-bold text-primary-600 dark:text-primary-400 tabular-nums text-lg">
                {totals.avgPrice > 0 ? formatPrice(totals.avgPrice, market) : '-'}
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Desktop: Table View
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-surface-hover border-b border-border">
            <tr>
              <th className="px-3 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider w-16">
                <Tooltip content="예약 매수 주문 등록 여부" placement="bottom">
                  <span className="cursor-help">주문</span>
                </Tooltip>
              </th>
              <th className="px-3 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider w-16">
                <Tooltip content="실제 매수 체결 완료 여부" placement="bottom">
                  <span className="cursor-help">체결</span>
                </Tooltip>
              </th>
              <th className="px-3 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider w-14">
                <Tooltip content="분할 매수 구간 번호" placement="bottom">
                  <span className="cursor-help">구간</span>
                </Tooltip>
              </th>
              <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <Tooltip content="고점 대비 하락률" placement="bottom">
                  <span className="cursor-help">하락률</span>
                </Tooltip>
              </th>
              <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <Tooltip content="해당 구간 매수 단가" placement="bottom">
                  <span className="cursor-help">매수가</span>
                </Tooltip>
              </th>
              <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <Tooltip content="해당 구간 매수 수량" placement="bottom">
                  <span className="cursor-help">수량</span>
                </Tooltip>
              </th>
              <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <Tooltip content="해당 구간 매수 금액" placement="bottom">
                  <span className="cursor-help">금액</span>
                </Tooltip>
              </th>
              {/* Accumulated columns */}
              <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider border-l border-border">
                <Tooltip content="체결 시 누적 보유 수량" placement="bottom">
                  <span className="cursor-help">실 수량</span>
                </Tooltip>
              </th>
              <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <Tooltip content="체결 시 누적 투자 금액" placement="bottom">
                  <span className="cursor-help">실 총액</span>
                </Tooltip>
              </th>
              <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <Tooltip content="현재 평균 매수 단가" placement="bottom">
                  <span className="cursor-help">평단가</span>
                </Tooltip>
              </th>
              <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <Tooltip content="이론 금액과 실제 금액의 괴리율" placement="bottom">
                  <span className="cursor-help">괴리율</span>
                </Tooltip>
              </th>
              <th className="px-3 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider border-l border-border w-28">
                <Tooltip content="실제 매수 체결 일자" placement="bottom">
                  <span className="cursor-help">체결일</span>
                </Tooltip>
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider min-w-[120px]">
                비고
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {trades.map((trade) => (
              <TradeRow
                key={trade.step}
                trade={trade}
                executionDate={executionDates[trade.step] || ''}
                memo={stepMemos[trade.step] || ''}
                onToggleOrdered={() => onToggleOrdered(trade.step)}
                onToggleExecuted={() => onToggleExecuted(trade.step)}
                onDateChange={(date) => handleDateChange(trade.step, date)}
                onMemoChange={(memo) => handleMemoChange(trade.step, memo)}
                market={market}
                isHighlighted={trade.step === highlightStep}
              />
            ))}
          </tbody>
          <tfoot className="bg-surface-hover border-t-2 border-border">
            <tr>
              <td
                colSpan={5}
                className="px-3 py-3 text-right font-semibold text-foreground"
              >
                합계
              </td>
              <td className="px-3 py-3 text-right font-bold text-foreground tabular-nums whitespace-nowrap">
                {totals.executedQty.toLocaleString()}주
              </td>
              <td className="px-3 py-3 text-right font-bold text-foreground tabular-nums whitespace-nowrap">
                {formatAmountCompact(totals.executedAmt, market)}
              </td>
              {/* Real totals */}
              <td className="px-3 py-3 text-right font-bold text-foreground tabular-nums border-l border-border whitespace-nowrap">
                {totals.realQty.toLocaleString()}주
              </td>
              <td className="px-3 py-3 text-right font-bold text-foreground tabular-nums whitespace-nowrap">
                {formatAmountCompact(totals.realAmount, market)}
              </td>
              <td className="px-3 py-3 text-right font-bold text-primary-600 dark:text-primary-400 tabular-nums whitespace-nowrap">
                {totals.avgPrice > 0 ? formatPrice(totals.avgPrice, market) : '-'}
              </td>
              <td className="px-3 py-3"></td>
              <td className="px-3 py-3 border-l border-border"></td>
              <td className="px-3 py-3"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

// Individual Trade Row
interface TradeRowProps {
  trade: CalculatedTrade;
  executionDate: string;
  memo: string;
  onToggleOrdered: () => void;
  onToggleExecuted: () => void;
  onDateChange: (date: string) => void;
  onMemoChange: (memo: string) => void;
  market?: string;
  isHighlighted?: boolean;
}

function TradeRow({
  trade,
  executionDate,
  memo,
  market,
  onToggleOrdered,
  onToggleExecuted,
  onDateChange,
  onMemoChange,
  isHighlighted,
}: TradeRowProps) {
  const getRowClass = () => {
    const highlight = isHighlighted ? ' ring-2 ring-inset ring-primary-500/30' : '';
    if (trade.isExecuted) {
      return `bg-success-50/50 dark:bg-success-900/20${highlight}`;
    }
    if (trade.isOrdered) {
      return `bg-warning-50/50 dark:bg-warning-900/20${highlight}`;
    }
    return highlight;
  };

  const getGapColor = () => {
    if (!trade.isExecuted && !trade.isOrdered) return 'text-muted-foreground';
    if (trade.gap < -5) return 'text-success-600 dark:text-success-400';
    if (trade.gap > 5) return 'text-danger-600 dark:text-danger-400';
    return 'text-muted-foreground';
  };

  return (
    <tr
      className={clsx(
        'transition-colors hover:bg-surface-hover',
        getRowClass()
      )}
    >
      {/* Order Checkbox */}
      <td className="px-3 py-2.5 text-center">
        <button
          onClick={onToggleOrdered}
          className={clsx(
            'w-6 h-6 rounded border-2 flex items-center justify-center transition-all',
            trade.isOrdered
              ? 'bg-warning-500 border-warning-500 text-white'
              : 'border-border hover:border-warning-400 dark:hover:border-warning-500'
          )}
          aria-label={`${trade.step}구간 주문 ${trade.isOrdered ? '취소' : '등록'}`}
        >
          {trade.isOrdered && <Clock className="w-3.5 h-3.5" />}
        </button>
      </td>

      {/* Execute Checkbox */}
      <td className="px-3 py-2.5 text-center">
        <button
          onClick={onToggleExecuted}
          disabled={!trade.isOrdered}
          className={clsx(
            'w-6 h-6 rounded border-2 flex items-center justify-center transition-all',
            trade.isExecuted
              ? 'bg-success-500 border-success-500 text-white'
              : trade.isOrdered
                ? 'border-border hover:border-success-400 dark:hover:border-success-500'
                : 'border-border opacity-30 cursor-not-allowed'
          )}
          aria-label={`${trade.step}구간 체결 ${trade.isExecuted ? '취소' : '등록'}`}
        >
          {trade.isExecuted && <Check className="w-3.5 h-3.5" />}
        </button>
      </td>

      {/* Step */}
      <td className="px-3 py-2.5 text-center">
        <span
          className={clsx(
            'inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold',
            trade.isExecuted
              ? 'bg-success-100 text-success-700 dark:bg-success-900/50 dark:text-success-300'
              : trade.isOrdered
                ? 'bg-warning-100 text-warning-700 dark:bg-warning-900/50 dark:text-warning-300'
                : 'bg-surface-hover text-muted-foreground'
          )}
        >
          {trade.step}
        </span>
      </td>

      {/* Drop Rate */}
      <td className="px-3 py-2.5 text-right tabular-nums text-muted-foreground whitespace-nowrap">
        -{trade.dropRate}%
      </td>

      {/* Buy Price */}
      <td className="px-3 py-2.5 text-right tabular-nums font-medium text-foreground whitespace-nowrap">
        {formatPrice(trade.buyPrice, market)}
      </td>

      {/* Quantity */}
      <td className="px-3 py-2.5 text-right tabular-nums text-foreground whitespace-nowrap">
        {trade.quantity.toLocaleString()}주
      </td>

      {/* Amount */}
      <td className="px-3 py-2.5 text-right tabular-nums text-foreground whitespace-nowrap">
        {formatAmountCompact(trade.amount, market)}
      </td>

      {/* Real Quantity (new) */}
      <td className="px-3 py-2.5 text-right tabular-nums border-l border-border whitespace-nowrap">
        {trade.isExecuted ? (
          <span className="font-bold text-foreground">
            {trade.realQty.toLocaleString()}주
          </span>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </td>

      {/* Real Amount (new) */}
      <td className="px-3 py-2.5 text-right tabular-nums whitespace-nowrap">
        {trade.isExecuted ? (
          <span className="font-bold text-foreground">
            {formatAmountCompact(trade.realAmount, market)}
          </span>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </td>

      {/* Average Price */}
      <td className="px-3 py-2.5 text-right tabular-nums whitespace-nowrap">
        {trade.isExecuted ? (
          <span className="font-medium text-primary-600 dark:text-primary-400">
            {formatPrice(trade.avgPrice, market)}
          </span>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </td>

      {/* Gap */}
      <td
        className={clsx(
          'px-3 py-2.5 text-right tabular-nums font-medium whitespace-nowrap',
          getGapColor()
        )}
      >
        {trade.isExecuted || trade.isOrdered ? (
          <span className="flex items-center justify-end gap-1">
            {trade.gap < -10 && <AlertTriangle className="w-3.5 h-3.5 text-danger-500" />}
            {formatPercent(trade.gap)}
          </span>
        ) : (
          '-'
        )}
      </td>

      {/* Execution Date (new) */}
      <td className="px-3 py-2.5 text-center border-l border-border">
        <DateInput
          value={executionDate}
          onChange={(val) => onDateChange(val)}
          disabled={!trade.isExecuted}
          aria-label={`${trade.step}구간 체결일`}
        />
      </td>

      {/* Memo (new) */}
      <td className="px-3 py-2.5">
        <input
          type="text"
          value={memo}
          onChange={(e) => onMemoChange(e.target.value)}
          placeholder="메모"
          className={clsx(
            'w-full min-w-[100px] bg-transparent text-xs',
            'border-0 focus:outline-none focus:ring-1 focus:ring-primary-500 rounded px-1',
            'text-foreground placeholder-muted-foreground'
          )}
        />
      </td>
    </tr>
  );
}
