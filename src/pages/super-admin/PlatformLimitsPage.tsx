import { useState } from 'react';
import { Gauge, Users, Database, Clock, AlertTriangle, TrendingUp, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PlatformLimit {
  id: string;
  category: 'users' | 'storage' | 'api' | 'features' | 'performance';
  name: string;
  description: string;
  currentValue: number;
  limitValue: number;
  unit: string;
  warningThreshold: number;
  criticalThreshold: number;
  lastUpdated: string;
  autoScale: boolean;
}

interface LimitHistory {
  id: string;
  limitId: string;
  timestamp: string;
  oldValue: number;
  newValue: number;
  reason: string;
  updatedBy: string;
}

export default function PlatformLimitsPage() {
  const [editingLimit, setEditingLimit] = useState<PlatformLimit | null>(null);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [selectedLimitHistory, setSelectedLimitHistory] = useState<string>('');

  const platformLimits: PlatformLimit[] = [
    {
      id: '1',
      category: 'users',
      name: 'Max Users per Family',
      description: 'Maximum number of users allowed in a single family',
      currentValue: 47,
      limitValue: 50,
      unit: 'users',
      warningThreshold: 80,
      criticalThreshold: 95,
      lastUpdated: '2024-01-20',
      autoScale: false,
    },
    {
      id: '2',
      category: 'storage',
      name: 'Family Storage Limit',
      description: 'Maximum storage space per family',
      currentValue: 8.5,
      limitValue: 10,
      unit: 'GB',
      warningThreshold: 80,
      criticalThreshold: 90,
      lastUpdated: '2024-01-19',
      autoScale: true,
    },
    {
      id: '3',
      category: 'api',
      name: 'API Requests per Hour',
      description: 'Maximum API requests per user per hour',
      currentValue: 850,
      limitValue: 1000,
      unit: 'requests',
      warningThreshold: 85,
      criticalThreshold: 95,
      lastUpdated: '2024-01-20',
      autoScale: false,
    },
    {
      id: '4',
      category: 'features',
      name: 'Concurrent Video Calls',
      description: 'Maximum simultaneous video calls platform-wide',
      currentValue: 45,
      limitValue: 100,
      unit: 'calls',
      warningThreshold: 70,
      criticalThreshold: 90,
      lastUpdated: '2024-01-18',
      autoScale: true,
    },
    {
      id: '5',
      category: 'performance',
      name: 'Database Connections',
      description: 'Maximum concurrent database connections',
      currentValue: 180,
      limitValue: 200,
      unit: 'connections',
      warningThreshold: 85,
      criticalThreshold: 95,
      lastUpdated: '2024-01-20',
      autoScale: true,
    },
    {
      id: '6',
      category: 'storage',
      name: 'File Upload Size',
      description: 'Maximum size for individual file uploads',
      currentValue: 45,
      limitValue: 50,
      unit: 'MB',
      warningThreshold: 80,
      criticalThreshold: 90,
      lastUpdated: '2024-01-15',
      autoScale: false,
    },
  ];

  const limitHistory: LimitHistory[] = [
    {
      id: '1',
      limitId: '2',
      timestamp: '2024-01-19 14:30:00',
      oldValue: 8,
      newValue: 10,
      reason: 'Increased demand from premium families',
      updatedBy: 'super.admin@kutumb.com',
    },
    {
      id: '2',
      limitId: '4',
      timestamp: '2024-01-18 10:15:00',
      oldValue: 75,
      newValue: 100,
      reason: 'Holiday season traffic spike preparation',
      updatedBy: 'super.admin@kutumb.com',
    },
    {
      id: '3',
      limitId: '5',
      timestamp: '2024-01-17 16:45:00',
      oldValue: 150,
      newValue: 200,
      reason: 'Database performance optimization',
      updatedBy: 'super.admin@kutumb.com',
    },
  ];

  const getCategoryIcon = (category: PlatformLimit['category']) => {
    switch (category) {
      case 'users':
        return <Users className="h-4 w-4" />;
      case 'storage':
        return <Database className="h-4 w-4" />;
      case 'api':
        return <Clock className="h-4 w-4" />;
      case 'features':
        return <Settings className="h-4 w-4" />;
      case 'performance':
        return <TrendingUp className="h-4 w-4" />;
    }
  };

  const getCategoryBadge = (category: PlatformLimit['category']) => {
    const categoryNames = {
      users: 'Users',
      storage: 'Storage',
      api: 'API',
      features: 'Features',
      performance: 'Performance',
    };
    return <Badge variant="outline">{categoryNames[category]}</Badge>;
  };

  const getUsagePercentage = (current: number, limit: number) => {
    const ratio = current / limit;
    return Math.round(ratio * 100);
  };

  const getUsageStatus = (percentage: number, warningThreshold: number, criticalThreshold: number) => {
    if (percentage >= criticalThreshold) {
      return { status: 'critical', color: 'text-red-400', bgColor: 'bg-red-500' };
    } else if (percentage >= warningThreshold) {
      return { status: 'warning', color: 'text-yellow-400', bgColor: 'bg-yellow-500' };
    } else {
      return { status: 'normal', color: 'text-green-400', bgColor: 'bg-green-500' };
    }
  };

  const updateLimit = (limit: PlatformLimit) => {
    console.log('Updating platform limit:', limit);
    setEditingLimit(null);
    // Here you would make the API call to update the limit
  };

  const viewHistory = (limitId: string) => {
    setSelectedLimitHistory(limitId);
    setShowHistoryDialog(true);
  };

  const getFilteredHistory = () => {
    return limitHistory.filter(h => h.limitId === selectedLimitHistory);
  };

  const stats = {
    totalLimits: platformLimits.length,
    criticalLimits: platformLimits.filter(function(l) {
      const percentage = getUsagePercentage(l.currentValue, l.limitValue);
      return percentage >= l.criticalThreshold;
    }).length,
    warningLimits: platformLimits.filter(function(l) {
      const percentage = getUsagePercentage(l.currentValue, l.limitValue);
      return percentage >= l.warningThreshold && percentage < l.criticalThreshold;
    }).length,
    autoScaleLimits: platformLimits.filter(function(l) { return l.autoScale; }).length,
  };

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Platform Limits</h1>
            <p className="text-muted-foreground mt-1">
              Monitor and manage system resource limits and quotas
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary">
              {stats.totalLimits} Total Limits
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="stats-card">
            <div className="flex items-center gap-4">
              <div className="stats-card-icon red">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div className="stats-card-content">
                <p className="stats-card-label">Critical Limits</p>
                <p className="stats-card-value">{stats.criticalLimits}</p>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="flex items-center gap-4">
              <div className="stats-card-icon yellow">
                <Gauge className="h-6 w-6" />
              </div>
              <div className="stats-card-content">
                <p className="stats-card-label">Warning Limits</p>
                <p className="stats-card-value">{stats.warningLimits}</p>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="flex items-center gap-4">
              <div className="stats-card-icon blue">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div className="stats-card-content">
                <p className="stats-card-label">Auto-Scale Enabled</p>
                <p className="stats-card-value">{stats.autoScaleLimits}</p>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="flex items-center gap-4">
              <div className="stats-card-icon green">
                <Settings className="h-6 w-6" />
              </div>
              <div className="stats-card-content">
                <p className="stats-card-label">Total Limits</p>
                <p className="stats-card-value">{stats.totalLimits}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Limits Table */}
        <div className="super-admin-table">
          <div className="super-admin-table-header">
            <h3 className="text-lg font-semibold text-foreground">Current Platform Limits</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="super-admin-table-row">
                <TableHead className="text-muted-foreground">Limit</TableHead>
                <TableHead className="text-muted-foreground">Category</TableHead>
                <TableHead className="text-muted-foreground">Current Usage</TableHead>
                <TableHead className="text-muted-foreground">Limit Value</TableHead>
                <TableHead className="text-muted-foreground">Usage %</TableHead>
                <TableHead className="text-muted-foreground">Auto-Scale</TableHead>
                <TableHead className="text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {platformLimits.map((limit) => {
                const percentage = getUsagePercentage(limit.currentValue, limit.limitValue);
                const status = getUsageStatus(percentage, limit.warningThreshold, limit.criticalThreshold);
                
                return (
                  <TableRow key={limit.id} className="super-admin-table-row">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(limit.category)}
                        <div>
                          <p className="font-medium text-foreground">{limit.name}</p>
                          <p className="text-sm text-muted-foreground">{limit.description}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getCategoryBadge(limit.category)}</TableCell>
                    <TableCell className="text-foreground">
                      {limit.currentValue} {limit.unit}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {limit.limitValue} {limit.unit}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className={'text-sm font-medium ' + status.color}>
                            {percentage}%
                          </span>
                        </div>
                        <Progress 
                          value={percentage} 
                          className="h-2 w-20"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={limit.autoScale ? 'bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200'}>
                        {limit.autoScale ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setEditingLimit(limit)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => viewHistory(limit.id)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Clock className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Edit Limit Dialog */}
        <Dialog open={!!editingLimit} onOpenChange={() => setEditingLimit(null)}>
          <DialogContent className="bg-card border-border max-w-md">
            <DialogHeader>
              <DialogTitle className="text-foreground">Edit Platform Limit</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Update the limit value and configuration for {editingLimit?.name}.
              </DialogDescription>
            </DialogHeader>
            {editingLimit && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="limitValue" className="text-foreground">Limit Value</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="limitValue"
                      type="number"
                      value={editingLimit.limitValue}
                      onChange={(e) => setEditingLimit(prev => prev ? { ...prev, limitValue: parseInt(e.target.value) } : null)}
                      className="bg-background border-input text-foreground"
                    />
                    <span className="text-muted-foreground">{editingLimit.unit}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="warningThreshold" className="text-foreground">Warning Threshold (%)</Label>
                  <Input
                    id="warningThreshold"
                    type="number"
                    value={editingLimit.warningThreshold}
                    onChange={(e) => setEditingLimit(prev => prev ? { ...prev, warningThreshold: parseInt(e.target.value) } : null)}
                    className="bg-background border-input text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="criticalThreshold" className="text-foreground">Critical Threshold (%)</Label>
                  <Input
                    id="criticalThreshold"
                    type="number"
                    value={editingLimit.criticalThreshold}
                    onChange={(e) => setEditingLimit(prev => prev ? { ...prev, criticalThreshold: parseInt(e.target.value) } : null)}
                    className="bg-background border-input text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="autoScale" className="text-foreground">Auto-Scale</Label>
                  <Select 
                    value={editingLimit.autoScale ? 'enabled' : 'disabled'} 
                    onValueChange={(value) => setEditingLimit(prev => prev ? { ...prev, autoScale: value === 'enabled' } : null)}
                  >
                    <SelectTrigger className="bg-background border-input text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enabled">Enabled</SelectItem>
                      <SelectItem value="disabled">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setEditingLimit(null)}
                className="bg-secondary border-border text-secondary-foreground hover:bg-secondary/80"
              >
                Cancel
              </Button>
              <Button onClick={() => editingLimit && updateLimit(editingLimit)} className="bg-blue-600 hover:bg-blue-700">
                Update Limit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* History Dialog */}
        <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
          <DialogContent className="bg-card border-border max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-foreground">Limit Change History</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Recent changes to this platform limit.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow className="super-admin-table-row">
                    <TableHead className="text-muted-foreground">Timestamp</TableHead>
                    <TableHead className="text-muted-foreground">Change</TableHead>
                    <TableHead className="text-muted-foreground">Reason</TableHead>
                    <TableHead className="text-muted-foreground">Updated By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getFilteredHistory().map((history) => (
                    <TableRow key={history.id} className="super-admin-table-row">
                      <TableCell className="text-muted-foreground font-mono text-sm">
                        {history.timestamp}
                      </TableCell>
                      <TableCell>
                        <span className="text-foreground">
                          {history.oldValue} → {history.newValue}
                        </span>
                      </TableCell>
                      <TableCell className="text-foreground">
                        {history.reason}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {history.updatedBy}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowHistoryDialog(false)}
                className="bg-secondary border-border text-secondary-foreground hover:bg-secondary/80"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  
  );
}