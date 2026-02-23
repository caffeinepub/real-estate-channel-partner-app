import { useGetCommissions } from '../hooks/useQueries';
import CommissionSummary from '../components/CommissionSummary';
import CommissionTable from '../components/CommissionTable';

export default function CommissionsPage() {
  const { data: commissions = [], isLoading } = useGetCommissions();

  return (
    <div className="container py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Commission Tracking</h1>
          <p className="text-muted-foreground">Monitor your earnings and payment history</p>
        </div>

        <CommissionSummary commissions={commissions} isLoading={isLoading} />
        <CommissionTable commissions={commissions} isLoading={isLoading} />
      </div>
    </div>
  );
}

