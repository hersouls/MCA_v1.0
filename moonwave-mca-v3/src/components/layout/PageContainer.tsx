// ============================================
// Page Container Component
// ============================================

import { type ReactNode } from 'react';
import { clsx } from 'clsx';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: boolean;
}

const maxWidthStyles = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  '2xl': 'max-w-screen-2xl',
  full: 'max-w-full',
};

export function PageContainer({
  children,
  className,
  maxWidth = '2xl',
  padding = true,
}: PageContainerProps) {
  return (
    <main
      className={clsx(
        'flex-1 overflow-y-auto',
        padding && 'p-4 lg:p-6',
        'pb-20 lg:pb-6', // Extra padding for mobile bottom nav
        className
      )}
    >
      <div className={clsx('mx-auto', maxWidthStyles[maxWidth])}>{children}</div>
    </main>
  );
}

// Page Header (Golden Ratio Typography: 26px title)
interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  breadcrumb?: ReactNode;
}

export function PageHeader({ title, description, action, breadcrumb }: PageHeaderProps) {
  return (
    <div className="mb-6">
      {breadcrumb && <div className="mb-2">{breadcrumb}</div>}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[1.625rem] font-bold text-zinc-900 dark:text-zinc-100">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {description}
            </p>
          )}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </div>
  );
}

// Section Container
interface SectionProps {
  children: ReactNode;
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  icon?: ReactNode;
}

export function Section({ children, title, description, action, className, icon }: SectionProps) {
  return (
    <section className={clsx('mb-8', className)}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {icon && (
              <span className="flex-shrink-0 text-zinc-500 dark:text-zinc-400">
                {icon}
              </span>
            )}
            <div>
              {title && (
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                  {description}
                </p>
              )}
            </div>
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

// Grid Layout
interface GridProps {
  children: ReactNode;
  cols?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

const colStyles = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
};

const gapStyles = {
  sm: 'gap-3',
  md: 'gap-4',
  lg: 'gap-6',
};

export function Grid({ children, cols = 3, gap = 'md', className }: GridProps) {
  return (
    <div className={clsx('grid', colStyles[cols], gapStyles[gap], className)}>
      {children}
    </div>
  );
}

// Empty State
interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon && (
        <div className="mb-4 p-4 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
        {title}
      </h3>
      {description && (
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 max-w-sm">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// Loading State
interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = '불러오는 중...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">{message}</p>
    </div>
  );
}

// Golden Ratio Split Layout (62:38)
interface GoldenSplitProps {
  children: [ReactNode, ReactNode];
  /** Reverse the ratio (38:62 instead of 62:38) */
  reversed?: boolean;
  className?: string;
}

export function GoldenSplit({ children, reversed = false, className }: GoldenSplitProps) {
  const [main, side] = reversed ? [children[1], children[0]] : children;
  return (
    <div className={clsx('flex flex-col lg:flex-row gap-6', className)}>
      <div className="w-full lg:w-[61.8%]">{main}</div>
      <div className="w-full lg:w-[38.2%]">{side}</div>
    </div>
  );
}

// Error State
interface ErrorStateProps {
  title?: string;
  message?: string;
  action?: ReactNode;
}

export function ErrorState({
  title = '오류가 발생했습니다',
  message,
  action,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 p-4 rounded-full bg-danger-100 dark:bg-danger-900/30 text-danger-500">
        <svg
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
        {title}
      </h3>
      {message && (
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 max-w-sm">
          {message}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
