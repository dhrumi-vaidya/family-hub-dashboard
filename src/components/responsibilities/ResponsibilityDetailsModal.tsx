import { Clock, CheckCircle2, AlertTriangle, User, Calendar, RotateCcw, History } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Responsibility } from './ResponsibilityCard';

interface ResponsibilityDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  responsibility: Responsibility | null;
}

const statusConfig = {
  pending: { 
    label: 'Pending', 
    icon: Clock, 
    color: 'bg-warning-light text-warning-foreground'
  },
  confirmed: { 
    label: 'Confirmed', 
    icon: CheckCircle2, 
    color: 'bg-success-light text-success'
  },
  overdue: { 
    label: 'Overdue', 
    icon: AlertTriangle, 
    color: 'bg-destructive-light text-destructive'
  },
  escalated: { 
    label: 'Escalated', 
    icon: AlertTriangle, 
    color: 'bg-destructive-light text-destructive'
  },
};

const recurrenceLabels = {
  once: 'One-time',
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
};

// Mock audit history
const mockHistory = [
  { action: 'Created', by: 'Rajesh Sharma', date: '3 Jan 2026, 10:00 AM' },
  { action: 'Reminder sent', by: 'System', date: '5 Jan 2026, 8:00 AM' },
  { action: 'Confirmed', by: 'Vikram Sharma', date: '5 Jan 2026, 9:30 AM' },
];

export function ResponsibilityDetailsModal({ 
  open, 
  onOpenChange, 
  responsibility 
}: ResponsibilityDetailsModalProps) {
  if (!responsibility) return null;

  const config = statusConfig[responsibility.status];
  const StatusIcon = config.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={cn(
              'flex h-10 w-10 items-center justify-center rounded-lg',
              config.color
            )}>
              <StatusIcon className="h-5 w-5" />
            </div>
            {responsibility.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status Badge */}
          <Badge className={cn('text-sm', config.color)}>
            {config.label}
          </Badge>

          {/* Details Grid */}
          <div className="grid gap-4 rounded-lg bg-muted/50 p-4">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Assigned to</p>
                <p className="font-medium">{responsibility.assignee}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Due date</p>
                <p className="font-medium">{responsibility.dueDate}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <RotateCcw className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Schedule</p>
                <p className="font-medium">{recurrenceLabels[responsibility.recurrence]}</p>
              </div>
            </div>

            {responsibility.escalatedTo && (
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <div>
                  <p className="text-sm text-muted-foreground">Escalated to</p>
                  <p className="font-medium text-destructive">{responsibility.escalatedTo}</p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Audit History */}
          <div>
            <h4 className="mb-3 flex items-center gap-2 font-semibold">
              <History className="h-4 w-4" />
              Activity History
            </h4>
            <div className="space-y-3">
              {mockHistory.map((item, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 rounded-lg border p-3"
                >
                  <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                  <div className="flex-1">
                    <p className="font-medium">{item.action}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.by} • {item.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
