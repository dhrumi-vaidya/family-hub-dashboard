import { useState } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const categories = [
  { value: 'Food', label: 'Food', icon: '🍽️' },
  { value: 'Travel', label: 'Travel', icon: '🚗' },
  { value: 'Medical', label: 'Medical', icon: '💊' },
  { value: 'Utilities', label: 'Utilities', icon: '💡' },
  { value: 'Other', label: 'Other', icon: '📦' },
];

interface GuidedAddExpenseProps {
  onAdd: (expense: { amount: number; category: string; note: string; date: Date }) => void;
  onCancel: () => void;
}

export function GuidedAddExpense({ onAdd, onCancel }: GuidedAddExpenseProps) {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  const handleNext = () => {
    if (step === 1 && !category) {
      toast.error('Please select a category');
      return;
    }
    if (step === 2 && (!amount || parseFloat(amount) <= 0)) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onCancel();
    }
  };

  const handleSubmit = () => {
    onAdd({
      amount: parseFloat(amount),
      category,
      note,
      date: new Date(),
    });
    setIsComplete(true);
    setTimeout(() => {
      setIsComplete(false);
      setStep(1);
      setCategory('');
      setAmount('');
      setNote('');
      onCancel();
    }, 1500);
  };

  if (isComplete) {
    return (
      <Card className="border-success/30 bg-success/5">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
            <Check className="h-8 w-8 text-success" />
          </div>
          <p className="text-lg font-medium text-foreground">Expense added successfully.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Add Expense</CardTitle>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={cn(
                  'h-2 w-8 rounded-full transition-colors',
                  s <= step ? 'bg-primary' : 'bg-muted'
                )}
              />
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-foreground">Where was the money spent?</h3>
              <p className="text-sm text-muted-foreground">Choose the closest category.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all hover:border-primary/50',
                    category === cat.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-card'
                  )}
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="text-sm font-medium">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-foreground">How much was spent?</h3>
              <p className="text-sm text-muted-foreground">Enter the total amount.</p>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-medium text-muted-foreground">₹</span>
              <Input
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8 text-2xl font-medium h-14"
                autoFocus
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-foreground">Any details?</h3>
              <p className="text-sm text-muted-foreground">Optional. You can skip this.</p>
            </div>
            <Input
              placeholder="Add a note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="text-lg h-12"
              autoFocus
            />
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">Summary</p>
              <p className="mt-1 text-lg font-medium">
                {category} • ₹{parseFloat(amount || '0').toLocaleString()}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <Button variant="outline" onClick={handleBack}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            {step === 1 ? 'Cancel' : 'Back'}
          </Button>
          <Button onClick={handleNext}>
            {step === 3 ? 'Add Expense' : 'Next'}
            {step < 3 && <ChevronRight className="ml-1 h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
