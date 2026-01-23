// ============================================
// Vercel API Route: Stock Fundamental Data
// 네이버 금융에서 PER, PBR, 배당수익률 조회
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

// 네이버 금융 API에서 종목 정보 조회
async function fetchNaverStock(ticker: string): Promise<StockFundamentalData | null> {
  const url = `https://m.stock.naver.com/api/stock/${ticker}/basic`;

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();

  // 네이버 API 응답 파싱
  const parseNum = (val: string | number | null | undefined): number | null => {
    if (val === null || val === undefined || val === '' || val === '-') return null;
    const num = typeof val === 'string' ? parseFloat(val.replace(/,/g, '')) : val;
    return isNaN(num) ? null : num;
  };

  return {
    ticker,
    name: data.stockName || '',
    market: data.marketName?.includes('코스닥') ? 'KOSDAQ' : 'KOSPI',
    per: parseNum(data.per),
    pbr: parseNum(data.pbr),
    dividendYield: parseNum(data.dividendYield),
    eps: parseNum(data.eps),
    bps: parseNum(data.bps),
    dps: null, // 네이버 API에서 직접 제공하지 않음
    currentPrice: parseNum(data.closePrice),
    marketCap: parseNum(data.marketValue),
    fetchedAt: new Date().toISOString(),
  };
}

// 네이버 금융 투자지표 API (PER, PBR, 배당수익률)
async function fetchNaverInvestmentInfo(ticker: string): Promise<Partial<StockFundamentalData>> {
  const url = `https://m.stock.naver.com/api/stock/${ticker}/integration`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return {};
    }

    const data = await response.json();
    const investInfo = data.totalInfos?.find((i: { key: string }) => i.key === 'investInfo');

    const parseNum = (val: string | number | null | undefined): number | null => {
      if (val === null || val === undefined || val === '' || val === '-') return null;
      const num = typeof val === 'string' ? parseFloat(val.replace(/,/g, '').replace('%', '')) : val;
      return isNaN(num) ? null : num;
    };

    if (investInfo?.data) {
      const per = investInfo.data.find((d: { key: string }) => d.key === 'per')?.value;
      const pbr = investInfo.data.find((d: { key: string }) => d.key === 'pbr')?.value;
      const dy = investInfo.data.find((d: { key: string }) => d.key === 'dividendYield')?.value;

      return {
        per: parseNum(per),
        pbr: parseNum(pbr),
        dividendYield: parseNum(dy),
      };
    }
  } catch {
    // 실패 시 빈 객체 반환
  }

  return {};
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
    // 네이버 금융에서 기본 정보 조회
    const basicData = await fetchNaverStock(normalizedTicker);

    if (!basicData) {
      res.status(404).json({ error: 'Stock not found', ticker: normalizedTicker });
      return;
    }

    // 투자지표 추가 조회
    const investInfo = await fetchNaverInvestmentInfo(normalizedTicker);

    // 데이터 병합 (투자지표가 있으면 덮어씀)
    const data: StockFundamentalData = {
      ...basicData,
      per: investInfo.per ?? basicData.per,
      pbr: investInfo.pbr ?? basicData.pbr,
      dividendYield: investInfo.dividendYield ?? basicData.dividendYield,
    };

    res.status(200).json(data);
  } catch (error) {
    console.error('Naver Stock API Error:', error);
    res.status(500).json({
      error: 'Failed to fetch stock data',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
