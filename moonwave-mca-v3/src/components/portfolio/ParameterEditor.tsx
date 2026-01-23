// ============================================
// Parameter Editor Modal
// Edit portfolio MCA parameters
// ============================================

import { useState, useMemo } from 'react';
import { clsx } from 'clsx';
import { Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { Button, NumericInput, Input } from '@/components/ui';
import { Dialog, DialogHeader, DialogBody } from '@/components/ui/Dialog';
import type { Portfolio, PortfolioParams } from '@/types';
import { autoFitParams, calculateTotalBudget } from '@/services/calculation';
import { formatNumber, formatCompact } from '@/utils/format';

interface ParameterEditorProps {
  portfolio: Portfolio;
  isOpen: boolean;
  onClose: () => void;
  onSave: (params: Partial<PortfolioParams>) => void;
}

export function ParameterEditor({
  portfolio,
  isOpen,
  onClose,
  onSave,
}: ParameterEditorProps) {
  // 모달이 열릴 때 params를 portfolio에서 가져오지만,
  // 모달이 닫혀있을 때는 상태 업데이트하지 않음
  // key prop을 사용하여 모달 열릴 때 폼 상태를 리셋
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

// 분리된 폼 컴포넌트 - key가 변경되면 리마운트되어 상태 초기화
function ParameterEditorContent({
  portfolio,
  onClose,
  onSave,
}: Omit<ParameterEditorProps, 'isOpen'>) {
  const [params, setParams] = useState<PortfolioParams>(() => ({ ...portfolio.params }));
  const [showLegacy, setShowLegacy] = useState(
    () => portfolio.params.legacyQty > 0 || portfolio.params.legacyAvg > 0
  );
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Calculate estimated budget
  const estimatedBudget = useMemo(() => {
    return calculateTotalBudget(params);
  }, [params]);

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
      params.targetBudget
    );

    setParams((prev) => ({
      ...prev,
      strength: result.strength,
      steps: result.steps,
    }));

    setIsOptimizing(false);
  };

  // Save changes
  const handleSave = () => {
    onSave(params);
    onClose();
  };

  // Budget difference indicator
  const budgetDiff = params.targetBudget > 0
    ? ((estimatedBudget - params.targetBudget) / params.targetBudget) * 100
    : 0;

  return (
    <>
      <DialogHeader title="매매 파라미터 설정" onClose={onClose} />
      <DialogBody>
        <div className="space-y-6">
          {/* Main Parameters */}
        <div className="grid grid-cols-2 gap-4">
          <NumericInput
            label="고점 가격"
            value={formatNumber(params.peakPrice)}
            onChange={(value) => handleChange('peakPrice', Number(value))}
            unit="원"
          />
          <NumericInput
            label="목표 예산"
            value={formatNumber(params.targetBudget)}
            onChange={(value) => handleChange('targetBudget', Number(value))}
            unit="원"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Input
            label="투자 강도"
            type="number"
            step="0.1"
            min="0.1"
            max="50"
            value={params.strength.toString()}
            onChange={(value) => handleChange('strength', parseFloat(String(value)) || 1)}
          />
          <Input
            label="시작 하락률"
            type="number"
            step="1"
            min="1"
            max="50"
            value={params.startDrop.toString()}
            onChange={(value) => handleChange('startDrop', parseInt(String(value)) || 10)}
            hint="%"
          />
          <Input
            label="분할 구간"
            type="number"
            step="1"
            min="1"
            max="50"
            value={params.steps.toString()}
            onChange={(value) => handleChange('steps', parseInt(String(value)) || 20)}
            hint="구간"
          />
        </div>

        {/* Auto-fit Button */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800/30">
          <div>
            <p className="font-medium text-primary-700 dark:text-primary-300">
              예산 자동 최적화
            </p>
            <p className="text-sm text-primary-600 dark:text-primary-400 mt-0.5">
              목표 예산에 맞게 강도/구간을 자동 조정합니다
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Zap className="w-4 h-4" />}
            onClick={handleAutoFit}
            isLoading={isOptimizing}
            disabled={params.targetBudget <= 0}
          >
            자동 최적화
          </Button>
        </div>

        {/* Budget Estimate */}
        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              예상 총 투자금
            </span>
            <div className="text-right">
              <span className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                {formatCompact(estimatedBudget)}
              </span>
              {params.targetBudget > 0 && (
                <span
                  className={clsx(
                    'ml-2 text-sm font-medium',
                    Math.abs(budgetDiff) < 5
                      ? 'text-success-600 dark:text-success-400'
                      : budgetDiff > 0
                      ? 'text-danger-600 dark:text-danger-400'
                      : 'text-warning-600 dark:text-warning-400'
                  )}
                >
                  ({budgetDiff > 0 ? '+' : ''}{budgetDiff.toFixed(1)}%)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Legacy Holdings Section */}
        <div className="border-t border-zinc-200 dark:border-zinc-700/50 pt-4">
          <button
            onClick={() => setShowLegacy(!showLegacy)}
            className="flex items-center justify-between w-full text-left"
          >
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              기보유 주식 설정
            </span>
            {showLegacy ? (
              <ChevronUp className="w-4 h-4 text-zinc-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-zinc-500" />
            )}
          </button>

          {showLegacy && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <NumericInput
                label="기보유 수량"
                value={formatNumber(params.legacyQty)}
                onChange={(value) => handleChange('legacyQty', Number(value))}
                unit="주"
              />
              <NumericInput
                label="기보유 평단가"
                value={formatNumber(params.legacyAvg)}
                onChange={(value) => handleChange('legacyAvg', Number(value))}
                unit="원"
              />
            </div>
          )}
        </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-700/50">
            <Button variant="ghost" onClick={onClose}>
              취소
            </Button>
            <Button variant="primary" onClick={handleSave}>
              저장
            </Button>
          </div>
        </div>
      </DialogBody>
    </>
  );
}
