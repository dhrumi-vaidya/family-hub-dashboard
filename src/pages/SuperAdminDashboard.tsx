import { useState } from 'react';
import { Building2, Users, Activity, AlertTriangle } from 'lucide-react';
import { SuperAdminLayout } from '@/components/super-admin/SuperAdminLayout';
import { SystemKPICard } from '@/components/super-admin/SystemKPICard';
import { PlatformHealthPanel } from '@/components/super-admin/PlatformHealthPanel';
import { FamiliesPreviewPanel } from '@/components/super-admin/FamiliesPreviewPanel';
import { UsersOverviewPanel } from '@/components/super-admin/UsersOverviewPanel';
import { SystemActivityFeed } from '@/components/super-admin/SystemActivityFeed';
import { AlertsActionPanel } from '@/components/super-admin/AlertsActionPanel';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';

export default function SuperAdminDashboard() {
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
    <SuperAdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-100">System Dashboard</h1>
          <p className="text-slate-400 mt-1">
            Platform-wide overview and system administration
          </p>
        </div>

        {/* KPI Cards */}
        <div className={cn(
          'grid gap-4',
          mode === 'simple' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2 lg:grid-cols-4'
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
    </SuperAdminLayout>
  );
}
