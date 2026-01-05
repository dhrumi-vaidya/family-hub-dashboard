import { Heart, FileImage } from 'lucide-react';
import { StatCard } from './StatCard';
import { useApp } from '@/contexts/AppContext';

export function HealthCard() {
  const { mode } = useApp();
  
  const lastRecord = {
    member: 'Anita Sharma',
    type: 'Blood Report',
    date: '28 Dec 2025',
  };

  return (
    <StatCard
      title="Health Activity"
      icon={Heart}
      iconColor="text-destructive"
      ctaLabel="View Timeline"
      ctaPath="/health"
      delay={2}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive-light">
          <FileImage className="h-6 w-6 text-destructive" />
        </div>
        <div>
          <p className="font-medium text-foreground">{lastRecord.type}</p>
          <p className="text-sm text-muted-foreground">{lastRecord.member}</p>
          <p className="text-sm text-muted-foreground">{lastRecord.date}</p>
        </div>
      </div>

      {mode === 'simple' && (
        <p className="helper-text pt-2">
          Last health record uploaded for the family. Keep records up to date for emergencies.
        </p>
      )}
    </StatCard>
  );
}
