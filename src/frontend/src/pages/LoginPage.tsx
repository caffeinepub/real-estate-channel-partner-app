import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import LoginButton from '../components/LoginButton';
import { Building2, TrendingUp, Users } from 'lucide-react';

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
                src="/assets/generated/qubeyards-logo.dim_200x80.png"
                alt="QubeYards"
                className="h-20 w-auto"
              />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  QubeYards
                </span>
              </h1>
              <p className="text-xl text-muted-foreground">Premium Real Estate Platform</p>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <p className="text-muted-foreground">
              Connect with exceptional properties across India. Buy, sell, or rent with confidence.
            </p>
            <LoginButton />
          </div>

          <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="space-y-2">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold">Pan-India Properties</h3>
              <p className="text-sm text-muted-foreground">
                Access properties from every corner of India
              </p>
            </div>
            <div className="space-y-2">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold">Earn Rewards</h3>
              <p className="text-sm text-muted-foreground">
                Get QubeYards currency for listings and referrals
              </p>
            </div>
            <div className="space-y-2">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold">Partner Network</h3>
              <p className="text-sm text-muted-foreground">
                Join our trusted channel partner community
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t bg-card/50 py-6">
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
