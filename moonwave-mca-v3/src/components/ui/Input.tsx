// ============================================
// Input Component (Catalyst-style)
// ============================================

import type { FormState } from '@/types/ui';
import { FORM_STATE_TOKENS } from '@/utils/constants';
import { formatInputValue, parseFormattedNumber } from '@/utils/format';
import * as Headless from '@headlessui/react';
import { clsx } from 'clsx';
import { AlertCircle, AlertTriangle, CheckCircle, type LucideIcon } from 'lucide-react';
import {
  type InputHTMLAttributes,
  type ReactNode,
  forwardRef,
  useCallback,
  useId,
  useState,
} from 'react';

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

function Field({ className, spacing = 'md', ...props }: FieldProps) {
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
function Description({ className, ...props }: React.ComponentPropsWithoutRef<'p'>) {
  return (
    <p
      data-slot="description"
      {...props}
      className={clsx(className, 'text-sm/6 text-zinc-500 dark:text-zinc-400')}
    />
  );
}

// Error message component
function ErrorMessage({ className, ...props }: React.ComponentPropsWithoutRef<'p'>) {
  return (
    <p
      data-slot="error"
      {...props}
      className={clsx(className, 'text-sm/6 text-danger-600 dark:text-danger-400')}
    />
  );
}

// Success message component
function SuccessMessage({ className, ...props }: React.ComponentPropsWithoutRef<'p'>) {
  return (
    <p
      data-slot="success"
      {...props}
      className={clsx(className, 'text-sm/6 text-[var(--input-success-text)]')}
    />
  );
}

// Warning message component
function WarningMessage({ className, ...props }: React.ComponentPropsWithoutRef<'p'>) {
  return (
    <p
      data-slot="warning"
      {...props}
      className={clsx(className, 'text-sm/6 text-[var(--input-warning-text)]')}
    />
  );
}

// ============================================
// Form State Configuration
// ============================================

const stateIconMap: Partial<Record<FormState, LucideIcon>> = {
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
};

const getStateStyles = (state: FormState): string => {
  if (state === 'default') return '';
  if (state === 'disabled') return 'opacity-50';

  const tokens = FORM_STATE_TOKENS[state];
  return clsx(
    `border-[${tokens.border}]`,
    `bg-[${tokens.background}]`,
    `data-[focus]:outline-[${tokens.ring}]`
  );
};

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
  label?: ReactNode;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isNumeric?: boolean;
  onChange?: (value: string | number, event: React.ChangeEvent<HTMLInputElement>) => void;
  /** 입력 필드 상태 (default | success | warning | error | disabled) */
  state?: FormState;
  /** 상태 아이콘 표시 여부 */
  showStateIcon?: boolean;
  /** 성공 메시지 */
  successMessage?: string;
  /** 경고 메시지 */
  warningMessage?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
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
      id: providedId,
      state = 'default',
      showStateIcon = false,
      successMessage,
      warningMessage,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = providedId || generatedId;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

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
    // Determine effective state (error prop takes precedence)
    const effectiveState: FormState = error ? 'error' : disabled ? 'disabled' : state;
    const StateIcon = showStateIcon ? stateIconMap[effectiveState] : null;
    const hasRightIcon = !!rightIcon || !!StateIcon;
    const stateStyles = getStateStyles(effectiveState);

    // Build aria-describedby value
    const successId = `${inputId}-success`;
    const warningId = `${inputId}-warning`;
    const describedBy =
      [
        error && errorId,
        successMessage && effectiveState === 'success' && successId,
        warningMessage && effectiveState === 'warning' && warningId,
        hint && !error && hintId,
      ]
        .filter(Boolean)
        .join(' ') || undefined;

    return (
      <Field className={className}>
        {label && <Label htmlFor={inputId}>{label}</Label>}
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
              <span
                className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500 dark:text-zinc-400"
                aria-hidden="true"
              >
                {leftIcon}
              </span>
            )}
            <Headless.Input
              ref={ref}
              id={inputId}
              data-slot="input"
              data-focus={isFocused || undefined}
              data-invalid={error || effectiveState === 'error' || undefined}
              data-state={effectiveState !== 'default' ? effectiveState : undefined}
              className={clsx(
                inputBaseStyles,
                stateStyles,
                isNumeric && 'text-right font-mono tabular-nums'
              )}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              aria-invalid={!!error || undefined}
              aria-describedby={describedBy}
              {...props}
            />
            {(rightIcon || StateIcon) && (
              <span
                className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 gap-2"
                aria-hidden="true"
              >
                {rightIcon && <span className="text-zinc-500 dark:text-zinc-400">{rightIcon}</span>}
                {StateIcon && (
                  <StateIcon
                    className={clsx(
                      'w-4 h-4',
                      effectiveState === 'success' && 'text-[var(--input-success-text)]',
                      effectiveState === 'warning' && 'text-[var(--input-warning-text)]',
                      effectiveState === 'error' && 'text-[var(--input-error-text)]'
                    )}
                  />
                )}
              </span>
            )}
          </span>
        </Headless.Field>
        {error && (
          <ErrorMessage id={errorId} role="alert">
            {error}
          </ErrorMessage>
        )}
        {effectiveState === 'success' && successMessage && (
          <SuccessMessage id={successId}>{successMessage}</SuccessMessage>
        )}
        {effectiveState === 'warning' && warningMessage && (
          <WarningMessage id={warningId}>{warningMessage}</WarningMessage>
        )}
        {hint && !error && effectiveState === 'default' && (
          <Description id={hintId}>{hint}</Description>
        )}
      </Field>
    );
  }
);

Input.displayName = 'Input';

export { Input };

// Textarea component
interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  label?: ReactNode;
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
