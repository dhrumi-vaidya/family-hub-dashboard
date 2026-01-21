import { useState } from 'react';
import { Search, Filter, Download, Calendar, User, Shield, AlertTriangle, Info } from 'lucide-react';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  userRole: 'super_admin' | 'admin' | 'member';
  category: 'auth' | 'admin' | 'security' | 'system' | 'data';
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: string;
  ipAddress: string;
  userAgent?: string;
  familyId?: string;
  familyName?: string;
}

export default function AuditLogsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('7d');

  // Mock audit log data
  const auditLogs: AuditLog[] = [
    {
      id: '1',
      timestamp: '2024-01-20 14:30:25',
      action: 'User Login',
      user: 'super.admin@kutumb.com',
      userRole: 'super_admin',
      category: 'auth',
      severity: 'low',
      details: 'Super admin logged in successfully',
      ipAddress: '192.168.1.145',
      userAgent: 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36',
    },
    {
      id: '2',
      timestamp: '2024-01-20 14:25:12',
      action: 'Family Suspended',
      user: 'super.admin@kutumb.com',
      userRole: 'super_admin',
      category: 'admin',
      severity: 'high',
      details: 'Suspended Kumar Family (ID: 3) due to policy violation',
      ipAddress: '192.168.1.145',
      familyId: '3',
      familyName: 'Kumar Family',
    },
    {
      id: '3',
      timestamp: '2024-01-20 13:45:33',
      action: 'Failed Login Attempt',
      user: 'unknown@example.com',
      userRole: 'member',
      category: 'security',
      severity: 'medium',
      details: 'Multiple failed login attempts detected',
      ipAddress: '203.0.113.42',
    },
    {
      id: '4',
      timestamp: '2024-01-20 12:15:44',
      action: 'User Blocked',
      user: 'super.admin@kutumb.com',
      userRole: 'super_admin',
      category: 'admin',
      severity: 'high',
      details: 'Blocked user amit@patel.com for suspicious activity',
      ipAddress: '192.168.1.145',
    },
    {
      id: '5',
      timestamp: '2024-01-20 11:30:15',
      action: 'Data Export',
      user: 'rahul@sharma.com',
      userRole: 'admin',
      category: 'data',
      severity: 'medium',
      details: 'Exported family expense data',
      ipAddress: '192.168.1.100',
      familyId: '1',
      familyName: 'Sharma Family',
    },
    {
      id: '6',
      timestamp: '2024-01-20 10:00:00',
      action: 'System Backup',
      user: 'system',
      userRole: 'super_admin',
      category: 'system',
      severity: 'low',
      details: 'Automated daily backup completed successfully',
      ipAddress: '127.0.0.1',
    },
    {
      id: '7',
      timestamp: '2024-01-20 09:15:22',
      action: 'Security Alert',
      user: 'system',
      userRole: 'super_admin',
      category: 'security',
      severity: 'critical',
      details: 'Unusual login pattern detected from multiple IPs',
      ipAddress: '203.0.113.0',
    },
  ];

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;
    const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter;
    
    return matchesSearch && matchesCategory && matchesSeverity;
  });

  const getSeverityBadge = (severity: AuditLog['severity']) => {
    switch (severity) {
      case 'low':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Low</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Medium</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">High</Badge>;
      case 'critical':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Critical</Badge>;
    }
  };

  const getCategoryIcon = (category: AuditLog['category']) => {
    switch (category) {
      case 'auth':
        return <User className="h-4 w-4" />;
      case 'admin':
        return <Shield className="h-4 w-4" />;
      case 'security':
        return <AlertTriangle className="h-4 w-4" />;
      case 'system':
        return <Info className="h-4 w-4" />;
      case 'data':
        return <Download className="h-4 w-4" />;
    }
  };

  const getRoleBadge = (role: AuditLog['userRole']) => {
    switch (role) {
      case 'super_admin':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Super Admin</Badge>;
      case 'admin':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Admin</Badge>;
      case 'member':
        return <Badge variant="outline">Member</Badge>;
    }
  };

  const exportLogs = () => {
    console.log('Exporting audit logs...');
    // Here you would implement the export functionality
  };

  const stats = {
    total: auditLogs.length,
    critical: auditLogs.filter(l => l.severity === 'critical').length,
    security: auditLogs.filter(l => l.category === 'security').length,
    admin: auditLogs.filter(l => l.category === 'admin').length,
  };

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Audit Logs</h1>
            <p className="text-muted-foreground mt-1">
              Monitor all system activities and security events
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={exportLogs}
              className="bg-secondary hover:bg-secondary/80 text-secondary-foreground"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Logs
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="stats-card">
            <div className="flex items-center gap-4">
              <div className="stats-card-icon blue">
                <Info className="h-6 w-6" />
              </div>
              <div className="stats-card-content">
                <p className="stats-card-label">Total Events</p>
                <p className="stats-card-value">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="flex items-center gap-4">
              <div className="stats-card-icon red">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div className="stats-card-content">
                <p className="stats-card-label">Critical Events</p>
                <p className="stats-card-value">{stats.critical}</p>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="flex items-center gap-4">
              <div className="stats-card-icon yellow">
                <Shield className="h-6 w-6" />
              </div>
              <div className="stats-card-content">
                <p className="stats-card-label">Security Events</p>
                <p className="stats-card-value">{stats.security}</p>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="flex items-center gap-4">
              <div className="stats-card-icon purple">
                <User className="h-6 w-6" />
              </div>
              <div className="stats-card-content">
                <p className="stats-card-label">Admin Actions</p>
                <p className="stats-card-value">{stats.admin}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="super-admin-table">
          <div className="super-admin-table-header">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs by action, user, or details..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background border-input text-foreground"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40 bg-background border-input text-foreground">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="auth">Authentication</SelectItem>
                  <SelectItem value="admin">Admin Actions</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="data">Data</SelectItem>
                </SelectContent>
              </Select>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-32 bg-background border-input text-foreground">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-32 bg-background border-input text-foreground">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">Last 24h</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/60">
                  <TableHead className="text-muted-foreground font-semibold">Timestamp</TableHead>
                  <TableHead className="text-muted-foreground font-semibold">Action</TableHead>
                  <TableHead className="text-muted-foreground font-semibold">User</TableHead>
                  <TableHead className="text-muted-foreground font-semibold">Category</TableHead>
                  <TableHead className="text-muted-foreground font-semibold">Severity</TableHead>
                  <TableHead className="text-muted-foreground font-semibold">Details</TableHead>
                  <TableHead className="text-muted-foreground font-semibold">IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id} className="super-admin-table-row">
                    <TableCell className="text-muted-foreground font-mono text-sm">
                      {log.timestamp}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(log.category)}
                        <span className="text-foreground font-medium">{log.action}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-foreground">{log.user}</p>
                        <div className="mt-1">{getRoleBadge(log.userRole)}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {log.category}
                      </Badge>
                    </TableCell>
                    <TableCell>{getSeverityBadge(log.severity)}</TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="text-foreground text-sm truncate">{log.details}</p>
                        {log.familyName && (
                          <p className="text-muted-foreground text-xs mt-1">Family: {log.familyName}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono text-sm">
                      {log.ipAddress}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    
  );
}