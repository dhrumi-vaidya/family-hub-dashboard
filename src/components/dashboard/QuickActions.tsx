import { Plus, UserPlus, Upload, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface QuickActionsProps {
  mode: 'simple' | 'fast';
  onAddExpense?: () => void;
  onAssignTask?: () => void;
  onInviteMember?: () => void;
  onUploadHealth?: () => void;
}

const actions = [
  { label: 'Add Expense', icon: Plus, key: 'expense', path: '/expenses' },
  { label: 'Assign Task', icon: ClipboardList, key: 'task', path: '/responsibilities' },
  { label: 'Invite Member', icon: UserPlus, key: 'member', path: '/invite-members' },
  { label: 'Upload Health Record', icon: Upload, key: 'health', path: '/health' },
];

export function QuickActions({ mode }: QuickActionsProps) {
  if (mode === 'fast') {
    return (
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Button key={action.key} variant="outline" size="sm" className="gap-1.5" asChild>
              <a href={action.path}>
                <Icon className="h-3.5 w-3.5" />
                {action.label}
              </a>
            </Button>
          );
        })}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium text-muted-foreground">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.key}
                variant="outline"
                size="lg"
                className="h-16 flex-col gap-2 text-sm"
                asChild
              >
                <a href={action.path}>
                  <Icon className="h-5 w-5" />
                  {action.label}
                </a>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
