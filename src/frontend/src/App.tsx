import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import LeadsPage from './pages/LeadsPage';
import CommissionsPage from './pages/CommissionsPage';
import NewsPage from './pages/NewsPage';
import AdminPropertiesPage from './pages/AdminPropertiesPage';
import AuthGuard from './components/AuthGuard';
import ProfileSetupModal from './components/ProfileSetupModal';

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <ProfileSetupModal />
      <Toaster />
    </>
  ),
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LoginPage,
});

const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'layout',
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const newsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/news',
  component: NewsPage,
});

const authLayoutRoute = createRoute({
  getParentRoute: () => layoutRoute,
  id: 'authLayout',
  component: () => (
    <AuthGuard>
      <Outlet />
    </AuthGuard>
  ),
});

const dashboardRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/dashboard',
  component: DashboardPage,
});

const leadsRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/leads',
  component: LeadsPage,
});

const commissionsRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/commissions',
  component: CommissionsPage,
});

const adminPropertiesRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/admin/properties',
  component: AdminPropertiesPage,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  layoutRoute.addChildren([
    newsRoute,
    authLayoutRoute.addChildren([dashboardRoute, leadsRoute, commissionsRoute, adminPropertiesRoute]),
  ]),
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
