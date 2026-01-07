import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface DailyExpense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: Date;
}

const initialExpenses: DailyExpense[] = [
  { id: '1', description: 'Coffee', amount: 150, category: 'Food', date: new Date() },
  { id: '2', description: 'Bus fare', amount: 50, category: 'Transport', date: new Date() },
  { id: '3', description: 'Lunch', amount: 250, category: 'Food', date: new Date() },
];

const categories = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Other'];

export function DailyExpenseTracker() {
  const [expenses, setExpenses] = useState<DailyExpense[]>(initialExpenses);
  const [newDescription, setNewDescription] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState('Food');

  const todayTotal = expenses
    .filter((e) => format(e.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd'))
    .reduce((sum, e) => sum + e.amount, 0);

  const handleAdd = () => {
    if (!newDescription || !newAmount) return;
    const newExpense: DailyExpense = {
      id: Date.now().toString(),
      description: newDescription,
      amount: parseFloat(newAmount),
      category: newCategory,
      date: new Date(),
    };
    setExpenses([newExpense, ...expenses]);
    setNewDescription('');
    setNewAmount('');
  };

  const handleDelete = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  return (
    <Card className="animate-fade-in opacity-0" style={{ animationDelay: '0.25s' }}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Today's Expenses
          </div>
          <span className="text-lg font-bold text-primary">₹{todayTotal.toLocaleString()}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Add Form */}
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            placeholder="Description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            className="flex-1"
          />
          <Input
            type="number"
            placeholder="₹ Amount"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            className="w-full sm:w-24"
          />
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <Button onClick={handleAdd} size="icon" className="shrink-0">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Expense List */}
        <div className="max-h-48 space-y-2 overflow-y-auto">
          {expenses.slice(0, 5).map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2"
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium">{expense.description}</span>
                <span className="text-xs text-muted-foreground">{expense.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">₹{expense.amount}</span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleDelete(expense.id)}
                  className="h-6 w-6 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {expenses.length > 5 && (
          <p className="text-center text-xs text-muted-foreground">
            +{expenses.length - 5} more expenses
          </p>
        )}
      </CardContent>
    </Card>
  );
}
