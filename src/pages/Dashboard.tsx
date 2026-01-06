import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { ExpenseCard } from '@/components/dashboard/ExpenseCard';
import { HealthCard } from '@/components/dashboard/HealthCard';
import { ResponsibilitiesCard } from '@/components/dashboard/ResponsibilitiesCard';
import { MembersCard } from '@/components/dashboard/MembersCard';
import { ExpenseChart } from '@/components/dashboard/ExpenseChart';
import { BudgetChart } from '@/components/dashboard/BudgetChart';
import { PersonalTasksCard } from '@/components/dashboard/PersonalTasksCard';
import { PersonalHealthCard } from '@/components/dashboard/PersonalHealthCard';
import { Hint } from '@/components/onboarding/Hint';
import { SimpleModeBanner } from '@/components/onboarding/SimpleModeBanner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const { mode, currentFamily } = useApp();
  const [view, setView] = useState<'family' | 'personal'>('family');

  return (
    <div className="mx-auto max-w-7xl">
      <SimpleModeBanner />
      
      {/* Page Header */}
      <div className="mb-6 lg:mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-heading-lg text-foreground">
              Welcome back
            </h1>
            <p className="mt-1 text-body text-muted-foreground">
              {view === 'family'
                ? `Here's what's happening with ${currentFamily.name} today.`
                : "Here's your personal overview."}
            </p>
          </div>
          
          <Tabs value={view} onValueChange={(v) => setView(v as 'family' | 'personal')}>
            <TabsList>
              <TabsTrigger value="family">Family</TabsTrigger>
              <TabsTrigger value="personal">Personal</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <Hint id="dashboard-intro" className="mt-4">
          {view === 'family'
            ? 'This is your family dashboard. Click on any card to see more details. Switch to Personal view to see your own stats.'
            : 'This is your personal dashboard. See your budget, tasks, and health at a glance.'}
        </Hint>
      </div>

      {/* Family View */}
      {view === 'family' && (
        <div className="space-y-6">
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
          
          {/* Charts */}
          <div className={cn(
            'grid gap-4 lg:gap-6',
            mode === 'simple' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2'
          )}>
            <ExpenseChart />
            <BudgetChart />
          </div>
        </div>
      )}

      {/* Personal View */}
      {view === 'personal' && (
        <div className="space-y-6">
          {/* Personal Charts */}
          <div className={cn(
            'grid gap-4 lg:gap-6',
            mode === 'simple' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2'
          )}>
            <ExpenseChart personal />
            <BudgetChart personal />
          </div>
          
          {/* Personal Cards */}
          <div className={cn(
            'grid gap-4 lg:gap-6',
            mode === 'simple' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2'
          )}>
            <PersonalTasksCard />
            <PersonalHealthCard />
          </div>
        </div>
      )}
    </div>
  );
}
