// ============================================
// Fundamental Grade Input Component
// 100점 만점 펀더멘털 점수 입력 UI
// ============================================

import { useState, useMemo, useCallback } from 'react';
import { Clipboard, Calculator, Info, AlertCircle, CheckCircle } from 'lucide-react';
import type { FundamentalInput, FundamentalResult, GrowthPotential, ManagementQuality, ClipboardParseResult } from '@/types';
import { calculateFundamentalScore, getGradeColor, getGradeDescription } from '@/services/fundamentalGrade';
import { useClipboard, useDropParse } from '@/hooks/useClipboard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface FundamentalGradeInputProps {
  initialData?: FundamentalInput;
  onChange?: (data: FundamentalInput, result: FundamentalResult) => void;
  onSave?: (data: FundamentalInput, result: FundamentalResult) => void;
  compact?: boolean;
}

const DEFAULT_INPUT: FundamentalInput = {
  per: null,
  pbr: null,
  earningsSustainability: false,
  isDualListed: false,
  dividendYield: null,
  hasQuarterlyDividend: false,
  consecutiveDividendYears: 0,
  hasBuybackProgram: false,
  annualCancellationRate: 0,
  treasuryStockRatio: 0,
  growthPotential: 'normal',
  managementQuality: 'professional',
  hasGlobalBrand: false,
};

export function FundamentalGradeInput({
  initialData,
  onChange,
  onSave,
  compact = false,
}: FundamentalGradeInputProps) {
  const [data, setData] = useState<FundamentalInput>(initialData || DEFAULT_INPUT);
  const [showToast, setShowToast] = useState<string | null>(null);

  // 클립보드 훅
  const { parseClipboard, isParsing, error: clipboardError } = useClipboard();

  // 파싱된 데이터 적용 (useDropParse보다 먼저 선언해야 함)
  const applyParsedData = useCallback((parseResult: ClipboardParseResult) => {
    if (!parseResult.success || !parseResult.data) return;

    const { per, pbr, dividendYield, treasuryStockRatio } = parseResult.data;

    setData((prev) => ({
      ...prev,
      ...(per !== undefined && { per }),
      ...(pbr !== undefined && { pbr }),
      ...(dividendYield !== undefined && { dividendYield }),
      ...(treasuryStockRatio !== undefined && { treasuryStockRatio }),
    }));

    const appliedCount = [per, pbr, dividendYield, treasuryStockRatio].filter(
      (v) => v !== undefined
    ).length;
    setShowToast(`${parseResult.source || '데이터'}에서 ${appliedCount}개 항목 적용됨`);
    setTimeout(() => setShowToast(null), 3000);
  }, []);

  // 드래그 앤 드롭 훅
  const { isDragging, dragHandlers } = useDropParse((parseResult) => {
    applyParsedData(parseResult);
  });

  // 결과 계산 (useMemo로 파생 상태 처리 - setState 대신)
  const result = useMemo(() => calculateFundamentalScore(data), [data]);

  // 클립보드 붙여넣기
  const handlePaste = async () => {
    const result = await parseClipboard();
    if (result) {
      applyParsedData(result);
    }
  };

  // 값 변경 핸들러 - onChange 콜백도 여기서 호출
  const handleChange = <K extends keyof FundamentalInput>(key: K, value: FundamentalInput[K]) => {
    const newData = { ...data, [key]: value };
    setData(newData);
    // 변경 시 부모에게 알림
    if (onChange) {
      const newResult = calculateFundamentalScore(newData);
      onChange(newData, newResult);
    }
  };

  // 저장 핸들러
  const handleSave = () => {
    if (result) {
      onSave?.(data, result);
    }
  };

  // 초기화
  const handleReset = () => {
    setData(DEFAULT_INPUT);
  };

  return (
    <div
      className={`relative rounded-lg border ${isDragging ? 'border-blue-500 bg-blue-500/5' : 'border-zinc-200 dark:border-zinc-700'} ${compact ? 'p-3' : 'p-4'}`}
      {...dragHandlers}
    >
      {/* 드래그 오버레이 */}
      {isDragging && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-blue-500/10">
          <div className="text-center">
            <Clipboard className="mx-auto h-8 w-8 text-blue-500" />
            <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">여기에 데이터 놓기</p>
          </div>
        </div>
      )}

      {/* 헤더 */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-blue-500" />
          <h3 className="font-semibold text-zinc-900 dark:text-white">Fundamental Grade</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handlePaste}
            disabled={isParsing}
            className="gap-1.5"
          >
            <Clipboard className="h-4 w-4" />
            {isParsing ? '분석 중...' : '붙여넣기'}
          </Button>
        </div>
      </div>

      {/* 토스트 메시지 */}
      {showToast && (
        <div className="mb-3 flex items-center gap-2 rounded-md bg-green-100 px-3 py-2 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-400">
          <CheckCircle className="h-4 w-4" />
          {showToast}
        </div>
      )}

      {/* 클립보드 에러 */}
      {clipboardError && (
        <div className="mb-3 flex items-center gap-2 rounded-md bg-red-100 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
          <AlertCircle className="h-4 w-4" />
          {clipboardError}
        </div>
      )}

      {/* 결과 표시 */}
      {result && (
        <div className="mb-4 rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">총점</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold" style={{ color: getGradeColor(result.grade) }}>
                  {result.totalScore}
                </span>
                <span className="text-sm text-zinc-500">/100</span>
              </div>
            </div>
            <div className="text-right">
              <span
                className="text-4xl font-bold"
                style={{ color: getGradeColor(result.grade) }}
              >
                {result.grade}
              </span>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                {getGradeDescription(result.grade)}
              </p>
            </div>
          </div>

          {/* 점수 분포 바 */}
          <div className="mt-3 space-y-1.5">
            <ScoreBar label="가치평가 (I)" score={result.categoryScores.valuation} max={35} color="#3b82f6" />
            <ScoreBar label="주주환원 (II)" score={result.categoryScores.shareholderReturn} max={40} color="#22c55e" />
            <ScoreBar label="성장/경영 (III)" score={result.categoryScores.growthManagement} max={25} color="#f59e0b" />
          </div>
        </div>
      )}

      {/* 입력 폼 */}
      <div className={`space-y-4 ${compact ? 'text-sm' : ''}`}>
        {/* Category I: 가치평가 */}
        <CategorySection title="I. 가치평가 (35점)" color="#3b82f6">
          <div className="grid gap-3 sm:grid-cols-2">
            <InputField
              label="PER"
              type="number"
              value={data.per ?? ''}
              onChange={(v) => handleChange('per', v ? parseFloat(v) : null)}
              placeholder="예: 8.5"
              hint="10 이하: 10점, 10-15: 5점"
            />
            <InputField
              label="PBR"
              type="number"
              value={data.pbr ?? ''}
              onChange={(v) => handleChange('pbr', v ? parseFloat(v) : null)}
              placeholder="예: 0.8"
              hint="1 이하: 10점, 1-2: 5점"
            />
          </div>
          <CheckboxField
            label="이익 지속 가능성 (3년 연속 흑자)"
            checked={data.earningsSustainability}
            onChange={(v) => handleChange('earningsSustainability', v)}
          />
          <CheckboxField
            label="이중상장 여부 (해외 상장)"
            checked={data.isDualListed}
            onChange={(v) => handleChange('isDualListed', v)}
          />
        </CategorySection>

        {/* Category II: 주주환원 */}
        <CategorySection title="II. 주주환원 (40점)" color="#22c55e">
          <InputField
            label="배당수익률 (%)"
            type="number"
            value={data.dividendYield ?? ''}
            onChange={(v) => handleChange('dividendYield', v ? parseFloat(v) : null)}
            placeholder="예: 3.5"
            hint="3% 이상: 10점, 1-3%: 5점"
          />
          <CheckboxField
            label="분기 배당 시행"
            checked={data.hasQuarterlyDividend}
            onChange={(v) => handleChange('hasQuarterlyDividend', v)}
          />
          <InputField
            label="연속 배당 년수"
            type="number"
            value={data.consecutiveDividendYears}
            onChange={(v) => handleChange('consecutiveDividendYears', parseInt(v) || 0)}
            placeholder="예: 10"
            hint="5년 이상: 5점"
          />
          <CheckboxField
            label="자사주 매입 프로그램"
            checked={data.hasBuybackProgram}
            onChange={(v) => handleChange('hasBuybackProgram', v)}
          />
          <InputField
            label="연간 자사주 소각률 (%)"
            type="number"
            value={data.annualCancellationRate}
            onChange={(v) => handleChange('annualCancellationRate', parseFloat(v) || 0)}
            placeholder="예: 1.5"
            hint="1% 이상: 5점"
          />
          <InputField
            label="자사주 비율 (%)"
            type="number"
            value={data.treasuryStockRatio}
            onChange={(v) => handleChange('treasuryStockRatio', parseFloat(v) || 0)}
            placeholder="예: 10"
            hint="5% 이상: 5점"
          />
        </CategorySection>

        {/* Category III: 성장/경영 */}
        <CategorySection title="III. 성장/경영 (25점)" color="#f59e0b">
          <SelectField
            label="성장 잠재력"
            value={data.growthPotential}
            onChange={(v) => handleChange('growthPotential', v as GrowthPotential)}
            options={[
              { value: 'very_high', label: '매우 높음 (10점)' },
              { value: 'high', label: '높음 (7점)' },
              { value: 'normal', label: '보통 (5점)' },
              { value: 'low', label: '낮음 (3점)' },
            ]}
          />
          <SelectField
            label="경영진 품질"
            value={data.managementQuality}
            onChange={(v) => handleChange('managementQuality', v as ManagementQuality)}
            options={[
              { value: 'excellent', label: '우수 (10점)' },
              { value: 'professional', label: '전문경영인 (5점)' },
              { value: 'owner_risk', label: '오너리스크 (0점)' },
            ]}
          />
          <CheckboxField
            label="글로벌 브랜드 보유"
            checked={data.hasGlobalBrand}
            onChange={(v) => handleChange('hasGlobalBrand', v)}
          />
        </CategorySection>
      </div>

      {/* 액션 버튼 */}
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={handleReset}>
          초기화
        </Button>
        {onSave && (
          <Button size="sm" onClick={handleSave}>
            저장
          </Button>
        )}
      </div>
    </div>
  );
}

// ============================================
// Sub-components
// ============================================

function CategorySection({
  title,
  color,
  children,
}: {
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h4 className="flex items-center gap-2 text-sm font-medium">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
        {title}
      </h4>
      <div className="space-y-2 pl-4">{children}</div>
    </div>
  );
}

function ScoreBar({
  label,
  score,
  max,
  color,
}: {
  label: string;
  score: number;
  max: number;
  color: string;
}) {
  const percentage = (score / max) * 100;

  return (
    <div className="flex items-center gap-2">
      <span className="w-28 text-xs text-zinc-500 dark:text-zinc-400">{label}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
      <span className="w-12 text-right text-xs font-medium">
        {score}/{max}
      </span>
    </div>
  );
}

function InputField({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string;
  type?: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="flex items-center justify-between">
        <span className="text-sm text-zinc-700 dark:text-zinc-300">{label}</span>
        {hint && (
          <span className="text-xs text-zinc-400" title={hint}>
            <Info className="h-3.5 w-3.5" />
          </span>
        )}
      </label>
      <Input
        type={type}
        value={value}
        onChange={(val) => onChange(String(val))}
        placeholder={placeholder}
        className="h-8 text-sm"
      />
    </div>
  );
}

function CheckboxField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-zinc-300 text-blue-500 focus:ring-blue-500 dark:border-zinc-600"
      />
      <span className="text-sm text-zinc-700 dark:text-zinc-300">{label}</span>
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-zinc-700 dark:text-zinc-300">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-full rounded-md border border-zinc-300 bg-white px-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default FundamentalGradeInput;
