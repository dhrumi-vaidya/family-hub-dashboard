import { CheckSquare, Clock, AlertTriangle } from 'lucide-react';
import { StatCard } from './StatCard';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';

export function ResponsibilitiesCard() {
  const { mode } = useApp();
  
  const stats = {
    pending: 4,
    escalated: 1,
    completed: 12,
  };

  return (
    <StatCard
      title="Responsibilities Status"
      icon={CheckSquare}
      iconColor="text-accent"
      ctaLabel="View Tasks"
      ctaPath="/responsibilities"
      delay={3}
    >
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-warning-light p-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-warning" />
            <span className="text-sm font-medium text-warning-foreground">Pending</span>
          </div>
          <p className="mt-1 number-display">{stats.pending}</p>
        </div>
        <div className={cn(
          'rounded-lg p-3',
          stats.escalated > 0 ? 'bg-destructive-light' : 'bg-success-light'
        )}>
          <div className="flex items-center gap-2">
            <AlertTriangle className={cn(
              'h-4 w-4',
              stats.escalated > 0 ? 'text-destructive' : 'text-success'
            )} />
            <span className={cn(
              'text-sm font-medium',
              stats.escalated > 0 ? 'text-destructive' : 'text-success'
            )}>
              Escalated
            </span>
          </div>
          <p className="mt-1 number-display">{stats.escalated}</p>
        </div>
      </div>

      {mode === 'simple' && (
        <p className="helper-text pt-2">
          {stats.pending} tasks awaiting confirmation from family members.
        </p>
      )}
    </StatCard>
  );
}
