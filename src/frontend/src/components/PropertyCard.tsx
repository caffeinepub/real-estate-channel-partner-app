import type { Property } from '../backend';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, DollarSign } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const imageSrc =
    property.propertyType === 'residential'
      ? '/assets/generated/property-residential.dim_800x600.png'
      : '/assets/generated/property-commercial.dim_800x600.png';

  const formatPrice = (price: bigint) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(Number(price));
  };

  return (
    <Card className="overflow-hidden hover:shadow-medium transition-shadow">
      <div className="relative h-48 overflow-hidden">
        <img src={imageSrc} alt={property.location} className="w-full h-full object-cover" />
        <div className="absolute top-3 right-3">
          <Badge variant={property.status === 'available' ? 'default' : 'secondary'}>
            {property.status}
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
      <CardFooter className="p-4 pt-0">
        <Badge variant="outline" className="capitalize">
          {property.propertyType}
        </Badge>
      </CardFooter>
    </Card>
  );
}

