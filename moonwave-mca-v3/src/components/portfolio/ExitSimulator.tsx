// ============================================
// Exit Simulator Component
// Target price and profit simulation
// ============================================

import { useState, useMemo, useEffect } from 'react';
import { clsx } from 'clsx';
import { Target, TrendingUp, Calculator } from 'lucide-react';
import { Card, NumericInput, Input } from '@/components/ui';
import type { PortfolioParams } from '@/types';
import {
  calculateSimulation,
  calculateAutoTargetPrice,
} from '@/services/calculation';
import { formatNumber, formatCurrency, formatCompact, formatPercent } from '@/utils/format';

interface ExitSimulatorProps {
  params: PortfolioParams;
  currentAmount: number;
  currentQty: number;
  avgPrice: number;
  onUpdateParams?: (updates: Partial<PortfolioParams>) => void;
}

export function ExitSimulator({
  params,
  currentAmount,
  currentQty,
  avgPrice,
  onUpdateParams,
}: ExitSimulatorProps) {
  const [ma120Price, setMa120Price] = useState(params.ma120Price || 0);
  const [targetMultiple, setTargetMultiple] = useState(params.targetMultiple || 2.5);
  const [manualTargetPrice, setManualTargetPrice] = useState(params.manualTargetPrice || 0);

  // Sync with params
  useEffect(() => {
    setMa120Price(params.ma120Price || 0);
    setTargetMultiple(params.targetMultiple || 2.5);
    setManualTargetPrice(params.manualTargetPrice || 0);
  }, [params.ma120Price, params.targetMultiple, params.manualTargetPrice]);

  // Auto-calculated target price
  const autoTargetPrice = useMemo(
    () => calculateAutoTargetPrice(ma120Price, targetMultiple),
    [ma120Price, targetMultiple]
  );

  // Effective target price (manual overrides auto)
  const effectiveTargetPrice = manualTargetPrice > 0 ? manualTargetPrice : (autoTargetPrice || 0);

  // Simulation result
  const simulation = useMemo(
    () => calculateSimulation(currentAmount, currentQty, effectiveTargetPrice),
    [currentAmount, currentQty, effectiveTargetPrice]
  );

  // Update parent params when values change
  const handleUpdateParams = () => {
    onUpdateParams?.({
      ma120Price: ma120Price || undefined,
      targetMultiple: targetMultiple || undefined,
      manualTargetPrice: manualTargetPrice || undefined,
    });
  };

  // Calculate potential from current average price
  const potentialFromAvg = avgPrice > 0 && effectiveTargetPrice > 0
    ? ((effectiveTargetPrice - avgPrice) / avgPrice) * 100
    : 0;

  return (
    <Card padding="lg" className="border-l-4 border-l-primary-500">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-primary-500" />
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
          목표가 시뮬레이션
        </h3>
      </div>

      <div className="space-y-4">
        {/* MA120 and Multiple */}
        <div className="grid grid-cols-2 gap-4">
          <NumericInput
            label="120일 이동평균"
            value={ma120Price > 0 ? formatNumber(ma120Price) : ''}
            onChange={(value) => {
              setMa120Price(Number(value));
            }}
            onBlur={handleUpdateParams}
            placeholder="0"
            unit="원"
          />
          <Input
            label="목표 배수"
            type="number"
            step="0.1"
            min="1"
            max="10"
            value={targetMultiple > 0 ? targetMultiple.toString() : ''}
            onChange={(value) => {
              setTargetMultiple(parseFloat(String(value)) || 0);
            }}
            onBlur={handleUpdateParams}
            placeholder="2.5"
            hint="배"
          />
        </div>

        {/* Auto Target Price Display */}
        {autoTargetPrice && autoTargetPrice > 0 && (
          <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
            <span className="text-sm text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
              <Calculator className="w-4 h-4" />
              자동 계산 목표가
            </span>
            <span className="font-semibold text-zinc-900 dark:text-zinc-50">
              {formatCurrency(autoTargetPrice)}
            </span>
          </div>
        )}

        {/* Manual Target Price */}
        <NumericInput
          label="수동 목표가 (선택사항)"
          value={manualTargetPrice > 0 ? formatNumber(manualTargetPrice) : ''}
          onChange={(value) => {
            setManualTargetPrice(Number(value));
          }}
          onBlur={handleUpdateParams}
          placeholder="직접 입력 시 자동 계산 무시"
          unit="원"
          hint="입력하면 자동 계산 목표가를 대체합니다"
        />

        {/* Simulation Results */}
        {effectiveTargetPrice > 0 && currentQty > 0 && (
          <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-700/50">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-success-500" />
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                시뮬레이션 결과
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Target Price */}
              <div className="p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800/30">
                <p className="text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wide">
                  목표 매도가
                </p>
                <p className="mt-1 text-2xl font-bold text-primary-700 dark:text-primary-300">
                  {formatCurrency(effectiveTargetPrice)}
                </p>
                {avgPrice > 0 && (
                  <p className="mt-1 text-sm text-primary-600 dark:text-primary-400">
                    평단가 대비 +{potentialFromAvg.toFixed(1)}%
                  </p>
                )}
              </div>

              {/* Expected ROE */}
              <div
                className={clsx(
                  'p-4 rounded-xl border',
                  simulation.expectedROE >= 0
                    ? 'bg-success-50 dark:bg-success-900/20 border-success-100 dark:border-success-800/30'
                    : 'bg-danger-50 dark:bg-danger-900/20 border-danger-100 dark:border-danger-800/30'
                )}
              >
                <p
                  className={clsx(
                    'text-xs font-medium uppercase tracking-wide',
                    simulation.expectedROE >= 0
                      ? 'text-success-600 dark:text-success-400'
                      : 'text-danger-600 dark:text-danger-400'
                  )}
                >
                  예상 수익률
                </p>
                <p
                  className={clsx(
                    'mt-1 text-2xl font-bold',
                    simulation.expectedROE >= 0
                      ? 'text-success-700 dark:text-success-300'
                      : 'text-danger-700 dark:text-danger-300'
                  )}
                >
                  {simulation.expectedROE >= 0 ? '+' : ''}
                  {formatPercent(simulation.expectedROE)}
                </p>
              </div>
            </div>

            {/* Expected Profit */}
            <div
              className={clsx(
                'mt-4 p-4 rounded-xl border',
                simulation.expectedProfit >= 0
                  ? 'bg-success-50/50 dark:bg-success-900/10 border-success-100 dark:border-success-800/30'
                  : 'bg-danger-50/50 dark:bg-danger-900/10 border-danger-100 dark:border-danger-800/30'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  예상 수익금
                </span>
                <span
                  className={clsx(
                    'text-xl font-bold',
                    simulation.expectedProfit >= 0
                      ? 'text-success-600 dark:text-success-400'
                      : 'text-danger-600 dark:text-danger-400'
                  )}
                >
                  {simulation.expectedProfit >= 0 ? '+' : ''}
                  {formatCompact(simulation.expectedProfit)}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                <span>투입금액: {formatCompact(currentAmount)}</span>
                <span>보유수량: {currentQty.toLocaleString()}주</span>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {(effectiveTargetPrice === 0 || currentQty === 0) && (
          <div className="mt-4 p-6 text-center rounded-xl bg-zinc-50 dark:bg-zinc-800/30 border border-dashed border-zinc-300 dark:border-zinc-700">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {currentQty === 0
                ? '체결된 구간이 없습니다'
                : '목표가를 입력하면 시뮬레이션 결과가 표시됩니다'}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
