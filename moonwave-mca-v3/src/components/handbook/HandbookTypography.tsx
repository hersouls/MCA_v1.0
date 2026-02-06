// ============================================
// Handbook Typography Components
// 전역 prose 클래스를 사용하는 단순화된 컴포넌트
// ============================================

import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import { IconLabel } from './IconLabel';

interface TypographyProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export const H2 = ({ children, className, id }: TypographyProps) => (
  <h2 id={id} className={clsx('heading-2', className)}>
    {children}
  </h2>
);

export const H3 = ({ children, className, id }: TypographyProps) => (
  <h3 id={id} className={clsx('heading-3', className)}>
    {children}
  </h3>
);

export const H4 = ({ children, className, id }: TypographyProps) => (
  <h4 id={id} className={clsx('heading-4', className)}>
    {children}
  </h4>
);

// Body
export const P = ({ children, className }: TypographyProps) => (
  <p className={clsx('paragraph', className)}>{children}</p>
);

export const UL = ({ children, className }: TypographyProps) => (
  <ul className={clsx('list-unordered', className)}>{children}</ul>
);

export const OL = ({ children, className }: TypographyProps) => (
  <ol className={clsx('list-ordered', className)}>{children}</ol>
);

export const LI = ({ children, className }: TypographyProps) => (
  <li className={className}>{children}</li>
);

export const Blockquote = ({ children, className }: TypographyProps) => (
  <blockquote className={clsx('blockquote', className)}>{children}</blockquote>
);

export const CodeBlock = ({ children, className }: TypographyProps) => (
  <pre className={clsx('code-block', className)}>{children}</pre>
);

// Divider
export const Hr = () => <hr className="hr" />;

// Table Components
export const Table = ({ children, className }: TypographyProps) => (
  <div className="table-wrapper">
    <table className={clsx('table-base', className)}>{children}</table>
  </div>
);

export const Thead = ({ children }: { children: ReactNode }) => <thead>{children}</thead>;

export const Tbody = ({ children }: { children: ReactNode }) => <tbody>{children}</tbody>;

export const Tr = ({ children }: { children: ReactNode }) => <tr>{children}</tr>;

export const Th = ({ children, className }: TypographyProps) => (
  <th className={className}>{children}</th>
);

export const Td = ({ children, className }: TypographyProps) => (
  <td className={className}>{children}</td>
);

// Special Components
export const MermaidPlaceholder = ({ title, code }: { title: string; code: string }) => (
  <div className="my-6 p-4 border border-border rounded-lg bg-surface-hover">
    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
      {title} (Diagram)
    </div>
    <pre className="text-xs font-mono text-muted-foreground overflow-x-auto whitespace-pre">
      {code}
    </pre>
  </div>
);

// ============================================
// Icon-enhanced Headings
// ============================================
interface IconHeadingProps {
  icon: string;
  children: ReactNode;
  className?: string;
}

export const IconH1 = ({ icon, children, className }: IconHeadingProps) => (
  <h1
    className={clsx(
      'text-2xl font-bold text-foreground mb-6 mt-0 leading-tight flex items-center gap-2',
      className
    )}
  >
    <IconLabel icon={icon} label="" size="lg" />
    {children}
  </h1>
);

export const IconH3 = ({ icon, children, className }: IconHeadingProps) => (
  <h3 className={clsx('heading-3 flex items-center gap-2', className)}>
    <IconLabel icon={icon} label="" size="md" />
    {children}
  </h3>
);
