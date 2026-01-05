import { Plus, Clock, CheckCircle2, AlertTriangle, RotateCcw, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';

const tasks = [
  {
    id: 1,
    title: 'Pay electricity bill',
    assignee: 'Vikram Sharma',
    status: 'pending',
    recurrence: 'monthly',
    dueDate: '5 Jan 2026',
    escalated: false,
  },
  {
    id: 2,
    title: 'School fees payment',
    assignee: 'Rajesh Sharma',
    status: 'pending',
    recurrence: 'quarterly',
    dueDate: '10 Jan 2026',
    escalated: true,
  },
  {
    id: 3,
    title: 'Weekly groceries',
    assignee: 'Anita Sharma',
    status: 'confirmed',
    recurrence: 'weekly',
    dueDate: '1 Jan 2026',
    escalated: false,
  },
  {
    id: 4,
    title: 'Medicine refill for Dadaji',
    assignee: 'Priya Sharma',
    status: 'pending',
    recurrence: 'monthly',
    dueDate: '3 Jan 2026',
    escalated: false,
  },
];

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, color: 'bg-warning-light text-warning' },
  confirmed: { label: 'Confirmed', icon: CheckCircle2, color: 'bg-success-light text-success' },
  escalated: { label: 'Escalated', icon: AlertTriangle, color: 'bg-destructive-light text-destructive' },
};

export default function Responsibilities() {
  const { mode } = useApp();

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-heading-lg text-foreground">Responsibilities</h1>
          <p className="mt-1 text-body text-muted-foreground">
            Assign and track family tasks and duties.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Task
        </Button>
      </div>

      {/* Task Lifecycle */}
      {mode === 'simple' && (
        <Card className="animate-fade-in opacity-0" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle className="text-base">Task Lifecycle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
              <Badge variant="outline" className="gap-1 px-3 py-1.5">
                <Plus className="h-3 w-3" />
                Task Created
              </Badge>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <Badge variant="outline" className="gap-1 px-3 py-1.5">
                <Clock className="h-3 w-3" />
                Reminder Sent
              </Badge>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <Badge variant="outline" className="gap-1 px-3 py-1.5">
                <CheckCircle2 className="h-3 w-3" />
                Confirmation
              </Badge>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <Badge variant="outline" className="gap-1 px-3 py-1.5 text-destructive">
                <AlertTriangle className="h-3 w-3" />
                Escalation
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tasks List */}
      <div className="space-y-3">
        {tasks.map((task, index) => {
          const status = task.escalated ? 'escalated' : task.status as keyof typeof statusConfig;
          const config = statusConfig[status];
          const StatusIcon = config.icon;

          return (
            <Card
              key={task.id}
              hover
              className="animate-fade-in opacity-0"
              style={{ animationDelay: `${(index + 2) * 0.1}s` }}
            >
              <CardContent className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', config.color)}>
                    <StatusIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{task.title}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span>Assigned to: <span className="font-medium text-foreground">{task.assignee}</span></span>
                      <span>Due: {task.dueDate}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="gap-1">
                    <RotateCcw className="h-3 w-3" />
                    {task.recurrence}
                  </Badge>
                  <Badge className={config.color}>
                    {config.label}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
