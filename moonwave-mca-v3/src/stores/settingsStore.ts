// ============================================
// Settings Store (Zustand)
// ============================================

import * as db from '@/services/database';
import type { ColorPalette, NotificationPreferences, Settings, ThemeMode } from '@/types';
import { DEFAULT_SETTINGS, STORAGE_KEYS } from '@/utils/constants';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { useNotificationStore } from './notificationStore';

interface SettingsState {
  settings: Settings;
  isLoading: boolean;

  // Actions
  initialize: () => Promise<void>;
  updateSettings: (updates: Partial<Settings>) => Promise<void>;
  setTheme: (theme: ThemeMode) => void;
  setColorPalette: (palette: ColorPalette) => void;
  setInitialCash: (amount: number) => Promise<void>;
  toggleNotifications: () => Promise<void>;
  toggleNotificationPreference: (key: keyof NotificationPreferences) => Promise<void>;
  toggleMusicPlayer: () => Promise<void>;
  setLastBackupDate: (date: Date) => Promise<void>;
}

// Apply theme to document
function applyTheme(theme: ThemeMode) {
  const root = document.documentElement;

  if (theme === 'system') {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.toggle('dark', isDark);
  } else {
    root.classList.toggle('dark', theme === 'dark');
  }
}

// Apply color palette to document (light mode only)
function applyColorPalette(palette: ColorPalette) {
  const root = document.documentElement;
  if (palette === 'default') {
    root.removeAttribute('data-palette');
  } else {
    root.setAttribute('data-palette', palette);
  }
}

// Listen for system theme changes
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const settings = useSettingsStore.getState().settings;
    if (settings.theme === 'system') {
      document.documentElement.classList.toggle('dark', e.matches);
    }
  });
}

export const useSettingsStore = create<SettingsState>()(
  devtools(
    persist(
      (set, get) => ({
        settings: DEFAULT_SETTINGS,
        isLoading: false,

        initialize: async () => {
          set({ isLoading: true });
          try {
            const settings = await db.getSettings();
            set({ settings, isLoading: false });
            applyTheme(settings.theme);
            applyColorPalette(settings.colorPalette || 'default');
          } catch (error) {
            console.error('Failed to load settings:', error);
            set({ isLoading: false });
          }
        },

        updateSettings: async (updates) => {
          const newSettings = { ...get().settings, ...updates };
          await db.updateSettings(newSettings);
          set({ settings: newSettings });

          if (updates.theme) {
            applyTheme(updates.theme);
          }
        },

        setTheme: (theme) => {
          const settings = { ...get().settings, theme };
          set({ settings });
          db.updateSettings({ theme });
          applyTheme(theme);
        },

        setColorPalette: (palette) => {
          const settings = { ...get().settings, colorPalette: palette };
          set({ settings });
          db.updateSettings({ colorPalette: palette });
          applyColorPalette(palette);
        },

        setInitialCash: async (amount) => {
          const settings = { ...get().settings, initialCash: amount };
          await db.updateSettings({ initialCash: amount });
          set({ settings });
        },

        toggleNotifications: async () => {
          const current = get().settings.notificationsEnabled;
          const newValue = !current;

          // Request permission if enabling
          if (newValue && 'Notification' in window) {
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
              return; // Don't enable if permission denied
            }
          }

          const settings = { ...get().settings, notificationsEnabled: newValue };
          await db.updateSettings({ notificationsEnabled: newValue });
          set({ settings });
        },

        toggleNotificationPreference: async (key) => {
          const currentPrefs = get().settings.notificationPreferences;
          const newPrefs = { ...currentPrefs, [key]: !currentPrefs[key] };
          const settings = { ...get().settings, notificationPreferences: newPrefs };
          await db.updateSettings({ notificationPreferences: newPrefs });
          set({ settings });
        },

        toggleMusicPlayer: async () => {
          const current = get().settings.isMusicPlayerEnabled;
          const newValue = !current;
          const settings = { ...get().settings, isMusicPlayerEnabled: newValue };
          await db.updateSettings({ isMusicPlayerEnabled: newValue });
          set({ settings });
        },

        setLastBackupDate: async (date) => {
          const settings = { ...get().settings, lastBackupDate: date };
          await db.updateSettings({ lastBackupDate: date });
          set({ settings });

          // Dismiss backup reminder notification after successful backup
          useNotificationStore.getState().dismissByType('backup-reminder');
        },
      }),
      {
        name: STORAGE_KEYS.THEME,
        partialize: (state) => ({
          settings: {
            theme: state.settings.theme,
            colorPalette: state.settings.colorPalette,
          }
        }),
      }
    ),
    { name: 'settings-store' }
  )
);

// Initialize theme and palette on load (before React hydration)
if (typeof window !== 'undefined') {
  const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
  if (savedTheme) {
    try {
      const parsed = JSON.parse(savedTheme);
      if (parsed?.state?.settings?.theme) {
        applyTheme(parsed.state.settings.theme);
      }
      if (parsed?.state?.settings?.colorPalette) {
        applyColorPalette(parsed.state.settings.colorPalette);
      }
    } catch {
      // Fallback to system theme
      applyTheme('system');
    }
  } else {
    applyTheme('system');
  }
}
