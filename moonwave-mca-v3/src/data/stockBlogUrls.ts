// ============================================
// Stock Blog URL Mapping
// 종목코드별 네이버 블로그 포스팅 URL 맵핑
// ============================================

/**
 * 종목코드 → 블로그 URL 맵핑
 * 새 종목 추가 시 아래 형식으로 등록:
 * '종목코드': 'https://blog.naver.com/...',
 */
export const STOCK_BLOG_URLS: Record<string, string> = {
  '017810': 'https://blog.naver.com/her_soul/224158815367', // 풀무원
  '035760': 'https://blog.naver.com/her_soul/224158660369', // CJ ENM
  '047040': 'https://blog.naver.com/her_soul/224158634491', // 대우건설
  '035420': 'https://blog.naver.com/her_soul/224158613214', // NAVER
  '007540': 'https://blog.naver.com/her_soul/224156162024', // 샘표
  '005380': 'https://blog.naver.com/her_soul/224154288872', // 현대차
  '030200': 'https://blog.naver.com/her_soul/224154051133', // KT
  '017670': 'https://blog.naver.com/her_soul/224154037853', // SK텔레콤
  '052690': 'https://blog.naver.com/her_soul/224152408330', // 한전기술
  '006400': 'https://blog.naver.com/her_soul/224152273088', // 삼성SDI
  '066570': 'https://blog.naver.com/her_soul/224152197367', // LG전자
  '067160': 'https://blog.naver.com/her_soul/224151495520', // SOOP
  '001120': 'https://blog.naver.com/her_soul/224150606441', // LX인터내셔널
  '003490': 'https://blog.naver.com/her_soul/224148584840', // 대한항공
  '064400': 'https://blog.naver.com/her_soul/224148506042', // LG CNS
  '014440': 'https://blog.naver.com/her_soul/224148468698', // 영보화학
  '000270': 'https://blog.naver.com/her_soul/224148443416', // 기아
  '214450': 'https://blog.naver.com/her_soul/224136295633', // 파마리서치
  '011150': 'https://blog.naver.com/her_soul/224135885181', // CJ씨푸드
  '035900': 'https://blog.naver.com/her_soul/224134487721', // JYP Ent.
  '068270': 'https://blog.naver.com/her_soul/224134081540', // 셀트리온
  // KZ정밀 - 종목코드 확인 필요
};

/**
 * 종목코드로 블로그 URL 조회
 * @param stockCode 종목코드 (예: '017810')
 * @returns 블로그 URL 또는 null
 */
export function getBlogUrl(stockCode: string): string | null {
  return STOCK_BLOG_URLS[stockCode] || null;
}
