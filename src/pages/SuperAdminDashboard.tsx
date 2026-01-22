import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Building2, Users, Activity, AlertTriangle } from 'lucide-react';
import { SuperAdminLayout } from '@/components/super-admin/SuperAdminLayout';
import { SystemKPICard } from '@/components/super-admin/SystemKPICard';
import { PlatformHealthPanel } from '@/components/super-admin/PlatformHealthPanel';
import { FamiliesPreviewPanel } from '@/components/super-admin/FamiliesPreviewPanel';
import { UsersOverviewPanel } from '@/components/super-admin/UsersOverviewPanel';
import { SystemActivityFeed } from '@/components/super-admin/SystemActivityFeed';
import { AlertsActionPanel } from '@/components/super-admin/AlertsActionPanel';
import FamiliesPage from './super-admin/FamiliesPage';
import UsersPage from './super-admin/UsersPage';
import AuditLogsPage from './super-admin/AuditLogsPage';
import ReportsPage from './super-admin/ReportsPage';
import SystemSettingsPage from './super-admin/SystemSettingsPage';
import CompliancePage from './super-admin/CompliancePage';
import FeatureFlagsPage from './super-admin/FeatureFlagsPage';
import PlatformLimitsPage from './super-admin/PlatformLimitsPage';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';

function SuperAdminDashboardHome() {
  const { mode } = useApp();
  const [isLoading, setIsLoading] = useState(false);

  // Simulated KPI data
  const kpiData = {
    totalFamilies: 1248,
    totalUsers: 4892,
    activeFamilies: 1156,
    pendingIssues: 8,
  };

  return (
    <div className="space-y-6 max-w-full">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">System Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Platform-wide overview and system administration
        </p>
      </div>

      {/* KPI Cards */}
      <div className={cn(
        'grid gap-4',
        mode === 'simple' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      )}>
        <SystemKPICard
          title="Total Families"
          value={kpiData.totalFamilies.toLocaleString()}
          icon={Building2}
          trend={{ value: 12, direction: 'up', label: 'this month' }}
          onClick={() => {}}
          isLoading={isLoading}
        />
        <SystemKPICard
          title="Total Users"
          value={kpiData.totalUsers.toLocaleString()}
          icon={Users}
          trend={{ value: 8, direction: 'up', label: 'this month' }}
          onClick={() => {}}
          isLoading={isLoading}
          variant="success"
        />
        <SystemKPICard
          title="Active Families"
          value={kpiData.activeFamilies.toLocaleString()}
          icon={Activity}
          trend={{ value: 3, direction: 'up', label: 'vs last month' }}
          onClick={() => {}}
          isLoading={isLoading}
        />
        <SystemKPICard
          title="Pending Issues"
          value={kpiData.pendingIssues}
          icon={AlertTriangle}
          trend={{ value: 2, direction: 'down', label: 'from yesterday' }}
          onClick={() => {}}
          isLoading={isLoading}
          variant={kpiData.pendingIssues > 5 ? 'warning' : 'default'}
        />
      </div>

      {/* Alerts Section - Visually prominent when non-empty */}
      <AlertsActionPanel isLoading={isLoading} />

      {/* Main Content Grid */}
      <div className={cn(
        'grid gap-6',
        mode === 'simple' ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'
      )}>
        {/* Left Column */}
        <div className="space-y-6">
          <PlatformHealthPanel isLoading={isLoading} />
          <FamiliesPreviewPanel isLoading={isLoading} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <UsersOverviewPanel isLoading={isLoading} />
          <SystemActivityFeed isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}

export default function SuperAdminDashboard() {
  return (
    <SuperAdminLayout>
      <Routes>
        <Route path="/" element={<SuperAdminDashboardHome />} />
        <Route path="/families" element={<FamiliesPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/audit" element={<AuditLogsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SystemSettingsPage />} />
        <Route path="/compliance" element={<CompliancePage />} />
        <Route path="/features" element={<FeatureFlagsPage />} />
        <Route path="/limits" element={<PlatformLimitsPage />} />
      </Routes>
    </SuperAdminLayout>
  );
}
