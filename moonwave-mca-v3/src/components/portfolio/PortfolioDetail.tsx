// ============================================
// Portfolio Detail Page Component
// ============================================

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Trash2, Settings2, FileText, Pencil, Check, X } from 'lucide-react';

import { PageContainer, Section, ErrorState } from '@/components/layout';
import { Button, IconButton, Card, StatsCard, StatItem, StatGrid } from '@/components/ui';
import { TradeTable } from './TradeTable';
import { MCAChart } from './MCAChart';
import { ParameterEditor } from './ParameterEditor';
import { ExitSimulator } from './ExitSimulator';
import { FundamentalGradeInput } from './FundamentalGradeInput';
import { usePortfolioStore, selectPortfolioStats } from '@/stores/portfolioStore';
import { calculateTrades, getCurrentInvestment, calculateTotalBudget } from '@/services/calculation';
import { formatCurrency, formatKoreanUnit, formatPercent } from '@/utils/format';
import type { PortfolioParams, FundamentalInput, FundamentalResult, FundamentalData, Trade } from '@/types';

// Stable empty array to avoid creating new reference on each render
const EMPTY_TRADES: Trade[] = [];

export function PortfolioDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State
  const [isParamEditorOpen, setIsParamEditorOpen] = useState(false);
  const [portfolioMemo, setPortfolioMemo] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');

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
  const handleSaveFundamental = async (data: FundamentalInput, result: FundamentalResult) => {
    if (portfolio?.id) {
      const fundamentalData: FundamentalData = {
        ...data,
        dataSource: 'manual',
        lastUpdated: new Date(),
      };
      await updatePortfolio(portfolio.id, {
        fundamentalScore: result.totalScore,
        fundamentalGrade: result.grade,
        fundamentalData,
      });
    }
  };

  // Name editing handlers
  const handleStartEditName = () => {
    if (portfolio) {
      setEditedName(portfolio.name);
      setIsEditingName(true);
    }
  };

  const handleSaveName = async () => {
    if (portfolio?.id && editedName.trim()) {
      await updatePortfolio(portfolio.id, { name: editedName.trim() });
      setIsEditingName(false);
    }
  };

  const handleCancelEditName = () => {
    setIsEditingName(false);
    setEditedName('');
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveName();
    } else if (e.key === 'Escape') {
      handleCancelEditName();
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
          <IconButton plain color="secondary" onClick={handleBack} aria-label="뒤로 가기">
            <ArrowLeft className="w-5 h-5" />
          </IconButton>
          <div className="flex items-center gap-2">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  onKeyDown={handleNameKeyDown}
                  className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 bg-transparent border-b-2 border-primary-500 focus:outline-none px-1"
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  className="p-1 hover:bg-success-100 dark:hover:bg-success-900/30 rounded transition-colors text-success-600 dark:text-success-400"
                  aria-label="저장"
                >
                  <Check className="w-5 h-5" />
                </button>
                <button
                  onClick={handleCancelEditName}
                  className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors text-zinc-500"
                  aria-label="취소"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <>
                <h1 className="text-[1.625rem] font-bold text-zinc-900 dark:text-zinc-50">
                  {portfolio.name}
                </h1>
                <button
                  onClick={handleStartEditName}
                  className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                  aria-label="종목명 수정"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </>
            )}
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
            plain
            color="secondary"
            onClick={() => setIsParamEditorOpen(true)}
            aria-label="설정"
          >
            <Settings2 className="w-5 h-5" />
          </IconButton>
          <IconButton color="danger" onClick={handleDelete} aria-label="삭제">
            <Trash2 className="w-5 h-5" />
          </IconButton>
        </div>
      </div>

      {/* Stats Summary - Using StatsCard for consistency */}
      <Section>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            label="진행률"
            value={formatPercent(progress)}
            progress={{
              value: progress,
              label: `${stats?.executedStepsCount ?? 0}/${portfolio.params.steps} 구간 체결`,
            }}
          />
          <StatsCard
            label="투입 금액"
            value={formatKoreanUnit(currentInvestment.amount)}
            subValue={`예산: ${formatKoreanUnit(portfolio.params.targetBudget)}`}
          />
          <StatsCard
            label="평균 단가"
            value={currentInvestment.avgPrice ? formatCurrency(currentInvestment.avgPrice) : '-'}
            subValue={`보유: ${currentInvestment.quantity.toLocaleString()}주`}
            valueColor="primary"
          />
          <StatsCard
            label="주문 대기"
            value={formatKoreanUnit(stats?.totalOrderedAmount ?? 0)}
            subValue={`${(stats?.orderedStepsCount ?? 0) - (stats?.executedStepsCount ?? 0)}개 구간`}
            valueColor="warning"
          />
        </div>
      </Section>

      {/* Parameter Panel */}
      <Section title="매매 파라미터">
        <Card>
          <StatGrid columns={6} divided>
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
