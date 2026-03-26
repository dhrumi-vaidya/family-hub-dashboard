import { Clock, AlertTriangle, CheckCircle2, ArrowRight, Timer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ResponsibilityItem {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
  status: 'pending' | 'overdue' | 'confirmed' | 'escalated';
  stuckDays?: number; // days without update
}

interface ResponsibilitiesPanelProps {
  items: ResponsibilityItem[];
  mode: 'simple' | 'fast';
}

const statusIcon = {
  pending: Clock,
  overdue: AlertTriangle,
  confirmed: CheckCircle2,
  escalated: AlertTriangle,
};

const statusColor = {
  pending: 'text-warning',
  overdue: 'text-destructive',
  confirmed: 'text-success',
  escalated: 'text-destructive',
};

const statusBadge = {
  pending: 'secondary' as const,
  overdue: 'destructive' as const,
  confirmed: 'default' as const,
  escalated: 'destructive' as const,
};

export function ResponsibilitiesPanel({ items, mode }: ResponsibilitiesPanelProps) {
  const urgent = items.filter((i) => i.status === 'overdue' || i.status === 'escalated');
  const dueToday = items.filter((i) => i.status === 'pending');

  if (mode === 'simple') {
    const shown = [...urgent, ...dueToday].slice(0, 4);
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium text-muted-foreground">Responsibilities</CardTitle>
            {urgent.length > 0 && (
              <Badge variant="destructive">{urgent.length} overdue</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {shown.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">All responsibilities are on track.</p>
          ) : (
            shown.map((item) => {
              const Icon = statusIcon[item.status];
              return (
                <div key={item.id} className={cn(
                  'rounded-lg border p-4',
                  item.status === 'overdue' || item.status === 'escalated'
                    ? 'border-destructive/30 bg-destructive/5'
                    : 'border-border bg-card'
                )}>
                  <div className="flex items-start gap-3">
                    <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', statusColor[item.status])} />
                    <div className="flex-1">
                      <p className="text-base font-medium text-foreground">
                        {item.assignee} hasn't completed "{item.title}"
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">Due: {item.dueDate}</p>
                      {item.stuckDays && item.stuckDays > 2 && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-warning">
                          <Timer className="h-3 w-3" />
                          Stuck for {item.stuckDays} days
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <Button variant="soft" className="w-full justify-between" asChild>
            <a href="/responsibilities">
              View all responsibilities
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Fast mode — dense list with filters
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">Responsibilities</CardTitle>
          <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" asChild>
            <a href="/responsibilities">
              View all <ArrowRight className="h-3 w-3" />
            </a>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {items.length === 0 ? (
          <p className="px-4 py-3 text-sm text-muted-foreground">No responsibilities yet.</p>
        ) : (
          <div className="divide-y divide-border">
            {items.slice(0, 6).map((item) => {
              const Icon = statusIcon[item.status];
              return (
                <div key={item.id} className="flex items-center gap-3 px-4 py-2.5">
                  <Icon className={cn('h-4 w-4 shrink-0', statusColor[item.status])} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.assignee} · {item.dueDate}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {item.stuckDays && item.stuckDays > 2 && (
                      <Timer className="h-3.5 w-3.5 text-warning" />
                    )}
                    <Badge variant={statusBadge[item.status]} className="text-xs capitalize">
                      {item.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
