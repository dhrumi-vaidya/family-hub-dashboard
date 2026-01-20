import { useState } from 'react';
import { Shield, FileText, AlertTriangle, CheckCircle, Download, Eye, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

interface ComplianceItem {
  id: string;
  category: 'gdpr' | 'ccpa' | 'hipaa' | 'security' | 'data_retention';
  title: string;
  description: string;
  status: 'compliant' | 'non_compliant' | 'pending' | 'review_required';
  lastChecked: string;
  nextReview: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  actions?: string[];
}

interface ComplianceReport {
  id: string;
  name: string;
  type: 'gdpr' | 'security_audit' | 'data_inventory' | 'privacy_impact';
  generatedDate: string;
  status: 'completed' | 'in_progress' | 'scheduled';
  size: string;
}

export default function CompliancePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const complianceItems: ComplianceItem[] = [
    {
      id: '1',
      category: 'gdpr',
      title: 'Data Processing Consent',
      description: 'Ensure all users have provided explicit consent for data processing',
      status: 'compliant',
      lastChecked: '2024-01-20',
      nextReview: '2024-04-20',
      severity: 'high',
      actions: ['Review consent forms', 'Update privacy policy'],
    },
    {
      id: '2',
      category: 'gdpr',
      title: 'Right to Data Portability',
      description: 'Users can export their data in a machine-readable format',
      status: 'compliant',
      lastChecked: '2024-01-18',
      nextReview: '2024-07-18',
      severity: 'medium',
    },
    {
      id: '3',
      category: 'security',
      title: 'Data Encryption at Rest',
      description: 'All sensitive data must be encrypted when stored',
      status: 'compliant',
      lastChecked: '2024-01-19',
      nextReview: '2024-02-19',
      severity: 'critical',
    },
    {
      id: '4',
      category: 'data_retention',
      title: 'Automated Data Deletion',
      description: 'Implement automated deletion of data after retention period',
      status: 'pending',
      lastChecked: '2024-01-15',
      nextReview: '2024-01-25',
      severity: 'high',
      actions: ['Implement deletion scripts', 'Test automation'],
    },
    {
      id: '5',
      category: 'ccpa',
      title: 'Do Not Sell Personal Information',
      description: 'Provide clear opt-out mechanism for data selling',
      status: 'review_required',
      lastChecked: '2024-01-10',
      nextReview: '2024-01-22',
      severity: 'medium',
      actions: ['Review current practices', 'Update user controls'],
    },
    {
      id: '6',
      category: 'security',
      title: 'Access Control Audit',
      description: 'Regular review of user access permissions and roles',
      status: 'non_compliant',
      lastChecked: '2024-01-05',
      nextReview: '2024-01-21',
      severity: 'high',
      actions: ['Conduct access review', 'Remove unnecessary permissions', 'Document findings'],
    },
  ];

  const complianceReports: ComplianceReport[] = [
    {
      id: '1',
      name: 'GDPR Compliance Report Q1 2024',
      type: 'gdpr',
      generatedDate: '2024-01-20',
      status: 'completed',
      size: '2.4 MB',
    },
    {
      id: '2',
      name: 'Security Audit Report',
      type: 'security_audit',
      generatedDate: '2024-01-18',
      status: 'completed',
      size: '1.8 MB',
    },
    {
      id: '3',
      name: 'Data Inventory Report',
      type: 'data_inventory',
      generatedDate: '2024-01-15',
      status: 'in_progress',
      size: '-',
    },
    {
      id: '4',
      name: 'Privacy Impact Assessment',
      type: 'privacy_impact',
      generatedDate: '2024-01-25',
      status: 'scheduled',
      size: '-',
    },
  ];

  const filteredItems = complianceItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    return matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status: ComplianceItem['status']) => {
    switch (status) {
      case 'compliant':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-200">Compliant</Badge>;
      case 'non_compliant':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-200">Non-Compliant</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200">Pending</Badge>;
      case 'review_required':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 dark:bg-orange-900 dark:text-orange-200">Review Required</Badge>;
    }
  };

  const getSeverityBadge = (severity: ComplianceItem['severity']) => {
    switch (severity) {
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      case 'medium':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-200">Medium</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 dark:bg-orange-900 dark:text-orange-200">High</Badge>;
      case 'critical':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-200">Critical</Badge>;
    }
  };

  const getCategoryBadge = (category: ComplianceItem['category']) => {
    const categoryNames = {
      gdpr: 'GDPR',
      ccpa: 'CCPA',
      hipaa: 'HIPAA',
      security: 'Security',
      data_retention: 'Data Retention',
    };
    return <Badge variant="outline">{categoryNames[category]}</Badge>;
  };

  const getReportStatusBadge = (status: ComplianceReport['status']) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-200">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-200">In Progress</Badge>;
      case 'scheduled':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200">Scheduled</Badge>;
    }
  };

  const stats = {
    total: complianceItems.length,
    compliant: complianceItems.filter(i => i.status === 'compliant').length,
    nonCompliant: complianceItems.filter(i => i.status === 'non_compliant').length,
    pending: complianceItems.filter(i => i.status === 'pending' || i.status === 'review_required').length,
  };

  const complianceScore = Math.round((stats.compliant / stats.total) * 100);

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Compliance Management</h1>
            <p className="text-muted-foreground mt-1">
              Monitor and manage regulatory compliance requirements
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary">
              Compliance Score: {complianceScore}%
            </Badge>
          </div>
        </div>

        {/* Compliance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="stats-card">
            <div className="flex items-center gap-4">
              <div className="stats-card-icon green">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div className="stats-card-content">
                <p className="stats-card-label">Compliant</p>
                <p className="stats-card-value">{stats.compliant}</p>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="flex items-center gap-4">
              <div className="stats-card-icon red">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div className="stats-card-content">
                <p className="stats-card-label">Non-Compliant</p>
                <p className="stats-card-value">{stats.nonCompliant}</p>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="flex items-center gap-4">
              <div className="stats-card-icon yellow">
                <Calendar className="h-6 w-6" />
              </div>
              <div className="stats-card-content">
                <p className="stats-card-label">Pending Review</p>
                <p className="stats-card-value">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="flex items-center gap-4">
              <div className="stats-card-icon blue">
                <Shield className="h-6 w-6" />
              </div>
              <div className="stats-card-content">
                <p className="stats-card-label">Overall Score</p>
                <p className="stats-card-value">{complianceScore}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Compliance Score Progress */}
        <div className="form-card">
          <div className="form-card-header">
            <h3 className="form-card-title">Compliance Score</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Overall Compliance</span>
              <span className="text-foreground">{complianceScore}%</span>
            </div>
            <Progress value={complianceScore} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Based on {stats.compliant} compliant items out of {stats.total} total requirements
            </p>
          </div>
        </div>

        {/* Compliance Items */}
        <div className="super-admin-table">
          <div className="super-admin-table-header">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Compliance Requirements</h3>
              <div className="flex items-center gap-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40 bg-background border-input text-foreground">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="gdpr">GDPR</SelectItem>
                    <SelectItem value="ccpa">CCPA</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="data_retention">Data Retention</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-40 bg-background border-input text-foreground">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="compliant">Compliant</SelectItem>
                    <SelectItem value="non_compliant">Non-Compliant</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="review_required">Review Required</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="super-admin-table-row">
                <TableHead className="text-muted-foreground">Requirement</TableHead>
                <TableHead className="text-muted-foreground">Category</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Severity</TableHead>
                <TableHead className="text-muted-foreground">Last Checked</TableHead>
                <TableHead className="text-muted-foreground">Next Review</TableHead>
                <TableHead className="text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id} className="super-admin-table-row">
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{item.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                      {item.actions && (
                        <div className="mt-2 space-y-1">
                          {item.actions.map((action, index) => (
                            <p key={index} className="text-xs text-muted-foreground">• {action}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getCategoryBadge(item.category)}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>{getSeverityBadge(item.severity)}</TableCell>
                  <TableCell className="text-muted-foreground">{item.lastChecked}</TableCell>
                  <TableCell className="text-muted-foreground">{item.nextReview}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Compliance Reports */}
        <div className="super-admin-table">
          <div className="super-admin-table-header">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Compliance Reports
            </h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="super-admin-table-row">
                <TableHead className="text-muted-foreground">Report Name</TableHead>
                <TableHead className="text-muted-foreground">Type</TableHead>
                <TableHead className="text-muted-foreground">Generated Date</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Size</TableHead>
                <TableHead className="text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {complianceReports.map((report) => (
                <TableRow key={report.id} className="super-admin-table-row">
                  <TableCell className="text-foreground font-medium">
                    {report.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {report.type.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{report.generatedDate}</TableCell>
                  <TableCell>{getReportStatusBadge(report.status)}</TableCell>
                  <TableCell className="text-muted-foreground">{report.size}</TableCell>
                  <TableCell>
                    {report.status === 'completed' && (
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    
  );
}