// ============================================
// Fundamental Grade Scoring Engine (Korea Tech-Value Mix 2026)
// 100점 만점 펀더멘털 평가 시스템
// ============================================

import type {
  FundamentalCategoryScores,
  FundamentalGrade,
  FundamentalInput,
  FundamentalResult,
  FundamentalScores,
  GlobalScalability,
  MarketDominance,
  FutureInvestment,
  TotalShareholderReturn,
  GovernanceRisk
} from '@/types';

// Grade 설정 - centralized config 참조 (등급 임계값 변경 필요 시 constants도 확인 필요)
// S등급(85점 초과) 추가로 인해 로직 내 하드코딩된 기준 변경
const GRADE_THRESHOLDS = {
  S: 85,
  A: 70,
  B: 50,
  C: 0
};

const ACTION_GUIDELINES = {
  S: 'Global Top Pick. 밸류에이션, 성장성, 주주환원의 완벽한 조화. Zone 3 진입 시 적극 매수(Strength 2.0 권장).',
  A: '매수 (Buy). 글로벌 확장성이 뛰어난 성장 우량주. 포트폴리오 편입 권장(Strength 1.0~2.0).',
  B: '관망/보유 (Hold). 내수 한계가 있거나 환원이 부족함. Zone 3 중반 이후 분할 매수 고려.',
  C: '매수 금지 (Avoid). 성장성도 없고 주주환원도 없음. 투자 대상 제외.',
  D: '매수 금지 (Avoid). 투자 대상 제외.', // Legacy support
};

// ==========================================
// 1. Valuation (35 pts)
// ==========================================

/**
 * PER 점수 계산 (15점 만점) - Tech 기업 용인
 */
function calculatePERScore(per: number | null): number {
  if (per === null || per <= 0) return 4; // 적자 등
  if (per < 10) return 15;
  if (per < 20) return 12;
  if (per < 30) return 8;
  return 4; // 30배 이상
}

/**
 * PBR 점수 계산 (15점 만점) - 무형자산 고려
 */
function calculatePBRScore(pbr: number | null): number {
  if (pbr === null || pbr <= 0) return 4;
  if (pbr < 0.8) return 15;
  if (pbr < 1.5) return 12;
  if (pbr < 2.5) return 8;
  return 4; // 2.5배 이상
}

/**
 * 이중 상장/지배구조 점수 (5점 만점)
 */
function calculateDualListingScore(isDualListed: boolean): number {
  // Input에서 boolean으로 받지만, 실제로는 3단계 평가가 필요함.
  // 현재 UI 구조상 boolean이므로, true=중복상장(0점), false=단독(5점)으로 처리하되,
  // 추후 UI 개선 시 3단계를 지원하도록 확장성 고려.
  // 여기서는 '핵심 중복 상장'일 경우 true로 간주하여 0점 부여.
  return isDualListed ? 0 : 5;
}

// ==========================================
// 2. Growth & Moat (40 pts)
// ==========================================

function calculateScalabilityScore(val: GlobalScalability | null): number {
  if (val === null) return 0;
  switch (val) {
    case 'high_growth': return 20;
    case 'expanding': return 12;
    case 'domestic_regulated': return 5;
    default: return 0;
  }
}

function calculateDominanceScore(val: MarketDominance | null): number {
  if (val === null) return 0;
  switch (val) {
    case 'monopoly_top': return 10;
    case 'oligopoly_top3': return 7;
    case 'competitive': return 3;
    default: return 0;
  }
}

function calculateInvestmentScore(val: FutureInvestment | null): number {
  if (val === null) return 0;
  switch (val) {
    case 'high': return 10;
    case 'maintain': return 5;
    case 'decreasing': return 0;
    default: return 0;
  }
}

// ==========================================
// 3. Shareholder Return (25 pts)
// ==========================================

function calculateTSRScore(val: TotalShareholderReturn | null): number {
  if (val === null) return 0;
  switch (val) {
    case 'active_growth': return 15;
    case 'high_yield': return 10;
    case 'minimum': return 5;
    case 'none': return 0;
    default: return 0;
  }
}

function calculateGovernanceScore(val: GovernanceRisk | null): number {
  if (val === null) return 0;
  switch (val) {
    case 'clean': return 10;
    case 'shareholder_friendly': return 7;
    case 'defense_doubt': return 3;
    default: return 0;
  }
}

/**
 * Grade 판정
 */
function determineGrade(totalScore: number): FundamentalGrade {
  if (totalScore > GRADE_THRESHOLDS.S) return 'S';
  if (totalScore >= GRADE_THRESHOLDS.A) return 'A';
  if (totalScore >= GRADE_THRESHOLDS.B) return 'B';
  return 'C';
}

/**
 * Fundamental Score 계산 (메인 함수)
 */
export function calculateFundamentalScore(input: FundamentalInput): FundamentalResult {
  // 개별 점수 계산
  const scores: FundamentalScores = {
    // Valuation
    per: calculatePERScore(input.per),
    pbr: calculatePBRScore(input.pbr),
    dualListing: calculateDualListingScore(input.isDualListed),

    // Growth
    globalScalability: calculateScalabilityScore(input.globalScalability),
    marketDominance: calculateDominanceScore(input.marketDominance),
    futureInvestment: calculateInvestmentScore(input.futureInvestment),

    // Shareholder
    totalShareholderReturn: calculateTSRScore(input.totalShareholderReturn),
    governanceRisk: calculateGovernanceScore(input.governanceRisk),
  };

  // 카테고리별 소계
  const categoryScores: FundamentalCategoryScores = {
    valuation: scores.per + scores.pbr + scores.dualListing, // Max 35
    growthMoat: scores.globalScalability + scores.marketDominance + scores.futureInvestment, // Max 40
    shareholderReturn: scores.totalShareholderReturn + scores.governanceRisk, // Max 25
  };

  // 총점
  const totalScore =
    categoryScores.valuation + categoryScores.growthMoat + categoryScores.shareholderReturn;

  // Grade 판정
  const grade = determineGrade(totalScore);

  // Color Mapping
  const gradeColorMap: Record<FundamentalGrade, string> = {
    S: 'rgb(99, 102, 241)', // Indigo
    A: 'rgb(34, 197, 94)',  // Green
    B: 'rgb(59, 130, 246)', // Blue
    C: 'rgb(239, 68, 68)',  // Red
    D: 'rgb(107, 114, 128)' // Gray
  };

  return {
    scores,
    categoryScores,
    totalScore,
    grade,
    gradeLabel: `Grade ${grade}`,
    gradeColor: gradeColorMap[grade],
    actionGuideline: ACTION_GUIDELINES[grade],
  };
}

/**
 * Grade 색상 가져오기 helper (legacy - for inline styles)
 */
export function getGradeColor(grade: FundamentalGrade): string {
  const map: Record<FundamentalGrade, string> = {
    S: 'rgb(99, 102, 241)',
    A: 'rgb(34, 197, 94)',
    B: 'rgb(59, 130, 246)',
    C: 'rgb(239, 68, 68)',
    D: 'rgb(107, 114, 128)'
  };
  return map[grade] || map.D;
}

/**
 * Grade Badge CSS 클래스 반환 (index.css의 .grade-badge-* 사용)
 */
export function getGradeBadgeClass(grade: FundamentalGrade): string {
  const map: Record<FundamentalGrade, string> = {
    S: 'grade-badge-s',
    A: 'grade-badge-a',
    B: 'grade-badge-b',
    C: 'grade-badge-c',
    D: 'grade-badge-d',
  };
  return map[grade] || map.D;
}

/**
 * Grade Card Border CSS 클래스 반환 (index.css의 .grade-card-* 사용)
 */
export function getGradeCardClass(grade: FundamentalGrade): string {
  const map: Record<FundamentalGrade, string> = {
    S: 'grade-card-s',
    A: 'grade-card-a',
    B: 'grade-card-b',
    C: 'grade-card-c',
    D: 'grade-card-d',
  };
  return map[grade] || map.D;
}
