import { Receipt, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyExpensesProps {
  onAddExpense: () => void;
}

export function EmptyExpenses({ onAddExpense }: EmptyExpensesProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/20 py-16 px-8 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Receipt className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium text-foreground">No expenses added yet.</h3>
      <p className="mt-1 max-w-sm text-muted-foreground">
        Add when you spend something important.
      </p>
      <Button onClick={onAddExpense} className="mt-6 gap-2">
        <Plus className="h-4 w-4" />
        Add Expense
      </Button>
    </div>
  );
}
