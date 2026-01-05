import { ReactNode } from 'react';
import { ArrowRight, LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  icon: LucideIcon;
  iconColor?: string;
  children: ReactNode;
  ctaLabel: string;
  ctaPath: string;
  className?: string;
  delay?: number;
}

export function StatCard({
  title,
  icon: Icon,
  iconColor = 'text-primary',
  children,
  ctaLabel,
  ctaPath,
  className,
  delay = 0,
}: StatCardProps) {
  return (
    <Card
      hover
      className={cn(
        'animate-fade-in opacity-0 flex flex-col',
        className
      )}
      style={{ animationDelay: `${delay * 0.1}s` }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className={cn('rounded-lg bg-primary-light p-2', iconColor)}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <div className="flex-1 space-y-3">{children}</div>
        <Button
          variant="soft"
          className="mt-4 w-full justify-between"
          asChild
        >
          <a href={ctaPath}>
            {ctaLabel}
            <ArrowRight className="h-4 w-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
