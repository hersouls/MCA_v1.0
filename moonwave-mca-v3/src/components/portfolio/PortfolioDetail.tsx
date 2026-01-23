// ============================================
// Portfolio Detail Page Component
// ============================================

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Trash2, Settings2, FileText } from 'lucide-react';

import { PageContainer, Section, ErrorState } from '@/components/layout';
import { Button, IconButton, Card } from '@/components/ui';
import { TradeTable } from './TradeTable';
import { MCAChart } from './MCAChart';
import { ParameterEditor } from './ParameterEditor';
import { ExitSimulator } from './ExitSimulator';
import { usePortfolioStore, selectPortfolioStats } from '@/stores/portfolioStore';
import { calculateTrades, getCurrentInvestment, calculateTotalBudget } from '@/services/calculation';
import { formatCurrency, formatCompact, formatPercent } from '@/utils/format';
import type { PortfolioParams } from '@/types';

export function PortfolioDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State
  const [isParamEditorOpen, setIsParamEditorOpen] = useState(false);
  const [portfolioMemo, setPortfolioMemo] = useState('');

  // Store
  const portfolios = usePortfolioStore((state) => state.portfolios);
  const setActivePortfolio = usePortfolioStore((state) => state.setActivePortfolio);
  const loadTradesForPortfolio = usePortfolioStore((state) => state.loadTradesForPortfolio);
  const toggleFavorite = usePortfolioStore((state) => state.toggleFavorite);
  const deletePortfolio = usePortfolioStore((state) => state.deletePortfolio);
  const updatePortfolio = usePortfolioStore((state) => state.updatePortfolio);
  const toggleOrderedStep = usePortfolioStore((state) => state.toggleOrderedStep);
  const toggleExecutedStep = usePortfolioStore((state) => state.toggleExecutedStep);
  const trades = usePortfolioStore((state) => state.trades.get(Number(id)) || []);
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
    () => trades.filter((t) => t.status === 'ordered' || t.status === 'executed').map((t) => t.step),
    [trades]
  );

  const executedSteps = useMemo(
    () => trades.filter((t) => t.status === 'executed').map((t) => t.step),
    [trades]
  );

  // Calculate current investment from trades
  const currentInvestment = useMemo(() => {
    if (!portfolio) return { amount: 0, quantity: 0, avgPrice: 0 };
    const calculatedTrades = calculateTrades(portfolio.params, orderedSteps, executedSteps);
    return getCurrentInvestment(calculatedTrades);
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

  // Error state
  if (!portfolio) {
    return (
      <PageContainer>
        <ErrorState
          title="종목을 찾을 수 없습니다"
          message="요청하신 종목이 존재하지 않거나 삭제되었습니다."
          action={
            <Button onClick={() => navigate('/dashboard')}>
              대시보드로 돌아가기
            </Button>
          }
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
          <IconButton variant="ghost" onClick={handleBack} aria-label="뒤로 가기">
            <ArrowLeft className="w-5 h-5" />
          </IconButton>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {portfolio.name}
            </h1>
            <button
              onClick={handleToggleFavorite}
              className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors"
              aria-label={portfolio.isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
            >
              <Star
                className={`w-5 h-5 ${
                  portfolio.isFavorite
                    ? 'text-warning-500 fill-warning-500'
                    : 'text-zinc-400 dark:text-zinc-500'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <IconButton
            variant="secondary"
            onClick={() => setIsParamEditorOpen(true)}
            aria-label="설정"
          >
            <Settings2 className="w-5 h-5" />
          </IconButton>
          <IconButton variant="danger" onClick={handleDelete} aria-label="삭제">
            <Trash2 className="w-5 h-5" />
          </IconButton>
        </div>
      </div>

      {/* Stats Summary */}
      <Section>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card padding="md">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase">
              진행률
            </p>
            <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {formatPercent(progress)}
            </p>
            <div className="mt-2">
              <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                {stats?.executedStepsCount ?? 0}/{portfolio.params.steps} 구간 체결
              </p>
            </div>
          </Card>

          <Card padding="md">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase">
              투입 금액
            </p>
            <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {formatCompact(currentInvestment.amount)}
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              예산: {formatCompact(portfolio.params.targetBudget)}
            </p>
          </Card>

          <Card padding="md">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase">
              평균 단가
            </p>
            <p className="mt-1 text-2xl font-bold text-primary-600 dark:text-primary-400">
              {currentInvestment.avgPrice ? formatCurrency(currentInvestment.avgPrice) : '-'}
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              보유: {currentInvestment.quantity.toLocaleString()}주
            </p>
          </Card>

          <Card padding="md">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase">
              주문 대기
            </p>
            <p className="mt-1 text-2xl font-bold text-warning-600 dark:text-warning-400">
              {formatCompact(stats?.totalOrderedAmount ?? 0)}
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {(stats?.orderedStepsCount ?? 0) - (stats?.executedStepsCount ?? 0)}개 구간
            </p>
          </Card>
        </div>
      </Section>

      {/* Parameter Panel */}
      <Section title="매매 파라미터">
        <Card>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">고점 가격</span>
              <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                {formatCurrency(portfolio.params.peakPrice)}
              </p>
            </div>
            <div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">매수 강도</span>
              <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                {portfolio.params.strength}
              </p>
            </div>
            <div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">시작 하락률</span>
              <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                -{portfolio.params.startDrop}%
              </p>
            </div>
            <div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">분할 구간</span>
              <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                {portfolio.params.steps}구간
              </p>
            </div>
            <div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">목표 예산</span>
              <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                {formatCompact(portfolio.params.targetBudget)}
              </p>
            </div>
            <div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">예상 총 투자</span>
              <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                {formatCompact(totalBudget)}
              </p>
            </div>
          </div>
          {(portfolio.params.legacyQty > 0 || portfolio.params.legacyAvg > 0) && (
            <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700/50">
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">기보유</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">수량</span>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                    {portfolio.params.legacyQty.toLocaleString()}주
                  </p>
                </div>
                <div>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">평단가</span>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                    {formatCurrency(portfolio.params.legacyAvg)}
                  </p>
                </div>
              </div>
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
