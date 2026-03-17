import { AlertCircle, Wallet, Heart, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface KPIData {
  overdueTasks: number;
  budgetRiskPct: number;
  healthAlerts: number;
  inactiveMembers: number;
}

interface KPIStripProps {
  data: KPIData;
  mode: 'simple' | 'fast';
}

interface KPIItem {
  label: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  risk: boolean;
}

export function KPIStrip({ data, mode }: KPIStripProps) {
  const items: KPIItem[] = [
    {
      label: 'Overdue Tasks',
      value: data.overdueTasks,
      description: data.overdueTasks > 0 ? `${data.overdueTasks} task${data.overdueTasks > 1 ? 's' : ''} need attention` : 'All tasks on track',
      icon: AlertCircle,
      risk: data.overdueTasks > 0,
    },
    {
      label: 'Budget Risk',
      value: `${data.budgetRiskPct}%`,
      description: data.budgetRiskPct >= 80 ? 'Nearing monthly limit' : 'Spending within budget',
      icon: Wallet,
      risk: data.budgetRiskPct >= 80,
    },
    {
      label: 'Health Alerts',
      value: data.healthAlerts,
      description: data.healthAlerts > 0 ? 'Records need attention' : 'No urgent health alerts',
      icon: Heart,
      risk: data.healthAlerts > 0,
    },
    {
      label: 'Inactive Members',
      value: data.inactiveMembers,
      description: data.inactiveMembers > 0 ? 'Haven\'t been active recently' : 'All members active',
      icon: Users,
      risk: data.inactiveMembers > 0,
    },
  ];

  if (mode === 'fast') {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label} className={cn(item.risk && 'border-warning/40 bg-warning/5')}>
              <CardContent className="flex items-center gap-3 py-3">
                <Icon className={cn('h-4 w-4 shrink-0', item.risk ? 'text-warning' : 'text-muted-foreground')} />
                <div className="min-w-0">
                  <p className={cn('text-xl font-bold leading-none', item.risk ? 'text-warning' : 'text-foreground')}>
                    {item.value}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{item.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.label} className={cn(item.risk && 'border-warning/40 bg-warning/5')}>
            <CardContent className="flex items-start gap-4 py-5">
              <div className={cn('rounded-xl p-3', item.risk ? 'bg-warning/15' : 'bg-muted/50')}>
                <Icon className={cn('h-6 w-6', item.risk ? 'text-warning' : 'text-muted-foreground')} />
              </div>
              <div>
                <p className={cn('text-3xl font-bold', item.risk ? 'text-warning' : 'text-foreground')}>
                  {item.value}
                </p>
                <p className="mt-0.5 text-sm font-medium text-foreground">{item.label}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
