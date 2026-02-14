import { useUIStore } from '@/stores/uiStore';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useKeyboardShortcuts() {
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isModKey = e.metaKey || e.ctrlKey;

      // Don't trigger in input/textarea elements
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        // Only allow Escape in inputs
        if (e.key !== 'Escape') return;
      }

      // Ctrl/Cmd+K — Open search
      if (isModKey && e.key === 'k') {
        e.preventDefault();
        useUIStore.getState().setHeaderSearchOpen(true);
      }

      // Ctrl/Cmd+, — Open settings
      if (isModKey && e.key === ',') {
        e.preventDefault();
        useUIStore.getState().openSettingsModal();
      }

      // Escape — Close modals/search
      if (e.key === 'Escape') {
        const state = useUIStore.getState();
        if (state.isHeaderSearchOpen) {
          state.setHeaderSearchOpen(false);
          state.setSearchQuery('');
        }
      }

      // Ctrl/Cmd+N — New portfolio (navigate to dashboard first if needed)
      if (isModKey && e.key === 'n') {
        e.preventDefault();
        navigate('/dashboard');
        // The actual add will be handled by Dashboard
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate]);
}
