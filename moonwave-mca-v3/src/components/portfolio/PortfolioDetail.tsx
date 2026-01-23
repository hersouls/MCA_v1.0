// ============================================
// Portfolio Detail Page Component
// ============================================

import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Trash2, Settings2 } from 'lucide-react';

import { PageContainer, Section, ErrorState } from '@/components/layout';
import { Button, IconButton, Card } from '@/components/ui';
import { usePortfolioStore, selectPortfolioStats } from '@/stores/portfolioStore';
import { formatCurrency, formatCompact, formatPercent } from '@/utils/format';

export function PortfolioDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const portfolios = usePortfolioStore((state) => state.portfolios);
  const setActivePortfolio = usePortfolioStore((state) => state.setActivePortfolio);
  const loadTradesForPortfolio = usePortfolioStore((state) => state.loadTradesForPortfolio);
  const toggleFavorite = usePortfolioStore((state) => state.toggleFavorite);
  const deletePortfolio = usePortfolioStore((state) => state.deletePortfolio);
  const stats = usePortfolioStore((state) =>
    selectPortfolioStats(state, Number(id))
  );

  // Load portfolio data
  useEffect(() => {
    if (id) {
      const portfolioId = Number(id);
      setActivePortfolio(portfolioId);
      loadTradesForPortfolio(portfolioId);
    }
  }, [id, setActivePortfolio, loadTradesForPortfolio]);

  // Find portfolio
  const portfolio = portfolios.find((p) => p.id === Number(id));

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

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleToggleFavorite = () => {
    toggleFavorite(portfolio.id!);
  };

  const handleDelete = async () => {
    if (window.confirm(`"${portfolio.name}" 종목을 삭제하시겠습니까?`)) {
      await deletePortfolio(portfolio.id!);
      navigate('/dashboard');
    }
  };

  const progress = stats
    ? (stats.executedStepsCount / portfolio.params.steps) * 100
    : 0;

  return (
    <PageContainer>
      {/* Breadcrumb & Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <IconButton variant="ghost" onClick={handleBack} aria-label="뒤로 가기">
            <ArrowLeft className="w-5 h-5" />
          </IconButton>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
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
                    : 'text-zinc-400'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <IconButton variant="ghost" aria-label="설정">
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
            <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {formatPercent(progress)}
            </p>
            <p className="text-sm text-zinc-500">
              {stats?.executedStepsCount ?? 0}/{portfolio.params.steps} 구간
            </p>
          </Card>

          <Card padding="md">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase">
              투입 금액
            </p>
            <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {formatCompact(stats?.totalExecutedAmount ?? 0)}
            </p>
            <p className="text-sm text-zinc-500">
              예산: {formatCompact(portfolio.params.targetBudget)}
            </p>
          </Card>

          <Card padding="md">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase">
              평균 단가
            </p>
            <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {stats?.averagePrice ? formatCurrency(stats.averagePrice) : '-'}
            </p>
            <p className="text-sm text-zinc-500">
              보유: {stats?.totalShares ?? 0}주
            </p>
          </Card>

          <Card padding="md">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase">
              주문 대기
            </p>
            <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {formatCompact(stats?.totalOrderedAmount ?? 0)}
            </p>
            <p className="text-sm text-zinc-500">
              {(stats?.orderedStepsCount ?? 0) - (stats?.executedStepsCount ?? 0)}개 구간
            </p>
          </Card>
        </div>
      </Section>

      {/* Parameter Panel */}
      <Section title="📊 매매 파라미터">
        <Card>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">고점 가격</span>
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                {formatCurrency(portfolio.params.peakPrice)}
              </p>
            </div>
            <div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">매수 강도</span>
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                {portfolio.params.strength}
              </p>
            </div>
            <div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">시작 하락률</span>
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                -{portfolio.params.startDrop}%
              </p>
            </div>
            <div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">분할 구간</span>
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                {portfolio.params.steps}구간
              </p>
            </div>
          </div>
        </Card>
      </Section>

      {/* Trade List Placeholder */}
      <Section title="📋 매매 체결 리스트">
        <Card>
          <p className="text-center text-zinc-500 dark:text-zinc-400 py-8">
            매매 테이블 컴포넌트가 여기에 표시됩니다.
          </p>
        </Card>
      </Section>

      {/* Chart Placeholder */}
      <Section title="📈 차트">
        <Card>
          <p className="text-center text-zinc-500 dark:text-zinc-400 py-12">
            MCA 차트가 여기에 표시됩니다.
          </p>
        </Card>
      </Section>
    </PageContainer>
  );
}
