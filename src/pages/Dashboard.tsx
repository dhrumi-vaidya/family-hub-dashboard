import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { AttentionLayer, type Alert } from '@/components/dashboard/AttentionLayer';
import { KPIStrip, type KPIData } from '@/components/dashboard/KPIStrip';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { ResponsibilitiesPanel, type ResponsibilityItem } from '@/components/dashboard/ResponsibilitiesPanel';
import { ExpensePanel, type ExpenseSummary } from '@/components/dashboard/ExpensePanel';
import { HealthPanel, type HealthMemberStatus } from '@/components/dashboard/HealthPanel';
import { MemberPanel, type MemberStatus } from '@/components/dashboard/MemberPanel';
import { NotificationsPanel, type Notification } from '@/components/dashboard/NotificationsPanel';
import { TrendChart, type TrendMonth } from '@/components/dashboard/TrendChart';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Plus, Home } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { CompleteRegistrationModal } from '@/components/modals/CompleteRegistrationModal';

// ─── Placeholder empty data (replace with real API calls) ───────────────────
const alerts: Alert[] = [];
const kpi: KPIData = { overdueTasks: 0, budgetRiskPct: 0, healthAlerts: 0, inactiveMembers: 0 };
const responsibilities: ResponsibilityItem[] = [];
const expenses: ExpenseSummary = { totalSpent: 0, totalBudget: 0, categories: [] };
const healthMembers: HealthMemberStatus[] = [];
const members: MemberStatus[] = [];
const notifications: Notification[] = [];
const trendData: TrendMonth[] = [];
// ─────────────────────────────────────────────────────────────────────────────

const hasAnyData =
  responsibilities.length > 0 ||
  expenses.totalBudget > 0 ||
  healthMembers.length > 0 ||
  members.length > 0;

export default function Dashboard() {
  const { mode } = useApp();
  const { user, selectedFamily, isAuthenticated } = useAuth();
  const isFast = mode === 'fast';
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [onboardingData, setOnboardingData] = useState<{
    familyName: string;
    adminEmail: string;
    inviteEmails: string[];
    fromOnboarding: boolean;
  } | null>(null);

  // Check for onboarding data on mount
  useEffect(() => {
    const stateData = location.state as any;
    if (stateData?.fromOnboarding) {
      setOnboardingData(stateData);
      setShowRegistrationModal(true);
    }
  }, [location.state]);

  const handleRegistrationComplete = () => {
    setShowRegistrationModal(false);
    localStorage.removeItem('kutumbos_onboarding_data');
    setOnboardingData(null);
    // Refresh the page or trigger a re-render to show authenticated content
    window.location.reload();
  };

  // If onboarding modal is showing, render minimal layout
  if (showRegistrationModal && onboardingData && !isAuthenticated) {
    return (
      <>
        <CompleteRegistrationModal
          isOpen={showRegistrationModal}
          onClose={() => setShowRegistrationModal(false)}
          onComplete={handleRegistrationComplete}
          prefillData={onboardingData}
        />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Setting up your family...</p>
          </div>
        </div>
      </>
    );
  }

  const emailPrefix = user?.email?.split('@')[0] ?? '';
  const displayName = emailPrefix || (onboardingData ? 'Family Admin' : selectedFamily?.name) || 'there';
  const familyName = selectedFamily?.name ?? onboardingData?.familyName ?? 'Your Family';
  const greeting = user ? `Welcome, ${displayName}` : `Welcome to ${familyName}`;

  if (!hasAnyData) {
    return (
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className={cn('font-semibold text-foreground', isFast ? 'text-xl' : 'text-2xl')}>
            {greeting}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{familyName}</p>
        </div>
        <EmptyState
          icon={Home}
          title="Welcome to KutumbOS"
          description="Start by adding expenses, health records, or responsibilities to see your family dashboard."
          action={
            <>
              <Button asChild>
                <a href="/expenses"><Plus className="mr-2 h-4 w-4" />Add Expense</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/health"><Plus className="mr-2 h-4 w-4" />Upload Health Record</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/responsibilities"><Plus className="mr-2 h-4 w-4" />Create Responsibility</a>
              </Button>
            </>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-4 lg:space-y-5">

      {/* ── Header ── */}
      <div className={cn(
        'flex items-start justify-between',
        isFast ? 'mb-2' : 'mb-4'
      )}>
        <div>
          <h1 className={cn('font-semibold text-foreground', isFast ? 'text-lg' : 'text-2xl')}>
            {isFast ? familyName : greeting}
          </h1>
          {!isFast && (
            <p className="mt-0.5 text-sm text-muted-foreground">{familyName}</p>
          )}
        </div>
      </div>

      {/* 1. Attention Layer */}
      {alerts.length > 0 && (
        <AttentionLayer alerts={alerts} mode={mode} />
      )}

      {/* 2. KPI Strip */}
      <KPIStrip data={kpi} mode={mode} />

      {/* 3. Quick Actions */}
      <QuickActions mode={mode} />

      {/* 4–9. Main panels */}
      {isFast ? (
        // Fast mode: 2-column dense grid
        <div className="grid gap-4 lg:grid-cols-2">
          <ResponsibilitiesPanel items={responsibilities} mode={mode} />
          <ExpensePanel data={expenses} mode={mode} />
          <HealthPanel members={healthMembers} mode={mode} />
          <MemberPanel members={members} mode={mode} />
          <NotificationsPanel notifications={notifications} mode={mode} />
          <TrendChart data={trendData} mode={mode} />
        </div>
      ) : (
        // Simple mode: single column, full-width cards
        <div className="space-y-4">
          <ResponsibilitiesPanel items={responsibilities} mode={mode} />
          <ExpensePanel data={expenses} mode={mode} />
          <HealthPanel members={healthMembers} mode={mode} />
          <MemberPanel members={members} mode={mode} />
          <NotificationsPanel notifications={notifications} mode={mode} />
          <TrendChart data={trendData} mode={mode} />
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="mx-auto max-w-7xl space-y-4 lg:space-y-5">
        {/* ── Header ── */}
        <div className={cn(
          'flex items-start justify-between',
          isFast ? 'mb-2' : 'mb-4'
        )}>
          <div>
            <h1 className={cn('font-semibold text-foreground', isFast ? 'text-lg' : 'text-2xl')}>
              {isFast ? familyName : greeting}
            </h1>
            {!isFast && (
              <p className="mt-0.5 text-sm text-muted-foreground">{familyName}</p>
            )}
          </div>
        </div>

        {/* 1. Attention Layer */}
        {alerts.length > 0 && (
          <AttentionLayer alerts={alerts} mode={mode} />
        )}

        {/* 2. KPI Strip */}
        <KPIStrip data={kpi} mode={mode} />

        {/* 3. Quick Actions */}
        <QuickActions mode={mode} />

        {/* 4–9. Main panels */}
        {isFast ? (
          // Fast mode: 2-column dense grid
          <div className="grid gap-4 lg:grid-cols-2">
            <ResponsibilitiesPanel items={responsibilities} mode={mode} />
            <ExpensePanel data={expenses} mode={mode} />
            <HealthPanel members={healthMembers} mode={mode} />
            <MemberPanel members={members} mode={mode} />
            <NotificationsPanel notifications={notifications} mode={mode} />
            <TrendChart data={trendData} mode={mode} />
          </div>
        ) : (
          // Simple mode: single column, full-width cards
          <div className="space-y-4">
            <ResponsibilitiesPanel items={responsibilities} mode={mode} />
            <ExpensePanel data={expenses} mode={mode} />
            <HealthPanel members={healthMembers} mode={mode} />
            <ExpensePanel data={expenses} mode={mode} />
            <HealthPanel members={healthMembers} mode={mode} />
            <MemberPanel members={members} mode={mode} />
            <NotificationsPanel notifications={notifications} mode={mode} />
            <TrendChart data={trendData} mode={mode} />
          </div>
        )}
      </div>
    </>
  );
}
