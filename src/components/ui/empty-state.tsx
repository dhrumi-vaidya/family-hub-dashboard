import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getModeClasses } from '@/lib/design-tokens';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent } from '@/components/ui/card';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action, 
  className 
}: EmptyStateProps) {
  const { mode } = useApp();
  const classes = getModeClasses(mode);

  return (
    <Card className={cn('border-2 border-dashed animate-fade-in', className)}>
      <CardContent className={cn(
        'flex flex-col items-center justify-center text-center',
        classes.cardPadding,
        mode === 'simple' ? 'py-16' : 'py-12'
      )}>
        <div className={cn(
          'mb-4 rounded-full bg-muted p-3',
          mode === 'simple' ? 'p-4' : 'p-3'
        )}>
          <Icon className={cn(
            'text-muted-foreground',
            mode === 'simple' ? 'h-8 w-8' : 'h-6 w-6'
          )} />
        </div>
        <h3 className={cn(classes.h3, 'text-foreground mb-2')}>
          {title}
        </h3>
        <p className={cn(
          classes.body, 
          'text-muted-foreground mb-6 max-w-md'
        )}>
          {description}
        </p>
        {action && (
          <div className="flex flex-wrap gap-3 justify-center">
            {action}
          </div>
        )}
      </CardContent>
    </Card>
  );
}