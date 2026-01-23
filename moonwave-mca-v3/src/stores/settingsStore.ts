// ============================================
// Settings Store (Zustand)
// ============================================

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Settings, ThemeMode } from '@/types';
import * as db from '@/services/database';
import { DEFAULT_SETTINGS, STORAGE_KEYS } from '@/utils/constants';

interface SettingsState {
  settings: Settings;
  isLoading: boolean;

  // Actions
  initialize: () => Promise<void>;
  updateSettings: (updates: Partial<Settings>) => Promise<void>;
  setTheme: (theme: ThemeMode) => void;
  setInitialCash: (amount: number) => Promise<void>;
  toggleNotifications: () => Promise<void>;
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
      }),
      {
        name: STORAGE_KEYS.THEME,
        partialize: (state) => ({ settings: { theme: state.settings.theme } }),
      }
    ),
    { name: 'settings-store' }
  )
);

// Initialize theme on load (before React hydration)
if (typeof window !== 'undefined') {
  const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
  if (savedTheme) {
    try {
      const parsed = JSON.parse(savedTheme);
      if (parsed?.state?.settings?.theme) {
        applyTheme(parsed.state.settings.theme);
      }
    } catch {
      // Fallback to system theme
      applyTheme('system');
    }
  } else {
    applyTheme('system');
  }
}
