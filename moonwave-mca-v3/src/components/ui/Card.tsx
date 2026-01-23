// ============================================
// Card Component (Catalyst-style)
// ============================================

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { clsx } from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const variantStyles = {
  default: 'bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-700/50',
  elevated: 'bg-white dark:bg-zinc-900/90 shadow-lg shadow-zinc-900/5 dark:shadow-black/30',
  bordered: 'bg-transparent border-2 border-zinc-200 dark:border-zinc-600',
  interactive:
    'bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-700/50 hover:border-primary-300 dark:hover:border-zinc-500 hover:shadow-md dark:hover:shadow-black/20 transition-all duration-200 cursor-pointer',
};

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
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
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            {title}
          </h3>
          {description && (
            <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
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
        'mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-4',
        className
      )}
      {...props}
    >
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
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatsCard({ label, value, subValue, icon, trend }: StatsCardProps) {
  return (
    <Card padding="md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
            {label}
          </p>
          <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {value}
          </p>
          {subValue && (
            <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
              {subValue}
            </p>
          )}
          {trend && (
            <p
              className={clsx(
                'mt-1 text-sm font-medium',
                trend.isPositive
                  ? 'text-success-600 dark:text-success-400'
                  : 'text-danger-600 dark:text-danger-400'
              )}
            >
              {trend.isPositive ? '+' : ''}
              {trend.value}%
            </p>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
