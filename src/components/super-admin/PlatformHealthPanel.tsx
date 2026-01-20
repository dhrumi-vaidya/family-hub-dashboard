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
      <Card className="border-slate-700/50 bg-slate-800/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-slate-200">Platform Health & Risk</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg bg-slate-700" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32 bg-slate-700" />
                  <Skeleton className="h-3 w-48 bg-slate-700" />
                </div>
              </div>
              <Skeleton className="h-6 w-16 rounded-full bg-slate-700" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <Card className="border-slate-700/50 bg-slate-800/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-slate-200">Platform Health & Risk</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-emerald-400" />
            </div>
            <p className="text-slate-300 font-medium">All systems healthy</p>
            <p className="text-sm text-slate-500 mt-1">No issues detected across the platform</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-700/50 bg-slate-800/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-slate-200">Platform Health & Risk</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs bg-slate-700/50 text-slate-400 border-slate-600">
              Low
            </Badge>
            <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-400 border-amber-500/30">
              Medium
            </Badge>
            <Badge variant="outline" className="text-xs bg-red-500/10 text-red-400 border-red-500/30">
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
                'flex items-center justify-between p-4 rounded-lg border transition-colors',
                colors.bg,
                colors.border,
                'hover:bg-opacity-20'
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', colors.bg)}>
                  <Icon className={cn('h-5 w-5', colors.text)} />
                </div>
                <div>
                  <p className="font-medium text-slate-200">{item.title}</p>
                  <p className="text-sm text-slate-400">{item.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className={colors.badge}>
                  {item.count} {item.count === 1 ? 'issue' : 'issues'}
                </Badge>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-slate-400 hover:text-slate-200 hover:bg-slate-700"
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
