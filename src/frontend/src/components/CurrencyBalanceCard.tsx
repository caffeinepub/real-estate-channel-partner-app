import { Card, CardContent } from '@/components/ui/card';
import { Coins } from 'lucide-react';

interface CurrencyBalanceCardProps {
  balance: bigint;
}

export default function CurrencyBalanceCard({ balance }: CurrencyBalanceCardProps) {
  return (
    <Card className="bg-gradient-to-br from-accent/20 via-primary/10 to-accent/20 border-2 border-accent/30 shadow-medium">
      <CardContent className="p-6">
        <div className="flex items-center gap-6">
          <div className="h-20 w-20 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
            <img
              src="/assets/generated/currency-icon.dim_128x128.png"
              alt="QubeYards Currency"
              className="h-16 w-16"
            />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground font-medium mb-1">Your QubeYards Currency</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {balance.toString()}
              </span>
              <Coins className="h-6 w-6 text-accent" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Earn currency by listing properties and providing referrals
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
