import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface SystemKPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    label: string;
  };
  onClick?: () => void;
  isLoading?: boolean;
  variant?: 'default' | 'warning' | 'danger' | 'success';
}

export function SystemKPICard({
  title,
  value,
  icon: Icon,
  trend,
  onClick,
  isLoading = false,
  variant = 'default'
}: SystemKPICardProps) {
  const variantStyles = {
    default: {
      bg: 'bg-card',
      iconBg: 'bg-muted/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
      border: 'border-border',
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-950/20',
      iconBg: 'bg-amber-500/20',
      iconColor: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-500/20',
    },
    danger: {
      bg: 'bg-red-50 dark:bg-red-950/20',
      iconBg: 'bg-red-500/20',
      iconColor: 'text-red-600 dark:text-red-400',
      border: 'border-red-200 dark:border-red-500/20',
    },
    success: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/20',
      iconBg: 'bg-emerald-500/20',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-500/20',
    },
  };

  const styles = variantStyles[variant];

  if (isLoading) {
    return (
      <Card className={cn('border', styles.border, styles.bg)}>
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <Skeleton className="h-4 w-24 bg-muted" />
              <Skeleton className="h-8 w-16 bg-muted" />
              <Skeleton className="h-3 w-20 bg-muted" />
            </div>
            <Skeleton className="h-12 w-12 rounded-xl bg-muted" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={cn(
        'border transition-all duration-200 shadow-sm',
        styles.border,
        styles.bg,
        onClick && 'cursor-pointer hover:scale-[1.02] hover:shadow-md'
      )}
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
            {trend && (
              <div className="flex items-center gap-1.5 mt-2">
                {trend.direction === 'up' && (
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                )}
                {trend.direction === 'down' && (
                  <TrendingDown className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                )}
                {trend.direction === 'neutral' && (
                  <Minus className="h-3.5 w-3.5 text-muted-foreground" />
                )}
                <span className={cn(
                  'text-xs font-medium',
                  trend.direction === 'up' && 'text-emerald-600 dark:text-emerald-400',
                  trend.direction === 'down' && 'text-red-600 dark:text-red-400',
                  trend.direction === 'neutral' && 'text-muted-foreground',
                )}>
                  {trend.value > 0 ? '+' : ''}{trend.value}% {trend.label}
                </span>
              </div>
            )}
          </div>
          <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', styles.iconBg)}>
            <Icon className={cn('h-6 w-6', styles.iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SystemKPICardEmpty({ message }: { message: string }) {
  return (
    <Card className="border border-border bg-card">
      <CardContent className="p-5 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  );
}
