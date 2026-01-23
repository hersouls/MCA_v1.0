// ============================================
// Vercel API Route: Stock Search
// KRX 종목 검색 API
// ============================================

import type { VercelRequest, VercelResponse } from '@vercel/node';

export interface StockSearchResult {
  ticker: string;
  name: string;
  market: 'KOSPI' | 'KOSDAQ';
}

// 한국거래소 종목 마스터 캐시 (메모리)
let stockMasterCache: StockSearchResult[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24시간

// KRX OTP 요청 (종목 마스터)
async function getKrxOtp(): Promise<string> {
  const response = await fetch(
    'http://data.krx.co.kr/comm/fileDn/GenerateOTP/generate.cmd',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Referer: 'http://data.krx.co.kr/contents/MDC/MDI/mdiLoader/index.cmd',
        Origin: 'http://data.krx.co.kr',
      },
      body: new URLSearchParams({
        locale: 'ko_KR',
        mktId: 'ALL',
        share: '1',
        csvxls_isNo: 'false',
        name: 'fileDown',
        url: 'dbms/MDC/STAT/standard/MDCSTAT01901',
      }),
    }
  );

  return response.text();
}

// KRX 데이터 요청
async function getKrxData(otp: string): Promise<string> {
  const response = await fetch(
    'http://data.krx.co.kr/comm/fileDn/download_csv/download.cmd',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        Referer: 'http://data.krx.co.kr/contents/MDC/MDI/mdiLoader/index.cmd',
      },
      body: new URLSearchParams({ code: otp }),
    }
  );

  const buffer = await response.arrayBuffer();
  const decoder = new TextDecoder('euc-kr');
  return decoder.decode(buffer);
}

// CSV 파싱하여 종목 마스터 생성
function parseStockMaster(csv: string): StockSearchResult[] {
  const lines = csv.split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map((h) => h.trim().replace(/"/g, ''));

  const tickerIdx = headers.findIndex(
    (h) => h === '종목코드' || h === '단축코드'
  );
  const nameIdx = headers.findIndex((h) => h === '종목명');
  const marketIdx = headers.findIndex((h) => h === '시장구분');

  const results: StockSearchResult[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map((c) => c.trim().replace(/"/g, ''));
    const ticker = cols[tickerIdx];
    const name = cols[nameIdx];
    const marketStr = cols[marketIdx];

    if (ticker && name) {
      results.push({
        ticker,
        name,
        market: marketStr?.includes('KOSDAQ') ? 'KOSDAQ' : 'KOSPI',
      });
    }
  }

  return results;
}

// 종목 마스터 로드
async function loadStockMaster(): Promise<StockSearchResult[]> {
  const now = Date.now();

  if (stockMasterCache && now - cacheTimestamp < CACHE_TTL) {
    return stockMasterCache;
  }

  const otp = await getKrxOtp();
  const csv = await getKrxData(otp);
  stockMasterCache = parseStockMaster(csv);
  cacheTimestamp = now;

  return stockMasterCache;
}

// 검색 함수
function searchStocks(
  stocks: StockSearchResult[],
  query: string,
  limit: number
): StockSearchResult[] {
  const normalizedQuery = query.toLowerCase().trim();

  // 종목코드 정확 매칭 우선
  const exactCodeMatch = stocks.filter(
    (s) => s.ticker === normalizedQuery || s.ticker === normalizedQuery.padStart(6, '0')
  );

  if (exactCodeMatch.length > 0) {
    return exactCodeMatch.slice(0, limit);
  }

  // 종목명 검색
  const nameMatches = stocks.filter((s) =>
    s.name.toLowerCase().includes(normalizedQuery)
  );

  // 종목코드 부분 매칭
  const codeMatches = stocks.filter((s) =>
    s.ticker.includes(normalizedQuery.replace(/^0+/, ''))
  );

  // 중복 제거 후 반환
  const combined = [...nameMatches, ...codeMatches];
  const unique = Array.from(new Map(combined.map((s) => [s.ticker, s])).values());

  return unique.slice(0, limit);
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  // CORS 헤더
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { q, limit = '10' } = req.query;

  if (!q || typeof q !== 'string' || q.length < 1) {
    res.status(400).json({ error: 'Query parameter "q" is required (min 1 char)' });
    return;
  }

  try {
    const stocks = await loadStockMaster();
    const results = searchStocks(stocks, q, parseInt(limit as string, 10) || 10);

    res.status(200).json({
      query: q,
      count: results.length,
      results,
    });
  } catch (error) {
    console.error('Stock Search Error:', error);
    res.status(500).json({
      error: 'Failed to search stocks',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
