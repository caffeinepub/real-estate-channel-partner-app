import { useGetLeads } from '../hooks/useQueries';
import LeadList from '../components/LeadList';
import { Users } from 'lucide-react';
import { LeadStatus } from '../backend';

export default function LeadsPage() {
  const { data: leads = [], isLoading } = useGetLeads();

  const newLeads = leads.filter((l) => l.status === LeadStatus.new_);
  const inProgressLeads = leads.filter((l) => l.status === LeadStatus.inProgress);
  const closedLeads = leads.filter((l) => l.status === LeadStatus.closed);

  return (
    <div className="container py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Lead Management</h1>
          <p className="text-muted-foreground">Track and manage your customer leads</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-card rounded-lg border p-6 shadow-soft">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Leads</p>
                <p className="text-3xl font-bold">{leads.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border p-6 shadow-soft">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">New</p>
                <p className="text-3xl font-bold">{newLeads.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border p-6 shadow-soft">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-3xl font-bold">{inProgressLeads.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border p-6 shadow-soft">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Closed</p>
                <p className="text-3xl font-bold">{closedLeads.length}</p>
              </div>
            </div>
          </div>
        </div>

        <LeadList leads={leads} isLoading={isLoading} />
      </div>
    </div>
  );
}

