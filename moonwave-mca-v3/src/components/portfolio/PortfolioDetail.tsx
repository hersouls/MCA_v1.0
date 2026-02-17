// ============================================
// Portfolio Detail Page Component
// ============================================

import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, FileText, Settings2, Star, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ErrorState, PageContainer, Section } from '@/components/layout';
import {
  Button,
  Card,
  ConfirmDialog,
  IconButton,
  Skeleton,
  StatGrid,
  StatItem,
  StatsCard,
  StockLogo,
  Tooltip,
} from '@/components/ui';
import { getBlogUrl } from '@/data/stockBlogUrls';
import {
  calculateBudgetUtilization,
  calculateTotalBudget,
  calculateTrades,
  getCurrentInvestment,
  getNextActionStep,
  getPendingExecutionSteps,
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
import { formatAmountCompact, formatPercent, formatPrice } from '@/utils/format';
import { isUSMarket } from '@/utils/market';
import { TEXTS } from '@/utils/texts';
import { BudgetGauge } from './BudgetGauge';
import { ExecutionTimeline } from './ExecutionTimeline';
import { ExitSimulator } from './ExitSimulator';
import { FundamentalGradeInput } from './FundamentalGradeInput';
import { MCAChart } from './MCAChart';
import { NextActionBanner } from './NextActionBanner';
import { ParameterEditor } from './ParameterEditor';
import { PositionSummary } from './PositionSummary';
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
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [memoSaveStatus, setMemoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

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
      setIsTransitioning(true);
      const portfolioId = Number(id);
      setActivePortfolio(portfolioId);
      loadTradesForPortfolio(portfolioId).finally(() => {
        setIsTransitioning(false);
      });
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

  // Shared calculated trades (used by multiple components)
  const calculatedTrades = useMemo(() => {
    if (!portfolio) return [];
    return calculateTrades(portfolio.params, orderedSteps, executedSteps, portfolio.market);
  }, [portfolio, orderedSteps, executedSteps]);

  // Calculate current investment from trades (includes legacy holdings)
  const currentInvestment = useMemo(
    () => getCurrentInvestment(calculatedTrades, portfolio?.params),
    [calculatedTrades, portfolio?.params]
  );

  // Next action step & pending execution steps
  const nextActionStep = useMemo(() => getNextActionStep(calculatedTrades), [calculatedTrades]);
  const pendingSteps = useMemo(
    () => getPendingExecutionSteps(calculatedTrades),
    [calculatedTrades]
  );

  // Budget utilization
  const budgetUtilization = useMemo(() => {
    if (!portfolio || !stats) return null;
    return calculateBudgetUtilization(portfolio.params, stats);
  }, [portfolio, stats]);

  // Total budget
  const totalBudget = useMemo(() => {
    if (!portfolio) return 0;
    return calculateTotalBudget(portfolio.params, portfolio.market);
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

  const handleDelete = () => {
    setShowDeleteConfirm(true);
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
      setMemoSaveStatus('saving');
      await updatePortfolio(portfolio.id, { memo: portfolioMemo });
      setMemoSaveStatus('saved');
      setTimeout(() => setMemoSaveStatus('idle'), 2000);
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

  // Transition loading skeleton
  if (isTransitioning && !portfolio) {
    return (
      <PageContainer>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <Skeleton className="w-10 h-10 rounded-lg" />
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-xl mb-6" />
        <Skeleton className="h-96 rounded-xl" />
      </PageContainer>
    );
  }

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
                  market={portfolio.market}
                  size={40}
                  className="shadow-sm"
                />
              )}
              <div>
                <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                  {portfolio.name}
                </h1>
                {portfolio.stockCode && (
                  <span className="text-xs font-medium text-muted-foreground font-mono tracking-wide">
                    {portfolio.stockCode} • {portfolio.market || 'KRX'}
                  </span>
                )}
              </div>
            </div>
            <Tooltip
              content={portfolio.isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
              placement="bottom"
            >
              <motion.button
                onClick={handleToggleFavorite}
                className="p-1 hover:bg-surface-hover rounded transition-colors"
                aria-label={portfolio.isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
                whileTap={{ scale: 0.8 }}
                animate={portfolio.isFavorite ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Star
                  className={`w-5 h-5 ${
                    portfolio.isFavorite
                      ? 'text-warning-500 fill-warning-500'
                      : 'text-muted-foreground'
                  }`}
                />
              </motion.button>
            </Tooltip>
            {portfolio.stockCode && (
              <Tooltip content="블로그 포스팅" placement="bottom">
                <a
                  href={getBlogUrl(portfolio.stockCode)!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 hover:bg-surface-hover rounded transition-colors"
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
            value={formatAmountCompact(currentInvestment.amount, portfolio.market)}
            subValue={`예산: ${formatAmountCompact(portfolio.params.targetBudget, portfolio.market)}`}
            tooltip={TEXTS.PORTFOLIO.INVESTED_AMOUNT_TOOLTIP}
          />
          <StatsCard
            label={TEXTS.PORTFOLIO.AVG_PRICE}
            value={
              currentInvestment.avgPrice
                ? formatPrice(currentInvestment.avgPrice, portfolio.market)
                : '-'
            }
            subValue={`보유: ${currentInvestment.quantity.toLocaleString()}주`}
            tooltip={TEXTS.PORTFOLIO.AVG_PRICE_TOOLTIP}
            valueColor="primary"
          />
          <StatsCard
            label={TEXTS.PORTFOLIO.PENDING_ORDERS}
            value={formatAmountCompact(stats?.totalOrderedAmount ?? 0, portfolio.market)}
            subValue={`${(stats?.orderedStepsCount ?? 0) - (stats?.executedStepsCount ?? 0)}개 구간`}
            tooltip={TEXTS.PORTFOLIO.PENDING_ORDERS_TOOLTIP}
            valueColor="warning"
          />
        </div>
        {/* Extended Stats Row */}
        <div className="grid grid-cols-2 gap-4 mt-3">
          <StatsCard
            label={TEXTS.PORTFOLIO.NEXT_BUY_PRICE}
            value={nextActionStep ? formatPrice(nextActionStep.buyPrice, portfolio.market) : '-'}
            subValue={
              nextActionStep
                ? `${nextActionStep.step}구간 • -${nextActionStep.dropRate}%`
                : undefined
            }
            tooltip={TEXTS.PORTFOLIO.NEXT_BUY_PRICE_TOOLTIP}
            valueColor="warning"
          />
          <StatsCard
            label={TEXTS.PORTFOLIO.BUDGET_UTILIZATION}
            value={
              budgetUtilization
                ? formatPercent(budgetUtilization.executedPct + budgetUtilization.orderedPct)
                : '-'
            }
            subValue={
              budgetUtilization
                ? `${formatAmountCompact(budgetUtilization.executedAmount + budgetUtilization.orderedPendingAmount, portfolio.market)} / ${formatAmountCompact(budgetUtilization.totalBudget, portfolio.market)}`
                : undefined
            }
            valueColor={
              budgetUtilization
                ? budgetUtilization.isOverBudget
                  ? 'danger'
                  : budgetUtilization.executedPct + budgetUtilization.orderedPct > 80
                    ? 'warning'
                    : 'success'
                : 'default'
            }
          />
        </div>
      </Section>

      {/* Position Summary */}
      <Section title={TEXTS.PORTFOLIO.POSITION_SUMMARY}>
        <PositionSummary
          avgPrice={currentInvestment.avgPrice}
          params={portfolio.params}
          trades={calculatedTrades}
          market={portfolio.market}
        />
      </Section>

      {/* Budget Gauge */}
      {budgetUtilization && (
        <Section>
          <BudgetGauge utilization={budgetUtilization} market={portfolio.market} />
        </Section>
      )}

      {/* Parameter Panel */}
      <Section title="매매 파라미터" tooltip="상단의 설정 아이콘을 클릭하면 설정할 수 있습니다">
        <Card>
          <StatGrid columns={6} responsive>
            <StatItem
              label="고점 가격"
              value={formatPrice(portfolio.params.peakPrice, portfolio.market)}
            />
            <StatItem label="매수 강도" value={`${portfolio.params.strength}x`} />
            <StatItem label="시작 하락률" value={`-${portfolio.params.startDrop}%`} />
            <StatItem label="분할 구간" value={`${portfolio.params.steps}구간`} />
            <StatItem
              label="목표 예산"
              value={formatAmountCompact(portfolio.params.targetBudget, portfolio.market)}
            />
            <StatItem
              label="예상 총 투자"
              value={formatAmountCompact(totalBudget, portfolio.market)}
            />
          </StatGrid>
          {(portfolio.params.legacyQty > 0 || portfolio.params.legacyAvg > 0) && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2">기보유</p>
              <StatGrid columns={2} divided>
                <StatItem label="수량" value={`${portfolio.params.legacyQty.toLocaleString()}주`} />
                <StatItem
                  label="평단가"
                  value={formatPrice(portfolio.params.legacyAvg, portfolio.market)}
                />
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
          market={portfolio.market}
        />
      </Section>

      {/* Next Action Banner */}
      <Section>
        <NextActionBanner
          nextActionStep={nextActionStep}
          pendingExecutionCount={pendingSteps.length}
          market={portfolio.market}
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
          market={portfolio.market}
          highlightStep={nextActionStep?.step}
        />
      </Section>

      {/* Execution Timeline */}
      {executedSteps.length > 0 && (
        <Section title="체결 이력">
          <ExecutionTimeline
            trades={calculatedTrades}
            executionDates={portfolio.params.executionDates || {}}
            market={portfolio.market}
          />
        </Section>
      )}

      {/* Exit Simulator */}
      <Section title="목표가 시뮬레이션">
        <ExitSimulator
          params={portfolio.params}
          currentAmount={currentInvestment.amount}
          currentQty={currentInvestment.quantity}
          avgPrice={currentInvestment.avgPrice}
          onUpdateParams={handleSaveParams}
          market={portfolio.market}
        />
      </Section>

      {/* Fundamental Grade - KR stocks only */}
      {!isUSMarket(portfolio.market) && (
        <Section title="Fundamental Grade">
          <FundamentalGradeInput
            key={portfolio.id}
            initialData={portfolio.fundamentalData}
            stockData={stockFundamentalData}
            onSave={handleSaveFundamental}
          />
        </Section>
      )}

      {/* Memo */}
      <Section title="메모">
        <Card>
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <textarea
                value={displayMemo}
                onChange={(e) => setPortfolioMemo(e.target.value)}
                onBlur={handleMemoBlur}
                placeholder="이 종목에 대한 메모를 입력하세요..."
                className="w-full min-h-[100px] bg-transparent border-none resize-none text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <div className="h-5 flex items-center">
                {memoSaveStatus === 'saving' && (
                  <span className="text-xs text-muted-foreground">저장 중...</span>
                )}
                {memoSaveStatus === 'saved' && (
                  <span className="text-xs text-success-600 dark:text-success-400">저장됨</span>
                )}
              </div>
            </div>
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

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={async () => {
          if (portfolio) {
            await deletePortfolio(portfolio.id!);
            navigate('/dashboard');
          }
          setShowDeleteConfirm(false);
        }}
        title="포트폴리오 삭제"
        description={`"${portfolio?.name}" 종목을 영구적으로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
        confirmText="삭제"
        cancelText="취소"
        variant="danger"
      />
    </PageContainer>
  );
}
