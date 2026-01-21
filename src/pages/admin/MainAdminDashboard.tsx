import { Users, Building2, Activity, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

/**
 * Main Admin Dashboard
 * 
 * System-level overview for Super Admin.
 * Shows aggregated, non-sensitive platform metrics.
 * No access to family-specific personal data.
 */
export default function MainAdminDashboard() {
  // Mock system data - in real app, this would come from system APIs
  const systemStats = {
    totalFamilies: 1247,
    activeFamilies: 1189,
    suspendedFamilies: 58,
    totalUsers: 8934,
    activeUsers: 8456,
    blockedUsers: 478,
    systemHealth: 'healthy' as const,
    lastUpdated: new Date().toLocaleString(),
  };

  const healthIndicators = [
    { label: 'API Response Time', value: '145ms', status: 'good' as const },
    { label: 'Database Connection', value: 'Connected', status: 'good' as const },
    { label: 'Storage Usage', value: '67%', status: 'warning' as const },
    { label: 'Active Sessions', value: '2,341', status: 'good' as const },
  ];

  const getStatusColor = (status: 'good' | 'warning' | 'error') => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">System Dashboard</h1>
        <p className="text-slate-600 mt-1">
          Platform overview and system health monitoring
        </p>
      </div>

      {/* System Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Families
            </CardTitle>
            <Building2 className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {systemStats.totalFamilies.toLocaleString()}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={getStatusColor('good')}>
                {systemStats.activeFamilies} Active
              </Badge>
              <Badge className={getStatusColor('warning')}>
                {systemStats.suspendedFamilies} Suspended
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {systemStats.totalUsers.toLocaleString()}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={getStatusColor('good')}>
                {systemStats.activeUsers} Active
              </Badge>
              <Badge className={getStatusColor('error')}>
                {systemStats.blockedUsers} Blocked
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              System Health
            </CardTitle>
            <Activity className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              Healthy
            </div>
            <p className="text-xs text-slate-500 mt-2">
              All systems operational
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Last Updated
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium text-slate-900">
              {systemStats.lastUpdated}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Real-time monitoring
            </p>
          </CardContent>
        </Card>
      </div>

      {/* System Health Indicators */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900">
            System Health Indicators
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {healthIndicators.map((indicator) => (
              <div key={indicator.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">
                    {indicator.label}
                  </span>
                  <Badge className={getStatusColor(indicator.status)}>
                    {indicator.status}
                  </Badge>
                </div>
                <div className="text-lg font-semibold text-slate-900">
                  {indicator.value}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900">
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <button className="p-4 text-left border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="font-medium text-slate-900">Review Suspended Families</div>
              <div className="text-sm text-slate-500 mt-1">
                {systemStats.suspendedFamilies} families need attention
              </div>
            </button>
            <button className="p-4 text-left border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="font-medium text-slate-900">Manage Blocked Users</div>
              <div className="text-sm text-slate-500 mt-1">
                {systemStats.blockedUsers} users blocked
              </div>
            </button>
            <button className="p-4 text-left border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="font-medium text-slate-900">View System Logs</div>
              <div className="text-sm text-slate-500 mt-1">
                Monitor recent activity
              </div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}