// ============================================
// Table Component (Catalyst-style)
// ============================================

import { forwardRef, type HTMLAttributes, type TdHTMLAttributes, type ThHTMLAttributes } from 'react';
import { clsx } from 'clsx';

// Table Root
interface TableProps extends HTMLAttributes<HTMLTableElement> {
  striped?: boolean;
}

export const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ striped = false, className, children, ...props }, ref) => {
    return (
      <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
        <table
          ref={ref}
          className={clsx(
            'w-full text-sm',
            striped && '[&_tbody_tr:nth-child(odd)]:bg-zinc-50 dark:[&_tbody_tr:nth-child(odd)]:bg-zinc-900/50',
            className
          )}
          {...props}
        >
          {children}
        </table>
      </div>
    );
  }
);

Table.displayName = 'Table';

// Table Header
export const TableHeader = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={clsx(
      'bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800',
      className
    )}
    {...props}
  />
));

TableHeader.displayName = 'TableHeader';

// Table Body
export const TableBody = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={clsx('divide-y divide-zinc-200 dark:divide-zinc-800', className)}
    {...props}
  />
));

TableBody.displayName = 'TableBody';

// Table Row
interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  selected?: boolean;
  hoverable?: boolean;
}

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ selected = false, hoverable = true, className, ...props }, ref) => (
    <tr
      ref={ref}
      className={clsx(
        'transition-colors',
        hoverable && 'hover:bg-zinc-50 dark:hover:bg-zinc-900/50',
        selected && 'bg-primary-50 dark:bg-primary-900/20',
        className
      )}
      {...props}
    />
  )
);

TableRow.displayName = 'TableRow';

// Table Head Cell
interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean;
  sorted?: 'asc' | 'desc' | false;
}

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ sortable = false, sorted = false, className, children, ...props }, ref) => (
    <th
      ref={ref}
      className={clsx(
        'px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider',
        sortable && 'cursor-pointer select-none hover:text-zinc-900 dark:hover:text-zinc-100',
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-1">
        {children}
        {sorted && (
          <span className="text-primary-500">
            {sorted === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </div>
    </th>
  )
);

TableHead.displayName = 'TableHead';

// Table Cell
interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  numeric?: boolean;
}

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ numeric = false, className, ...props }, ref) => (
    <td
      ref={ref}
      className={clsx(
        'px-4 py-3 text-zinc-900 dark:text-zinc-100',
        numeric && 'text-right font-medium tabular-nums',
        className
      )}
      {...props}
    />
  )
);

TableCell.displayName = 'TableCell';

// Empty State
interface TableEmptyProps {
  message?: string;
  colSpan: number;
}

export function TableEmpty({ message = '데이터가 없습니다', colSpan }: TableEmptyProps) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="px-4 py-12 text-center text-sm text-zinc-500 dark:text-zinc-400"
      >
        {message}
      </td>
    </tr>
  );
}

// Checkbox Cell
interface CheckboxCellProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function CheckboxCell({ checked, onChange, disabled = false }: CheckboxCellProps) {
  return (
    <TableCell className="w-12">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className={clsx(
          'w-4 h-4 rounded border-zinc-300 dark:border-zinc-600',
          'text-primary-600 focus:ring-primary-500 focus:ring-2',
          'dark:bg-zinc-800',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      />
    </TableCell>
  );
}

// Header Checkbox Cell
interface HeaderCheckboxCellProps {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (checked: boolean) => void;
}

export function HeaderCheckboxCell({
  checked,
  indeterminate = false,
  onChange,
}: HeaderCheckboxCellProps) {
  return (
    <TableHead className="w-12">
      <input
        type="checkbox"
        checked={checked}
        ref={(el) => {
          if (el) el.indeterminate = indeterminate;
        }}
        onChange={(e) => onChange(e.target.checked)}
        className={clsx(
          'w-4 h-4 rounded border-zinc-300 dark:border-zinc-600',
          'text-primary-600 focus:ring-primary-500 focus:ring-2',
          'dark:bg-zinc-800'
        )}
      />
    </TableHead>
  );
}
