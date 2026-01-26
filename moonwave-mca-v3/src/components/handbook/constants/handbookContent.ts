// ============================================
// Handbook Content Constants
// 핸드북 전역 상수 및 콘텐츠 정의
// ============================================

// ============================================
// Section Types & Relationships
// ============================================
export type SectionId = 'guide' | 'moonwave' | 'moonyou' | 'zigzag' | 'mip' | 'mca' | 'dca';

// ============================================
// Effort Level (Progressive Disclosure)
// ============================================
export type EffortLevel = 'low' | 'medium' | 'high';

interface EffortLevelConfig {
  id: EffortLevel;
  name: string;
  koreanName: string;
  description: string;
  icon: string;
}

const EFFORT_LEVELS: Record<EffortLevel, EffortLevelConfig> = {
  low: {
    id: 'low',
    name: 'Quick',
    koreanName: '빠른 보기',
    description: '핵심 요약 카드',
    icon: 'Zap',
  },
  medium: {
    id: 'medium',
    name: 'Standard',
    koreanName: '표준',
    description: '주요 본문과 테이블',
    icon: 'Book',
  },
  high: {
    id: 'high',
    name: 'Deep',
    koreanName: '심화',
    description: '전체 상세 및 수학적 원리',
    icon: 'GraduationCap',
  },
};

export const EFFORT_LEVEL_LIST = Object.values(EFFORT_LEVELS);

interface ConceptInfo {
  id: string;
  name: string;
  koreanName: string;
  iconName: string;
  targetSection: SectionId;
  summary: string;
}

export const CONCEPTS: Record<string, ConceptInfo> = {
  zone1: {
    id: 'zone1',
    name: 'Zone 1',
    koreanName: '상승 확정',
    iconName: 'TrendingUp',
    targetSection: 'zigzag',
    summary: '저점 +12% 이상, 추격 매수 자제',
  },
  zone2: {
    id: 'zone2',
    name: 'Zone 2',
    koreanName: '고점 근처',
    iconName: 'BarChart3',
    targetSection: 'zigzag',
    summary: '고점 ~ -12%, 관망',
  },
  zone3: {
    id: 'zone3',
    name: 'Zone 3',
    koreanName: '하락 진행',
    iconName: 'TrendingDown',
    targetSection: 'mca',
    summary: '고점 -12% 이상 하락, MCA 매집',
  },
  zone4: {
    id: 'zone4',
    name: 'Zone 4',
    koreanName: '반등 초기',
    iconName: 'Sprout',
    targetSection: 'dca',
    summary: '저점 ~ +12%, DCA 전환',
  },
  gradeA: {
    id: 'gradeA',
    name: 'Grade A',
    koreanName: '80점+',
    iconName: 'Star',
    targetSection: 'mip',
    summary: '적극 매수 권장',
  },
  gradeB: {
    id: 'gradeB',
    name: 'Grade B',
    koreanName: '65-79점',
    iconName: 'CheckCircle',
    targetSection: 'mip',
    summary: '매수 고려',
  },
  gradeC: {
    id: 'gradeC',
    name: 'Grade C',
    koreanName: '50-64점',
    iconName: 'AlertTriangle',
    targetSection: 'mip',
    summary: '신중 진입',
  },
  gradeD: {
    id: 'gradeD',
    name: 'Grade D',
    koreanName: '50점 미만',
    iconName: 'XCircle',
    targetSection: 'mip',
    summary: '매수 금지',
  },
  multiple: {
    id: 'multiple',
    name: '120월선 멀티플',
    koreanName: '밸류에이션',
    iconName: 'Calculator',
    targetSection: 'mip',
    summary: '현재가 / 120월선',
  },
};

interface SectionRelationship {
  prerequisites: SectionId[];
  relatedSections: SectionId[];
  nextSteps: SectionId[];
}

export const SECTION_RELATIONSHIPS: Record<SectionId, SectionRelationship> = {
  guide: { prerequisites: [], relatedSections: ['moonwave', 'mip'], nextSteps: ['mip', 'zigzag'] },
  moonwave: { prerequisites: [], relatedSections: ['moonyou'], nextSteps: ['mip'] },
  moonyou: { prerequisites: ['moonwave'], relatedSections: ['moonwave'], nextSteps: ['mip'] },
  mip: {
    prerequisites: ['moonwave'],
    relatedSections: ['zigzag'],
    nextSteps: ['zigzag', 'mca', 'dca'],
  },
  zigzag: { prerequisites: ['mip'], relatedSections: ['mca', 'dca'], nextSteps: ['mca', 'dca'] },
  mca: {
    prerequisites: ['mip', 'zigzag'],
    relatedSections: ['dca', 'guide'],
    nextSteps: ['guide'],
  },
  dca: {
    prerequisites: ['mip', 'zigzag'],
    relatedSections: ['mca', 'guide'],
    nextSteps: ['guide'],
  },
};

// ============================================
// Grade System (Fundamental Grade)
// ============================================
interface GradeInfo {
  id: string;
  name: string;
  iconName: string;
  score: { min: number; max: number };
  title: string;
  description: string;
  detailedDescription: string;
  criteria: string[];
  strengthRange: string;
  mcaApplicable: boolean;
  mcaNote: string;
  color: 'success' | 'info' | 'warning' | 'danger';
}

export const GRADES: Record<string, GradeInfo> = {
  S: {
    id: 'S',
    name: 'Grade S',
    iconName: 'Sparkles', // Star보다 강조된 아이콘 (Lucide)
    score: { min: 86, max: 100 },
    title: 'Global Top Pick',
    description: '밸류, 성장, 환원의 완벽한 조화',
    detailedDescription:
      '85점을 초과하는 최상위 등급입니다. 글로벌 확장성, 압도적 시장 지배력, 적극적인 주주환원 정책을 모두 갖춘 "Korea Tech-Value Mix"의 이상형입니다. 투자 강도(Strength) 2.0으로 적극적인 매집이 권장됩니다.',
    criteria: [
      '글로벌 High Growth 또는 압도적 1위',
      '적극적 주주환원 (소각+배당성장)',
      '미래 투자가 활발한 기업',
      '지배구조 리스크 없음 (Clean)',
    ],
    strengthRange: '1.5 ~ 2.0',
    mcaApplicable: true,
    mcaNote: '강력 권장 (Strength 2.0)',
    color: 'success', // Indigo 색상은 컴포넌트에서 매핑 처리 필요할 수 있음
  },
  A: {
    id: 'A',
    name: 'Grade A',
    iconName: 'Star',
    score: { min: 70, max: 85 },
    title: '매수 (Buy)',
    description: '글로벌 확장성이 뛰어난 성장 우량주',
    detailedDescription:
      '70~85점의 우량 종목입니다. S등급에 비해 일부 항목(환원 강도 등)이 부족하지만, 여전히 훌륭한 펀더멘털을 보유하고 있습니다. 포트폴리오의 허리 역할을 수행하며 표준적 투자(Strength 1.0)가 적합합니다.',
    criteria: [
      '글로벌 확장 진행 중',
      '양호한 주주환원 (고배당 등)',
      '준수한 시장 지배력 (Top 3)',
      '저평가된 밸류에이션 (PER/PBR)',
    ],
    strengthRange: '1.0 ~ 1.5',
    mcaApplicable: true,
    mcaNote: '권장 (Strength 1.0)',
    color: 'success',
  },
  B: {
    id: 'B',
    name: 'Grade B',
    iconName: 'CheckCircle',
    score: { min: 50, max: 69 },
    title: '보유/관망 (Hold)',
    description: '안정적이나 성장이 정체된 내수/배당주',
    detailedDescription:
      '50~69점의 "Hold" 등급입니다. 재무적으로는 안정적이나, 글로벌 확장성이 부족하거나(내수주), 주주환원이 소극적인 경우입니다. Zone 3 깊은 구간에서만 보수적으로 접근(Strength 0.5)하거나, 기존 보유분만 유지하는 것이 좋습니다.',
    criteria: [
      '내수 위주 또는 규제 산업',
      '배당은 주나 성장은 정체',
      '경쟁이 치열한 시장 환경',
      '120월선 평행 또는 완만한 상승',
    ],
    strengthRange: '0.5 ~ 1.0',
    mcaApplicable: true,
    mcaNote: '보수적 (Strength 0.5)',
    color: 'info',
  },
  C: {
    id: 'C',
    name: 'Grade C',
    iconName: 'XCircle',
    score: { min: 0, max: 49 },
    title: '매수 금지 (Avoid)',
    description: '성장성도 없고 주주환원도 부족함',
    detailedDescription:
      '50점 미만의 투자 부적격 등급입니다. 과거의 D등급을 통합하여, 기준에 미달하는 모든 종목을 포함합니다. "싸다"는 이유만으로 매수해서는 안 되며, 펀더멘털 개선이 확인될 때까지 관심 종목에서 제외하십시오.',
    criteria: [
      '성장 동력 상실 (투자 감소)',
      '주주환원 의지 박약',
      '지배구조 이슈 (핵심 중복 상장 등)',
      '역성장 또는 적자 지속',
    ],
    strengthRange: '-',
    mcaApplicable: false,
    mcaNote: '매수 절대 금지',
    color: 'danger',
  },
  // Legacy D Support (merged into C in logic, but kept in specific contexts if needed, here removed from UI list generally)
};

export const GRADE_LIST = Object.values(GRADES);

// ============================================
// Zone System (ZigZag Protocol)
// ============================================
interface ZoneInfo {
  id: number;
  name: string;
  iconName: string;
  title: string;
  range: string;
  description: string;
  detailedDescription: string;
  psychology: string;
  psychologyIcon: string;
  strategy: string;
  actionSteps: string[];
  mcaAction: string;
  dcaAction: string;
  sellAction: string;
  color: 'success' | 'info' | 'warning' | 'danger';
}

export const ZONES: Record<number, ZoneInfo> = {
  1: {
    id: 1,
    name: 'Zone 1',
    iconName: 'TrendingUp',
    title: '상승 확정 구간',
    range: '+12% 이상',
    description: '저점 대비 +12% 이상 반등한 상태',
    detailedDescription:
      '저점 대비 +12% 이상 반등하여 상승 추세가 확정된 구간입니다. 시장 심리는 탐욕 상태이며, 추격 매수는 자제해야 합니다. 120월선 멀티플이 2.0에 도달하면 분할 매도를 검토합니다.',
    psychology: '탐욕',
    psychologyIcon: 'DollarSign',
    strategy: '보유 유지, 추격 매수 자제',
    actionSteps: [
      '신규 매수 중단',
      '보유 종목 수익률 확인',
      '멀티플 2.0 이상 시 분할 매도 검토',
      'Zone 2 진입 시그널 모니터링',
    ],
    mcaAction: '종료',
    dcaAction: '종료',
    sellAction: '멀티플 확인 후 매도 검토',
    color: 'success',
  },
  2: {
    id: 2,
    name: 'Zone 2',
    iconName: 'BarChart3',
    title: '고점 근처 구간',
    range: '고점 ~ -12%',
    description: '고점에서 -12% 이내 범위',
    detailedDescription:
      '고점에서 -12% 이내의 범위로, 아직 본격적인 하락이 시작되지 않은 구간입니다. 불안 심리가 지배하며, 신규 매수를 자제하고 관망해야 합니다.',
    psychology: '불안',
    psychologyIcon: 'AlertCircle',
    strategy: '신규 매수 금지, 분할 매도 고려',
    actionSteps: [
      '신규 종목 진입 금지',
      '보유 종목 리밸런싱 검토',
      'Zone 3 진입 대비 예산 확보',
      '종목별 Fundamental 재점검',
    ],
    mcaAction: '대기',
    dcaAction: '대기',
    sellAction: '-',
    color: 'info',
  },
  3: {
    id: 3,
    name: 'Zone 3',
    iconName: 'TrendingDown',
    title: '하락 진행 구간',
    range: '-12% ~ 저점',
    description: '고점 대비 -12% 이상 하락 진행 중',
    detailedDescription:
      '고점 대비 -12% 이상 하락하여 MCA 매집을 실행하는 핵심 구간입니다. 공포 심리가 극대화되는 시점이지만, 이때가 바로 수학적으로 유리한 평단가를 만들 기회입니다. 피보나치-지수 공식에 따라 분할 매수를 실행합니다.',
    psychology: '공포',
    psychologyIcon: 'ShieldAlert',
    strategy: 'MCA 매집 실행',
    actionSteps: [
      'MCA 계획 실행 시작',
      '각 구간별 기계적 매수',
      '감정 개입 배제',
      '예산 범위 내 엄격 관리',
    ],
    mcaAction: '실행',
    dcaAction: '대기',
    sellAction: '-',
    color: 'warning',
  },
  4: {
    id: 4,
    name: 'Zone 4',
    iconName: 'Sprout',
    title: '반등 초기 구간',
    range: '저점 ~ +12%',
    description: '저점에서 반등하여 +12% 이내',
    detailedDescription:
      '저점에서 +12% 이내로 반등한 초기 구간입니다. 희망 심리가 싹트기 시작하며, MCA를 종료하고 DCA(정액 매수) 전략으로 전환합니다.',
    psychology: '희망',
    psychologyIcon: 'Smile',
    strategy: '관망 또는 DCA 시작',
    actionSteps: [
      'MCA 미완료 시 DCA 전환',
      '정액 매수 방식으로 잔여 예산 투입',
      'Zone 1 진입 시그널 모니터링',
      '평단가 최종 점검',
    ],
    mcaAction: '종료',
    dcaAction: '시작',
    sellAction: '-',
    color: 'success',
  },
};

export const ZONE_LIST = Object.values(ZONES);

// ============================================
// Strength Guide
// ============================================
interface StrengthGuide {
  level: string;
  iconName: string;
  value: number;
  step1Qty: string;
  step5Qty: string;
  totalMultiple: string;
  description: string;
}

export const STRENGTH_GUIDES: StrengthGuide[] = [
  {
    level: '보수적',
    iconName: 'Shield',
    value: 0.5,
    step1Qty: '~1',
    step5Qty: '~1',
    totalMultiple: '약 8배',
    description: '처음 MCA를 시작하는 분, 변동성 높은 종목',
  },
  {
    level: '표준',
    iconName: 'Scale',
    value: 1.0,
    step1Qty: '~1',
    step5Qty: '~5',
    totalMultiple: '약 13배',
    description: 'Grade A-B 종목에 적합한 기본 설정',
  },
  {
    level: '적극적',
    iconName: 'Flame',
    value: 2.0,
    step1Qty: '~3',
    step5Qty: '~11',
    totalMultiple: '약 26배',
    description: 'Grade A 종목, 충분한 투자 여력 보유 시',
  },
];

// ============================================
// Protocol References
// ============================================
interface ProtocolInfo {
  id: string;
  name: string;
  fullName: string;
  iconName: string;
  version: string;
  role: string;
  sectionId: string; // for navigation
  required: boolean;
}

export const PROTOCOLS: Record<string, ProtocolInfo> = {
  MOONWAVE: {
    id: 'moonwave',
    name: 'Moonwave Definition',
    fullName: 'Moonwave Definition',
    iconName: 'Waves',
    version: 'v1.0',
    role: '투자 철학 정의',
    sectionId: 'moonwave',
    required: true,
  },
  MOONYOU: {
    id: 'moonyou',
    name: 'Moonyou Definition',
    fullName: 'Moonyou Definition',
    iconName: 'User',
    version: 'v1.0',
    role: '투자자 정체성',
    sectionId: 'moonyou',
    required: true,
  },
  MIP: {
    id: 'mip',
    name: 'Investment Protocol',
    fullName: 'Moonwave Investment Protocol',
    iconName: 'ClipboardList',
    version: 'v2.1',
    role: '7단계 종목 선별',
    sectionId: 'mip',
    required: true,
  },
  MCA: {
    id: 'mca',
    name: 'MCA Protocol',
    fullName: 'Moonwave Cost Averaging Protocol',
    iconName: 'LineChart',
    version: 'v2.1',
    role: 'Zone 3 분할 매수',
    sectionId: 'mca',
    required: false, // Zone 3에서만
  },
  DCA: {
    id: 'dca',
    name: 'DCA Protocol',
    fullName: 'Dollar Cost Averaging Protocol',
    iconName: 'Wallet',
    version: 'v1.4',
    role: 'Zone 4 정액 매수',
    sectionId: 'dca',
    required: false, // Zone 4에서만
  },
  ZIGZAG: {
    id: 'zigzag',
    name: 'ZigZag Protocol',
    fullName: 'ZigZag Protocol',
    iconName: 'Activity',
    version: 'v2.2',
    role: 'Zone 1-4 판정',
    sectionId: 'zigzag',
    required: true,
  },
  GUIDE: {
    id: 'guide',
    name: 'MCA 사용 가이드',
    fullName: 'Moonwave MCA 사용 가이드',
    iconName: 'BookOpen',
    version: 'v3.0',
    role: '앱 사용 방법',
    sectionId: 'guide',
    required: false,
  },
};

// ============================================
// Moonwave Philosophy
// ============================================
export const PHILOSOPHY = {
  coreDeclaration:
    '세상이 만들어낸 속도는 Moonwave의 기준이 될 수 없으며, 타인의 걸음은 Moonwave의 존재를 설명할 수 없다.',

  coreValues: [
    {
      name: 'Wave-like Balance',
      korean: '파동적 균형',
      iconName: 'Waves',
      description:
        '전략과 감성, 논리와 직관 사이에서 균형을 유지하며, 시장 확장기와 수축기 모두에서 중심을 잃지 않습니다.',
    },
    {
      name: 'Sustainable Growth',
      korean: '지속가능한 성장',
      iconName: 'Sprout',
      description: '단기적 수익보다 장기적 관점의 자산 성장에 초점을 맞춥니다.',
    },
    {
      name: 'Flow-Centric Thinking',
      korean: '흐름 중심의 사고',
      iconName: 'RefreshCw',
      description: '고정된 가격 예측이 아닌 유연한 흐름과 연결을 중시합니다.',
    },
    {
      name: 'Automation & Efficiency',
      korean: '자동화와 효율성',
      iconName: 'Zap',
      description: '감정적 판단을 제거하고 시스템화된 매수로 효율성을 극대화합니다.',
    },
  ],
};

// ============================================
// Prerequisites for Protocols
// ============================================
interface PrerequisiteItem {
  requirement: string;
  criteria: string;
  iconName: string;
  reference?: string;
}

export const MCA_PREREQUISITES: PrerequisiteItem[] = [
  {
    requirement: 'Fundamental Score',
    criteria: '≥ 50점 (Grade C 이상)',
    iconName: 'BarChart3',
    reference: 'Fundamental Grade',
  },
  {
    requirement: '120월선 방향',
    criteria: '우상향 또는 평행',
    iconName: 'TrendingUp',
    reference: 'Investment Protocol Step 4',
  },
  {
    requirement: '멀티플',
    criteria: '≤ 1.2',
    iconName: 'Target',
    reference: 'Investment Protocol Step 6',
  },
  {
    requirement: 'Zone 위치',
    criteria: 'Zone 3 진입 확인',
    iconName: 'TrendingDown',
    reference: 'ZigZag Protocol',
  },
];

export const DCA_PREREQUISITES: PrerequisiteItem[] = [
  {
    requirement: 'Fundamental Score',
    criteria: '≥ 50점 (Grade C 이상)',
    iconName: 'BarChart3',
    reference: 'Fundamental Grade',
  },
  {
    requirement: '120월선 방향',
    criteria: '우상향 또는 평행',
    iconName: 'TrendingUp',
    reference: 'Investment Protocol Step 4',
  },
  {
    requirement: 'Zone 위치',
    criteria: 'Zone 4 진입 확인',
    iconName: 'Sprout',
    reference: 'ZigZag Protocol',
  },
];

// ============================================
// App Features
// ============================================
interface AppFeature {
  id: string;
  name: string;
  iconName: string;
  description: string;
}

export const APP_FEATURES: AppFeature[] = [
  {
    id: 'dashboard',
    name: '대시보드',
    iconName: 'LayoutDashboard',
    description:
      '등록된 모든 종목을 한눈에 확인하고 관리합니다. 진행률, 투입금액 등 핵심 지표를 제공합니다.',
  },
  {
    id: 'detail',
    name: '종목 상세',
    iconName: 'LineChart',
    description:
      '개별 종목의 MCA 계획을 설정하고, 매매 체결을 관리하며, 차트와 시뮬레이션을 확인합니다.',
  },
  {
    id: 'settings',
    name: '설정',
    iconName: 'Settings',
    description: '앱 테마, 데이터 백업/복원, 알림 설정 등 전반적인 환경을 관리합니다.',
  },
  {
    id: 'handbook',
    name: '핸드북',
    iconName: 'BookOpen',
    description: 'Moonwave 투자 철학과 프로토콜에 대한 상세한 가이드를 제공합니다.',
  },
];

// ============================================
// MCA Parameter Definitions
// ============================================
interface ParameterDefinition {
  id: string;
  name: string;
  koreanName: string;
  iconName: string;
  description: string;
  whyImportant: string;
  howToSet: string;
  example: string;
  unit: string;
}

export const MCA_PARAMETERS: ParameterDefinition[] = [
  {
    id: 'peakPrice',
    name: 'Peak Price',
    koreanName: '고점 가격',
    iconName: 'Mountain',
    description: '기준이 되는 최고점 가격. 이 가격 대비 하락률로 매수 구간이 계산됩니다.',
    whyImportant:
      '모든 하락률과 매수 단가의 기준점이 됩니다. 정확한 고점 설정이 MCA 성공의 첫걸음입니다.',
    howToSet: 'ZigZag 차트에서 확인된 최근 고점을 입력합니다. 52주 최고가를 참고할 수 있습니다.',
    example: '80,000원',
    unit: '원',
  },
  {
    id: 'targetBudget',
    name: 'Target Budget',
    koreanName: '목표 예산',
    iconName: 'Wallet',
    description: '전체 투자에 사용할 목표 금액. 자동 최적화 시 이 예산에 맞게 조정됩니다.',
    whyImportant: '투자 가능한 총 금액을 명확히 하여 무리한 투자를 방지합니다.',
    howToSet: '여유 자금 중 해당 종목에 투자할 수 있는 최대 금액을 설정합니다.',
    example: '5,000,000원',
    unit: '원',
  },
  {
    id: 'strength',
    name: 'Strength',
    koreanName: '투자 강도',
    iconName: 'Gauge',
    description:
      '하락 구간별 투자 배수. 높을수록 하락 시 더 많이 매수합니다. (1.0 = 균등, 2.0 = 2배씩 증가)',
    whyImportant:
      '하락장에서 얼마나 공격적으로 물량을 늘릴지 결정합니다. Grade에 맞는 적절한 설정이 필요합니다.',
    howToSet: 'Grade A: 1.0~2.0, Grade B: 0.5~1.0, Grade C: 0.5 이하를 권장합니다.',
    example: '1.0x',
    unit: 'x',
  },
  {
    id: 'startDrop',
    name: 'Start Drop',
    koreanName: '시작 하락률',
    iconName: 'TrendingDown',
    description: '첫 매수를 시작할 고점 대비 하락률. Zone 3 경계(12%)와 일치 권장.',
    whyImportant: 'Zone 3 진입 시점과 MCA 시작 시점을 일치시켜 전략의 일관성을 유지합니다.',
    howToSet: '기본값 -12%를 사용합니다. 더 보수적 접근 시 -15% 이상으로 설정합니다.',
    example: '-12%',
    unit: '%',
  },
  {
    id: 'steps',
    name: 'Steps',
    koreanName: '분할 구간',
    iconName: 'Hash',
    description: '전체 투자를 나눌 분할 매수 횟수. 많을수록 더 촘촘하게 분할됩니다.',
    whyImportant:
      '하락 구간을 얼마나 세밀하게 나눌지 결정합니다. 너무 적으면 기회를 놓치고, 너무 많으면 관리가 어렵습니다.',
    howToSet: '일반적으로 15~25구간이 적절합니다. 예산과 종목 특성에 따라 조정합니다.',
    example: '20구간',
    unit: '구간',
  },
  {
    id: 'legacyQty',
    name: 'Legacy Quantity',
    koreanName: '기보유 수량',
    iconName: 'Package',
    description: '이미 보유 중인 해당 종목의 수량. 평단가 계산에 반영됩니다.',
    whyImportant: '기존 보유분을 포함하여 전체 평단가를 정확히 계산할 수 있습니다.',
    howToSet: '증권사 앱에서 현재 보유 수량을 확인하여 입력합니다. 없으면 0으로 둡니다.',
    example: '100주',
    unit: '주',
  },
  {
    id: 'legacyAvg',
    name: 'Legacy Average',
    koreanName: '기보유 평단가',
    iconName: 'BarChart2',
    description: '기존 보유 주식의 평균 매수 단가. 신규 매수와 합산하여 평단가가 계산됩니다.',
    whyImportant: '기존 매수 이력을 반영하여 실제 평단가를 정확히 추적할 수 있습니다.',
    howToSet: '증권사 앱에서 해당 종목의 평균 매수가를 확인하여 입력합니다.',
    example: '65,000원',
    unit: '원',
  },
];

// ============================================
// Trade Table Column Definitions
// ============================================
interface TableColumnDef {
  id: string;
  name: string;
  iconName: string;
  description: string;
}

export const TRADE_TABLE_COLUMNS: TableColumnDef[] = [
  {
    id: 'order',
    name: '주문',
    iconName: 'Clock',
    description: '예약 매수 주문 등록 여부',
  },
  {
    id: 'execute',
    name: '체결',
    iconName: 'CheckCircle2',
    description: '실제 매수 체결 완료 여부',
  },
  {
    id: 'step',
    name: '구간',
    iconName: 'Hash',
    description: '분할 매수 구간 번호',
  },
  {
    id: 'dropRate',
    name: '하락률',
    iconName: 'TrendingDown',
    description: '고점 대비 하락률',
  },
  {
    id: 'buyPrice',
    name: '매수가',
    iconName: 'Banknote',
    description: '해당 구간 매수 단가',
  },
  {
    id: 'quantity',
    name: '수량',
    iconName: 'BarChart3',
    description: '해당 구간 매수 수량',
  },
  {
    id: 'amount',
    name: '금액',
    iconName: 'Wallet',
    description: '해당 구간 매수 금액',
  },
  {
    id: 'realQty',
    name: '실 수량',
    iconName: 'Package',
    description: '체결 시 누적 보유 수량',
  },
  {
    id: 'realAmount',
    name: '실 총액',
    iconName: 'Gem',
    description: '체결 시 누적 투자 금액',
  },
  {
    id: 'avgPrice',
    name: '평단가',
    iconName: 'Scale',
    description: '현재 평균 매수 단가',
  },
  {
    id: 'gap',
    name: '괴리율',
    iconName: 'Ruler',
    description: '이론 금액과 실제 금액의 차이 비율',
  },
  {
    id: 'date',
    name: '체결일',
    iconName: 'Calendar',
    description: '실제 매수 체결 일자',
  },
  {
    id: 'memo',
    name: '비고',
    iconName: 'FileText',
    description: '각 구간별 메모',
  },
];

// ============================================
// Row Status Colors
// ============================================
export const ROW_STATUS = {
  ORDERED: {
    name: '주문 등록됨',
    iconName: 'Clock',
    description: '예약 주문이 등록되어 체결 대기 중',
    bgClass: 'bg-warning-50/50 dark:bg-warning-900/20',
  },
  EXECUTED: {
    name: '체결 완료',
    iconName: 'CheckCircle',
    description: '매수가 완료되어 보유 중',
    bgClass: 'bg-success-50/50 dark:bg-success-900/20',
  },
  PENDING: {
    name: '미처리',
    iconName: 'Circle',
    description: '아직 주문/체결되지 않은 구간',
    bgClass: '',
  },
};
