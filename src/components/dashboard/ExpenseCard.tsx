import { Wallet } from 'lucide-react';
import { StatCard } from './StatCard';
import { Progress } from '@/components/ui/progress';
import { useApp } from '@/contexts/AppContext';

export function ExpenseCard() {
  const { mode } = useApp();
  const totalSpent = 45000;
  const budgetLimit = 60000;
  const percentUsed = Math.round((totalSpent / budgetLimit) * 100);
  
  const topCategories = [
    { name: 'Groceries', amount: 18000 },
    { name: 'Utilities', amount: 12000 },
  ];

  return (
    <StatCard
      title="Monthly Expenses"
      icon={Wallet}
      ctaLabel="View Expenses"
      ctaPath="/expenses"
      delay={1}
    >
      <div>
        <div className="flex items-baseline gap-2">
          <span className="number-display-lg">₹{totalSpent.toLocaleString()}</span>
          <span className="text-muted-foreground">/ ₹{budgetLimit.toLocaleString()}</span>
        </div>
        <Progress value={percentUsed} className="mt-2 h-2" />
        <p className="mt-1 text-sm text-muted-foreground">{percentUsed}% of budget used</p>
      </div>

      {mode === 'simple' && (
        <div className="space-y-2 pt-2">
          <p className="text-sm font-medium text-foreground">Top Categories</p>
          {topCategories.map((cat) => (
            <div key={cat.name} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{cat.name}</span>
              <span className="font-medium">₹{cat.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </StatCard>
  );
}
