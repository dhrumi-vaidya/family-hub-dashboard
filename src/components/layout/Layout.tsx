import { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import { OnboardingTour } from '@/components/onboarding/OnboardingTour';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { mode, sidebarCollapsed, showOnboarding, setShowOnboarding, setHasCompletedOnboarding } = useApp();
  const isCollapsed = mode === 'fast' ? sidebarCollapsed : false;

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setHasCompletedOnboarding(true);
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
    setHasCompletedOnboarding(true);
  };

  return (
    <div className={cn("flex h-screen w-full overflow-hidden", `mode-${mode}`)}>
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main
          className={cn(
            'flex-1 overflow-y-auto transition-all duration-200',
            // Mode-specific padding with consistent rhythm
            mode === 'simple' 
              ? 'p-4 sm:p-6 lg:p-8' 
              : 'p-4 sm:p-5 lg:p-6'
          )}
        >
          {children}
        </main>
      </div>
      
      {/* Onboarding Tour - only in Simple mode for first-time users */}
      {showOnboarding && mode === 'simple' && (
        <OnboardingTour
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      )}
    </div>
  );
}
