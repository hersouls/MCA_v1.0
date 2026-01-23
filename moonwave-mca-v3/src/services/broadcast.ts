// ============================================
// Broadcast Channel Service
// 크로스탭 실시간 동기화
// ============================================

import type { BroadcastMessage, BroadcastEventType, Portfolio, Settings } from '@/types';

// 채널 이름
const CHANNEL_NAME = 'moonwave-mca-sync';

// 탭 고유 ID 생성
const TAB_ID = `tab_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

// 콜백 타입
type MessageCallback = (message: BroadcastMessage) => void;

// 전역 채널 인스턴스
let broadcastChannel: BroadcastChannel | null = null;
const messageCallbacks: Map<BroadcastEventType | '*', Set<MessageCallback>> = new Map();

// ============================================
// Initialization
// ============================================

/**
 * Broadcast Channel 지원 여부 확인
 */
export function isBroadcastSupported(): boolean {
  return typeof BroadcastChannel !== 'undefined';
}

/**
 * Broadcast Channel 초기화
 */
export function initBroadcastChannel(): boolean {
  if (!isBroadcastSupported()) {
    console.warn('BroadcastChannel not supported, falling back to localStorage events');
    initLocalStorageFallback();
    return false;
  }

  if (broadcastChannel) {
    return true; // 이미 초기화됨
  }

  try {
    broadcastChannel = new BroadcastChannel(CHANNEL_NAME);

    broadcastChannel.onmessage = (event: MessageEvent<BroadcastMessage>) => {
      handleIncomingMessage(event.data);
    };

    broadcastChannel.onmessageerror = (event) => {
      console.error('BroadcastChannel message error:', event);
    };

    console.log(`BroadcastChannel initialized: ${TAB_ID}`);
    return true;
  } catch (error) {
    console.error('Failed to initialize BroadcastChannel:', error);
    initLocalStorageFallback();
    return false;
  }
}

/**
 * Broadcast Channel 종료
 */
export function closeBroadcastChannel(): void {
  if (broadcastChannel) {
    broadcastChannel.close();
    broadcastChannel = null;
  }

  // localStorage 이벤트 리스너 제거
  if (typeof window !== 'undefined') {
    window.removeEventListener('storage', handleStorageEvent);
  }
}

// ============================================
// LocalStorage Fallback
// ============================================

const STORAGE_KEY = 'mca-broadcast-message';

/**
 * localStorage 폴백 초기화
 */
function initLocalStorageFallback(): void {
  if (typeof window === 'undefined') return;

  window.addEventListener('storage', handleStorageEvent);
  console.log('Using localStorage fallback for cross-tab sync');
}

/**
 * localStorage 이벤트 핸들러
 */
function handleStorageEvent(event: StorageEvent): void {
  if (event.key !== STORAGE_KEY || !event.newValue) return;

  try {
    const message: BroadcastMessage = JSON.parse(event.newValue);
    // 자신이 보낸 메시지는 무시
    if (message.tabId === TAB_ID) return;

    handleIncomingMessage(message);
  } catch (error) {
    console.error('Failed to parse storage event:', error);
  }
}

/**
 * localStorage로 메시지 전송
 */
function sendViaLocalStorage(message: BroadcastMessage): void {
  if (typeof window === 'undefined') return;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(message));
  // 즉시 삭제하여 다음 메시지 전송 가능하게 함
  setTimeout(() => localStorage.removeItem(STORAGE_KEY), 100);
}

// ============================================
// Message Handling
// ============================================

/**
 * 수신 메시지 처리
 */
function handleIncomingMessage(message: BroadcastMessage): void {
  // 자신이 보낸 메시지는 무시
  if (message.tabId === TAB_ID) return;

  console.log(`[Broadcast] Received: ${message.type}`, message.payload);

  // 특정 이벤트 타입 콜백 실행
  const typeCallbacks = messageCallbacks.get(message.type);
  if (typeCallbacks) {
    typeCallbacks.forEach((callback) => callback(message));
  }

  // 와일드카드 콜백 실행
  const allCallbacks = messageCallbacks.get('*');
  if (allCallbacks) {
    allCallbacks.forEach((callback) => callback(message));
  }
}

// ============================================
// Send Messages
// ============================================

/**
 * 메시지 전송
 */
export function broadcast(type: BroadcastEventType, payload: unknown): void {
  const message: BroadcastMessage = {
    type,
    payload,
    timestamp: Date.now(),
    tabId: TAB_ID,
  };

  if (broadcastChannel) {
    broadcastChannel.postMessage(message);
  } else {
    sendViaLocalStorage(message);
  }

  console.log(`[Broadcast] Sent: ${type}`, payload);
}

/**
 * 포트폴리오 생성 이벤트
 */
export function broadcastPortfolioCreated(portfolio: Portfolio): void {
  broadcast('portfolio-created', { portfolio });
}

/**
 * 포트폴리오 업데이트 이벤트
 */
export function broadcastPortfolioUpdated(portfolio: Portfolio): void {
  broadcast('portfolio-updated', { portfolio });
}

/**
 * 포트폴리오 삭제 이벤트
 */
export function broadcastPortfolioDeleted(portfolioId: number): void {
  broadcast('portfolio-deleted', { portfolioId });
}

/**
 * 거래 토글 이벤트
 */
export function broadcastTradeToggled(portfolioId: number, step: number, status: string): void {
  broadcast('trade-toggled', { portfolioId, step, status });
}

/**
 * 설정 변경 이벤트
 */
export function broadcastSettingsChanged(settings: Partial<Settings>): void {
  broadcast('settings-changed', { settings });
}

/**
 * 테마 변경 이벤트
 */
export function broadcastThemeChanged(theme: 'light' | 'dark' | 'system'): void {
  broadcast('theme-changed', { theme });
}

/**
 * 동기화 요청
 */
export function requestSync(): void {
  broadcast('sync-request', { requesterId: TAB_ID });
}

/**
 * 동기화 응답
 */
export function respondToSync(data: { portfolios: Portfolio[]; settings: Settings }): void {
  broadcast('sync-response', data);
}

// ============================================
// Subscribe to Messages
// ============================================

/**
 * 메시지 구독
 */
export function subscribe(
  eventType: BroadcastEventType | '*',
  callback: MessageCallback
): () => void {
  let callbacks = messageCallbacks.get(eventType);
  if (!callbacks) {
    callbacks = new Set();
    messageCallbacks.set(eventType, callbacks);
  }

  callbacks.add(callback);

  // 구독 해제 함수 반환
  return () => {
    messageCallbacks.get(eventType)?.delete(callback);
  };
}

/**
 * 포트폴리오 생성 이벤트 구독
 */
export function onPortfolioCreated(callback: (portfolio: Portfolio) => void): () => void {
  return subscribe('portfolio-created', (msg) => {
    callback((msg.payload as { portfolio: Portfolio }).portfolio);
  });
}

/**
 * 포트폴리오 업데이트 이벤트 구독
 */
export function onPortfolioUpdated(callback: (portfolio: Portfolio) => void): () => void {
  return subscribe('portfolio-updated', (msg) => {
    callback((msg.payload as { portfolio: Portfolio }).portfolio);
  });
}

/**
 * 포트폴리오 삭제 이벤트 구독
 */
export function onPortfolioDeleted(callback: (portfolioId: number) => void): () => void {
  return subscribe('portfolio-deleted', (msg) => {
    callback((msg.payload as { portfolioId: number }).portfolioId);
  });
}

/**
 * 거래 토글 이벤트 구독
 */
export function onTradeToggled(
  callback: (data: { portfolioId: number; step: number; status: string }) => void
): () => void {
  return subscribe('trade-toggled', (msg) => {
    callback(msg.payload as { portfolioId: number; step: number; status: string });
  });
}

/**
 * 설정 변경 이벤트 구독
 */
export function onSettingsChanged(callback: (settings: Partial<Settings>) => void): () => void {
  return subscribe('settings-changed', (msg) => {
    callback((msg.payload as { settings: Partial<Settings> }).settings);
  });
}

/**
 * 테마 변경 이벤트 구독
 */
export function onThemeChanged(callback: (theme: 'light' | 'dark' | 'system') => void): () => void {
  return subscribe('theme-changed', (msg) => {
    callback((msg.payload as { theme: 'light' | 'dark' | 'system' }).theme);
  });
}

/**
 * 동기화 요청 이벤트 구독
 */
export function onSyncRequest(callback: (requesterId: string) => void): () => void {
  return subscribe('sync-request', (msg) => {
    callback((msg.payload as { requesterId: string }).requesterId);
  });
}

/**
 * 동기화 응답 이벤트 구독
 */
export function onSyncResponse(
  callback: (data: { portfolios: Portfolio[]; settings: Settings }) => void
): () => void {
  return subscribe('sync-response', (msg) => {
    callback(msg.payload as { portfolios: Portfolio[]; settings: Settings });
  });
}

// ============================================
// Utility
// ============================================

/**
 * 현재 탭 ID 반환
 */
export function getTabId(): string {
  return TAB_ID;
}

/**
 * 모든 구독 해제
 */
export function unsubscribeAll(): void {
  messageCallbacks.clear();
}

/**
 * 활성 구독 수 반환
 */
export function getSubscriptionCount(): number {
  let count = 0;
  messageCallbacks.forEach((callbacks) => {
    count += callbacks.size;
  });
  return count;
}

// ============================================
// React Hook Support
// ============================================

/**
 * React useEffect에서 사용할 수 있는 초기화 함수
 */
export function useBroadcastChannelEffect(
  onMessage?: (message: BroadcastMessage) => void
): {
  init: () => void;
  cleanup: () => void;
  broadcast: typeof broadcast;
} {
  const init = () => {
    initBroadcastChannel();
    if (onMessage) {
      subscribe('*', onMessage);
    }
  };

  const cleanup = () => {
    unsubscribeAll();
    closeBroadcastChannel();
  };

  return { init, cleanup, broadcast };
}
