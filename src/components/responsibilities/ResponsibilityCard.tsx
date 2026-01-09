import { Clock, CheckCircle2, AlertTriangle, RotateCcw, User, Eye, Edit } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useApp } from '@/contexts/AppContext';

export interface Responsibility {
  id: number;
  title: string;
  assignee: string;
  status: 'pending' | 'confirmed' | 'overdue' | 'escalated';
  recurrence: 'once' | 'daily' | 'weekly' | 'monthly';
  dueDate: string;
  confirmedAt?: string;
  confirmedBy?: string;
  escalatedTo?: string;
}

interface ResponsibilityCardProps {
  responsibility: Responsibility;
  onConfirm: (id: number) => void;
  onViewDetails?: (id: number) => void;
  onEdit?: (id: number) => void;
  isAdmin?: boolean;
  delay?: number;
}

const statusConfig = {
  pending: { 
    label: 'Pending', 
    icon: Clock, 
    bgColor: 'bg-warning-light',
    textColor: 'text-warning',
    badgeColor: 'bg-warning-light text-warning-foreground'
  },
  confirmed: { 
    label: 'Confirmed', 
    icon: CheckCircle2, 
    bgColor: 'bg-success-light',
    textColor: 'text-success',
    badgeColor: 'bg-success-light text-success'
  },
  overdue: { 
    label: 'Overdue', 
    icon: AlertTriangle, 
    bgColor: 'bg-destructive-light',
    textColor: 'text-destructive',
    badgeColor: 'bg-destructive-light text-destructive'
  },
  escalated: { 
    label: 'Escalated', 
    icon: AlertTriangle, 
    bgColor: 'bg-destructive-light',
    textColor: 'text-destructive',
    badgeColor: 'bg-destructive-light text-destructive'
  },
};

const recurrenceLabels = {
  once: 'One-time',
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
};

export function ResponsibilityCard({ 
  responsibility, 
  onConfirm, 
  onViewDetails, 
  onEdit,
  isAdmin = false,
  delay = 0 
}: ResponsibilityCardProps) {
  const { mode } = useApp();
  const config = statusConfig[responsibility.status];
  const StatusIcon = config.icon;

  return (
    <Card
      hover
      className="animate-fade-in opacity-0"
      style={{ animationDelay: `${delay * 0.1}s` }}
    >
      <CardContent className={cn(
        "flex flex-col gap-4 py-4",
        mode === 'simple' ? 'py-5' : 'py-4'
      )}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className={cn(
              'flex h-12 w-12 items-center justify-center rounded-xl',
              config.bgColor
            )}>
              <StatusIcon className={cn('h-6 w-6', config.textColor)} />
            </div>
            <div className="flex-1">
              <h3 className={cn(
                "font-semibold text-foreground",
                mode === 'simple' ? 'text-lg' : 'text-base'
              )}>
                {responsibility.title}
              </h3>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  <span className="font-medium text-foreground">{responsibility.assignee}</span>
                </span>
                <span>Due: {responsibility.dueDate}</span>
              </div>
              {responsibility.status === 'escalated' && responsibility.escalatedTo && (
                <p className="mt-1 text-sm text-destructive">
                  Escalated to: {responsibility.escalatedTo}
                </p>
              )}
              {responsibility.status === 'confirmed' && responsibility.confirmedAt && (
                <p className="mt-1 text-sm text-success">
                  Confirmed on {responsibility.confirmedAt}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
            <Badge variant="secondary" className="gap-1.5 whitespace-nowrap">
              <RotateCcw className="h-3 w-3" />
              {recurrenceLabels[responsibility.recurrence]}
            </Badge>
            <Badge className={cn('whitespace-nowrap', config.badgeColor)}>
              {config.label}
            </Badge>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 border-t pt-3">
          {responsibility.status === 'pending' && (
            <Button 
              onClick={() => onConfirm(responsibility.id)}
              className={cn(
                "gap-2",
                mode === 'simple' ? 'h-11 px-6 text-base' : 'h-9'
              )}
            >
              <CheckCircle2 className="h-4 w-4" />
              Confirm done
            </Button>
          )}
          
          {isAdmin && onViewDetails && (
            <Button 
              variant="outline" 
              onClick={() => onViewDetails(responsibility.id)}
              className="gap-2"
            >
              <Eye className="h-4 w-4" />
              View details
            </Button>
          )}
          
          {isAdmin && onEdit && responsibility.status !== 'confirmed' && (
            <Button 
              variant="ghost" 
              onClick={() => onEdit(responsibility.id)}
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
