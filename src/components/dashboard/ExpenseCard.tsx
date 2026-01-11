import { Wallet, TrendingUp } from 'lucide-react';
import { StatCard } from './StatCard';
import { Progress } from '@/components/ui/progress';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';

export function ExpenseCard() {
  const { mode } = useApp();
  const totalSpent = 45000;
  const budgetLimit = 60000;
  const percentUsed = Math.round((totalSpent / budgetLimit) * 100);
  const topCategory = 'Groceries';
  
  // Simple insight - non-judgmental
  const insight = percentUsed > 80 
    ? 'Spending is approaching your budget limit.'
    : percentUsed > 50
    ? 'Spending is slightly higher than last month.'
    : 'Spending is on track this month.';

  return (
    <StatCard
      title="Monthly Expenses"
      icon={Wallet}
      ctaLabel="View expenses"
      ctaPath="/expenses"
      delay={1}
    >
      <div>
        {/* Primary number - large and bold */}
        <div className="flex items-baseline gap-2">
          <span className="number-display-lg">₹{totalSpent.toLocaleString()}</span>
          <span className="text-sm text-muted-foreground">/ ₹{budgetLimit.toLocaleString()}</span>
        </div>
        
        {/* Progress bar */}
        <Progress 
          value={percentUsed} 
          className={cn(
            "mt-3 h-2",
            percentUsed > 80 && "[&>div]:bg-warning"
          )} 
        />
        <p className="mt-1.5 text-sm text-muted-foreground">{percentUsed}% of budget used</p>
      </div>

      {/* Top spending category */}
      <div className="flex items-center gap-2 pt-2">
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Top category: <span className="font-medium text-foreground">{topCategory}</span>
        </span>
      </div>

      {mode === 'simple' && (
        <p className="helper-text pt-2 text-muted-foreground">
          {insight}
        </p>
      )}
    </StatCard>
  );
}
