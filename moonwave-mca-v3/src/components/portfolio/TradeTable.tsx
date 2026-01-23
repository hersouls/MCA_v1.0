// ============================================
// MCA Trade Table Component
// Interactive table with order/execute toggles
// ============================================

import { useMemo } from 'react';
import { clsx } from 'clsx';
import { Check, Clock, AlertTriangle } from 'lucide-react';
import type { CalculatedTrade, PortfolioParams } from '@/types';
import { calculateTrades } from '@/services/calculation';
import { formatCurrency, formatCompact, formatPercent } from '@/utils/format';

interface TradeTableProps {
  params: PortfolioParams;
  orderedSteps: number[];
  executedSteps: number[];
  onToggleOrdered: (step: number) => void;
  onToggleExecuted: (step: number) => void;
}

export function TradeTable({
  params,
  orderedSteps,
  executedSteps,
  onToggleOrdered,
  onToggleExecuted,
}: TradeTableProps) {
  const trades = useMemo(
    () => calculateTrades(params, orderedSteps, executedSteps),
    [params, orderedSteps, executedSteps]
  );

  // Calculate totals
  const totals = useMemo(() => {
    const ordered = trades.filter((t) => t.isOrdered);
    const executed = trades.filter((t) => t.isExecuted);

    return {
      orderedQty: ordered.reduce((sum, t) => sum + t.quantity, 0),
      orderedAmt: ordered.reduce((sum, t) => sum + t.amount, 0),
      executedQty: executed.reduce((sum, t) => sum + t.quantity, 0) + params.legacyQty,
      executedAmt: executed.reduce((sum, t) => sum + t.amount, 0) + params.legacyQty * params.legacyAvg,
      avgPrice: executed.length > 0 ? executed[executed.length - 1].avgPrice : 0,
    };
  }, [trades, params.legacyQty, params.legacyAvg]);

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700/50">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-700/50">
            <tr>
              <th className="px-3 py-3 text-center text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider w-16">
                주문
              </th>
              <th className="px-3 py-3 text-center text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider w-16">
                체결
              </th>
              <th className="px-3 py-3 text-center text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider w-14">
                구간
              </th>
              <th className="px-3 py-3 text-right text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">
                하락률
              </th>
              <th className="px-3 py-3 text-right text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">
                매수가
              </th>
              <th className="px-3 py-3 text-right text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">
                수량
              </th>
              <th className="px-3 py-3 text-right text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">
                금액
              </th>
              <th className="px-3 py-3 text-right text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">
                평단가
              </th>
              <th className="px-3 py-3 text-right text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">
                괴리율
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700/50">
            {trades.map((trade) => (
              <TradeRow
                key={trade.step}
                trade={trade}
                onToggleOrdered={() => onToggleOrdered(trade.step)}
                onToggleExecuted={() => onToggleExecuted(trade.step)}
              />
            ))}
          </tbody>
          <tfoot className="bg-zinc-50 dark:bg-zinc-800/50 border-t-2 border-zinc-300 dark:border-zinc-600">
            <tr>
              <td colSpan={5} className="px-3 py-3 text-right font-semibold text-zinc-700 dark:text-zinc-200">
                합계
              </td>
              <td className="px-3 py-3 text-right font-bold text-zinc-900 dark:text-zinc-50 tabular-nums">
                {totals.executedQty.toLocaleString()}주
              </td>
              <td className="px-3 py-3 text-right font-bold text-zinc-900 dark:text-zinc-50 tabular-nums">
                {formatCompact(totals.executedAmt)}
              </td>
              <td className="px-3 py-3 text-right font-bold text-primary-600 dark:text-primary-400 tabular-nums">
                {totals.avgPrice > 0 ? formatCurrency(totals.avgPrice) : '-'}
              </td>
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
  onToggleOrdered: () => void;
  onToggleExecuted: () => void;
}

function TradeRow({ trade, onToggleOrdered, onToggleExecuted }: TradeRowProps) {
  const getRowClass = () => {
    if (trade.isExecuted) {
      return 'bg-success-50/50 dark:bg-success-900/20';
    }
    if (trade.isOrdered) {
      return 'bg-warning-50/50 dark:bg-warning-900/20';
    }
    return '';
  };

  const getGapColor = () => {
    if (!trade.isExecuted && !trade.isOrdered) return 'text-zinc-400 dark:text-zinc-500';
    if (trade.gap < -5) return 'text-success-600 dark:text-success-400';
    if (trade.gap > 5) return 'text-danger-600 dark:text-danger-400';
    return 'text-zinc-600 dark:text-zinc-300';
  };

  return (
    <tr className={clsx('transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50', getRowClass())}>
      {/* Order Checkbox */}
      <td className="px-3 py-2.5 text-center">
        <button
          onClick={onToggleOrdered}
          className={clsx(
            'w-6 h-6 rounded border-2 flex items-center justify-center transition-all',
            trade.isOrdered
              ? 'bg-warning-500 border-warning-500 text-white'
              : 'border-zinc-300 dark:border-zinc-500 hover:border-warning-400 dark:hover:border-warning-500'
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
              ? 'border-zinc-300 dark:border-zinc-500 hover:border-success-400 dark:hover:border-success-500'
              : 'border-zinc-200 dark:border-zinc-700 opacity-30 cursor-not-allowed'
          )}
          aria-label={`${trade.step}구간 체결 ${trade.isExecuted ? '취소' : '등록'}`}
        >
          {trade.isExecuted && <Check className="w-3.5 h-3.5" />}
        </button>
      </td>

      {/* Step */}
      <td className="px-3 py-2.5 text-center">
        <span className={clsx(
          'inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold',
          trade.isExecuted
            ? 'bg-success-100 text-success-700 dark:bg-success-900/50 dark:text-success-300'
            : trade.isOrdered
            ? 'bg-warning-100 text-warning-700 dark:bg-warning-900/50 dark:text-warning-300'
            : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
        )}>
          {trade.step}
        </span>
      </td>

      {/* Drop Rate */}
      <td className="px-3 py-2.5 text-right tabular-nums text-zinc-600 dark:text-zinc-300">
        -{trade.dropRate}%
      </td>

      {/* Buy Price */}
      <td className="px-3 py-2.5 text-right tabular-nums font-medium text-zinc-900 dark:text-zinc-50">
        {formatCurrency(trade.buyPrice)}
      </td>

      {/* Quantity */}
      <td className="px-3 py-2.5 text-right tabular-nums text-zinc-700 dark:text-zinc-200">
        {trade.quantity.toLocaleString()}
      </td>

      {/* Amount */}
      <td className="px-3 py-2.5 text-right tabular-nums text-zinc-700 dark:text-zinc-200">
        {formatCompact(trade.amount)}
      </td>

      {/* Average Price */}
      <td className="px-3 py-2.5 text-right tabular-nums">
        {trade.isExecuted ? (
          <span className="font-medium text-primary-600 dark:text-primary-400">
            {formatCurrency(trade.avgPrice)}
          </span>
        ) : (
          <span className="text-zinc-400 dark:text-zinc-500">-</span>
        )}
      </td>

      {/* Gap */}
      <td className={clsx('px-3 py-2.5 text-right tabular-nums font-medium', getGapColor())}>
        {trade.isExecuted || trade.isOrdered ? (
          <span className="flex items-center justify-end gap-1">
            {trade.gap < -10 && <AlertTriangle className="w-3.5 h-3.5 text-danger-500" />}
            {formatPercent(trade.gap)}
          </span>
        ) : (
          '-'
        )}
      </td>
    </tr>
  );
}
