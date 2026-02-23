import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import LoginButton from '../components/LoginButton';
import { Building2 } from 'lucide-react';

export default function LoginPage() {
  const { identity, isInitializing } = useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isInitializing && identity) {
      navigate({ to: '/dashboard' });
    }
  }, [identity, isInitializing, navigate]);

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="space-y-4">
            <div className="flex justify-center">
              <img
                src="/assets/generated/partner-icon.dim_128x128.png"
                alt="Partner Connect"
                className="h-24 w-24 rounded-2xl shadow-medium"
              />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Partner Connect
                </span>
              </h1>
              <p className="text-xl text-muted-foreground">Real Estate Channel Partner Portal</p>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <p className="text-muted-foreground">
              Manage your properties, track leads, and monitor commissions all in one place.
            </p>
            <LoginButton />
          </div>

          <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="space-y-2">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold">Property Listings</h3>
              <p className="text-sm text-muted-foreground">
                Access comprehensive property database with detailed information
              </p>
            </div>
            <div className="space-y-2">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold">Lead Management</h3>
              <p className="text-sm text-muted-foreground">
                Track and manage customer leads efficiently
              </p>
            </div>
            <div className="space-y-2">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold">Commission Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Monitor earnings and payment history in real-time
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t bg-card/50 py-6">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Partner Connect. All rights reserved.</p>
          <p>
            Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.hostname : 'partner-connect'
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

