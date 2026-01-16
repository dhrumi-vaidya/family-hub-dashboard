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
      <Card className="border-slate-700/50 bg-slate-800/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-slate-200">Users Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg bg-slate-700" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-12 bg-slate-700" />
                    <Skeleton className="h-3 w-20 bg-slate-700" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Skeleton className="h-10 w-full mt-4 bg-slate-700" />
        </CardContent>
      </Card>
    );
  }

  const totalUsers = stats.totalAdmins + stats.totalMembers;

  return (
    <Card className="border-slate-700/50 bg-slate-800/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-slate-200 flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-400" />
            Users Overview
          </CardTitle>
          <span className="text-sm text-slate-400">
            {totalUsers.toLocaleString()} total users
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {totalUsers === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="h-14 w-14 rounded-full bg-slate-700/50 flex items-center justify-center mb-3">
              <Users className="h-7 w-7 text-slate-500" />
            </div>
            <p className="text-slate-300 font-medium">No users yet</p>
            <p className="text-sm text-slate-500 mt-1">
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
                    'p-4 rounded-lg border transition-colors hover:bg-slate-800/70',
                    item.bgColor,
                    item.borderColor
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', item.bgColor)}>
                      <Icon className={cn('h-5 w-5', item.color)} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-100">{value.toLocaleString()}</p>
                      <p className="text-xs text-slate-400">{item.label}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Button
          variant="outline"
          className="w-full mt-4 text-blue-400 border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-300"
          onClick={onViewAllUsers}
        >
          View All Users
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
