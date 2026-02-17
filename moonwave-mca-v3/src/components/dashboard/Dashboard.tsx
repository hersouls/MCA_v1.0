// ============================================
// Dashboard Page Component
// ============================================

import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  Briefcase,
  ClipboardList,
  PiggyBank,
  Plus,
  Star,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { EmptyState, Grid, PageContainer, PageHeader, Section } from '@/components/layout';
import {
  Button,
  Card,
  PortfolioHealthBadge,
  PortfolioStatusBadge,
  StatsCard,
  StockLogo,
} from '@/components/ui';
import { calculateHealthScore } from '@/services/portfolioHealth';
import { useExchangeRateStore } from '@/stores/exchangeRateStore';
import { usePortfolioStore, useSortedPortfolios } from '@/stores/portfolioStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useUIStore } from '@/stores/uiStore';
import {
  formatAmountCompact,
  formatKoreanCurrency,
  formatPercent,
  formatPrice,
} from '@/utils/format';
import { getCurrency, isUSMarket } from '@/utils/market';
import { TEXTS } from '@/utils/texts';
import { AllocationChart } from './AllocationChart';
import { PortfolioFilters } from './PortfolioFilters';

export function Dashboard() {
  const navigate = useNavigate();
  const portfolios = useSortedPortfolios();
  const setActivePortfolio = usePortfolioStore((state) => state.setActivePortfolio);
  const portfolioStats = usePortfolioStore((state) => state.portfolioStats);
  const isInitialized = usePortfolioStore((state) => state.isInitialized);
  const initialCash = useSettingsStore((state) => state.settings.initialCash);
  const exchangeRate = useExchangeRateStore((state) => state.rate);
  const exchangeLastFetched = useExchangeRateStore((state) => state.lastFetched);
  const isManualRate = useExchangeRateStore((state) => state.isManual);
  const openStockSearch = useUIStore((state) => state.openStockSearch);
  const dashboardFilter = useUIStore((state) => state.dashboardFilter);
  const dashboardSort = useUIStore((state) => state.dashboardSort);

  // Check if any US portfolios exist
  const hasUSPortfolios = portfolios.some((p) => isUSMarket(p.market));

  // Calculate dashboard stats (USD portfolios converted to KRW)
  const dashboardStats = useMemo(() => {
    let totalOrdered = 0;
    let totalExecuted = 0;
    let alertCount = 0;

    portfolios.forEach((p) => {
      const stats = portfolioStats.get(p.id!);
      if (stats) {
        const currency = getCurrency(p.market);
        const multiplier = currency === 'USD' ? exchangeRate : 1;

        totalOrdered += stats.totalOrderedAmount * multiplier;
        totalExecuted += stats.totalInvestment * multiplier;
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
  }, [portfolios, portfolioStats, initialCash, exchangeRate]);

  // Health scores for all portfolios
  const healthScores = useMemo(() => {
    const scores = new Map<number, ReturnType<typeof calculateHealthScore>>();
    for (const p of portfolios) {
      const stats = portfolioStats.get(p.id!);
      if (stats) {
        scores.set(p.id!, calculateHealthScore(p, stats));
      }
    }
    return scores;
  }, [portfolios, portfolioStats]);

  // Filtered & sorted portfolios
  const displayedPortfolios = useMemo(() => {
    let filtered = portfolios;

    if (dashboardFilter === 'kr') {
      filtered = filtered.filter((p) => !isUSMarket(p.market));
    } else if (dashboardFilter === 'us') {
      filtered = filtered.filter((p) => isUSMarket(p.market));
    } else if (dashboardFilter === 'gap') {
      filtered = filtered.filter((p) => portfolioStats.get(p.id!)?.hasGap);
    } else if (dashboardFilter === 'grade-a') {
      filtered = filtered.filter((p) => p.fundamentalGrade === 'A' || p.fundamentalGrade === 'S');
    }

    return [...filtered].sort((a, b) => {
      if (dashboardSort === 'name') return a.name.localeCompare(b.name);
      if (dashboardSort === 'progress') {
        const pa = (portfolioStats.get(a.id!)?.executedStepsCount ?? 0) / (a.params.steps || 1);
        const pb = (portfolioStats.get(b.id!)?.executedStepsCount ?? 0) / (b.params.steps || 1);
        return pb - pa;
      }
      if (dashboardSort === 'investment') {
        return (
          (portfolioStats.get(b.id!)?.totalInvestment ?? 0) -
          (portfolioStats.get(a.id!)?.totalInvestment ?? 0)
        );
      }
      if (dashboardSort === 'updated') {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      return 0;
    });
  }, [portfolios, portfolioStats, dashboardFilter, dashboardSort]);

  const handleAddPortfolio = () => {
    openStockSearch();
  };

  const handlePortfolioClick = (id: number) => {
    setActivePortfolio(id);
    navigate(`/portfolio/${id}`);
  };

  // Split displayed (filtered/sorted) portfolios into favorites and others
  const favoritePortfolios = displayedPortfolios.filter((p) => p.isFavorite);
  const otherPortfolios = displayedPortfolios.filter((p) => !p.isFavorite);

  return (
    <PageContainer>
      <PageHeader
        title={TEXTS.DASHBOARD.TITLE}
        description={TEXTS.DASHBOARD.DESCRIPTION}
        action={
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={handleAddPortfolio}>
            {TEXTS.DASHBOARD.ADD_PORTFOLIO}
          </Button>
        }
      />

      {/* Fund Summary */}
      <div data-tour="stats-section">
        <Section title={TEXTS.DASHBOARD.FUND_STATUS} icon={<Wallet className="w-5 h-5" />}>
          <Grid cols={4} gap="md">
            <StatsCard
              label={TEXTS.DASHBOARD.INITIAL_CASH}
              value={formatKoreanCurrency(dashboardStats.initialCash)}
              icon={<Wallet className="w-5 h-5" />}
              tooltip={TEXTS.DASHBOARD.INITIAL_CASH_TOOLTIP}
              align="left"
              loading={!isInitialized}
            />
            <StatsCard
              label={TEXTS.DASHBOARD.REMAINING_CASH}
              value={formatKoreanCurrency(dashboardStats.remainingCash)}
              subValue={`${TEXTS.DASHBOARD.INVESTMENT_RATE} ${formatPercent(dashboardStats.investmentRate)}`}
              icon={<PiggyBank className="w-5 h-5" />}
              tooltip={TEXTS.DASHBOARD.REMAINING_CASH_TOOLTIP}
              align="left"
              loading={!isInitialized}
            />
            <StatsCard
              label={TEXTS.DASHBOARD.TOTAL_EXECUTED}
              value={formatKoreanCurrency(dashboardStats.totalExecuted)}
              icon={<TrendingUp className="w-5 h-5" />}
              tooltip={TEXTS.DASHBOARD.TOTAL_EXECUTED_TOOLTIP}
              align="left"
              loading={!isInitialized}
            />
            <StatsCard
              label={TEXTS.DASHBOARD.TOTAL_ORDERED}
              value={formatKoreanCurrency(dashboardStats.totalOrdered)}
              icon={<ClipboardList className="w-5 h-5" />}
              tooltip={TEXTS.DASHBOARD.TOTAL_ORDERED_TOOLTIP}
              align="left"
              loading={!isInitialized}
            />
          </Grid>
          {/* Exchange Rate Indicator */}
          {hasUSPortfolios && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-3 px-1">
              <span>환율 $1 = ₩{Math.round(exchangeRate).toLocaleString()}</span>
              {exchangeLastFetched && (
                <span className="text-muted-foreground/60">
                  (
                  {isManualRate
                    ? '수동 설정'
                    : `${Math.round((Date.now() - exchangeLastFetched.getTime()) / 60000)}분 전 갱신`}
                  )
                </span>
              )}
            </div>
          )}
        </Section>
      </div>

      {/* Alerts */}
      {dashboardStats.alertCount > 0 && (
        <Section>
          <Card className="bg-danger-50 dark:bg-danger-900/20 border-danger-200 dark:border-danger-800">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-danger-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-danger-700 dark:text-danger-300">
                  {TEXTS.DASHBOARD.ALERT_TITLE(dashboardStats.alertCount)}
                </h3>
                <p className="text-sm text-danger-600 dark:text-danger-400 mt-1">
                  {TEXTS.DASHBOARD.ALERT_DESC}
                </p>
              </div>
            </div>
          </Card>
        </Section>
      )}

      {/* Portfolio Filters */}
      {portfolios.length > 0 && <PortfolioFilters />}

      {/* Allocation Chart */}
      {portfolios.length >= 3 && (
        <Section title={TEXTS.DASHBOARD.ALLOCATION_TITLE}>
          <AllocationChart
            portfolios={portfolios}
            portfolioStats={portfolioStats}
            exchangeRate={exchangeRate}
          />
        </Section>
      )}

      {/* Portfolio Grid */}
      {portfolios.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="w-8 h-8" />}
          title={TEXTS.DASHBOARD.EMPTY_TITLE}
          description={TEXTS.DASHBOARD.EMPTY_DESC}
          action={
            <Button leftIcon={<Plus className="w-4 h-4" />} onClick={handleAddPortfolio}>
              {TEXTS.DASHBOARD.ADD_PORTFOLIO}
            </Button>
          }
        />
      ) : (
        <>
          {/* Favorites */}
          {favoritePortfolios.length > 0 && (
            <Section title={TEXTS.DASHBOARD.FAVORITES} icon={<Star className="w-5 h-5" />}>
              <Grid cols={3} gap="md">
                <AnimatePresence>
                  {favoritePortfolios.map((portfolio) => (
                    <motion.div
                      key={portfolio.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <PortfolioCard
                        portfolio={portfolio}
                        stats={portfolioStats.get(portfolio.id!)}
                        healthScore={healthScores.get(portfolio.id!)}
                        onClick={() => handlePortfolioClick(portfolio.id!)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </Grid>
            </Section>
          )}

          {/* Other Portfolios */}
          {otherPortfolios.length > 0 && (
            <Section
              title={TEXTS.DASHBOARD.ALL_PORTFOLIOS}
              icon={<TrendingUp className="w-5 h-5" />}
            >
              <Grid cols={3} gap="md">
                <AnimatePresence>
                  {otherPortfolios.map((portfolio) => (
                    <motion.div
                      key={portfolio.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <PortfolioCard
                        portfolio={portfolio}
                        stats={portfolioStats.get(portfolio.id!)}
                        healthScore={healthScores.get(portfolio.id!)}
                        onClick={() => handlePortfolioClick(portfolio.id!)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </Grid>
            </Section>
          )}
        </>
      )}
    </PageContainer>
  );
}

import type { HealthScore } from '@/services/portfolioHealth';
// Portfolio Card Component
import type { Portfolio, PortfolioStats } from '@/types';

interface PortfolioCardProps {
  portfolio: Portfolio;
  stats?: PortfolioStats;
  healthScore?: HealthScore;
  onClick: () => void;
}

function PortfolioCard({ portfolio, stats, healthScore, onClick }: PortfolioCardProps) {
  const progress = stats ? (stats.executedStepsCount / portfolio.params.steps) * 100 : 0;

  return (
    <Card variant="interactive" onClick={onClick} className="group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {portfolio.stockCode ? (
            <StockLogo
              code={portfolio.stockCode}
              name={portfolio.name}
              market={portfolio.market}
              size={40}
              className="shadow-sm"
            />
          ) : (
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-hover text-muted-foreground">
              <Briefcase className="w-5 h-5" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-1">
              <h3 className="font-semibold text-foreground group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {portfolio.name}
              </h3>
              {portfolio.isFavorite && (
                <Star className="w-3.5 h-3.5 text-warning-500 fill-warning-500" />
              )}
            </div>
            {portfolio.stockCode && (
              <p className="text-xs text-muted-foreground font-mono">{portfolio.stockCode}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {healthScore && <PortfolioHealthBadge score={healthScore} size="sm" />}
          <PortfolioStatusBadge
            orderedCount={stats?.orderedStepsCount ?? 0}
            executedCount={stats?.executedStepsCount ?? 0}
            totalSteps={portfolio.params.steps}
            hasGap={stats?.hasGap ?? false}
          />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
          <span>
            {stats?.executedStepsCount ?? 0}/{portfolio.params.steps} 구간
          </span>
          <span>{formatPercent(progress)}</span>
        </div>
        <div className="h-2 bg-surface-active rounded-full overflow-hidden">
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
            <span className="text-muted-foreground">투입금액</span>
            <p className="font-medium text-foreground text-right tabular-nums">
              {formatAmountCompact(stats.totalInvestment, portfolio.market)}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">평균단가</span>
            <p className="font-medium text-foreground text-right tabular-nums">
              {stats.averagePrice ? formatPrice(stats.averagePrice, portfolio.market) : '-'}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
