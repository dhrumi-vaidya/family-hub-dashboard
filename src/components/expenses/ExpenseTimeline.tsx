import { format, isToday, isYesterday } from 'date-fns';
import { ExpenseCard } from './ExpenseCard';
import { cn } from '@/lib/utils';

interface Expense {
  id: string;
  amount: number;
  category: string;
  note?: string;
  date: Date;
  type: 'family' | 'personal';
}

interface ExpenseTimelineProps {
  expenses: Expense[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  compact?: boolean;
}

function formatDateHeader(date: Date): string {
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'EEEE, d MMMM');
}

function groupExpensesByDate(expenses: Expense[]): Map<string, Expense[]> {
  const groups = new Map<string, Expense[]>();
  
  expenses.forEach((expense) => {
    const dateKey = format(expense.date, 'yyyy-MM-dd');
    if (!groups.has(dateKey)) {
      groups.set(dateKey, []);
    }
    groups.get(dateKey)!.push(expense);
  });

  return groups;
}

export function ExpenseTimeline({ expenses, onEdit, onDelete, compact = false }: ExpenseTimelineProps) {
  const groupedExpenses = groupExpensesByDate(expenses);
  const sortedDates = Array.from(groupedExpenses.keys()).sort((a, b) => b.localeCompare(a));

  if (expenses.length === 0) {
    return null;
  }

  return (
    <div className={cn('space-y-6', compact && 'space-y-4')}>
      {sortedDates.map((dateKey) => {
        const dateExpenses = groupedExpenses.get(dateKey)!;
        const date = new Date(dateKey);
        const dayTotal = dateExpenses.reduce((sum, e) => sum + e.amount, 0);

        return (
          <div key={dateKey}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className={cn('font-medium text-foreground', compact ? 'text-sm' : 'text-base')}>
                {formatDateHeader(date)}
              </h3>
              <span className={cn('font-medium text-muted-foreground', compact ? 'text-sm' : 'text-base')}>
                ₹{dayTotal.toLocaleString()}
              </span>
            </div>
            <div className={cn('space-y-2', compact && 'space-y-1.5')}>
              {dateExpenses.map((expense) => (
                <ExpenseCard
                  key={expense.id}
                  {...expense}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  compact={compact}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
