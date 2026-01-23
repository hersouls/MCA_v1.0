// ============================================
// MCA Chart Component
// Dual-axis chart: Average Price + Gap %
// ============================================

import { useMemo, useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions,
  type ChartData,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Line } from 'react-chartjs-2';
import type { PortfolioParams } from '@/types';
import { calculateTrades } from '@/services/calculation';
import { useSettingsStore } from '@/stores/settingsStore';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartDataLabels
);

interface MCAChartProps {
  params: PortfolioParams;
  orderedSteps: number[];
  executedSteps: number[];
  height?: number;
}

export function MCAChart({
  params,
  orderedSteps,
  executedSteps,
  height = 300,
}: MCAChartProps) {
  const chartRef = useRef<ChartJS<'line'>>(null);
  const theme = useSettingsStore((state) => state.settings.theme);

  // Determine if dark mode
  const isDark = useMemo(() => {
    if (theme === 'dark') return true;
    if (theme === 'light') return false;
    // System preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }, [theme]);

  const trades = useMemo(
    () => calculateTrades(params, orderedSteps, executedSteps),
    [params, orderedSteps, executedSteps]
  );

  // Filter trades that have data to show
  const chartTrades = useMemo(() => {
    return trades.filter((t) => t.isOrdered || t.isExecuted);
  }, [trades]);

  // Chart colors based on theme
  const colors = useMemo(() => ({
    primary: isDark ? '#60a5fa' : '#2563eb',
    success: isDark ? '#4ade80' : '#22c55e',
    warning: isDark ? '#fbbf24' : '#f59e0b',
    text: isDark ? '#f4f4f5' : '#0f172a',
    textMuted: isDark ? '#a1a1aa' : '#64748b',
    grid: isDark ? '#3f3f46' : '#e2e8f0',
    background: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(37, 99, 235, 0.05)',
  }), [isDark]);

  // Find min/max gaps for labels
  const { minGapIdx, maxGapIdx } = useMemo(() => {
    if (chartTrades.length === 0) return { minGapIdx: -1, maxGapIdx: -1 };

    let min = Infinity, max = -Infinity;
    let minIdx = 0, maxIdx = 0;

    chartTrades.forEach((t, i) => {
      if (t.gap < min) { min = t.gap; minIdx = i; }
      if (t.gap > max) { max = t.gap; maxIdx = i; }
    });

    return { minGapIdx: minIdx, maxGapIdx: maxIdx };
  }, [chartTrades]);

  // Chart data
  const data: ChartData<'line'> = useMemo(() => {
    const labels = chartTrades.map((t) => `${t.step}구간`);

    return {
      labels,
      datasets: [
        {
          label: '평단가 방어선',
          data: chartTrades.map((t) => t.avgPrice),
          borderColor: colors.primary,
          backgroundColor: 'transparent',
          yAxisID: 'y',
          tension: 0.2,
          pointRadius: 0,
          pointHoverRadius: 6,
          borderWidth: 2.5,
          datalabels: {
            display: false,
          },
        },
        {
          label: '괴리율',
          data: chartTrades.map((t) => t.gap),
          borderColor: colors.success,
          backgroundColor: colors.background,
          yAxisID: 'y1',
          fill: true,
          tension: 0.2,
          pointRadius: chartTrades.map((t) => (t.isExecuted ? 6 : 0)),
          pointBackgroundColor: chartTrades.map((t) =>
            t.isExecuted ? colors.warning : 'transparent'
          ),
          pointBorderColor: chartTrades.map((t) =>
            t.isExecuted ? colors.warning : 'transparent'
          ),
          pointBorderWidth: 2,
          borderWidth: 2,
          datalabels: {
            display: (context) => {
              const idx = context.dataIndex;
              return idx === minGapIdx || idx === maxGapIdx;
            },
            formatter: (value: number) => `${value.toFixed(1)}%`,
            color: colors.text,
            backgroundColor: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.9)',
            borderRadius: 4,
            padding: { top: 4, bottom: 4, left: 6, right: 6 },
            font: {
              size: 11,
              weight: 'bold',
            },
            anchor: 'end',
            align: 'top',
            offset: 4,
          },
        },
      ],
    };
  }, [chartTrades, colors, minGapIdx, maxGapIdx, isDark]);

  // Chart options
  const options: ChartOptions<'line'> = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'end',
        labels: {
          color: colors.textMuted,
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 16,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: isDark ? '#1f1f22' : '#ffffff',
        titleColor: colors.text,
        bodyColor: colors.textMuted,
        borderColor: colors.grid,
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.raw as number;
            if (context.datasetIndex === 0) {
              return `${label}: ₩${value.toLocaleString()}`;
            }
            return `${label}: ${value.toFixed(2)}%`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: colors.textMuted,
          font: {
            size: 11,
          },
          maxRotation: 0,
          callback: function(_value, index) {
            // Show every 2nd label on small screens
            const step = chartTrades[index]?.step;
            if (chartTrades.length > 10) {
              return index % 2 === 0 ? step : '';
            }
            return step;
          },
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: '평단가 (원)',
          color: colors.textMuted,
          font: {
            size: 11,
          },
        },
        grid: {
          color: colors.grid,
        },
        ticks: {
          color: colors.textMuted,
          font: {
            size: 11,
          },
          callback: (value) => `₩${(Number(value) / 1000).toFixed(0)}K`,
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: '괴리율 (%)',
          color: colors.textMuted,
          font: {
            size: 11,
          },
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: colors.textMuted,
          font: {
            size: 11,
          },
          callback: (value) => `${Number(value).toFixed(0)}%`,
        },
      },
    },
  }), [colors, isDark, chartTrades]);

  // Update chart on theme change
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.update();
    }
  }, [isDark]);

  if (chartTrades.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-700/50 bg-zinc-50 dark:bg-zinc-800/30"
        style={{ height }}
      >
        <div className="text-center text-zinc-500 dark:text-zinc-400">
          <p className="text-sm">주문 또는 체결된 구간이 없습니다</p>
          <p className="text-xs mt-1">매매 테이블에서 주문을 등록하세요</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative rounded-xl border border-zinc-200 dark:border-zinc-700/50 bg-white dark:bg-zinc-900/50 p-4"
      style={{ height }}
    >
      <Line ref={chartRef} data={data} options={options} />
    </div>
  );
}
