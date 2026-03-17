import { CheckSquare, Clock, AlertCircle } from 'lucide-react';
import { StatCard } from './StatCard';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';

export function ResponsibilitiesCard() {
  const { mode } = useApp();
  
  const stats = {
    pending: 0,
    overdue: 0,
  };

  return (
    <StatCard
      title="Responsibilities"
      icon={CheckSquare}
      iconColor="text-accent-foreground"
      ctaLabel="View responsibilities"
      ctaPath="/responsibilities"
      delay={3}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Pending confirmations */}
        <div className="rounded-lg bg-warning-light p-3">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-warning" />
            <span className="text-xs font-medium text-warning-foreground">Pending</span>
          </div>
          <p className="number-display">{stats.pending}</p>
        </div>
        
        {/* Overdue tasks */}
        <div className={cn(
          'rounded-lg p-3',
          stats.overdue > 0 ? 'bg-destructive-light' : 'bg-success-light'
        )}>
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className={cn(
              'h-4 w-4',
              stats.overdue > 0 ? 'text-destructive' : 'text-success'
            )} />
            <span className={cn(
              'text-xs font-medium',
              stats.overdue > 0 ? 'text-destructive' : 'text-success'
            )}>
              Overdue
            </span>
          </div>
          <p className="number-display">{stats.overdue}</p>
        </div>
      </div>

      {mode === 'simple' && (
        <p className="helper-text pt-2">
          {stats.pending} tasks awaiting confirmation.
        </p>
      )}
    </StatCard>
  );
}
