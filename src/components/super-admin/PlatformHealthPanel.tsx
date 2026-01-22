import { AlertTriangle, DollarSign, Clock, Shield, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface HealthItem {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  count: number;
  category: 'budget' | 'responsibility' | 'emergency' | 'suspicious';
}

interface PlatformHealthPanelProps {
  items?: HealthItem[];
  isLoading?: boolean;
  onViewDetails?: (item: HealthItem) => void;
}

const severityColors = {
  low: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  },
  medium: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  },
  high: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-400',
    badge: 'bg-red-500/20 text-red-300 border-red-500/30',
  },
};

const categoryIcons = {
  budget: DollarSign,
  responsibility: Clock,
  emergency: Shield,
  suspicious: AlertTriangle,
};

const dummyHealthItems: HealthItem[] = [
  {
    id: '1',
    title: 'Budget Overruns',
    description: '12 families exceeded monthly budget by >20%',
    severity: 'high',
    count: 12,
    category: 'budget',
  },
  {
    id: '2',
    title: 'Overdue Responsibilities',
    description: '45 tasks overdue across 18 families',
    severity: 'medium',
    count: 45,
    category: 'responsibility',
  },
  {
    id: '3',
    title: 'Emergency Access Used',
    description: '3 emergency health record accesses this week',
    severity: 'medium',
    count: 3,
    category: 'emergency',
  },
  {
    id: '4',
    title: 'Suspicious Activity',
    description: '2 unusual login patterns detected',
    severity: 'low',
    count: 2,
    category: 'suspicious',
  },
];

export function PlatformHealthPanel({ 
  items = dummyHealthItems, 
  isLoading = false,
  onViewDetails 
}: PlatformHealthPanelProps) {
  if (isLoading) {
    return (
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-foreground">Platform Health & Risk</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 min-w-0">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <Skeleton className="h-10 w-10 rounded-lg bg-muted shrink-0" />
                <div className="space-y-2 min-w-0 flex-1">
                  <Skeleton className="h-4 w-32 bg-muted" />
                  <Skeleton className="h-3 w-48 bg-muted" />
                </div>
              </div>
              <Skeleton className="h-6 w-16 rounded-full bg-muted shrink-0" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-foreground">Platform Health & Risk</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-foreground font-medium">All systems healthy</p>
            <p className="text-sm text-muted-foreground mt-1">No issues detected across the platform</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-foreground">Platform Health & Risk</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs bg-muted text-muted-foreground border-border">
              Low
            </Badge>
            <Badge variant="outline" className="text-xs bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900 dark:text-amber-200 dark:border-amber-500/30">
              Medium
            </Badge>
            <Badge variant="outline" className="text-xs bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-500/30">
              High
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => {
          const colors = severityColors[item.severity];
          const Icon = categoryIcons[item.category];
          
          return (
            <div
              key={item.id}
              className={cn(
                'flex items-center justify-between p-4 rounded-lg border transition-colors min-w-0',
                colors.bg,
                colors.border,
                'hover:bg-opacity-20'
              )}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center shrink-0', colors.bg)}>
                  <Icon className={cn('h-5 w-5', colors.text)} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground truncate">{item.title}</p>
                  <p className="text-sm text-muted-foreground truncate">{item.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Badge variant="outline" className={colors.badge}>
                  {item.count} {item.count === 1 ? 'issue' : 'issues'}
                </Badge>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-muted-foreground hover:text-foreground hover:bg-muted"
                  onClick={() => onViewDetails?.(item)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
