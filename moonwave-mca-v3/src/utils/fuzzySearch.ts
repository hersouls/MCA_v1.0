// ============================================
// Fuzzy Search Utility
// Korean chosung + English fuzzy matching
// ============================================

// Korean Unicode ranges
const HANGUL_START = 0xac00;
const HANGUL_END = 0xd7a3;
const CHOSUNG_START = 0x3131;

// 초성 목록 (ㄱ ~ ㅎ, 19자)
const CHOSUNG_LIST = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ',
  'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
];

/** Extract chosung from a Korean character */
function getChosung(char: string): string {
  const code = char.charCodeAt(0);
  if (code >= HANGUL_START && code <= HANGUL_END) {
    const index = Math.floor((code - HANGUL_START) / 588);
    return CHOSUNG_LIST[index];
  }
  return char;
}

/** Extract all chosungs from a string */
function extractChosungs(str: string): string {
  return [...str].map(getChosung).join('');
}

/** Check if a string is entirely Korean chosung characters */
function isChosungOnly(str: string): boolean {
  return [...str].every((ch) => {
    const code = ch.charCodeAt(0);
    return (
      CHOSUNG_LIST.includes(ch) ||
      (code >= CHOSUNG_START && code <= 0x314e)
    );
  });
}

/** Calculate match score (higher = better match) */
function calculateScore(query: string, field: string): number {
  const lowerQuery = query.toLowerCase();
  const lowerField = field.toLowerCase();

  // Exact match
  if (lowerField === lowerQuery) return 100;

  // Starts with query
  if (lowerField.startsWith(lowerQuery)) return 90;

  // Contains query as substring
  const substringIndex = lowerField.indexOf(lowerQuery);
  if (substringIndex >= 0) return 80 - substringIndex;

  // Korean chosung matching
  if (isChosungOnly(query)) {
    const fieldChosungs = extractChosungs(lowerField);
    if (fieldChosungs.startsWith(query)) return 75;
    if (fieldChosungs.includes(query)) return 65;
  }

  // Word boundary match (e.g., "MS" matches "Microsoft")
  const words = lowerField.split(/[\s\-_&.()]+/);
  const initials = words.map((w) => w[0] || '').join('');
  if (initials.startsWith(lowerQuery)) return 60;

  return 0;
}

/**
 * Fuzzy search through a list of items.
 *
 * @param query - Search query string
 * @param items - Array of items to search through
 * @param getFields - Function that returns searchable field strings for each item
 * @param limit - Maximum number of results (default: 20)
 * @returns Matched items sorted by relevance
 */
export function fuzzySearch<T>(
  query: string,
  items: T[],
  getFields: (item: T) => string[],
  limit = 20,
): T[] {
  if (!query.trim()) return [];

  const normalizedQuery = query.trim();
  const scored: { item: T; score: number }[] = [];

  for (const item of items) {
    const fields = getFields(item);
    let bestScore = 0;

    for (const field of fields) {
      if (!field) continue;
      const score = calculateScore(normalizedQuery, field);
      if (score > bestScore) bestScore = score;
    }

    if (bestScore > 0) {
      scored.push({ item, score: bestScore });
    }
  }

  // Sort by score descending, then slice
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.item);
}
