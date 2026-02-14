// ============================================
// Route-Level Error Boundary
// ============================================

import { Button } from '@/components/ui/Button';
import { TEXTS } from '@/utils/texts';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router-dom';

export function RouteErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  const getErrorMessage = () => {
    if (isRouteErrorResponse(error)) {
      return error.statusText || TEXTS.ERROR.UNKNOWN_ERROR;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return TEXTS.ERROR.UNKNOWN_ERROR;
  };

  const getErrorTitle = () => {
    if (isRouteErrorResponse(error)) {
      if (error.status === 404) return TEXTS.ERROR.PAGE_NOT_FOUND;
      if (error.status === 500) return TEXTS.ERROR.SERVER_ERROR;
    }
    return TEXTS.ERROR.PAGE_ERROR;
  };

  const handleRetry = () => {
    window.location.reload();
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/dashboard', { replace: true });
  };

  return (
    <div
      className="min-h-[400px] flex items-center justify-center p-8 bg-background"
      role="alert"
      aria-live="assertive"
    >
      <div className="text-center max-w-md">
        <div className="mb-6 p-4 rounded-full bg-danger-100 dark:bg-danger-900/30 inline-flex">
          <AlertTriangle className="w-12 h-12 text-danger-500" aria-hidden="true" />
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-2">{getErrorTitle()}</h1>
        <p className="text-muted-foreground mb-8">{getErrorMessage()}</p>

        {/* Error details in development */}
        {import.meta.env.DEV && error instanceof Error && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
              {TEXTS.ERROR.ERROR_DETAILS}
            </summary>
            <pre className="mt-2 p-4 rounded-lg bg-surface-hover text-xs text-muted-foreground overflow-auto max-h-48">
              {error.stack}
            </pre>
          </details>
        )}

        {/* 3-step recovery */}
        <div className="flex flex-col gap-3">
          <Button
            color="primary"
            onClick={handleRetry}
            leftIcon={<RefreshCw className="w-4 h-4" aria-hidden="true" />}
          >
            {TEXTS.ERROR.REFRESH_PAGE}
          </Button>
          <Button color="secondary" outline onClick={handleGoBack}>
            {TEXTS.ERROR.GO_BACK}
          </Button>
          <Button
            color="secondary"
            plain
            onClick={handleGoHome}
            leftIcon={<Home className="w-4 h-4" aria-hidden="true" />}
          >
            {TEXTS.ERROR.GO_DASHBOARD}
          </Button>
        </div>
      </div>
    </div>
  );
}
