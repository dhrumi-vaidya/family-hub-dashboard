import { ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Lock, FileX, WifiOff } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  variant?: 'card' | 'list' | 'table' | 'timeline';
  count?: number;
  className?: string;
}

export function LoadingSkeleton({ variant = 'card', count = 3, className }: LoadingSkeletonProps) {
  if (variant === 'card') {
    return (
      <div className={cn('grid gap-4 md:grid-cols-2 lg:grid-cols-3', className)}>
        {Array.from({ length: count }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="py-6 space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
              <Skeleton className="h-8 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className={cn('space-y-3', className)}>
        {Array.from({ length: count }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="py-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (variant === 'timeline') {
    return (
      <div className={cn('space-y-4', className)}>
        <Skeleton className="h-6 w-24" />
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="relative pl-8">
            <Skeleton className="absolute left-0 top-2 h-4 w-4 rounded-full" />
            <Card className="animate-pulse">
              <CardContent className="py-5">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-14 w-14 rounded-xl" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-2/5" />
                    <Skeleton className="h-4 w-3/5" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-9 w-20" />
                    <Skeleton className="h-9 w-9" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <Card className={cn('animate-pulse', className)}>
        <CardContent className="py-4">
          <div className="space-y-3">
            <div className="flex gap-4 border-b border-border pb-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-4 flex-1" />
              ))}
            </div>
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="flex gap-4 py-2">
                {Array.from({ length: 4 }).map((_, j) => (
                  <Skeleton key={j} className="h-4 flex-1" />
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  variant?: 'network' | 'permission' | 'notfound' | 'generic';
  className?: string;
}

export function ErrorState({ 
  title, 
  message, 
  onRetry, 
  variant = 'generic',
  className 
}: ErrorStateProps) {
  const configs = {
    network: {
      icon: WifiOff,
      defaultTitle: 'Connection Failed',
      defaultMessage: 'Unable to connect. Please check your internet connection and try again.',
      iconColor: 'text-muted-foreground',
      bgColor: 'bg-muted/50',
    },
    permission: {
      icon: Lock,
      defaultTitle: 'Access Denied',
      defaultMessage: 'You don\'t have permission to view this content. Contact a family admin for access.',
      iconColor: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    notfound: {
      icon: FileX,
      defaultTitle: 'Not Found',
      defaultMessage: 'The requested content could not be found. It may have been removed or moved.',
      iconColor: 'text-muted-foreground',
      bgColor: 'bg-muted/50',
    },
    generic: {
      icon: AlertTriangle,
      defaultTitle: 'Something Went Wrong',
      defaultMessage: 'An unexpected error occurred. Please try again.',
      iconColor: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
  };

  const config = configs[variant];
  const Icon = config.icon;

  return (
    <Card className={cn('animate-fade-in', className)}>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className={cn(
          'flex h-16 w-16 items-center justify-center rounded-full mb-4',
          config.bgColor
        )}>
          <Icon className={cn('h-8 w-8', config.iconColor)} />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {title || config.defaultTitle}
        </h3>
        <p className="text-muted-foreground max-w-md mb-6">
          {message || config.defaultMessage}
        </p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

interface RestrictedStateProps {
  reason?: string;
  className?: string;
}

export function RestrictedState({ reason, className }: RestrictedStateProps) {
  return (
    <Card className={cn('border-warning/30 bg-warning/5 animate-fade-in', className)}>
      <CardContent className="flex flex-col items-center justify-center py-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-warning/10 mb-4">
          <Lock className="h-7 w-7 text-warning" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          View Only
        </h3>
        <p className="text-muted-foreground max-w-sm">
          {reason || 'You can view this content but cannot make changes. Contact a family admin if you need edit access.'}
        </p>
      </CardContent>
    </Card>
  );
}

interface FeedbackBannerProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export function FeedbackBanner({ type, message, onDismiss, className }: FeedbackBannerProps) {
  const styles = {
    success: 'border-success/30 bg-success/10 text-success',
    error: 'border-destructive/30 bg-destructive/10 text-destructive',
    warning: 'border-warning/30 bg-warning/10 text-warning',
    info: 'border-primary/30 bg-primary/10 text-primary',
  };

  return (
    <div className={cn(
      'flex items-center justify-between gap-3 rounded-xl border p-4 animate-fade-in',
      styles[type],
      className
    )}>
      <p className="text-sm font-medium">{message}</p>
      {onDismiss && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onDismiss}
          className="shrink-0 h-7 px-2 text-current hover:bg-current/10"
        >
          Dismiss
        </Button>
      )}
    </div>
  );
}

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'soft';
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  action, 
  secondaryAction,
  className 
}: EmptyStateProps) {
  return (
    <Card className={cn('animate-fade-in', className)}>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 mb-4">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground max-w-sm mb-6">{description}</p>
        <div className="flex flex-wrap gap-3 justify-center">
          {action && (
            <Button 
              variant={action.variant || 'default'} 
              onClick={action.onClick}
              size="lg"
            >
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="outline" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface DisabledActionTooltipProps {
  reason: string;
  children: ReactNode;
}

export function DisabledActionWrapper({ reason, children }: DisabledActionTooltipProps) {
  return (
    <div className="relative group">
      <div className="opacity-50 pointer-events-none">
        {children}
      </div>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-foreground text-background text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
        {reason}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-foreground" />
      </div>
    </div>
  );
}

interface FormFooterProps {
  onCancel: () => void;
  onSubmit?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  isSubmitting?: boolean;
  isDirty?: boolean;
  submitDisabledReason?: string;
  destructive?: boolean;
}

export function FormFooter({
  onCancel,
  onSubmit,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  isSubmitting = false,
  isDirty = true,
  submitDisabledReason,
  destructive = false,
}: FormFooterProps) {
  const submitDisabled = !isDirty || isSubmitting;

  return (
    <div className="flex justify-end gap-3 pt-4 border-t border-border">
      <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
        {cancelLabel}
      </Button>
      {submitDisabledReason && submitDisabled ? (
        <DisabledActionWrapper reason={submitDisabledReason}>
          <Button 
            variant={destructive ? 'destructive' : 'default'}
            disabled
          >
            {submitLabel}
          </Button>
        </DisabledActionWrapper>
      ) : (
        <Button 
          variant={destructive ? 'destructive' : 'default'}
          onClick={onSubmit}
          disabled={submitDisabled}
        >
          {isSubmitting ? 'Saving...' : submitLabel}
        </Button>
      )}
    </div>
  );
}
