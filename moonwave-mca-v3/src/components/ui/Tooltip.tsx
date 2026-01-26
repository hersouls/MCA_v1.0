import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import {
  Button as AriaButton,
  Tooltip as AriaTooltip,
  TooltipTrigger as AriaTooltipTrigger,
  OverlayArrow,
} from 'react-aria-components';

// Tooltip placement options
type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
  /** The content to show in the tooltip */
  content: ReactNode;
  /** The element that triggers the tooltip */
  children: ReactNode;
  /** Tooltip placement relative to trigger */
  placement?: TooltipPlacement;
  /** Delay before showing tooltip (ms) */
  delay?: number;
  /** Whether the tooltip is disabled */
  isDisabled?: boolean;
  /** Additional className for the tooltip */
  className?: string;
  /** Show arrow indicator */
  showArrow?: boolean;
}

// Tooltip content styling
const tooltipStyles = clsx(
  // Base styles - z-[100] to appear above modals (z-50)
  'z-[100] px-2.5 py-1.5 text-xs font-medium rounded-lg shadow-lg',
  // Colors
  'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900',
  // Border
  'border border-zinc-700 dark:border-zinc-300',
  // Animation
  'animate-in fade-in-0 zoom-in-95',
  'data-[exiting]:animate-out data-[exiting]:fade-out-0 data-[exiting]:zoom-out-95',
  // Placement animations
  'data-[placement=top]:slide-in-from-bottom-1',
  'data-[placement=bottom]:slide-in-from-top-1',
  'data-[placement=left]:slide-in-from-right-1',
  'data-[placement=right]:slide-in-from-left-1'
);

// Arrow styling
const arrowStyles = clsx(
  'fill-zinc-900 dark:fill-zinc-100',
  'stroke-zinc-700 dark:stroke-zinc-300',
  'stroke-1'
);

/**
 * Tooltip component with accessibility support
 * Uses react-aria-components for keyboard and screen reader support
 */
export function Tooltip({
  content,
  children,
  placement = 'top',
  delay = 300,
  isDisabled = false,
  className,
  showArrow = true,
}: TooltipProps) {
  if (isDisabled || !content) {
    return <>{children}</>;
  }

  return (
    <AriaTooltipTrigger delay={delay}>
      {children}
      <AriaTooltip
        placement={placement}
        offset={showArrow ? 8 : 4}
        className={clsx(tooltipStyles, className)}
      >
        {showArrow && (
          <OverlayArrow>
            <svg width={12} height={6} viewBox="0 0 12 6" className={arrowStyles}>
              <path d="M0 6L6 0L12 6" />
            </svg>
          </OverlayArrow>
        )}
        {content}
      </AriaTooltip>
    </AriaTooltipTrigger>
  );
}

/**
 * Button component for use as Tooltip trigger
 * Required because react-aria TooltipTrigger needs a react-aria Button
 */
interface TooltipTriggerButtonProps {
  children: ReactNode;
  className?: string;
  'aria-label'?: string;
}

const defaultButtonStyles = clsx(
  'inline-flex items-center justify-center outline-none',
  'focus-visible:ring-2 focus-visible:ring-primary-500 rounded-full'
);

export function TooltipTriggerButton({
  children,
  className,
  'aria-label': ariaLabel,
}: TooltipTriggerButtonProps) {
  return (
    <AriaButton className={clsx(defaultButtonStyles, className)} aria-label={ariaLabel}>
      {children}
    </AriaButton>
  );
}
