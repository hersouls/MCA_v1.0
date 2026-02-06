// ============================================
// Onboarding Tour Step Definitions
// ============================================

import type { DriveStep } from 'driver.js';

// Lucide SVG inline helper (driver.js uses HTML strings, not React)
function icon(paths: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:6px;margin-top:-2px">${paths}</svg>`;
}

// Lucide icon SVG paths
const icons = {
  menu: icon(
    '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
  ),
  wallet: icon(
    '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
  ),
  search: icon(
    '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  ),
  bookOpen: icon(
    '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
  ),
  circleCheck: icon(
    '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  ),
};

/**
 * 데스크톱 투어 스텝 (lg 이상 뷰포트)
 */
export const desktopSteps: DriveStep[] = [
  {
    popover: {
      title: 'MCA에 오신 것을 환영합니다!',
      description:
        'MCA(Maximum Drawdown Cost Averaging) 전략을 관리하는 투자 도우미입니다.<br/><br/>주요 기능을 간단히 안내해 드릴게요.',
      side: 'over',
      align: 'center',
    },
  },
  {
    element: '[data-tour="sidebar-nav"]',
    popover: {
      title: `${icons.menu} 메인 메뉴`,
      description:
        '<b>대시보드</b> — 전체 포트폴리오 현황<br/>' +
        '<b>핸드북</b> — MCA 전략 학습 가이드<br/>' +
        '<b>FAQ</b> — 자주 묻는 질문<br/>' +
        '<b>설정</b> — 테마, 백업, 알림',
      side: 'right',
      align: 'start',
    },
  },
  {
    element: '[data-tour="stats-section"]',
    popover: {
      title: `${icons.wallet} 자금 현황`,
      description:
        '초기 투자금, 잔여 자금, 총 체결액, 총 주문액을 한눈에 확인할 수 있습니다.<br/><br/>설정에서 초기 투자금을 입력하면 투자율도 자동 계산됩니다.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '[data-tour="header-search"]',
    popover: {
      title: `${icons.search} 종목 추가`,
      description:
        '이 버튼을 눌러 종목을 검색하고 포트폴리오에 추가할 수 있습니다.<br/><br/>종목명 또는 종목코드로 검색해 보세요.',
      side: 'bottom',
      align: 'end',
    },
  },
  {
    element: '[data-tour="header-handbook"]',
    popover: {
      title: `${icons.bookOpen} 핸드북`,
      description:
        'MCA 전략의 원리와 사용법을 자세히 배울 수 있습니다.<br/><br/>처음이시라면 꼭 한번 읽어보세요!',
      side: 'bottom',
      align: 'end',
    },
  },
  {
    popover: {
      title: `${icons.circleCheck} 투어 완료!`,
      description:
        '이제 종목을 추가하고 MCA 전략을 시작해 보세요.<br/><br/>더 자세한 내용은 <b>핸드북</b>에서 확인할 수 있습니다.<br/>설정에서 언제든 이 투어를 다시 볼 수 있어요.',
      side: 'over',
      align: 'center',
    },
  },
];

/**
 * 모바일 투어 스텝 (md 미만 뷰포트)
 */
export const mobileSteps: DriveStep[] = [
  {
    popover: {
      title: 'MCA에 오신 것을 환영합니다!',
      description:
        'MCA 전략을 관리하는 투자 도우미입니다.<br/>주요 기능을 간단히 안내해 드릴게요.',
      side: 'over',
      align: 'center',
    },
  },
  {
    element: '[data-tour="bottom-nav"]',
    popover: {
      title: `${icons.menu} 하단 메뉴`,
      description:
        '대시보드, 종목 목록, 핸드북, FAQ, 설정에<br/>여기서 빠르게 접근할 수 있습니다.',
      side: 'top',
      align: 'center',
    },
  },
  {
    element: '[data-tour="stats-section"]',
    popover: {
      title: `${icons.wallet} 자금 현황`,
      description:
        '투자금과 체결 현황을 한눈에 확인하세요.<br/>설정에서 초기 투자금을 입력할 수 있습니다.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '[data-tour="header-search"]',
    popover: {
      title: `${icons.search} 종목 추가`,
      description: '이 버튼으로 종목을 검색하고 추가할 수 있습니다.',
      side: 'bottom',
      align: 'end',
    },
  },
  {
    popover: {
      title: `${icons.circleCheck} 투어 완료!`,
      description:
        '종목을 추가하고 MCA 전략을 시작해 보세요.<br/>설정에서 언제든 이 투어를 다시 볼 수 있어요.',
      side: 'over',
      align: 'center',
    },
  },
];
