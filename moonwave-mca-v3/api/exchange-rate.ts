// ============================================
// Vercel API Route: Exchange Rate Proxy
// open.er-api.com → KRW rate
// ============================================

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
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

  try {
    const response = await fetch('https://open.er-api.com/v6/latest/USD');
    if (!response.ok) throw new Error(`API error: ${response.status}`);

    const data = await response.json();
    const krwRate = data.rates?.KRW;

    if (!krwRate) throw new Error('KRW rate not found in response');

    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200');
    res.status(200).json({
      rate: krwRate,
      base: 'USD',
      target: 'KRW',
      timestamp: data.time_last_update_utc || new Date().toISOString(),
    });
  } catch (error) {
    console.error('Exchange rate API error:', error);
    res.status(500).json({
      error: 'Failed to fetch exchange rate',
      fallbackRate: 1400,
    });
  }
}
