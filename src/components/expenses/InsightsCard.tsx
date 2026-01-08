import { Lightbulb, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Insight {
  type: 'info' | 'warning' | 'success';
  message: string;
}

interface InsightsCardProps {
  insights: Insight[];
  showHelper?: boolean;
  compact?: boolean;
}

const insightStyles: Record<string, { bg: string; icon: React.ElementType; iconColor: string }> = {
  info: { bg: 'bg-accent/10', icon: TrendingUp, iconColor: 'text-accent' },
  warning: { bg: 'bg-warning/10', icon: AlertTriangle, iconColor: 'text-warning' },
  success: { bg: 'bg-success/10', icon: TrendingDown, iconColor: 'text-success' },
};

export function InsightsCard({ insights, showHelper = false, compact = false }: InsightsCardProps) {
  return (
    <Card className={cn(compact && 'shadow-sm')}>
      <CardHeader className={cn('pb-3', compact && 'pb-2')}>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className={cn('text-accent', compact ? 'h-4 w-4' : 'h-5 w-5')} />
          <span className={compact ? 'text-base' : 'text-lg'}>Spending Insights</span>
        </CardTitle>
      </CardHeader>
      <CardContent className={cn('space-y-3', compact && 'space-y-2')}>
        {insights.map((insight, index) => {
          const style = insightStyles[insight.type] || insightStyles.info;
          const Icon = style.icon;
          
          return (
            <div
              key={index}
              className={cn(
                'flex items-start gap-3 rounded-lg p-3',
                style.bg,
                compact && 'p-2.5'
              )}
            >
              <Icon className={cn('mt-0.5 shrink-0', style.iconColor, compact ? 'h-4 w-4' : 'h-5 w-5')} />
              <p className={cn('font-medium text-foreground', compact ? 'text-sm' : 'text-base')}>
                {insight.message}
              </p>
            </div>
          );
        })}
        
        {showHelper && (
          <p className="pt-2 text-sm text-muted-foreground">
            These insights are based on your spending patterns and budget limits.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
