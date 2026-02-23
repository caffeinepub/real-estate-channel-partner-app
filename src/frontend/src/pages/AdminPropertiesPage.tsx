import { useGetProperties, useIsCallerAdmin } from '../hooks/useQueries';
import PropertyCard from '../components/PropertyCard';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function AdminPropertiesPage() {
  const { data: isAdmin = false, isLoading: isLoadingAdmin } = useIsCallerAdmin();
  const { data: properties = [], isLoading: isLoadingProperties } = useGetProperties();

  const pendingProperties = properties.filter((p) => p.status === 'pendingApproval');

  if (isLoadingAdmin || isLoadingProperties) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You do not have permission to access this page. Only administrators can approve properties.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <CheckCircle className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Pending Property Approvals</h1>
            <p className="text-muted-foreground">
              Review and approve property listings submitted by partners
            </p>
          </div>
        </div>

        {pendingProperties.length === 0 ? (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>All Caught Up!</AlertTitle>
            <AlertDescription>
              There are no properties pending approval at this time.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="bg-card rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{pendingProperties.length}</span> properties awaiting approval
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingProperties.map((property) => (
                <PropertyCard key={property.id.toString()} property={property} showApproveButton />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
