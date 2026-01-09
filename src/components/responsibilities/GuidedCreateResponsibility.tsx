import { useState } from 'react';
import { CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface GuidedCreateResponsibilityProps {
  onComplete: (data: ResponsibilityFormData) => void;
  onCancel: () => void;
}

export interface ResponsibilityFormData {
  title: string;
  assignee: string;
  recurrence: 'once' | 'daily' | 'weekly' | 'monthly';
  escalateTo: string;
}

const members = ['Rajesh Sharma', 'Anita Sharma', 'Vikram Sharma', 'Priya Sharma', 'Shanti Devi'];

export function GuidedCreateResponsibility({ onComplete, onCancel }: GuidedCreateResponsibilityProps) {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [assignee, setAssignee] = useState('');
  const [recurrence, setRecurrence] = useState<'once' | 'daily' | 'weekly' | 'monthly'>('once');
  const [escalateTo, setEscalateTo] = useState('');

  const totalSteps = 4;

  const canProceed = () => {
    switch (step) {
      case 1: return title.trim().length > 0;
      case 2: return assignee.length > 0;
      case 3: return recurrence.length > 0;
      case 4: return true; // Escalation is optional
      default: return false;
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    onComplete({
      title,
      assignee,
      recurrence,
      escalateTo,
    });
    toast.success('Responsibility created successfully.');
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">What needs to be done?</h3>
              <p className="text-sm text-muted-foreground">Enter a clear task name.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Responsibility name</Label>
              <Input
                id="title"
                placeholder="e.g., Take morning medicine"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-12 text-base"
                autoFocus
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Who should do this?</h3>
              <p className="text-sm text-muted-foreground">Select one family member.</p>
            </div>
            <div className="space-y-2">
              <Label>Assign to</Label>
              <Select value={assignee} onValueChange={setAssignee}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Select member" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member} value={member} className="py-3">
                      {member}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">When should it be done?</h3>
              <p className="text-sm text-muted-foreground">Choose how often this repeats.</p>
            </div>
            <RadioGroup value={recurrence} onValueChange={(v) => setRecurrence(v as typeof recurrence)}>
              <div className="space-y-3">
                {[
                  { value: 'once', label: 'One-time', desc: 'Only needs to be done once' },
                  { value: 'daily', label: 'Daily', desc: 'Every day' },
                  { value: 'weekly', label: 'Weekly', desc: 'Once every week' },
                  { value: 'monthly', label: 'Monthly', desc: 'Once every month' },
                ].map((option) => (
                  <Label
                    key={option.value}
                    htmlFor={option.value}
                    className="flex cursor-pointer items-start gap-3 rounded-lg border p-4 hover:bg-muted/50 [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5"
                  >
                    <RadioGroupItem value={option.value} id={option.value} className="mt-0.5" />
                    <div>
                      <span className="font-medium">{option.label}</span>
                      <p className="text-sm text-muted-foreground">{option.desc}</p>
                    </div>
                  </Label>
                ))}
              </div>
            </RadioGroup>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">What if it's not confirmed?</h3>
              <p className="text-sm text-muted-foreground">Choose who gets notified if the task isn't done.</p>
            </div>
            <div className="space-y-2">
              <Label>Escalate to (optional)</Label>
              <Select value={escalateTo} onValueChange={setEscalateTo}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Select member to notify" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none" className="py-3">No escalation</SelectItem>
                  {members.filter(m => m !== assignee).map((member) => (
                    <SelectItem key={member} value={member} className="py-3">
                      {member}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Create Responsibility</CardTitle>
          <span className="text-sm text-muted-foreground">Step {step} of {totalSteps}</span>
        </div>
        {/* Progress bar */}
        <div className="mt-2 h-2 rounded-full bg-muted">
          <div 
            className="h-2 rounded-full bg-primary transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {renderStepContent()}

        <div className="flex items-center justify-between pt-4">
          {step > 1 ? (
            <Button variant="ghost" onClick={() => setStep(step - 1)} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          ) : (
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}

          <Button 
            onClick={handleNext} 
            disabled={!canProceed()}
            className="gap-2"
          >
            {step === totalSteps ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Create
              </>
            ) : (
              <>
                Next
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
