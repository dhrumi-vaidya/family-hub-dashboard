import { useApp } from '@/contexts/AppContext';
import { Info } from 'lucide-react';

export function SimpleModeBanner() {
  const { mode, hasCompletedOnboarding } = useApp();

  // Only show in Simple mode after onboarding
  if (mode !== 'simple' || !hasCompletedOnboarding) return null;

  return (
    <div className="mb-4 flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
      <Info className="h-4 w-4 flex-shrink-0" />
      <span>
        You're in <strong>Simple Mode</strong> — we'll guide you with helpful hints.
        Switch to Fast Mode anytime for a compact view.
      </span>
    </div>
  );
}
