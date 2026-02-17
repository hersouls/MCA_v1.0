// ============================================
// MCA Chart Component
// Dual-axis chart: Average Price + Gap %
// ============================================

import { useIsMobile } from '@/hooks/useMediaQuery';
import { calculateTrades } from '@/services/calculation';
import { useSettingsStore } from '@/stores/settingsStore';
import type { PortfolioParams } from '@/types';
import { CHART_COLORS, CHART_CONFIG, getCSSVar, hexToRgba } from '@/utils/constants';
import { formatAmountCompact } from '@/utils/format';
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
import { Loader2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, useTransition } from 'react';
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
  market?: string;
}

export function MCAChart({
  params,
  orderedSteps,
  executedSteps,
  height = CHART_CONFIG.DEFAULT_HEIGHT,
  market,
}: MCAChartProps) {
  const chartRef = useRef<ChartJS<'line'>>(null);
  const theme = useSettingsStore((state) => state.settings.theme);
  const isMobile = useIsMobile();
  const [isPending, startTransition] = useTransition();

  // Determine if dark mode
  const isDark = useMemo(() => {
    if (theme === 'dark') return true;
    if (theme === 'light') return false;
    // System preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }, [theme]);

  const rawTrades = useMemo(
    () => calculateTrades(params, orderedSteps, executedSteps, market),
    [params, orderedSteps, executedSteps]
  );

  // Wrap trades in a transition so recalculation doesn't block UI
  const [trades, setTrades] = useState(rawTrades);
  useEffect(() => {
    startTransition(() => {
      setTrades(rawTrades);
    });
  }, [rawTrades, startTransition]);

  // Filter trades that have data to show
  const chartTrades = useMemo(() => {
    return trades.filter((t) => t.isOrdered || t.isExecuted);
  }, [trades]);

  // Chart colors based on theme - using centralized CHART_COLORS
  const themeColors = isDark ? CHART_COLORS.dark : CHART_COLORS.light;
  const colors = useMemo(
    () => ({
      ...themeColors,
      text: getCSSVar('--foreground'),
      grid: getCSSVar('--border'),
      textMuted: getCSSVar('--muted-foreground'),
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

  // Font sizes based on viewport
  const axisFontSize = isMobile ? 9 : 11;
  const legendFontSize = isMobile ? 10 : 12;

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
              // On mobile, only show min/max labels
              return idx === minGapIdx || idx === maxGapIdx;
            },
            formatter: (value: number) => `${value.toFixed(1)}%`,
            color: colors.text,
            backgroundColor: hexToRgba(getCSSVar('--background'), isDark ? 0.7 : 0.9),
            borderRadius: CHART_CONFIG.DATA_LABEL.BORDER_RADIUS,
            padding: isMobile ? 2 : CHART_CONFIG.DATA_LABEL.PADDING,
            font: {
              size: isMobile ? 9 : CHART_CONFIG.DATA_LABEL.FONT_SIZE,
              weight: CHART_CONFIG.DATA_LABEL.FONT_WEIGHT,
            },
            anchor: 'end',
            align: 'top',
            offset: CHART_CONFIG.DATA_LABEL.OFFSET,
          },
        },
      ],
    };
  }, [chartTrades, colors, minGapIdx, maxGapIdx, isDark, isMobile]);

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
            padding: isMobile ? 8 : CHART_CONFIG.LEGEND_PADDING,
            font: {
              size: legendFontSize,
            },
          },
        },
        tooltip: {
          backgroundColor: getCSSVar('--card'),
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
                return `${label}: ${formatAmountCompact(value, market)}`;
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
              size: axisFontSize,
            },
            maxRotation: CHART_CONFIG.X_AXIS_MAX_ROTATION,
            callback: (_value, index) => {
              const step = chartTrades[index]?.step;
              // On mobile, skip more labels for readability
              if (isMobile) {
                return index % 3 === 0 ? step : '';
              }
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
            display: !isMobile,
            text: TEXTS.CHART.Y_AXIS_AVG_PRICE,
            color: colors.textMuted,
            font: {
              size: axisFontSize,
            },
          },
          grid: {
            color: colors.grid,
          },
          ticks: {
            color: colors.textMuted,
            font: {
              size: axisFontSize,
            },
            callback: (value) => formatAmountCompact(Number(value), market),
          },
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: !isMobile,
            text: TEXTS.CHART.Y_AXIS_GAP_RATE,
            color: colors.textMuted,
            font: {
              size: axisFontSize,
            },
          },
          grid: {
            drawOnChartArea: false,
          },
          ticks: {
            color: colors.textMuted,
            font: {
              size: axisFontSize,
            },
            callback: (value) => `${Number(value).toFixed(0)}%`,
          },
        },
      },
    }),
    [colors, isDark, chartTrades, isMobile, axisFontSize, legendFontSize]
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
        className="flex items-center justify-center rounded-xl border border-dashed border-border bg-surface-hover"
        style={{ height }}
      >
        <div className="text-center text-muted-foreground">
          <p className="text-sm">{TEXTS.CHART.EMPTY_TITLE}</p>
          <p className="text-xs mt-1">{TEXTS.CHART.EMPTY_DESC}</p>
        </div>
      </div>
    );
  }

  // Chart summary for screen readers
  const chartSummary = useMemo(() => {
    if (chartTrades.length === 0) return '';
    const lastTrade = chartTrades[chartTrades.length - 1];
    const gaps = chartTrades.map((t) => t.gap);
    const minGap = Math.min(...gaps);
    const maxGap = Math.max(...gaps);
    return `${chartTrades.length}개 구간 MCA 차트: 최저 괴리율 ${minGap.toFixed(1)}%, 최고 괴리율 ${maxGap.toFixed(1)}%, 최종 평균단가 ${formatAmountCompact(lastTrade.avgPrice, market)}`;
  }, [chartTrades]);

  return (
    <div
      className="relative rounded-xl border border-border bg-card p-4"
      style={{ height }}
    >
      <Line
        ref={chartRef}
        data={data}
        options={options}
        aria-label={chartSummary}
      />

      {/* Recalculation loading overlay */}
      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-card/60 backdrop-blur-[1px] z-10">
          <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
        </div>
      )}

      {/* Accessible Data Table (visually hidden for screen readers) */}
      <table className="sr-only" role="table" aria-label="MCA 차트 데이터">
        <caption>매수 구간별 평균단가 및 괴리율 데이터</caption>
        <thead>
          <tr>
            <th scope="col">구간</th>
            <th scope="col">평균단가</th>
            <th scope="col">괴리율</th>
            <th scope="col">상태</th>
          </tr>
        </thead>
        <tbody>
          {chartTrades.map((trade) => (
            <tr key={trade.step}>
              <td>{trade.step}구간</td>
              <td>{formatAmountCompact(trade.avgPrice, market)}</td>
              <td>{trade.gap.toFixed(2)}%</td>
              <td>
                {trade.isExecuted ? '체결됨' : trade.isOrdered ? '주문됨' : '미주문'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
