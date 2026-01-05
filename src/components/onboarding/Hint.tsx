import { useState } from 'react';
import { X, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/contexts/AppContext';

interface HintProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  position?: 'top' | 'bottom' | 'inline';
}

export function Hint({ id, children, className, position = 'inline' }: HintProps) {
  const { mode, dismissedHints, dismissHint } = useApp();
  const [isVisible, setIsVisible] = useState(true);

  // Only show hints in Simple mode
  if (mode !== 'simple') return null;

  // Check if this hint was dismissed
  if (dismissedHints.includes(id)) return null;

  if (!isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    dismissHint(id);
  };

  return (
    <div
      className={cn(
        'relative flex items-start gap-3 rounded-lg border border-accent/30 bg-accent/10 p-3 text-sm animate-fade-in',
        position === 'top' && 'mb-4',
        position === 'bottom' && 'mt-4',
        className
      )}
      role="note"
      aria-label="Helpful hint"
    >
      <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-foreground" />
      <div className="flex-1 text-accent-foreground/90">{children}</div>
      <button
        onClick={handleDismiss}
        className="flex-shrink-0 rounded p-0.5 text-accent-foreground/60 transition-colors hover:bg-accent/20 hover:text-accent-foreground"
        aria-label="Dismiss hint"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
