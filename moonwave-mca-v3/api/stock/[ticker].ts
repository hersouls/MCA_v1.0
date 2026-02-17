// ============================================
// Vercel API Route: Stock Fundamental Data
// 네이버 금융에서 PER, PBR, 배당수익률 조회
// ============================================

import type { VercelRequest, VercelResponse } from '@vercel/node';

export interface StockFundamentalData {
  ticker: string;
  name: string;
  market: 'KOSPI' | 'KOSDAQ' | 'NYSE' | 'NASDAQ' | 'AMEX';
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

// Yahoo Finance에서 미국 종목 조회
async function fetchYahooStock(ticker: string): Promise<StockFundamentalData | null> {
  try {
    const end = Math.floor(Date.now() / 1000);
    const start = end - 5 * 24 * 60 * 60; // 5 days

    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?period1=${start}&period2=${end}&interval=1d`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) return null;

    const json = await response.json();
    const result = json.chart?.result?.[0];
    if (!result) return null;

    const meta = result.meta;
    const closes = result.indicators?.quote?.[0]?.close || [];
    const currentPrice =
      closes.filter((c: number | null) => c !== null).pop() ?? meta.regularMarketPrice;

    const exchangeName = (meta.exchangeName || meta.fullExchangeName || '').toUpperCase();
    const market: StockFundamentalData['market'] = exchangeName.includes('NAS')
      ? 'NASDAQ'
      : 'NYSE';

    return {
      ticker,
      name: meta.shortName || meta.longName || ticker,
      market,
      per: null,
      pbr: null,
      dividendYield: null,
      eps: null,
      bps: null,
      dps: null,
      currentPrice: currentPrice ? Number(Number(currentPrice).toFixed(2)) : null,
      marketCap: null,
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Yahoo Finance error:', error);
    return null;
  }
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
    const totalInfos = data.totalInfos || [];

    // 숫자 파싱 (배, %, 원, 억 등 단위 제거)
    const parseNum = (val: string | null | undefined): number | null => {
      if (!val || val === '-') return null;
      // "19.22배" -> 19.22, "0.43%" -> 0.43, "1,130원" -> 1130
      const cleaned = val.replace(/[배%원억조백만,\s]/g, '');
      const num = parseFloat(cleaned);
      return isNaN(num) ? null : num;
    };

    // code로 값 찾기
    const findValue = (code: string): string | null => {
      const item = totalInfos.find((i: { code: string }) => i.code === code);
      return item?.value || null;
    };

    return {
      per: parseNum(findValue('per')),
      pbr: parseNum(findValue('pbr')),
      dividendYield: parseNum(findValue('dividendYieldRatio')),
      eps: parseNum(findValue('eps')),
      bps: parseNum(findValue('bps')),
      dps: parseNum(findValue('dividend')),
      currentPrice: parseNum(findValue('closePrice') || data.closePrice),
      marketCap: parseNum(findValue('marketValue')),
    };
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

  // 미국 종목 감지: 알파벳으로만 구성 (1-5자)
  const isUSTicker = /^[A-Za-z.]{1,6}$/.test(ticker.trim());

  if (isUSTicker) {
    // --- US Stock: Yahoo Finance ---
    try {
      const usData = await fetchYahooStock(ticker.toUpperCase());
      if (!usData) {
        res.status(404).json({ error: 'US stock not found', ticker: ticker.toUpperCase() });
        return;
      }
      res.status(200).json(usData);
    } catch (error) {
      console.error('Yahoo Finance API Error:', error);
      res.status(500).json({
        error: 'Failed to fetch US stock data',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
    return;
  }

  // --- KR Stock: 기존 네이버 로직 ---
  // 6자리 종목코드 정규화
  const normalizedTicker = ticker.padStart(6, '0');

  try {
    // 네이버 금융 integration API에서 모든 정보 조회
    const investInfo = await fetchNaverInvestmentInfo(normalizedTicker);

    // 기본 정보도 조회 (종목명, 시장 등)
    const basicData = await fetchNaverStock(normalizedTicker);

    if (!basicData && Object.keys(investInfo).length === 0) {
      res.status(404).json({ error: 'Stock not found', ticker: normalizedTicker });
      return;
    }

    // 데이터 병합 (integration API 우선)
    const data: StockFundamentalData = {
      ticker: normalizedTicker,
      name: basicData?.name || '',
      market: basicData?.market || 'KOSPI',
      per: investInfo.per ?? basicData?.per ?? null,
      pbr: investInfo.pbr ?? basicData?.pbr ?? null,
      dividendYield: investInfo.dividendYield ?? basicData?.dividendYield ?? null,
      eps: investInfo.eps ?? basicData?.eps ?? null,
      bps: investInfo.bps ?? basicData?.bps ?? null,
      dps: investInfo.dps ?? basicData?.dps ?? null,
      currentPrice: investInfo.currentPrice ?? basicData?.currentPrice ?? null,
      marketCap: investInfo.marketCap ?? basicData?.marketCap ?? null,
      fetchedAt: new Date().toISOString(),
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
