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
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Wallet, Heart, FileText, Plus } from 'lucide-react';

export default function Dashboard() {
  const { mode, currentFamily } = useApp();
  const [view, setView] = useState<'family' | 'personal'>('family');

  // Check if there's any data (for empty state)
  const hasData = true; // In real app, this would check actual data

  return (
    <div className="mx-auto max-w-7xl">
      <SimpleModeBanner />
      
      {/* Page Header - Updated per KutumbOS spec */}
      <div className="mb-6 lg:mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-heading-lg text-foreground">
              {view === 'family' ? 'Family Overview' : 'Personal Overview'}
            </h1>
            <p className="mt-1 text-body text-muted-foreground">
              {view === 'family'
                ? 'Everything important, at one place.'
                : 'Your personal tasks and budget, at a glance.'}
            </p>
          </div>
          
          <Tabs value={view} onValueChange={(v) => setView(v as 'family' | 'personal')}>
            <TabsList>
              <TabsTrigger value="family">Family</TabsTrigger>
              <TabsTrigger value="personal">Personal</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {mode === 'simple' && (
          <Hint id="dashboard-intro" className="mt-4">
            {view === 'family'
              ? 'This is your family dashboard. Click on any card to see more details. Switch to Personal view to see your own stats.'
              : 'This is your personal dashboard. See your budget, tasks, and health at a glance.'}
          </Hint>
        )}
      </div>

      {/* Family View */}
      {view === 'family' && (
        <div className="space-y-6">
          {/* Empty State */}
          {!hasData ? (
            <Card className="animate-fade-in">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-6 flex gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-light">
                    <Wallet className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive-light">
                    <Heart className="h-6 w-6 text-destructive" />
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-light">
                    <FileText className="h-6 w-6 text-accent-foreground" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Welcome to KutumbOS
                </h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  Start by adding expenses, health records, or responsibilities.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Button variant="default" asChild>
                    <a href="/expenses">
                      <Plus className="mr-2 h-4 w-4" />
                      Add expense
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="/health">
                      <Plus className="mr-2 h-4 w-4" />
                      Upload health record
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="/responsibilities">
                      <Plus className="mr-2 h-4 w-4" />
                      Create responsibility
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Stats Grid - 2 columns Simple, 3 columns Fast */}
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
              
              {/* Charts Section */}
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
