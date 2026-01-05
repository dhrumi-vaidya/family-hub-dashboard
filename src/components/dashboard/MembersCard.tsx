import { Users, Shield } from 'lucide-react';
import { StatCard } from './StatCard';
import { useApp } from '@/contexts/AppContext';

export function MembersCard() {
  const { mode, currentFamily } = useApp();
  
  const adminCount = 2;

  return (
    <StatCard
      title="Family Members"
      icon={Users}
      iconColor="text-secondary-foreground"
      ctaLabel="Manage Members"
      ctaPath="/members"
      delay={4}
    >
      <div className="flex items-center gap-6">
        <div>
          <p className="number-display-lg">{currentFamily.memberCount}</p>
          <p className="text-sm text-muted-foreground">Total Members</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-accent-light px-3 py-2">
          <Shield className="h-4 w-4 text-accent" />
          <div>
            <p className="text-lg font-semibold text-foreground">{adminCount}</p>
            <p className="text-xs text-muted-foreground">Admins</p>
          </div>
        </div>
      </div>

      {mode === 'simple' && (
        <p className="helper-text pt-2">
          Add or remove family members and manage their access permissions.
        </p>
      )}
    </StatCard>
  );
}
