// ============================================
// User-Facing Text Constants (i18n Ready)
// ============================================

export const TEXTS = {
  // 공통
  COMMON: {
    APP_INIT: '앱 초기화 중...',
    APP_INIT_LONG: '앱을 초기화하는 중...',
    MIGRATION_IN_PROGRESS: '기존 데이터 마이그레이션 중...',
    MIGRATION_IN_PROGRESS_LONG: '기존 데이터를 마이그레이션 중입니다...',
    MIGRATION_COMPLETE: 'v2 → v3 마이그레이션 완료',
    INIT_FAILED: '초기화 실패:',
    LOADING: '불러오는 중...',
    SAVE: '저장',
    CANCEL: '취소',
    DELETE: '삭제',
    CONFIRM: '확인',
    CLOSE: '닫기',
    RESET: '초기화',
    BACK: '뒤로 가기',
  },

  // 차트
  CHART: {
    AVG_PRICE_LINE: '평단가 방어선',
    GAP_RATE: '괴리율',
    Y_AXIS_AVG_PRICE: '평단가 (원)',
    Y_AXIS_GAP_RATE: '괴리율 (%)',
    EMPTY_TITLE: '주문 또는 체결된 구간이 없습니다',
    EMPTY_DESC: '매매 테이블에서 주문을 등록하세요',
    STEP_LABEL: (step: number) => `${step}구간`,
  },

  // Fundamental Grade
  FUNDAMENTAL: {
    TITLE: 'Fundamental Grade',
    TOTAL_SCORE: '총점',
    CATEGORY_VALUATION: '가치평가 (I)',
    CATEGORY_SHAREHOLDER: '주주환원 (II)',
    CATEGORY_GROWTH: '성장/경영 (III)',

    // 입력 필드 라벨
    PER: 'PER',
    PBR: 'PBR',
    EARNINGS_SUSTAINABILITY: '이익 지속 가능성 (3년 연속 흑자)',
    DUAL_LISTING: '이중상장 여부 (해외 상장)',
    DIVIDEND_YIELD: '배당수익률 (%)',
    QUARTERLY_DIVIDEND: '분기 배당 시행',
    CONSECUTIVE_DIVIDEND: '연속 배당 년수',
    BUYBACK_PROGRAM: '자사주 매입 프로그램',
    CANCELLATION_RATE: '연간 자사주 소각률 (%)',
    TREASURY_STOCK: '자사주 비율 (%)',
    GROWTH_POTENTIAL: '성장 잠재력',
    MANAGEMENT_QUALITY: '경영진 품질',
    GLOBAL_BRAND: '글로벌 브랜드 보유',

    // 플레이스홀더
    PER_PLACEHOLDER: '예: 8.5',
    PBR_PLACEHOLDER: '예: 0.8',
    DIVIDEND_PLACEHOLDER: '예: 3.5',
    YEARS_PLACEHOLDER: '예: 10',
    RATE_PLACEHOLDER: '예: 1.5',
    TREASURY_PLACEHOLDER: '예: 10',

    // 힌트
    PER_HINT: '10 이하: 10점, 10-15: 5점',
    PBR_HINT: '1 이하: 10점, 1-2: 5점',
    DIVIDEND_HINT: '3% 이상: 10점, 1-3%: 5점',
    YEARS_HINT: '5년 이상: 5점',
    CANCELLATION_HINT: '1% 이상: 5점',
    TREASURY_HINT: '5% 이상: 5점',

    // 성장 잠재력 옵션
    GROWTH_VERY_HIGH: '매우 높음',
    GROWTH_HIGH: '높음',
    GROWTH_NORMAL: '보통',
    GROWTH_LOW: '낮음',

    // 경영진 품질 옵션
    MGMT_EXCELLENT: '우수',
    MGMT_PROFESSIONAL: '전문경영인',
    MGMT_OWNER_RISK: '오너리스크',

    // 버튼
    PASTE: '붙여넣기',
    ANALYZING: '분석 중...',
    DROP_TARGET: '여기에 데이터 놓기',
    DATA_APPLIED: (source: string, count: number) =>
      `${source}에서 ${count}개 항목 적용됨`,
  },

  // 대시보드
  DASHBOARD: {
    TITLE: '대시보드',
    DESCRIPTION: '포트폴리오 현황을 한눈에 확인하세요',
    FUND_STATUS: '자금 현황',
    INITIAL_CASH: '초기 예수금',
    REMAINING_CASH: '잔여 현금',
    INVESTMENT_RATE: '투입률',
    TOTAL_EXECUTED: '체결 총액',
    TOTAL_ORDERED: '주문 총액',
    FAVORITES: '즐겨찾기',
    ALL_PORTFOLIOS: '전체 종목',
    ADD_PORTFOLIO: '새 종목 추가',
    EMPTY_TITLE: '등록된 종목이 없습니다',
    EMPTY_DESC: '새 종목을 추가하여 MCA 전략을 시작하세요',
    ALERT_TITLE: (count: number) => `주의가 필요한 종목 (${count}개)`,
    ALERT_DESC: '주문/체결 구간에 갭이 발생한 종목이 있습니다. 추가 주문을 고려해주세요.',
  },

  // 포트폴리오 상세
  PORTFOLIO: {
    NOT_FOUND: '종목을 찾을 수 없습니다',
    NOT_FOUND_DESC: '요청하신 종목이 존재하지 않거나 삭제되었습니다.',
    BACK_TO_DASHBOARD: '대시보드로 돌아가기',
    PROGRESS: '진행률',
    INVESTED_AMOUNT: '투입 금액',
    AVG_PRICE: '평균 단가',
    PENDING_ORDERS: '주문 대기',
    BUDGET: '예산',
    HOLDINGS: '보유',
    INTERVALS: '구간',
    DELETE_CONFIRM: (name: string) => `"${name}" 종목을 삭제하시겠습니까?`,
  },

  // 매매 파라미터
  PARAMETERS: {
    TITLE: '매매 파라미터',
    SETTINGS_TITLE: '매매 파라미터 설정',
    PEAK_PRICE: '고점 가격',
    TARGET_BUDGET: '목표 예산',
    STRENGTH: '투자 강도',
    START_DROP: '시작 하락률',
    STEPS: '분할 구간',
    ESTIMATED_BUDGET: '예상 총 투자금',
    AUTO_FIT: '예산 자동 최적화',
    AUTO_FIT_DESC: '목표 예산에 맞게 강도/구간을 자동 조정합니다',
    LEGACY_TITLE: '기보유 주식 설정',
    LEGACY_QTY: '기보유 수량',
    LEGACY_AVG: '기보유 평단가',
  },

  // 단위
  UNITS: {
    KRW: '원',
    SHARES: '주',
    PERCENT: '%',
    MULTIPLE: '배',
    INTERVALS: '구간',
    POINTS: '점',
  },
} as const;
