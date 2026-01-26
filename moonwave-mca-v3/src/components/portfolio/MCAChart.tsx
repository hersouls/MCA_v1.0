// ============================================
// MCA Chart Component
// Dual-axis chart: Average Price + Gap %
// ============================================

import { calculateTrades } from '@/services/calculation';
import { useSettingsStore } from '@/stores/settingsStore';
import type { PortfolioParams } from '@/types';
import { CHART_COLORS, CHART_CONFIG } from '@/utils/constants';
import { formatKoreanUnit } from '@/utils/format';
import { TEXTS } from '@/utils/texts';
import {
  CategoryScale,
  type ChartData,
  Chart as ChartJS,
  type ChartOptions,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useEffect, useMemo, useRef } from 'react';
import { Line } from 'react-chartjs-2';

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
  height = CHART_CONFIG.DEFAULT_HEIGHT,
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

  // Chart colors based on theme - using centralized CHART_COLORS
  const themeColors = isDark ? CHART_COLORS.dark : CHART_COLORS.light;
  const colors = useMemo(
    () => ({
      ...themeColors,
      textMuted: isDark ? '#a1a1aa' : '#64748b',
      background: isDark
        ? `rgba(46, 255, 180, ${CHART_CONFIG.BACKGROUND_ALPHA.DARK})`
        : `rgba(0, 168, 107, ${CHART_CONFIG.BACKGROUND_ALPHA.LIGHT})`,
    }),
    [isDark, themeColors]
  );

  // Find min/max gaps for labels
  const { minGapIdx, maxGapIdx } = useMemo(() => {
    if (chartTrades.length === 0) return { minGapIdx: -1, maxGapIdx: -1 };

    let min = Number.POSITIVE_INFINITY,
      max = Number.NEGATIVE_INFINITY;
    let minIdx = 0,
      maxIdx = 0;

    chartTrades.forEach((t, i) => {
      if (t.gap < min) {
        min = t.gap;
        minIdx = i;
      }
      if (t.gap > max) {
        max = t.gap;
        maxIdx = i;
      }
    });

    return { minGapIdx: minIdx, maxGapIdx: maxIdx };
  }, [chartTrades]);

  // Chart data
  const data: ChartData<'line'> = useMemo(() => {
    const labels = chartTrades.map((t) => TEXTS.CHART.STEP_LABEL(t.step));

    return {
      labels,
      datasets: [
        {
          label: TEXTS.CHART.AVG_PRICE_LINE,
          data: chartTrades.map((t) => t.avgPrice),
          borderColor: colors.primary,
          backgroundColor: 'transparent',
          yAxisID: 'y',
          tension: 0.2,
          pointRadius: CHART_CONFIG.POINT_RADIUS,
          pointHoverRadius: CHART_CONFIG.POINT_HOVER_RADIUS,
          borderWidth: CHART_CONFIG.BORDER_WIDTH,
          datalabels: {
            display: false,
          },
        },
        {
          label: TEXTS.CHART.GAP_RATE,
          data: chartTrades.map((t) => t.gap),
          borderColor: colors.success,
          backgroundColor: colors.background,
          yAxisID: 'y1',
          fill: true,
          tension: 0.2,
          pointRadius: chartTrades.map((t) =>
            t.isExecuted ? CHART_CONFIG.EXECUTED_POINT_RADIUS : 0
          ),
          pointBackgroundColor: chartTrades.map((t) =>
            t.isExecuted ? colors.warning : 'transparent'
          ),
          pointBorderColor: chartTrades.map((t) => (t.isExecuted ? colors.warning : 'transparent')),
          pointBorderWidth: CHART_CONFIG.POINT_BORDER_WIDTH,
          borderWidth: 2,
          datalabels: {
            display: (context) => {
              const idx = context.dataIndex;
              return idx === minGapIdx || idx === maxGapIdx;
            },
            formatter: (value: number) => `${value.toFixed(1)}%`,
            color: colors.text,
            backgroundColor: isDark ? 'rgba(3,3,3,0.7)' : 'rgba(237,236,232,0.9)',
            borderRadius: CHART_CONFIG.DATA_LABEL.BORDER_RADIUS,
            padding: CHART_CONFIG.DATA_LABEL.PADDING,
            font: {
              size: CHART_CONFIG.DATA_LABEL.FONT_SIZE,
              weight: CHART_CONFIG.DATA_LABEL.FONT_WEIGHT,
            },
            anchor: 'end',
            align: 'top',
            offset: CHART_CONFIG.DATA_LABEL.OFFSET,
          },
        },
      ],
    };
  }, [chartTrades, colors, minGapIdx, maxGapIdx, isDark]);

  // Chart options
  const options: ChartOptions<'line'> = useMemo(
    () => ({
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
            padding: CHART_CONFIG.LEGEND_PADDING,
            font: {
              size: 12,
            },
          },
        },
        tooltip: {
          backgroundColor: isDark ? '#0f0f0f' : '#EDECE8',
          titleColor: colors.text,
          bodyColor: colors.textMuted,
          borderColor: colors.grid,
          borderWidth: 1,
          padding: CHART_CONFIG.TOOLTIP_PADDING,
          displayColors: true,
          callbacks: {
            label: (context) => {
              const label = context.dataset.label || '';
              const value = context.raw as number;
              if (context.datasetIndex === 0) {
                // 평균단가: 한국식 단위 사용
                return `${label}: ${formatKoreanUnit(value)}`;
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
            maxRotation: CHART_CONFIG.X_AXIS_MAX_ROTATION,
            callback: (_value, index) => {
              // Show every 2nd label on small screens
              const step = chartTrades[index]?.step;
              if (chartTrades.length > CHART_CONFIG.LABEL_SKIP_THRESHOLD) {
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
            text: TEXTS.CHART.Y_AXIS_AVG_PRICE,
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
            // 한국식 단위 사용 (만, 억)
            callback: (value) => formatKoreanUnit(Number(value)),
          },
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: TEXTS.CHART.Y_AXIS_GAP_RATE,
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
    }),
    [colors, isDark, chartTrades]
  );

  // Update chart on theme change
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.update();
    }
  }, [isDark]);

  if (chartTrades.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-xl border border-dashed border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800/30"
        style={{ height }}
      >
        <div className="text-center text-zinc-500 dark:text-zinc-400">
          <p className="text-sm">{TEXTS.CHART.EMPTY_TITLE}</p>
          <p className="text-xs mt-1">{TEXTS.CHART.EMPTY_DESC}</p>
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
