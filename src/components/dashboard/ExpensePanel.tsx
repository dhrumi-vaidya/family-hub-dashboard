import { Wallet, TrendingUp, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ExpenseCategory {
  name: string;
  spent: number;
  budget: number;
}

export interface ExpenseSummary {
  totalSpent: number;
  totalBudget: number;
  topSpender?: string;
  categories: ExpenseCategory[];
}

interface ExpensePanelProps {
  data: ExpenseSummary;
  mode: 'simple' | 'fast';
}

function pct(spent: number, budget: number) {
  if (!budget) return 0;
  return Math.min(Math.round((spent / budget) * 100), 100);
}

export function ExpensePanel({ data, mode }: ExpensePanelProps) {
  const overallPct = pct(data.totalSpent, data.totalBudget);
  const riskyCategories = data.categories.filter((c) => pct(c.spent, c.budget) >= 80);

  if (mode === 'simple') {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium text-muted-foreground">Expenses</CardTitle>
            <Wallet className="h-5 w-5 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.totalBudget === 0 ? (
            <p className="text-sm text-muted-foreground">No expenses recorded yet.</p>
          ) : (
            <>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-foreground">
                    ₹{data.totalSpent.toLocaleString()}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    / ₹{data.totalBudget.toLocaleString()}
                  </span>
                </div>
                <Progress
                  value={overallPct}
                  className={cn('mt-3 h-2.5', overallPct >= 80 && '[&>div]:bg-warning')}
                />
                <p className="mt-2 text-sm text-muted-foreground">
                  You've used {overallPct}% of your monthly budget.
                </p>
              </div>

              {riskyCategories.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Categories needing attention:</p>
                  {riskyCategories.map((cat) => (
                    <div key={cat.name} className="rounded-lg border border-warning/30 bg-warning/5 p-3">
                      <p className="text-sm font-medium text-warning-foreground">
                        You've used {pct(cat.spent, cat.budget)}% of your {cat.name} budget.
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
          <Button variant="soft" className="w-full justify-between" asChild>
            <a href="/expenses">
              View expenses
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Fast mode — full breakdown
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">Expenses</CardTitle>
          <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" asChild>
            <a href="/expenses">View all <ArrowRight className="h-3 w-3" /></a>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.totalBudget === 0 ? (
          <p className="text-sm text-muted-foreground">No expenses recorded yet.</p>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold text-foreground">
                  ₹{data.totalSpent.toLocaleString()}
                </span>
                <span className="ml-1 text-sm text-muted-foreground">
                  / ₹{data.totalBudget.toLocaleString()}
                </span>
              </div>
              <span className={cn(
                'text-sm font-semibold',
                overallPct >= 80 ? 'text-warning' : 'text-success'
              )}>
                {overallPct}%
              </span>
            </div>
            <Progress value={overallPct} className={cn('h-1.5', overallPct >= 80 && '[&>div]:bg-warning')} />

            {data.topSpender && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5" />
                Top spender: <span className="font-medium text-foreground">{data.topSpender}</span>
              </div>
            )}

            <div className="space-y-2 pt-1">
              {data.categories.map((cat) => {
                const p = pct(cat.spent, cat.budget);
                return (
                  <div key={cat.name}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-foreground">{cat.name}</span>
                      <span className={cn('font-medium', p >= 80 ? 'text-warning' : 'text-muted-foreground')}>
                        ₹{cat.spent.toLocaleString()} · {p}%
                      </span>
                    </div>
                    <Progress value={p} className={cn('h-1', p >= 80 && '[&>div]:bg-warning')} />
                  </div>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
