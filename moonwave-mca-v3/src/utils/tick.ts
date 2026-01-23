// ============================================
// Stock Price Tick (호가 단위) Utilities
// ============================================

/**
 * Get the tick size (호가 단위) based on price
 * Korean stock market tick rules
 */
export function getTickSize(price: number): number {
  if (price < 2_000) return 1;
  if (price < 5_000) return 5;
  if (price < 20_000) return 10;
  if (price < 50_000) return 50;
  if (price < 200_000) return 100;
  if (price < 500_000) return 500;
  return 1_000;
}

/**
 * Round price to nearest tick
 */
export function roundToTick(price: number): number {
  const tick = getTickSize(price);
  return Math.floor(price / tick) * tick;
}

/**
 * Round price up to nearest tick
 */
export function ceilToTick(price: number): number {
  const tick = getTickSize(price);
  return Math.ceil(price / tick) * tick;
}

/**
 * Calculate buy price from peak price and drop rate
 */
export function calculateBuyPrice(peakPrice: number, dropRate: number): number {
  const rawPrice = peakPrice * (1 - dropRate / 100);
  return roundToTick(rawPrice);
}

/**
 * Calculate quantity based on strength and step
 * Uses exponential formula: strength * e^(step/3)
 */
export function calculateQuantity(strength: number, step: number): number {
  const qty = Math.trunc(strength * Math.exp(step / 3));
  return Math.max(qty, 1);
}
