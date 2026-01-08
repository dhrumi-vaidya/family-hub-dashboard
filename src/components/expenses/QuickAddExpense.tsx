import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const categories = ['Food', 'Travel', 'Medical', 'Utilities', 'Other'];

interface QuickAddExpenseProps {
  onAdd: (expense: { amount: number; category: string; note: string; date: Date }) => void;
}

export function QuickAddExpense({ onAdd }: QuickAddExpenseProps) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');

  const handleAdd = () => {
    if (!amount || !category) {
      toast.error('Please enter amount and select a category');
      return;
    }
    
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    onAdd({
      amount: parsedAmount,
      category,
      note,
      date: new Date(),
    });

    toast.success('Expense added successfully');
    setAmount('');
    setCategory('');
    setNote('');
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <Input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="text-lg"
          />
        </div>
        <div className="w-full sm:w-40">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Input
            placeholder="Add note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <Button onClick={handleAdd} className="gap-2 whitespace-nowrap">
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>
    </div>
  );
}
