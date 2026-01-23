// ============================================
// Badge Component (Catalyst-style)
// ============================================

import { type HTMLAttributes, type ReactNode } from 'react';
import { clsx } from 'clsx';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  children: ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
  primary:
    'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300',
  success:
    'bg-success-100 text-success-700 dark:bg-success-900/50 dark:text-success-300',
  warning:
    'bg-warning-100 text-warning-700 dark:bg-warning-900/50 dark:text-warning-300',
  danger:
    'bg-danger-100 text-danger-700 dark:bg-danger-900/50 dark:text-danger-300',
  info:
    'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
};

const dotStyles: Record<BadgeVariant, string> = {
  default: 'bg-zinc-500',
  primary: 'bg-primary-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  danger: 'bg-danger-500',
  info: 'bg-blue-500',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-1.5 py-0.5 text-[10px]',
  md: 'px-2 py-0.5 text-xs',
  lg: 'px-2.5 py-1 text-sm',
};

export function Badge({
  variant = 'default',
  size = 'md',
  dot = false,
  children,
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 font-medium rounded-full',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={clsx(
            'w-1.5 h-1.5 rounded-full',
            dotStyles[variant]
          )}
        />
      )}
      {children}
    </span>
  );
}

// Status-specific badges for MCA
export function StatusBadge({ status }: { status: 'pending' | 'ordered' | 'executed' }) {
  const config = {
    pending: { variant: 'default' as const, label: '대기' },
    ordered: { variant: 'warning' as const, label: '주문' },
    executed: { variant: 'success' as const, label: '체결' },
  };

  const { variant, label } = config[status];

  return (
    <Badge variant={variant} size="sm" dot>
      {label}
    </Badge>
  );
}

// Portfolio status badge
export function PortfolioStatusBadge({
  orderedCount,
  executedCount,
  totalSteps,
  hasGap,
}: {
  orderedCount: number;
  executedCount: number;
  totalSteps: number;
  hasGap: boolean;
}) {
  if (hasGap) {
    return (
      <Badge variant="danger" size="sm" dot>
        갭 발생
      </Badge>
    );
  }

  if (orderedCount === 0) {
    return (
      <Badge variant="default" size="sm">
        주문 없음
      </Badge>
    );
  }

  if (executedCount === totalSteps) {
    return (
      <Badge variant="success" size="sm" dot>
        완료
      </Badge>
    );
  }

  return (
    <Badge variant="primary" size="sm" dot>
      정상 운용
    </Badge>
  );
}
