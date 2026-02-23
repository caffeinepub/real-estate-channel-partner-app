import type { Commission } from '../backend';
import { DollarSign, Clock, CheckCircle } from 'lucide-react';

interface CommissionSummaryProps {
  commissions: Commission[];
  isLoading: boolean;
}

export default function CommissionSummary({ commissions, isLoading }: CommissionSummaryProps) {
  const totalEarned = commissions
    .filter((c) => c.status === 'paid')
    .reduce((sum, c) => sum + Number(c.amount), 0);

  const totalPending = commissions
    .filter((c) => c.status === 'pending' || c.status === 'earned')
    .reduce((sum, c) => sum + Number(c.amount), 0);

  const paidCount = commissions.filter((c) => c.status === 'paid').length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card rounded-lg border p-6 animate-pulse">
            <div className="space-y-2">
              <div className="bg-muted h-4 rounded w-1/2"></div>
              <div className="bg-muted h-8 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-card rounded-lg border p-6 shadow-soft">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Earned</p>
            <p className="text-3xl font-bold text-green-600">{formatCurrency(totalEarned)}</p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border p-6 shadow-soft">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
            <Clock className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">{formatCurrency(totalPending)}</p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border p-6 shadow-soft">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <DollarSign className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Payments Received</p>
            <p className="text-3xl font-bold">{paidCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

