import { Trash2, Edit2, Utensils, Car, Stethoscope, Lightbulb, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ExpenseCardProps {
  id: string;
  amount: number;
  category: string;
  note?: string;
  date: Date;
  type: 'family' | 'personal';
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  compact?: boolean;
}

const categoryIcons: Record<string, React.ElementType> = {
  Food: Utensils,
  Travel: Car,
  Medical: Stethoscope,
  Utilities: Lightbulb,
  Other: Package,
};

const categoryColors: Record<string, string> = {
  Food: 'bg-warning/10 text-warning',
  Travel: 'bg-accent/10 text-accent',
  Medical: 'bg-destructive/10 text-destructive',
  Utilities: 'bg-primary/10 text-primary',
  Other: 'bg-muted text-muted-foreground',
};

export function ExpenseCard({
  id,
  amount,
  category,
  note,
  date,
  type,
  onEdit,
  onDelete,
  compact = false,
}: ExpenseCardProps) {
  const Icon = categoryIcons[category] || Package;
  const colorClass = categoryColors[category] || categoryColors.Other;

  const formattedDate = new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
  }).format(date);

  return (
    <div
      className={cn(
        'group flex items-center gap-4 rounded-xl border border-border bg-card transition-all hover:shadow-sm',
        compact ? 'p-3' : 'p-4'
      )}
    >
      <div className={cn('flex items-center justify-center rounded-lg', colorClass, compact ? 'h-10 w-10' : 'h-12 w-12')}>
        <Icon className={compact ? 'h-5 w-5' : 'h-6 w-6'} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn('font-medium text-foreground', compact ? 'text-sm' : 'text-base')}>
            {category}
          </span>
          <Badge variant="outline" className="text-xs">
            {type === 'family' ? 'Family' : 'Personal'}
          </Badge>
        </div>
        {note && (
          <p className="mt-0.5 truncate text-sm text-muted-foreground">{note}</p>
        )}
        <p className="mt-1 text-xs text-muted-foreground">{formattedDate}</p>
      </div>

      <div className="flex items-center gap-3">
        <span className={cn('font-semibold text-foreground', compact ? 'text-base' : 'text-lg')}>
          ₹{amount.toLocaleString()}
        </span>
        
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          {onEdit && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onEdit(id)}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onDelete(id)}
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
