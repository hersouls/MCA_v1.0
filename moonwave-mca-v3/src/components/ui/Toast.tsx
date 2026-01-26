// ============================================
// Toast Component (Catalyst-style)
// ============================================
/* eslint-disable react-refresh/only-export-components */

import { useToasts, useUIStore } from '@/stores/uiStore';
import { clsx } from 'clsx';
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import { useCallback } from 'react';

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
    className: 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800',
    iconClassName: 'text-primary-500',
  },
};

// Toast type labels for screen readers
const typeLabels: Record<ToastType, string> = {
  success: '성공',
  error: '오류',
  warning: '경고',
  info: '알림',
};

function ToastItem({ id, message, type, onDismiss }: ToastItemProps) {
  const config = typeConfig[type];
  const Icon = config.icon;
  const typeLabel = typeLabels[type];

  return (
    <div
      className={clsx(
        'flex items-start gap-3 p-4 rounded-lg border shadow-lg',
        'animate-slide-up',
        config.className
      )}
      role="alert"
      aria-atomic="true"
    >
      <Icon
        className={clsx('w-5 h-5 flex-shrink-0 mt-0.5', config.iconClassName)}
        aria-hidden="true"
      />
      <p className="flex-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
        <span className="sr-only">{typeLabel}: </span>
        {message}
      </p>
      <button
        onClick={() => onDismiss(id)}
        className="flex-shrink-0 p-1 rounded-md hover:bg-zinc-900/10 dark:hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        aria-label={`${typeLabel} 알림 닫기`}
        type="button"
      >
        <X className="w-4 h-4 text-zinc-500" aria-hidden="true" />
      </button>
    </div>
  );
}

// Maximum number of toasts to display at once
const MAX_VISIBLE_TOASTS = 3;

export function ToastContainer() {
  const allToasts = useToasts();
  const dismissToast = useUIStore((state) => state.dismissToast);

  // Only show the most recent MAX_VISIBLE_TOASTS
  const toasts = allToasts.slice(-MAX_VISIBLE_TOASTS);

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      role="region"
      aria-label="시스템 알림"
      aria-live="polite"
      aria-relevant="additions"
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
