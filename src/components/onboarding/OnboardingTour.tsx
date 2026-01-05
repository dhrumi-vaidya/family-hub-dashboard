import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, ArrowRight, ArrowLeft, Home, Wallet, Heart, ClipboardList, Users, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  target?: string;
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to KutumbOS',
    description: 'Your family management dashboard. Let us show you around so you feel comfortable.',
    icon: <Home className="h-8 w-8" />,
  },
  {
    id: 'dashboard',
    title: 'Dashboard Overview',
    description: 'This is your home. See expenses, health records, tasks, and family members at a glance.',
    icon: <Home className="h-8 w-8" />,
    target: 'dashboard',
  },
  {
    id: 'expenses',
    title: 'Track Expenses',
    description: 'Set monthly budgets and track where your money goes. Simple categories, clear numbers.',
    icon: <Wallet className="h-8 w-8" />,
    target: 'expenses',
  },
  {
    id: 'health',
    title: 'Health Records',
    description: 'Upload and organize medical documents for your family. Everything in one safe place.',
    icon: <Heart className="h-8 w-8" />,
    target: 'health',
  },
  {
    id: 'responsibilities',
    title: 'Family Tasks',
    description: 'Assign and track household responsibilities. Everyone knows what to do.',
    icon: <ClipboardList className="h-8 w-8" />,
    target: 'responsibilities',
  },
  {
    id: 'members',
    title: 'Manage Members',
    description: 'Add family members and set their permissions. You control who can do what.',
    icon: <Users className="h-8 w-8" />,
    target: 'members',
  },
  {
    id: 'settings',
    title: 'Your Settings',
    description: 'Customize notifications, privacy, and emergency access. Make it yours.',
    icon: <Settings className="h-8 w-8" />,
    target: 'settings',
  },
  {
    id: 'complete',
    title: 'You\'re Ready!',
    description: 'That\'s all you need to know. Look for helpful hints as you explore. You can always switch to Fast Mode when you feel confident.',
    icon: <Home className="h-8 w-8" />,
  },
];

interface OnboardingTourProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function OnboardingTour({ onComplete, onSkip }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const step = tourSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tourSteps.length - 1;
  const progress = ((currentStep + 1) / tourSteps.length) * 100;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay/50 backdrop-blur-sm"
      onClick={onSkip}
    >
      <Card
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'relative mx-4 w-full max-w-md transform bg-card shadow-xl transition-all duration-300',
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        )}
      >
        {/* Skip button */}
        <button
          onClick={onSkip}
          className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Skip tour"
        >
          <X className="h-5 w-5" />
        </button>

        <CardContent className="pt-8">
          {/* Progress bar */}
          <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Step indicator */}
          <div className="mb-4 text-sm text-muted-foreground">
            Step {currentStep + 1} of {tourSteps.length}
          </div>

          {/* Icon */}
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            {step.icon}
          </div>

          {/* Content */}
          <h2 className="mb-2 text-heading-md text-foreground">{step.title}</h2>
          <p className="mb-8 text-body text-muted-foreground leading-relaxed">
            {step.description}
          </p>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handlePrev}
              disabled={isFirstStep}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            <Button onClick={handleNext} className="gap-2">
              {isLastStep ? 'Get Started' : 'Next'}
              {!isLastStep && <ArrowRight className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
