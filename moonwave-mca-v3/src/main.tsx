// ============================================
// Application Entry Point
// ============================================
/* eslint-disable react-refresh/only-export-components */

import { StrictMode } from 'react';
import { Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';

import { LoadingState } from '@/components/layout';
import { NotFound } from '@/components/NotFound';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import { App } from './App';
import './index.css';

// Lazy load pages for code splitting
const Dashboard = lazy(() =>
  import('@/components/dashboard/Dashboard').then((module) => ({
    default: module.Dashboard,
  }))
);

const PortfolioDetail = lazy(() =>
  import('@/components/portfolio/PortfolioDetail').then((module) => ({
    default: module.PortfolioDetail,
  }))
);

const Settings = lazy(() =>
  import('@/components/settings/Settings').then((module) => ({
    default: module.Settings,
  }))
);

// Loading fallback
function PageLoader() {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <LoadingState message="페이지 불러오는 중..." />
    </div>
  );
}

// Router configuration
const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      errorElement: <RouteErrorBoundary />,
      children: [
        {
          index: true,
          element: <Navigate to="/dashboard" replace />,
        },
        {
          path: 'dashboard',
          errorElement: <RouteErrorBoundary />,
          element: (
            <Suspense fallback={<PageLoader />}>
              <Dashboard />
            </Suspense>
          ),
        },
        {
          path: 'portfolio/:id',
          errorElement: <RouteErrorBoundary />,
          element: (
            <Suspense fallback={<PageLoader />}>
              <PortfolioDetail />
            </Suspense>
          ),
        },
        {
          path: 'settings',
          errorElement: <RouteErrorBoundary />,
          element: (
            <Suspense fallback={<PageLoader />}>
              <Settings />
            </Suspense>
          ),
        },
        {
          path: '*',
          element: <NotFound />,
        },
      ],
    },
  ],
  {
    // GitHub Pages 배포를 위한 basename 설정
    basename: import.meta.env.BASE_URL,
  }
);

// Service Worker handling
if ('serviceWorker' in navigator) {
  if (import.meta.env.PROD) {
    // Production: Register SW with update detection
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');

        // Check for updates periodically (every 60 minutes)
        setInterval(() => registration.update(), 60 * 60 * 1000);

        // Handle SW updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New version available - show update prompt
              if (window.confirm('새 버전이 있습니다. 업데이트하시겠습니까?')) {
                newWorker.postMessage('skipWaiting');
                window.location.reload();
              }
            }
          });
        });
      } catch (error) {
        console.error('SW registration failed:', error);
      }
    });
  } else {
    // Development: Unregister all SWs to avoid cache issues
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => registration.unregister());
    });
  }
}

// PWA Install Prompt handling
let deferredPrompt: BeforeInstallPromptEvent | null = null;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e as BeforeInstallPromptEvent;
  // Dispatch custom event for UI components to listen
  window.dispatchEvent(new CustomEvent('pwaInstallAvailable'));
});

// Export install function for UI components
(window as Window & { installPWA?: () => Promise<boolean> }).installPWA = async () => {
  if (!deferredPrompt) return false;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  deferredPrompt = null;
  return outcome === 'accepted';
};

// Render app
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
