// ============================================
// Dialog Component (Catalyst-style with Headless UI)
// ============================================

import { Fragment, type ReactNode } from 'react';
import {
  Dialog as HeadlessDialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import { clsx } from 'clsx';
import { X } from 'lucide-react';
import { Button, IconButton } from './Button';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const sizeStyles = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-4xl',
};

export function Dialog({ open, onClose, children, size = 'md' }: DialogProps) {
  return (
    <Transition show={open} as={Fragment}>
      <HeadlessDialog onClose={onClose} className="relative z-50">
        {/* Backdrop */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-zinc-900/50 dark:bg-zinc-950/75 backdrop-blur-sm" />
        </TransitionChild>

        {/* Dialog Container */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel
                className={clsx(
                  'w-full rounded-2xl bg-white dark:bg-zinc-900',
                  'border border-zinc-200 dark:border-zinc-800',
                  'shadow-2xl',
                  'transform transition-all',
                  sizeStyles[size]
                )}
              >
                {children}
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </HeadlessDialog>
    </Transition>
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
    <div className="flex items-start justify-between gap-4 p-6 pb-0">
      <div>
        <DialogTitle className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </DialogTitle>
        {description && (
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {description}
          </p>
        )}
      </div>
      {onClose && (
        <IconButton variant="ghost" onClick={onClose} aria-label="닫기">
          <X className="w-5 h-5" />
        </IconButton>
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
  return <div className={clsx('p-6', className)}>{children}</div>;
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
        'flex items-center justify-end gap-3 p-6 pt-0',
        className
      )}
    >
      {children}
    </div>
  );
}

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
        <Button variant="secondary" onClick={onClose} disabled={isLoading}>
          {cancelText}
        </Button>
        <Button
          variant={variant === 'danger' ? 'danger' : 'primary'}
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
        <Button variant="primary" onClick={onClose}>
          {confirmText}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
