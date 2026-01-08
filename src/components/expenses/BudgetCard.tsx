import { TrendingUp, Edit2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BudgetCardProps {
  budget: number;
  spent: number;
  isAdmin?: boolean;
  onEdit?: () => void;
  compact?: boolean;
}

export function BudgetCard({ budget, spent, isAdmin = true, onEdit, compact = false }: BudgetCardProps) {
  const percentage = Math.min(Math.round((spent / budget) * 100), 100);
  const remaining = budget - spent;
  const isOverBudget = spent > budget;

  let statusText = `${percentage}% used`;
  let statusColor = 'text-muted-foreground';
  
  if (isOverBudget) {
    statusText = 'Over budget';
    statusColor = 'text-destructive';
  } else if (percentage >= 80) {
    statusText = `${percentage}% used - Almost there`;
    statusColor = 'text-warning';
  }

  return (
    <Card className={cn(compact && 'shadow-sm')}>
      <CardHeader className={cn('pb-3', compact && 'pb-2')}>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className={cn('text-primary', compact ? 'h-4 w-4' : 'h-5 w-5')} />
            <span className={compact ? 'text-base' : 'text-lg'}>Monthly Budget</span>
          </div>
          {isAdmin && onEdit && (
            <Button variant="ghost" size="icon-sm" onClick={onEdit} className="h-8 w-8">
              <Edit2 className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className={cn('space-y-4', compact && 'space-y-3')}>
        <div className="text-center">
          <p className={cn('font-bold text-foreground', compact ? 'text-2xl' : 'text-3xl')}>
            ₹{budget.toLocaleString()}
          </p>
          <p className={cn('mt-1', statusColor, compact ? 'text-xs' : 'text-sm')}>
            {statusText}
          </p>
        </div>

        <Progress 
          value={percentage} 
          className={cn('h-3', isOverBudget && '[&>div]:bg-destructive')}
        />

        <div className="flex items-center justify-between text-sm">
          <div>
            <p className="text-muted-foreground">Spent</p>
            <p className="font-medium text-foreground">₹{spent.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground">Remaining</p>
            <p className={cn('font-medium', isOverBudget ? 'text-destructive' : 'text-success')}>
              {isOverBudget ? '-' : ''}₹{Math.abs(remaining).toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
