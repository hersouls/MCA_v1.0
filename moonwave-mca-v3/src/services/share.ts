// ============================================
// Share Service
// Web Share API, QR Code, Deep Link 통합
// ============================================

import type { ShareData, QRCodeData, DeepLinkParams, Portfolio } from '@/types';

// ============================================
// Web Share API
// ============================================

/**
 * Web Share API 지원 여부 확인
 */
export function isWebShareSupported(): boolean {
  return typeof navigator !== 'undefined' && 'share' in navigator;
}

/**
 * 파일 공유 지원 여부 확인
 */
export function isFileShareSupported(): boolean {
  return typeof navigator !== 'undefined' && 'canShare' in navigator;
}

/**
 * Web Share API로 공유
 */
export async function shareWithWebShare(data: ShareData): Promise<boolean> {
  if (!isWebShareSupported()) {
    console.warn('Web Share API not supported');
    return false;
  }

  try {
    // Web Share API only accepts title, text, url, files - not our custom 'type' field
    const shareData: { title?: string; text?: string; url?: string; files?: File[] } = {
      title: data.title,
      text: data.text,
      url: data.url,
    };

    // 파일 공유 가능 여부 확인
    if (data.files && data.files.length > 0 && isFileShareSupported()) {
      if (navigator.canShare({ files: data.files })) {
        shareData.files = data.files;
      }
    }

    await navigator.share(shareData);
    return true;
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      // 사용자가 공유 취소
      return false;
    }
    console.error('Share failed:', error);
    return false;
  }
}

/**
 * 포트폴리오 공유 텍스트 생성
 */
export function generatePortfolioShareText(portfolio: Portfolio): string {
  const lines = [
    `📈 ${portfolio.name} MCA 전략`,
    ``,
    `▸ 고점가격: ${portfolio.params.peakPrice.toLocaleString()}원`,
    `▸ 투자강도: ${portfolio.params.strength}`,
    `▸ 시작하락률: -${portfolio.params.startDrop}%`,
    `▸ 분할구간: ${portfolio.params.steps}구간`,
    `▸ 목표예산: ${portfolio.params.targetBudget.toLocaleString()}원`,
  ];

  if (portfolio.fundamentalGrade && portfolio.fundamentalScore !== undefined) {
    lines.push(``);
    lines.push(`📊 Fundamental Grade: ${portfolio.fundamentalGrade} (${portfolio.fundamentalScore}점)`);
  }

  lines.push(``);
  lines.push(`🌙 Moonwave MCA로 생성됨`);

  return lines.join('\n');
}

/**
 * 포트폴리오 공유
 */
export async function sharePortfolio(portfolio: Portfolio, includeDeepLink = true): Promise<boolean> {
  const text = generatePortfolioShareText(portfolio);
  const url = includeDeepLink ? generateDeepLink(portfolio.params) : undefined;

  return shareWithWebShare({
    type: 'portfolio',
    title: `${portfolio.name} MCA 전략`,
    text,
    url,
  });
}

// ============================================
// Deep Link (URL State)
// ============================================

const DEEPLINK_BASE = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';

/**
 * 파라미터를 URL 안전 문자열로 인코딩
 */
function encodeParams(params: DeepLinkParams): string {
  const data = {
    n: params.name,
    p: params.peakPrice,
    s: params.strength,
    d: params.startDrop,
    st: params.steps,
    b: params.targetBudget,
  };

  // null/undefined 값 제거
  const filtered = Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== undefined && v !== null)
  );

  return btoa(JSON.stringify(filtered));
}

/**
 * URL에서 파라미터 디코딩
 */
export function decodeDeepLinkParams(encoded: string): DeepLinkParams | null {
  try {
    const json = atob(encoded);
    const data = JSON.parse(json);

    return {
      name: data.n,
      peakPrice: data.p,
      strength: data.s,
      startDrop: data.d,
      steps: data.st,
      targetBudget: data.b,
    };
  } catch (error) {
    console.error('Failed to decode deep link:', error);
    return null;
  }
}

/**
 * Deep Link URL 생성
 */
export function generateDeepLink(params: DeepLinkParams): string {
  const encoded = encodeParams(params);
  return `${DEEPLINK_BASE}?create=${encoded}`;
}

/**
 * 현재 URL에서 Deep Link 파라미터 추출
 */
export function extractDeepLinkParams(): DeepLinkParams | null {
  if (typeof window === 'undefined') return null;

  const urlParams = new URLSearchParams(window.location.search);
  const createParam = urlParams.get('create');

  if (createParam) {
    return decodeDeepLinkParams(createParam);
  }

  // 단축 파라미터 형식 지원
  const shortParams: DeepLinkParams = {};
  if (urlParams.has('n')) shortParams.name = urlParams.get('n') || undefined;
  if (urlParams.has('p')) shortParams.peakPrice = Number(urlParams.get('p'));
  if (urlParams.has('s')) shortParams.strength = Number(urlParams.get('s'));
  if (urlParams.has('d')) shortParams.startDrop = Number(urlParams.get('d'));
  if (urlParams.has('st')) shortParams.steps = Number(urlParams.get('st'));
  if (urlParams.has('b')) shortParams.targetBudget = Number(urlParams.get('b'));

  return Object.keys(shortParams).length > 0 ? shortParams : null;
}

/**
 * Deep Link 파라미터 클리어 (URL에서 제거)
 */
export function clearDeepLinkParams(): void {
  if (typeof window === 'undefined') return;

  const url = new URL(window.location.href);
  url.searchParams.delete('create');
  url.searchParams.delete('n');
  url.searchParams.delete('p');
  url.searchParams.delete('s');
  url.searchParams.delete('d');
  url.searchParams.delete('st');
  url.searchParams.delete('b');

  window.history.replaceState({}, '', url.toString());
}

// ============================================
// QR Code
// ============================================

/**
 * QR 코드 데이터 생성
 */
export function createQRCodeData(
  type: QRCodeData['type'],
  data: unknown,
  compress = true
): QRCodeData {
  const payload = JSON.stringify(data);

  // LZ-string 압축 (선택적)
  const compressed = false;
  // LZ-string 압축은 추후 라이브러리 설치 시 구현
  // if (compress && payload.length > 500) {
  //   payload = LZString.compressToBase64(payload);
  //   compressed = true;
  // }
  void compress; // 향후 압축 기능 구현 시 사용

  return {
    type,
    payload,
    compressed,
  };
}

/**
 * QR 코드용 포트폴리오 데이터 생성
 */
export function createPortfolioQRData(portfolio: Portfolio): QRCodeData {
  const data = {
    v: '3.0', // 버전
    t: 'portfolio',
    n: portfolio.name,
    c: portfolio.stockCode,
    p: {
      pk: portfolio.params.peakPrice,
      st: portfolio.params.strength,
      sd: portfolio.params.startDrop,
      sp: portfolio.params.steps,
      tb: portfolio.params.targetBudget,
      lq: portfolio.params.legacyQty,
      la: portfolio.params.legacyAvg,
    },
    f: portfolio.fundamentalScore
      ? {
          s: portfolio.fundamentalScore,
          g: portfolio.fundamentalGrade,
        }
      : undefined,
  };

  return createQRCodeData('portfolio', data);
}

/**
 * QR 코드 데이터 파싱
 */
export function parseQRCodeData(qrContent: string): {
  type: QRCodeData['type'];
  data: unknown;
} | null {
  try {
    // 압축 데이터인지 확인
    // LZ-string 압축 해제는 추후 라이브러리 설치 시 구현
    // const decompressed = LZString.decompressFromBase64(qrContent);
    // const jsonStr = decompressed || qrContent;
    const jsonStr = qrContent;

    const parsed = JSON.parse(jsonStr);

    if (parsed.t === 'portfolio' || parsed.type === 'portfolio') {
      return { type: 'portfolio', data: parsed };
    }

    if (parsed.t === 'settings' || parsed.type === 'settings') {
      return { type: 'settings', data: parsed };
    }

    return { type: 'deeplink', data: parsed };
  } catch (error) {
    console.error('Failed to parse QR data:', error);
    return null;
  }
}

/**
 * QR 데이터에서 포트폴리오 복원
 */
export function restorePortfolioFromQR(qrData: unknown): Partial<Portfolio> | null {
  try {
    const data = qrData as {
      n?: string;
      c?: string;
      p?: {
        pk?: number;
        st?: number;
        sd?: number;
        sp?: number;
        tb?: number;
        lq?: number;
        la?: number;
      };
      f?: {
        s?: number;
        g?: string;
      };
    };

    return {
      name: data.n || '새 포트폴리오',
      stockCode: data.c,
      params: {
        peakPrice: data.p?.pk || 0,
        strength: data.p?.st || 1,
        startDrop: data.p?.sd || 15,
        steps: data.p?.sp || 20,
        targetBudget: data.p?.tb || 0,
        legacyQty: data.p?.lq || 0,
        legacyAvg: data.p?.la || 0,
      },
      fundamentalScore: data.f?.s,
      fundamentalGrade: data.f?.g as Portfolio['fundamentalGrade'],
    };
  } catch (error) {
    console.error('Failed to restore portfolio from QR:', error);
    return null;
  }
}

// ============================================
// QR Code Generation (Canvas)
// ============================================

/**
 * QR 코드 SVG 생성 (간단한 구현)
 * 실제 구현 시 qrcode 라이브러리 사용 권장
 */
export async function generateQRCodeSVG(data: string, size = 200): Promise<string | null> {
  try {
    // 동적 import로 qrcode 라이브러리 로드
    // 실제 구현 시 아래 주석 해제
    // const QRCode = await import('qrcode');
    // return await QRCode.toString(data, { type: 'svg', width: size });

    // 임시 플레이스홀더 (라이브러리 설치 전)
    // data는 QR 라이브러리 설치 후 사용됨
    const dataPreview = data.length > 20 ? data.substring(0, 20) + '...' : data;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
      <rect fill="white" width="${size}" height="${size}"/>
      <text x="50%" y="45%" text-anchor="middle" fill="#666" font-size="12">
        QR Code
      </text>
      <text x="50%" y="55%" text-anchor="middle" fill="#999" font-size="8">
        ${dataPreview}
      </text>
      <text x="50%" y="70%" text-anchor="middle" fill="#999" font-size="10">
        (Install qrcode library)
      </text>
    </svg>`;
  } catch (error) {
    console.error('Failed to generate QR code:', error);
    return null;
  }
}

/**
 * QR 코드를 Data URL로 생성
 */
export async function generateQRCodeDataURL(data: string, size = 200): Promise<string | null> {
  try {
    // 동적 import
    // const QRCode = await import('qrcode');
    // return await QRCode.toDataURL(data, { width: size });

    // 임시: SVG를 Data URL로
    const svg = await generateQRCodeSVG(data, size);
    if (svg) {
      return `data:image/svg+xml;base64,${btoa(svg)}`;
    }
    return null;
  } catch (error) {
    console.error('Failed to generate QR data URL:', error);
    return null;
  }
}

// ============================================
// Copy Link Fallback
// ============================================

/**
 * Web Share 미지원 시 링크 복사 폴백
 */
export async function copyShareLink(url: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    // execCommand 폴백
    const textarea = document.createElement('textarea');
    textarea.value = url;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  }
}

/**
 * 공유 가능한 방법 목록 반환
 */
export function getAvailableShareMethods(): string[] {
  const methods: string[] = ['clipboard', 'qrcode', 'deeplink'];

  if (isWebShareSupported()) {
    methods.unshift('webshare');
  }

  return methods;
}
