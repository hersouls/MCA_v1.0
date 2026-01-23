// ============================================
// Card Component (Catalyst-style)
// ============================================

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { clsx } from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered' | 'interactive' | 'outline';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const variantStyles = {
  default: clsx(
    'bg-white dark:bg-zinc-900',
    'ring-1 ring-zinc-950/5 dark:ring-white/10'
  ),
  elevated: clsx(
    'bg-white dark:bg-zinc-900',
    'shadow-lg shadow-zinc-950/5 dark:shadow-none',
    'ring-1 ring-zinc-950/5 dark:ring-white/10'
  ),
  bordered: clsx(
    'bg-transparent',
    'border-2 border-zinc-200 dark:border-zinc-700'
  ),
  outline: clsx(
    'bg-white/50 dark:bg-zinc-900/50',
    'ring-1 ring-zinc-950/10 dark:ring-white/15'
  ),
  interactive: clsx(
    'bg-white dark:bg-zinc-900',
    'ring-1 ring-zinc-950/5 dark:ring-white/10',
    'hover:ring-zinc-950/10 dark:hover:ring-white/20',
    'hover:shadow-md hover:shadow-zinc-950/5 dark:hover:shadow-none',
    'transition-all duration-200 cursor-pointer',
    'active:ring-zinc-950/15 dark:active:ring-white/25'
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
    return (
      <div
        ref={ref}
        className={clsx(
          'rounded-xl',
          variantStyles[variant],
          paddingStyles[padding],
          className
        )}
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
    <div
      className={clsx('flex items-start justify-between gap-4', className)}
      {...props}
    >
      <div className="flex items-start gap-3">
        {icon && (
          <div className="flex-shrink-0 size-10 rounded-lg bg-primary-50 dark:bg-primary-950/50 ring-1 ring-primary-500/20 flex items-center justify-center text-primary-600 dark:text-primary-400">
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <h3 className="text-base/7 font-semibold text-zinc-950 dark:text-white">
            {title}
          </h3>
          {description && (
            <p className="mt-0.5 text-sm/6 text-zinc-500 dark:text-zinc-400">
              {description}
            </p>
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

// Card Footer
interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function CardFooter({ className, children, ...props }: CardFooterProps) {
  return (
    <div
      className={clsx(
        'mt-4 pt-4 border-t border-zinc-950/5 dark:border-white/5 flex items-center justify-between gap-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Divider component
export function Divider({ className, ...props }: HTMLAttributes<HTMLHRElement>) {
  return (
    <hr
      className={clsx('border-t border-zinc-950/5 dark:border-white/5', className)}
      {...props}
    />
  );
}

// Stats Card for Dashboard
interface StatsCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: ReactNode;
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
  className?: string;
}

const valueColorStyles = {
  default: 'text-zinc-950 dark:text-white',
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
  trend,
  progress,
  valueColor = 'default',
  align = 'right',
  className,
}: StatsCardProps) {
  return (
    <Card padding="md" className={className}>
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs/5 font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            {label}
          </p>
          <p className={clsx('mt-1.5 text-2xl/8 font-bold tabular-nums', alignStyles[align], valueColorStyles[valueColor])}>
            {value}
          </p>
          {subValue && (
            <p className={clsx('mt-1 text-sm/6 text-zinc-500 dark:text-zinc-400 tabular-nums', alignStyles[align])}>
              {subValue}
            </p>
          )}
          {progress && (
            <div className="mt-2">
              <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(progress.value, 100)}%` }}
                />
              </div>
              {progress.label && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{progress.label}</p>
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
              <span className={clsx(
                'inline-block size-4',
                trend.isPositive ? 'rotate-0' : 'rotate-180'
              )}>
                ↑
              </span>
              {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 size-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 ring-1 ring-zinc-950/5 dark:ring-white/10 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
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
    <div className={className}>
      <span className="text-xs text-zinc-500 dark:text-zinc-400">{label}</span>
      <p className="font-semibold text-zinc-900 dark:text-zinc-50 text-right tabular-nums">
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
  className?: string;
}

const gridColumnStyles = {
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
};

export function StatGrid({
  children,
  columns = 4,
  divided = true,
  className,
}: StatGridProps) {
  return (
    <div
      className={clsx(
        'grid',
        gridColumnStyles[columns],
        divided && 'divide-x divide-zinc-200 dark:divide-zinc-700',
        '[&>*]:px-6 [&>*:first-child]:pl-0 [&>*:last-child]:pr-0',
        className
      )}
    >
      {children}
    </div>
  );
}
