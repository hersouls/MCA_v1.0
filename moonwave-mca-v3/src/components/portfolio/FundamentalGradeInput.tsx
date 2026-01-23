// ============================================
// Fundamental Grade Input Component
// 100점 만점 펀더멘털 점수 입력 UI
// ============================================

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Clipboard, Calculator, Info, AlertCircle, CheckCircle, Search, Loader2, X } from 'lucide-react';
import type { FundamentalInput, FundamentalResult, GrowthPotential, ManagementQuality, ClipboardParseResult } from '@/types';
import { calculateFundamentalScore, getGradeColor, getGradeDescription } from '@/services/fundamentalGrade';
import { useClipboard, useDropParse, useStockFundamental } from '@/hooks';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FUNDAMENTAL_GRADE_CONFIG } from '@/utils/constants';
import { TEXTS } from '@/utils/texts';

interface FundamentalGradeInputProps {
  initialData?: FundamentalInput;
  initialTicker?: string;
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
  initialTicker,
  onChange,
  onSave,
  compact = false,
}: FundamentalGradeInputProps) {
  const [data, setData] = useState<FundamentalInput>(initialData || DEFAULT_INPUT);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [modifiedFields, setModifiedFields] = useState<Set<string>>(new Set());
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // 클립보드 훅
  const { parseClipboard, isParsing, error: clipboardError } = useClipboard();

  // 종목 검색 훅
  const {
    stockData,
    searchResults,
    isLoading: isStockLoading,
    isSearching,
    error: stockError,
    isManuallyModified,
    searchByQuery,
    selectStock,
    clearSearch,
    markAsModified,
  } = useStockFundamental({
    debounceMs: 300,
    useCache: true,
    onDataLoaded: (loadedData) => {
      // API 데이터를 폼에 자동 적용
      setData((prev) => ({
        ...prev,
        per: loadedData.per ?? prev.per,
        pbr: loadedData.pbr ?? prev.pbr,
        dividendYield: loadedData.dividendYield ?? prev.dividendYield,
      }));
      setModifiedFields(new Set()); // 자동 적용 시 수정 플래그 초기화
      setShowToast(`${loadedData.name} (${loadedData.ticker}) 데이터 적용됨`);
      setTimeout(() => setShowToast(null), 3000);
    },
  });

  // 검색어 변경 시 검색 실행
  useEffect(() => {
    if (searchQuery.length >= 1) {
      searchByQuery(searchQuery);
      setShowSearchResults(true);
    } else {
      clearSearch();
      setShowSearchResults(false);
    }
  }, [searchQuery, searchByQuery, clearSearch]);

  // 초기 종목코드가 있으면 자동 조회
  useEffect(() => {
    if (initialTicker && !stockData) {
      selectStock(initialTicker);
    }
  }, [initialTicker, stockData, selectStock]);

  // 외부 클릭 시 검색 결과 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 종목 선택 핸들러
  const handleSelectStock = async (ticker: string, name: string) => {
    setSearchQuery(`${name} (${ticker})`);
    setShowSearchResults(false);
    await selectStock(ticker);
  };

  // Enter 키로 즉시 검색/조회
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const query = searchQuery.trim();

      // 6자리 이하 숫자면 직접 종목코드 조회
      if (/^\d{1,6}$/.test(query)) {
        const ticker = query.padStart(6, '0');
        setShowSearchResults(false);
        await selectStock(ticker);
      } else if (searchResults.length > 0) {
        // 검색 결과가 있으면 첫 번째 선택
        const first = searchResults[0];
        await handleSelectStock(first.ticker, first.name);
      }
    }
  };

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

    // API에서 가져온 필드를 수동으로 수정한 경우 추적
    if (stockData && ['per', 'pbr', 'dividendYield'].includes(key as string)) {
      setModifiedFields((prev) => new Set(prev).add(key as string));
      markAsModified();
    }

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
      className={`relative rounded-lg border ${isDragging ? 'border-primary-500 bg-primary-500/5' : 'border-zinc-200 dark:border-zinc-700'} ${compact ? 'p-3' : 'p-4'}`}
      {...dragHandlers}
    >
      {/* 드래그 오버레이 */}
      {isDragging && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-primary-500/10">
          <div className="text-center">
            <Clipboard className="mx-auto h-8 w-8 text-primary-500" />
            <p className="mt-2 text-sm text-primary-600 dark:text-primary-400">여기에 데이터 놓기</p>
          </div>
        </div>
      )}

      {/* 헤더 */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary-500" />
          <h3 className="font-semibold text-zinc-900 dark:text-white">Fundamental Grade</h3>
          {isManuallyModified && (
            <span className="rounded-full bg-warning-100 px-2 py-0.5 text-xs font-medium text-warning-700 dark:bg-warning-900/30 dark:text-warning-400">
              수정됨
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            color="secondary"
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

      {/* 종목 검색 */}
      <div ref={searchContainerRef} className="relative mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => searchQuery.length >= 1 && setShowSearchResults(true)}
            placeholder="종목코드 입력 후 Enter (예: 035420)"
            className="w-full rounded-lg border border-zinc-300 bg-white py-2 pl-9 pr-10 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
          />
          {(isSearching || isStockLoading) && (
            <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-zinc-400" />
          )}
          {searchQuery && !isSearching && !isStockLoading && (
            <button
              onClick={() => {
                setSearchQuery('');
                clearSearch();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* 검색 결과 드롭다운 */}
        {showSearchResults && searchResults.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-60 overflow-auto rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
            {searchResults.map((result) => (
              <button
                key={result.ticker}
                onClick={() => handleSelectStock(result.ticker, result.name)}
                className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-zinc-50 dark:hover:bg-zinc-700"
              >
                <span className="font-medium text-zinc-900 dark:text-white">
                  {result.name}
                </span>
                <span className="flex items-center gap-2 text-xs text-zinc-500">
                  <span>{result.ticker}</span>
                  <span className="rounded bg-zinc-100 px-1.5 py-0.5 dark:bg-zinc-700">
                    {result.market}
                  </span>
                </span>
              </button>
            ))}
          </div>
        )}

        {/* 검색 결과 없음 */}
        {showSearchResults && searchQuery.length >= 2 && !isSearching && searchResults.length === 0 && (
          <div className="absolute left-0 right-0 top-full z-20 mt-1 rounded-lg border border-zinc-200 bg-white p-3 text-center text-sm text-zinc-500 shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
            검색 결과가 없습니다
          </div>
        )}
      </div>

      {/* 종목 정보 표시 */}
      {stockData && (
        <div className="mb-4 flex items-center justify-between rounded-lg bg-primary-50 p-3 dark:bg-primary-900/20">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
              {stockData.name}
            </span>
            <span className="rounded bg-primary-100 px-1.5 py-0.5 text-xs text-primary-600 dark:bg-primary-800/50 dark:text-primary-400">
              {stockData.ticker}
            </span>
            <span className="text-xs text-primary-500">{stockData.market}</span>
          </div>
          <span className="text-xs text-primary-500 dark:text-primary-400">
            {new Date(stockData.fetchedAt).toLocaleDateString('ko-KR')} 기준
          </span>
        </div>
      )}

      {/* API 에러 */}
      {stockError && (
        <div className="mb-3 flex items-center gap-2 rounded-md bg-danger-100 px-3 py-2 text-sm text-danger-700 dark:bg-danger-900/30 dark:text-danger-400">
          <AlertCircle className="h-4 w-4" />
          {stockError}
        </div>
      )}

      {/* 토스트 메시지 */}
      {showToast && (
        <div className="mb-3 flex items-center gap-2 rounded-md bg-success-100 px-3 py-2 text-sm text-success-700 dark:bg-success-900/30 dark:text-success-400">
          <CheckCircle className="h-4 w-4" />
          {showToast}
        </div>
      )}

      {/* 클립보드 에러 */}
      {clipboardError && (
        <div className="mb-3 flex items-center gap-2 rounded-md bg-danger-100 px-3 py-2 text-sm text-danger-700 dark:bg-danger-900/30 dark:text-danger-400">
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
            <ScoreBar label={TEXTS.FUNDAMENTAL.CATEGORY_VALUATION} score={result.categoryScores.valuation} max={FUNDAMENTAL_GRADE_CONFIG.CATEGORY_MAX.VALUATION} color="#00A86B" />
            <ScoreBar label={TEXTS.FUNDAMENTAL.CATEGORY_SHAREHOLDER} score={result.categoryScores.shareholderReturn} max={FUNDAMENTAL_GRADE_CONFIG.CATEGORY_MAX.SHAREHOLDER_RETURN} color="#22c55e" />
            <ScoreBar label={TEXTS.FUNDAMENTAL.CATEGORY_GROWTH} score={result.categoryScores.growthManagement} max={FUNDAMENTAL_GRADE_CONFIG.CATEGORY_MAX.GROWTH_MANAGEMENT} color="#f59e0b" />
          </div>
        </div>
      )}

      {/* 입력 폼 */}
      <div className={`space-y-4 ${compact ? 'text-sm' : ''}`}>
        {/* Category I: 가치평가 */}
        <CategorySection title={`I. 가치평가 (${FUNDAMENTAL_GRADE_CONFIG.CATEGORY_MAX.VALUATION}${TEXTS.UNITS.POINTS})`} color="#00A86B">
          <div className="grid gap-3 sm:grid-cols-2">
            <InputField
              label="PER"
              type="number"
              value={data.per ?? ''}
              onChange={(v) => handleChange('per', v ? parseFloat(v) : null)}
              placeholder="예: 8.5"
              hint="10 이하: 10점, 10-15: 5점"
              modified={modifiedFields.has('per')}
            />
            <InputField
              label="PBR"
              type="number"
              value={data.pbr ?? ''}
              onChange={(v) => handleChange('pbr', v ? parseFloat(v) : null)}
              placeholder="예: 0.8"
              hint="1 이하: 10점, 1-2: 5점"
              modified={modifiedFields.has('pbr')}
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
        <CategorySection title={`II. 주주환원 (${FUNDAMENTAL_GRADE_CONFIG.CATEGORY_MAX.SHAREHOLDER_RETURN}${TEXTS.UNITS.POINTS})`} color="#22c55e">
          <InputField
            label="배당수익률 (%)"
            type="number"
            value={data.dividendYield ?? ''}
            onChange={(v) => handleChange('dividendYield', v ? parseFloat(v) : null)}
            placeholder="예: 3.5"
            hint="3% 이상: 10점, 1-3%: 5점"
            modified={modifiedFields.has('dividendYield')}
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
        <CategorySection title={`III. 성장/경영 (${FUNDAMENTAL_GRADE_CONFIG.CATEGORY_MAX.GROWTH_MANAGEMENT}${TEXTS.UNITS.POINTS})`} color="#f59e0b">
          <SelectField
            label={TEXTS.FUNDAMENTAL.GROWTH_POTENTIAL}
            value={data.growthPotential}
            onChange={(v) => handleChange('growthPotential', v as GrowthPotential)}
            options={[
              { value: 'very_high', label: `${TEXTS.FUNDAMENTAL.GROWTH_VERY_HIGH} (${FUNDAMENTAL_GRADE_CONFIG.GROWTH_SCORES.very_high}${TEXTS.UNITS.POINTS})` },
              { value: 'high', label: `${TEXTS.FUNDAMENTAL.GROWTH_HIGH} (${FUNDAMENTAL_GRADE_CONFIG.GROWTH_SCORES.high}${TEXTS.UNITS.POINTS})` },
              { value: 'normal', label: `${TEXTS.FUNDAMENTAL.GROWTH_NORMAL} (${FUNDAMENTAL_GRADE_CONFIG.GROWTH_SCORES.normal}${TEXTS.UNITS.POINTS})` },
              { value: 'low', label: `${TEXTS.FUNDAMENTAL.GROWTH_LOW} (${FUNDAMENTAL_GRADE_CONFIG.GROWTH_SCORES.low}${TEXTS.UNITS.POINTS})` },
            ]}
          />
          <SelectField
            label={TEXTS.FUNDAMENTAL.MANAGEMENT_QUALITY}
            value={data.managementQuality}
            onChange={(v) => handleChange('managementQuality', v as ManagementQuality)}
            options={[
              { value: 'excellent', label: `${TEXTS.FUNDAMENTAL.MGMT_EXCELLENT} (${FUNDAMENTAL_GRADE_CONFIG.MANAGEMENT_SCORES.excellent}${TEXTS.UNITS.POINTS})` },
              { value: 'professional', label: `${TEXTS.FUNDAMENTAL.MGMT_PROFESSIONAL} (${FUNDAMENTAL_GRADE_CONFIG.MANAGEMENT_SCORES.professional}${TEXTS.UNITS.POINTS})` },
              { value: 'owner_risk', label: `${TEXTS.FUNDAMENTAL.MGMT_OWNER_RISK} (${FUNDAMENTAL_GRADE_CONFIG.MANAGEMENT_SCORES.owner_risk}${TEXTS.UNITS.POINTS})` },
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
        <Button plain color="secondary" size="sm" onClick={handleReset}>
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
  modified,
}: {
  label: string;
  type?: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  modified?: boolean;
}) {
  return (
    <div className="space-y-1">
      <label className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-sm text-zinc-700 dark:text-zinc-300">
          {label}
          {modified && (
            <span className="rounded bg-warning-100 px-1 py-0.5 text-[10px] font-medium text-warning-600 dark:bg-warning-900/30 dark:text-warning-400">
              수정됨
            </span>
          )}
        </span>
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
        className="h-4 w-4 rounded border-zinc-300 text-primary-500 focus:ring-primary-500 dark:border-zinc-600"
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
        className="h-8 w-full rounded-md border border-zinc-300 bg-white px-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-zinc-600 dark:bg-zinc-800"
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
