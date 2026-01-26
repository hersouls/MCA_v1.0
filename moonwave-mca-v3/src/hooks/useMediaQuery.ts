// ============================================
// Media Query Hook
// ============================================

import { BREAKPOINTS, type Breakpoint } from '@/utils/constants';
import { useEffect, useState } from 'react';

/**
 * 미디어 쿼리 매칭 여부 반환
 * @param query - CSS 미디어 쿼리 문자열
 * @returns 쿼리가 현재 뷰포트와 일치하는지 여부
 */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mq = window.matchMedia(query);

    // 초기값과 다른 경우에만 업데이트 (SSR hydration 대응)
    if (mq.matches !== matches) {
      setMatches(mq.matches);
    }

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);

    // 이벤트 리스너 등록
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return matches;
}

/**
 * 뷰포트가 지정 브레이크포인트 이상인지 확인
 * @param breakpoint - 확인할 브레이크포인트 (xs, sm, md, lg, xl, 2xl)
 * @returns 뷰포트가 브레이크포인트 이상인지 여부
 */
function useBreakpoint(breakpoint: Breakpoint): boolean {
  return useMediaQuery(`(min-width: ${BREAKPOINTS[breakpoint]}px)`);
}

/**
 * 모바일 여부 확인 (md 미만)
 * @returns 현재 뷰포트가 모바일 크기인지 여부
 */
export function useIsMobile(): boolean {
  return !useBreakpoint('md');
}
