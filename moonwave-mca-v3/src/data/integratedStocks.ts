import stockUniverse from './stockUniverse.json'
import { fuzzySearch } from '@/utils/fuzzySearch'

export interface IntegratedStock {
  code: string
  name: string
  market: string
  type: 'KR' | 'DJI' | 'NAS' | 'CRYPTO'
  logo: string
}

// Dow Jones Industrial Average (30 Constituents) - Updated 2024/2025
const DOW_STOCKS = [
  { code: 'MMM', name: '3M', market: 'NYSE' },
  { code: 'AXP', name: 'American Express', market: 'NYSE' },
  { code: 'AMGN', name: 'Amgen', market: 'NASDAQ' },
  { code: 'AMZN', name: 'Amazon', market: 'NASDAQ' },
  { code: 'AAPL', name: 'Apple', market: 'NASDAQ' },
  { code: 'BA', name: 'Boeing', market: 'NYSE' },
  { code: 'CAT', name: 'Caterpillar', market: 'NYSE' },
  { code: 'CVX', name: 'Chevron', market: 'NYSE' },
  { code: 'CSCO', name: 'Cisco Systems', market: 'NASDAQ' },
  { code: 'KO', name: 'Coca-Cola', market: 'NYSE' },
  { code: 'DIS', name: 'Disney', market: 'NYSE' },
  { code: 'GS', name: 'Goldman Sachs', market: 'NYSE' },
  { code: 'HD', name: 'Home Depot', market: 'NYSE' },
  { code: 'HON', name: 'Honeywell', market: 'NASDAQ' },
  { code: 'IBM', name: 'IBM', market: 'NYSE' },
  { code: 'JNJ', name: 'Johnson & Johnson', market: 'NYSE' },
  { code: 'JPM', name: 'JPMorgan Chase', market: 'NYSE' },
  { code: 'MCD', name: "McDonald's", market: 'NYSE' },
  { code: 'MRK', name: 'Merck', market: 'NYSE' },
  { code: 'MSFT', name: 'Microsoft', market: 'NASDAQ' },
  { code: 'NVDA', name: 'NVIDIA', market: 'NASDAQ' },
  { code: 'NKE', name: 'Nike', market: 'NYSE' },
  { code: 'PG', name: 'Procter & Gamble', market: 'NYSE' },
  { code: 'CRM', name: 'Salesforce', market: 'NYSE' },
  { code: 'SHW', name: 'Sherwin-Williams', market: 'NYSE' },
  { code: 'TRV', name: 'Travelers', market: 'NYSE' },
  { code: 'UNH', name: 'UnitedHealth', market: 'NYSE' },
  { code: 'VZ', name: 'Verizon', market: 'NYSE' },
  { code: 'V', name: 'Visa', market: 'NYSE' },
  { code: 'WMT', name: 'Walmart', market: 'NYSE' },
]

// Nasdaq 100 Top / Popular US Tech & Growth (Excluding Dow constituents)
const NASDAQ_STOCKS = [
  // ── 기존 등록 ──
  { code: 'TSLA', name: 'Tesla', market: 'NASDAQ' },
  { code: 'GOOGL', name: 'Alphabet (A)', market: 'NASDAQ' },
  { code: 'GOOG', name: 'Alphabet (C)', market: 'NASDAQ' },
  { code: 'META', name: 'Meta Platforms', market: 'NASDAQ' },
  { code: 'NFLX', name: 'Netflix', market: 'NASDAQ' },
  { code: 'ADBE', name: 'Adobe', market: 'NASDAQ' },
  { code: 'AMD', name: 'AMD', market: 'NASDAQ' },
  { code: 'QCOM', name: 'Qualcomm', market: 'NASDAQ' },
  { code: 'PEP', name: 'PepsiCo', market: 'NASDAQ' },
  { code: 'COST', name: 'Costco', market: 'NASDAQ' },
  { code: 'AVGO', name: 'Broadcom', market: 'NASDAQ' },
  { code: 'TXN', name: 'Texas Instruments', market: 'NASDAQ' },
  { code: 'CMCSA', name: 'Comcast', market: 'NASDAQ' },
  { code: 'INTU', name: 'Intuit', market: 'NASDAQ' },
  { code: 'PYPL', name: 'PayPal', market: 'NASDAQ' },
  { code: 'SBUX', name: 'Starbucks', market: 'NASDAQ' },
  { code: 'MDLZ', name: 'Mondelez', market: 'NASDAQ' },
  { code: 'BKNG', name: 'Booking Holdings', market: 'NASDAQ' },
  { code: 'PLTR', name: 'Palantir', market: 'NYSE' },
  { code: 'UBER', name: 'Uber', market: 'NYSE' },
  { code: 'COIN', name: 'Coinbase', market: 'NASDAQ' },
  { code: 'INTC', name: 'Intel', market: 'NASDAQ' },

  // ── 반도체 / 하드웨어 ──
  { code: 'MRVL', name: 'Marvell Technology', market: 'NASDAQ' },
  { code: 'MU', name: 'Micron Technology', market: 'NASDAQ' },
  { code: 'LRCX', name: 'Lam Research', market: 'NASDAQ' },
  { code: 'KLAC', name: 'KLA Corporation', market: 'NASDAQ' },
  { code: 'AMAT', name: 'Applied Materials', market: 'NASDAQ' },
  { code: 'ASML', name: 'ASML Holdings', market: 'NASDAQ' },
  { code: 'ARM', name: 'ARM Holdings', market: 'NASDAQ' },
  { code: 'SMCI', name: 'Super Micro Computer', market: 'NASDAQ' },
  { code: 'ON', name: 'ON Semiconductor', market: 'NASDAQ' },
  { code: 'NXPI', name: 'NXP Semiconductors', market: 'NASDAQ' },
  { code: 'ADI', name: 'Analog Devices', market: 'NASDAQ' },
  { code: 'MCHP', name: 'Microchip Technology', market: 'NASDAQ' },
  { code: 'MPWR', name: 'Monolithic Power', market: 'NASDAQ' },
  { code: 'SWKS', name: 'Skyworks Solutions', market: 'NASDAQ' },
  { code: 'TSM', name: 'TSMC', market: 'NYSE' },

  // ── 소프트웨어 / SaaS / 클라우드 ──
  { code: 'PANW', name: 'Palo Alto Networks', market: 'NASDAQ' },
  { code: 'CRWD', name: 'CrowdStrike', market: 'NASDAQ' },
  { code: 'SNOW', name: 'Snowflake', market: 'NYSE' },
  { code: 'DDOG', name: 'Datadog', market: 'NASDAQ' },
  { code: 'ZS', name: 'Zscaler', market: 'NASDAQ' },
  { code: 'NET', name: 'Cloudflare', market: 'NYSE' },
  { code: 'FTNT', name: 'Fortinet', market: 'NASDAQ' },
  { code: 'WDAY', name: 'Workday', market: 'NASDAQ' },
  { code: 'TEAM', name: 'Atlassian', market: 'NASDAQ' },
  { code: 'OKTA', name: 'Okta', market: 'NASDAQ' },
  { code: 'VEEV', name: 'Veeva Systems', market: 'NYSE' },
  { code: 'SNPS', name: 'Synopsys', market: 'NASDAQ' },
  { code: 'CDNS', name: 'Cadence Design', market: 'NASDAQ' },
  { code: 'ANSS', name: 'Ansys', market: 'NASDAQ' },
  { code: 'DOCU', name: 'DocuSign', market: 'NASDAQ' },
  { code: 'ZM', name: 'Zoom Video', market: 'NASDAQ' },
  { code: 'TTD', name: 'The Trade Desk', market: 'NASDAQ' },
  { code: 'HUBS', name: 'HubSpot', market: 'NYSE' },
  { code: 'MDB', name: 'MongoDB', market: 'NASDAQ' },
  { code: 'BILL', name: 'BILL Holdings', market: 'NYSE' },
  { code: 'U', name: 'Unity Software', market: 'NYSE' },

  // ── 전자상거래 / 소비자 / 플랫폼 ──
  { code: 'ABNB', name: 'Airbnb', market: 'NASDAQ' },
  { code: 'RBLX', name: 'Roblox', market: 'NYSE' },
  { code: 'SHOP', name: 'Shopify', market: 'NYSE' },
  { code: 'DASH', name: 'DoorDash', market: 'NASDAQ' },
  { code: 'SNAP', name: 'Snap', market: 'NYSE' },
  { code: 'PINS', name: 'Pinterest', market: 'NYSE' },
  { code: 'ROKU', name: 'Roku', market: 'NASDAQ' },
  { code: 'SPOT', name: 'Spotify', market: 'NYSE' },
  { code: 'DUOL', name: 'Duolingo', market: 'NASDAQ' },
  { code: 'DKNG', name: 'DraftKings', market: 'NASDAQ' },
  { code: 'CPNG', name: 'Coupang', market: 'NYSE' },
  { code: 'MELI', name: 'MercadoLibre', market: 'NASDAQ' },
  { code: 'GRAB', name: 'Grab Holdings', market: 'NASDAQ' },
  { code: 'SE', name: 'Sea Limited', market: 'NYSE' },
  { code: 'MNST', name: 'Monster Beverage', market: 'NASDAQ' },
  { code: 'LULU', name: 'Lululemon', market: 'NASDAQ' },

  // ── 핀테크 / 금융 ──
  { code: 'SQ', name: 'Block (Square)', market: 'NYSE' },
  { code: 'SOFI', name: 'SoFi Technologies', market: 'NASDAQ' },
  { code: 'AFRM', name: 'Affirm', market: 'NASDAQ' },
  { code: 'HOOD', name: 'Robinhood', market: 'NASDAQ' },
  { code: 'NU', name: 'Nu Holdings', market: 'NYSE' },
  { code: 'MA', name: 'Mastercard', market: 'NYSE' },
  { code: 'SCHW', name: 'Charles Schwab', market: 'NYSE' },

  // ── 전기차 / 에너지 ──
  { code: 'RIVN', name: 'Rivian', market: 'NASDAQ' },
  { code: 'LCID', name: 'Lucid Group', market: 'NASDAQ' },
  { code: 'NIO', name: 'NIO', market: 'NYSE' },
  { code: 'XPEV', name: 'XPeng', market: 'NYSE' },
  { code: 'ENPH', name: 'Enphase Energy', market: 'NASDAQ' },
  { code: 'FSLR', name: 'First Solar', market: 'NASDAQ' },
  { code: 'CEG', name: 'Constellation Energy', market: 'NASDAQ' },

  // ── 바이오 / 헬스케어 ──
  { code: 'MRNA', name: 'Moderna', market: 'NASDAQ' },
  { code: 'REGN', name: 'Regeneron', market: 'NASDAQ' },
  { code: 'VRTX', name: 'Vertex Pharmaceuticals', market: 'NASDAQ' },
  { code: 'ISRG', name: 'Intuitive Surgical', market: 'NASDAQ' },
  { code: 'DXCM', name: 'DexCom', market: 'NASDAQ' },
  { code: 'ILMN', name: 'Illumina', market: 'NASDAQ' },
  { code: 'GILD', name: 'Gilead Sciences', market: 'NASDAQ' },
  { code: 'BIIB', name: 'Biogen', market: 'NASDAQ' },
  { code: 'AZN', name: 'AstraZeneca', market: 'NASDAQ' },

  // ── 통신 / 미디어 ──
  { code: 'TMUS', name: 'T-Mobile US', market: 'NASDAQ' },
  { code: 'CHTR', name: 'Charter Communications', market: 'NASDAQ' },
  { code: 'WBD', name: 'Warner Bros. Discovery', market: 'NASDAQ' },

  // ── 산업 / 기타 ──
  { code: 'ADP', name: 'ADP', market: 'NASDAQ' },
  { code: 'CPRT', name: 'Copart', market: 'NASDAQ' },
  { code: 'ODFL', name: 'Old Dominion Freight', market: 'NASDAQ' },
  { code: 'ORLY', name: "O'Reilly Automotive", market: 'NASDAQ' },
  { code: 'PCAR', name: 'PACCAR', market: 'NASDAQ' },
  { code: 'CSX', name: 'CSX Corporation', market: 'NASDAQ' },
  { code: 'CDW', name: 'CDW Corporation', market: 'NASDAQ' },
  { code: 'BRK-B', name: 'Berkshire Hathaway B', market: 'NYSE' },
  { code: 'LLY', name: 'Eli Lilly', market: 'NYSE' },
  { code: 'BABA', name: 'Alibaba', market: 'NYSE' },

  // ── 양자컴퓨팅 ──
  { code: 'QUBT', name: 'Quantum Computing', market: 'NASDAQ' },
  { code: 'IONQ', name: 'IonQ', market: 'NYSE' },
  { code: 'RGTI', name: 'Rigetti Computing', market: 'NASDAQ' },
  { code: 'QBTS', name: 'D-Wave Quantum', market: 'NYSE' },

  // ── REITs / 배당주 ──
  { code: 'O', name: 'Realty Income', market: 'NYSE' },
  { code: 'AMT', name: 'American Tower', market: 'NYSE' },
  { code: 'PLD', name: 'Prologis', market: 'NYSE' },
  { code: 'CCI', name: 'Crown Castle', market: 'NYSE' },
  { code: 'SPG', name: 'Simon Property Group', market: 'NYSE' },
  { code: 'EQIX', name: 'Equinix', market: 'NASDAQ' },
  { code: 'DLR', name: 'Digital Realty', market: 'NYSE' },

  // ── 디자인 / 생산성 소프트웨어 ──
  { code: 'FIGS', name: 'FIGS', market: 'NYSE' },
  { code: 'CANV', name: 'Cava Group', market: 'NYSE' },
  { code: 'ASAN', name: 'Asana', market: 'NYSE' },
  { code: 'MNDY', name: 'monday.com', market: 'NASDAQ' },
  { code: 'ESTC', name: 'Elastic', market: 'NYSE' },

  // ── AI / 로보틱스 ──
  { code: 'AI', name: 'C3.ai', market: 'NYSE' },
  { code: 'PATH', name: 'UiPath', market: 'NYSE' },
  { code: 'BBAI', name: 'BigBear.ai', market: 'NYSE' },
  { code: 'SOUN', name: 'SoundHound AI', market: 'NASDAQ' },
]

const CRYPTO_CURRENCIES = [
  { code: 'BTC', name: 'Bitcoin', market: 'CRYPTO' },
  { code: 'ETH', name: 'Ethereum', market: 'CRYPTO' },
]

// Helper to format data
const formatStock = (
  stock: { code: string; name: string; market: string },
  type: 'KR' | 'DJI' | 'NAS' | 'CRYPTO'
): IntegratedStock => {
  let logoUrl: string
  if (type === 'KR') {
    logoUrl = `/logos/${stock.code}.png`
  } else {
    // US & Crypto use Financial Modeling Prep
    logoUrl = `https://financialmodelingprep.com/image-stock/${stock.code}.png`
  }

  return {
    code: stock.code,
    name: stock.name,
    market: stock.market,
    type,
    logo: logoUrl,
  }
}

export const integratedStocks: IntegratedStock[] = [
  ...stockUniverse.map((s) => formatStock(s, 'KR')),
  ...DOW_STOCKS.map((s) => formatStock(s, 'DJI')),
  ...NASDAQ_STOCKS.map((s) => formatStock(s, 'NAS')),
  ...CRYPTO_CURRENCIES.map((s) => formatStock(s, 'CRYPTO')),
]

// Search function for integrated stocks (fuzzy search enabled)
export function searchIntegratedStocks(query: string): IntegratedStock[] {
  const normalizedQuery = query.trim()
  if (!normalizedQuery) return []

  return fuzzySearch(
    normalizedQuery,
    integratedStocks,
    (stock) => [stock.name, stock.code],
    20
  )
}

// Find by exact code
export function findStockByCode(code: string): IntegratedStock | undefined {
  const normalizedCode = code.toUpperCase().trim()
  return integratedStocks.find(
    (stock) => stock.code.toUpperCase() === normalizedCode
  )
}

export default integratedStocks
