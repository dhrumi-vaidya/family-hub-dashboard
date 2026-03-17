import { AlertTriangle, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface Alert {
  id: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  ctaLabel?: string;
  ctaPath?: string;
}

interface AttentionLayerProps {
  alerts: Alert[];
  mode: 'simple' | 'fast';
}

const severityStyles = {
  critical: 'border-destructive/40 bg-destructive/10 text-destructive',
  warning: 'border-warning/40 bg-warning/10 text-warning',
  info: 'border-primary/30 bg-primary/10 text-primary',
};

export function AttentionLayer({ alerts, mode }: AttentionLayerProps) {
  if (alerts.length === 0) return null;

  if (mode === 'fast') {
    return (
      <div className="flex flex-wrap gap-2">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={cn(
              'flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium',
              severityStyles[alert.severity]
            )}
          >
            <AlertTriangle className="h-3 w-3 shrink-0" />
            <span>{alert.message}</span>
            {alert.ctaPath && (
              <a href={alert.ctaPath} className="underline underline-offset-2 hover:no-underline">
                {alert.ctaLabel ?? 'Fix'}
              </a>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <Card key={alert.id} className={cn('border', severityStyles[alert.severity])}>
          <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
              <p className="text-base font-medium">{alert.message}</p>
            </div>
            {alert.ctaPath && (
              <Button size="sm" variant="outline" className="shrink-0 gap-1" asChild>
                <a href={alert.ctaPath}>
                  {alert.ctaLabel ?? 'Take action'}
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
