// ============================================
// Vercel API Route: Stock Search
// 네이버 금융 종목 검색 API
// ============================================

import type { VercelRequest, VercelResponse } from '@vercel/node';

export interface StockSearchResult {
  ticker: string;
  name: string;
  market: 'KOSPI' | 'KOSDAQ';
}

// 네이버 금융 자동완성 API
async function searchNaverStocks(query: string, limit: number): Promise<StockSearchResult[]> {
  // 네이버 API는 URL 인코딩된 한글을 제대로 처리 못함 - 인코딩 없이 전송
  const url = `https://m.stock.naver.com/api/json/search/searchListJson.nhn?keyword=${query}`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const results: StockSearchResult[] = [];

    // 국내 주식만 필터링
    const stocks = data.result?.d || [];

    for (const item of stocks) {
      if (results.length >= limit) break;

      // 국내 주식만 (cd가 6자리 숫자)
      if (item.cd && /^\d{6}$/.test(item.cd)) {
        results.push({
          ticker: item.cd,
          name: item.nm || '',
          market: item.mt === 'KOSDAQ' ? 'KOSDAQ' : 'KOSPI',
        });
      }
    }

    return results;
  } catch {
    return [];
  }
}

// 대체: 네이버 통합검색 API
async function searchNaverStocksAlt(query: string, limit: number): Promise<StockSearchResult[]> {
  const url = `https://m.stock.naver.com/api/search/all?query=${query}`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const results: StockSearchResult[] = [];

    // 국내 주식 결과
    const stocks = data.result?.stocks || data.stocks || [];

    for (const item of stocks) {
      if (results.length >= limit) break;

      // 국내 주식만 (itemCode가 6자리 숫자)
      const code = item.itemCode || item.code || item.stockCode;
      if (code && /^\d{6}$/.test(code)) {
        results.push({
          ticker: code,
          name: item.stockName || item.name || '',
          market: item.marketName?.includes('코스닥') ? 'KOSDAQ' : 'KOSPI',
        });
      }
    }

    return results;
  } catch {
    return [];
  }
}

// 종목코드로 직접 조회 (6자리 숫자인 경우)
async function fetchStockByCode(ticker: string): Promise<StockSearchResult | null> {
  const url = `https://m.stock.naver.com/api/stock/${ticker}/basic`;

  try {
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

    if (data.stockName) {
      return {
        ticker,
        name: data.stockName,
        market: data.marketName?.includes('코스닥') ? 'KOSDAQ' : 'KOSPI',
      };
    }
  } catch {
    // 실패 시 null
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

  const { q, limit = '10' } = req.query;

  if (!q || typeof q !== 'string' || q.length < 1) {
    res.status(400).json({ error: 'Query parameter "q" is required (min 1 char)' });
    return;
  }

  try {
    const maxLimit = parseInt(limit as string, 10) || 10;
    let results: StockSearchResult[] = [];

    // 6자리 숫자면 직접 종목코드 조회
    const normalizedQuery = q.trim();
    if (/^\d{6}$/.test(normalizedQuery) || /^\d{1,5}$/.test(normalizedQuery)) {
      const ticker = normalizedQuery.padStart(6, '0');
      const directResult = await fetchStockByCode(ticker);
      if (directResult) {
        results = [directResult];
      }
    }

    // 직접 조회 결과가 없으면 검색
    if (results.length === 0) {
      results = await searchNaverStocks(normalizedQuery, maxLimit);
    }

    // 결과가 없으면 대체 API 시도
    if (results.length === 0) {
      results = await searchNaverStocksAlt(normalizedQuery, maxLimit);
    }

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
