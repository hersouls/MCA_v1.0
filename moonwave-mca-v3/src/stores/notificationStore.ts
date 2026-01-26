// ============================================
// Notification Store (Zustand)
// ============================================

import type { AppNotification, NotificationPreferences, Portfolio, PortfolioStats } from '@/types';
import { DEFAULT_NOTIFICATION_PREFERENCES } from '@/utils/constants';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Helper to check if notification type is enabled in preferences
function isNotificationEnabled(
  type: AppNotification['type'],
  prefs: NotificationPreferences
): boolean {
  switch (type) {
    case 'gap-warning':
      return prefs.gapWarning;
    case 'backup-reminder':
      return prefs.backupReminder;
    case 'grade-change':
      return prefs.gradeChange;
    case 'price-alert':
      return true; // Not configurable yet
    default:
      return true;
  }
}

// Get notification preferences from settings store (lazy import to avoid circular dependency)
function getNotificationPreferences(): NotificationPreferences {
  try {
    // Dynamic import to avoid circular dependency
    const settingsData = localStorage.getItem('mca-theme');
    if (settingsData) {
      const parsed = JSON.parse(settingsData);
      return parsed?.state?.settings?.notificationPreferences || DEFAULT_NOTIFICATION_PREFERENCES;
    }
  } catch {
    // Ignore parse errors
  }
  return DEFAULT_NOTIFICATION_PREFERENCES;
}

const MAX_NOTIFICATIONS = 50;
const BACKUP_REMINDER_DAYS = 7;
const NOTIFICATION_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours
const NOTIFICATION_EXPIRY_DAYS = 7;

interface NotificationState {
  notifications: AppNotification[];
  lastTriggered: Record<string, number>; // key -> timestamp for cooldown tracking

  // Actions
  addNotification: (notification: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  dismissByType: (type: AppNotification['type'], portfolioId?: number) => void;
  cleanupExpired: () => void;

  // Helpers
  checkGapWarnings: (portfolios: Portfolio[], stats: Map<number, PortfolioStats>) => void;
  checkBackupReminder: (lastBackupDate?: Date) => void;
}

// Generate unique notification key for deduplication
function getNotificationKey(type: AppNotification['type'], portfolioId?: number): string {
  return `${type}-${portfolioId || 'global'}`;
}

export const useNotificationStore = create<NotificationState>()(
  devtools(
    persist(
      (set, get) => ({
        notifications: [],
        lastTriggered: {},

        addNotification: (notification) => {
          // Check if this notification type is enabled in preferences
          const prefs = getNotificationPreferences();
          if (!isNotificationEnabled(notification.type, prefs)) {
            return;
          }

          const key = getNotificationKey(notification.type, notification.portfolioId);
          const now = Date.now();

          // Check cooldown - skip if triggered within cooldown period
          const lastTrigger = get().lastTriggered[key];
          if (lastTrigger && now - lastTrigger < NOTIFICATION_COOLDOWN_MS) {
            return;
          }

          // Skip if unread notification with same key exists
          const existing = get().notifications.find(
            (n) => !n.read && getNotificationKey(n.type, n.portfolioId) === key
          );
          if (existing) return;

          const newNotification: AppNotification = {
            ...notification,
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date(),
            read: false,
          };

          set((state) => {
            // Add new notification at the beginning
            const updated = [newNotification, ...state.notifications];

            // Update lastTriggered timestamp
            const newLastTriggered = { ...state.lastTriggered, [key]: now };

            // Keep only MAX_NOTIFICATIONS
            if (updated.length > MAX_NOTIFICATIONS) {
              return {
                notifications: updated.slice(0, MAX_NOTIFICATIONS),
                lastTriggered: newLastTriggered,
              };
            }

            return { notifications: updated, lastTriggered: newLastTriggered };
          });
        },

        markAsRead: (id) => {
          set((state) => ({
            notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
          }));
        },

        markAllAsRead: () => {
          set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, read: true })),
          }));
        },

        removeNotification: (id) => {
          set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
          }));
        },

        clearAll: () => {
          set({ notifications: [], lastTriggered: {} });
        },

        dismissByType: (type, portfolioId) => {
          const key = getNotificationKey(type, portfolioId);
          set((state) => ({
            notifications: state.notifications.filter(
              (n) => getNotificationKey(n.type, n.portfolioId) !== key
            ),
          }));
        },

        cleanupExpired: () => {
          const expiryMs = NOTIFICATION_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
          const now = Date.now();

          set((state) => {
            const validNotifications = state.notifications.filter((n) => {
              const createdTime = new Date(n.createdAt).getTime();
              return now - createdTime < expiryMs;
            });

            // Also cleanup old lastTriggered entries
            const validLastTriggered: Record<string, number> = {};
            for (const [key, timestamp] of Object.entries(state.lastTriggered)) {
              if (now - timestamp < expiryMs) {
                validLastTriggered[key] = timestamp;
              }
            }

            return {
              notifications: validNotifications,
              lastTriggered: validLastTriggered,
            };
          });
        },

        checkGapWarnings: (portfolios, stats) => {
          for (const portfolio of portfolios) {
            if (!portfolio.id) continue;

            const portfolioStats = stats.get(portfolio.id);
            if (portfolioStats?.hasGap) {
              get().addNotification({
                type: 'gap-warning',
                title: portfolio.name,
                message: `주문 괴리 발생 (${portfolioStats.gap}구간 초과)`,
                portfolioId: portfolio.id,
              });
            }
          }
        },

        checkBackupReminder: (lastBackupDate) => {
          if (!lastBackupDate) {
            // No backup ever - remind
            get().addNotification({
              type: 'backup-reminder',
              title: '백업 알림',
              message: '데이터 백업을 한 번도 하지 않았습니다. 백업을 권장합니다.',
            });
            return;
          }

          const daysSinceBackup = Math.floor(
            (Date.now() - new Date(lastBackupDate).getTime()) / (1000 * 60 * 60 * 24)
          );

          if (daysSinceBackup >= BACKUP_REMINDER_DAYS) {
            get().addNotification({
              type: 'backup-reminder',
              title: '백업 알림',
              message: `마지막 백업 후 ${daysSinceBackup}일이 경과했습니다. 백업을 권장합니다.`,
            });
          }
        },
      }),
      {
        name: 'mca-notifications',
        // Serialize Date objects
        storage: {
          getItem: (name) => {
            const str = localStorage.getItem(name);
            if (!str) return null;

            const data = JSON.parse(str);
            // Rehydrate Date objects
            if (data.state?.notifications) {
              data.state.notifications = data.state.notifications.map((n: AppNotification) => ({
                ...n,
                createdAt: new Date(n.createdAt),
              }));
            }
            return data;
          },
          setItem: (name, value) => {
            localStorage.setItem(name, JSON.stringify(value));
          },
          removeItem: (name) => {
            localStorage.removeItem(name);
          },
        },
      }
    ),
    { name: 'notification-store' }
  )
);

// Selectors
const selectUnreadCount = (state: NotificationState) =>
  state.notifications.filter((n) => !n.read).length;

// Hook for unread count
export function useUnreadCount() {
  return useNotificationStore(selectUnreadCount);
}
