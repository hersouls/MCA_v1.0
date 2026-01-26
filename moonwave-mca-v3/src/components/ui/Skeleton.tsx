// ============================================
// Skeleton Loading Components
// ============================================

import { clsx } from 'clsx';

interface SkeletonProps {
  className?: string;
}

// Base skeleton with pulse animation
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={clsx('animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-700', className)}
      aria-hidden="true"
    />
  );
}

// Text line skeleton
interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export function SkeletonText({ lines = 3, className }: SkeletonTextProps) {
  return (
    <div className={clsx('space-y-2', className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={clsx(
            'h-4',
            // Last line is shorter for visual variety
            i === lines - 1 ? 'w-2/3' : 'w-full'
          )}
        />
      ))}
    </div>
  );
}
