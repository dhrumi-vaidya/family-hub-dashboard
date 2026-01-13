import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { getModeClasses } from '@/lib/design-tokens';
import { useApp } from '@/contexts/AppContext';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, action, className }: PageHeaderProps) {
  const { mode } = useApp();
  const classes = getModeClasses(mode);

  return (
    <div className={cn('flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between', className)}>
      <div className="space-y-1">
        <h1 className={cn(classes.h1, 'text-foreground')}>
          {title}
        </h1>
        {subtitle && (
          <p className={cn(classes.body, 'text-muted-foreground')}>
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <div className="flex-shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}