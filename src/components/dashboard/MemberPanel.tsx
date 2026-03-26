import { Users, UserX, ArrowRight, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface MemberStatus {
  id: string;
  name: string;
  avatar: string;
  lastSeen?: string;
  isInactive: boolean;
  ignoringTasks: boolean;
}

interface MemberPanelProps {
  members: MemberStatus[];
  mode: 'simple' | 'fast';
}

export function MemberPanel({ members, mode }: MemberPanelProps) {
  const problematic = members.filter((m) => m.isInactive || m.ignoringTasks);

  if (mode === 'simple') {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium text-muted-foreground">Members</CardTitle>
            {problematic.length > 0 && (
              <Badge variant="destructive">{problematic.length} need attention</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {members.length === 0 ? (
            <p className="text-sm text-muted-foreground">No members added yet.</p>
          ) : problematic.length === 0 ? (
            <p className="text-sm text-muted-foreground">All members are active.</p>
          ) : (
            problematic.map((m) => (
              <div key={m.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                  {m.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{m.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {m.isInactive ? 'Inactive recently' : 'Ignoring assigned tasks'}
                  </p>
                </div>
                <UserX className="h-4 w-4 text-warning shrink-0" />
              </div>
            ))
          )}
          <Button variant="soft" className="w-full justify-between" asChild>
            <a href="/members">
              Manage members
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Fast mode — full list
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Members ({members.length})
          </CardTitle>
          <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" asChild>
            <a href="/members">Manage <ArrowRight className="h-3 w-3" /></a>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {members.length === 0 ? (
          <p className="px-4 py-3 text-sm text-muted-foreground">No members yet.</p>
        ) : (
          <div className="divide-y divide-border">
            {members.map((m) => (
              <div key={m.id} className="flex items-center gap-3 px-4 py-2.5">
                <div className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                  m.isInactive ? 'bg-muted text-muted-foreground' : 'bg-primary/15 text-primary'
                )}>
                  {m.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{m.name}</p>
                  {m.lastSeen && (
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {m.lastSeen}
                    </p>
                  )}
                </div>
                <div className="flex gap-1 shrink-0">
                  {m.isInactive && <Badge variant="secondary" className="text-xs">Inactive</Badge>}
                  {m.ignoringTasks && <Badge variant="destructive" className="text-xs">Ignoring tasks</Badge>}
                  {!m.isInactive && !m.ignoringTasks && (
                    <span className="h-2 w-2 rounded-full bg-success" title="Active" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
