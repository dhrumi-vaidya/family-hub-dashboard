import { useState } from 'react';
import { FileText, Filter, Calendar, User, Activity } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
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

const typeColors: Record<string, string> = {
  expense: 'bg-primary-light text-primary',
  health: 'bg-destructive-light text-destructive',
  task: 'bg-accent-light text-accent',
  member: 'bg-secondary text-secondary-foreground',
  settings: 'bg-muted text-muted-foreground',
};

export default function AuditLogs() {
  const [actionFilter, setActionFilter] = useState('all');
  const [memberFilter, setMemberFilter] = useState('all');

  // No dummy data — logs will be populated from real API
  const logs: {
    id: number;
    action: string;
    details: string;
    member: string;
    timestamp: string;
    type: string;
  }[] = [];

  const filtered = logs.filter((log) => {
    const actionMatch = actionFilter === 'all' || log.type === actionFilter;
    const memberMatch = memberFilter === 'all' || log.member === memberFilter;
    return actionMatch && memberMatch;
  });

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
            <Select value={actionFilter} onValueChange={setActionFilter}>
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
            <Select value={memberFilter} onValueChange={setMemberFilter}>
              <SelectTrigger className="w-40">
                <User className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Member" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Members</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Logs List or Empty State */}
      {filtered.length === 0 ? (
        <Card className="animate-fade-in">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 mb-4">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No activity yet</h3>
            <p className="text-muted-foreground max-w-sm">
              Actions taken by family members will appear here automatically.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((log, index) => (
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
                      typeColors[log.type] ?? 'bg-muted text-muted-foreground'
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
      )}

      {/* Info Card */}
      <Card className="animate-fade-in border-accent bg-accent-light opacity-0" style={{ animationDelay: '0.3s' }}>
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
