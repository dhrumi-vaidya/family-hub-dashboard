import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ResponsibilityFormData } from './GuidedCreateResponsibility';

interface QuickCreateResponsibilityProps {
  onComplete: (data: ResponsibilityFormData) => void;
}

const members = ['Rajesh Sharma', 'Anita Sharma', 'Vikram Sharma', 'Priya Sharma', 'Shanti Devi'];
const recurrenceOptions = [
  { value: 'once', label: 'One-time' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

export function QuickCreateResponsibility({ onComplete }: QuickCreateResponsibilityProps) {
  const [title, setTitle] = useState('');
  const [assignee, setAssignee] = useState('');
  const [recurrence, setRecurrence] = useState<'once' | 'daily' | 'weekly' | 'monthly'>('once');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a task name');
      return;
    }
    if (!assignee) {
      toast.error('Please select an assignee');
      return;
    }

    onComplete({
      title,
      assignee,
      recurrence,
      escalateTo: '',
    });

    setTitle('');
    setAssignee('');
    setRecurrence('once');
    
    toast.success('Responsibility created successfully.');
  };

  return (
    <Card>
      <CardContent className="py-4">
        <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
          <div className="min-w-[200px] flex-1">
            <Input
              placeholder="Enter responsibility name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-10"
            />
          </div>
          
          <div className="w-[180px]">
            <Select value={assignee} onValueChange={setAssignee}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Assign to" />
              </SelectTrigger>
              <SelectContent>
                {members.map((member) => (
                  <SelectItem key={member} value={member}>
                    {member}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-[140px]">
            <Select value={recurrence} onValueChange={(v) => setRecurrence(v as typeof recurrence)}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {recurrenceOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="h-10 gap-2">
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
