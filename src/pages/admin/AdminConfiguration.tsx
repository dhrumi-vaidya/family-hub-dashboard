import { Settings, Users, Bell, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

/**
 * Admin Configuration
 * 
 * System configuration and limits management.
 * Read-only for now, future-ready for feature toggles and limits.
 */
export default function AdminConfiguration() {
  // Mock configuration data - in real app, this would come from admin APIs
  const systemConfig = {
    features: [
      { name: 'Family Registration', enabled: true, description: 'Allow new family signups' },
      { name: 'Health Records', enabled: true, description: 'Health document management' },
      { name: 'Expense Tracking', enabled: true, description: 'Family expense management' },
      { name: 'Responsibilities', enabled: true, description: 'Task assignment system' },
      { name: 'Emergency Access', enabled: false, description: 'Emergency health record access' },
    ],
    limits: [
      { name: 'Max Family Size', value: 20, unit: 'members', description: 'Maximum members per family' },
      { name: 'Storage Per Family', value: 5, unit: 'GB', description: 'File storage limit per family' },
      { name: 'API Rate Limit', value: 1000, unit: 'req/hour', description: 'API requests per hour per user' },
      { name: 'Session Timeout', value: 24, unit: 'hours', description: 'User session duration' },
    ],
    notifications: [
      { name: 'System Maintenance', enabled: true, description: 'Notify users of scheduled maintenance' },
      { name: 'Security Alerts', enabled: true, description: 'Send security-related notifications' },
      { name: 'Feature Updates', enabled: false, description: 'Announce new features to users' },
      { name: 'Usage Reports', enabled: true, description: 'Weekly usage reports to admins' },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">System Configuration</h1>
        <p className="text-slate-600 mt-1">
          Platform settings, feature toggles, and system limits
        </p>
      </div>

      {/* Feature Toggles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <Settings className="h-5 w-5" />
            Feature Toggles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {systemConfig.features.map((feature) => (
              <div
                key={feature.name}
                className="flex items-center justify-between p-3 border border-slate-200 rounded-lg"
              >
                <div>
                  <h3 className="font-medium text-slate-900">{feature.name}</h3>
                  <p className="text-sm text-slate-600 mt-1">{feature.description}</p>
                </div>
                <Badge className={feature.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {feature.enabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Feature toggles are currently read-only. 
              Contact system administrator to modify these settings.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* System Limits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <Users className="h-5 w-5" />
            System Limits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {systemConfig.limits.map((limit) => (
              <div
                key={limit.name}
                className="p-4 border border-slate-200 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-slate-900">{limit.name}</h3>
                  <span className="text-lg font-bold text-slate-900">
                    {limit.value} {limit.unit}
                  </span>
                </div>
                <p className="text-sm text-slate-600">{limit.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Warning:</strong> Changing system limits may affect platform performance. 
              Test changes in staging environment first.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <Bell className="h-5 w-5" />
            Global Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {systemConfig.notifications.map((notification) => (
              <div
                key={notification.name}
                className="flex items-center justify-between p-3 border border-slate-200 rounded-lg"
              >
                <div>
                  <h3 className="font-medium text-slate-900">{notification.name}</h3>
                  <p className="text-sm text-slate-600 mt-1">{notification.description}</p>
                </div>
                <Badge className={notification.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {notification.enabled ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <Shield className="h-5 w-5" />
            Security Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 border border-slate-200 rounded-lg">
              <h3 className="font-medium text-slate-900 mb-2">Password Policy</h3>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Minimum 8 characters</li>
                <li>• Must include uppercase, lowercase, and number</li>
                <li>• Password expiry: 90 days</li>
                <li>• Cannot reuse last 5 passwords</li>
              </ul>
            </div>
            
            <div className="p-4 border border-slate-200 rounded-lg">
              <h3 className="font-medium text-slate-900 mb-2">Session Security</h3>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Session timeout: 24 hours</li>
                <li>• Concurrent sessions: 3 max</li>
                <li>• Failed login attempts: 5 max</li>
                <li>• Account lockout: 30 minutes</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}