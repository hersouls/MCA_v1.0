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
        <label className="block text-xs font-medium text-muted-foreground mb-1.5">
          {label}
        </label>
      )}
      <select
        className={clsx(
          'w-full rounded-lg border bg-card',
          'py-2.5 px-3 text-sm text-foreground',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary-500/20',
          error
            ? 'border-danger-500 focus:border-danger-500'
            : 'border-border hover:border-foreground/20 focus:border-primary-500',
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
import { useCallback, useRef } from 'react';

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
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      let nextIndex: number | null = null;

      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          e.preventDefault();
          nextIndex = (index + 1) % options.length;
          break;
        case 'ArrowUp':
        case 'ArrowLeft':
          e.preventDefault();
          nextIndex = (index - 1 + options.length) % options.length;
          break;
        case 'Home':
          e.preventDefault();
          nextIndex = 0;
          break;
        case 'End':
          e.preventDefault();
          nextIndex = options.length - 1;
          break;
        default:
          return;
      }

      if (nextIndex !== null) {
        const nextButton = buttonRefs.current[nextIndex];
        if (nextButton) {
          nextButton.focus();
          onChange(options[nextIndex].value);
        }
      }
    },
    [options, onChange]
  );

  return (
    <div className={clsx('space-y-1', className)}>
      <label className="block text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <div className="grid gap-2 sm:grid-cols-1" role="radiogroup" aria-label={label}>
        {options.map((option, index) => {
          const isSelected = value === option.value;
          return (
            <button
              key={option.value}
              ref={(el) => { buttonRefs.current[index] = el; }}
              type="button"
              role="radio"
              aria-checked={isSelected}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => onChange(option.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={clsx(
                'flex items-center justify-between rounded-lg border p-3 text-left text-sm transition-all',
                isSelected
                  ? 'border-primary-500 bg-primary-500/10 ring-1 ring-primary-500'
                  : 'border-border hover:bg-surface-hover'
              )}
            >
              <div>
                <div className="font-medium text-foreground">{option.label}</div>
              </div>
              {isSelected && <Check className="w-4 h-4 text-primary-500" />}
            </button>
          );
        })}
      </div>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </div>
  );
}
