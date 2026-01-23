// ============================================
// UI Store (Zustand)
// ============================================

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface UIState {
  // Navigation
  currentView: 'dashboard' | 'detail' | 'settings';

  // Toast
  toasts: Toast[];

  // Modal
  isModalOpen: boolean;
  modalContent: React.ReactNode | null;

  // Search
  searchQuery: string;

  // Loading States
  isGlobalLoading: boolean;
  loadingMessage: string | null;

  // Sidebar (desktop)
  isSidebarCollapsed: boolean;

  // Mobile menu
  isMobileMenuOpen: boolean;

  // Actions
  setView: (view: 'dashboard' | 'detail' | 'settings') => void;

  // Toast Actions
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  dismissToast: (id: string) => void;
  clearAllToasts: () => void;

  // Modal Actions
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;

  // Search Actions
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;

  // Loading Actions
  setGlobalLoading: (isLoading: boolean, message?: string) => void;

  // Sidebar Actions
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Mobile Menu Actions
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
}

let toastIdCounter = 0;

export const useUIStore = create<UIState>()(
  devtools(
    (set, get) => ({
      // Initial State
      currentView: 'dashboard',
      toasts: [],
      isModalOpen: false,
      modalContent: null,
      searchQuery: '',
      isGlobalLoading: false,
      loadingMessage: null,
      isSidebarCollapsed: false,
      isMobileMenuOpen: false,

      // Navigation
      setView: (view) => {
        set({ currentView: view });
        get().closeMobileMenu();
      },

      // Toast
      showToast: (message, type = 'info', duration = 3000) => {
        const id = `toast-${++toastIdCounter}`;
        const toast: Toast = { id, message, type, duration };

        set((state) => ({
          toasts: [...state.toasts, toast],
        }));

        // Auto dismiss
        if (duration > 0) {
          setTimeout(() => {
            get().dismissToast(id);
          }, duration);
        }
      },

      dismissToast: (id) => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      },

      clearAllToasts: () => {
        set({ toasts: [] });
      },

      // Modal
      openModal: (content) => {
        set({ isModalOpen: true, modalContent: content });
      },

      closeModal: () => {
        set({ isModalOpen: false, modalContent: null });
      },

      // Search
      setSearchQuery: (query) => {
        set({ searchQuery: query });
      },

      clearSearch: () => {
        set({ searchQuery: '' });
      },

      // Loading
      setGlobalLoading: (isLoading, message) => {
        set({ isGlobalLoading: isLoading, loadingMessage: message ?? null });
      },

      // Sidebar
      toggleSidebar: () => {
        set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed }));
      },

      setSidebarCollapsed: (collapsed) => {
        set({ isSidebarCollapsed: collapsed });
      },

      // Mobile Menu
      toggleMobileMenu: () => {
        set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen }));
      },

      closeMobileMenu: () => {
        set({ isMobileMenuOpen: false });
      },
    }),
    { name: 'ui-store' }
  )
);

// Convenience hooks for specific states
export const useToasts = () => useUIStore((state) => state.toasts);
export const useCurrentView = () => useUIStore((state) => state.currentView);
export const useSearchQuery = () => useUIStore((state) => state.searchQuery);
