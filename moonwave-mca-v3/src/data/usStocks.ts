// ============================================
// Built-in US Stock List
// 다우 30 + 나스닥/NYSE 주요 종목
// ============================================

export interface USStock {
  ticker: string;
  name: string;
  market: 'NYSE' | 'NASDAQ';
}

export const US_STOCKS: USStock[] = [
  // Dow Jones 30
  { ticker: 'AAPL', name: 'Apple Inc.', market: 'NASDAQ' },
  { ticker: 'MSFT', name: 'Microsoft Corp.', market: 'NASDAQ' },
  { ticker: 'AMZN', name: 'Amazon.com Inc.', market: 'NASDAQ' },
  { ticker: 'NVDA', name: 'NVIDIA Corp.', market: 'NASDAQ' },
  { ticker: 'JPM', name: 'JPMorgan Chase & Co.', market: 'NYSE' },
  { ticker: 'V', name: 'Visa Inc.', market: 'NYSE' },
  { ticker: 'UNH', name: 'UnitedHealth Group', market: 'NYSE' },
  { ticker: 'HD', name: 'Home Depot Inc.', market: 'NYSE' },
  { ticker: 'PG', name: 'Procter & Gamble', market: 'NYSE' },
  { ticker: 'JNJ', name: 'Johnson & Johnson', market: 'NYSE' },
  { ticker: 'CRM', name: 'Salesforce Inc.', market: 'NYSE' },
  { ticker: 'MRK', name: 'Merck & Co.', market: 'NYSE' },
  { ticker: 'CVX', name: 'Chevron Corp.', market: 'NYSE' },
  { ticker: 'KO', name: 'Coca-Cola Co.', market: 'NYSE' },
  { ticker: 'CSCO', name: 'Cisco Systems', market: 'NASDAQ' },
  { ticker: 'MCD', name: "McDonald's Corp.", market: 'NYSE' },
  { ticker: 'AXP', name: 'American Express', market: 'NYSE' },
  { ticker: 'IBM', name: 'IBM Corp.', market: 'NYSE' },
  { ticker: 'GS', name: 'Goldman Sachs', market: 'NYSE' },
  { ticker: 'CAT', name: 'Caterpillar Inc.', market: 'NYSE' },
  { ticker: 'DIS', name: 'Walt Disney Co.', market: 'NYSE' },
  { ticker: 'BA', name: 'Boeing Co.', market: 'NYSE' },
  { ticker: 'NKE', name: 'Nike Inc.', market: 'NYSE' },
  { ticker: 'MMM', name: '3M Co.', market: 'NYSE' },
  { ticker: 'WMT', name: 'Walmart Inc.', market: 'NYSE' },
  { ticker: 'INTC', name: 'Intel Corp.', market: 'NASDAQ' },
  { ticker: 'VZ', name: 'Verizon Communications', market: 'NYSE' },
  { ticker: 'DOW', name: 'Dow Inc.', market: 'NYSE' },
  { ticker: 'SHW', name: 'Sherwin-Williams', market: 'NYSE' },
  { ticker: 'AMGN', name: 'Amgen Inc.', market: 'NASDAQ' },

  // NASDAQ Major
  { ticker: 'GOOGL', name: 'Alphabet Inc. (Class A)', market: 'NASDAQ' },
  { ticker: 'META', name: 'Meta Platforms', market: 'NASDAQ' },
  { ticker: 'TSLA', name: 'Tesla Inc.', market: 'NASDAQ' },
  { ticker: 'NFLX', name: 'Netflix Inc.', market: 'NASDAQ' },
  { ticker: 'AMD', name: 'Advanced Micro Devices', market: 'NASDAQ' },
  { ticker: 'AVGO', name: 'Broadcom Inc.', market: 'NASDAQ' },
  { ticker: 'COST', name: 'Costco Wholesale', market: 'NASDAQ' },
  { ticker: 'ADBE', name: 'Adobe Inc.', market: 'NASDAQ' },
  { ticker: 'PEP', name: 'PepsiCo Inc.', market: 'NASDAQ' },
  { ticker: 'QCOM', name: 'Qualcomm Inc.', market: 'NASDAQ' },
  { ticker: 'TMUS', name: 'T-Mobile US', market: 'NASDAQ' },
  { ticker: 'AMAT', name: 'Applied Materials', market: 'NASDAQ' },
  { ticker: 'INTU', name: 'Intuit Inc.', market: 'NASDAQ' },
  { ticker: 'ISRG', name: 'Intuitive Surgical', market: 'NASDAQ' },
  { ticker: 'BKNG', name: 'Booking Holdings', market: 'NASDAQ' },
  { ticker: 'TXN', name: 'Texas Instruments', market: 'NASDAQ' },
  { ticker: 'LRCX', name: 'Lam Research', market: 'NASDAQ' },
  { ticker: 'KLAC', name: 'KLA Corp.', market: 'NASDAQ' },
  { ticker: 'PANW', name: 'Palo Alto Networks', market: 'NASDAQ' },
  { ticker: 'MRVL', name: 'Marvell Technology', market: 'NASDAQ' },
  { ticker: 'SNPS', name: 'Synopsys Inc.', market: 'NASDAQ' },
  { ticker: 'CDNS', name: 'Cadence Design Systems', market: 'NASDAQ' },
  { ticker: 'MU', name: 'Micron Technology', market: 'NASDAQ' },
  { ticker: 'PYPL', name: 'PayPal Holdings', market: 'NASDAQ' },

  // NYSE Major (non-Dow)
  { ticker: 'BRK.B', name: 'Berkshire Hathaway B', market: 'NYSE' },
  { ticker: 'LLY', name: 'Eli Lilly & Co.', market: 'NYSE' },
  { ticker: 'ABBV', name: 'AbbVie Inc.', market: 'NYSE' },
  { ticker: 'TMO', name: 'Thermo Fisher Scientific', market: 'NYSE' },
  { ticker: 'ABT', name: 'Abbott Laboratories', market: 'NYSE' },
  { ticker: 'DHR', name: 'Danaher Corp.', market: 'NYSE' },
  { ticker: 'PFE', name: 'Pfizer Inc.', market: 'NYSE' },
  { ticker: 'XOM', name: 'Exxon Mobil Corp.', market: 'NYSE' },
  { ticker: 'T', name: 'AT&T Inc.', market: 'NYSE' },
  { ticker: 'NEE', name: 'NextEra Energy', market: 'NYSE' },
  { ticker: 'SPGI', name: 'S&P Global Inc.', market: 'NYSE' },
  { ticker: 'LOW', name: "Lowe's Companies", market: 'NYSE' },
  { ticker: 'UPS', name: 'United Parcel Service', market: 'NYSE' },
  { ticker: 'BLK', name: 'BlackRock Inc.', market: 'NYSE' },
  { ticker: 'DE', name: 'Deere & Company', market: 'NYSE' },
];
