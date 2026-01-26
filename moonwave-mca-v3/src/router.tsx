// ============================================
// Router Configuration
// ============================================
/* eslint-disable react-refresh/only-export-components */

import { LoadingState } from '@/components/layout';
import { Suspense, lazy } from 'react';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';

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
    <div className="flex-1 flex items-center justify-center">
      <LoadingState message="페이지 불러오는 중..." />
    </div>
  );
}

// Router configuration
const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Navigate to="/dashboard" replace />,
    },
    {
      path: '/dashboard',
      element: (
        <Suspense fallback={<PageLoader />}>
          <Dashboard />
        </Suspense>
      ),
    },
    {
      path: '/portfolio/:id',
      element: (
        <Suspense fallback={<PageLoader />}>
          <PortfolioDetail />
        </Suspense>
      ),
    },
    {
      path: '/settings',
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
  {
    // GitHub Pages 배포를 위한 basename 설정
    basename: import.meta.env.BASE_URL,
  }
);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

export { router };
