import { Bell, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface Notification {
  id: string;
  message: string;
  time: string;
  actionable: boolean;
  ctaLabel?: string;
  ctaPath?: string;
}

interface NotificationsPanelProps {
  notifications: Notification[];
  mode: 'simple' | 'fast';
}

export function NotificationsPanel({ notifications, mode }: NotificationsPanelProps) {
  const shown = mode === 'simple'
    ? notifications.filter((n) => n.actionable).slice(0, 4)
    : notifications.slice(0, 8);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className={cn(
            'font-medium text-muted-foreground',
            mode === 'simple' ? 'text-base' : 'text-sm'
          )}>
            Notifications
          </CardTitle>
          {shown.length > 0 && (
            <Badge variant="secondary">{shown.length} new</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className={cn(mode === 'fast' ? 'p-0' : 'space-y-3')}>
        {shown.length === 0 ? (
          <p className={cn('text-muted-foreground', mode === 'simple' ? 'text-sm py-2' : 'px-4 py-3 text-sm')}>
            No new notifications.
          </p>
        ) : mode === 'simple' ? (
          shown.map((n) => (
            <div key={n.id} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15">
                <Bell className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{n.message}</p>
                <p className="mt-1 text-xs text-muted-foreground">{n.time}</p>
              </div>
              {n.ctaPath && (
                <Button size="sm" variant="outline" className="shrink-0" asChild>
                  <a href={n.ctaPath}>{n.ctaLabel ?? 'View'}</a>
                </Button>
              )}
            </div>
          ))
        ) : (
          <div className="divide-y divide-border">
            {shown.map((n) => (
              <div key={n.id} className="flex items-center gap-3 px-4 py-2.5">
                <Bell className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-foreground">{n.message}</p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground whitespace-nowrap">{n.time}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
