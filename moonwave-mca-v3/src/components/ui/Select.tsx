// ============================================
// Select Component (Catalyst-style with Headless UI)
// ============================================

import { clsx } from 'clsx';

interface SelectOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

// Simple native select for forms
interface NativeSelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  error?: string;
  options: SelectOption[];
  onChange?: (value: string) => void;
}

export function NativeSelect({
  label,
  error,
  options,
  onChange,
  className,
  ...props
}: NativeSelectProps) {
  return (
    <div className={clsx('w-full', className)}>
      {label && (
        <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">
          {label}
        </label>
      )}
      <select
        className={clsx(
          'w-full rounded-lg border bg-white dark:bg-zinc-900',
          'py-2.5 px-3 text-sm text-zinc-900 dark:text-zinc-100',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary-500/20',
          error
            ? 'border-danger-500 focus:border-danger-500'
            : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 focus:border-primary-500',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
        onChange={(e) => onChange?.(e.target.value)}
        {...props}
      >
        {options.map((option) => (
          <option key={String(option.value)} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-xs text-danger-600 dark:text-danger-400">{error}</p>}
    </div>
  );
}

// ============================================
// Button-style Select (for Fundamental Grade, etc.)
// ============================================

import { Check } from 'lucide-react';

interface ButtonSelectOption {
  value: string;
  label: string;
  score?: number;
}

interface ButtonSelectProps {
  label: string;
  value: string | null;
  onChange: (value: string) => void;
  options: ButtonSelectOption[];
  description?: string;
  className?: string;
}

export function ButtonSelect({
  label,
  value,
  onChange,
  options,
  description,
  className,
}: ButtonSelectProps) {
  return (
    <div className={clsx('space-y-1', className)}>
      <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">
        {label}
      </label>
      <div className="grid gap-2 sm:grid-cols-1">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={clsx(
              'flex items-center justify-between rounded-lg border p-3 text-left text-sm transition-all',
              value === option.value
                ? 'border-primary-500 bg-primary-500/10 ring-1 ring-primary-500'
                : 'border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
            )}
          >
            <div>
              <div className="font-medium text-zinc-900 dark:text-zinc-100">{option.label}</div>
            </div>
            {value === option.value && <Check className="w-4 h-4 text-primary-500" />}
          </button>
        ))}
      </div>
      {description && <p className="text-xs text-zinc-500 dark:text-zinc-400">{description}</p>}
    </div>
  );
}
