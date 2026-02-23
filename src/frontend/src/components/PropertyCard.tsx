import type { Property } from '../backend';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, DollarSign, CheckCircle } from 'lucide-react';
import { useIsCallerAdmin, useApproveProperty } from '../hooks/useQueries';
import { toast } from 'sonner';

interface PropertyCardProps {
  property: Property;
  showApproveButton?: boolean;
}

export default function PropertyCard({ property, showApproveButton = false }: PropertyCardProps) {
  const { data: isAdmin = false } = useIsCallerAdmin();
  const approvePropertyMutation = useApproveProperty();

  const imageSrc =
    property.propertyType === 'residential'
      ? '/assets/generated/property-residential.dim_800x600.png'
      : '/assets/generated/property-commercial.dim_800x600.png';

  const formatPrice = (price: bigint) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(price));
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'available':
        return 'default';
      case 'pendingApproval':
        return 'secondary';
      case 'sold':
      case 'rented':
        return 'outline';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pendingApproval':
        return 'Pending Approval';
      case 'available':
        return 'Available';
      case 'sold':
        return 'Sold';
      case 'rented':
        return 'Rented';
      default:
        return status;
    }
  };

  const getProjectStageLabel = (stage: string) => {
    switch (stage) {
      case 'preLaunch':
        return 'Pre-Launch';
      case 'launch':
        return 'Launch';
      case 'readyToShift':
        return 'Ready to Shift';
      default:
        return stage;
    }
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case 'buy':
        return 'Buy';
      case 'sell':
        return 'Sell';
      case 'rent':
        return 'Rent';
      default:
        return type;
    }
  };

  const handleApprove = async () => {
    try {
      await approvePropertyMutation.mutateAsync(property.id);
      toast.success('Property approved successfully!');
    } catch (error) {
      toast.error('Failed to approve property');
      console.error('Approve error:', error);
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-medium transition-shadow">
      <div className="relative h-48 overflow-hidden">
        <img src={imageSrc} alt={property.location} className="w-full h-full object-cover" />
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <Badge variant={getStatusVariant(property.status)}>
            {getStatusLabel(property.status)}
          </Badge>
          <Badge className="bg-accent text-accent-foreground">
            {getProjectStageLabel(property.projectStage)}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm font-medium">{property.location}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          <span className="text-2xl font-bold text-primary">{formatPrice(property.price)}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-wrap gap-2">
        <Badge variant="outline" className="capitalize">
          {property.propertyType}
        </Badge>
        <Badge variant="outline" className="capitalize">
          {getTransactionTypeLabel(property.transactionType)}
        </Badge>
        {isAdmin && property.status === 'pendingApproval' && (
          <Button
            size="sm"
            onClick={handleApprove}
            disabled={approvePropertyMutation.isPending}
            className="ml-auto"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            {approvePropertyMutation.isPending ? 'Approving...' : 'Approve'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
