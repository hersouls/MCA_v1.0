// ============================================
// Page Container Component
// ============================================

import { Tooltip, TooltipTriggerButton } from '@/components/ui';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import type { ReactNode } from 'react';

// Page transition animation variants
const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const pageTransition = {
  type: 'tween',
  ease: 'easeOut',
  duration: 0.2,
} as const;

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
      id="main-content"
      className={clsx(
        'flex-1 overflow-y-auto',
        padding && 'p-4 lg:p-6',
        'pb-20 lg:pb-6', // Extra padding for mobile bottom nav
        className
      )}
    >
      <motion.div
        className={clsx('mx-auto', maxWidthStyles[maxWidth])}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={pageTransition}
      >
        {children}
      </motion.div>
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
          <h1 className="text-[1.625rem] font-bold text-foreground">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
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
  tooltip?: string;
  action?: ReactNode;
  className?: string;
  icon?: ReactNode;
}

export function Section({ children, title, description, tooltip, action, className, icon }: SectionProps) {
  return (
    <section
      className={clsx('mb-8', className)}
      aria-labelledby={title ? `section-${title.replace(/\s+/g, '-').toLowerCase()}` : undefined}
    >
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {icon && (
              <span className="flex-shrink-0 text-muted-foreground" aria-hidden="true">
                {icon}
              </span>
            )}
            <div>
              {title && (
                <h2
                  id={`section-${title.replace(/\s+/g, '-').toLowerCase()}`}
                  className="text-lg font-semibold text-foreground inline-flex items-center gap-1"
                >
                  {title}
                  {tooltip && (
                    <Tooltip content={tooltip} placement="top">
                      <TooltipTriggerButton
                        className="hover:bg-surface-active p-0.5 -m-0.5 transition-colors"
                        aria-label={`${title} 도움말`}
                      >
                        <HelpCircle className="w-4 h-4 text-muted-foreground" />
                      </TooltipTriggerButton>
                    </Tooltip>
                  )}
                </h2>
              )}
              {description && (
                <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
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
  return <div className={clsx('grid', colStyles[cols], gapStyles[gap], className)}>{children}</div>;
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
    <div className="flex flex-col items-center justify-center py-12 text-center" role="status">
      {icon && (
        <div
          className="mb-4 p-4 rounded-full bg-surface-hover text-muted-foreground"
          aria-hidden="true"
        >
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-foreground">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground max-w-sm">{description}</p>
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
    <div
      className="flex flex-col items-center justify-center py-12"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"
        aria-hidden="true"
      />
      <p className="mt-4 text-sm text-muted-foreground">{message}</p>
      <span className="sr-only">{message}</span>
    </div>
  );
}

// Error State
interface ErrorStateProps {
  title?: string;
  message?: string;
  action?: ReactNode;
}

export function ErrorState({ title = '오류가 발생했습니다', message, action }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center" role="alert">
      <div
        className="mb-4 p-4 rounded-full bg-danger-100 dark:bg-danger-900/30 text-danger-500"
        aria-hidden="true"
      >
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-foreground">{title}</h3>
      {message && (
        <p className="mt-1 text-sm text-muted-foreground max-w-sm">{message}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
