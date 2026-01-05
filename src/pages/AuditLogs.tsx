import { FileText, Filter, Calendar, User, Activity } from 'lucide-react';
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
import { cn } from '@/lib/utils';

const logs = [
  {
    id: 1,
    action: 'Expense Added',
    details: 'Added ₹5,000 expense for Groceries',
    member: 'Anita Sharma',
    timestamp: '5 Jan 2026, 10:30 AM',
    type: 'expense',
  },
  {
    id: 2,
    action: 'Health Record Uploaded',
    details: 'Uploaded Blood Report for Anita Sharma',
    member: 'Rajesh Sharma',
    timestamp: '28 Dec 2025, 3:45 PM',
    type: 'health',
  },
  {
    id: 3,
    action: 'Task Completed',
    details: 'Weekly groceries task marked as complete',
    member: 'Anita Sharma',
    timestamp: '27 Dec 2025, 6:00 PM',
    type: 'task',
  },
  {
    id: 4,
    action: 'Member Added',
    details: 'Added new member: Shanti Devi',
    member: 'Rajesh Sharma',
    timestamp: '25 Dec 2025, 11:00 AM',
    type: 'member',
  },
  {
    id: 5,
    action: 'Settings Updated',
    details: 'WhatsApp notifications enabled',
    member: 'Vikram Sharma',
    timestamp: '24 Dec 2025, 9:15 AM',
    type: 'settings',
  },
  {
    id: 6,
    action: 'Budget Modified',
    details: 'Monthly budget updated to ₹60,000',
    member: 'Rajesh Sharma',
    timestamp: '1 Dec 2025, 10:00 AM',
    type: 'expense',
  },
];

const typeColors = {
  expense: 'bg-primary-light text-primary',
  health: 'bg-destructive-light text-destructive',
  task: 'bg-accent-light text-accent',
  member: 'bg-secondary text-secondary-foreground',
  settings: 'bg-muted text-muted-foreground',
};

export default function AuditLogs() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-heading-lg text-foreground">Audit Logs</h1>
          <p className="mt-1 text-body text-muted-foreground">
            View all actions performed in your family account.
          </p>
        </div>
        <Badge variant="secondary" className="w-fit">
          <FileText className="mr-1 h-3 w-3" />
          Read Only
        </Badge>
      </div>

      {/* Filters */}
      <Card className="animate-fade-in opacity-0" style={{ animationDelay: '0.1s' }}>
        <CardContent className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filter by:</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <Activity className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Action type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="expense">Expenses</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="task">Tasks</SelectItem>
                <SelectItem value="member">Members</SelectItem>
                <SelectItem value="settings">Settings</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <User className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Member" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Members</SelectItem>
                <SelectItem value="rajesh">Rajesh Sharma</SelectItem>
                <SelectItem value="anita">Anita Sharma</SelectItem>
                <SelectItem value="vikram">Vikram Sharma</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Logs List */}
      <div className="space-y-3">
        {logs.map((log, index) => (
          <Card
            key={log.id}
            className="animate-fade-in opacity-0"
            style={{ animationDelay: `${(index + 2) * 0.08}s` }}
          >
            <CardContent className="py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    'mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg',
                    typeColors[log.type as keyof typeof typeColors]
                  )}>
                    <Activity className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{log.action}</h3>
                    <p className="text-sm text-muted-foreground">{log.details}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5" />
                    {log.member}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {log.timestamp}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Card */}
      <Card className="animate-fade-in border-accent bg-accent-light opacity-0" style={{ animationDelay: '0.6s' }}>
        <CardContent className="py-4">
          <p className="text-sm text-accent-foreground">
            <strong>Note:</strong> Audit logs are maintained for compliance and trust.
            All actions are recorded automatically and cannot be modified or deleted.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
