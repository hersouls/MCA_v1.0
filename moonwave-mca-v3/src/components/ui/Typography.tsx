// ============================================
// Typography Component (Golden Ratio Scale)
// ============================================

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { clsx } from 'clsx';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4';

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: HeadingLevel;
  as?: HeadingLevel;
  children: ReactNode;
}

// Golden Ratio Scale: 68px → 42px → 26px → 16px (÷1.618)
const headingStyles: Record<HeadingLevel, string> = {
  h1: 'text-[4.25rem] leading-tight font-bold text-zinc-900 dark:text-zinc-50',      // 68px
  h2: 'text-[2.625rem] leading-tight font-bold text-zinc-900 dark:text-zinc-50',     // 42px
  h3: 'text-[1.625rem] leading-snug font-semibold text-zinc-900 dark:text-zinc-50',  // 26px
  h4: 'text-base leading-normal font-semibold text-zinc-900 dark:text-zinc-50',      // 16px
};

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ level = 'h2', as, className, children, ...props }, ref) => {
    const Component = as || level;
    return (
      <Component ref={ref} className={clsx(headingStyles[level], className)} {...props}>
        {children}
      </Component>
    );
  }
);
Heading.displayName = 'Heading';

// Page Title (h1 wrapper for pages)
interface PageTitleProps extends Omit<HeadingProps, 'level'> {
  description?: string;
}

export function PageTitle({ description, children, className, ...props }: PageTitleProps) {
  return (
    <div className={className}>
      <Heading level="h1" {...props}>{children}</Heading>
      {description && (
        <p className="mt-2 text-base text-zinc-500 dark:text-zinc-400">{description}</p>
      )}
    </div>
  );
}

// Section Title (h3 as h2 for section headers)
export function SectionTitle({ children, className, ...props }: Omit<HeadingProps, 'level'>) {
  return (
    <Heading level="h3" as="h2" className={clsx('mb-4', className)} {...props}>
      {children}
    </Heading>
  );
}

// Text body component
interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  size?: 'xs' | 'sm' | 'base' | 'lg';
  muted?: boolean;
  children: ReactNode;
}

const textSizes = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
};

export function Text({ size = 'base', muted = false, className, children, ...props }: TextProps) {
  return (
    <p
      className={clsx(
        textSizes[size],
        muted ? 'text-zinc-500 dark:text-zinc-400' : 'text-zinc-900 dark:text-zinc-50',
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}
