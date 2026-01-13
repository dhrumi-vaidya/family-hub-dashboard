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
import { PageHeader } from '@/components/ui/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { getModeClasses } from '@/lib/design-tokens';
import { cn } from '@/lib/utils';
import { Wallet, Heart, FileText, Plus, Home } from 'lucide-react';

export default function Dashboard() {
  const { mode, currentFamily } = useApp();
  const classes = getModeClasses(mode);
  const [view, setView] = useState<'family' | 'personal'>('family');

  // Check if there's any data (for empty state)
  const hasData = true; // In real app, this would check actual data

  return (
    <div className="mx-auto max-w-7xl">
      <SimpleModeBanner />
      
      {/* Page Header - Consistent across all pages */}
      <PageHeader
        title={view === 'family' ? '👨‍👩‍👧‍👦 Family Overview' : '👤 Personal Overview'}
        subtitle={view === 'family'
          ? 'Everything important, at one place.'
          : 'Your personal tasks and budget, at a glance.'}
        action={
          <Tabs value={view} onValueChange={(v) => setView(v as 'family' | 'personal')}>
            <TabsList className={cn(
              mode === 'simple' ? "h-12" : "h-10"
            )}>
              <TabsTrigger 
                value="family"
                className={cn(
                  mode === 'simple' ? "px-6 py-2 text-base" : "px-4 py-1.5 text-sm"
                )}
              >
                Family
              </TabsTrigger>
              <TabsTrigger 
                value="personal"
                className={cn(
                  mode === 'simple' ? "px-6 py-2 text-base" : "px-4 py-1.5 text-sm"
                )}
              >
                Personal
              </TabsTrigger>
            </TabsList>
          </Tabs>
        }
        className="mb-6 lg:mb-8"
      />
      
      {mode === 'simple' && (
        <Hint id="dashboard-intro" className="mb-6">
          {view === 'family'
            ? 'This is your family dashboard. Click on any card to see more details. Switch to Personal view to see your own stats.'
            : 'This is your personal dashboard. See your budget, tasks, and health at a glance.'}
        </Hint>
      )}

      {/* Family View */}
      {view === 'family' && (
        <div className="space-y-6">
          {/* Empty State - Using new EmptyState component */}
          {!hasData ? (
            <EmptyState
              icon={Home}
              title="Welcome to KutumbOS"
              description="Start by adding expenses, health records, or responsibilities to see your family dashboard."
              action={
                <>
                  <Button size={classes.buttonPrimary as any} asChild>
                    <a href="/expenses">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Expense
                    </a>
                  </Button>
                  <Button variant="outline" size={classes.buttonSecondary as any} asChild>
                    <a href="/health">
                      <Plus className="mr-2 h-4 w-4" />
                      Upload Health Record
                    </a>
                  </Button>
                  <Button variant="outline" size={classes.buttonSecondary as any} asChild>
                    <a href="/responsibilities">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Responsibility
                    </a>
                  </Button>
                </>
              }
            />
          ) : (
            <>
              {/* Stats Grid - Consistent spacing using design tokens */}
              <div className={cn(classes.gridCols, classes.gridGap)}>
                <ExpenseCard />
                <HealthCard />
                <ResponsibilitiesCard />
                <MembersCard />
              </div>
              
              {/* Charts Section - Consistent spacing */}
              <div className={cn(
                'grid gap-4 lg:gap-6',
                mode === 'simple' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2'
              )}>
                <ExpenseChart />
                <BudgetChart />
              </div>
            </>
          )}
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
