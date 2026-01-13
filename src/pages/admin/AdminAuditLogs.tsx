import { useState } from 'react';
import { Search, Filter, Download, AlertTriangle, Shield, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  userRole: 'super_admin' | 'admin' | 'member';
  category: 'auth' | 'admin' | 'security' | 'system';
  details: string;
  ipAddress: string;
  status: 'success' | 'failed' | 'warning';
}

/**
 * Admin Audit Logs
 * 
 * System activity and security logs for Super Admin.
 * Shows admin actions, login attempts, and security events.
 * NO access to family-specific activity logs.
 */
export default function AdminAuditLogs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Mock audit log data - in real app, this would come from admin APIs
  const auditLogs: AuditLog[] = [
    {
      id: '1',
      timestamp: '2024-01-13 14:30:25',
      action: 'Family Suspended',
      user: 'super.admin@kutumb.com',
      userRole: 'super_admin',
      category: 'admin',
      details: 'Suspended Kumar Family (ID: 3) due to policy violation',
      ipAddress: '192.168.1.100',
      status: 'success',
    },
    {
      id: '2',
      timestamp: '2024-01-13 14:15:12',
      action: 'Login Attempt',
      user: 'rahul@sharma.com',
      userRole: 'admin',
      category: 'auth',
      details: 'Successful login from new device',
      ipAddress: '203.0.113.45',
      status: 'success',
    },
    {
      id: '3',
      timestamp: '2024-01-13 13:45:33',
      action: 'Failed Login',
      user: 'unknown@email.com',
      userRole: 'member',
      category: 'security',
      details: 'Multiple failed login attempts - account temporarily locked',
      ipAddress: '198.51.100.22',
      status: 'failed',
    },
    {
      id: '4',
      timestamp: '2024-01-13 12:20:15',
      action: 'User Blocked',
      user: 'super.admin@kutumb.com',
      userRole: 'super_admin',
      category: 'admin',
      details: 'Blocked user amit@patel.com for suspicious activity',
      ipAddress: '192.168.1.100',
      status: 'success',
    },
    {
      id: '5',
      timestamp: '2024-01-13 11:30:45',
      action: 'System Backup',
      user: 'system',
      userRole: 'super_admin',
      category: 'system',
      details: 'Automated daily backup completed successfully',
      ipAddress: '127.0.0.1',
      status: 'success',
    },
  ];

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: 'success' | 'failed' | 'warning') => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getCategoryIcon = (category: 'auth' | 'admin' | 'security' | 'system') => {
    switch (category) {
      case 'auth': return User;
      case 'admin': return Shield;
      case 'security': return AlertTriangle;
      case 'system': return Shield;
    }
  };

  const exportLogs = () => {
    // In real app, this would generate and download a CSV/PDF report
    console.log('Exporting audit logs...');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Audit Logs</h1>
          <p className="text-slate-600 mt-1">
            System activity monitoring and security event tracking
          </p>
        </div>
        <Button onClick={exportLogs} className="gap-2">
          <Download className="h-4 w-4" />
          Export Logs
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900">
            Filter Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="auth">Authentication</SelectItem>
                <SelectItem value="admin">Admin Actions</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900">
            Recent Activity ({filteredLogs.length} entries)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLogs.map((log) => {
              const CategoryIcon = getCategoryIcon(log.category);
              return (
                <div
                  key={log.id}
                  className="flex items-start gap-4 p-4 border border-slate-200 rounded-lg"
                >
                  <div className="flex-shrink-0 mt-1">
                    <CategoryIcon className="h-5 w-5 text-slate-400" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-slate-900">{log.action}</h3>
                      <Badge className={getStatusColor(log.status)}>
                        {log.status}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-slate-600 mb-2">{log.details}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>User: {log.user}</span>
                      <span>IP: {log.ipAddress}</span>
                      <span>Time: {log.timestamp}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {filteredLogs.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-500">No audit logs match your current filters.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Summary */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Failed Logins (24h)
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {auditLogs.filter(log => log.category === 'security' && log.status === 'failed').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Admin Actions (24h)
            </CardTitle>
            <Shield className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {auditLogs.filter(log => log.category === 'admin').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              System Events (24h)
            </CardTitle>
            <User className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {auditLogs.filter(log => log.category === 'system').length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}