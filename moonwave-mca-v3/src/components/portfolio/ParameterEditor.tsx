// ============================================
// Parameter Editor Modal
// Edit portfolio MCA parameters
// ============================================

import { Button, Input, NumericInput, Tooltip, TooltipTriggerButton } from '@/components/ui';
import { Dialog, DialogBody, DialogFooter, DialogHeader } from '@/components/ui/Dialog';
import { autoFitParams, calculateTotalBudget } from '@/services/calculation';
import type { Portfolio, PortfolioParams } from '@/types';
import { formatAmountCompact, formatNumber } from '@/utils/format';
import { getCurrencyUnit } from '@/utils/market';
import { clsx } from 'clsx';
import { AlertTriangle, CheckCircle2, HelpCircle, Info, Plus, X, Zap } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

// 파라미터 라벨 with 툴팁 헬퍼 컴포넌트
function LabelWithTooltip({
  label,
  tooltip,
}: { label: string; tooltip: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      {label}
      <Tooltip content={tooltip} placement="top">
        <TooltipTriggerButton
          className="hover:bg-surface-active p-0.5 -m-0.5 transition-colors"
          aria-label={`${label} 도움말`}
        >
          <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
        </TooltipTriggerButton>
      </Tooltip>
    </span>
  );
}

interface ParameterEditorProps {
  portfolio: Portfolio;
  isOpen: boolean;
  onClose: () => void;
  onSave: (params: Partial<PortfolioParams>) => void;
}

export function ParameterEditor({ portfolio, isOpen, onClose, onSave }: ParameterEditorProps) {
  // 모달이 열릴 때 params를 portfolio에서 가져오지만,
  // 모달이 닫혀있을 때는 상태 업데이트하지 않음
  // key prop을 사용하여 모달 열릴 때 폼 상태를 리셋
  // Dialog의 onClose(배경 클릭 등)는 ParameterEditorContent 내부에서 dirty 체크 후 처리
  return (
    <Dialog open={isOpen} onClose={onClose} size="lg">
      <ParameterEditorContent
        key={`${portfolio.id}-${isOpen}`}
        portfolio={portfolio}
        onClose={onClose}
        onSave={onSave}
      />
    </Dialog>
  );
}

// 기보유 항목 기본값
const DEFAULT_LEGACY_HOLDING = { qty: 0, avg: 0, memo: '' };

// 기보유 항목에서 합계/가중평균 계산
function calculateLegacyTotals(holdings: { qty: number; avg: number }[]) {
  const totalQty = holdings.reduce((sum, h) => sum + (h.qty || 0), 0);
  const totalAmount = holdings.reduce((sum, h) => sum + (h.qty || 0) * (h.avg || 0), 0);
  const weightedAvg = totalQty > 0 ? Math.round(totalAmount / totalQty) : 0;
  return { totalQty, weightedAvg };
}

// 분리된 폼 컴포넌트 - key가 변경되면 리마운트되어 상태 초기화
function ParameterEditorContent({
  portfolio,
  onClose,
  onSave,
}: Omit<ParameterEditorProps, 'isOpen'>) {
  const [params, setParams] = useState<PortfolioParams>(() => ({ ...portfolio.params }));
  const [isOptimizing, setIsOptimizing] = useState(false);

  // 6-5: Track dirty state by comparing current params with original
  const isDirty = useMemo(() => {
    const original = portfolio.params;
    return (
      params.peakPrice !== original.peakPrice ||
      params.targetBudget !== original.targetBudget ||
      params.strength !== original.strength ||
      params.startDrop !== original.startDrop ||
      params.steps !== original.steps
    );
  }, [params, portfolio.params]);

  // 6-5: Warn on browser close/refresh when dirty
  useEffect(() => {
    if (!isDirty) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // 6-5: Confirm dialog when closing with unsaved changes
  const handleClose = useCallback(() => {
    if (isDirty) {
      const confirmed = window.confirm('저장하지 않은 변경사항이 있습니다. 정말 닫으시겠습니까?');
      if (!confirmed) return;
    }
    onClose();
  }, [isDirty, onClose]);

  // 기보유 항목 상태 (최대 3개)
  const [legacyHoldings, setLegacyHoldings] = useState<{ qty: number; avg: number; memo?: string }[]>(() => {
    // 기존 legacyHoldings가 있으면 사용, 없으면 legacyQty/legacyAvg로 초기화
    if (portfolio.params.legacyHoldings && portfolio.params.legacyHoldings.length > 0) {
      return portfolio.params.legacyHoldings;
    }
    if (portfolio.params.legacyQty > 0 || portfolio.params.legacyAvg > 0) {
      return [{ qty: portfolio.params.legacyQty, avg: portfolio.params.legacyAvg, memo: '' }];
    }
    return [{ ...DEFAULT_LEGACY_HOLDING }];
  });

  // Calculate estimated budget
  const market = portfolio.market;

  const estimatedBudget = useMemo(() => {
    return calculateTotalBudget(params, market);
  }, [params, market]);

  // Handle parameter change
  const handleChange = (key: keyof PortfolioParams, value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  // Auto-fit optimization
  const handleAutoFit = async () => {
    if (params.targetBudget <= 0) return;

    setIsOptimizing(true);

    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 300));

    const result = autoFitParams(
      params.peakPrice,
      params.startDrop,
      params.steps,
      params.targetBudget,
      market
    );

    setParams((prev) => ({
      ...prev,
      strength: result.strength,
      steps: result.steps,
    }));

    setIsOptimizing(false);
  };

  // 기보유 항목 변경 핸들러
  const handleLegacyChange = (index: number, field: 'qty' | 'avg' | 'memo', value: number | string) => {
    setLegacyHoldings((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // 기보유 항목 추가
  const addLegacyHolding = () => {
    if (legacyHoldings.length < 3) {
      setLegacyHoldings((prev) => [...prev, { ...DEFAULT_LEGACY_HOLDING }]);
    }
  };

  // 기보유 항목 삭제
  const removeLegacyHolding = (index: number) => {
    if (legacyHoldings.length > 1) {
      setLegacyHoldings((prev) => prev.filter((_, i) => i !== index));
    } else {
      // 마지막 항목은 초기화
      setLegacyHoldings([{ ...DEFAULT_LEGACY_HOLDING }]);
    }
  };

  // 기보유 합계 계산
  const legacyTotals = useMemo(() => calculateLegacyTotals(legacyHoldings), [legacyHoldings]);

  // Save changes
  const handleSave = () => {
    // 기보유 항목 합산하여 저장
    const updatedParams: Partial<PortfolioParams> = {
      ...params,
      legacyQty: legacyTotals.totalQty,
      legacyAvg: legacyTotals.weightedAvg,
      legacyHoldings: legacyHoldings.filter((h) => h.qty > 0 || h.avg > 0), // 빈 항목 제외
    };
    onSave(updatedParams);
    onClose();
  };

  // Budget difference indicator
  const budgetDiff =
    params.targetBudget > 0
      ? ((estimatedBudget - params.targetBudget) / params.targetBudget) * 100
      : 0;

  return (
    <>
      <DialogHeader title="매매 파라미터 설정" onClose={handleClose} />
      <DialogBody>
        <div className="space-y-5">
          {/* Main Parameters */}
          <div className="grid grid-cols-2 gap-4">
            <NumericInput
              label={
                <LabelWithTooltip
                  label="고점 가격"
                  tooltip="종목의 최고점 또는 기준 가격. 이 가격 대비 하락률로 매수 구간이 계산됩니다."
                />
              }
              value={formatNumber(params.peakPrice)}
              onChange={(value) => handleChange('peakPrice', Number(value))}
              unit={getCurrencyUnit(market)}
            />
            <NumericInput
              label={
                <LabelWithTooltip
                  label="목표 예산"
                  tooltip="전체 투자에 사용할 목표 금액. 자동 최적화 시 이 예산에 맞게 조정됩니다."
                />
              }
              value={formatNumber(params.targetBudget)}
              onChange={(value) => handleChange('targetBudget', Number(value))}
              unit={getCurrencyUnit(market)}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <NumericInput
              label={
                <LabelWithTooltip
                  label="투자 강도"
                  tooltip="하락 구간별 투자 배수. 높을수록 하락 시 더 많이 매수합니다. (1.0 = 균등, 2.0 = 2배씩 증가)"
                />
              }
              value={params.strength.toString()}
              onChange={(value) => handleChange('strength', value === '' ? 0 : Number.parseFloat(String(value)) || 0)}
              unit="x"
            />
            <NumericInput
              label={
                <LabelWithTooltip
                  label="시작 하락률"
                  tooltip="첫 매수를 시작할 고점 대비 하락률. 예: 12% → 고점 대비 12% 하락 시 첫 매수"
                />
              }
              value={params.startDrop.toString()}
              onChange={(value) => handleChange('startDrop', value === '' ? 0 : Number.parseFloat(String(value)) || 0)}
              unit="%"
            />
            <NumericInput
              label={
                <LabelWithTooltip
                  label="분할 구간"
                  tooltip="전체 투자를 나눌 분할 매수 횟수. 많을수록 더 촘촘하게 분할됩니다."
                />
              }
              value={params.steps.toString()}
              onChange={(value) => handleChange('steps', value === '' ? 0 : Number.parseFloat(String(value)) || 0)}
              unit="구간"
            />
          </div>

          {/* Auto-fit Button */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800/30">
            <div>
              <p className="font-medium text-primary-800 dark:text-primary-200 inline-flex items-center gap-1">
                예산 자동 최적화
                <Tooltip content="목표 예산에 맞춰 투자 강도와 분할 구간을 자동으로 계산합니다. 고점 가격과 시작 하락률은 유지됩니다." placement="top">
                  <TooltipTriggerButton
                    className="hover:bg-primary-200 dark:hover:bg-primary-800 p-0.5 -m-0.5 transition-colors"
                    aria-label="예산 자동 최적화 도움말"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-primary-500 dark:text-primary-400" />
                  </TooltipTriggerButton>
                </Tooltip>
              </p>
              <p className="text-sm text-primary-700 dark:text-primary-300 mt-0.5">
                목표 예산에 맞춰 매수 강도를 자동 조정합니다
              </p>
            </div>
            <Button
              color="primary"
              leftIcon={<Zap className="w-4 h-4" />}
              onClick={handleAutoFit}
              isLoading={isOptimizing}
              disabled={params.targetBudget <= 0}
            >
              자동 최적화
            </Button>
          </div>

          {/* Budget Estimate */}
          <div className="p-4 rounded-xl bg-surface-hover border border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">예상 총 투자금</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-foreground tabular-nums">
                  {formatAmountCompact(estimatedBudget, market)}
                </span>
                {params.targetBudget > 0 && (
                  <span
                    className={clsx(
                      'inline-flex items-center gap-1 text-sm font-medium px-2 py-0.5 rounded-full',
                      Math.abs(budgetDiff) < 5
                        ? 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400'
                        : budgetDiff > 0
                          ? 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400'
                          : 'bg-surface-hover text-muted-foreground'
                    )}
                  >
                    {Math.abs(budgetDiff) < 5 ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        적정
                      </>
                    ) : budgetDiff > 0 ? (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5" />
                        예산 초과
                      </>
                    ) : (
                      '예산 미만'
                    )}
                  </span>
                )}
              </div>
            </div>
            {/* 6-7: Budget difference guide */}
            {params.targetBudget > 0 && Math.abs(budgetDiff) >= 5 && (
              <div className="mt-3 flex items-start gap-2 text-xs">
                <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {budgetDiff > 0
                    ? `현재 예산이 ${Math.round(Math.abs(budgetDiff))}% 초과합니다. 강도를 낮추거나 분할 구간을 줄이면 예산에 맞출 수 있습니다.`
                    : `현재 예산이 ${Math.round(Math.abs(budgetDiff))}% 미만입니다. 강도를 높이거나 분할 구간을 늘리면 예산을 더 활용할 수 있습니다.`}
                </span>
              </div>
            )}
          </div>

          {/* Legacy Holdings Section */}
          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">
                <LabelWithTooltip
                  label="기보유 주식 설정"
                  tooltip="MCA 전략 시작 전 이미 보유 중인 주식. 평균단가 계산에 반영됩니다. 최대 3개 항목까지 추가 가능합니다."
                />
              </span>
              {legacyHoldings.length < 3 && (
                <Button
                  plain
                  color="primary"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  onClick={addLegacyHolding}
                >
                  항목 추가
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {legacyHoldings.map((holding, index) => (
                <div
                  key={index}
                  className="relative p-3 rounded-lg bg-surface-hover border border-border"
                >
                  {/* 삭제 버튼 */}
                  <button
                    type="button"
                    onClick={() => removeLegacyHolding(index)}
                    className="absolute top-2 right-2 p-1 rounded-full text-muted-foreground hover:text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-900/30 transition-colors"
                    aria-label="항목 삭제"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  <div className="grid grid-cols-3 gap-3 pr-6">
                    <NumericInput
                      label={`${index + 1}차 수량`}
                      value={holding.qty > 0 ? formatNumber(holding.qty) : ''}
                      onChange={(value) => handleLegacyChange(index, 'qty', Number(value))}
                      unit="주"
                    />
                    <NumericInput
                      label={`${index + 1}차 평단가`}
                      value={holding.avg > 0 ? formatNumber(holding.avg) : ''}
                      onChange={(value) => handleLegacyChange(index, 'avg', Number(value))}
                      unit={getCurrencyUnit(market)}
                    />
                    <Input
                      label="비고"
                      value={holding.memo || ''}
                      onChange={(value) => handleLegacyChange(index, 'memo', value)}
                      placeholder="예: 토스증권"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* 합계 표시 */}
            {(legacyTotals.totalQty > 0 || legacyHoldings.length > 1) && (
              <div className="mt-4 p-3 rounded-lg bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800/30">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-primary-700 dark:text-primary-300 font-medium">
                    합계
                  </span>
                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <span className="text-xs text-primary-600 dark:text-primary-400">총 수량</span>
                      <p className="font-bold text-primary-800 dark:text-primary-200 tabular-nums">
                        {legacyTotals.totalQty.toLocaleString()}주
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-primary-600 dark:text-primary-400">가중평균</span>
                      <p className="font-bold text-primary-800 dark:text-primary-200 tabular-nums">
                        {formatAmountCompact(legacyTotals.weightedAvg, market)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button plain color="secondary" onClick={handleClose}>
          취소
        </Button>
        <Button color="primary" onClick={handleSave}>
          저장
        </Button>
      </DialogFooter>
    </>
  );
}
