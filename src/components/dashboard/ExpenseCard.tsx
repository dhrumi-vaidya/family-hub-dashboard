import { Wallet } from 'lucide-react';
import { StatCard } from './StatCard';
import { Progress } from '@/components/ui/progress';
import { useApp } from '@/contexts/AppContext';

export function ExpenseCard() {
  const { mode } = useApp();
  const totalSpent = 0;
  const budgetLimit = 0;
  const hasData = totalSpent > 0 || budgetLimit > 0;

  return (
    <StatCard
      title="Monthly Expenses"
      icon={Wallet}
      ctaLabel="View expenses"
      ctaPath="/expenses"
      delay={1}
    >
      {hasData ? (
        <div>
          <div className="flex items-baseline gap-2">
            <span className="number-display-lg">₹{totalSpent.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground">/ ₹{budgetLimit.toLocaleString()}</span>
          </div>
          <Progress value={Math.round((totalSpent / budgetLimit) * 100)} className="mt-3 h-2" />
          <p className="mt-1.5 text-sm text-muted-foreground">{Math.round((totalSpent / budgetLimit) * 100)}% of budget used</p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No expenses recorded yet.</p>
      )}
    </StatCard>
  );
}
