// ============================================
// useExport Hook
// PDF/Excel/CSV 내보내기 기능
// ============================================

import { useState, useCallback } from 'react';
import type { Portfolio } from '@/types';
import {
  downloadJSON,
  downloadCSV,
  downloadExcel,
  downloadPDF,
  tradesToCSV,
  generatePrintHTML,
  openPrintWindow,
  getAvailableExportFormats,
} from '@/services/export';
import { calculateTrades } from '@/services/calculation';
import { calculateFundamentalScore } from '@/services/fundamentalGrade';
import { trackFeatureUsage } from '@/services/analytics';

type ExportFormat = 'json' | 'csv' | 'excel' | 'pdf' | 'print';

interface UseExportReturn {
  // 상태
  isExporting: boolean;
  error: string | null;
  availableFormats: string[];

  // 액션
  exportPortfolio: (
    portfolio: Portfolio,
    orderedSteps: number[],
    executedSteps: number[],
    format: ExportFormat,
    chartImage?: string
  ) => Promise<boolean>;

  exportAllPortfolios: (portfolios: Portfolio[]) => Promise<boolean>;
}

/**
 * 내보내기 기능 훅
 */
export function useExport(): UseExportReturn {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableFormats] = useState(getAvailableExportFormats);

  /**
   * 포트폴리오 내보내기
   */
  const exportPortfolio = useCallback(
    async (
      portfolio: Portfolio,
      orderedSteps: number[],
      executedSteps: number[],
      format: ExportFormat,
      chartImage?: string
    ): Promise<boolean> => {
      setIsExporting(true);
      setError(null);

      try {
        let success = false;

        switch (format) {
          case 'json': {
            downloadJSON(
              { portfolios: [portfolio] },
              `${portfolio.name}_MCA_${formatDate(new Date())}.json`
            );
            success = true;
            break;
          }

          case 'csv': {
            const trades = calculateTrades(portfolio.params, orderedSteps, executedSteps);
            const csvContent = tradesToCSV(trades, portfolio.name);
            downloadCSV(csvContent, `${portfolio.name}_MCA_${formatDate(new Date())}.csv`);
            success = true;
            break;
          }

          case 'excel': {
            success = await downloadExcel(portfolio, orderedSteps, executedSteps);
            if (success) {
              trackFeatureUsage('excelExport');
            }
            break;
          }

          case 'pdf': {
            success = await downloadPDF(portfolio, orderedSteps, executedSteps, undefined, chartImage);
            if (success) {
              trackFeatureUsage('pdfExport');
            }
            break;
          }

          case 'print': {
            const trades = calculateTrades(portfolio.params, orderedSteps, executedSteps);
            const fundamentalResult = portfolio.fundamentalData
              ? calculateFundamentalScore(portfolio.fundamentalData)
              : undefined;
            const html = generatePrintHTML(portfolio, trades, fundamentalResult);
            openPrintWindow(html);
            success = true;
            break;
          }
        }

        if (success) {
          trackFeatureUsage('export');
        } else {
          setError(`${format.toUpperCase()} 내보내기 실패`);
        }

        setIsExporting(false);
        return success;
      } catch (err) {
        const message = err instanceof Error ? err.message : '내보내기 실패';
        setError(message);
        setIsExporting(false);
        return false;
      }
    },
    []
  );

  /**
   * 모든 포트폴리오 JSON 내보내기
   */
  const exportAllPortfolios = useCallback(async (portfolios: Portfolio[]): Promise<boolean> => {
    setIsExporting(true);
    setError(null);

    try {
      downloadJSON({ portfolios }, `MCA_전체백업_${formatDate(new Date())}.json`);
      trackFeatureUsage('export');
      setIsExporting(false);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : '내보내기 실패';
      setError(message);
      setIsExporting(false);
      return false;
    }
  }, []);

  return {
    isExporting,
    error,
    availableFormats,
    exportPortfolio,
    exportAllPortfolios,
  };
}

/**
 * 날짜 포맷 (YYYY-MM-DD)
 */
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export default useExport;
