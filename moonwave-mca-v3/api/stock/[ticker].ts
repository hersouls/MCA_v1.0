// ============================================
// Vercel API Route: Stock Fundamental Data
// KRX 정보데이터시스템에서 PER, PBR, 배당수익률 크롤링
// ============================================

import type { VercelRequest, VercelResponse } from '@vercel/node';

export interface StockFundamentalData {
  ticker: string;
  name: string;
  market: 'KOSPI' | 'KOSDAQ';
  per: number | null;
  pbr: number | null;
  dividendYield: number | null;
  eps: number | null;
  bps: number | null;
  dps: number | null;
  currentPrice: number | null;
  marketCap: number | null;
  fetchedAt: string;
}

// KRX OTP 요청
async function getKrxOtp(bld: string): Promise<string> {
  const response = await fetch(
    'http://data.krx.co.kr/comm/fileDn/GenerateOTP/generate.cmd',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        Referer: 'http://data.krx.co.kr/contents/MDC/MDI/mdiLoader/index.cmd',
      },
      body: new URLSearchParams({
        locale: 'ko_KR',
        mktId: 'ALL',
        trdDd: getLatestTradingDate(),
        money: '1',
        csvxls_is498: 'false',
        name: 'fileDown',
        url: 'dbms/MDC/STAT/standard/MDCSTAT03501',
        bld,
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
  // KRX returns EUC-KR encoded CSV
  const decoder = new TextDecoder('euc-kr');
  return decoder.decode(buffer);
}

// 최근 거래일 계산 (주말 제외)
function getLatestTradingDate(): string {
  const today = new Date();
  const day = today.getDay();

  // 주말이면 금요일로 조정
  if (day === 0) today.setDate(today.getDate() - 2);
  else if (day === 6) today.setDate(today.getDate() - 1);

  return today.toISOString().slice(0, 10).replace(/-/g, '');
}

// CSV 파싱
function parseKrxCsv(csv: string, ticker: string): StockFundamentalData | null {
  const lines = csv.split('\n');
  if (lines.length < 2) return null;

  // 헤더 파싱
  const headers = lines[0].split(',').map((h) => h.trim().replace(/"/g, ''));

  // 종목코드 컬럼 인덱스 찾기
  const tickerIdx = headers.findIndex(
    (h) => h === '종목코드' || h === '단축코드'
  );
  const nameIdx = headers.findIndex((h) => h === '종목명');
  const marketIdx = headers.findIndex((h) => h === '시장구분');
  const perIdx = headers.findIndex((h) => h === 'PER');
  const pbrIdx = headers.findIndex((h) => h === 'PBR');
  const divYieldIdx = headers.findIndex((h) => h === '배당수익률');
  const epsIdx = headers.findIndex((h) => h === 'EPS');
  const bpsIdx = headers.findIndex((h) => h === 'BPS');
  const dpsIdx = headers.findIndex((h) => h === 'DPS' || h === '주당배당금');
  const priceIdx = headers.findIndex((h) => h === '종가');
  const capIdx = headers.findIndex((h) => h === '시가총액');

  // 종목 찾기
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map((c) => c.trim().replace(/"/g, ''));
    if (cols[tickerIdx] === ticker) {
      const parseNum = (idx: number): number | null => {
        if (idx === -1) return null;
        const val = cols[idx]?.replace(/,/g, '');
        const num = parseFloat(val);
        return isNaN(num) ? null : num;
      };

      return {
        ticker,
        name: cols[nameIdx] || '',
        market: cols[marketIdx]?.includes('KOSDAQ') ? 'KOSDAQ' : 'KOSPI',
        per: parseNum(perIdx),
        pbr: parseNum(pbrIdx),
        dividendYield: parseNum(divYieldIdx),
        eps: parseNum(epsIdx),
        bps: parseNum(bpsIdx),
        dps: parseNum(dpsIdx),
        currentPrice: parseNum(priceIdx),
        marketCap: parseNum(capIdx),
        fetchedAt: new Date().toISOString(),
      };
    }
  }

  return null;
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

  const { ticker } = req.query;

  if (!ticker || typeof ticker !== 'string') {
    res.status(400).json({ error: 'Ticker is required' });
    return;
  }

  // 6자리 종목코드 정규화
  const normalizedTicker = ticker.padStart(6, '0');

  try {
    // KRX PER/PBR/배당수익률 데이터
    const otp = await getKrxOtp('dbms/MDC/STAT/standard/MDCSTAT03501');
    const csv = await getKrxData(otp);
    const data = parseKrxCsv(csv, normalizedTicker);

    if (!data) {
      res.status(404).json({ error: 'Stock not found', ticker: normalizedTicker });
      return;
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('KRX API Error:', error);
    res.status(500).json({
      error: 'Failed to fetch stock data',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
