import { useState } from 'react';
import { Download, TrendingUp, Users, Building2, BarChart3, PieChart, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

interface ReportData {
  period: string;
  totalFamilies: number;
  activeFamilies: number;
  totalUsers: number;
  activeUsers: number;
  newSignups: number;
  storageUsed: string;
  avgSessionDuration: string;
}

interface TopFamily {
  id: string;
  name: string;
  memberCount: number;
  activityScore: number;
  storageUsed: string;
}

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<string>('30d');
  const [reportType, setReportType] = useState<string>('overview');

  // Mock report data
  const reportData: ReportData[] = [
    {
      period: 'Last 30 Days',
      totalFamilies: 1248,
      activeFamilies: 1156,
      totalUsers: 4892,
      activeUsers: 4456,
      newSignups: 234,
      storageUsed: '2.8 TB',
      avgSessionDuration: '24m 15s',
    },
    {
      period: 'Last 7 Days',
      totalFamilies: 1248,
      activeFamilies: 1189,
      totalUsers: 4892,
      activeUsers: 4623,
      newSignups: 67,
      storageUsed: '2.8 TB',
      avgSessionDuration: '26m 42s',
    },
  ];

  const topFamilies: TopFamily[] = [
    {
      id: '1',
      name: 'Sharma Family',
      memberCount: 12,
      activityScore: 98,
      storageUsed: '4.2 GB',
    },
    {
      id: '2',
      name: 'Patel Family',
      memberCount: 8,
      activityScore: 95,
      storageUsed: '3.8 GB',
    },
    {
      id: '3',
      name: 'Kumar Family',
      memberCount: 15,
      activityScore: 92,
      storageUsed: '5.1 GB',
    },
    {
      id: '4',
      name: 'Singh Family',
      memberCount: 6,
      activityScore: 89,
      storageUsed: '2.9 GB',
    },
    {
      id: '5',
      name: 'Gupta Family',
      memberCount: 10,
      activityScore: 87,
      storageUsed: '3.5 GB',
    },
  ];

  const currentData = reportData.find(d => 
    (dateRange === '30d' && d.period === 'Last 30 Days') ||
    (dateRange === '7d' && d.period === 'Last 7 Days')
  ) || reportData[0];

  const generateReport = () => {
    console.log('Generating ' + reportType + ' report for ' + dateRange + '...');
    // Here you would implement the report generation
  };

  const exportData = () => {
    console.log('Exporting report data...');
    // Here you would implement the export functionality
  };

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
            <p className="text-muted-foreground mt-1">
              Platform insights and performance metrics
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-40 bg-background border-input text-foreground">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={exportData}
              variant="outline"
              className="bg-secondary border-border text-secondary-foreground hover:bg-secondary/80"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="stats-card">
            <div className="flex items-center gap-4">
              <div className="stats-card-icon blue">
                <Building2 className="h-6 w-6" />
              </div>
              <div className="stats-card-content">
                <p className="stats-card-label">Total Families</p>
                <p className="stats-card-value">{currentData.totalFamilies.toLocaleString()}</p>
                <p className="stats-card-trend positive">
                  {currentData.activeFamilies} active
                </p>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="flex items-center gap-4">
              <div className="stats-card-icon green">
                <Users className="h-6 w-6" />
              </div>
              <div className="stats-card-content">
                <p className="stats-card-label">Total Users</p>
                <p className="stats-card-value">{currentData.totalUsers.toLocaleString()}</p>
                <p className="stats-card-trend positive">
                  {currentData.activeUsers} active
                </p>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="flex items-center gap-4">
              <div className="stats-card-icon purple">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div className="stats-card-content">
                <p className="stats-card-label">New Signups</p>
                <p className="stats-card-value">{currentData.newSignups}</p>
                <p className="stats-card-trend neutral">
                  {dateRange === '30d' ? 'This month' : 'This week'}
                </p>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="flex items-center gap-4">
              <div className="stats-card-icon amber">
                <Activity className="h-6 w-6" />
              </div>
              <div className="stats-card-content">
                <p className="stats-card-label">Avg Session</p>
                <p className="stats-card-value">{currentData.avgSessionDuration}</p>
                <p className="stats-card-trend neutral">
                  Per user
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Report Generation */}
        <div className="form-card">
          <div className="form-card-header">
            <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="form-card-title">Generate Custom Report</h3>
          </div>
          <div className="flex items-center gap-4">
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-48 bg-background border-input text-foreground">
                <SelectValue placeholder="Report Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overview">Platform Overview</SelectItem>
                <SelectItem value="families">Family Analytics</SelectItem>
                <SelectItem value="users">User Engagement</SelectItem>
                <SelectItem value="storage">Storage Usage</SelectItem>
                <SelectItem value="security">Security Report</SelectItem>
                <SelectItem value="performance">Performance Metrics</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={generateReport}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Top Performing Families */}
        <div className="super-admin-table">
          <div className="super-admin-table-header">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Top Performing Families
            </h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="super-admin-table-row">
                <TableHead className="text-muted-foreground">Rank</TableHead>
                <TableHead className="text-muted-foreground">Family Name</TableHead>
                <TableHead className="text-muted-foreground">Members</TableHead>
                <TableHead className="text-muted-foreground">Activity Score</TableHead>
                <TableHead className="text-muted-foreground">Storage Used</TableHead>
                <TableHead className="text-muted-foreground">Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topFamilies.map((family, index) => (
                <TableRow key={family.id} className="super-admin-table-row">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ' + (
                        index === 0 ? 'bg-yellow-500 text-yellow-900' :
                        index === 1 ? 'bg-gray-400 text-gray-900' :
                        index === 2 ? 'bg-amber-600 text-amber-100' :
                        'bg-muted text-muted-foreground'
                      )}>
                        {index + 1}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground font-medium">
                    {family.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {family.memberCount}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-foreground">{family.activityScore}</span>
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                          style={{ width: family.activityScore + '%' }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {family.storageUsed}
                  </TableCell>
                  <TableCell>
                    <Badge className={
                      family.activityScore >= 95 ? 'bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-200' :
                      family.activityScore >= 90 ? 'bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-200' :
                      'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200'
                    }>
                      {family.activityScore >= 95 ? 'Excellent' :
                       family.activityScore >= 90 ? 'Good' : 'Average'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Storage Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="form-card">
            <div className="form-card-header">
              <h3 className="form-card-title">Storage Usage Breakdown</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Storage Used</span>
                <span className="text-foreground font-bold">{currentData.storageUsed}</span>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Family Data</span>
                    <span className="text-foreground">1.8 TB (64%)</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '64%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Media Files</span>
                    <span className="text-foreground">0.7 TB (25%)</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '25%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">System Data</span>
                    <span className="text-foreground">0.3 TB (11%)</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '11%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-card">
            <div className="form-card-header">
              <h3 className="form-card-title">Growth Trends</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="text-muted-foreground text-sm">Monthly Growth Rate</p>
                  <p className="text-foreground font-bold">+12.5%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="text-muted-foreground text-sm">User Retention</p>
                  <p className="text-foreground font-bold">89.2%</p>
                </div>
                <Users className="h-8 w-8 text-blue-400" />
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="text-muted-foreground text-sm">Family Engagement</p>
                  <p className="text-foreground font-bold">94.7%</p>
                </div>
                <Activity className="h-8 w-8 text-purple-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
   
  );
}