// ============================================
// Exchange Rate Store (Zustand)
// ============================================

import { fetchExchangeRate } from '@/services/exchangeRate';
import { DEFAULT_EXCHANGE_RATE } from '@/utils/constants';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ExchangeRateState {
  rate: number;
  lastFetched: Date | null;
  isManual: boolean;
  isLoading: boolean;
  error: string | null;

  initialize: () => Promise<void>;
  fetchRate: () => Promise<void>;
  setManualRate: (rate: number) => void;
  clearManualRate: () => void;
}

export const useExchangeRateStore = create<ExchangeRateState>()(
  devtools(
    (set, get) => ({
      rate: DEFAULT_EXCHANGE_RATE,
      lastFetched: null,
      isManual: false,
      isLoading: false,
      error: null,

      initialize: async () => {
        await get().fetchRate();
      },

      fetchRate: async () => {
        if (get().isManual) return;

        set({ isLoading: true, error: null });
        try {
          const rate = await fetchExchangeRate();
          set({ rate, lastFetched: new Date(), isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch rate',
            isLoading: false,
          });
        }
      },

      setManualRate: (rate) => {
        set({ rate, isManual: true, lastFetched: new Date() });
      },

      clearManualRate: () => {
        set({ isManual: false });
        get().fetchRate();
      },
    }),
    { name: 'exchange-rate-store' }
  )
);
