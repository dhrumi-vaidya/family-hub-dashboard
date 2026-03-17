import { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/ui/page-header';
import { FormModal } from '@/components/ui/form-modal';
import { useApp } from '@/contexts/AppContext';
import { getModeClasses } from '@/lib/design-tokens';
import { QuickAddExpense } from '@/components/expenses/QuickAddExpense';
import { GuidedAddExpense } from '@/components/expenses/GuidedAddExpense';
import { ExpenseTimeline } from '@/components/expenses/ExpenseTimeline';
import { BudgetCard } from '@/components/expenses/BudgetCard';
import { InsightsCard } from '@/components/expenses/InsightsCard';
import { ExpenseFilters, FilterState } from '@/components/expenses/ExpenseFilters';
import { EmptyExpenses } from '@/components/expenses/EmptyExpenses';
import { ExpenseChart } from '@/components/dashboard/ExpenseChart';
import { BudgetChart } from '@/components/dashboard/BudgetChart';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Expense {
  id: string;
  amount: number;
  category: string;
  note?: string;
  date: Date;
  type: 'family' | 'personal';
}

// No sample data - all data is user-entered
const initialExpenses: Expense[] = [];

const familyInsights: { type: 'warning' | 'success' | 'info'; message: string }[] = [];
const personalInsights: { type: 'warning' | 'success' | 'info'; message: string }[] = [];

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function Expenses() {
  const { mode } = useApp();
  const classes = getModeClasses(mode);
  const isSimpleMode = mode === 'simple';

  const [view, setView] = useState<'family' | 'personal'>('family');
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear] = useState(new Date().getFullYear());
  const [showGuidedAdd, setShowGuidedAdd] = useState(false);
  const [budgetDialogOpen, setBudgetDialogOpen] = useState(false);
  const [familyBudget, setFamilyBudget] = useState(60000);
  const [personalBudget, setPersonalBudget] = useState(20000);
  const [tempBudget, setTempBudget] = useState('20000');
  const [filters, setFilters] = useState<FilterState>({ category: 'All', member: 'All', type: 'all' });

  const currentBudget = view === 'personal' ? personalBudget : familyBudget;

  // Filter expenses based on current view, filters and month
  const filteredExpenses = expenses.filter((expense) => {
    const expenseMonth = expense.date.getMonth();
    if (expenseMonth !== selectedMonth) return false;
    if (expense.type !== view) return false;
    if (filters.category !== 'All' && expense.category !== filters.category) return false;
    return true;
  });

  const totalSpent = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const currentInsights = view === 'personal' ? personalInsights : familyInsights;

  const handleAddExpense = (expense: { amount: number; category: string; note: string; date: Date }) => {
    const newExpense: Expense = {
      id: Date.now().toString(),
      ...expense,
      type: view,
    };
    setExpenses([newExpense, ...expenses]);
  };

  const handleDeleteExpense = (id: string) => {
    if (isSimpleMode) {
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
    if (view === 'personal') {
      setPersonalBudget(parsedBudget);
    } else {
      setFamilyBudget(parsedBudget);
    }
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
      {/* Page Header - Consistent across all pages */}
      <PageHeader
        title="Expenses"
        subtitle="Understand spending, without effort."
        action={
          <div className="flex items-center gap-3">
            {/* Month Selector */}
            <div className="flex items-center gap-1 rounded-lg border border-border bg-card px-2 py-1">
              <Button 
                variant="ghost" 
                size="icon-sm" 
                onClick={goToPreviousMonth}
                aria-label="Previous month"
              >
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
                aria-label="Next month"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Add Expense Button (Fast Mode only) */}
            {!isSimpleMode && (
              <Button 
                className="gap-2" 
                onClick={() => setShowGuidedAdd(true)}
                size={classes.buttonPrimary as any}
              >
                <Plus className="h-4 w-4" />
                Add Expense
              </Button>
            )}
          </div>
        }
      />

      {/* Charts with Family/Personal Tabs in top-right */}
      <div className="space-y-4">
        <div className="flex items-center justify-end">
          <Tabs value={view} onValueChange={(v) => setView(v as 'family' | 'personal')}>
            <TabsList>
              <TabsTrigger value="family">Family</TabsTrigger>
              <TabsTrigger value="personal">Personal</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Side by side charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <ExpenseChart personal={view === 'personal'} />
          <BudgetChart personal={view === 'personal'} />
        </div>
      </div>

      {/* Add Expense Section */}
      <div className="space-y-6">
        {isSimpleMode ? (
          showGuidedAdd ? (
            <GuidedAddExpense onAdd={handleAddExpense} onCancel={() => setShowGuidedAdd(false)} />
          ) : (
            <Button variant="soft" size="lg" className="w-full gap-2 text-base" onClick={() => setShowGuidedAdd(true)}>
              <Plus className="h-5 w-5" />
              Add {view === 'personal' ? 'Personal' : 'Family'} Expense
            </Button>
          )
        ) : (
          !showGuidedAdd && <QuickAddExpense onAdd={handleAddExpense} />
        )}
      </div>

      {/* Filters */}
      <ExpenseFilters onFilterChange={setFilters} compact={!isSimpleMode} hideTypeFilter />

      {/* Main Content Grid - Consistent spacing */}
      <div className={cn('grid', classes.gridGap, isSimpleMode ? 'lg:grid-cols-1' : 'lg:grid-cols-3')}>
        <div className={cn(isSimpleMode ? '' : 'lg:col-span-2')}>
          {filteredExpenses.length === 0 ? (
            <EmptyExpenses onAddExpense={() => setShowGuidedAdd(true)} />
          ) : (
            <ExpenseTimeline expenses={filteredExpenses} onEdit={handleEditExpense} onDelete={handleDeleteExpense} compact={!isSimpleMode} />
          )}
        </div>
        <div className={cn('space-y-6', isSimpleMode && 'grid gap-6 sm:grid-cols-2 lg:grid-cols-1 space-y-0')}>
          <BudgetCard
            budget={currentBudget}
            spent={totalSpent}
            onEdit={() => {
              setTempBudget(currentBudget.toString());
              setBudgetDialogOpen(true);
            }}
            compact={!isSimpleMode}
          />
          <InsightsCard insights={currentInsights} showHelper={isSimpleMode} compact={!isSimpleMode} />
        </div>
      </div>

      {/* Budget Edit Dialog - Using new FormModal */}
      <FormModal
        open={budgetDialogOpen}
        onOpenChange={setBudgetDialogOpen}
        title={`Edit ${view === 'personal' ? 'Personal' : 'Family'} Budget`}
        onSubmit={handleSaveBudget}
        submitLabel="Save Budget"
      >
        <div className="space-y-2">
          <Label htmlFor="budget">Budget Amount (₹) *</Label>
          <Input
            id="budget"
            type="number"
            value={tempBudget}
            onChange={(e) => setTempBudget(e.target.value)}
            placeholder="Enter budget amount"
            required
          />
        </div>
      </FormModal>
    </div>
  );
}
