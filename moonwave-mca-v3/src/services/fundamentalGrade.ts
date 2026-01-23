// ============================================
// Fundamental Grade Scoring Engine
// 100점 만점 펀더멘털 평가 시스템
// ============================================

import type {
  FundamentalInput,
  FundamentalResult,
  FundamentalScores,
  FundamentalCategoryScores,
  FundamentalGrade,
  FundamentalData,
} from '@/types';
import { FUNDAMENTAL_GRADE_CONFIG } from '@/utils/constants';

// Grade 설정 - centralized config 참조
const GRADE_CONFIG = FUNDAMENTAL_GRADE_CONFIG.GRADES;

const ACTION_GUIDELINES = {
  A: 'Step 4(기술적 분석)로 무조건 진행. Zone 3/4 진입 시 MCA/DCA 가동. 포트폴리오 핵심 종목으로 편입(10-20%).',
  B: 'Step 4 진행. 멀티플 1.2 이하 시 적극 고려. 포트폴리오 편입 권장(5-10%).',
  C: 'Step 4 진행 가능. 멀티플 1.0 이하 + Zone 3 한정 + 소량 매수. 기존 보유자 홀딩 가능.',
  D: '[경고] 어떤 조건에서도 매수 불가. 기존 보유 시 매도 또는 교체 권고. 차트가 아무리 좋아도 매수 금지.',
};

/**
 * PER 점수 계산 (20점 만점)
 */
function calculatePERScore(per: number | null): number {
  if (per === null || per <= 0) return 5; // 적자 또는 데이터 없음
  if (per < 5) return 20;   // 극도로 저평가
  if (per < 8) return 15;   // 저평가
  if (per < 10) return 10;  // 적정 수준
  return 5;                  // 고평가 경계
}

/**
 * PBR 점수 계산 (5점 만점)
 */
function calculatePBRScore(pbr: number | null): number {
  if (pbr === null || pbr <= 0) return 0;
  if (pbr < 0.3) return 5;  // 극도로 저평가
  if (pbr < 0.6) return 4;  // 저평가
  if (pbr < 1.0) return 3;  // 적정 수준
  return 0;                  // 고평가
}

/**
 * 배당수익률 점수 계산 (10점 만점)
 */
function calculateDividendYieldScore(yield_: number | null): number {
  if (yield_ === null || yield_ <= 0) return 2;
  if (yield_ > 7) return 10;  // 고배당
  if (yield_ > 5) return 7;   // 우수
  if (yield_ > 3) return 5;   // 양호
  return 2;                    // 미흡
}

/**
 * 배당 연속 인상 점수 계산 (5점 만점)
 */
function calculateConsecutiveDividendScore(years: number): number {
  if (years >= 10) return 5;  // 배당 귀족
  if (years >= 5) return 4;   // 우수
  if (years >= 3) return 3;   // 양호
  return 0;                    // 미흡
}

/**
 * 연간 소각 비율 점수 계산 (8점 만점)
 */
function calculateCancellationRateScore(rate: number): number {
  if (rate > 2) return 8;     // 공격적 소각
  if (rate > 1.5) return 5;   // 우수
  if (rate > 0.5) return 3;   // 양호
  return 0;                    // 미흡
}

/**
 * 자사주 보유 비율 점수 계산 (5점 만점) - 낮을수록 좋음
 */
function calculateTreasuryStockScore(ratio: number): number {
  if (ratio === 0) return 5;  // 전량 소각 (최우수)
  if (ratio < 2) return 4;    // 우수
  if (ratio < 5) return 2;    // 양호
  return 0;                    // 미흡
}

/**
 * 성장 잠재력 점수 계산 (10점 만점)
 */
function calculateGrowthScore(potential: FundamentalInput['growthPotential']): number {
  switch (potential) {
    case 'very_high': return 10;
    case 'high': return 7;
    case 'normal': return 5;
    case 'low': return 3;
    default: return 5;
  }
}

/**
 * 경영진 점수 계산 (10점 만점)
 */
function calculateManagementScore(quality: FundamentalInput['managementQuality']): number {
  switch (quality) {
    case 'excellent': return 10;
    case 'professional': return 5;
    case 'owner_risk': return 0;
    default: return 5;
  }
}

/**
 * Grade 판정
 */
function determineGrade(totalScore: number): FundamentalGrade {
  if (totalScore >= GRADE_CONFIG.A.min) return 'A';
  if (totalScore >= GRADE_CONFIG.B.min) return 'B';
  if (totalScore >= GRADE_CONFIG.C.min) return 'C';
  return 'D';
}

/**
 * Fundamental Score 계산 (메인 함수)
 */
export function calculateFundamentalScore(input: FundamentalInput): FundamentalResult {
  // 개별 점수 계산
  const scores: FundamentalScores = {
    per: calculatePERScore(input.per),
    pbr: calculatePBRScore(input.pbr),
    earningsSustainability: input.earningsSustainability ? 5 : 0,
    dualListing: input.isDualListed ? 0 : 5,
    dividendYield: calculateDividendYieldScore(input.dividendYield),
    quarterlyDividend: input.hasQuarterlyDividend ? 5 : 0,
    consecutiveDividend: calculateConsecutiveDividendScore(input.consecutiveDividendYears),
    buybackProgram: input.hasBuybackProgram ? 7 : 0,
    cancellationRate: calculateCancellationRateScore(input.annualCancellationRate),
    treasuryStockRatio: calculateTreasuryStockScore(input.treasuryStockRatio),
    growthPotential: calculateGrowthScore(input.growthPotential),
    management: calculateManagementScore(input.managementQuality),
    globalBrand: input.hasGlobalBrand ? 5 : 0,
  };

  // 카테고리별 소계
  const categoryScores: FundamentalCategoryScores = {
    valuation: scores.per + scores.pbr + scores.earningsSustainability + scores.dualListing,
    shareholderReturn:
      scores.dividendYield +
      scores.quarterlyDividend +
      scores.consecutiveDividend +
      scores.buybackProgram +
      scores.cancellationRate +
      scores.treasuryStockRatio,
    growthManagement: scores.growthPotential + scores.management + scores.globalBrand,
  };

  // 총점
  const totalScore =
    categoryScores.valuation + categoryScores.shareholderReturn + categoryScores.growthManagement;

  // Grade 판정
  const grade = determineGrade(totalScore);

  return {
    scores,
    categoryScores,
    totalScore,
    grade,
    gradeLabel: GRADE_CONFIG[grade].label,
    gradeColor: GRADE_CONFIG[grade].color,
    actionGuideline: ACTION_GUIDELINES[grade],
  };
}

/**
 * 기본 Fundamental Input 생성
 */
export function createDefaultFundamentalInput(): FundamentalInput {
  return {
    per: null,
    pbr: null,
    earningsSustainability: true,
    isDualListed: false,
    dividendYield: null,
    hasQuarterlyDividend: false,
    consecutiveDividendYears: 0,
    hasBuybackProgram: false,
    annualCancellationRate: 0,
    treasuryStockRatio: 0,
    growthPotential: 'normal',
    managementQuality: 'professional',
    hasGlobalBrand: false,
  };
}

/**
 * FundamentalData 생성 (저장용)
 */
export function createFundamentalData(
  input: FundamentalInput,
  source: FundamentalData['dataSource'] = 'manual',
  notes?: string
): FundamentalData {
  return {
    ...input,
    dataSource: source,
    lastUpdated: new Date(),
    notes,
  };
}

/**
 * Grade 색상 가져오기
 */
export function getGradeColor(grade: FundamentalGrade): string {
  return GRADE_CONFIG[grade].color;
}

/**
 * Grade 라벨 가져오기
 */
export function getGradeLabel(grade: FundamentalGrade): string {
  return GRADE_CONFIG[grade].label;
}

/**
 * Grade 설명 가져오기
 */
export function getGradeDescription(grade: FundamentalGrade): string {
  const descriptions = {
    A: '적극 매수 권장',
    B: '매수 고려 가치',
    C: '신중한 접근 필요',
    D: '매수 비권장',
  };
  return descriptions[grade];
}

/**
 * Grade 배지 스타일 클래스
 */
export function getGradeBadgeClass(grade: FundamentalGrade): string {
  const classes = {
    A: 'bg-success-100 text-success-700 dark:bg-success-900/50 dark:text-success-300',
    B: 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300',
    C: 'bg-warning-100 text-warning-700 dark:bg-warning-900/50 dark:text-warning-300',
    D: 'bg-danger-100 text-danger-700 dark:bg-danger-900/50 dark:text-danger-300',
  };
  return classes[grade];
}

/**
 * 점수 범위 검증
 */
export function validateFundamentalInput(input: Partial<FundamentalInput>): string[] {
  const errors: string[] = [];

  if (input.per !== null && input.per !== undefined && input.per < 0) {
    errors.push('PER은 0 이상이어야 합니다');
  }

  if (input.pbr !== null && input.pbr !== undefined && input.pbr < 0) {
    errors.push('PBR은 0 이상이어야 합니다');
  }

  if (input.dividendYield !== null && input.dividendYield !== undefined) {
    if (input.dividendYield < 0 || input.dividendYield > 100) {
      errors.push('배당수익률은 0-100% 범위여야 합니다');
    }
  }

  if (input.consecutiveDividendYears !== undefined && input.consecutiveDividendYears < 0) {
    errors.push('배당 연속 인상 연수는 0 이상이어야 합니다');
  }

  if (input.annualCancellationRate !== undefined) {
    if (input.annualCancellationRate < 0 || input.annualCancellationRate > 100) {
      errors.push('연간 소각 비율은 0-100% 범위여야 합니다');
    }
  }

  if (input.treasuryStockRatio !== undefined) {
    if (input.treasuryStockRatio < 0 || input.treasuryStockRatio > 100) {
      errors.push('자사주 보유 비율은 0-100% 범위여야 합니다');
    }
  }

  return errors;
}

/**
 * 점수 요약 텍스트 생성
 */
export function generateScoreSummary(result: FundamentalResult): string {
  const lines = [
    `[SCORE] Fundamental Grade: ${result.grade} (${result.totalScore}점)`,
    ``,
    `▸ 밸류에이션: ${result.categoryScores.valuation}/35점`,
    `▸ 주주환원: ${result.categoryScores.shareholderReturn}/40점`,
    `▸ 성장/경영: ${result.categoryScores.growthManagement}/25점`,
    ``,
    `[TIP] ${result.gradeLabel}`,
    result.actionGuideline,
  ];

  return lines.join('\n');
}
