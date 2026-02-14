// ============================================
// Card Component (Catalyst-style)
// ============================================

import { clsx } from 'clsx';
import { Info } from 'lucide-react';
import { type HTMLAttributes, type ReactNode, forwardRef } from 'react';
import { Button as AriaButton } from 'react-aria-components';
import { Skeleton } from './Skeleton';
import { Tooltip } from './Tooltip';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered' | 'interactive' | 'outline';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const variantStyles = {
  default: clsx('bg-card', 'ring-1 ring-foreground/5 dark:ring-foreground/10'),
  elevated: clsx(
    'bg-card',
    'shadow-lg shadow-foreground/5 dark:shadow-none',
    'ring-1 ring-foreground/5 dark:ring-foreground/10'
  ),
  bordered: clsx('bg-transparent', 'border-2 border-border'),
  outline: clsx('bg-card/50', 'ring-1 ring-foreground/10 dark:ring-foreground/15'),
  interactive: clsx(
    'bg-card',
    'ring-1 ring-foreground/5 dark:ring-foreground/10',
    'hover:ring-foreground/10 dark:hover:ring-foreground/20',
    'hover:shadow-md hover:shadow-foreground/5 dark:hover:shadow-none',
    'transition-all duration-200 cursor-pointer',
    'active:ring-foreground/15 dark:active:ring-foreground/25'
  ),
};

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-4 sm:p-5',
  lg: 'p-5 sm:p-6',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', padding = 'md', className, children, ...props }, ref) => {
    const isInteractive = variant === 'interactive';

    return (
      <div
        ref={ref}
        role={isInteractive ? 'button' : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        className={clsx(
          'rounded-xl',
          variantStyles[variant],
          paddingStyles[padding],
          // Add focus-visible styles for interactive variant
          isInteractive &&
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
          className
        )}
        onKeyDown={
          isInteractive
            ? (e) => {
                // Allow Enter/Space to trigger click for interactive cards
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  (e.target as HTMLElement).click();
                }
              }
            : undefined
        }
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card Header
interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function CardHeader({
  title,
  description,
  icon,
  action,
  className,
  ...props
}: CardHeaderProps) {
  return (
    <div className={clsx('flex items-start justify-between gap-4', className)} {...props}>
      <div className="flex items-start gap-3">
        {icon && (
          <div
            className="flex-shrink-0 size-10 rounded-lg bg-primary-50 dark:bg-primary-950/50 ring-1 ring-primary-500/20 flex items-center justify-center text-primary-600 dark:text-primary-400"
            aria-hidden="true"
          >
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <h3 className="text-base/7 font-semibold text-foreground">{title}</h3>
          {description && (
            <p className="mt-0.5 text-sm/6 text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

// Card Content
interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function CardContent({ className, children, ...props }: CardContentProps) {
  return (
    <div className={clsx('mt-4', className)} {...props}>
      {children}
    </div>
  );
}

// Stats Card for Dashboard
interface StatsCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: ReactNode;
  /** Tooltip text shown next to label */
  tooltip?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  /** Progress bar with value (0-100) and optional label */
  progress?: {
    value: number;
    label?: string;
  };
  /** Value text color */
  valueColor?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  /** Value text alignment */
  align?: 'left' | 'right';
  /** Show skeleton loading state */
  loading?: boolean;
  className?: string;
}

const valueColorStyles = {
  default: 'text-foreground',
  primary: 'text-primary-600 dark:text-primary-400',
  success: 'text-success-600 dark:text-success-400',
  warning: 'text-warning-600 dark:text-warning-400',
  danger: 'text-danger-600 dark:text-danger-400',
};

const alignStyles = {
  left: 'text-left',
  right: 'text-right',
};

export function StatsCard({
  label,
  value,
  subValue,
  icon,
  tooltip,
  trend,
  progress,
  valueColor = 'default',
  align = 'right',
  loading = false,
  className,
}: StatsCardProps) {
  if (loading) {
    return (
      <Card padding="md" className={className}>
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-7 w-32" />
            {subValue !== undefined && <Skeleton className="h-4 w-24" />}
          </div>
          {icon && <Skeleton className="flex-shrink-0 size-10 rounded-lg" />}
        </div>
      </Card>
    );
  }

  return (
    <Card padding="md" className={className}>
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs/5 font-medium text-muted-foreground uppercase tracking-wider inline-flex items-center gap-1">
            {label}
            {tooltip && (
              <Tooltip content={tooltip} placement="top">
                <AriaButton className="inline-flex items-center justify-center rounded-full hover:bg-surface-active p-0.5 -m-0.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">
                  <Info className="w-3.5 h-3.5 text-muted-foreground" />
                </AriaButton>
              </Tooltip>
            )}
          </p>
          <p
            className={clsx(
              'mt-1.5 text-xl sm:text-2xl/8 font-bold tabular-nums whitespace-nowrap',
              alignStyles[align],
              valueColorStyles[valueColor]
            )}
          >
            {value}
          </p>
          {subValue && (
            <p
              className={clsx(
                'mt-1 text-sm/6 text-muted-foreground tabular-nums',
                alignStyles[align]
              )}
            >
              {subValue}
            </p>
          )}
          {progress && (
            <div className="mt-2">
              <div className="h-2 bg-surface-active rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(progress.value, 100)}%` }}
                />
              </div>
              {progress.label && (
                <p className="text-xs text-muted-foreground mt-1">{progress.label}</p>
              )}
            </div>
          )}
          {trend && (
            <p
              className={clsx(
                'mt-1.5 text-sm/6 font-semibold inline-flex items-center gap-1',
                trend.isPositive
                  ? 'text-success-600 dark:text-success-400'
                  : 'text-danger-600 dark:text-danger-400'
              )}
            >
              <span
                className={clsx(
                  'inline-block size-4',
                  trend.isPositive ? 'rotate-0' : 'rotate-180'
                )}
              >
                ↑
              </span>
              {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        {icon && (
          <div
            className="flex-shrink-0 size-10 rounded-lg bg-surface-hover ring-1 ring-foreground/5 dark:ring-foreground/10 flex items-center justify-center text-muted-foreground"
            aria-hidden="true"
          >
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}

// ============================================
// Stat Item - Compact stat display for grids
// ============================================

interface StatItemProps {
  label: string;
  value: string | number;
  className?: string;
}

/**
 * Compact stat item for use inside Card grids.
 * Unlike StatsCard, this has no wrapper - use inside a parent Card.
 */
export function StatItem({ label, value, className }: StatItemProps) {
  return (
    <div className={clsx('min-w-0', className)}>
      <span className="block text-xs text-muted-foreground truncate">{label}</span>
      <p className="font-semibold text-foreground text-right tabular-nums whitespace-nowrap">
        {value}
      </p>
    </div>
  );
}

// ============================================
// Stat Grid - Multiple stats with dividers
// ============================================

interface StatGridProps {
  children: ReactNode;
  columns?: 2 | 3 | 4 | 5 | 6;
  divided?: boolean;
  /** Enable responsive grid (mobile 2col → tablet 3col → desktop target columns) */
  responsive?: boolean;
  className?: string;
}

const gridColumnStyles = {
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
};

const responsiveGridStyles = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 sm:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-4',
  5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
  6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
};

export function StatGrid({
  children,
  columns = 4,
  divided = true,
  responsive = false,
  className,
}: StatGridProps) {
  const gridStyles = responsive ? responsiveGridStyles[columns] : gridColumnStyles[columns];

  return (
    <div
      className={clsx(
        'grid',
        gridStyles,
        // Use gap instead of divide for responsive mode (divide-x doesn't work well with wrapping)
        responsive
          ? 'gap-4'
          : [
              divided && 'divide-x divide-border',
              '[&>*]:px-6 [&>*:first-child]:pl-0 [&>*:last-child]:pr-0',
            ],
        className
      )}
    >
      {children}
    </div>
  );
}
