import { useState } from 'react';
import type { Lead } from '../backend';
import LeadCard from './LeadCard';
import AddLeadForm from './AddLeadForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface LeadListProps {
  leads: Lead[];
  isLoading: boolean;
}

export default function LeadList({ leads, isLoading }: LeadListProps) {
  const [showAddForm, setShowAddForm] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Your Leads</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-lg border p-4 animate-pulse">
              <div className="space-y-2">
                <div className="bg-muted h-4 rounded w-3/4"></div>
                <div className="bg-muted h-4 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Leads</h2>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Lead
        </Button>
      </div>

      {showAddForm && (
        <div className="bg-card rounded-lg border p-6 shadow-soft">
          <AddLeadForm onSuccess={() => setShowAddForm(false)} />
        </div>
      )}

      {leads.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg border">
          <p className="text-muted-foreground">No leads yet. Add your first lead to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {leads.map((lead) => (
            <LeadCard key={lead.id.toString()} lead={lead} />
          ))}
        </div>
      )}
    </div>
  );
}

