import { useGetProperties } from '../hooks/useQueries';
import PropertyList from '../components/PropertyList';
import { Building2, TrendingUp, Home } from 'lucide-react';

export default function DashboardPage() {
  const { data: properties = [], isLoading } = useGetProperties();

  const availableProperties = properties.filter((p) => p.status === 'available');
  const residentialCount = properties.filter((p) => p.propertyType === 'residential').length;
  const commercialCount = properties.filter((p) => p.propertyType === 'commercial').length;

  return (
    <div className="min-h-screen">
      <div className="relative h-[400px] overflow-hidden">
        <img
          src="/assets/generated/hero-banner.dim_1920x600.png"
          alt="Real Estate"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/50">
          <div className="container h-full flex items-center">
            <div className="max-w-2xl space-y-4">
              <h1 className="text-5xl font-bold tracking-tight">
                Welcome to Your{' '}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Partner Dashboard
                </span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Discover premium properties and grow your real estate business with us.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
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

