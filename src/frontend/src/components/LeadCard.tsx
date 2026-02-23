import type { Lead } from '../backend';
import { LeadStatus } from '../backend';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';

interface LeadCardProps {
  lead: Lead;
}

export default function LeadCard({ lead }: LeadCardProps) {
  const getStatusLabel = (status: LeadStatus) => {
    switch (status) {
      case LeadStatus.new_:
        return 'New';
      case LeadStatus.contacted:
        return 'Contacted';
      case LeadStatus.inProgress:
        return 'In Progress';
      case LeadStatus.closed:
        return 'Closed';
      default:
        return status;
    }
  };

  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case LeadStatus.new_:
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
      case LeadStatus.contacted:
        return 'bg-purple-500/10 text-purple-700 dark:text-purple-400';
      case LeadStatus.inProgress:
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      case LeadStatus.closed:
        return 'bg-green-500/10 text-green-700 dark:text-green-400';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="hover:shadow-soft transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg">{lead.customerName}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Status</span>
          <Badge className={getStatusColor(lead.status)}>{getStatusLabel(lead.status)}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}

