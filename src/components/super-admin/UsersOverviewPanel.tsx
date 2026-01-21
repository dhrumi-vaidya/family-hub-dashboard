import { Users, UserCog, Mail, UserX, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface UserStats {
  totalAdmins: number;
  totalMembers: number;
  pendingInvites: number;
  deactivatedUsers: number;
}

interface UsersOverviewPanelProps {
  stats?: UserStats;
  isLoading?: boolean;
  onViewAllUsers?: () => void;
}

const defaultStats: UserStats = {
  totalAdmins: 156,
  totalMembers: 892,
  pendingInvites: 23,
  deactivatedUsers: 45,
};

const statItems = [
  {
    key: 'totalAdmins' as const,
    label: 'Total Admins',
    icon: UserCog,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
  },
  {
    key: 'totalMembers' as const,
    label: 'Total Members',
    icon: Users,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
  },
  {
    key: 'pendingInvites' as const,
    label: 'Pending Invites',
    icon: Mail,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
  },
  {
    key: 'deactivatedUsers' as const,
    label: 'Deactivated',
    icon: UserX,
    color: 'text-slate-400',
    bgColor: 'bg-slate-500/10',
    borderColor: 'border-slate-500/20',
  },
];

export function UsersOverviewPanel({
  stats = defaultStats,
  isLoading = false,
  onViewAllUsers,
}: UsersOverviewPanelProps) {
  if (isLoading) {
    return (
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-foreground">Users Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 rounded-lg bg-muted/30 border border-border">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg bg-muted" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-12 bg-muted" />
                    <Skeleton className="h-3 w-20 bg-muted" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Skeleton className="h-10 w-full mt-4 bg-muted" />
        </CardContent>
      </Card>
    );
  }

  const totalUsers = stats.totalAdmins + stats.totalMembers;

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-foreground flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Users Overview
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            {totalUsers.toLocaleString()} total users
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {totalUsers === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-3">
              <Users className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="text-foreground font-medium">No users yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Users will appear when families register
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {statItems.map((item) => {
              const Icon = item.icon;
              const value = stats[item.key];

              return (
                <div
                  key={item.key}
                  className={cn(
                    'p-4 rounded-lg border transition-colors hover:bg-muted/50',
                    item.bgColor,
                    item.borderColor
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', item.bgColor)}>
                      <Icon className={cn('h-5 w-5', item.color)} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{value.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Button
          variant="outline"
          className="w-full mt-4 text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:border-blue-500/30 dark:hover:bg-blue-500/10 dark:hover:text-blue-300"
          onClick={onViewAllUsers}
        >
          View All Users
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
