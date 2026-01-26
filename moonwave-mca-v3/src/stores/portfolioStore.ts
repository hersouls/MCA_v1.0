// ============================================
// Portfolio Store (Zustand)
// ============================================

import { calculatePortfolioStats } from '@/services/calculation';
import * as db from '@/services/database';
import type { Portfolio, PortfolioStats, Trade } from '@/types';
import { DEFAULT_PORTFOLIO_PARAMS } from '@/utils/constants';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { useNotificationStore } from './notificationStore';

// Sort portfolios helper (pure function)
function sortPortfolios(portfolios: Portfolio[]): Portfolio[] {
  return [...portfolios].sort((a, b) => {
    // Favorites first
    if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1;
    // Then by creation date
    return a.createdAt.getTime() - b.createdAt.getTime();
  });
}

interface PortfolioState {
  // State
  portfolios: Portfolio[];
  sortedPortfolios: Portfolio[]; // Cached sorted version
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
  addPortfolio: (
    stockOrName?: string | { name: string; code: string; market: string }
  ) => Promise<number>;
  updatePortfolio: (id: number, updates: Partial<Portfolio>) => Promise<void>;
  deletePortfolio: (id: number) => Promise<void>;
  toggleFavorite: (id: number) => Promise<void>;

  // Trade Operations
  loadTradesForPortfolio: (portfolioId: number) => Promise<void>;
  toggleOrderedStep: (portfolioId: number, step: number) => Promise<void>;
  toggleExecutedStep: (portfolioId: number, step: number) => Promise<void>;
  updateExecutionDate: (portfolioId: number, step: number, date: string) => Promise<void>;
  updateStepMemo: (portfolioId: number, step: number, memo: string) => Promise<void>;

  // Bulk Operations
  refreshPortfolioStats: (portfolioId: number) => void;
  refreshAllStats: () => void;
}

export const usePortfolioStore = create<PortfolioState>()(
  devtools(
    (set, get) => ({
      portfolios: [],
      sortedPortfolios: [],
      activePortfolioId: null,
      trades: new Map(),
      isLoading: false,
      error: null,
      portfolioStats: new Map(),

      initialize: async () => {
        set({ isLoading: true, error: null });
        try {
          const portfolios = await db.getAllPortfolios();
          set({ portfolios, sortedPortfolios: sortPortfolios(portfolios), isLoading: false });
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

      addPortfolio: async (stockOrName = '새 종목') => {
        let name = '새 종목';
        let stockCode: string | undefined;
        let market: string | undefined;

        if (typeof stockOrName === 'string') {
          name = stockOrName;
        } else if (stockOrName && typeof stockOrName === 'object') {
          name = stockOrName.name;
          stockCode = stockOrName.code;
          market = stockOrName.market;
        }

        const newPortfolio: Omit<Portfolio, 'id'> = {
          name,
          stockCode,
          market,
          isFavorite: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          params: { ...DEFAULT_PORTFOLIO_PARAMS },
        };

        // If we want to support storing ticker, we need to update types/index.ts first.
        // But the user request emphasized logic direction.
        // Quick fix: Just use name for now.

        const id = await db.addPortfolio(newPortfolio);
        const portfolio = await db.getPortfolio(id);

        if (portfolio) {
          set((state) => {
            const newPortfolios = [...state.portfolios, portfolio];
            return {
              portfolios: newPortfolios,
              sortedPortfolios: sortPortfolios(newPortfolios),
              activePortfolioId: id,
            };
          });
          get().refreshPortfolioStats(id);
        }

        return id;
      },

      updatePortfolio: async (id, updates) => {
        // Get old portfolio for comparison
        const oldPortfolio = get().portfolios.find((p) => p.id === id);
        const oldGrade = oldPortfolio?.fundamentalGrade;

        await db.updatePortfolio(id, updates);

        set((state) => {
          const newPortfolios = state.portfolios.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
          );
          return {
            portfolios: newPortfolios,
            sortedPortfolios: sortPortfolios(newPortfolios),
          };
        });

        // Check for grade change and notify
        if (updates.fundamentalGrade && oldGrade && updates.fundamentalGrade !== oldGrade) {
          const portfolio = get().portfolios.find((p) => p.id === id);
          if (portfolio) {
            useNotificationStore.getState().addNotification({
              type: 'grade-change',
              title: portfolio.name,
              message: `등급 변경: ${oldGrade} → ${updates.fundamentalGrade}`,
              portfolioId: id,
            });
          }
        }

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
            sortedPortfolios: sortPortfolios(newPortfolios),
            trades: newTrades,
            portfolioStats: newStats,
            activePortfolioId:
              state.activePortfolioId === id
                ? (newPortfolios[0]?.id ?? null)
                : state.activePortfolioId,
          };
        });
      },

      toggleFavorite: async (id) => {
        const portfolio = get().portfolios.find((p) => p.id === id);
        if (!portfolio) return;

        await db.updatePortfolio(id, { isFavorite: !portfolio.isFavorite });

        set((state) => {
          const newPortfolios = state.portfolios.map((p) =>
            p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
          );
          return {
            portfolios: newPortfolios,
            sortedPortfolios: sortPortfolios(newPortfolios),
          };
        });
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

      updateExecutionDate: async (portfolioId, step, date) => {
        const portfolio = get().portfolios.find((p) => p.id === portfolioId);
        if (!portfolio) return;

        const executionDates = { ...(portfolio.params.executionDates || {}), [step]: date };
        // Remove empty dates
        if (!date) delete executionDates[step];

        await db.updatePortfolio(portfolioId, {
          params: { ...portfolio.params, executionDates },
        });

        set((state) => {
          const newPortfolios = state.portfolios.map((p) =>
            p.id === portfolioId
              ? { ...p, params: { ...p.params, executionDates }, updatedAt: new Date() }
              : p
          );
          return {
            portfolios: newPortfolios,
            sortedPortfolios: sortPortfolios(newPortfolios),
          };
        });
      },

      updateStepMemo: async (portfolioId, step, memo) => {
        const portfolio = get().portfolios.find((p) => p.id === portfolioId);
        if (!portfolio) return;

        const stepMemos = { ...(portfolio.params.stepMemos || {}), [step]: memo };
        // Remove empty memos
        if (!memo) delete stepMemos[step];

        await db.updatePortfolio(portfolioId, {
          params: { ...portfolio.params, stepMemos },
        });

        set((state) => {
          const newPortfolios = state.portfolios.map((p) =>
            p.id === portfolioId
              ? { ...p, params: { ...p.params, stepMemos }, updatedAt: new Date() }
              : p
          );
          return {
            portfolios: newPortfolios,
            sortedPortfolios: sortPortfolios(newPortfolios),
          };
        });
      },

      refreshPortfolioStats: (portfolioId) => {
        const portfolio = get().portfolios.find((p) => p.id === portfolioId);
        if (!portfolio) return;

        const trades = get().trades.get(portfolioId) || [];
        const orderedSteps = trades
          .filter((t) => t.status === 'ordered' || t.status === 'executed')
          .map((t) => t.step);
        const executedSteps = trades.filter((t) => t.status === 'executed').map((t) => t.step);

        const stats = calculatePortfolioStats(portfolio.params, orderedSteps, executedSteps);

        set((state) => {
          const newStats = new Map(state.portfolioStats);
          newStats.set(portfolioId, stats);
          return { portfolioStats: newStats };
        });

        // Check for gap warning - add or dismiss notification based on gap status
        if (portfolio.id) {
          const notificationStore = useNotificationStore.getState();
          if (stats.hasGap) {
            notificationStore.addNotification({
              type: 'gap-warning',
              title: portfolio.name,
              message: `주문 괴리 발생 (${stats.gap}구간 초과)`,
              portfolioId: portfolio.id,
            });
          } else {
            // Gap resolved - dismiss any existing gap warning for this portfolio
            notificationStore.dismissByType('gap-warning', portfolio.id);
          }
        }
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
export const selectPortfolioStats = (state: PortfolioState, portfolioId: number) =>
  state.portfolioStats.get(portfolioId);

// Hook for sorted portfolios (recommended - uses cached state)
export function useSortedPortfolios() {
  return usePortfolioStore((state) => state.sortedPortfolios);
}
