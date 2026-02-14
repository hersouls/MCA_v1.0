// ============================================
// Toast Component (Catalyst-style)
// ============================================
/* eslint-disable react-refresh/only-export-components */

import { type ToastAction, useToasts, useUIStore } from '@/stores/uiStore';
import { clsx } from 'clsx';
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import { useCallback, useEffect, useRef } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastItemProps {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  action?: ToastAction;
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

function ToastItem({ id, message, type, duration = 3000, action, onDismiss }: ToastItemProps) {
  const config = typeConfig[type];
  const Icon = config.icon;
  const typeLabel = typeLabels[type];

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const remainingRef = useRef(duration);
  const startTimeRef = useRef(Date.now());

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(
    (timeLeft: number) => {
      if (timeLeft <= 0) return;
      clearTimer();
      startTimeRef.current = Date.now();
      remainingRef.current = timeLeft;
      timerRef.current = setTimeout(() => {
        onDismiss(id);
      }, timeLeft);
    },
    [clearTimer, id, onDismiss]
  );

  const handlePause = useCallback(() => {
    if (timerRef.current) {
      const elapsed = Date.now() - startTimeRef.current;
      remainingRef.current = Math.max(0, remainingRef.current - elapsed);
      clearTimer();
    }
  }, [clearTimer]);

  const handleResume = useCallback(() => {
    startTimer(remainingRef.current);
  }, [startTimer]);

  useEffect(() => {
    if (duration > 0) {
      startTimer(duration);
    }
    return clearTimer;
  }, [duration, startTimer, clearTimer]);

  return (
    <div
      className={clsx(
        'flex items-start gap-3 p-4 rounded-lg border shadow-lg',
        'animate-slide-up',
        config.className
      )}
      role="alert"
      aria-atomic="true"
      onMouseEnter={handlePause}
      onMouseLeave={handleResume}
      onFocus={handlePause}
      onBlur={handleResume}
    >
      <Icon
        className={clsx('w-5 h-5 flex-shrink-0 mt-0.5', config.iconClassName)}
        aria-hidden="true"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">
          <span className="sr-only">{typeLabel}: </span>
          {message}
        </p>
        {action && (
          <button
            onClick={action.onClick}
            className="mt-1 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
            type="button"
          >
            {action.label}
          </button>
        )}
      </div>
      <button
        onClick={() => onDismiss(id)}
        className="flex-shrink-0 p-1 rounded-md hover:bg-foreground/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        aria-label={`${typeLabel} 알림 닫기`}
        type="button"
      >
        <X className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
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
            duration={toast.duration}
            action={toast.action}
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
    (message: string, type: ToastType = 'info', duration?: number, action?: ToastAction) => {
      showToast(message, type, duration, action);
    },
    [showToast]
  );

  return {
    toast,
    success: (message: string, duration?: number, action?: ToastAction) => toast(message, 'success', duration, action),
    error: (message: string, duration?: number, action?: ToastAction) => toast(message, 'error', duration, action),
    warning: (message: string, duration?: number, action?: ToastAction) => toast(message, 'warning', duration, action),
    info: (message: string, duration?: number, action?: ToastAction) => toast(message, 'info', duration, action),
    dismiss: dismissToast,
    clearAll: clearAllToasts,
  };
}
