// ============================================
// Exit Simulator Component
// Target price and profit simulation
// Multi-scenario comparison + partial sell
// ============================================

import { Card, NumericInput } from '@/components/ui';
import { calculateAutoTargetPrice, calculateSimulation } from '@/services/calculation';
import type { PortfolioParams } from '@/types';
import { formatAmountCompact, formatNumber, formatPercent, formatPrice } from '@/utils/format';
import { getCurrencyUnit } from '@/utils/market';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { Calculator, Shield, Target, TrendingUp } from 'lucide-react';
import { useMemo, useState } from 'react';

interface ExitSimulatorProps {
  params: PortfolioParams;
  currentAmount: number;
  currentQty: number;
  avgPrice: number;
  onUpdateParams?: (updates: Partial<PortfolioParams>) => void;
  market?: string;
}

const SELL_RATIO_OPTIONS = [25, 50, 75, 100] as const;

export function ExitSimulator({
  params,
  currentAmount,
  currentQty,
  avgPrice,
  onUpdateParams,
  market,
}: ExitSimulatorProps) {
  const [ma120Price, setMa120Price] = useState(() => params.ma120Price || 0);
  const [targetMultiple, setTargetMultiple] = useState(() => params.targetMultiple || 2.5);
  const [manualTargetPrice, setManualTargetPrice] = useState(() => params.manualTargetPrice || 0);
  const [sellRatio, setSellRatio] = useState(100);

  // Scenario overrides
  const [conservativeOverride, setConservativeOverride] = useState(0);
  const [optimisticOverride, setOptimisticOverride] = useState(0);

  // Auto-calculated target price
  const autoTargetPrice = useMemo(
    () => calculateAutoTargetPrice(ma120Price, targetMultiple),
    [ma120Price, targetMultiple]
  );

  // Effective target price (manual overrides auto)
  const effectiveTargetPrice = manualTargetPrice > 0 ? manualTargetPrice : autoTargetPrice || 0;

  // Scenario prices
  const scenarios = useMemo(() => {
    const conservative =
      conservativeOverride > 0
        ? conservativeOverride
        : avgPrice > 0
          ? Math.round(avgPrice * 1.2)
          : 0;
    const base = effectiveTargetPrice;
    const optimistic =
      optimisticOverride > 0 ? optimisticOverride : avgPrice > 0 ? Math.round(avgPrice * 2) : 0;
    return { conservative, base, optimistic };
  }, [avgPrice, effectiveTargetPrice, conservativeOverride, optimisticOverride]);

  // Partial sell calculations
  const partialQty = Math.floor(currentQty * (sellRatio / 100));
  const partialAmount = currentAmount * (sellRatio / 100);

  // Simulations for each scenario
  const simulations = useMemo(
    () => ({
      conservative: calculateSimulation(partialAmount, partialQty, scenarios.conservative),
      base: calculateSimulation(partialAmount, partialQty, scenarios.base),
      optimistic: calculateSimulation(partialAmount, partialQty, scenarios.optimistic),
    }),
    [partialAmount, partialQty, scenarios]
  );

  // Update parent params when values change
  const handleUpdateParams = () => {
    onUpdateParams?.({
      ma120Price: ma120Price || undefined,
      targetMultiple: targetMultiple || undefined,
      manualTargetPrice: manualTargetPrice || undefined,
    });
  };

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
            unit={getCurrencyUnit(market)}
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
              {formatPrice(autoTargetPrice, market)}
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
          unit={getCurrencyUnit(market)}
          hint="입력하면 자동 계산 목표가를 대체합니다"
        />

        {/* Break-even Price */}
        {avgPrice > 0 && (
          <div className="flex items-center justify-between p-3 rounded-lg bg-primary-50/50 dark:bg-primary-900/20 border border-primary-200/50 dark:border-primary-800/30">
            <span className="text-sm font-medium text-primary-700 dark:text-primary-300 flex items-center gap-1.5">
              <Target className="w-4 h-4" />
              손익분기가
            </span>
            <span className="font-bold text-primary-700 dark:text-primary-300 tabular-nums">
              {formatPrice(avgPrice, market)}
            </span>
          </div>
        )}

        {/* Partial Sell Ratio */}
        {currentQty > 0 && effectiveTargetPrice > 0 && (
          <div className="pt-3 border-t border-border">
            <p className="text-xs font-medium text-muted-foreground mb-2">매도 비율</p>
            <div className="flex gap-2">
              {SELL_RATIO_OPTIONS.map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setSellRatio(ratio)}
                  className={clsx(
                    'flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors',
                    sellRatio === ratio
                      ? 'bg-primary-500 text-white'
                      : 'bg-surface-hover text-muted-foreground hover:text-foreground'
                  )}
                >
                  {ratio}%
                </button>
              ))}
            </div>
            {sellRatio < 100 && (
              <p className="text-xs text-muted-foreground mt-1.5 tabular-nums">
                {partialQty.toLocaleString()}주 매도 ({formatAmountCompact(partialAmount, market)}{' '}
                상당)
              </p>
            )}
          </div>
        )}

        {/* Multi-Scenario Comparison */}
        {currentQty > 0 &&
          (scenarios.conservative > 0 || scenarios.base > 0 || scenarios.optimistic > 0) && (
            <div className="pt-4 border-t border-border">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-success-500" />
                <span className="text-sm font-medium text-muted-foreground">시나리오 비교</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Conservative */}
                <ScenarioCard
                  label="보수적"
                  icon={<Shield className="w-3.5 h-3.5" />}
                  price={scenarios.conservative}
                  simulation={simulations.conservative}
                  avgPrice={avgPrice}
                  market={market}
                  color="blue"
                  onPriceChange={(v) => setConservativeOverride(v)}
                />

                {/* Base */}
                <ScenarioCard
                  label="기본"
                  icon={<Target className="w-3.5 h-3.5" />}
                  price={scenarios.base}
                  simulation={simulations.base}
                  avgPrice={avgPrice}
                  market={market}
                  color="primary"
                  isBase
                />

                {/* Optimistic */}
                <ScenarioCard
                  label="낙관적"
                  icon={<TrendingUp className="w-3.5 h-3.5" />}
                  price={scenarios.optimistic}
                  simulation={simulations.optimistic}
                  avgPrice={avgPrice}
                  market={market}
                  color="success"
                  onPriceChange={(v) => setOptimisticOverride(v)}
                />
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

// Scenario Card Sub-component
interface ScenarioCardProps {
  label: string;
  icon: React.ReactNode;
  price: number;
  simulation: { expectedROE: number; expectedProfit: number };
  avgPrice: number;
  market?: string;
  color: 'blue' | 'primary' | 'success';
  isBase?: boolean;
  onPriceChange?: (value: number) => void;
}

const colorMap = {
  blue: {
    bg: 'bg-blue-50/50 dark:bg-blue-900/20',
    border: 'border-blue-200/50 dark:border-blue-800/30',
    text: 'text-blue-700 dark:text-blue-300',
    label: 'text-blue-600 dark:text-blue-400',
  },
  primary: {
    bg: 'bg-primary-50/50 dark:bg-primary-900/20',
    border: 'border-primary-200/50 dark:border-primary-800/30',
    text: 'text-primary-700 dark:text-primary-300',
    label: 'text-primary-600 dark:text-primary-400',
  },
  success: {
    bg: 'bg-success-50/50 dark:bg-success-900/20',
    border: 'border-success-200/50 dark:border-success-800/30',
    text: 'text-success-700 dark:text-success-300',
    label: 'text-success-600 dark:text-success-400',
  },
} as const;

function ScenarioCard({
  label,
  icon,
  price,
  simulation,
  avgPrice,
  market,
  color,
  onPriceChange,
}: ScenarioCardProps) {
  const c = colorMap[color];
  const potential = avgPrice > 0 && price > 0 ? ((price - avgPrice) / avgPrice) * 100 : 0;
  const isPositive = simulation.expectedROE >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx('p-3 rounded-xl border', c.bg, c.border)}
    >
      <div className="flex items-center gap-1.5 mb-2">
        <span className={c.label}>{icon}</span>
        <span className={clsx('text-xs font-medium', c.label)}>{label}</span>
      </div>

      {/* Target Price */}
      <p className={clsx('text-lg font-bold tabular-nums', c.text)}>
        {price > 0 ? formatPrice(price, market) : '-'}
      </p>

      {/* Price edit for non-base scenarios */}
      {onPriceChange && (
        <input
          type="number"
          className="w-full mt-1 px-2 py-1 text-xs bg-white/50 dark:bg-black/20 rounded border border-border text-foreground tabular-nums"
          placeholder="직접 입력"
          onChange={(e) => onPriceChange(Number(e.target.value) || 0)}
        />
      )}

      {/* Potential from avg */}
      {avgPrice > 0 && price > 0 && (
        <p
          className={clsx(
            'text-xs mt-1 tabular-nums',
            potential >= 0
              ? 'text-success-600 dark:text-success-400'
              : 'text-danger-600 dark:text-danger-400'
          )}
        >
          {potential >= 0 ? '+' : ''}
          {potential.toFixed(1)}%
        </p>
      )}

      {/* Profit */}
      {price > 0 && (
        <div className="mt-2 pt-2 border-t border-border/50">
          <p
            className={clsx(
              'text-sm font-semibold tabular-nums',
              isPositive
                ? 'text-success-600 dark:text-success-400'
                : 'text-danger-600 dark:text-danger-400'
            )}
          >
            {isPositive ? '+' : ''}
            {formatAmountCompact(simulation.expectedProfit, market)}
          </p>
          <p
            className={clsx(
              'text-xs tabular-nums',
              isPositive
                ? 'text-success-600/70 dark:text-success-400/70'
                : 'text-danger-600/70 dark:text-danger-400/70'
            )}
          >
            {formatPercent(simulation.expectedROE)}
          </p>
        </div>
      )}
    </motion.div>
  );
}
