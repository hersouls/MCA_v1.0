// ============================================
// Exit Simulator Component
// Target price and profit simulation
// ============================================

import { Card, NumericInput } from '@/components/ui';
import { calculateAutoTargetPrice, calculateSimulation } from '@/services/calculation';
import type { PortfolioParams } from '@/types';
import { formatCurrency, formatKoreanUnit, formatNumber, formatPercent } from '@/utils/format';
import { clsx } from 'clsx';
import { Calculator, TrendingUp } from 'lucide-react';
import { useMemo, useState } from 'react';

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
  // 로컬 상태로 입력값 관리 (props를 초기값으로 사용)
  // key prop을 사용하여 params 변경 시 컴포넌트를 리셋하거나,
  // 또는 controlled 방식으로 부모에서 관리할 수 있음
  const [ma120Price, setMa120Price] = useState(() => params.ma120Price || 0);
  const [targetMultiple, setTargetMultiple] = useState(() => params.targetMultiple || 2.5);
  const [manualTargetPrice, setManualTargetPrice] = useState(() => params.manualTargetPrice || 0);

  // Auto-calculated target price
  const autoTargetPrice = useMemo(
    () => calculateAutoTargetPrice(ma120Price, targetMultiple),
    [ma120Price, targetMultiple]
  );

  // Effective target price (manual overrides auto)
  const effectiveTargetPrice = manualTargetPrice > 0 ? manualTargetPrice : autoTargetPrice || 0;

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
  const potentialFromAvg =
    avgPrice > 0 && effectiveTargetPrice > 0
      ? ((effectiveTargetPrice - avgPrice) / avgPrice) * 100
      : 0;

  return (
    <Card padding="lg">
      <div className="space-y-4">
        {/* MA120 and Multiple */}
        <div className="grid grid-cols-2 gap-4">
          <NumericInput
            label="120월 이동평균"
            value={ma120Price > 0 ? formatNumber(ma120Price) : ''}
            onChange={(value) => {
              setMa120Price(Number(value));
            }}
            onBlur={handleUpdateParams}
            placeholder="0"
            unit="원"
          />
          <NumericInput
            label="목표 배수"
            value={targetMultiple.toString()}
            onChange={(value) => {
              setTargetMultiple(value === '' ? 0 : Number.parseFloat(String(value)) || 0);
            }}
            onBlur={handleUpdateParams}
            placeholder="2.5"
            unit="배"
          />
        </div>

        {/* Auto Target Price Display */}
        {autoTargetPrice && autoTargetPrice > 0 && (
          <div className="flex items-center justify-between p-3 rounded-lg bg-surface-hover">
            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Calculator className="w-4 h-4" />
              자동 계산 목표가
            </span>
            <span className="font-semibold text-foreground">
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
          placeholder="직접 입력"
          unit="원"
          hint="입력하면 자동 계산 목표가를 대체합니다"
        />

        {/* Simulation Results */}
        {effectiveTargetPrice > 0 && currentQty > 0 && (
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-success-500" />
              <span className="text-sm font-medium text-muted-foreground">
                시뮬레이션 결과
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Target Price */}
              <div className="p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800/30">
                <p className="text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wide">
                  목표 매도가
                </p>
                <p className="mt-1 text-2xl font-bold text-primary-700 dark:text-primary-300 text-right tabular-nums">
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
                    'mt-1 text-2xl font-bold text-right tabular-nums',
                    simulation.expectedROE >= 0
                      ? 'text-success-700 dark:text-success-300'
                      : 'text-danger-700 dark:text-danger-300'
                  )}
                >
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
                <span className="text-sm text-muted-foreground">예상 수익금</span>
                <span
                  className={clsx(
                    'text-xl font-bold tabular-nums',
                    simulation.expectedProfit >= 0
                      ? 'text-success-600 dark:text-success-400'
                      : 'text-danger-600 dark:text-danger-400'
                  )}
                >
                  {simulation.expectedProfit >= 0 ? '+' : ''}
                  {formatKoreanUnit(simulation.expectedProfit)}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span className="tabular-nums">투입금액: {formatKoreanUnit(currentAmount)}</span>
                <span>보유수량: {currentQty.toLocaleString()}주</span>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {(effectiveTargetPrice === 0 || currentQty === 0) && (
          <div className="mt-4 p-6 text-center rounded-xl bg-surface-hover border border-dashed border-border">
            <p className="text-sm text-muted-foreground">
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
