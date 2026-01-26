// ============================================
// Portfolio Detail Page Component
// ============================================

import { ArrowLeft, BookOpen, FileText, Settings2, Star, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ErrorState, PageContainer, Section } from '@/components/layout';
import {
  Button,
  Card,
  IconButton,
  StatGrid,
  StatItem,
  StatsCard,
  StockLogo,
  Tooltip,
} from '@/components/ui';
import {
  calculateTotalBudget,
  calculateTrades,
  getCurrentInvestment,
} from '@/services/calculation';
import { selectPortfolioStats, usePortfolioStore } from '@/stores/portfolioStore';
import type {
  FundamentalData,
  FundamentalInput,
  FundamentalResult,
  PortfolioParams,
  StockFundamentalData,
  Trade,
} from '@/types';
import { formatCurrency, formatKoreanUnit, formatPercent } from '@/utils/format';
import { TEXTS } from '@/utils/texts';
import { getBlogUrl } from '@/data/stockBlogUrls';
import { ExitSimulator } from './ExitSimulator';
import { FundamentalGradeInput } from './FundamentalGradeInput';
import { MCAChart } from './MCAChart';
import { ParameterEditor } from './ParameterEditor';
import { TradeTable } from './TradeTable';

// Stable empty array to avoid creating new reference on each render
const EMPTY_TRADES: Trade[] = [];

export function PortfolioDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State
  const [isParamEditorOpen, setIsParamEditorOpen] = useState(false);
  const [portfolioMemo, setPortfolioMemo] = useState('');
  const [stockFundamentalData] = useState<StockFundamentalData | null>(null);

  // Store
  const portfolios = usePortfolioStore((state) => state.portfolios);
  const setActivePortfolio = usePortfolioStore((state) => state.setActivePortfolio);
  const loadTradesForPortfolio = usePortfolioStore((state) => state.loadTradesForPortfolio);
  const toggleFavorite = usePortfolioStore((state) => state.toggleFavorite);
  const deletePortfolio = usePortfolioStore((state) => state.deletePortfolio);
  const updatePortfolio = usePortfolioStore((state) => state.updatePortfolio);
  const toggleOrderedStep = usePortfolioStore((state) => state.toggleOrderedStep);
  const toggleExecutedStep = usePortfolioStore((state) => state.toggleExecutedStep);
  const updateExecutionDate = usePortfolioStore((state) => state.updateExecutionDate);
  const updateStepMemo = usePortfolioStore((state) => state.updateStepMemo);
  const trades = usePortfolioStore((state) => state.trades.get(Number(id)) ?? EMPTY_TRADES);
  const stats = usePortfolioStore((state) => selectPortfolioStats(state, Number(id)));

  // Find portfolio
  const portfolio = portfolios.find((p) => p.id === Number(id));

  // Load portfolio data
  useEffect(() => {
    if (id) {
      const portfolioId = Number(id);
      setActivePortfolio(portfolioId);
      loadTradesForPortfolio(portfolioId);
    }
  }, [id, setActivePortfolio, loadTradesForPortfolio]);

  // portfolioMemo 초기값은 useState에서 설정하지 않고
  // portfolio 변경 시 별도로 처리 (controlled pattern 권장)
  // 현재는 portfolio.memo를 직접 표시하고 수정 시에만 로컬 상태 사용
  const displayMemo = portfolioMemo || portfolio?.memo || '';

  // Derived data
  const orderedSteps = useMemo(
    () =>
      trades.filter((t) => t.status === 'ordered' || t.status === 'executed').map((t) => t.step),
    [trades]
  );

  const executedSteps = useMemo(
    () => trades.filter((t) => t.status === 'executed').map((t) => t.step),
    [trades]
  );

  // Calculate current investment from trades (includes legacy holdings)
  const currentInvestment = useMemo(() => {
    if (!portfolio) return { amount: 0, quantity: 0, avgPrice: 0 };
    const calculatedTrades = calculateTrades(portfolio.params, orderedSteps, executedSteps);
    return getCurrentInvestment(calculatedTrades, portfolio.params);
  }, [portfolio, orderedSteps, executedSteps]);

  // Total budget
  const totalBudget = useMemo(() => {
    if (!portfolio) return 0;
    return calculateTotalBudget(portfolio.params);
  }, [portfolio]);

  // Handlers
  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleToggleFavorite = () => {
    if (portfolio?.id) {
      toggleFavorite(portfolio.id);
    }
  };

  const handleDelete = async () => {
    if (portfolio && window.confirm(`"${portfolio.name}" 종목을 삭제하시겠습니까?`)) {
      await deletePortfolio(portfolio.id!);
      navigate('/dashboard');
    }
  };

  // portfolio.id를 미리 추출하여 안정적인 의존성 제공
  const portfolioId = portfolio?.id;

  const handleToggleOrdered = useCallback(
    (step: number) => {
      if (portfolioId !== undefined) {
        toggleOrderedStep(portfolioId, step);
      }
    },
    [portfolioId, toggleOrderedStep]
  );

  const handleToggleExecuted = useCallback(
    (step: number) => {
      if (portfolioId !== undefined) {
        toggleExecutedStep(portfolioId, step);
      }
    },
    [portfolioId, toggleExecutedStep]
  );

  const handleDateChange = useCallback(
    (step: number, date: string) => {
      if (portfolioId !== undefined) {
        updateExecutionDate(portfolioId, step, date);
      }
    },
    [portfolioId, updateExecutionDate]
  );

  const handleMemoChangeByStep = useCallback(
    (step: number, memo: string) => {
      if (portfolioId !== undefined) {
        updateStepMemo(portfolioId, step, memo);
      }
    },
    [portfolioId, updateStepMemo]
  );

  const handleSaveParams = async (params: Partial<PortfolioParams>) => {
    if (portfolio?.id) {
      await updatePortfolio(portfolio.id, { params: { ...portfolio.params, ...params } });
    }
  };

  const handleMemoBlur = async () => {
    if (portfolio?.id && portfolioMemo !== portfolio.memo) {
      await updatePortfolio(portfolio.id, { memo: portfolioMemo });
    }
  };

  // Fundamental Grade 저장 핸들러
  const handleSaveFundamental = async (
    data: FundamentalInput,
    result: FundamentalResult,
    ticker?: string
  ) => {
    if (portfolio?.id) {
      const fundamentalData: FundamentalData = {
        ...data,
        dataSource: ticker ? 'api' : 'manual',
        lastUpdated: new Date(),
      };
      await updatePortfolio(portfolio.id, {
        fundamentalScore: result.totalScore,
        fundamentalGrade: result.grade,
        fundamentalData,
        // 종목코드도 함께 저장
        ...(ticker && { stockCode: ticker }),
      });
    }
  };

  // Error state
  if (!portfolio) {
    return (
      <PageContainer>
        <ErrorState
          title="종목을 찾을 수 없습니다"
          message="요청하신 종목이 존재하지 않거나 삭제되었습니다."
          action={<Button onClick={() => navigate('/dashboard')}>대시보드로 돌아가기</Button>}
        />
      </PageContainer>
    );
  }

  const progress = stats ? (stats.executedStepsCount / portfolio.params.steps) * 100 : 0;

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Tooltip content="뒤로 가기" placement="bottom">
            <IconButton plain color="secondary" onClick={handleBack} aria-label="뒤로 가기">
              <ArrowLeft className="w-5 h-5" />
            </IconButton>
          </Tooltip>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              {portfolio.stockCode && (
                <StockLogo
                  code={portfolio.stockCode}
                  name={portfolio.name}
                  size={40}
                  className="shadow-sm"
                />
              )}
              <div>
                <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  {portfolio.name}
                </h1>
                {portfolio.stockCode && (
                  <span className="text-xs font-medium text-zinc-500 font-mono tracking-wide">
                    {portfolio.stockCode} • {portfolio.market || 'KRX'}
                  </span>
                )}
              </div>
            </div>
            <Tooltip
              content={portfolio.isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
              placement="bottom"
            >
              <button
                onClick={handleToggleFavorite}
                className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors"
                aria-label={portfolio.isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
              >
                <Star
                  className={`w-5 h-5 ${portfolio.isFavorite
                      ? 'text-warning-500 fill-warning-500'
                      : 'text-zinc-400 dark:text-zinc-500'
                    }`}
                />
              </button>
            </Tooltip>
            {portfolio.stockCode && getBlogUrl(portfolio.stockCode) && (
              <Tooltip content="블로그 포스팅" placement="bottom">
                <a
                  href={getBlogUrl(portfolio.stockCode)!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors"
                  aria-label="블로그 포스팅 보기"
                >
                  <BookOpen className="w-5 h-5 text-primary-500" />
                </a>
              </Tooltip>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Tooltip content="파라미터 설정" placement="bottom">
            <IconButton
              plain
              color="secondary"
              onClick={() => setIsParamEditorOpen(true)}
              aria-label="설정"
            >
              <Settings2 className="w-5 h-5" />
            </IconButton>
          </Tooltip>
          <Tooltip content="종목 삭제" placement="bottom">
            <IconButton color="danger" onClick={handleDelete} aria-label="삭제">
              <Trash2 className="w-5 h-5" />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      {/* Stats Summary - Using StatsCard for consistency */}
      <Section>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            label={TEXTS.PORTFOLIO.PROGRESS}
            value={formatPercent(progress)}
            tooltip={TEXTS.PORTFOLIO.PROGRESS_TOOLTIP}
            progress={{
              value: progress,
              label: `${stats?.executedStepsCount ?? 0}/${portfolio.params.steps} 구간 체결`,
            }}
          />
          <StatsCard
            label={TEXTS.PORTFOLIO.INVESTED_AMOUNT}
            value={formatKoreanUnit(currentInvestment.amount)}
            subValue={`예산: ${formatKoreanUnit(portfolio.params.targetBudget)}`}
            tooltip={TEXTS.PORTFOLIO.INVESTED_AMOUNT_TOOLTIP}
          />
          <StatsCard
            label={TEXTS.PORTFOLIO.AVG_PRICE}
            value={currentInvestment.avgPrice ? formatCurrency(currentInvestment.avgPrice) : '-'}
            subValue={`보유: ${currentInvestment.quantity.toLocaleString()}주`}
            tooltip={TEXTS.PORTFOLIO.AVG_PRICE_TOOLTIP}
            valueColor="primary"
          />
          <StatsCard
            label={TEXTS.PORTFOLIO.PENDING_ORDERS}
            value={formatKoreanUnit(stats?.totalOrderedAmount ?? 0)}
            subValue={`${(stats?.orderedStepsCount ?? 0) - (stats?.executedStepsCount ?? 0)}개 구간`}
            tooltip={TEXTS.PORTFOLIO.PENDING_ORDERS_TOOLTIP}
            valueColor="warning"
          />
        </div>
      </Section>

      {/* Parameter Panel */}
      <Section title="매매 파라미터" tooltip="상단의 설정 아이콘을 클릭하면 설정할 수 있습니다">
        <Card>
          <StatGrid columns={6} responsive>
            <StatItem label="고점 가격" value={formatCurrency(portfolio.params.peakPrice)} />
            <StatItem label="매수 강도" value={`${portfolio.params.strength}x`} />
            <StatItem label="시작 하락률" value={`-${portfolio.params.startDrop}%`} />
            <StatItem label="분할 구간" value={`${portfolio.params.steps}구간`} />
            <StatItem label="목표 예산" value={formatKoreanUnit(portfolio.params.targetBudget)} />
            <StatItem label="예상 총 투자" value={formatKoreanUnit(totalBudget)} />
          </StatGrid>
          {(portfolio.params.legacyQty > 0 || portfolio.params.legacyAvg > 0) && (
            <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700/50">
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">기보유</p>
              <StatGrid columns={2} divided>
                <StatItem label="수량" value={`${portfolio.params.legacyQty.toLocaleString()}주`} />
                <StatItem label="평단가" value={formatCurrency(portfolio.params.legacyAvg)} />
              </StatGrid>
            </div>
          )}
        </Card>
      </Section>

      {/* Chart */}
      <Section title="평단가 방어선 차트">
        <MCAChart
          params={portfolio.params}
          orderedSteps={orderedSteps}
          executedSteps={executedSteps}
          height={320}
        />
      </Section>

      {/* Trade Table */}
      <Section title="매매 체결 리스트">
        <TradeTable
          params={portfolio.params}
          orderedSteps={orderedSteps}
          executedSteps={executedSteps}
          onToggleOrdered={handleToggleOrdered}
          onToggleExecuted={handleToggleExecuted}
          executionDates={portfolio.params.executionDates || {}}
          stepMemos={portfolio.params.stepMemos || {}}
          onDateChange={handleDateChange}
          onMemoChange={handleMemoChangeByStep}
        />
      </Section>

      {/* Exit Simulator */}
      <Section title="목표가 시뮬레이션">
        <ExitSimulator
          params={portfolio.params}
          currentAmount={currentInvestment.amount}
          currentQty={currentInvestment.quantity}
          avgPrice={currentInvestment.avgPrice}
          onUpdateParams={handleSaveParams}
        />
      </Section>

      {/* Fundamental Grade */}
      <Section title="Fundamental Grade">
        <FundamentalGradeInput
          initialData={portfolio.fundamentalData}
          stockData={stockFundamentalData}
          onSave={handleSaveFundamental}
        />
      </Section>

      {/* Memo */}
      <Section title="메모">
        <Card>
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-zinc-400 dark:text-zinc-500 flex-shrink-0 mt-0.5" />
            <textarea
              value={displayMemo}
              onChange={(e) => setPortfolioMemo(e.target.value)}
              onBlur={handleMemoBlur}
              placeholder="이 종목에 대한 메모를 입력하세요..."
              className="flex-1 min-h-[100px] bg-transparent border-none resize-none text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none"
            />
          </div>
        </Card>
      </Section>

      {/* Parameter Editor Modal */}
      <ParameterEditor
        portfolio={portfolio}
        isOpen={isParamEditorOpen}
        onClose={() => setIsParamEditorOpen(false)}
        onSave={handleSaveParams}
      />
    </PageContainer>
  );
}
