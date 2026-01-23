// ============================================
// Dashboard Page Component
// ============================================

import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Briefcase,
  Plus,
  Star,
} from 'lucide-react';

import {
  PageContainer,
  PageHeader,
  Section,
  Grid,
  EmptyState,
} from '@/components/layout';
import { Card, StatsCard, Button, PortfolioStatusBadge } from '@/components/ui';
import { usePortfolioStore, selectSortedPortfolios } from '@/stores/portfolioStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { formatCurrency, formatCompact, formatPercent } from '@/utils/format';

export function Dashboard() {
  const navigate = useNavigate();
  const portfolios = usePortfolioStore(selectSortedPortfolios);
  const addPortfolio = usePortfolioStore((state) => state.addPortfolio);
  const setActivePortfolio = usePortfolioStore((state) => state.setActivePortfolio);
  const portfolioStats = usePortfolioStore((state) => state.portfolioStats);
  const initialCash = useSettingsStore((state) => state.settings.initialCash);

  // Calculate dashboard stats
  const dashboardStats = useMemo(() => {
    let totalOrdered = 0;
    let totalExecuted = 0;
    let alertCount = 0;

    portfolios.forEach((p) => {
      const stats = portfolioStats.get(p.id!);
      if (stats) {
        totalOrdered += stats.totalOrderedAmount;
        totalExecuted += stats.totalExecutedAmount;
        if (stats.hasGap) alertCount++;
      }
    });

    const remainingCash = initialCash - totalExecuted;
    const investmentRate = initialCash > 0 ? (totalExecuted / initialCash) * 100 : 0;

    return {
      initialCash,
      remainingCash,
      totalOrdered,
      totalExecuted,
      investmentRate,
      alertCount,
      portfolioCount: portfolios.length,
    };
  }, [portfolios, portfolioStats, initialCash]);

  const handleAddPortfolio = async () => {
    const id = await addPortfolio();
    navigate(`/portfolio/${id}`);
  };

  const handlePortfolioClick = (id: number) => {
    setActivePortfolio(id);
    navigate(`/portfolio/${id}`);
  };

  // Split portfolios into favorites and others
  const favoritePortfolios = portfolios.filter((p) => p.isFavorite);
  const otherPortfolios = portfolios.filter((p) => !p.isFavorite);

  return (
    <PageContainer>
      <PageHeader
        title="대시보드"
        description="포트폴리오 현황을 한눈에 확인하세요"
        action={
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={handleAddPortfolio}>
            새 종목 추가
          </Button>
        }
      />

      {/* Fund Summary */}
      <Section title="💰 자금 현황">
        <Grid cols={4} gap="md">
          <StatsCard
            label="초기 예수금"
            value={formatCompact(dashboardStats.initialCash)}
            icon={<Wallet className="w-5 h-5" />}
          />
          <StatsCard
            label="잔여 현금"
            value={formatCompact(dashboardStats.remainingCash)}
            subValue={`투입률 ${formatPercent(dashboardStats.investmentRate)}`}
            icon={<TrendingDown className="w-5 h-5" />}
          />
          <StatsCard
            label="체결 총액"
            value={formatCompact(dashboardStats.totalExecuted)}
            icon={<TrendingUp className="w-5 h-5" />}
          />
          <StatsCard
            label="주문 총액"
            value={formatCompact(dashboardStats.totalOrdered)}
            icon={<Briefcase className="w-5 h-5" />}
          />
        </Grid>
      </Section>

      {/* Alerts */}
      {dashboardStats.alertCount > 0 && (
        <Section>
          <Card className="bg-danger-50 dark:bg-danger-900/20 border-danger-200 dark:border-danger-800">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-danger-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-danger-700 dark:text-danger-300">
                  주의가 필요한 종목 ({dashboardStats.alertCount}개)
                </h3>
                <p className="text-sm text-danger-600 dark:text-danger-400 mt-1">
                  주문/체결 구간에 갭이 발생한 종목이 있습니다. 추가 주문을 고려해주세요.
                </p>
              </div>
            </div>
          </Card>
        </Section>
      )}

      {/* Portfolio Grid */}
      {portfolios.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="w-8 h-8" />}
          title="등록된 종목이 없습니다"
          description="새 종목을 추가하여 MCA 전략을 시작하세요"
          action={
            <Button leftIcon={<Plus className="w-4 h-4" />} onClick={handleAddPortfolio}>
              첫 종목 추가하기
            </Button>
          }
        />
      ) : (
        <>
          {/* Favorites */}
          {favoritePortfolios.length > 0 && (
            <Section title="⭐ 즐겨찾기">
              <Grid cols={3} gap="md">
                {favoritePortfolios.map((portfolio) => (
                  <PortfolioCard
                    key={portfolio.id}
                    portfolio={portfolio}
                    stats={portfolioStats.get(portfolio.id!)}
                    onClick={() => handlePortfolioClick(portfolio.id!)}
                  />
                ))}
              </Grid>
            </Section>
          )}

          {/* Other Portfolios */}
          {otherPortfolios.length > 0 && (
            <Section title="📈 전체 종목">
              <Grid cols={3} gap="md">
                {otherPortfolios.map((portfolio) => (
                  <PortfolioCard
                    key={portfolio.id}
                    portfolio={portfolio}
                    stats={portfolioStats.get(portfolio.id!)}
                    onClick={() => handlePortfolioClick(portfolio.id!)}
                  />
                ))}
              </Grid>
            </Section>
          )}
        </>
      )}
    </PageContainer>
  );
}

// Portfolio Card Component
import type { Portfolio, PortfolioStats } from '@/types';

interface PortfolioCardProps {
  portfolio: Portfolio;
  stats?: PortfolioStats;
  onClick: () => void;
}

function PortfolioCard({ portfolio, stats, onClick }: PortfolioCardProps) {
  const progress = stats
    ? (stats.executedStepsCount / portfolio.params.steps) * 100
    : 0;

  return (
    <Card variant="interactive" onClick={onClick} className="group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {portfolio.isFavorite && (
            <Star className="w-4 h-4 text-warning-500 fill-warning-500" />
          )}
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {portfolio.name}
          </h3>
        </div>
        <PortfolioStatusBadge
          orderedCount={stats?.orderedStepsCount ?? 0}
          executedCount={stats?.executedStepsCount ?? 0}
          totalSteps={portfolio.params.steps}
          hasGap={stats?.hasGap ?? false}
        />
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-1">
          <span>
            {stats?.executedStepsCount ?? 0}/{portfolio.params.steps} 구간
          </span>
          <span>{formatPercent(progress)}</span>
        </div>
        <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-zinc-500 dark:text-zinc-400">투입금액</span>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">
              {formatCompact(stats.totalExecutedAmount)}
            </p>
          </div>
          <div>
            <span className="text-zinc-500 dark:text-zinc-400">평균단가</span>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">
              {stats.averagePrice ? formatCurrency(stats.averagePrice) : '-'}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
