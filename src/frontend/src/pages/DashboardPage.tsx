import { useGetProperties, useGetQubeYardsBalance } from '../hooks/useQueries';
import PropertyList from '../components/PropertyList';
import CurrencyBalanceCard from '../components/CurrencyBalanceCard';
import { Building2, TrendingUp, Home, Sparkles } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function DashboardPage() {
  const { data: properties = [], isLoading } = useGetProperties();
  const { identity } = useInternetIdentity();
  const { data: balance } = useGetQubeYardsBalance();

  const availableProperties = properties.filter((p) => p.status === 'available');
  const residentialCount = properties.filter((p) => p.propertyType === 'residential').length;
  const commercialCount = properties.filter((p) => p.propertyType === 'commercial').length;

  return (
    <div className="min-h-screen">
      <div className="relative h-[400px] overflow-hidden">
        <img
          src="/assets/generated/hero-luxury.dim_1920x600.png"
          alt="QubeYards Real Estate"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/50">
          <div className="container h-full flex items-center">
            <div className="max-w-2xl space-y-4">
              <h1 className="text-5xl font-bold tracking-tight">
                Welcome to{' '}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  QubeYards
                </span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Premium real estate platform connecting partners with exceptional properties across India.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Special Offers Banner */}
        <div className="mb-8 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-2 border-primary/20 rounded-xl p-6 shadow-medium">
          <div className="flex items-center gap-3 justify-center">
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            <p className="text-lg md:text-xl font-semibold text-center">
              🎉 Limited Time Offer: Get 20% off on pre-launch projects! Book now and save big! 🎉
            </p>
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
          </div>
        </div>

        {/* Pan-India Coverage Badge */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
            <Building2 className="h-4 w-4" />
            Properties available across India - Pan-India Coverage
          </div>
        </div>

        {/* Currency Balance Card for Partners */}
        {identity && balance !== undefined && (
          <div className="mb-8">
            <CurrencyBalanceCard balance={balance} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card rounded-lg border p-6 shadow-soft">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Available Properties</p>
                <p className="text-3xl font-bold">{availableProperties.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border p-6 shadow-soft">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Home className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Residential</p>
                <p className="text-3xl font-bold">{residentialCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border p-6 shadow-soft">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-secondary/20 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Commercial</p>
                <p className="text-3xl font-bold">{commercialCount}</p>
              </div>
            </div>
          </div>
        </div>

        <PropertyList properties={properties} isLoading={isLoading} />
      </div>
    </div>
  );
}
