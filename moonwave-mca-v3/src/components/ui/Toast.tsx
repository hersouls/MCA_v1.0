// ============================================
// Toast Component (Catalyst-style)
// ============================================

import { useCallback } from 'react';
import { clsx } from 'clsx';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useUIStore, useToasts } from '@/stores/uiStore';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastItemProps {
  id: string;
  message: string;
  type: ToastType;
  onDismiss: (id: string) => void;
}

const typeConfig: Record<
  ToastType,
  { icon: typeof CheckCircle; className: string; iconClassName: string }
> = {
  success: {
    icon: CheckCircle,
    className: 'bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800',
    iconClassName: 'text-success-500',
  },
  error: {
    icon: AlertCircle,
    className: 'bg-danger-50 dark:bg-danger-900/20 border-danger-200 dark:border-danger-800',
    iconClassName: 'text-danger-500',
  },
  warning: {
    icon: AlertTriangle,
    className: 'bg-warning-50 dark:bg-warning-900/20 border-warning-200 dark:border-warning-800',
    iconClassName: 'text-warning-500',
  },
  info: {
    icon: Info,
    className: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    iconClassName: 'text-blue-500',
  },
};

function ToastItem({ id, message, type, onDismiss }: ToastItemProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={clsx(
        'flex items-start gap-3 p-4 rounded-lg border shadow-lg',
        'animate-slide-up',
        config.className
      )}
      role="alert"
    >
      <Icon className={clsx('w-5 h-5 flex-shrink-0 mt-0.5', config.iconClassName)} />
      <p className="flex-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
        {message}
      </p>
      <button
        onClick={() => onDismiss(id)}
        className="flex-shrink-0 p-1 rounded-md hover:bg-zinc-900/10 dark:hover:bg-white/10 transition-colors"
        aria-label="닫기"
      >
        <X className="w-4 h-4 text-zinc-500" />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const toasts = useToasts();
  const dismissToast = useUIStore((state) => state.dismissToast);

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      aria-live="polite"
      aria-label="알림"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem
            id={toast.id}
            message={toast.message}
            type={toast.type}
            onDismiss={dismissToast}
          />
        </div>
      ))}
    </div>
  );
}

// Hook for showing toasts
export function useToast() {
  const showToast = useUIStore((state) => state.showToast);
  const dismissToast = useUIStore((state) => state.dismissToast);
  const clearAllToasts = useUIStore((state) => state.clearAllToasts);

  const toast = useCallback(
    (message: string, type: ToastType = 'info', duration?: number) => {
      showToast(message, type, duration);
    },
    [showToast]
  );

  return {
    toast,
    success: (message: string, duration?: number) => toast(message, 'success', duration),
    error: (message: string, duration?: number) => toast(message, 'error', duration),
    warning: (message: string, duration?: number) => toast(message, 'warning', duration),
    info: (message: string, duration?: number) => toast(message, 'info', duration),
    dismiss: dismissToast,
    clearAll: clearAllToasts,
  };
}
