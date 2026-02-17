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
    DATA_APPLIED: (source: string, count: number) => `${source}에서 ${count}개 항목 적용됨`,
  },

  // 대시보드
  DASHBOARD: {
    TITLE: '대시보드',
    DESCRIPTION: '포트폴리오 현황을 한눈에 확인하세요',
    FUND_STATUS: '자금 현황',
    INITIAL_CASH: '초기 예수금',
    INITIAL_CASH_TOOLTIP: '설정에서 초기 예수금을 변경할 수 있습니다',
    REMAINING_CASH: '잔여 현금',
    REMAINING_CASH_TOOLTIP: '초기 예수금에서 투입 총액을 뺀 금액입니다',
    INVESTMENT_RATE: '투입률',
    TOTAL_EXECUTED: '투입 총액',
    TOTAL_EXECUTED_TOOLTIP: '기보유 금액과 체결된 구간의 금액 합계입니다',
    TOTAL_ORDERED: '주문 총액',
    TOTAL_ORDERED_TOOLTIP: '주문 등록된 구간의 예상 매수 금액 합계입니다',
    FAVORITES: '즐겨찾기',
    ALL_PORTFOLIOS: '전체 종목',
    ADD_PORTFOLIO: '새 종목 추가',
    EMPTY_TITLE: '등록된 종목이 없습니다',
    EMPTY_DESC: '새 종목을 추가하여 MCA 전략을 시작하세요',
    ALERT_TITLE: (count: number) => `주의가 필요한 종목 (${count}개)`,
    ALERT_DESC: '주문/체결 구간에 갭이 발생한 종목이 있습니다. 추가 주문을 고려해주세요.',

    // Phase 2: Filters & Charts
    FILTER_ALL: '전체',
    FILTER_KR: '한국',
    FILTER_US: '미국',
    FILTER_GAP: '갭 주의',
    FILTER_GRADE: '등급 A+',
    SORT_NAME: '이름순',
    SORT_PROGRESS: '진행률순',
    SORT_INVESTMENT: '투입금액순',
    SORT_UPDATED: '최근 수정순',
    ALLOCATION_TITLE: '포트폴리오 분배',
    PROGRESS_COMPARISON: '진행률 비교',
    NEXT_BUY: '다음',
  },

  // 포트폴리오 상세
  PORTFOLIO: {
    NOT_FOUND: '종목을 찾을 수 없습니다',
    NOT_FOUND_DESC: '요청하신 종목이 존재하지 않거나 삭제되었습니다.',
    BACK_TO_DASHBOARD: '대시보드로 돌아가기',
    PROGRESS: '진행률',
    PROGRESS_TOOLTIP: '전체 구간 대비 체결 완료된 구간의 비율입니다',
    INVESTED_AMOUNT: '투입 금액',
    INVESTED_AMOUNT_TOOLTIP: '기보유 금액과 체결된 구간의 매수 금액 합계입니다',
    AVG_PRICE: '평균 단가',
    AVG_PRICE_TOOLTIP: '보유 주식의 평균 매수 단가입니다',
    PENDING_ORDERS: '주문 대기',
    PENDING_ORDERS_TOOLTIP: '주문 등록 후 아직 체결되지 않은 구간의 예상 금액입니다',
    BUDGET: '예산',
    HOLDINGS: '보유',
    INTERVALS: '구간',
    DELETE_CONFIRM: (name: string) => `"${name}" 종목을 삭제하시겠습니까?`,

    // Phase 1: Position Summary
    POSITION_SUMMARY: '포지션 현황',
    BREAK_EVEN: '손익분기가',
    BREAK_EVEN_TOOLTIP: '현재 평균 매수 단가 = 손익분기점',
    NEXT_BUY_PRICE: '다음 매수가',
    NEXT_BUY_PRICE_TOOLTIP: '아직 주문되지 않은 다음 구간의 예상 매수가',
    VS_PEAK: '고점 대비',
    VS_PEAK_TOOLTIP: '고점 가격 대비 현재 평균 단가의 위치',
    VS_TARGET: '목표가 대비',
    VS_TARGET_TOOLTIP: '목표 매도가까지의 상승 여력',
    TARGET_NOT_SET: '미설정',

    // Phase 1: Budget Gauge
    BUDGET_STATUS: '예산 현황',
    BUDGET_EXECUTED: '체결',
    BUDGET_PENDING: '주문대기',
    BUDGET_REMAINING: '잔여',
    BUDGET_OVER: '예산 초과',
    BUDGET_UTILIZATION: '예산 소진율',
    BUDGET_TARGET: '목표예산',
    BUDGET_EXPECTED: '예상총투자',

    // Phase 1: Next Action Banner
    NEXT_ACTION: '다음 매수 구간',
    PENDING_EXECUTION: '체결 대기',
    ALL_ORDERED: '모든 구간 주문 등록됨',
    STEP_LABEL: (step: number) => `${step}구간`,
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
  // 온보딩
  ONBOARDING: {
    CHOICE_TITLE: '시작 안내 투어',
    CHOICE_DESC: 'MCA 사용법을 단계별로 안내해드립니다. 지금 시작하시겠습니까?',
    START_TOUR: '시작 안내 투어',
    SKIP_TOUR: '나중에 하기',
  },

  // 404
  NOT_FOUND: {
    TITLE: '페이지를 찾을 수 없습니다',
    DESC: '요청하신 페이지가 존재하지 않거나 이동되었습니다.',
    GO_HOME: '대시보드로 돌아가기',
  },

  // 핸드북 계층
  HANDBOOK: {
    TIER_1: '시작하기',
    TIER_2: '심화학습',
    TIER_3: '전략가이드',
    RECOMMENDED: '추천',
    BACK_TO_TOP: '맨 위로',
  },

  // 로딩 상태
  LOADING_STATES: {
    PORTFOLIO_LOADING: '포트폴리오 불러오는 중...',
    CALCULATING: '계산 중...',
    CHART_RECALCULATING: '차트 재계산 중...',
    SEARCHING: '검색 중...',
    SAVING: '저장 중...',
    SAVED: '저장됨',
  },

  // 에러
  ERROR: {
    PAGE_ERROR: '페이지 오류',
    PAGE_NOT_FOUND: '페이지를 찾을 수 없습니다',
    SERVER_ERROR: '서버 오류',
    UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다.',
    ERROR_DETAILS: '오류 상세 정보',
    REFRESH_PAGE: '페이지 새로고침',
    GO_BACK: '이전 페이지로',
    GO_DASHBOARD: '대시보드로 이동',
    TOGGLE_FAILED: '상태 변경에 실패했습니다. 다시 시도해주세요.',
    SEARCH_NO_RESULT: '해당 종목을 찾을 수 없습니다',
    SEARCH_HINT: '종목명 또는 6자리 코드를 정확히 입력해주세요',
  },

  // 설정
  SETTINGS: {
    TAB_APPEARANCE: '외관',
    TAB_DATA: '데이터',
    TAB_NOTIFICATIONS: '알림',
  },

  // 포트폴리오 삭제
  DELETE_DIALOG: {
    TITLE: '포트폴리오 삭제',
    DESCRIPTION: (name: string) =>
      `"${name}" 종목을 영구적으로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`,
    CONFIRM: '삭제',
    CANCEL: '취소',
  },

  // 미저장 경고
  UNSAVED: {
    WARNING: '저장되지 않은 변경사항이 있습니다. 페이지를 떠나시겠습니까?',
  },

  // 자동 최적화 설명
  AUTO_FIT: {
    TOOLTIP: '목표 예산에 맞춰 매수 강도(Strength)와 분할 구간(Steps)을 자동으로 조정합니다. 현재 설정된 고점가와 시작 하락률을 기준으로 최적의 파라미터를 계산합니다.',
    SHORT_DESC: '목표 예산에 맞춰 Strength와 구간 수를 자동 조정합니다',
  },

  // 키보드 단축키
  SHORTCUTS: {
    SEARCH: '종목 검색',
    NEW_PORTFOLIO: '새 포트폴리오',
    CLOSE_MODAL: '모달 닫기',
    SETTINGS: '설정',
  },
} as const;
