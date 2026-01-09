import { useState } from 'react';
import { Plus, Clock, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { Hint } from '@/components/onboarding/Hint';
import { cn } from '@/lib/utils';
import { ResponsibilityTimeline } from '@/components/responsibilities/ResponsibilityTimeline';
import { GuidedCreateResponsibility, ResponsibilityFormData } from '@/components/responsibilities/GuidedCreateResponsibility';
import { QuickCreateResponsibility } from '@/components/responsibilities/QuickCreateResponsibility';
import { EmptyResponsibilities } from '@/components/responsibilities/EmptyResponsibilities';
import { ResponsibilityDetailsModal } from '@/components/responsibilities/ResponsibilityDetailsModal';
import { Responsibility } from '@/components/responsibilities/ResponsibilityCard';
import { toast } from 'sonner';

const initialResponsibilities: Responsibility[] = [
  {
    id: 1,
    title: 'Pay electricity bill',
    assignee: 'Vikram Sharma',
    status: 'pending',
    recurrence: 'monthly',
    dueDate: '9 Jan 2026',
  },
  {
    id: 2,
    title: 'School fees payment',
    assignee: 'Rajesh Sharma',
    status: 'escalated',
    recurrence: 'monthly',
    dueDate: '5 Jan 2026',
    escalatedTo: 'Anita Sharma',
  },
  {
    id: 3,
    title: 'Weekly groceries',
    assignee: 'Anita Sharma',
    status: 'confirmed',
    recurrence: 'weekly',
    dueDate: '8 Jan 2026',
    confirmedAt: '8 Jan 2026, 10:30 AM',
    confirmedBy: 'Anita Sharma',
  },
  {
    id: 4,
    title: 'Medicine refill for Dadaji',
    assignee: 'Priya Sharma',
    status: 'overdue',
    recurrence: 'monthly',
    dueDate: '3 Jan 2026',
  },
  {
    id: 5,
    title: 'Take morning medicine',
    assignee: 'Shanti Devi',
    status: 'pending',
    recurrence: 'daily',
    dueDate: '9 Jan 2026',
  },
  {
    id: 6,
    title: 'Water the plants',
    assignee: 'Priya Sharma',
    status: 'pending',
    recurrence: 'daily',
    dueDate: '10 Jan 2026',
  },
];

export default function Responsibilities() {
  const { mode } = useApp();
  const [responsibilities, setResponsibilities] = useState<Responsibility[]>(initialResponsibilities);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedResponsibility, setSelectedResponsibility] = useState<Responsibility | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const isAdmin = true; // In real app, this would come from auth context

  const handleConfirm = (id: number) => {
    setResponsibilities(prev => prev.map(r => 
      r.id === id 
        ? { 
            ...r, 
            status: 'confirmed' as const,
            confirmedAt: new Date().toLocaleString('en-IN', { 
              day: 'numeric', 
              month: 'short', 
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              hour12: true 
            }),
          }
        : r
    ));
    toast.success('Marked as completed.');
  };

  const handleViewDetails = (id: number) => {
    const resp = responsibilities.find(r => r.id === id);
    if (resp) {
      setSelectedResponsibility(resp);
      setDetailsOpen(true);
    }
  };

  const handleEdit = (id: number) => {
    toast.info('Edit functionality coming soon');
  };

  const handleCreateComplete = (data: ResponsibilityFormData) => {
    const newResponsibility: Responsibility = {
      id: Date.now(),
      title: data.title,
      assignee: data.assignee,
      status: 'pending',
      recurrence: data.recurrence,
      dueDate: new Date(Date.now() + 86400000).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      escalatedTo: data.escalateTo && data.escalateTo !== 'none' ? data.escalateTo : undefined,
    };
    setResponsibilities(prev => [newResponsibility, ...prev]);
    setShowCreateForm(false);
  };

  const hasResponsibilities = responsibilities.length > 0;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className={cn(
            "font-bold text-foreground",
            mode === 'simple' ? 'text-2xl' : 'text-xl'
          )}>
            Responsibilities
          </h1>
          <p className={cn(
            "mt-1 text-muted-foreground",
            mode === 'simple' ? 'text-base' : 'text-sm'
          )}>
            Who needs to do what — clearly.
          </p>
        </div>
        {isAdmin && !showCreateForm && mode === 'simple' && (
          <Button 
            className={cn("gap-2", mode === 'simple' ? 'h-11 px-5' : '')}
            onClick={() => setShowCreateForm(true)}
          >
            <Plus className="h-4 w-4" />
            Create Responsibility
          </Button>
        )}
      </div>
      
      <Hint id="responsibilities-intro">
        Assign tasks to family members. They confirm when done. 
        If not confirmed, you'll be notified automatically.
      </Hint>

      {/* Task Lifecycle - Simple Mode Only */}
      {mode === 'simple' && (
        <Card className="animate-fade-in opacity-0" style={{ animationDelay: '0.1s' }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">How it works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
              <Badge variant="outline" className="gap-1.5 px-3 py-2">
                <Plus className="h-3.5 w-3.5" />
                Task Created
              </Badge>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <Badge variant="outline" className="gap-1.5 px-3 py-2">
                <Clock className="h-3.5 w-3.5" />
                Reminder Sent
              </Badge>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <Badge variant="outline" className="gap-1.5 px-3 py-2 text-success">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Confirmed
              </Badge>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <Badge variant="outline" className="gap-1.5 px-3 py-2 text-destructive">
                <AlertTriangle className="h-3.5 w-3.5" />
                Escalated
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Create - Fast Mode */}
      {mode === 'fast' && isAdmin && (
        <QuickCreateResponsibility onComplete={handleCreateComplete} />
      )}

      {/* Guided Create Form - Simple Mode */}
      {mode === 'simple' && showCreateForm && (
        <GuidedCreateResponsibility 
          onComplete={handleCreateComplete}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {/* Responsibilities Timeline or Empty State */}
      {hasResponsibilities ? (
        <ResponsibilityTimeline
          responsibilities={responsibilities}
          onConfirm={handleConfirm}
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
          isAdmin={isAdmin}
        />
      ) : (
        <EmptyResponsibilities onCreateClick={() => setShowCreateForm(true)} />
      )}

      {/* Details Modal */}
      <ResponsibilityDetailsModal
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        responsibility={selectedResponsibility}
      />
    </div>
  );
}
