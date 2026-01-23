// ============================================
// Input Component (Catalyst-style)
// ============================================

import * as Headless from '@headlessui/react';
import { clsx } from 'clsx';
import { forwardRef, type InputHTMLAttributes, useState, useCallback, type ReactNode } from 'react';
import { formatInputValue, parseFormattedNumber } from '@/utils/format';

// Field wrapper for consistent form layout
interface FieldProps extends React.ComponentPropsWithoutRef<'div'> {
  /** Control label-to-control spacing: 'none' (0), 'sm' (mt-1), 'md' (mt-2, default) */
  spacing?: 'none' | 'sm' | 'md';
}

const spacingStyles = {
  none: '',
  sm: '[&>[data-slot=label]+[data-slot=control]]:mt-1',
  md: '[&>[data-slot=label]+[data-slot=control]]:mt-2',
};

export function Field({ className, spacing = 'md', ...props }: FieldProps) {
  return (
    <div
      data-slot="field"
      {...props}
      className={clsx(
        className,
        spacingStyles[spacing],
        '[&>[data-slot=label]+[data-slot=description]]:mt-1',
        '[&>[data-slot=description]+[data-slot=control]]:mt-2',
        '[&>[data-slot=control]+[data-slot=description]]:mt-2',
        '[&>[data-slot=control]+[data-slot=error]]:mt-2',
        '[&>[data-slot=label]]:font-medium'
      )}
    />
  );
}

// Fieldset wrapper
export function Fieldset({ className, ...props }: React.ComponentPropsWithoutRef<'fieldset'>) {
  return (
    <fieldset
      {...props}
      className={clsx(className, '[&>*+[data-slot=control]]:mt-6 [&>[data-slot=text]]:mt-1')}
    />
  );
}

// Label component (using native label to avoid Headless.Field requirement)
export function Label({ className, ...props }: React.ComponentPropsWithoutRef<'label'>) {
  return (
    <label
      data-slot="label"
      {...props}
      className={clsx(
        className,
        'select-none text-sm/6 font-medium text-zinc-700 dark:text-zinc-300'
      )}
    />
  );
}

// Description component (using native p to avoid Headless.Field requirement)
export function Description({ className, ...props }: React.ComponentPropsWithoutRef<'p'>) {
  return (
    <p
      data-slot="description"
      {...props}
      className={clsx(className, 'text-sm/6 text-zinc-500 dark:text-zinc-400')}
    />
  );
}

// Error message component
export function ErrorMessage({ className, ...props }: React.ComponentPropsWithoutRef<'p'>) {
  return (
    <p
      data-slot="error"
      {...props}
      className={clsx(className, 'text-sm/6 text-danger-600 dark:text-danger-400')}
    />
  );
}

// Base input styles
const inputBaseStyles = clsx(
  // Basic layout
  'relative block w-full appearance-none rounded-lg px-[calc(--spacing(3.5)-1px)] py-[calc(--spacing(2.5)-1px)] sm:px-[calc(--spacing(3)-1px)] sm:py-[calc(--spacing(1.5)-1px)]',
  // Typography
  'text-base/6 text-zinc-950 placeholder:text-zinc-500 sm:text-sm/6 dark:text-white',
  // Border
  'border border-zinc-950/10 data-[hover]:border-zinc-950/20 dark:border-white/10 dark:data-[hover]:border-white/20',
  // Background
  'bg-transparent dark:bg-white/5',
  // Focus
  'focus:outline-none data-[focus]:outline data-[focus]:outline-2 data-[focus]:-outline-offset-1 data-[focus]:outline-primary-500',
  // Invalid
  'data-[invalid]:border-danger-500 data-[invalid]:data-[hover]:border-danger-500 data-[invalid]:data-[focus]:outline-danger-500',
  // Disabled
  'data-[disabled]:opacity-50 data-[disabled]:border-zinc-950/20 dark:data-[disabled]:border-white/15',
  // Hide default appearance
  '[&::-webkit-search-cancel-button]:appearance-none'
);

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
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
      disabled,
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

    const hasLeftIcon = !!leftIcon;
    const hasRightIcon = !!rightIcon;

    return (
      <Field className={className}>
        {label && <Label>{label}</Label>}
        <Headless.Field disabled={disabled}>
          <span
            data-slot="control"
            className={clsx(
              'relative block w-full',
              // Icon padding adjustments
              hasLeftIcon && '[&>input]:pl-10',
              hasRightIcon && '[&>input]:pr-10'
            )}
          >
            {leftIcon && (
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500 dark:text-zinc-400">
                {leftIcon}
              </span>
            )}
            <Headless.Input
              ref={ref}
              data-slot="input"
              data-focus={isFocused || undefined}
              data-invalid={error || undefined}
              className={clsx(
                inputBaseStyles,
                isNumeric && 'text-right font-mono tabular-nums'
              )}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              {...props}
            />
            {rightIcon && (
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500 dark:text-zinc-400">
                {rightIcon}
              </span>
            )}
          </span>
        </Headless.Field>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {hint && !error && <Description>{hint}</Description>}
      </Field>
    );
  }
);

Input.displayName = 'Input';

// Textarea component
interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  label?: string;
  error?: string;
  hint?: string;
  onChange?: (value: string, event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  resizable?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, onChange, resizable = true, ...props }, ref) => {
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange?.(e.target.value, e);
      },
      [onChange]
    );

    return (
      <Field className={className}>
        {label && <Label>{label}</Label>}
        <span data-slot="control" className="relative block w-full">
          <textarea
            ref={ref}
            data-slot="textarea"
            data-invalid={error || undefined}
            className={clsx(
              inputBaseStyles,
              'min-h-[80px]',
              resizable ? 'resize-y' : 'resize-none'
            )}
            onChange={handleChange}
            {...props}
          />
        </span>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {hint && !error && <Description>{hint}</Description>}
      </Field>
    );
  }
);

Textarea.displayName = 'Textarea';

// Numeric Input with unit suffix
interface NumericInputProps extends Omit<InputProps, 'isNumeric' | 'rightIcon'> {
  unit?: string;
}

export const NumericInput = forwardRef<HTMLInputElement, NumericInputProps>(
  ({ unit = '원', ...props }, ref) => (
    <Input
      ref={ref}
      isNumeric
      rightIcon={<span className="text-sm font-medium text-zinc-400">{unit}</span>}
      {...props}
    />
  )
);

NumericInput.displayName = 'NumericInput';
