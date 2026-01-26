// ============================================
// Format Utilities Tests
// ============================================

import { describe, expect, it } from 'vitest';
import {
  formatCompact,
  formatCurrency,
  formatDropRate,
  formatNumber,
  formatPercent,
  parseFormattedNumber,
} from './format';

describe('formatNumber', () => {
  it('formats numbers with thousands separators', () => {
    expect(formatNumber(1000)).toBe('1,000');
    expect(formatNumber(1000000)).toBe('1,000,000');
    expect(formatNumber(123456789)).toBe('123,456,789');
  });

  it('handles zero', () => {
    expect(formatNumber(0)).toBe('0');
  });

  it('handles negative numbers', () => {
    expect(formatNumber(-1000)).toBe('-1,000');
  });
});

describe('formatCurrency', () => {
  it('formats currency in Korean won', () => {
    expect(formatCurrency(1000)).toBe('1,000원');
    expect(formatCurrency(50000)).toBe('50,000원');
  });
});

describe('formatPercent', () => {
  it('formats percentages with sign and one decimal place', () => {
    expect(formatPercent(50)).toBe('+50.0%');
    expect(formatPercent(33.333)).toBe('+33.3%');
  });

  it('handles zero with positive sign', () => {
    expect(formatPercent(0)).toBe('+0.0%');
  });

  it('handles negative numbers', () => {
    expect(formatPercent(-25.5)).toBe('-25.5%');
  });
});

describe('formatDropRate', () => {
  it('formats drop rate with negative sign', () => {
    expect(formatDropRate(10)).toBe('-10.0%');
    expect(formatDropRate(13.5)).toBe('-13.5%');
  });
});

describe('formatCompact', () => {
  it('formats numbers in compact form with English abbreviations', () => {
    expect(formatCompact(1000)).toBe('1.0K');
    expect(formatCompact(1500)).toBe('1.5K');
    expect(formatCompact(1000000)).toBe('1.0M');
    expect(formatCompact(1500000000)).toBe('1.5B');
  });

  it('handles small numbers without abbreviation', () => {
    expect(formatCompact(100)).toBe('100');
    expect(formatCompact(999)).toBe('999');
  });
});

describe('parseFormattedNumber', () => {
  it('parses formatted numbers back to integers', () => {
    expect(parseFormattedNumber('1,000')).toBe(1000);
    expect(parseFormattedNumber('1,000,000')).toBe(1000000);
  });

  it('handles plain numbers', () => {
    expect(parseFormattedNumber('1000')).toBe(1000);
  });

  it('handles empty strings', () => {
    expect(parseFormattedNumber('')).toBe(0);
  });

  it('handles null and undefined', () => {
    expect(parseFormattedNumber(null)).toBe(0);
    expect(parseFormattedNumber(undefined)).toBe(0);
  });
});
