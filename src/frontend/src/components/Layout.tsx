import { type ReactNode } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { LayoutDashboard, Users, DollarSign, Newspaper, CheckCircle } from 'lucide-react';
import LoginButton from './LoginButton';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useQueries';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { identity } = useInternetIdentity();
  const { data: isAdmin = false } = useIsCallerAdmin();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, requiresAuth: true },
    { path: '/leads', label: 'Leads', icon: Users, requiresAuth: true },
    { path: '/commissions', label: 'Commissions', icon: DollarSign, requiresAuth: true },
    { path: '/news', label: 'News & Magazine', icon: Newspaper, requiresAuth: false },
  ];

  const adminNavItems = [
    { path: '/admin/properties', label: 'Pending Approvals', icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-3">
              <img
                src="/assets/generated/qubeyards-logo.dim_200x80.png"
                alt="QubeYards"
                className="h-10 w-auto"
              />
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => {
                if (item.requiresAuth && !identity) return null;
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
              {identity && isAdmin && adminNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <LoginButton />
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t bg-card/50 py-6 mt-auto">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} QubeYards. All rights reserved.</p>
          <p>
            Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.hostname : 'qubeyards'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:text-primary transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
