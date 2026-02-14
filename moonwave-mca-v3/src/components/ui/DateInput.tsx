// ============================================
// DateInput Component
// Custom date input with Calendar icon and consistent focus styles
// ============================================

import { clsx } from 'clsx';
import { Calendar } from 'lucide-react';
import { useRef } from 'react';

interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
}

export function DateInput({
  value,
  onChange,
  disabled = false,
  className,
  'aria-label': ariaLabel = '날짜 선택',
}: DateInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={clsx('relative', className)}>
      <Calendar
        className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none"
        aria-hidden="true"
      />
      <input
        ref={inputRef}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-label={ariaLabel}
        className={clsx(
          'w-full rounded-lg border border-border bg-card py-1.5 pl-7 pr-2 text-xs text-foreground tabular-nums',
          'focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          'transition-colors'
        )}
      />
    </div>
  );
}
