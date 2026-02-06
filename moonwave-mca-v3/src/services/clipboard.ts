// ============================================
// Clipboard Service
// 스마트 클립보드 파싱 및 자동 데이터 추출
// ============================================

import type {
  ClipboardParseResult,
  FutureInvestment,
  GeminiGemData,
  GlobalScalability,
  GovernanceRisk,
  MarketDominance,
  ParsedFinancialData,
  TotalShareholderReturn,
} from '@/types';

/**
 * 숫자 문자열 파싱 (쉼표, 공백 제거)
 */
function parseNumber(str: string): number | undefined {
  const cleaned = str.replace(/[,\s원주배%]/g, '').trim();
  const num = Number.parseFloat(cleaned);
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
  const pricePatterns = [/현재가[:\s]*([0-9,]+)/, /종가[:\s]*([0-9,]+)/, /Price[:\s]*([0-9,]+)/i];
  for (const pattern of pricePatterns) {
    const match = text.match(pattern);
    if (match) {
      data.currentPrice = parseNumber(match[1]);
      break;
    }
  }

  // 시가총액 파싱
  const capPatterns = [/시가총액[:\s]*([0-9,]+)\s*(억|조)?/, /Market\s*Cap[:\s]*([0-9,]+)/i];
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

// ============================================
// Gemini Gem JSON Parsing
// ============================================

/**
 * GlobalScalability 값 검증
 */
function validateGlobalScalability(value: unknown): GlobalScalability {
  const validValues: GlobalScalability[] = ['high_growth', 'expanding', 'domestic_regulated'];
  if (typeof value === 'string' && validValues.includes(value as GlobalScalability)) {
    return value as GlobalScalability;
  }
  return 'domestic_regulated';
}

/**
 * MarketDominance 값 검증
 */
function validateMarketDominance(value: unknown): MarketDominance {
  const validValues: MarketDominance[] = ['monopoly_top', 'oligopoly_top3', 'competitive'];
  if (typeof value === 'string' && validValues.includes(value as MarketDominance)) {
    return value as MarketDominance;
  }
  return 'competitive';
}

/**
 * FutureInvestment 값 검증
 */
function validateFutureInvestment(value: unknown): FutureInvestment {
  const validValues: FutureInvestment[] = ['high', 'maintain', 'decreasing'];
  if (typeof value === 'string' && validValues.includes(value as FutureInvestment)) {
    return value as FutureInvestment;
  }
  return 'maintain';
}

/**
 * GovernanceRisk 값 검증
 */
function validateGovernanceRisk(value: unknown): GovernanceRisk {
  const validValues: GovernanceRisk[] = ['clean', 'shareholder_friendly', 'defense_doubt'];
  if (typeof value === 'string' && validValues.includes(value as GovernanceRisk)) {
    return value as GovernanceRisk;
  }
  return 'defense_doubt';
}

/**
 * Gemini Gem JSON 파싱 결과
 */
export interface GemRawValues {
  per?: number;
  pbr?: number;
  stockCode?: string;
  stockName?: string;
  tsrPolicy?: string;
}

export interface GemParseResult {
  success: boolean;
  data?: GeminiGemData;
  rawValues?: GemRawValues;
  error?: string;
}

/**
 * globalRevenueType → GlobalScalability 변환
 */
function mapGlobalRevenueType(value: string): GlobalScalability {
  const mapping: Record<string, GlobalScalability> = {
    high_growth: 'high_growth',
    global_growth: 'high_growth', // Gemini Gem API alias
    expanding: 'expanding',
    domestic: 'domestic_regulated',
    regulated: 'domestic_regulated',
  };
  return mapping[value] || 'domestic_regulated';
}

/**
 * marketDominance 문자열 → MarketDominance 변환
 */
function mapMarketDominanceStr(value: string): MarketDominance {
  const mapping: Record<string, MarketDominance> = {
    monopoly: 'monopoly_top',
    monopoly_top: 'monopoly_top',
    dominant: 'monopoly_top', // Gemini Gem API alias
    oligopoly: 'oligopoly_top3',
    oligopoly_top3: 'oligopoly_top3',
    competitive: 'competitive',
  };
  return mapping[value] || 'competitive';
}

/**
 * rdCapexEfficiency → FutureInvestment 변환
 */
function mapRdCapexEfficiency(value: string): FutureInvestment {
  const mapping: Record<string, FutureInvestment> = {
    high: 'high',
    maintain: 'maintain',
    moderate: 'maintain',
    decreasing: 'decreasing',
    low: 'decreasing',
  };
  return mapping[value] || 'maintain';
}

/**
 * governanceRisk 문자열 → GovernanceRisk 변환
 */
function mapGovernanceRiskStr(value: string): GovernanceRisk {
  const mapping: Record<string, GovernanceRisk> = {
    clean: 'clean',
    low: 'clean',
    friendly: 'shareholder_friendly',
    shareholder_friendly: 'shareholder_friendly',
    moderate: 'defense_doubt',
    defense_doubt: 'defense_doubt',
    high: 'defense_doubt',
  };
  return mapping[value] || 'defense_doubt';
}

/**
 * tsrPolicy → TotalShareholderReturn 변환
 */
function mapTsrPolicy(value: string): TotalShareholderReturn {
  const mapping: Record<string, TotalShareholderReturn> = {
    active_growth: 'active_growth',
    buyback_dividend: 'active_growth',
    high_yield: 'high_yield',
    dividend_only: 'high_yield',
    minimum: 'minimum',
    minimal: 'minimum', // Gemini Gem API alias
    none: 'none',
  };
  return mapping[value] || 'none';
}

/**
 * Gemini Gem JSON 파싱 함수
 *
 * Supports two formats:
 *
 * Format 1 (Legacy):
 * {
 *   "earningsSustainability": true,
 *   "isDualListed": false,
 *   "globalScalability": "expanding",
 *   ...
 * }
 *
 * Format 2 (New Gem):
 * {
 *   "stockName": "LG씨엔에스",
 *   "stockCode": "064400",
 *   "per": 17.3,
 *   "pbr": 3.16,
 *   "governanceStructure": "partial",
 *   "globalRevenueType": "expanding",
 *   "marketDominance": "oligopoly",
 *   "rdCapexEfficiency": "high",
 *   "tsrPolicy": "dividend_only",
 *   "governanceRisk": "moderate",
 *   "totalScore": 65,
 *   "grade": "B"
 * }
 */
export function parseGeminiGemJson(text: string): GemParseResult {
  try {
    // JSON 코드 블록 추출 (마크다운 코드 블록 처리)
    let jsonText = text.trim();

    // ```json ... ``` 형식 처리
    const codeBlockMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      jsonText = codeBlockMatch[1].trim();
    }

    const json = JSON.parse(jsonText);

    // Detect format: new format has stockCode or globalRevenueType
    const isNewFormat = json.stockCode || json.globalRevenueType || json.rdCapexEfficiency;

    // 데이터 검증 및 기본값 적용
    const data: GeminiGemData = isNewFormat
      ? {
          // 가치평가 (new format)
          earningsSustainability: true, // 기본값 (new format에서 미제공)
          isDualListed: json.governanceStructure === 'partial' || json.governanceStructure === 'complex',

          // 주주환원 (new format에서 미제공, 기본값 설정)
          hasQuarterlyDividend: false,
          consecutiveDividendYears: 0,
          hasBuybackProgram: json.tsrPolicy === 'buyback_dividend' || json.tsrPolicy === 'active_growth',
          annualCancellationRate: 0,
          treasuryStockRatio: 0,

          // 성장/경영 (new format 매핑)
          globalScalability: mapGlobalRevenueType(json.globalRevenueType || ''),
          marketDominance: mapMarketDominanceStr(json.marketDominance || ''),
          futureInvestment: mapRdCapexEfficiency(json.rdCapexEfficiency || ''),
          governanceRisk: mapGovernanceRiskStr(json.governanceRisk || ''),
        }
      : {
          // Legacy format
          earningsSustainability: Boolean(json.earningsSustainability),
          isDualListed: Boolean(json.isDualListed),

          hasQuarterlyDividend: Boolean(json.hasQuarterlyDividend),
          consecutiveDividendYears: Math.max(0, Number(json.consecutiveDividendYears) || 0),
          hasBuybackProgram: Boolean(json.hasBuybackProgram),
          annualCancellationRate: Math.max(0, Number(json.annualCancellationRate) || 0),
          treasuryStockRatio: Math.max(0, Number(json.treasuryStockRatio) || 0),

          globalScalability: validateGlobalScalability(json.globalScalability),
          marketDominance: validateMarketDominance(json.marketDominance),
          futureInvestment: validateFutureInvestment(json.futureInvestment),
          governanceRisk: validateGovernanceRisk(json.governanceRisk),
        };

    // Raw values from new format (per, pbr, stockCode, stockName, tsrPolicy)
    const rawValues: GemRawValues | undefined = isNewFormat
      ? {
          per: typeof json.per === 'number' ? json.per : undefined,
          pbr: typeof json.pbr === 'number' ? json.pbr : undefined,
          stockCode: json.stockCode || undefined,
          stockName: json.stockName || undefined,
          tsrPolicy: json.tsrPolicy || undefined,
        }
      : undefined;

    return { success: true, data, rawValues };
  } catch (e) {
    const errorMessage =
      e instanceof SyntaxError
        ? '유효한 JSON 형식이 아닙니다.'
        : '데이터 파싱 중 오류가 발생했습니다.';
    return { success: false, error: errorMessage };
  }
}

/**
 * GeminiGemData + rawValues → FundamentalInput 변환
 */
export function gemDataToFundamentalInput(
  gemData: GeminiGemData,
  rawValues?: GemRawValues
): import('@/types').FundamentalInput {
  return {
    per: rawValues?.per ?? null,
    pbr: rawValues?.pbr ?? null,
    isDualListed: gemData.isDualListed,
    globalScalability: gemData.globalScalability,
    marketDominance: gemData.marketDominance,
    futureInvestment: gemData.futureInvestment,
    dividendYield: null,
    totalShareholderReturn: rawValues?.tsrPolicy
      ? mapTsrPolicy(rawValues.tsrPolicy)
      : 'none',
    governanceRisk: gemData.governanceRisk,
  };
}
