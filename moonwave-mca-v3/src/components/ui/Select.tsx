// ============================================
// Select Component (Catalyst-style with Headless UI)
// ============================================

import { Fragment } from 'react';
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from '@headlessui/react';
import { clsx } from 'clsx';
import { Check, ChevronDown } from 'lucide-react';

export interface SelectOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

interface SelectProps<T = string> {
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export function Select<T extends string | number>({
  value,
  onChange,
  options,
  label,
  placeholder = '선택하세요',
  error,
  disabled = false,
  className,
}: SelectProps<T>) {
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={clsx('w-full', className)}>
      {label && (
        <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">
          {label}
        </label>
      )}
      <Listbox value={value} onChange={onChange} disabled={disabled}>
        <div className="relative">
          <ListboxButton
            className={clsx(
              'relative w-full rounded-lg border bg-white dark:bg-zinc-900',
              'py-2.5 pl-3 pr-10 text-left text-sm',
              'transition-all duration-200',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/20',
              error
                ? 'border-danger-500 focus-visible:border-danger-500'
                : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 focus-visible:border-primary-500',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <span
              className={clsx(
                'block truncate',
                selectedOption
                  ? 'text-zinc-900 dark:text-zinc-100'
                  : 'text-zinc-400 dark:text-zinc-500'
              )}
            >
              {selectedOption?.label || placeholder}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDown
                className="h-4 w-4 text-zinc-400"
                aria-hidden="true"
              />
            </span>
          </ListboxButton>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ListboxOptions
              className={clsx(
                'absolute z-10 mt-1 max-h-60 w-full overflow-auto',
                'rounded-lg bg-white dark:bg-zinc-900',
                'border border-zinc-200 dark:border-zinc-700',
                'py-1 shadow-lg',
                'focus:outline-none'
              )}
            >
              {options.map((option) => (
                <ListboxOption
                  key={String(option.value)}
                  value={option.value}
                  disabled={option.disabled}
                  className={({ active, selected }) =>
                    clsx(
                      'relative cursor-pointer select-none py-2 pl-10 pr-4 text-sm',
                      active && 'bg-primary-50 dark:bg-primary-900/30',
                      selected
                        ? 'text-primary-600 dark:text-primary-400 font-medium'
                        : 'text-zinc-900 dark:text-zinc-100',
                      option.disabled && 'opacity-50 cursor-not-allowed'
                    )
                  }
                >
                  {({ selected }) => (
                    <>
                      <span className="block truncate">{option.label}</span>
                      {selected && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600 dark:text-primary-400">
                          <Check className="h-4 w-4" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>
      {error && (
        <p className="mt-1.5 text-xs text-danger-600 dark:text-danger-400">
          {error}
        </p>
      )}
    </div>
  );
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
          <option
            key={String(option.value)}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1.5 text-xs text-danger-600 dark:text-danger-400">
          {error}
        </p>
      )}
    </div>
  );
}
