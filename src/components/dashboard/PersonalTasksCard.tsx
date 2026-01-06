import { CheckSquare, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const tasks = [
  { id: 1, title: 'Pay electricity bill', due: 'Today', status: 'urgent' },
  { id: 2, title: 'Schedule doctor appointment', due: 'Tomorrow', status: 'pending' },
  { id: 3, title: 'Buy groceries', due: 'In 3 days', status: 'pending' },
  { id: 4, title: 'Submit insurance claim', due: 'Completed', status: 'done' },
];

export function PersonalTasksCard() {
  return (
    <Card className="animate-fade-in opacity-0" style={{ animationDelay: '0.25s' }}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <CheckSquare className="h-4 w-4 text-primary" />
          Your Tasks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={cn(
                'flex items-center justify-between rounded-lg border border-border p-3',
                task.status === 'done' && 'opacity-60'
              )}
            >
              <div className="flex items-center gap-3">
                {task.status === 'urgent' ? (
                  <AlertCircle className="h-4 w-4 text-destructive" />
                ) : task.status === 'done' ? (
                  <CheckSquare className="h-4 w-4 text-success" />
                ) : (
                  <Clock className="h-4 w-4 text-muted-foreground" />
                )}
                <span
                  className={cn(
                    'text-sm font-medium',
                    task.status === 'done' && 'line-through text-muted-foreground'
                  )}
                >
                  {task.title}
                </span>
              </div>
              <Badge
                variant={
                  task.status === 'urgent'
                    ? 'destructive'
                    : task.status === 'done'
                    ? 'secondary'
                    : 'outline'
                }
              >
                {task.due}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
