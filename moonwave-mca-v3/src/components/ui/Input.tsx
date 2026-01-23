// ============================================
// Input Component (Catalyst-style)
// ============================================

import { forwardRef, type InputHTMLAttributes, useState, useCallback } from 'react';
import { clsx } from 'clsx';
import { formatInputValue, parseFormattedNumber } from '@/utils/format';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isNumeric?: boolean;
  onChange?: (value: string | number, event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      isNumeric = false,
      className,
      onChange,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isNumeric) {
          const formatted = formatInputValue(e.target.value);
          e.target.value = formatted;
          onChange?.(parseFormattedNumber(formatted), e);
        } else {
          onChange?.(e.target.value, e);
        }
      },
      [isNumeric, onChange]
    );

    const handleFocus = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
        onFocus?.(e);
      },
      [onFocus]
    );

    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        onBlur?.(e);
      },
      [onBlur]
    );

    return (
      <div className={clsx('w-full', className)}>
        {label && (
          <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">
            {label}
          </label>
        )}
        <div
          className={clsx(
            'relative flex items-center rounded-lg border bg-white dark:bg-zinc-900',
            'transition-all duration-200',
            error
              ? 'border-danger-500 focus-within:ring-2 focus-within:ring-danger-500/20'
              : isFocused
              ? 'border-primary-500 ring-2 ring-primary-500/20'
              : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
          )}
        >
          {leftIcon && (
            <span className="flex items-center justify-center pl-3 text-zinc-400">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            className={clsx(
              'flex-1 w-full px-3 py-2.5 text-sm bg-transparent',
              'text-zinc-900 dark:text-zinc-100',
              'placeholder:text-zinc-400 dark:placeholder:text-zinc-500',
              'focus:outline-none',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              leftIcon && 'pl-2',
              rightIcon && 'pr-2',
              isNumeric && 'text-right font-medium'
            )}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
          {rightIcon && (
            <span className="flex items-center justify-center pr-3 text-zinc-400">
              {rightIcon}
            </span>
          )}
        </div>
        {(error || hint) && (
          <p
            className={clsx(
              'mt-1.5 text-xs',
              error ? 'text-danger-600 dark:text-danger-400' : 'text-zinc-500'
            )}
          >
            {error || hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Numeric Input with unit suffix
interface NumericInputProps extends Omit<InputProps, 'isNumeric' | 'rightIcon'> {
  unit?: string;
}

export const NumericInput = forwardRef<HTMLInputElement, NumericInputProps>(
  ({ unit = '원', ...props }, ref) => (
    <Input
      ref={ref}
      isNumeric
      rightIcon={<span className="text-xs text-zinc-500">{unit}</span>}
      {...props}
    />
  )
);

NumericInput.displayName = 'NumericInput';
