// ============================================
// Clipboard Service
// 스마트 클립보드 파싱 및 자동 데이터 추출
// ============================================

import type { ParsedFinancialData, ClipboardParseResult } from '@/types';

/**
 * 숫자 문자열 파싱 (쉼표, 공백 제거)
 */
function parseNumber(str: string): number | undefined {
  const cleaned = str.replace(/[,\s원주배%]/g, '').trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? undefined : num;
}

/**
 * 네이버 증권 데이터 파싱
 * 형식: "PER 12.5배 PBR 1.2배" 또는 테이블 형식
 */
function parseNaverFinance(text: string): ParsedFinancialData {
  const data: ParsedFinancialData = {};

  // PER 파싱 (다양한 형식 지원)
  const perPatterns = [
    /PER[:\s]*([0-9,.]+)/i,
    /주가수익비율[:\s]*([0-9,.]+)/i,
    /P\/E[:\s]*([0-9,.]+)/i,
  ];
  for (const pattern of perPatterns) {
    const match = text.match(pattern);
    if (match) {
      data.per = parseNumber(match[1]);
      break;
    }
  }

  // PBR 파싱
  const pbrPatterns = [
    /PBR[:\s]*([0-9,.]+)/i,
    /주가순자산비율[:\s]*([0-9,.]+)/i,
    /P\/B[:\s]*([0-9,.]+)/i,
  ];
  for (const pattern of pbrPatterns) {
    const match = text.match(pattern);
    if (match) {
      data.pbr = parseNumber(match[1]);
      break;
    }
  }

  // 배당수익률 파싱
  const divPatterns = [
    /배당수익률[:\s]*([0-9,.]+)/,
    /시가배당률[:\s]*([0-9,.]+)/,
    /Dividend\s*Yield[:\s]*([0-9,.]+)/i,
  ];
  for (const pattern of divPatterns) {
    const match = text.match(pattern);
    if (match) {
      data.dividendYield = parseNumber(match[1]);
      break;
    }
  }

  // 현재가 파싱
  const pricePatterns = [
    /현재가[:\s]*([0-9,]+)/,
    /종가[:\s]*([0-9,]+)/,
    /Price[:\s]*([0-9,]+)/i,
  ];
  for (const pattern of pricePatterns) {
    const match = text.match(pattern);
    if (match) {
      data.currentPrice = parseNumber(match[1]);
      break;
    }
  }

  // 시가총액 파싱
  const capPatterns = [
    /시가총액[:\s]*([0-9,]+)\s*(억|조)?/,
    /Market\s*Cap[:\s]*([0-9,]+)/i,
  ];
  for (const pattern of capPatterns) {
    const match = text.match(pattern);
    if (match) {
      let value = parseNumber(match[1]) || 0;
      if (match[2] === '조') value *= 10000;
      else if (match[2] === '억') value *= 1;
      data.marketCap = value;
      break;
    }
  }

  // 종목코드 파싱 (6자리 숫자)
  const codeMatch = text.match(/\b(\d{6})\b/);
  if (codeMatch) {
    data.stockCode = codeMatch[1];
  }

  return data;
}

/**
 * 컴퍼니가이드 데이터 파싱
 */
function parseCompanyGuide(text: string): ParsedFinancialData {
  const data: ParsedFinancialData = {};

  // 현금배당수익률
  const divMatch = text.match(/현금배당수익률[:\s\t]*([0-9,.]+)/);
  if (divMatch) {
    data.dividendYield = parseNumber(divMatch[1]);
  }

  // 자사주 비율
  const treasuryMatch = text.match(/자(?:기|사)주식?[:\s\t]*([0-9,.]+)/);
  if (treasuryMatch) {
    data.treasuryStockRatio = parseNumber(treasuryMatch[1]);
  }

  // PER, PBR도 파싱
  const perMatch = text.match(/PER[:\s\t]*([0-9,.]+)/i);
  if (perMatch) data.per = parseNumber(perMatch[1]);

  const pbrMatch = text.match(/PBR[:\s\t]*([0-9,.]+)/i);
  if (pbrMatch) data.pbr = parseNumber(pbrMatch[1]);

  return data;
}

/**
 * TSV/CSV 테이블 데이터 파싱
 */
function parseTableData(text: string): ParsedFinancialData {
  const data: ParsedFinancialData = {};
  const lines = text.split('\n');

  for (const line of lines) {
    // 탭 또는 쉼표로 분리
    const parts = line.split(/[\t,]/).map((p) => p.trim());
    if (parts.length < 2) continue;

    const label = parts[0].toLowerCase();
    const value = parts[1];

    if (label.includes('per') || label.includes('주가수익')) {
      data.per = parseNumber(value);
    } else if (label.includes('pbr') || label.includes('주가순자산')) {
      data.pbr = parseNumber(value);
    } else if (label.includes('배당') && label.includes('수익률')) {
      data.dividendYield = parseNumber(value);
    } else if (label.includes('자사주') || label.includes('자기주식')) {
      data.treasuryStockRatio = parseNumber(value);
    } else if (label.includes('현재가') || label.includes('종가')) {
      data.currentPrice = parseNumber(value);
    }
  }

  return data;
}

/**
 * JSON 데이터 파싱
 */
function parseJSONData(text: string): ParsedFinancialData {
  try {
    const json = JSON.parse(text);
    return {
      per: json.per ?? json.PER,
      pbr: json.pbr ?? json.PBR,
      dividendYield: json.dividendYield ?? json.배당수익률,
      treasuryStockRatio: json.treasuryStockRatio ?? json.자사주비율,
      stockCode: json.stockCode ?? json.code ?? json.종목코드,
      stockName: json.stockName ?? json.name ?? json.종목명,
      currentPrice: json.currentPrice ?? json.price ?? json.현재가,
    };
  } catch {
    return {};
  }
}

/**
 * 숫자만 있는 경우 (단일 값)
 */
function parseSingleNumber(text: string): ParsedFinancialData {
  const num = parseNumber(text);
  if (num !== undefined) {
    // 6자리이면 종목코드
    if (text.match(/^\d{6}$/)) {
      return { stockCode: text };
    }
    // 그 외에는 가격으로 추정
    return { currentPrice: num };
  }
  return {};
}

/**
 * 데이터 소스 판별
 */
function detectSource(
  text: string
): 'naver' | 'companyguide' | 'dart' | 'text' | 'json' | 'unknown' {
  const lowerText = text.toLowerCase();

  // JSON 감지
  if (text.trim().startsWith('{') || text.trim().startsWith('[')) {
    try {
      JSON.parse(text);
      return 'json';
    } catch {
      // Not valid JSON
    }
  }

  // 네이버 증권 키워드
  if (
    lowerText.includes('finance.naver') ||
    lowerText.includes('네이버증권') ||
    (lowerText.includes('per') && lowerText.includes('pbr'))
  ) {
    return 'naver';
  }

  // 컴퍼니가이드 키워드
  if (
    lowerText.includes('comp.fnguide') ||
    lowerText.includes('컴퍼니가이드') ||
    lowerText.includes('현금배당수익률')
  ) {
    return 'companyguide';
  }

  // DART 키워드
  if (lowerText.includes('dart.fss') || lowerText.includes('전자공시')) {
    return 'dart';
  }

  // TSV/CSV 감지
  if (text.includes('\t') || (text.includes(',') && text.includes('\n'))) {
    return 'text';
  }

  return 'unknown';
}

/**
 * 클립보드 데이터 파싱 (메인 함수)
 */
export function parseClipboardData(text: string): ClipboardParseResult {
  const source = detectSource(text);
  let data: ParsedFinancialData = {};

  switch (source) {
    case 'naver':
      data = parseNaverFinance(text);
      break;
    case 'companyguide':
      data = { ...parseNaverFinance(text), ...parseCompanyGuide(text) };
      break;
    case 'json':
      data = parseJSONData(text);
      break;
    case 'text':
      data = { ...parseNaverFinance(text), ...parseTableData(text) };
      break;
    default:
      // 여러 파서 조합
      data = {
        ...parseNaverFinance(text),
        ...parseTableData(text),
        ...parseSingleNumber(text.trim()),
      };
  }

  // 데이터가 있는지 확인
  const hasData = Object.values(data).some((v) => v !== undefined);

  return {
    success: hasData,
    data,
    source,
    rawText: text,
  };
}

/**
 * 클립보드에서 텍스트 읽기
 */
export async function readClipboard(): Promise<string | null> {
  try {
    if (!navigator.clipboard) {
      console.warn('Clipboard API not available');
      return null;
    }

    const text = await navigator.clipboard.readText();
    return text;
  } catch (error) {
    console.error('Failed to read clipboard:', error);
    return null;
  }
}

/**
 * 클립보드에 텍스트 쓰기
 */
export async function writeClipboard(text: string): Promise<boolean> {
  try {
    if (!navigator.clipboard) {
      // Fallback: execCommand
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    }

    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to write to clipboard:', error);
    return false;
  }
}

/**
 * 클립보드에서 데이터 파싱하여 반환
 */
export async function parseClipboardContent(): Promise<ClipboardParseResult | null> {
  const text = await readClipboard();
  if (!text) return null;
  return parseClipboardData(text);
}

/**
 * 포트폴리오 데이터를 클립보드용 텍스트로 변환
 */
export function formatPortfolioForClipboard(portfolio: {
  name: string;
  params: {
    peakPrice: number;
    strength: number;
    startDrop: number;
    steps: number;
    targetBudget: number;
  };
}): string {
  const lines = [
    `[Moonwave MCA 포트폴리오]`,
    `종목명: ${portfolio.name}`,
    `고점가격: ${portfolio.params.peakPrice.toLocaleString()}원`,
    `투자강도: ${portfolio.params.strength}`,
    `시작하락률: -${portfolio.params.startDrop}%`,
    `분할구간: ${portfolio.params.steps}구간`,
    `목표예산: ${portfolio.params.targetBudget.toLocaleString()}원`,
    ``,
    `Generated by Moonwave MCA v3.0`,
  ];

  return lines.join('\n');
}

/**
 * Fundamental Grade 데이터를 클립보드용 텍스트로 변환
 */
export function formatFundamentalForClipboard(data: {
  name: string;
  score: number;
  grade: string;
  per?: number | null;
  pbr?: number | null;
  dividendYield?: number | null;
}): string {
  const lines = [
    `[Moonwave Fundamental Grade]`,
    `종목명: ${data.name}`,
    `총점: ${data.score}/100점`,
    `Grade: ${data.grade}`,
    ``,
    `PER: ${data.per ?? 'N/A'}배`,
    `PBR: ${data.pbr ?? 'N/A'}배`,
    `배당수익률: ${data.dividendYield ?? 'N/A'}%`,
    ``,
    `Generated by Moonwave MCA v3.0`,
  ];

  return lines.join('\n');
}

/**
 * 붙여넣기 이벤트 핸들러 생성
 */
export function createPasteHandler(
  onParsed: (result: ClipboardParseResult) => void
): (e: ClipboardEvent) => void {
  return (e: ClipboardEvent) => {
    const text = e.clipboardData?.getData('text/plain');
    if (text) {
      const result = parseClipboardData(text);
      if (result.success) {
        e.preventDefault(); // 기본 붙여넣기 방지
        onParsed(result);
      }
    }
  };
}
