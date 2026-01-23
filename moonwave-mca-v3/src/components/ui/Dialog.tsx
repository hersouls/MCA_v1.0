// ============================================
// Dialog Component (Catalyst-style with Headless UI)
// ============================================

import { type ReactNode } from 'react';
import {
  Dialog as HeadlessDialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
  Description,
} from '@headlessui/react';
import { clsx } from 'clsx';
import { X } from 'lucide-react';
import { Button, IconButton } from './Button';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
}

const sizeStyles = {
  xs: 'sm:max-w-xs',
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  '2xl': 'sm:max-w-2xl',
  '3xl': 'sm:max-w-3xl',
  '4xl': 'sm:max-w-4xl',
  '5xl': 'sm:max-w-5xl',
};

export function Dialog({ open, onClose, children, size = 'lg' }: DialogProps) {
  return (
    <HeadlessDialog open={open} onClose={onClose} className="relative z-50">
      {/* Backdrop - rgba(0,0,0,0.4) with blur(2px) */}
      <DialogBackdrop
        transition
        className={clsx(
          'fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-[2px]',
          'transition data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in'
        )}
      />

      {/* Dialog Container */}
      <div className="fixed inset-0 w-screen overflow-y-auto pt-6 sm:pt-0">
        <div className="grid min-h-full grid-rows-[1fr_auto] justify-items-center sm:grid-rows-[1fr_auto_3fr] sm:p-4">
          <DialogPanel
            transition
            className={clsx(
              // Base styles - Enhanced shadow & border for clear boundary
              'row-start-2 w-full min-w-0 rounded-t-2xl bg-white p-6 sm:p-8 shadow-2xl ring-1 ring-zinc-200',
              'dark:bg-zinc-900 dark:ring-zinc-700',
              // Responsive - 12px border-radius
              'sm:mb-auto sm:rounded-xl',
              sizeStyles[size],
              // Transition
              'transition duration-300 data-[closed]:translate-y-12 data-[closed]:opacity-0 data-[enter]:ease-out data-[leave]:ease-in',
              'sm:data-[closed]:translate-y-0 sm:data-[closed]:scale-95 sm:data-[closed]:data-[enter]:duration-300 sm:data-[closed]:data-[leave]:duration-200'
            )}
          >
            {children}
          </DialogPanel>
        </div>
      </div>
    </HeadlessDialog>
  );
}

// Dialog Header
interface DialogHeaderProps {
  title: string;
  description?: string;
  onClose?: () => void;
}

export function DialogHeader({ title, description, onClose }: DialogHeaderProps) {
  return (
    <div className="relative">
      <DialogTitle className="text-balance text-lg/6 font-semibold text-zinc-950 dark:text-white sm:text-base/6">
        {title}
      </DialogTitle>
      {description && (
        <Description className="mt-2 text-pretty text-sm/6 text-zinc-500 dark:text-zinc-400">
          {description}
        </Description>
      )}
      {onClose && (
        <div className="absolute right-0 top-0">
          <IconButton plain color="secondary" onClick={onClose} aria-label="닫기">
            <X className="size-5" />
          </IconButton>
        </div>
      )}
    </div>
  );
}

// Dialog Body
interface DialogBodyProps {
  children: ReactNode;
  className?: string;
}

export function DialogBody({ children, className }: DialogBodyProps) {
  return <div className={clsx('mt-8', className)}>{children}</div>;
}

// Dialog Footer
interface DialogFooterProps {
  children: ReactNode;
  className?: string;
}

export function DialogFooter({ children, className }: DialogFooterProps) {
  return (
    <div
      className={clsx(
        'mt-8 flex flex-col-reverse items-center justify-end gap-3 *:w-full sm:flex-row sm:*:w-auto',
        className
      )}
    >
      {children}
    </div>
  );
}

// Dialog Actions (alias for Footer)
export const DialogActions = DialogFooter;

// Confirm Dialog
interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
  isLoading?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = '확인',
  cancelText = '취소',
  variant = 'primary',
  isLoading = false,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} size="sm">
      <DialogHeader title={title} description={description} />
      <DialogFooter>
        <Button plain color="secondary" onClick={onClose} disabled={isLoading}>
          {cancelText}
        </Button>
        <Button
          color={variant === 'danger' ? 'danger' : 'primary'}
          onClick={onConfirm}
          isLoading={isLoading}
        >
          {confirmText}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

// Alert Dialog (Info only)
interface AlertDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  confirmText?: string;
}

export function AlertDialog({
  open,
  onClose,
  title,
  description,
  confirmText = '확인',
}: AlertDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} size="sm">
      <DialogHeader title={title} description={description} />
      <DialogFooter>
        <Button color="primary" onClick={onClose}>
          {confirmText}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
