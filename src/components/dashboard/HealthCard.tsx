import { Heart, FileImage, Calendar } from 'lucide-react';
import { StatCard } from './StatCard';
import { useApp } from '@/contexts/AppContext';

export function HealthCard() {
  const { mode } = useApp();
  
  // Sample data - in real app this would come from context/API
  const lastRecord = {
    member: 'Anita Sharma',
    type: 'Blood Report',
    date: '28 Dec 2025',
  };
  
  const hasRecords = true; // Toggle for empty state

  return (
    <StatCard
      title="Health Records"
      icon={Heart}
      iconColor="text-destructive"
      ctaLabel="View health records"
      ctaPath="/health"
      delay={2}
    >
      {hasRecords ? (
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive-light flex-shrink-0">
            <FileImage className="h-6 w-6 text-destructive" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-foreground truncate">{lastRecord.type}</p>
            <p className="text-sm text-muted-foreground truncate">{lastRecord.member}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{lastRecord.date}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-2">
          <p className="text-muted-foreground text-sm">
            No health records uploaded yet.
          </p>
        </div>
      )}

      {mode === 'simple' && hasRecords && (
        <p className="helper-text pt-2">
          Last health record uploaded for the family. Keep records up to date for emergencies.
        </p>
      )}
    </StatCard>
  );
}
