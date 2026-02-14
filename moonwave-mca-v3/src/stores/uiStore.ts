// ============================================
// UI Store (Zustand)
// ============================================

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  action?: ToastAction;
}

interface UIState {
  // Navigation
  currentView: 'dashboard' | 'detail' | 'settings';

  // Toast
  toasts: Toast[];

  // Modal
  isModalOpen: boolean;
  modalContent: React.ReactNode | null;

  // Settings Modal
  isSettingsModalOpen: boolean;

  // Terms Modal
  isTermsModalOpen: boolean;

  // FAQ Modal
  isFAQModalOpen: boolean;

  // Handbook Modal
  isHandbookOpen: boolean;
  handbookSection: string | null;
  handbookAnchor: string | null;
  handbookEffortLevel: 'low' | 'medium' | 'high';

  // Search
  searchQuery: string;
  isHeaderSearchOpen: boolean; // Managed globally for trigger consistency

  // Loading States
  isGlobalLoading: boolean;
  loadingMessage: string | null;

  // Sidebar (desktop)
  isSidebarCollapsed: boolean;

  // Mobile menu
  isMobileMenuOpen: boolean;

  // Onboarding Tour
  isTourActive: boolean;

  // Actions
  setView: (view: 'dashboard' | 'detail' | 'settings') => void;

  // Toast Actions
  showToast: (message: string, type?: ToastType, duration?: number, action?: ToastAction) => void;
  dismissToast: (id: string) => void;
  clearAllToasts: () => void;
  pauseToast: (id: string) => void;
  resumeToast: (id: string) => void;

  // Modal Actions
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;

  // Settings Modal Actions
  openSettingsModal: () => void;
  closeSettingsModal: () => void;

  // Terms Modal Actions
  openTermsModal: () => void;
  closeTermsModal: () => void;

  // FAQ Modal Actions
  openFAQModal: () => void;
  closeFAQModal: () => void;

  // Handbook Modal Actions
  openHandbook: (sectionId?: string, anchorId?: string) => void;
  closeHandbook: () => void;
  setHandbookSection: (sectionId: string) => void;
  setHandbookAnchor: (anchorId: string | null) => void;
  setHandbookEffortLevel: (level: 'low' | 'medium' | 'high') => void;

  // Search Actions
  setSearchQuery: (query: string) => void;
  setHeaderSearchOpen: (isOpen: boolean) => void;
  clearSearch: () => void;

  // Loading Actions
  setGlobalLoading: (isLoading: boolean, message?: string) => void;

  // Sidebar Actions
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Mobile Menu Actions
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;

  // Onboarding Tour Actions
  startTour: () => void;
  endTour: () => void;
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
      isSettingsModalOpen: false,
      isTermsModalOpen: false,
      searchQuery: '',
      isHeaderSearchOpen: false,
      isGlobalLoading: false,
      loadingMessage: null,
      isSidebarCollapsed: false,
      isMobileMenuOpen: false,
      isTourActive: false,

      // Navigation
      setView: (view) => {
        set({ currentView: view });
        get().closeMobileMenu();
      },

      // Toast
      showToast: (message, type = 'info', duration = 3000, action?) => {
        const id = `toast-${++toastIdCounter}`;
        const toast: Toast = { id, message, type, duration, action };

        set((state) => ({
          toasts: [...state.toasts, toast],
        }));
      },

      dismissToast: (id) => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      },

      clearAllToasts: () => {
        set({ toasts: [] });
      },

      pauseToast: (_id: string) => {},
      resumeToast: (_id: string) => {},

      // Modal
      openModal: (content) => {
        set({ isModalOpen: true, modalContent: content });
      },

      closeModal: () => {
        set({ isModalOpen: false, modalContent: null });
      },

      // Settings Modal
      openSettingsModal: () => {
        set({ isSettingsModalOpen: true });
      },

      closeSettingsModal: () => {
        set({ isSettingsModalOpen: false });
      },

      // Terms Modal
      openTermsModal: () => {
        set({ isTermsModalOpen: true });
      },

      closeTermsModal: () => {
        set({ isTermsModalOpen: false });
      },

      // FAQ Modal
      isFAQModalOpen: false,
      openFAQModal: () => {
        set({ isFAQModalOpen: true });
      },

      closeFAQModal: () => {
        set({ isFAQModalOpen: false });
      },

      // Handbook Modal
      isHandbookOpen: false,
      handbookSection: null,
      handbookAnchor: null,
      handbookEffortLevel: 'medium',
      openHandbook: (sectionId, anchorId) => {
        set({
          isHandbookOpen: true,
          ...(sectionId && { handbookSection: sectionId }),
          ...(anchorId && { handbookAnchor: anchorId }),
        });
      },
      closeHandbook: () => {
        set({ isHandbookOpen: false, handbookSection: null, handbookAnchor: null });
      },
      setHandbookSection: (sectionId) => {
        set({ handbookSection: sectionId });
      },
      setHandbookAnchor: (anchorId) => {
        set({ handbookAnchor: anchorId });
      },
      setHandbookEffortLevel: (level) => {
        set({ handbookEffortLevel: level });
      },

      // Search
      setSearchQuery: (query) => {
        set({ searchQuery: query });
      },

      setHeaderSearchOpen: (isOpen) => {
        set({ isHeaderSearchOpen: isOpen });
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

      // Onboarding Tour
      startTour: () => {
        set({ isTourActive: true });
      },

      endTour: () => {
        set({ isTourActive: false });
      },
    }),
    { name: 'ui-store' }
  )
);

// Convenience hooks for specific states
export const useToasts = () => useUIStore((state) => state.toasts);
