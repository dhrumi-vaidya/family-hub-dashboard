import { Heart, Upload, AlertTriangle, CheckCircle2, ArrowRight, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface HealthMemberStatus {
  member: string;
  lastUpload?: string;
  hasExpiring: boolean;
  missingCritical: boolean;
}

interface HealthPanelProps {
  members: HealthMemberStatus[];
  mode: 'simple' | 'fast';
}

export function HealthPanel({ members, mode }: HealthPanelProps) {
  const critical = members.filter((m) => m.hasExpiring || m.missingCritical);

  if (mode === 'simple') {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium text-muted-foreground">Health Records</CardTitle>
            {critical.length > 0 && (
              <Badge variant="destructive">{critical.length} alert{critical.length > 1 ? 's' : ''}</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {members.length === 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">No health records uploaded yet.</p>
              <Button className="w-full gap-2" asChild>
                <a href="/health">
                  <Upload className="h-4 w-4" />
                  Upload First Record
                </a>
              </Button>
            </div>
          ) : critical.length === 0 ? (
            <div className="flex items-center gap-3 rounded-lg bg-success/10 p-4">
              <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
              <p className="text-sm text-foreground">All health records are up to date.</p>
            </div>
          ) : (
            critical.map((m) => (
              <div key={m.member} className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive shrink-0" />
                  <div>
                    <p className="text-base font-medium text-foreground">{m.member}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {m.hasExpiring ? 'Prescription expiring soon.' : 'Missing critical health record.'}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
          <Button variant="soft" className="w-full justify-between" asChild>
            <a href="/health">
              View health records
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Fast mode — table layout
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">Health Records</CardTitle>
          <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" asChild>
            <a href="/health">View all <ArrowRight className="h-3 w-3" /></a>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {members.length === 0 ? (
          <p className="px-4 py-3 text-sm text-muted-foreground">No health records yet.</p>
        ) : (
          <div className="divide-y divide-border">
            {members.map((m) => (
              <div key={m.member} className="flex items-center gap-3 px-4 py-2.5">
                <Heart className={cn(
                  'h-4 w-4 shrink-0',
                  m.hasExpiring || m.missingCritical ? 'text-destructive' : 'text-success'
                )} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{m.member}</p>
                  {m.lastUpload && (
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {m.lastUpload}
                    </p>
                  )}
                </div>
                <div className="flex gap-1.5 shrink-0">
                  {m.hasExpiring && <Badge variant="destructive" className="text-xs">Expiring</Badge>}
                  {m.missingCritical && <Badge variant="destructive" className="text-xs">Missing</Badge>}
                  {!m.hasExpiring && !m.missingCritical && <Badge variant="secondary" className="text-xs">OK</Badge>}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
