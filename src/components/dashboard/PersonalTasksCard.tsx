import { useState, useEffect } from 'react';
import { CheckSquare, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { apiClient } from '@/lib/api';

export function PersonalTasksCard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/tasks/personal');
        if (response.success) {
          setTasks(response.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
        setTasks([]); // Empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);
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
          {loading ? (
            <div className="text-sm text-muted-foreground">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="text-sm text-muted-foreground">No tasks found</div>
          ) : (
            tasks.map((task: any) => (
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
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
