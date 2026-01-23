// ============================================
// Portfolio Store (Zustand)
// ============================================

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import type { Portfolio, Trade, PortfolioStats } from '@/types';
import * as db from '@/services/database';
import { calculatePortfolioStats } from '@/services/calculation';
import { DEFAULT_PORTFOLIO_PARAMS } from '@/utils/constants';

interface PortfolioState {
  // State
  portfolios: Portfolio[];
  activePortfolioId: number | null;
  trades: Map<number, Trade[]>;
  isLoading: boolean;
  error: string | null;

  // Computed (cached)
  portfolioStats: Map<number, PortfolioStats>;

  // Actions
  initialize: () => Promise<void>;
  setActivePortfolio: (id: number | null) => void;

  // Portfolio CRUD
  addPortfolio: (name?: string) => Promise<number>;
  updatePortfolio: (id: number, updates: Partial<Portfolio>) => Promise<void>;
  deletePortfolio: (id: number) => Promise<void>;
  toggleFavorite: (id: number) => Promise<void>;

  // Trade Operations
  loadTradesForPortfolio: (portfolioId: number) => Promise<void>;
  toggleOrderedStep: (portfolioId: number, step: number) => Promise<void>;
  toggleExecutedStep: (portfolioId: number, step: number) => Promise<void>;

  // Bulk Operations
  refreshPortfolioStats: (portfolioId: number) => void;
  refreshAllStats: () => void;
}

export const usePortfolioStore = create<PortfolioState>()(
  devtools(
    (set, get) => ({
      portfolios: [],
      activePortfolioId: null,
      trades: new Map(),
      isLoading: false,
      error: null,
      portfolioStats: new Map(),

      initialize: async () => {
        set({ isLoading: true, error: null });
        try {
          const portfolios = await db.getAllPortfolios();
          set({ portfolios, isLoading: false });
          get().refreshAllStats();

          // Set active portfolio to first one if none selected
          if (portfolios.length > 0 && !get().activePortfolioId) {
            set({ activePortfolioId: portfolios[0].id });
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to load portfolios',
            isLoading: false,
          });
        }
      },

      setActivePortfolio: (id) => {
        set({ activePortfolioId: id });
        if (id !== null) {
          get().loadTradesForPortfolio(id);
        }
      },

      addPortfolio: async (name = '새 종목') => {
        const newPortfolio: Omit<Portfolio, 'id'> = {
          name,
          isFavorite: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          params: { ...DEFAULT_PORTFOLIO_PARAMS },
        };

        const id = await db.addPortfolio(newPortfolio);
        const portfolio = await db.getPortfolio(id);

        if (portfolio) {
          set((state) => ({
            portfolios: [...state.portfolios, portfolio],
            activePortfolioId: id,
          }));
          get().refreshPortfolioStats(id);
        }

        return id;
      },

      updatePortfolio: async (id, updates) => {
        await db.updatePortfolio(id, updates);

        set((state) => ({
          portfolios: state.portfolios.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
          ),
        }));

        get().refreshPortfolioStats(id);
      },

      deletePortfolio: async (id) => {
        await db.deletePortfolio(id);

        set((state) => {
          const newPortfolios = state.portfolios.filter((p) => p.id !== id);
          const newTrades = new Map(state.trades);
          newTrades.delete(id);

          const newStats = new Map(state.portfolioStats);
          newStats.delete(id);

          return {
            portfolios: newPortfolios,
            trades: newTrades,
            portfolioStats: newStats,
            activePortfolioId:
              state.activePortfolioId === id
                ? newPortfolios[0]?.id ?? null
                : state.activePortfolioId,
          };
        });
      },

      toggleFavorite: async (id) => {
        const portfolio = get().portfolios.find((p) => p.id === id);
        if (!portfolio) return;

        await db.updatePortfolio(id, { isFavorite: !portfolio.isFavorite });

        set((state) => ({
          portfolios: state.portfolios.map((p) =>
            p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
          ),
        }));
      },

      loadTradesForPortfolio: async (portfolioId) => {
        const trades = await db.getTradesForPortfolio(portfolioId);
        set((state) => {
          const newTrades = new Map(state.trades);
          newTrades.set(portfolioId, trades);
          return { trades: newTrades };
        });
      },

      toggleOrderedStep: async (portfolioId, step) => {
        const portfolio = get().portfolios.find((p) => p.id === portfolioId);
        if (!portfolio) return;

        const currentTrades = get().trades.get(portfolioId) || [];
        const existingTrade = currentTrades.find((t) => t.step === step);

        if (existingTrade && existingTrade.status !== 'pending') {
          // Remove from ordered (and executed if applicable)
          await db.deleteTrade(existingTrade.id!);
        } else {
          // Add to ordered
          await db.upsertTrade(portfolioId, step, {
            status: 'ordered',
            orderedAt: new Date(),
          });
        }

        await get().loadTradesForPortfolio(portfolioId);
        get().refreshPortfolioStats(portfolioId);
      },

      toggleExecutedStep: async (portfolioId, step) => {
        const portfolio = get().portfolios.find((p) => p.id === portfolioId);
        if (!portfolio) return;

        const currentTrades = get().trades.get(portfolioId) || [];
        const existingTrade = currentTrades.find((t) => t.step === step);

        if (existingTrade?.status === 'executed') {
          // Downgrade to ordered
          await db.updateTrade(existingTrade.id!, {
            status: 'ordered',
            executedAt: undefined,
          });
        } else {
          // Upgrade to executed (ensure it's ordered first)
          await db.upsertTrade(portfolioId, step, {
            status: 'executed',
            orderedAt: existingTrade?.orderedAt || new Date(),
            executedAt: new Date(),
          });
        }

        await get().loadTradesForPortfolio(portfolioId);
        get().refreshPortfolioStats(portfolioId);
      },

      refreshPortfolioStats: (portfolioId) => {
        const portfolio = get().portfolios.find((p) => p.id === portfolioId);
        if (!portfolio) return;

        const trades = get().trades.get(portfolioId) || [];
        const orderedSteps = trades
          .filter((t) => t.status === 'ordered' || t.status === 'executed')
          .map((t) => t.step);
        const executedSteps = trades
          .filter((t) => t.status === 'executed')
          .map((t) => t.step);

        const stats = calculatePortfolioStats(portfolio.params, orderedSteps, executedSteps);

        set((state) => {
          const newStats = new Map(state.portfolioStats);
          newStats.set(portfolioId, stats);
          return { portfolioStats: newStats };
        });
      },

      refreshAllStats: () => {
        const { portfolios, trades } = get();

        const newStats = new Map<number, PortfolioStats>();

        for (const portfolio of portfolios) {
          if (!portfolio.id) continue;

          const portfolioTrades = trades.get(portfolio.id) || [];
          const orderedSteps = portfolioTrades
            .filter((t) => t.status === 'ordered' || t.status === 'executed')
            .map((t) => t.step);
          const executedSteps = portfolioTrades
            .filter((t) => t.status === 'executed')
            .map((t) => t.step);

          const stats = calculatePortfolioStats(portfolio.params, orderedSteps, executedSteps);
          newStats.set(portfolio.id, stats);
        }

        set({ portfolioStats: newStats });
      },
    }),
    { name: 'portfolio-store' }
  )
);

// Selectors
export const selectActivePortfolio = (state: PortfolioState) =>
  state.portfolios.find((p) => p.id === state.activePortfolioId);

export const selectPortfolioTrades = (state: PortfolioState, portfolioId: number) =>
  state.trades.get(portfolioId) || [];

export const selectPortfolioStats = (state: PortfolioState, portfolioId: number) =>
  state.portfolioStats.get(portfolioId);

// Internal selector - creates new array, use with useShallow or useSortedPortfolios hook
const sortPortfolios = (portfolios: Portfolio[]) =>
  [...portfolios].sort((a, b) => {
    // Favorites first
    if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1;
    // Then by creation date
    return a.createdAt.getTime() - b.createdAt.getTime();
  });

// Safe selector using useShallow - prevents infinite re-renders
export const selectSortedPortfolios = (state: PortfolioState) =>
  sortPortfolios(state.portfolios);

// Hook for sorted portfolios with shallow comparison (recommended)
export function useSortedPortfolios() {
  return usePortfolioStore(
    useShallow((state) => sortPortfolios(state.portfolios))
  );
}
