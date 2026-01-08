import { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '@/contexts/AppContext';
import { QuickAddExpense } from '@/components/expenses/QuickAddExpense';
import { GuidedAddExpense } from '@/components/expenses/GuidedAddExpense';
import { ExpenseTimeline } from '@/components/expenses/ExpenseTimeline';
import { BudgetCard } from '@/components/expenses/BudgetCard';
import { InsightsCard } from '@/components/expenses/InsightsCard';
import { ExpenseFilters, FilterState } from '@/components/expenses/ExpenseFilters';
import { EmptyExpenses } from '@/components/expenses/EmptyExpenses';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';

interface Expense {
  id: string;
  amount: number;
  category: string;
  note?: string;
  date: Date;
  type: 'family' | 'personal';
}

// Sample data
const initialExpenses: Expense[] = [
  { id: '1', amount: 2500, category: 'Food', note: 'Weekly groceries', date: new Date(), type: 'family' },
  { id: '2', amount: 150, category: 'Food', note: 'Lunch at office', date: new Date(), type: 'personal' },
  { id: '3', amount: 800, category: 'Travel', note: 'Cab to airport', date: subDays(new Date(), 1), type: 'family' },
  { id: '4', amount: 3500, category: 'Utilities', note: 'Electricity bill', date: subDays(new Date(), 2), type: 'family' },
  { id: '5', amount: 500, category: 'Medical', note: 'Medicines', date: subDays(new Date(), 3), type: 'personal' },
];

const familyInsights = [
  { type: 'warning' as const, message: 'Food expenses crossed 30% of your budget.' },
  { type: 'success' as const, message: 'Utility bills are 15% lower than last month.' },
  { type: 'info' as const, message: 'Travel expenses increased this week.' },
];

const personalInsights = [
  { type: 'success' as const, message: 'You spent 20% less on subscriptions this month.' },
  { type: 'warning' as const, message: 'Daily spending is higher than last month.' },
];

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function Expenses() {
  const { mode } = useApp();
  const isSimpleMode = mode === 'simple';

  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear] = useState(new Date().getFullYear());
  const [showGuidedAdd, setShowGuidedAdd] = useState(false);
  const [budgetDialogOpen, setBudgetDialogOpen] = useState(false);
  const [budget, setBudget] = useState(20000);
  const [tempBudget, setTempBudget] = useState('20000');
  const [filters, setFilters] = useState<FilterState>({ category: 'All', member: 'All', type: 'all' });

  // Filter expenses based on current filters and month
  const filteredExpenses = expenses.filter((expense) => {
    const expenseMonth = expense.date.getMonth();
    if (expenseMonth !== selectedMonth) return false;
    if (filters.category !== 'All' && expense.category !== filters.category) return false;
    if (filters.type !== 'all' && expense.type !== filters.type) return false;
    return true;
  });

  const totalSpent = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const currentInsights = filters.type === 'personal' ? personalInsights : familyInsights;

  const handleAddExpense = (expense: { amount: number; category: string; note: string; date: Date }) => {
    const newExpense: Expense = {
      id: Date.now().toString(),
      ...expense,
      type: filters.type === 'personal' ? 'personal' : 'family',
    };
    setExpenses([newExpense, ...expenses]);
  };

  const handleDeleteExpense = (id: string) => {
    if (isSimpleMode) {
      // In simple mode, show confirmation
      if (window.confirm('Are you sure you want to delete this expense?')) {
        setExpenses(expenses.filter((e) => e.id !== id));
        toast.success('Expense deleted');
      }
    } else {
      setExpenses(expenses.filter((e) => e.id !== id));
      toast.success('Expense deleted');
    }
  };

  const handleEditExpense = (id: string) => {
    toast.info('Edit functionality coming soon');
  };

  const handleSaveBudget = () => {
    const parsedBudget = parseInt(tempBudget);
    if (isNaN(parsedBudget) || parsedBudget <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    setBudget(parsedBudget);
    setBudgetDialogOpen(false);
    toast.success('Budget updated successfully');
  };

  const goToPreviousMonth = () => {
    setSelectedMonth((prev) => (prev === 0 ? 11 : prev - 1));
  };

  const goToNextMonth = () => {
    setSelectedMonth((prev) => (prev === 11 ? 0 : prev + 1));
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-heading-lg text-foreground">Expenses</h1>
          <p className="mt-1 text-body text-muted-foreground">
            Understand spending, without effort.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Month Selector */}
          <div className="flex items-center gap-1 rounded-lg border border-border bg-card px-2 py-1">
            <Button variant="ghost" size="icon-sm" onClick={goToPreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="min-w-[100px] text-center text-sm font-medium">
              {months[selectedMonth]} {selectedYear}
            </span>
            <Button 
              variant="ghost" 
              size="icon-sm" 
              onClick={goToNextMonth}
              disabled={selectedMonth === new Date().getMonth()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Add Expense Button (Fast Mode only) */}
          {!isSimpleMode && (
            <Button className="gap-2" onClick={() => setShowGuidedAdd(true)}>
              <Plus className="h-4 w-4" />
              Add Expense
            </Button>
          )}
        </div>
      </div>

      {/* Quick Add (Fast Mode) or Guided Add (Simple Mode when triggered) */}
      {isSimpleMode ? (
        showGuidedAdd ? (
          <GuidedAddExpense
            onAdd={handleAddExpense}
            onCancel={() => setShowGuidedAdd(false)}
          />
        ) : (
          <Button
            variant="soft"
            size="lg"
            className="w-full gap-2 text-base"
            onClick={() => setShowGuidedAdd(true)}
          >
            <Plus className="h-5 w-5" />
            Add Expense
          </Button>
        )
      ) : (
        !showGuidedAdd && <QuickAddExpense onAdd={handleAddExpense} />
      )}

      {/* Filters */}
      <ExpenseFilters
        onFilterChange={setFilters}
        compact={!isSimpleMode}
      />

      {/* Main Content Grid */}
      <div className={cn(
        'grid gap-6',
        isSimpleMode ? 'lg:grid-cols-1' : 'lg:grid-cols-3'
      )}>
        {/* Expense Timeline */}
        <div className={cn(isSimpleMode ? '' : 'lg:col-span-2')}>
          {filteredExpenses.length === 0 ? (
            <EmptyExpenses onAddExpense={() => setShowGuidedAdd(true)} />
          ) : (
            <ExpenseTimeline
              expenses={filteredExpenses}
              onEdit={handleEditExpense}
              onDelete={handleDeleteExpense}
              compact={!isSimpleMode}
            />
          )}
        </div>

        {/* Sidebar */}
        <div className={cn('space-y-6', isSimpleMode && 'grid gap-6 sm:grid-cols-2 lg:grid-cols-1 space-y-0')}>
          <BudgetCard
            budget={budget}
            spent={totalSpent}
            onEdit={() => {
              setTempBudget(budget.toString());
              setBudgetDialogOpen(true);
            }}
            compact={!isSimpleMode}
          />
          <InsightsCard
            insights={currentInsights}
            showHelper={isSimpleMode}
            compact={!isSimpleMode}
          />
        </div>
      </div>

      {/* Budget Edit Dialog */}
      <Dialog open={budgetDialogOpen} onOpenChange={setBudgetDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Edit Monthly Budget</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Budget Amount (₹)</Label>
              <Input
                id="budget"
                type="number"
                value={tempBudget}
                onChange={(e) => setTempBudget(e.target.value)}
                placeholder="Enter budget amount"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setBudgetDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveBudget}>
                Save Budget
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
