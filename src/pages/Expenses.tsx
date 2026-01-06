import { useState } from 'react';
import { Plus, Filter, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApp } from '@/contexts/AppContext';
import { Hint } from '@/components/onboarding/Hint';
import { ExpenseChart } from '@/components/dashboard/ExpenseChart';
import { BudgetChart } from '@/components/dashboard/BudgetChart';
import { cn } from '@/lib/utils';

const familyCategories = [
  { name: 'Groceries', amount: 18000, budget: 20000, color: 'bg-primary' },
  { name: 'Utilities', amount: 12000, budget: 15000, color: 'bg-accent' },
  { name: 'Healthcare', amount: 8000, budget: 10000, color: 'bg-destructive' },
  { name: 'Education', amount: 5000, budget: 8000, color: 'bg-warning' },
  { name: 'Transport', amount: 2000, budget: 5000, color: 'bg-success' },
];

const personalCategories = [
  { name: 'Personal', amount: 5000, budget: 8000, color: 'bg-primary' },
  { name: 'Subscriptions', amount: 1500, budget: 2000, color: 'bg-accent' },
  { name: 'Food (Outside)', amount: 3000, budget: 4000, color: 'bg-warning' },
  { name: 'Shopping', amount: 2500, budget: 5000, color: 'bg-success' },
];

const familyInsights = [
  {
    type: 'warning',
    message: 'Food expenses crossed 30% of your monthly budget.',
  },
  {
    type: 'info',
    message: 'Utility bills are 15% lower than last month.',
  },
];

const personalInsights = [
  {
    type: 'info',
    message: 'You spent 20% less on subscriptions this month.',
  },
  {
    type: 'warning',
    message: 'Outside food expenses are trending up.',
  },
];

export default function Expenses() {
  const { mode } = useApp();
  const [view, setView] = useState<'family' | 'personal'>('family');
  const [familyBudget, setFamilyBudget] = useState('60000');
  const [personalBudget, setPersonalBudget] = useState('20000');

  const categories = view === 'family' ? familyCategories : personalCategories;
  const insights = view === 'family' ? familyInsights : personalInsights;
  const budget = view === 'family' ? familyBudget : personalBudget;
  const setBudget = view === 'family' ? setFamilyBudget : setPersonalBudget;

  const totalSpent = categories.reduce((sum, cat) => sum + cat.amount, 0);
  const totalBudget = parseInt(budget) || (view === 'family' ? 60000 : 20000);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-heading-lg text-foreground">Expenses</h1>
          <p className="mt-1 text-body text-muted-foreground">
            {view === 'family'
              ? "Track and manage your family's monthly expenses."
              : 'Track your personal monthly expenses.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Tabs value={view} onValueChange={(v) => setView(v as 'family' | 'personal')}>
            <TabsList>
              <TabsTrigger value="family">Family</TabsTrigger>
              <TabsTrigger value="personal">Personal</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Expense
          </Button>
        </div>
      </div>
      
      <Hint id="expenses-intro">
        {view === 'family'
          ? "Start by setting your family's monthly budget. Track expenses by category and we'll show you insights."
          : 'Set your personal budget to track your own spending separately from family expenses.'}
      </Hint>

      {/* Charts */}
      <div className={cn(
        'grid gap-4 lg:gap-6',
        mode === 'simple' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2'
      )}>
        <ExpenseChart personal={view === 'personal'} />
        <BudgetChart personal={view === 'personal'} />
      </div>

      <div className={cn(
        'grid gap-6',
        mode === 'simple' ? 'lg:grid-cols-2' : 'lg:grid-cols-3'
      )}>
        {/* Budget Setup */}
        <Card className="animate-fade-in opacity-0" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              {view === 'family' ? 'Family Budget' : 'Personal Budget'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">
                Budget Amount (₹)
              </label>
              <Input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Spent</span>
                <span className="font-medium">₹{totalSpent.toLocaleString()} / ₹{totalBudget.toLocaleString()}</span>
              </div>
              <Progress value={(totalSpent / totalBudget) * 100} className="mt-2 h-3" />
            </div>
            {mode === 'simple' && (
              <Button variant="soft" className="w-full">
                Save Budget
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card className={cn(
          'animate-fade-in opacity-0',
          mode === 'simple' ? '' : 'lg:col-span-2'
        )} style={{ animationDelay: '0.2s' }}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Category Breakdown</CardTitle>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categories.map((cat) => {
                const percent = Math.round((cat.amount / cat.budget) * 100);
                return (
                  <div key={cat.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={cn('h-3 w-3 rounded-full', cat.color)} />
                        <span className="font-medium">{cat.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-medium">₹{cat.amount.toLocaleString()}</span>
                        <span className="text-muted-foreground"> / ₹{cat.budget.toLocaleString()}</span>
                      </div>
                    </div>
                    <Progress value={percent} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Insights */}
        <Card className={cn(
          'animate-fade-in opacity-0',
          mode === 'simple' ? 'lg:col-span-2' : ''
        )} style={{ animationDelay: '0.3s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-accent" />
              Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.map((insight, i) => (
                <div
                  key={i}
                  className={cn(
                    'rounded-lg p-3',
                    insight.type === 'warning' ? 'bg-warning-light' : 'bg-accent-light'
                  )}
                >
                  <p className="text-sm font-medium text-foreground">{insight.message}</p>
                </div>
              ))}
            </div>
            {mode === 'simple' && (
              <p className="helper-text mt-4">
                These insights are based on your spending patterns and budget limits.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
