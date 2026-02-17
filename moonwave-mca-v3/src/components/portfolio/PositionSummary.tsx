// ============================================
// Position Summary Component
// 투자 포지션 핵심 정보를 4개 카드로 요약
// ============================================

import { useMemo } from 'react';

import { StatsCard } from '@/components/ui';
import { calculateAutoTargetPrice, getNextActionStep } from '@/services/calculation';
import type { CalculatedTrade, PortfolioParams } from '@/types';
import { formatPercent, formatPrice } from '@/utils/format';
import { TEXTS } from '@/utils/texts';

interface PositionSummaryProps {
  avgPrice: number;
  params: PortfolioParams;
  trades: CalculatedTrade[];
  market?: string;
}

export function PositionSummary({ avgPrice, params, trades, market }: PositionSummaryProps) {
  const nextStep = useMemo(() => getNextActionStep(trades), [trades]);

  const effectiveTargetPrice = useMemo(() => {
    if (params.manualTargetPrice && params.manualTargetPrice > 0) {
      return params.manualTargetPrice;
    }
    return calculateAutoTargetPrice(params.ma120Price, params.targetMultiple) ?? 0;
  }, [params.manualTargetPrice, params.ma120Price, params.targetMultiple]);

  // 고점 대비 하락률
  const vsPeak = useMemo(() => {
    if (avgPrice <= 0 || params.peakPrice <= 0) return null;
    return ((avgPrice - params.peakPrice) / params.peakPrice) * 100;
  }, [avgPrice, params.peakPrice]);

  // 목표가 대비 상승 여력
  const vsTarget = useMemo(() => {
    if (avgPrice <= 0 || effectiveTargetPrice <= 0) return null;
    return ((effectiveTargetPrice - avgPrice) / avgPrice) * 100;
  }, [avgPrice, effectiveTargetPrice]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        label={TEXTS.PORTFOLIO.BREAK_EVEN}
        value={avgPrice > 0 ? formatPrice(avgPrice, market) : '-'}
        tooltip={TEXTS.PORTFOLIO.BREAK_EVEN_TOOLTIP}
        valueColor="primary"
      />
      <StatsCard
        label={TEXTS.PORTFOLIO.NEXT_BUY_PRICE}
        value={nextStep ? formatPrice(nextStep.buyPrice, market) : '-'}
        subValue={nextStep ? `${nextStep.step}구간 • -${nextStep.dropRate}%` : undefined}
        tooltip={TEXTS.PORTFOLIO.NEXT_BUY_PRICE_TOOLTIP}
        valueColor="warning"
      />
      <StatsCard
        label={TEXTS.PORTFOLIO.VS_PEAK}
        value={vsPeak !== null ? formatPercent(vsPeak) : '-'}
        subValue={params.peakPrice > 0 ? formatPrice(params.peakPrice, market) : undefined}
        tooltip={TEXTS.PORTFOLIO.VS_PEAK_TOOLTIP}
        valueColor={vsPeak !== null ? (vsPeak <= 0 ? 'success' : 'danger') : 'default'}
      />
      <StatsCard
        label={TEXTS.PORTFOLIO.VS_TARGET}
        value={vsTarget !== null ? formatPercent(vsTarget) : TEXTS.PORTFOLIO.TARGET_NOT_SET}
        subValue={effectiveTargetPrice > 0 ? formatPrice(effectiveTargetPrice, market) : undefined}
        tooltip={TEXTS.PORTFOLIO.VS_TARGET_TOOLTIP}
        valueColor={vsTarget !== null ? (vsTarget >= 0 ? 'success' : 'danger') : 'default'}
      />
    </div>
  );
}
