import { 
  Building2, 
  UserCog, 
  Shield, 
  Download, 
  Clock,
  Settings,
  UserPlus,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

type ActivityType = 
  | 'family_created' 
  | 'admin_transferred' 
  | 'emergency_access' 
  | 'data_export'
  | 'settings_changed'
  | 'member_added'
  | 'policy_violation';

interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  actor: 'system' | string;
  affectedEntity: string;
  timestamp: string;
}

interface SystemActivityFeedProps {
  activities?: ActivityItem[];
  isLoading?: boolean;
  onViewAll?: () => void;
}

const activityConfig: Record<ActivityType, {
  icon: typeof Building2;
  color: string;
  bgColor: string;
}> = {
  family_created: {
    icon: Building2,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
  },
  admin_transferred: {
    icon: UserCog,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
  },
  emergency_access: {
    icon: Shield,
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
  },
  data_export: {
    icon: Download,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
  },
  settings_changed: {
    icon: Settings,
    color: 'text-slate-400',
    bgColor: 'bg-slate-500/10',
  },
  member_added: {
    icon: UserPlus,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
  },
  policy_violation: {
    icon: AlertCircle,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
  },
};

const dummyActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'family_created',
    title: 'New Family Registered',
    description: 'Kumar Family joined the platform',
    actor: 'system',
    affectedEntity: 'Kumar Family',
    timestamp: '2 min ago',
  },
  {
    id: '2',
    type: 'emergency_access',
    title: 'Emergency Access Granted',
    description: 'Health records accessed via emergency protocol',
    actor: 'Dr. Sharma',
    affectedEntity: 'Verma Family',
    timestamp: '15 min ago',
  },
  {
    id: '3',
    type: 'admin_transferred',
    title: 'Admin Role Transferred',
    description: 'Family admin role changed',
    actor: 'Rahul Sharma',
    affectedEntity: 'Sharma Family',
    timestamp: '1 hour ago',
  },
  {
    id: '4',
    type: 'data_export',
    title: 'Data Export Triggered',
    description: 'Full family data exported',
    actor: 'Priya Gupta',
    affectedEntity: 'Gupta Family',
    timestamp: '2 hours ago',
  },
  {
    id: '5',
    type: 'member_added',
    title: 'New Member Added',
    description: 'Family member invitation accepted',
    actor: 'system',
    affectedEntity: 'Patel Family',
    timestamp: '3 hours ago',
  },
  {
    id: '6',
    type: 'policy_violation',
    title: 'Policy Violation Detected',
    description: 'Budget threshold exceeded significantly',
    actor: 'system',
    affectedEntity: 'Singh Family',
    timestamp: '4 hours ago',
  },
];

export function SystemActivityFeed({
  activities = dummyActivities,
  isLoading = false,
  onViewAll,
}: SystemActivityFeedProps) {
  if (isLoading) {
    return (
      <Card className="border-slate-700/50 bg-slate-800/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-slate-200">System Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="h-9 w-9 rounded-lg shrink-0 bg-slate-700" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4 bg-slate-700" />
                  <Skeleton className="h-3 w-1/2 bg-slate-700" />
                </div>
                <Skeleton className="h-3 w-16 bg-slate-700" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (activities.length === 0) {
    return (
      <Card className="border-slate-700/50 bg-slate-800/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-slate-200 flex items-center gap-2">
            <Clock className="h-5 w-5 text-slate-400" />
            System Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-16 w-16 rounded-full bg-slate-700/50 flex items-center justify-center mb-4">
              <Clock className="h-8 w-8 text-slate-500" />
            </div>
            <p className="text-slate-300 font-medium">No recent activity</p>
            <p className="text-sm text-slate-500 mt-1">
              System events will appear here as they occur
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-700/50 bg-slate-800/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-slate-200 flex items-center gap-2">
          <Clock className="h-5 w-5 text-slate-400" />
          System Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="p-4 pt-0 space-y-1">
            {activities.map((activity, index) => {
              const config = activityConfig[activity.type];
              const Icon = config.icon;

              return (
                <div
                  key={activity.id}
                  className={cn(
                    'relative flex items-start gap-3 p-3 rounded-lg hover:bg-slate-800/50 transition-colors',
                    index !== activities.length - 1 && 'border-b border-slate-700/30'
                  )}
                >
                  {/* Timeline connector */}
                  {index !== activities.length - 1 && (
                    <div className="absolute left-[26px] top-[52px] w-0.5 h-[calc(100%-20px)] bg-slate-700/50" />
                  )}
                  
                  <div className={cn('h-9 w-9 rounded-lg flex items-center justify-center shrink-0 relative z-10', config.bgColor)}>
                    <Icon className={cn('h-4 w-4', config.color)} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-sm text-slate-200">{activity.title}</p>
                        <p className="text-sm text-slate-400 mt-0.5">{activity.description}</p>
                      </div>
                      <span className="text-xs text-slate-500 whitespace-nowrap">{activity.timestamp}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs bg-slate-800 text-slate-400 border-slate-600">
                        {activity.actor === 'system' ? '🤖 System' : `👤 ${activity.actor}`}
                      </Badge>
                      <Badge variant="outline" className="text-xs bg-slate-800 text-slate-400 border-slate-600">
                        📁 {activity.affectedEntity}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-slate-700/50">
          <Button
            variant="outline"
            className="w-full text-slate-400 border-slate-600 hover:bg-slate-800 hover:text-slate-200"
            onClick={onViewAll}
          >
            View Full Activity Log
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
