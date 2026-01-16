import { 
  AlertTriangle, 
  AlertOctagon, 
  ShieldAlert, 
  Database,
  Eye,
  CheckCircle2,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type AlertSeverity = 'critical' | 'warning' | 'info';
type AlertCategory = 'policy' | 'abuse' | 'data_integrity';

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  category: AlertCategory;
  timestamp: string;
  affectedEntity: string;
}

interface AlertsActionPanelProps {
  alerts?: Alert[];
  isLoading?: boolean;
  onViewAlert?: (alert: Alert) => void;
  onResolveAlert?: (alert: Alert) => void;
  onDismissAlert?: (alert: Alert) => void;
}

const severityConfig = {
  critical: {
    label: 'Critical',
    icon: AlertOctagon,
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-400',
    badge: 'bg-red-500/20 text-red-300 border-red-500/30',
  },
  warning: {
    label: 'Warning',
    icon: AlertTriangle,
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  },
  info: {
    label: 'Info',
    icon: ShieldAlert,
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  },
};

const categoryConfig = {
  policy: {
    label: 'Policy Violation',
    icon: ShieldAlert,
  },
  abuse: {
    label: 'Abuse Report',
    icon: AlertOctagon,
  },
  data_integrity: {
    label: 'Data Integrity',
    icon: Database,
  },
};

const dummyAlerts: Alert[] = [
  {
    id: '1',
    title: 'Excessive Failed Login Attempts',
    description: 'Multiple failed login attempts detected from unusual IP ranges',
    severity: 'critical',
    category: 'abuse',
    timestamp: '5 min ago',
    affectedEntity: 'System-wide',
  },
  {
    id: '2',
    title: 'Data Export Rate Exceeded',
    description: 'Family exported data 3 times in 24 hours (limit: 1)',
    severity: 'warning',
    category: 'policy',
    timestamp: '1 hour ago',
    affectedEntity: 'Gupta Family',
  },
  {
    id: '3',
    title: 'Orphaned Records Detected',
    description: 'Database contains references to deleted family records',
    severity: 'info',
    category: 'data_integrity',
    timestamp: '2 hours ago',
    affectedEntity: 'Database',
  },
];

export function AlertsActionPanel({
  alerts = dummyAlerts,
  isLoading = false,
  onViewAlert,
  onResolveAlert,
  onDismissAlert,
}: AlertsActionPanelProps) {
  const hasAlerts = alerts.length > 0;
  const criticalCount = alerts.filter((a) => a.severity === 'critical').length;

  if (isLoading) {
    return (
      <Card className="border-slate-700/50 bg-slate-800/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-slate-200">Alerts & Action Required</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <div className="flex items-start gap-3">
                <Skeleton className="h-10 w-10 rounded-lg shrink-0 bg-slate-700" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4 bg-slate-700" />
                  <Skeleton className="h-3 w-full bg-slate-700" />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      'border transition-all',
      hasAlerts 
        ? criticalCount > 0 
          ? 'border-red-500/50 bg-red-500/5 shadow-lg shadow-red-500/10' 
          : 'border-amber-500/50 bg-amber-500/5'
        : 'border-slate-700/50 bg-slate-800/30'
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className={cn(
            'text-lg flex items-center gap-2',
            hasAlerts ? 'text-slate-100' : 'text-slate-200'
          )}>
            <AlertTriangle className={cn(
              'h-5 w-5',
              criticalCount > 0 ? 'text-red-400' : hasAlerts ? 'text-amber-400' : 'text-slate-400'
            )} />
            Alerts & Action Required
          </CardTitle>
          {hasAlerts && (
            <Badge 
              variant="outline" 
              className={cn(
                criticalCount > 0 
                  ? 'bg-red-500/20 text-red-300 border-red-500/30' 
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              )}
            >
              {alerts.length} {alerts.length === 1 ? 'alert' : 'alerts'}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!hasAlerts ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-emerald-400" />
            </div>
            <p className="text-slate-300 font-medium">No alerts</p>
            <p className="text-sm text-slate-500 mt-1">
              All systems are operating normally
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => {
              const severity = severityConfig[alert.severity];
              const category = categoryConfig[alert.category];
              const SeverityIcon = severity.icon;

              return (
                <div
                  key={alert.id}
                  className={cn(
                    'p-4 rounded-lg border transition-colors',
                    severity.bg,
                    severity.border
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center shrink-0', severity.bg)}>
                      <SeverityIcon className={cn('h-5 w-5', severity.text)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-slate-200">{alert.title}</p>
                          <p className="text-sm text-slate-400 mt-0.5">{alert.description}</p>
                        </div>
                        <Badge variant="outline" className={severity.badge}>
                          {severity.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                        <span>{category.label}</span>
                        <span>•</span>
                        <span>{alert.affectedEntity}</span>
                        <span>•</span>
                        <span>{alert.timestamp}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-slate-300 border-slate-600 hover:bg-slate-700"
                          onClick={() => onViewAlert?.(alert)}
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                          onClick={() => onResolveAlert?.(alert)}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                          Resolve
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-slate-400 hover:text-slate-200 hover:bg-slate-700"
                          onClick={() => onDismissAlert?.(alert)}
                        >
                          <X className="h-3.5 w-3.5 mr-1" />
                          Dismiss
                        </Button>
                      </div>
                    </div>
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
