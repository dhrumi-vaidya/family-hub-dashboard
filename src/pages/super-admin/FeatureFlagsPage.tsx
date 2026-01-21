import { useState } from 'react';
import { ToggleLeft, ToggleRight, Search, Plus, Edit, Trash2, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
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
import { Textarea } from '@/components/ui/textarea';

interface FeatureFlag {
  id: string;
  name: string;
  key: string;
  description: string;
  enabled: boolean;
  rolloutPercentage: number;
  targetAudience: 'all' | 'premium' | 'beta' | 'admin';
  environment: 'development' | 'staging' | 'production';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  usageCount: number;
}

export default function FeatureFlagsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [environmentFilter, setEnvironmentFilter] = useState<string>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingFlag, setEditingFlag] = useState<FeatureFlag | null>(null);
  const [newFlag, setNewFlag] = useState({
    name: '',
    key: '',
    description: '',
    enabled: false,
    rolloutPercentage: 0,
    targetAudience: 'all' as const,
    environment: 'development' as const,
  });

  const featureFlags: FeatureFlag[] = [
    {
      id: '1',
      name: 'Enhanced Family Dashboard',
      key: 'enhanced_family_dashboard',
      description: 'New improved family dashboard with advanced analytics',
      enabled: true,
      rolloutPercentage: 75,
      targetAudience: 'premium',
      environment: 'production',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
      createdBy: 'super.admin@kutumb.com',
      usageCount: 1247,
    },
    {
      id: '2',
      name: 'AI-Powered Expense Categorization',
      key: 'ai_expense_categorization',
      description: 'Automatically categorize expenses using machine learning',
      enabled: false,
      rolloutPercentage: 0,
      targetAudience: 'beta',
      environment: 'staging',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-18',
      createdBy: 'super.admin@kutumb.com',
      usageCount: 0,
    },
    {
      id: '3',
      name: 'Real-time Notifications',
      key: 'realtime_notifications',
      description: 'Push notifications for family activities and updates',
      enabled: true,
      rolloutPercentage: 100,
      targetAudience: 'all',
      environment: 'production',
      createdAt: '2024-01-05',
      updatedAt: '2024-01-19',
      createdBy: 'super.admin@kutumb.com',
      usageCount: 4892,
    },
    {
      id: '4',
      name: 'Advanced Health Tracking',
      key: 'advanced_health_tracking',
      description: 'Detailed health metrics and trend analysis',
      enabled: true,
      rolloutPercentage: 50,
      targetAudience: 'premium',
      environment: 'production',
      createdAt: '2024-01-12',
      updatedAt: '2024-01-20',
      createdBy: 'super.admin@kutumb.com',
      usageCount: 623,
    },
    {
      id: '5',
      name: 'Dark Mode Theme',
      key: 'dark_mode_theme',
      description: 'Dark theme option for better user experience',
      enabled: true,
      rolloutPercentage: 100,
      targetAudience: 'all',
      environment: 'production',
      createdAt: '2024-01-08',
      updatedAt: '2024-01-16',
      createdBy: 'super.admin@kutumb.com',
      usageCount: 3456,
    },
    {
      id: '6',
      name: 'Family Video Calls',
      key: 'family_video_calls',
      description: 'Integrated video calling feature for families',
      enabled: false,
      rolloutPercentage: 0,
      targetAudience: 'beta',
      environment: 'development',
      createdAt: '2024-01-20',
      updatedAt: '2024-01-20',
      createdBy: 'super.admin@kutumb.com',
      usageCount: 0,
    },
  ];

  const filteredFlags = featureFlags.filter(flag => {
    const matchesSearch = flag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         flag.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         flag.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEnvironment = environmentFilter === 'all' || flag.environment === environmentFilter;
    
    return matchesSearch && matchesEnvironment;
  });

  const getEnvironmentBadge = (environment: FeatureFlag['environment']) => {
    switch (environment) {
      case 'development':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-200">Development</Badge>;
      case 'staging':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200">Staging</Badge>;
      case 'production':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-200">Production</Badge>;
    }
  };

  const getAudienceBadge = (audience: FeatureFlag['targetAudience']) => {
    switch (audience) {
      case 'all':
        return <Badge variant="outline">All Users</Badge>;
      case 'premium':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 dark:bg-purple-900 dark:text-purple-200">Premium</Badge>;
      case 'beta':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 dark:bg-orange-900 dark:text-orange-200">Beta</Badge>;
      case 'admin':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-200">Admin Only</Badge>;
    }
  };

  const toggleFlag = (flagId: string) => {
    console.log('Toggling feature flag: ' + flagId);
    // Here you would make the API call to toggle the flag
  };

  const createFlag = () => {
    console.log('Creating new feature flag:', newFlag);
    setShowCreateDialog(false);
    setNewFlag({
      name: '',
      key: '',
      description: '',
      enabled: false,
      rolloutPercentage: 0,
      targetAudience: 'all',
      environment: 'development',
    });
    // Here you would make the API call to create the flag
  };

  const updateFlag = (flag: FeatureFlag) => {
    console.log('Updating feature flag:', flag);
    setEditingFlag(null);
    // Here you would make the API call to update the flag
  };

  const deleteFlag = (flagId: string) => {
    console.log('Deleting feature flag: ' + flagId);
    // Here you would make the API call to delete the flag
  };

  const stats = {
    total: featureFlags.length,
    enabled: featureFlags.filter(f => f.enabled).length,
    production: featureFlags.filter(f => f.environment === 'production').length,
    totalUsage: featureFlags.reduce((sum, f) => sum + f.usageCount, 0),
  };

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Feature Flags</h1>
            <p className="text-muted-foreground mt-1">
              Manage feature rollouts and experimental functionality
            </p>
          </div>
          <Button 
            onClick={() => setShowCreateDialog(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Flag
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="stats-card">
            <div className="flex items-center gap-4">
              <div className="stats-card-icon blue">
                <ToggleLeft className="h-6 w-6" />
              </div>
              <div className="stats-card-content">
                <p className="stats-card-label">Total Flags</p>
                <p className="stats-card-value">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="flex items-center gap-4">
              <div className="stats-card-icon green">
                <ToggleRight className="h-6 w-6" />
              </div>
              <div className="stats-card-content">
                <p className="stats-card-label">Enabled</p>
                <p className="stats-card-value">{stats.enabled}</p>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="flex items-center gap-4">
              <div className="stats-card-icon purple">
                <Calendar className="h-6 w-6" />
              </div>
              <div className="stats-card-content">
                <p className="stats-card-label">In Production</p>
                <p className="stats-card-value">{stats.production}</p>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="flex items-center gap-4">
              <div className="stats-card-icon amber">
                <Users className="h-6 w-6" />
              </div>
              <div className="stats-card-content">
                <p className="stats-card-label">Total Usage</p>
                <p className="stats-card-value">{stats.totalUsage.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="form-card">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search feature flags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background border-input text-foreground"
              />
            </div>
            <Select value={environmentFilter} onValueChange={setEnvironmentFilter}>
              <SelectTrigger className="w-40 bg-background border-input text-foreground">
                <SelectValue placeholder="Environment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Environments</SelectItem>
                <SelectItem value="development">Development</SelectItem>
                <SelectItem value="staging">Staging</SelectItem>
                <SelectItem value="production">Production</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="super-admin-table-row">
                <TableHead className="text-muted-foreground">Feature</TableHead>
                <TableHead className="text-muted-foreground">Key</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Rollout</TableHead>
                <TableHead className="text-muted-foreground">Audience</TableHead>
                <TableHead className="text-muted-foreground">Environment</TableHead>
                <TableHead className="text-muted-foreground">Usage</TableHead>
                <TableHead className="text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFlags.map((flag) => (
                <TableRow key={flag.id} className="super-admin-table-row">
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{flag.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">{flag.description}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground font-mono text-sm">
                    {flag.key}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={flag.enabled}
                        onCheckedChange={() => toggleFlag(flag.id)}
                      />
                      <span className={flag.enabled ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}>
                        {flag.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-foreground">{flag.rolloutPercentage}%</span>
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: flag.rolloutPercentage + '%' }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getAudienceBadge(flag.targetAudience)}</TableCell>
                  <TableCell>{getEnvironmentBadge(flag.environment)}</TableCell>
                  <TableCell className="text-foreground">
                    {flag.usageCount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setEditingFlag(flag)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => deleteFlag(flag.id)}
                        className="text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Create Flag Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="bg-card border-border max-w-md">
            <DialogHeader>
              <DialogTitle className="text-foreground">Create Feature Flag</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Add a new feature flag to control functionality rollout.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">Feature Name</Label>
                <Input
                  id="name"
                  value={newFlag.name}
                  onChange={(e) => setNewFlag(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-background border-input text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="key" className="text-foreground">Feature Key</Label>
                <Input
                  id="key"
                  value={newFlag.key}
                  onChange={(e) => setNewFlag(prev => ({ ...prev, key: e.target.value }))}
                  className="bg-background border-input text-foreground font-mono"
                  placeholder="feature_key_name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-foreground">Description</Label>
                <Textarea
                  id="description"
                  value={newFlag.description}
                  onChange={(e) => setNewFlag(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-background border-input text-foreground"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="audience" className="text-foreground">Target Audience</Label>
                  <Select value={newFlag.targetAudience} onValueChange={(value: any) => setNewFlag(prev => ({ ...prev, targetAudience: value }))}>
                    <SelectTrigger className="bg-background border-input text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="beta">Beta</SelectItem>
                      <SelectItem value="admin">Admin Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="environment" className="text-foreground">Environment</Label>
                  <Select value={newFlag.environment} onValueChange={(value: any) => setNewFlag(prev => ({ ...prev, environment: value }))}>
                    <SelectTrigger className="bg-background border-input text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="development">Development</SelectItem>
                      <SelectItem value="staging">Staging</SelectItem>
                      <SelectItem value="production">Production</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="enabled"
                  checked={newFlag.enabled}
                  onCheckedChange={(checked) => setNewFlag(prev => ({ ...prev, enabled: checked }))}
                />
                <Label htmlFor="enabled" className="text-foreground">Enable immediately</Label>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowCreateDialog(false)}
                className="bg-secondary border-border text-secondary-foreground hover:bg-secondary/80"
              >
                Cancel
              </Button>
              <Button onClick={createFlag} className="bg-blue-600 hover:bg-blue-700">
                Create Flag
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
   
  );
}