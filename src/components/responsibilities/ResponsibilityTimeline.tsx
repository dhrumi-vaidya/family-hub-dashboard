import { ResponsibilityCard, Responsibility } from './ResponsibilityCard';
import { cn } from '@/lib/utils';
import { useApp } from '@/contexts/AppContext';

interface ResponsibilityTimelineProps {
  responsibilities: Responsibility[];
  onConfirm: (id: number) => void;
  onViewDetails?: (id: number) => void;
  onEdit?: (id: number) => void;
  isAdmin?: boolean;
}

interface GroupedResponsibilities {
  overdue: Responsibility[];
  today: Responsibility[];
  upcoming: Responsibility[];
  completed: Responsibility[];
}

function groupResponsibilities(responsibilities: Responsibility[]): GroupedResponsibilities {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return responsibilities.reduce<GroupedResponsibilities>(
    (groups, resp) => {
      if (resp.status === 'confirmed') {
        groups.completed.push(resp);
      } else if (resp.status === 'overdue' || resp.status === 'escalated') {
        groups.overdue.push(resp);
      } else {
        // Parse date - assuming format like "5 Jan 2026"
        const dueDate = new Date(resp.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        
        if (dueDate.getTime() === today.getTime()) {
          groups.today.push(resp);
        } else if (dueDate < today) {
          groups.overdue.push(resp);
        } else {
          groups.upcoming.push(resp);
        }
      }
      return groups;
    },
    { overdue: [], today: [], upcoming: [], completed: [] }
  );
}

interface TimelineSectionProps {
  title: string;
  variant: 'overdue' | 'today' | 'upcoming' | 'completed';
  responsibilities: Responsibility[];
  onConfirm: (id: number) => void;
  onViewDetails?: (id: number) => void;
  onEdit?: (id: number) => void;
  isAdmin?: boolean;
  startIndex: number;
}

function TimelineSection({ 
  title, 
  variant,
  responsibilities, 
  onConfirm,
  onViewDetails,
  onEdit,
  isAdmin,
  startIndex
}: TimelineSectionProps) {
  const { mode } = useApp();
  
  if (responsibilities.length === 0) return null;

  const variantStyles = {
    overdue: 'border-destructive/30 bg-destructive-light/50',
    today: 'border-primary/30 bg-primary/5',
    upcoming: 'border-muted-foreground/20 bg-muted/30',
    completed: 'border-success/30 bg-success-light/50',
  };

  const titleStyles = {
    overdue: 'text-destructive',
    today: 'text-primary',
    upcoming: 'text-muted-foreground',
    completed: 'text-success',
  };

  return (
    <div className={cn(
      "rounded-xl border-l-4 p-4",
      variantStyles[variant],
      mode === 'simple' ? 'p-5' : 'p-4'
    )}>
      <h2 className={cn(
        "mb-4 font-semibold",
        titleStyles[variant],
        mode === 'simple' ? 'text-lg' : 'text-base'
      )}>
        {title} ({responsibilities.length})
      </h2>
      <div className="space-y-3">
        {responsibilities.map((resp, index) => (
          <ResponsibilityCard
            key={resp.id}
            responsibility={resp}
            onConfirm={onConfirm}
            onViewDetails={onViewDetails}
            onEdit={onEdit}
            isAdmin={isAdmin}
            delay={startIndex + index}
          />
        ))}
      </div>
    </div>
  );
}

export function ResponsibilityTimeline({ 
  responsibilities,
  onConfirm,
  onViewDetails,
  onEdit,
  isAdmin = false
}: ResponsibilityTimelineProps) {
  const groups = groupResponsibilities(responsibilities);
  
  let runningIndex = 0;

  return (
    <div className="space-y-6">
      <TimelineSection
        title="Overdue"
        variant="overdue"
        responsibilities={groups.overdue}
        onConfirm={onConfirm}
        onViewDetails={onViewDetails}
        onEdit={onEdit}
        isAdmin={isAdmin}
        startIndex={(runningIndex += 0, runningIndex)}
      />
      
      <TimelineSection
        title="Today"
        variant="today"
        responsibilities={groups.today}
        onConfirm={onConfirm}
        onViewDetails={onViewDetails}
        onEdit={onEdit}
        isAdmin={isAdmin}
        startIndex={(runningIndex += groups.overdue.length, runningIndex)}
      />
      
      <TimelineSection
        title="Upcoming"
        variant="upcoming"
        responsibilities={groups.upcoming}
        onConfirm={onConfirm}
        onViewDetails={onViewDetails}
        onEdit={onEdit}
        isAdmin={isAdmin}
        startIndex={(runningIndex += groups.today.length, runningIndex)}
      />
      
      <TimelineSection
        title="Completed"
        variant="completed"
        responsibilities={groups.completed}
        onConfirm={onConfirm}
        onViewDetails={onViewDetails}
        onEdit={onEdit}
        isAdmin={isAdmin}
        startIndex={(runningIndex += groups.upcoming.length, runningIndex)}
      />
    </div>
  );
}
