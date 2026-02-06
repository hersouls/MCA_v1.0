// ============================================
// Error Boundary Component
// ============================================

import { Button } from '@/components/ui/Button';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { Component, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });
    // Log error to console in development
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center"
          role="alert"
          aria-live="assertive"
        >
          <div className="mb-6 p-4 rounded-full bg-danger-100 dark:bg-danger-900/30">
            <AlertTriangle className="w-12 h-12 text-danger-500" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            오류가 발생했습니다
          </h1>
          <p className="text-muted-foreground mb-6 max-w-md">
            페이지를 표시하는 중에 문제가 발생했습니다.
            <br />
            다시 시도하거나 대시보드로 이동해 주세요.
          </p>

          {/* Error details in development */}
          {import.meta.env.DEV && this.state.error && (
            <details className="mb-6 w-full max-w-lg text-left">
              <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                오류 상세 정보
              </summary>
              <pre className="mt-2 p-4 rounded-lg bg-surface-hover text-xs text-muted-foreground overflow-auto max-h-48">
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              color="primary"
              onClick={this.handleRetry}
              leftIcon={<RefreshCw className="w-4 h-4" aria-hidden="true" />}
            >
              다시 시도
            </Button>
            <Button
              color="secondary"
              outline
              onClick={this.handleGoHome}
              leftIcon={<Home className="w-4 h-4" aria-hidden="true" />}
            >
              대시보드로 이동
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Functional wrapper for easier use with hooks
interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
}

export function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <div
      className="min-h-[300px] flex flex-col items-center justify-center p-6 text-center"
      role="alert"
      aria-live="assertive"
    >
      <div className="mb-4 p-3 rounded-full bg-danger-100 dark:bg-danger-900/30">
        <AlertTriangle className="w-8 h-8 text-danger-500" aria-hidden="true" />
      </div>
      <h2 className="text-lg font-semibold text-foreground mb-2">
        문제가 발생했습니다
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        {error?.message || '알 수 없는 오류가 발생했습니다.'}
      </p>
      {resetError && (
        <Button
          color="primary"
          size="sm"
          onClick={resetError}
          leftIcon={<RefreshCw className="w-4 h-4" aria-hidden="true" />}
        >
          다시 시도
        </Button>
      )}
    </div>
  );
}

export default ErrorBoundary;
