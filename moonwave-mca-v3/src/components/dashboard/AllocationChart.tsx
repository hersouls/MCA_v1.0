// ============================================
// Allocation Chart Component
// 포트폴리오 분배(도넛) + 진행률 비교(수평 바) 차트
// ============================================

import {
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  DoughnutController,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { useMemo, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';

import { Card } from '@/components/ui';
import { useSettingsStore } from '@/stores/settingsStore';
import type { Portfolio, PortfolioStats } from '@/types';
import { formatAmountCompact } from '@/utils/format';
import { getCurrency } from '@/utils/market';
import { clsx } from 'clsx';

ChartJS.register(
  ArcElement,
  DoughnutController,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

interface AllocationChartProps {
  portfolios: Portfolio[];
  portfolioStats: Map<number, PortfolioStats>;
  exchangeRate: number;
}

const CHART_PALETTE = [
  'rgba(46, 255, 180, 0.8)', // primary
  'rgba(34, 197, 94, 0.8)', // success
  'rgba(245, 158, 11, 0.8)', // warning
  'rgba(239, 68, 68, 0.8)', // danger
  'rgba(139, 92, 246, 0.8)', // purple
  'rgba(59, 130, 246, 0.8)', // blue
  'rgba(236, 72, 153, 0.8)', // pink
  'rgba(20, 184, 166, 0.8)', // teal
];

type TabType = 'allocation' | 'progress';

export function AllocationChart({
  portfolios,
  portfolioStats,
  exchangeRate,
}: AllocationChartProps) {
  const [activeTab, setActiveTab] = useState<TabType>('allocation');
  const theme = useSettingsStore((state) => state.settings.theme);

  const isDark = useMemo(() => {
    if (theme === 'dark') return true;
    if (theme === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }, [theme]);

  const textColor = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)';

  // Don't render if fewer than 3 portfolios
  if (portfolios.length < 3) return null;

  const labels = portfolios.map((p) => p.name);
  const colors = portfolios.map((_, i) => CHART_PALETTE[i % CHART_PALETTE.length]);

  // Allocation data (investment amounts normalized to KRW)
  const allocationData = portfolios.map((p) => {
    const stats = portfolioStats.get(p.id!);
    const multiplier = getCurrency(p.market) === 'USD' ? exchangeRate : 1;
    return (stats?.totalInvestment ?? 0) * multiplier;
  });

  const totalInvestment = allocationData.reduce((sum, v) => sum + v, 0);

  // Progress data
  const progressData = portfolios.map((p) => {
    const stats = portfolioStats.get(p.id!);
    return stats ? (stats.executedStepsCount / p.params.steps) * 100 : 0;
  });

  const doughnutData = {
    labels,
    datasets: [
      {
        data: allocationData,
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: isDark ? '#0f0f0f' : '#f7f6f4',
      },
    ],
  };

  const barData = {
    labels,
    datasets: [
      {
        label: '진행률',
        data: progressData,
        backgroundColor: colors,
        borderRadius: 4,
        barThickness: 20,
      },
    ],
  };

  return (
    <Card>
      {/* Tab Toggle */}
      <div className="flex gap-1 mb-4 p-1 rounded-lg bg-surface-hover w-fit">
        <button
          onClick={() => setActiveTab('allocation')}
          className={clsx(
            'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
            activeTab === 'allocation'
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          분배
        </button>
        <button
          onClick={() => setActiveTab('progress')}
          className={clsx(
            'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
            activeTab === 'progress'
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          진행률
        </button>
      </div>

      {/* Chart */}
      <div className="relative" style={{ height: 240 }}>
        {activeTab === 'allocation' ? (
          <Doughnut
            data={doughnutData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              cutout: '60%',
              plugins: {
                legend: {
                  position: 'right',
                  labels: {
                    color: textColor,
                    font: { size: 11 },
                    padding: 12,
                    usePointStyle: true,
                    pointStyleWidth: 8,
                  },
                },
                tooltip: {
                  callbacks: {
                    label: (ctx) => {
                      const value = ctx.parsed;
                      const pct =
                        totalInvestment > 0 ? ((value / totalInvestment) * 100).toFixed(1) : '0';
                      return ` ${ctx.label}: ${formatAmountCompact(value)} (${pct}%)`;
                    },
                  },
                },
              },
            }}
          />
        ) : (
          <Bar
            data={barData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              indexAxis: 'y',
              scales: {
                x: {
                  max: 100,
                  ticks: {
                    color: textColor,
                    font: { size: 10 },
                    callback: (v) => `${v}%`,
                  },
                  grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
                },
                y: {
                  ticks: {
                    color: textColor,
                    font: { size: 11 },
                  },
                  grid: { display: false },
                },
              },
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: (ctx) => ` 진행률: ${(ctx.parsed.x ?? 0).toFixed(1)}%`,
                  },
                },
              },
            }}
          />
        )}
      </div>
    </Card>
  );
}
