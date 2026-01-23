// ============================================
// Application Entry Point
// ============================================

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';

import { App } from './App';
import { LoadingState } from '@/components/layout';
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
      children: [
        {
          index: true,
          element: <Navigate to="/dashboard" replace />,
        },
        {
          path: 'dashboard',
          element: (
            <Suspense fallback={<PageLoader />}>
              <Dashboard />
            </Suspense>
          ),
        },
        {
          path: 'portfolio/:id',
          element: (
            <Suspense fallback={<PageLoader />}>
              <PortfolioDetail />
            </Suspense>
          ),
        },
        {
          path: 'settings',
          element: (
            <Suspense fallback={<PageLoader />}>
              <Settings />
            </Suspense>
          ),
        },
        {
          path: '*',
          element: <Navigate to="/dashboard" replace />,
        },
      ],
    },
  ],
  {
    // GitHub Pages 배포를 위한 basename 설정
    basename: import.meta.env.BASE_URL,
  }
);

// Register Service Worker for PWA
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('SW registered:', registration);
      })
      .catch((error) => {
        console.log('SW registration failed:', error);
      });
  });
}

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
