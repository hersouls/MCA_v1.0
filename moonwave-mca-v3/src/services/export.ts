// ============================================
// Export Service
// PDF (jsPDF) & Excel (SheetJS) 내보내기
// ============================================

import type {
  Portfolio,
  CalculatedTrade,
  PDFReportOptions,
  ExcelExportOptions,
  FundamentalResult,
} from '@/types';
import { formatCurrency, formatCompact, formatPercent } from '@/utils/format';
import { calculateTrades } from './calculation';
import { calculateFundamentalScore } from './fundamentalGrade';

// ============================================
// JSON Export (기존)
// ============================================

/**
 * 전체 데이터 JSON 내보내기
 */
export function exportToJSON(data: {
  portfolios: Portfolio[];
  settings?: unknown;
}): Blob {
  const exportData = {
    version: '3.0',
    exportDate: new Date().toISOString(),
    appName: 'Moonwave MCA',
    ...data,
  };

  const json = JSON.stringify(exportData, null, 2);
  return new Blob([json], { type: 'application/json' });
}

/**
 * JSON 파일 다운로드
 */
export function downloadJSON(data: unknown, filename: string): void {
  const blob = exportToJSON(data as { portfolios: Portfolio[] });
  downloadBlob(blob, filename);
}

// ============================================
// CSV Export
// ============================================

/**
 * 매매 리스트를 CSV로 변환
 */
export function tradesToCSV(trades: CalculatedTrade[], portfolioName: string): string {
  const headers = ['구간', '하락률', '매수가', '수량', '금액', '누적수량', '누적금액', '평단가', '괴리율', '주문', '체결'];
  const rows = trades.map((t) => [
    t.step,
    `-${t.dropRate}%`,
    t.buyPrice,
    t.quantity,
    t.amount,
    t.cumulativeQty,
    t.cumulativeAmt,
    t.avgPrice,
    `${t.gap.toFixed(2)}%`,
    t.isOrdered ? 'O' : '',
    t.isExecuted ? 'O' : '',
  ]);

  const csvContent = [
    `# ${portfolioName} - Moonwave MCA 매매 리스트`,
    `# 생성일: ${new Date().toLocaleDateString('ko-KR')}`,
    '',
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  return csvContent;
}

/**
 * CSV 파일 다운로드
 */
export function downloadCSV(content: string, filename: string): void {
  // BOM 추가 (한글 Excel 호환)
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + content], { type: 'text/csv;charset=utf-8' });
  downloadBlob(blob, filename);
}

// ============================================
// Excel Export (SheetJS)
// ============================================

/**
 * Excel 워크북 생성
 * 실제 구현 시 xlsx (SheetJS) 라이브러리 필요
 */
export async function createExcelWorkbook(
  portfolio: Portfolio,
  trades: CalculatedTrade[],
  options: ExcelExportOptions
): Promise<Blob | null> {
  try {
    // 동적 import - xlsx 패키지가 설치되어 있어야 함
    const XLSX = await import('xlsx').catch(() => null);
    if (!XLSX) {
      console.warn('xlsx library not installed. Run: npm install xlsx');
      return null;
    }

    const workbook = XLSX.utils.book_new();

    // 1. 요약 시트
    if (options.sheets.includes('summary')) {
      const summaryData = [
        ['Moonwave MCA 포트폴리오 리포트'],
        [''],
        ['종목명', portfolio.name],
        ['종목코드', portfolio.stockCode || '-'],
        ['생성일', new Date(portfolio.createdAt).toLocaleDateString('ko-KR')],
        [''],
        ['[파라미터]'],
        ['고점가격', portfolio.params.peakPrice],
        ['투자강도', portfolio.params.strength],
        ['시작하락률', `${portfolio.params.startDrop}%`],
        ['분할구간', portfolio.params.steps],
        ['목표예산', portfolio.params.targetBudget],
        [''],
        ['[기보유]'],
        ['수량', portfolio.params.legacyQty],
        ['평단가', portfolio.params.legacyAvg],
      ];

      // Fundamental Grade 정보 추가
      if (portfolio.fundamentalScore !== undefined) {
        summaryData.push(
          [''],
          ['[Fundamental Grade]'],
          ['총점', portfolio.fundamentalScore],
          ['Grade', portfolio.fundamentalGrade || '-']
        );
      }

      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summarySheet, '요약');
    }

    // 2. 매매 리스트 시트
    if (options.sheets.includes('trades')) {
      const tradesData = [
        ['구간', '하락률', '매수가', '수량', '금액', '누적수량', '누적금액', '평단가', '괴리율', '주문', '체결'],
        ...trades.map((t) => [
          t.step,
          `-${t.dropRate}%`,
          t.buyPrice,
          t.quantity,
          t.amount,
          t.cumulativeQty,
          t.cumulativeAmt,
          t.avgPrice,
          `${t.gap.toFixed(2)}%`,
          t.isOrdered ? 'O' : '',
          t.isExecuted ? 'O' : '',
        ]),
      ];

      const tradesSheet = XLSX.utils.aoa_to_sheet(tradesData);
      XLSX.utils.book_append_sheet(workbook, tradesSheet, '매매리스트');
    }

    // 3. 통계 분석 시트
    if (options.sheets.includes('analysis')) {
      const executedTrades = trades.filter((t) => t.isExecuted);
      const orderedTrades = trades.filter((t) => t.isOrdered);
      const totalExecuted = executedTrades.reduce((sum, t) => sum + t.amount, 0);
      const totalOrdered = orderedTrades.reduce((sum, t) => sum + t.amount, 0);
      const avgPrice = executedTrades.length > 0 ? executedTrades[executedTrades.length - 1].avgPrice : 0;

      const analysisData = [
        ['통계 분석'],
        [''],
        ['체결 구간 수', executedTrades.length],
        ['주문 구간 수', orderedTrades.length - executedTrades.length],
        ['대기 구간 수', trades.length - orderedTrades.length],
        [''],
        ['체결 총액', totalExecuted],
        ['주문 총액', totalOrdered],
        ['현재 평단가', avgPrice],
        [''],
        ['진행률', `${((executedTrades.length / trades.length) * 100).toFixed(1)}%`],
      ];

      const analysisSheet = XLSX.utils.aoa_to_sheet(analysisData);
      XLSX.utils.book_append_sheet(workbook, analysisSheet, '분석');
    }

    // Blob으로 변환
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  } catch (error) {
    console.error('Excel export failed:', error);
    return null;
  }
}

/**
 * Excel 파일 다운로드
 */
export async function downloadExcel(
  portfolio: Portfolio,
  orderedSteps: number[],
  executedSteps: number[],
  options?: Partial<ExcelExportOptions>
): Promise<boolean> {
  const defaultOptions: ExcelExportOptions = {
    includeAllSheets: true,
    sheets: ['summary', 'trades', 'analysis'],
    dateFormat: 'YYYY-MM-DD',
    currencyFormat: '#,##0',
    ...options,
  };

  const trades = calculateTrades(portfolio.params, orderedSteps, executedSteps);
  const blob = await createExcelWorkbook(portfolio, trades, defaultOptions);

  if (blob) {
    const filename = `${portfolio.name}_MCA_${formatDate(new Date())}.xlsx`;
    downloadBlob(blob, filename);
    return true;
  }

  return false;
}

// ============================================
// PDF Export (jsPDF)
// ============================================

/**
 * PDF 리포트 생성
 * 실제 구현 시 jspdf, jspdf-autotable 라이브러리 필요
 */
export async function createPDFReport(
  portfolio: Portfolio,
  trades: CalculatedTrade[],
  options: PDFReportOptions,
  chartImage?: string
): Promise<Blob | null> {
  try {
    // 동적 import - jspdf 패키지가 설치되어 있어야 함
    const jspdfModule = await import('jspdf').catch(() => null);
    if (!jspdfModule) {
      console.warn('jspdf library not installed. Run: npm install jspdf jspdf-autotable');
      return null;
    }
    const { jsPDF } = jspdfModule;

    // jspdf-autotable 확장 로드 (선택적)
    await import('jspdf-autotable').catch(() => {
      console.warn('jspdf-autotable not installed. Tables will be skipped.');
    });

    const doc = new jsPDF({
      orientation: options.orientation,
      unit: 'mm',
      format: options.pageSize,
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 20;

    // 제목
    doc.setFontSize(18);
    doc.text(`${portfolio.name} MCA 리포트`, pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`생성일: ${new Date().toLocaleDateString('ko-KR')}`, pageWidth / 2, yPos, { align: 'center' });
    doc.setTextColor(0);
    yPos += 15;

    // 파라미터 섹션
    doc.setFontSize(12);
    doc.text('매매 파라미터', 15, yPos);
    yPos += 7;

    doc.setFontSize(10);
    const params = [
      `고점가격: ${formatCurrency(portfolio.params.peakPrice)}`,
      `투자강도: ${portfolio.params.strength}`,
      `시작하락률: -${portfolio.params.startDrop}%`,
      `분할구간: ${portfolio.params.steps}구간`,
      `목표예산: ${formatCompact(portfolio.params.targetBudget)}`,
    ];
    params.forEach((p) => {
      doc.text(p, 20, yPos);
      yPos += 5;
    });
    yPos += 5;

    // Fundamental Grade 섹션
    if (options.includeFundamental && portfolio.fundamentalData) {
      const result = calculateFundamentalScore(portfolio.fundamentalData);

      doc.setFontSize(12);
      doc.text('Fundamental Grade', 15, yPos);
      yPos += 7;

      doc.setFontSize(14);
      doc.setTextColor(result.grade === 'A' ? '#22c55e' : result.grade === 'D' ? '#ef4444' : '#000');
      doc.text(`Grade ${result.grade} (${result.totalScore}/100점)`, 20, yPos);
      doc.setTextColor(0);
      yPos += 10;
    }

    // 차트 이미지
    if (options.includeChart && chartImage) {
      try {
        doc.addImage(chartImage, 'PNG', 15, yPos, pageWidth - 30, 60);
        yPos += 70;
      } catch (e) {
        console.warn('Failed to add chart image:', e);
      }
    }

    // 매매 리스트 테이블
    if (options.includeTradeList) {
      // 새 페이지 필요한 경우
      if (yPos > 200) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(12);
      doc.text('매매 체결 리스트', 15, yPos);
      yPos += 7;

      const tableData = trades.map((t) => [
        t.step.toString(),
        `-${t.dropRate}%`,
        formatCurrency(t.buyPrice),
        t.quantity.toString(),
        formatCompact(t.amount),
        t.isExecuted ? formatCurrency(t.avgPrice) : '-',
        t.isOrdered || t.isExecuted ? formatPercent(t.gap) : '-',
        t.isOrdered ? '✓' : '',
        t.isExecuted ? '✓' : '',
      ]);

      // autoTable은 jsPDF 확장 (jspdf-autotable 플러그인)
      if (doc.autoTable) {
        doc.autoTable({
          startY: yPos,
          head: [['구간', '하락률', '매수가', '수량', '금액', '평단가', '괴리율', '주문', '체결']],
          body: tableData,
          styles: { fontSize: 8, cellPadding: 2 },
          headStyles: { fillColor: [37, 99, 235] },
          alternateRowStyles: { fillColor: [245, 247, 250] },
        });
      }
    }

    // 푸터
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        `Moonwave MCA v3.0 | Page ${i} of ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }

    return doc.output('blob');
  } catch (error) {
    console.error('PDF export failed:', error);
    return null;
  }
}

/**
 * PDF 파일 다운로드
 */
export async function downloadPDF(
  portfolio: Portfolio,
  orderedSteps: number[],
  executedSteps: number[],
  options?: Partial<PDFReportOptions>,
  chartImage?: string
): Promise<boolean> {
  const defaultOptions: PDFReportOptions = {
    includeChart: true,
    includeTradeList: true,
    includeFundamental: true,
    includeSimulation: false,
    pageSize: 'A4',
    orientation: 'portrait',
    ...options,
  };

  const trades = calculateTrades(portfolio.params, orderedSteps, executedSteps);
  const blob = await createPDFReport(portfolio, trades, defaultOptions, chartImage);

  if (blob) {
    const filename = `${portfolio.name}_MCA_Report_${formatDate(new Date())}.pdf`;
    downloadBlob(blob, filename);
    return true;
  }

  return false;
}

// ============================================
// Print (인쇄)
// ============================================

/**
 * 인쇄용 HTML 생성
 */
export function generatePrintHTML(
  portfolio: Portfolio,
  trades: CalculatedTrade[],
  fundamentalResult?: FundamentalResult
): string {
  const executedTrades = trades.filter((t) => t.isExecuted);
  const avgPrice = executedTrades.length > 0 ? executedTrades[executedTrades.length - 1].avgPrice : 0;
  const totalExecuted = executedTrades.reduce((sum, t) => sum + t.amount, 0);

  return `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <title>${portfolio.name} MCA 리포트</title>
      <style>
        @media print {
          body { font-family: 'Malgun Gothic', sans-serif; font-size: 10pt; margin: 20mm; }
          h1 { font-size: 18pt; margin-bottom: 5mm; }
          h2 { font-size: 12pt; margin-top: 10mm; margin-bottom: 3mm; border-bottom: 1px solid #333; }
          table { width: 100%; border-collapse: collapse; margin-top: 5mm; }
          th, td { border: 1px solid #ccc; padding: 2mm; text-align: right; }
          th { background-color: #f0f0f0; }
          .summary { display: flex; gap: 10mm; margin-bottom: 10mm; }
          .summary-item { flex: 1; padding: 5mm; background: #f9f9f9; }
          .grade { font-size: 24pt; font-weight: bold; }
          .grade-A { color: #22c55e; }
          .grade-B { color: #3b82f6; }
          .grade-C { color: #f59e0b; }
          .grade-D { color: #ef4444; }
          .footer { margin-top: 10mm; text-align: center; color: #888; font-size: 8pt; }
        }
      </style>
    </head>
    <body>
      <h1>${portfolio.name} MCA 리포트</h1>
      <p>생성일: ${new Date().toLocaleDateString('ko-KR')}</p>

      <div class="summary">
        <div class="summary-item">
          <strong>투입금액</strong><br>
          ${formatCompact(totalExecuted)}
        </div>
        <div class="summary-item">
          <strong>보유수량</strong><br>
          ${executedTrades.reduce((sum, t) => sum + t.quantity, 0).toLocaleString()}주
        </div>
        <div class="summary-item">
          <strong>평균단가</strong><br>
          ${formatCurrency(avgPrice)}
        </div>
        ${fundamentalResult ? `
        <div class="summary-item">
          <strong>Fundamental</strong><br>
          <span class="grade grade-${fundamentalResult.grade}">Grade ${fundamentalResult.grade}</span>
        </div>
        ` : ''}
      </div>

      <h2>매매 파라미터</h2>
      <table>
        <tr><th>항목</th><th>값</th></tr>
        <tr><td>고점가격</td><td>${formatCurrency(portfolio.params.peakPrice)}</td></tr>
        <tr><td>투자강도</td><td>${portfolio.params.strength}</td></tr>
        <tr><td>시작하락률</td><td>-${portfolio.params.startDrop}%</td></tr>
        <tr><td>분할구간</td><td>${portfolio.params.steps}구간</td></tr>
        <tr><td>목표예산</td><td>${formatCompact(portfolio.params.targetBudget)}</td></tr>
      </table>

      <h2>매매 체결 리스트</h2>
      <table>
        <thead>
          <tr>
            <th>구간</th><th>하락률</th><th>매수가</th><th>수량</th>
            <th>금액</th><th>평단가</th><th>괴리율</th><th>상태</th>
          </tr>
        </thead>
        <tbody>
          ${trades.map((t) => `
            <tr style="background: ${t.isExecuted ? '#e6ffe6' : t.isOrdered ? '#fffde6' : ''}">
              <td>${t.step}</td>
              <td>-${t.dropRate}%</td>
              <td>${formatCurrency(t.buyPrice)}</td>
              <td>${t.quantity.toLocaleString()}</td>
              <td>${formatCompact(t.amount)}</td>
              <td>${t.isExecuted ? formatCurrency(t.avgPrice) : '-'}</td>
              <td>${t.isOrdered || t.isExecuted ? formatPercent(t.gap) : '-'}</td>
              <td>${t.isExecuted ? '체결' : t.isOrdered ? '주문' : '대기'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="footer">
        Generated by Moonwave MCA v3.0 | ${new Date().toISOString()}
      </div>
    </body>
    </html>
  `;
}

/**
 * 인쇄 창 열기
 */
export function openPrintWindow(html: string): void {
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  }
}

// ============================================
// Utility Functions
// ============================================

/**
 * Blob 다운로드
 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 날짜 포맷 (YYYY-MM-DD)
 */
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * 내보내기 가능한 형식 목록
 */
export function getAvailableExportFormats(): string[] {
  return ['json', 'csv', 'excel', 'pdf', 'print'];
}
