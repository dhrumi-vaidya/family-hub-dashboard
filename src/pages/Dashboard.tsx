import { useApp } from '@/contexts/AppContext';
import { ExpenseCard } from '@/components/dashboard/ExpenseCard';
import { HealthCard } from '@/components/dashboard/HealthCard';
import { ResponsibilitiesCard } from '@/components/dashboard/ResponsibilitiesCard';
import { MembersCard } from '@/components/dashboard/MembersCard';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const { mode, currentFamily } = useApp();

  return (
    <div className="mx-auto max-w-7xl">
      {/* Page Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-heading-lg text-foreground">
          Welcome back
        </h1>
        <p className="mt-1 text-body text-muted-foreground">
          Here's what's happening with {currentFamily.name} today.
        </p>
      </div>

      {/* Stats Grid */}
      <div
        className={cn(
          'grid gap-4 lg:gap-6',
          mode === 'simple'
            ? 'grid-cols-1 md:grid-cols-2'
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        )}
      >
        <ExpenseCard />
        <HealthCard />
        <ResponsibilitiesCard />
        <MembersCard />
      </div>
    </div>
  );
}
