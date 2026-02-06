import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input, Label, Textarea } from '@/components/ui/Input';
import { ButtonSelect as Select } from '@/components/ui/Select';
import { useToast } from '@/components/ui/Toast';
import { useClipboard } from '@/hooks/useClipboard';
import { gemDataToFundamentalInput, parseGeminiGemJson } from '@/services/clipboard';
import { calculateFundamentalScore, getGradeBadgeClass, getGradeCardClass } from '@/services/fundamentalGrade';
import type {
  FundamentalInput,
  FundamentalResult,
  FutureInvestment,
  GlobalScalability,
  GovernanceRisk,
  MarketDominance,
  TotalShareholderReturn
} from '@/types';
import { cn } from '@/utils/cn';
import {
  ArrowDown,
  ChevronDown,
  ChevronUp,
  ClipboardPaste,
  DollarSign,
  Gift,
  RotateCcw,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface FundamentalGradeInputProps {
  initialData?: FundamentalInput;
  stockData?: { per: number | null; pbr: number | null; dividendYield: number | null } | null;
  onSave: (data: FundamentalInput, result: FundamentalResult, ticker?: string) => void;
  onCancel?: () => void;
}

const DEFAULT_INPUT: FundamentalInput = {
  // Valuation
  per: null,
  pbr: null,
  isDualListed: false, // false=단독(5점), true=중복(0점)으로 처리 (단순화)

  // Growth
  globalScalability: null,
  marketDominance: null,
  futureInvestment: null,

  // Shareholder
  dividendYield: null,
  totalShareholderReturn: null,
  governanceRisk: null,
};

const GEM_JSON_PLACEHOLDER = `{
  "stockName": "LG씨엔에스",
  "stockCode": "064400",
  "per": 17.3,
  "pbr": 3.16,
  "governanceStructure": "partial",
  "globalRevenueType": "expanding",
  "marketDominance": "oligopoly",
  "rdCapexEfficiency": "high",
  "tsrPolicy": "dividend_only",
  "governanceRisk": "moderate",
  "totalScore": 65,
  "grade": "B"
}`;

/**
 * 데이터가 입력되지 않은 초기 상태인지 확인
 */
function isEmptyData(input: FundamentalInput): boolean {
  return (
    input.globalScalability === null &&
    input.marketDominance === null &&
    input.futureInvestment === null &&
    input.totalShareholderReturn === null &&
    input.governanceRisk === null
  );
}

export function FundamentalGradeInput({
  initialData,
  stockData,
  onSave,
  onCancel,
}: FundamentalGradeInputProps) {
  const [data, setData] = useState<FundamentalInput>(initialData || DEFAULT_INPUT);
  const [result, setResult] = useState<FundamentalResult | null>(null);
  const [ticker, setTicker] = useState<string | undefined>();
  const [stockName, setStockName] = useState<string | undefined>();

  // Import State
  const [jsonInput, setJsonInput] = useState('');
  const [isManualOpen, setIsManualOpen] = useState(false);

  const { parseGemJson, isParsing } = useClipboard();
  const toast = useToast();

  // 데이터가 비어있는지 확인
  const isEmpty = isEmptyData(data);

  // stockData로 PER, PBR, 배당수익률 자동 채우기
  useEffect(() => {
    if (stockData && !initialData) {
      setData((prev) => ({
        ...prev,
        per: stockData.per ?? prev.per,
        pbr: stockData.pbr ?? prev.pbr,
        dividendYield: stockData.dividendYield ?? prev.dividendYield,
      }));
    }
  }, [stockData, initialData]);

  // 실시간 계산
  useEffect(() => {
    const calcResult = calculateFundamentalScore(data);
    setResult(calcResult);
  }, [data]);

  const handleChange = (field: keyof FundamentalInput, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    if (confirm('모든 입력값을 초기화하시겠습니까?')) {
      setData(DEFAULT_INPUT);
      setTicker(undefined);
      setStockName(undefined);
      setJsonInput('');
    }
  };

  /**
   * Gemini Gem 클립보드 붙여넣기
   */
  const handleClipboardPaste = async () => {
    const gemResult = await parseGemJson();

    if (!gemResult) {
      toast.error('클립보드를 읽을 수 없습니다.');
      return;
    }

    if (!gemResult.success || !gemResult.data) {
      toast.error(gemResult.error || 'Gem JSON 파싱 실패');
      return;
    }

    applyGemData(gemResult.data, gemResult.rawValues);
  };

  /**
   * 수동 JSON 텍스트 파싱 및 적용
   */
  const handleManualApply = () => {
    if (!jsonInput.trim()) {
      toast.error('JSON 데이터를 입력해주세요.');
      return;
    }

    const gemResult = parseGeminiGemJson(jsonInput);

    if (!gemResult.success || !gemResult.data) {
      toast.error(gemResult.error || '유효하지 않은 Gem JSON 형식입니다.');
      return;
    }

    applyGemData(gemResult.data, gemResult.rawValues);
  };

  /**
   * 공통 데이터 적용 로직
   */
  const applyGemData = (gemData: any, rawValues: any) => {
    // 종목 불일치 체크 - 경고 메시지 표시 하되 덮어쓰기 허용
    if (ticker && rawValues?.stockCode && ticker !== rawValues.stockCode) {
      if (!confirm(`현재 종목(${stockName || ticker})과 붙여넣은 종목(${rawValues.stockName || rawValues.stockCode})이 다릅니다. \n\n새로운 종목 데이터로 덮어쓰시겠습니까?`)) {
        return;
      }
    }

    // GeminiGemData → FundamentalInput 변환
    const fundamentalInput = gemDataToFundamentalInput(gemData, rawValues);
    setData(fundamentalInput);

    // 종목코드/종목명 저장
    if (rawValues?.stockCode) {
      setTicker(rawValues.stockCode);
    }
    if (rawValues?.stockName) {
      setStockName(rawValues.stockName);
    }

    toast.success(
      rawValues?.stockName
        ? `${rawValues.stockName} 데이터가 적용되었습니다.`
        : 'Gem 데이터가 적용되었습니다.'
    );
  };

  return (
    <div className="space-y-[26px]">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-card/80 backdrop-blur-lg border-b border-border -mx-4 -mt-4 px-4 pt-4 pb-[6px] md:mx-0 md:mt-0 md:px-0">
        {isEmpty ? (
          <Card className="pt-4 px-4 pb-[6px] border-2 border-border bg-surface-hover">
            <div className="flex items-center gap-4">
              <div className="w-[68px] h-[68px] text-2xl shadow-lg flex items-center justify-center font-black rounded-2xl bg-surface-active text-muted-foreground">
                ?
              </div>
              <div>
                <div className="text-xl font-bold text-muted-foreground">
                  미등록
                </div>
                <div className="text-sm text-muted-foreground mt-[6px]">
                  Fundamental Grade가 등록되지 않았습니다
                </div>
              </div>
            </div>
            <div className="mt-[10px] pt-[10px] border-t border-border">
              <div className="flex items-start gap-[6px]">
                <Sparkles className="h-4 w-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  아래 <span className="font-semibold text-indigo-600 dark:text-indigo-400">Gemini Gem Analysis</span>를 통해 종목을 분석하고 결과를 붙여넣어 주세요.
                </p>
              </div>
            </div>
          </Card>
        ) : result && (
          <Card className={cn("pt-4 px-4 pb-[6px] border-2 transition-all", getGradeCardClass(result.grade))}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={cn("grade-badge w-[68px] h-[68px] text-3xl shadow-lg flex items-center justify-center font-black rounded-2xl", getGradeBadgeClass(result.grade))}>
                  {result.grade}
                </div>
                <div>
                  <div className="text-3xl font-bold font-mono">
                    {result.totalScore}
                    <span className="text-lg text-muted-foreground font-normal">/100</span>
                  </div>
                  <div className="flex gap-[6px] mt-[6px] text-xs text-muted-foreground">
                    <span>Val {result.categoryScores.valuation}</span>
                    <span>|</span>
                    <span>Growth {result.categoryScores.growthMoat}</span>
                    <span>|</span>
                    <span>Return {result.categoryScores.shareholderReturn}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-[10px] pt-[10px] border-t border-border">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {result.actionGuideline}
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* Gemini Analysis Section (Always Visible, No Toggle) */}
      <Card className="border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-950/10">
        <div className="p-4 flex items-center justify-between border-b border-indigo-100 dark:border-indigo-900/30">
          <div className="flex items-center gap-[6px]">
            <Sparkles className="h-4 w-4 text-indigo-500" />
            <span className="font-semibold text-indigo-700 dark:text-indigo-300">Gemini Gem Analysis</span>
          </div>
        </div>

        <div className="p-4 space-y-4 pt-4">
          <div className="flex flex-col sm:flex-row gap-[10px]">
            <Button
              variant="secondary"
              className="flex-1 gap-[6px] border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-300 dark:hover:bg-indigo-900/30 ring-1 ring-inset ring-indigo-200 dark:ring-indigo-800"
              onClick={() => window.open('https://gemini.google.com/gem/1hVQdXM7dV3BdGILb2-UKvdKlncTTaNop?usp=sharing', '_blank')}
            >
              <Sparkles className="h-4 w-4" />
              Gemini Gem 열기
            </Button>
            <Button
              variant="secondary"
              className="flex-1 gap-[6px]"
              onClick={handleClipboardPaste}
              disabled={isParsing}
            >
              <ClipboardPaste className="h-4 w-4" />
              {isParsing ? '파싱 중...' : 'Gem 결과 클립보드 붙여넣기'}
            </Button>
          </div>

          <div className="relative">
            <div className="flex items-baseline justify-between mb-[6px]">
              <Label className="text-xs text-muted-foreground">Gem JSON 결과 붙여넣기</Label>
              <span className="text-xs text-muted-foreground">Gemini 결과를 붙여넣고 적용</span>
            </div>
            <Textarea
              value={jsonInput}
              onChange={(val) => setJsonInput(val)}
              placeholder={GEM_JSON_PLACEHOLDER}
              className="min-h-[136px] font-mono text-xs bg-card resize-y"
            />
            <div className="flex justify-end mt-[10px]">
              <Button
                onClick={handleManualApply}
                className="gap-[6px] shadow-lg py-[6px] px-[16px] h-auto font-bold"
              >
                <ArrowDown className="h-[10px] w-[10px]" />
                적용하기
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Manual Input Section (Collapsible) */}
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setIsManualOpen(!isManualOpen)}
          className="flex items-center justify-between w-full p-[6px] hover:bg-surface-hover rounded-[10px] transition-colors group"
        >
          <div className="flex items-center gap-[6px]">
            <div className="p-1 rounded bg-surface-active group-hover:bg-border transition-colors">
              {isManualOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              상세 평가 항목 (Manual Adjustments)
            </span>
          </div>
          <div className="h-px flex-1 bg-border ml-4" />
        </button>

        {isManualOpen && (
          <div className="grid gap-[26px] md:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-top-4 duration-300">
            {/* Category 1: Valuation (35pts) */}
            <Card padding="md" className="space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-[6px]">
                <div className="flex items-center gap-[6px]">
                  <div className="p-1.5 rounded-[10px] bg-surface-hover">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <h4 className="font-semibold text-foreground">1. Valuation</h4>
                </div>
                <span className="font-mono text-sm text-muted-foreground">{result?.categoryScores.valuation}/35</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>PER (주가수익비율)</Label>
                  <Input
                    type="number"
                    placeholder="예: 12.5"
                    value={data.per ?? ''}
                    onChange={(value) => handleChange('per', value ? Number(value) : null)}
                  />
                  <p className="text-xs text-muted-foreground">10미만(15), 20미만(12), 30미만(8)</p>
                </div>
                <div className="space-y-1">
                  <Label>PBR (주가순자산비율)</Label>
                  <Input
                    type="number"
                    placeholder="예: 1.2"
                    value={data.pbr ?? ''}
                    onChange={(value) => handleChange('pbr', value ? Number(value) : null)}
                  />
                  <p className="text-xs text-muted-foreground">0.8미만(15), 1.5미만(12), 2.5미만(8)</p>
                </div>
              </div>

              <div className="space-y-2 pt-[6px]">
                <div className="flex items-center justify-between">
                  <Label htmlFor="dual-list">지배구조/중복상장 이슈</Label>
                  <div className="flex items-center gap-[6px]">
                    <input
                      id="dual-list"
                      type="checkbox"
                      className="toggle toggle-sm toggle-error"
                      checked={data.isDualListed}
                      onChange={(e) => handleChange('isDualListed', e.target.checked)}
                    />
                    <span className="text-xs">{data.isDualListed ? '이슈 있음 (0점)' : '양호 (5점)'}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">핵심 자회사 중복 상장 또는 지주사 할인 대상인 경우 체크</p>
              </div>
            </Card>

            {/* Category 2: Growth & Moat (40pts) */}
            <Card padding="md" className="space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-[6px]">
                <div className="flex items-center gap-[6px]">
                  <div className="p-1.5 rounded-[10px] bg-surface-hover">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <h4 className="font-semibold text-foreground">2. Growth</h4>
                </div>
                <span className="font-mono text-sm text-muted-foreground">{result?.categoryScores.growthMoat}/40</span>
              </div>

              <Select
                label="글로벌 확장성 (Scalability)"
                value={data.globalScalability}
                onChange={(val) => handleChange('globalScalability', val as GlobalScalability)}
                options={[
                  { value: 'high_growth', label: '글로벌 High Growth / Tech (20점)' },
                  { value: 'expanding', label: '글로벌 확장 진행 중 (12점)' },
                  { value: 'domestic_regulated', label: '내수 중심 / 규제 산업 (5점)' },
                ]}
              />

              <Select
                label="시장 지배력 (Moat)"
                value={data.marketDominance}
                onChange={(val) => handleChange('marketDominance', val as MarketDominance)}
                options={[
                  { value: 'monopoly_top', label: '독점적 1위 / Global Top Tier (10점)' },
                  { value: 'oligopoly_top3', label: '과점 시장 내 Top 3 (7점)' },
                  { value: 'competitive', label: '경쟁 심화 / 변별력 낮음 (3점)' },
                ]}
              />

              <Select
                label="미래 투자 효율 (CAPEX/R&D)"
                value={data.futureInvestment}
                onChange={(val) => handleChange('futureInvestment', val as FutureInvestment)}
                options={[
                  { value: 'high', label: '성장 위한 적극적 재투자 (10점)' },
                  { value: 'maintain', label: '현상 유지 수준 (5점)' },
                  { value: 'decreasing', label: '투자 감소 / 정체 (0점)' },
                ]}
              />
            </Card>

            {/* Category 3: Shareholder Return (25pts) */}
            <Card padding="md" className="space-y-4 md:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between border-b border-border pb-[6px]">
                <div className="flex items-center gap-[6px]">
                  <div className="p-1.5 rounded-[10px] bg-surface-hover">
                    <Gift className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <h4 className="font-semibold text-foreground">3. Return</h4>
                </div>
                <span className="font-mono text-sm text-muted-foreground">{result?.categoryScores.shareholderReturn}/25</span>
              </div>

              <div className="space-y-1">
                <Label>참고: 배당수익률 (%)</Label>
                <Input
                  type="number"
                  placeholder="직관적 참고용"
                  value={data.dividendYield ?? ''}
                  onChange={(value) => handleChange('dividendYield', value ? Number(value) : null)}
                />
              </div>

              <Select
                label="총주주환원 (TSR Policy)"
                value={data.totalShareholderReturn}
                onChange={(val) => handleChange('totalShareholderReturn', val as TotalShareholderReturn)}
                options={[
                  { value: 'active_growth', label: '적극적 소각 + 배당 성장 (15점)' },
                  { value: 'high_yield', label: '단순 고배당 유지 / 성장 정체 (10점)' },
                  { value: 'minimum', label: '법적/최소 배당 (5점)' },
                  { value: 'none', label: '주주환원 미흡 (0점)' },
                ]}
              />

              <Select
                label="거버넌스 리스크 (Governance)"
                value={data.governanceRisk}
                onChange={(val) => handleChange('governanceRisk', val as GovernanceRisk)}
                options={[
                  { value: 'clean', label: 'Clean / 소각 원칙 (10점)' },
                  { value: 'shareholder_friendly', label: '주주친화적 행보 (7점)' },
                  { value: 'defense_doubt', label: '단순 자사주 보유 / 방어 목적 (3점)' },
                ]}
              />
            </Card>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-4 border-t">
        <Button variant="ghost" type="button" onClick={handleReset} className="text-muted-foreground">
          <RotateCcw className="mr-2 h-4 w-4" />
          초기화
        </Button>
        <div className="flex gap-[6px]">
          {onCancel && (
            <Button variant="secondary" type="button" onClick={onCancel}>취소</Button>
          )}
          <Button
            type="button"
            onClick={() => result && onSave(data, result, ticker)}
            disabled={!result || isEmpty}
            className="px-8 font-bold"
          >
            저장
          </Button>
        </div>
      </div>
    </div>
  );
}
