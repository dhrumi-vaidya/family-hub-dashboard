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
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main
          className={cn(
            'flex-1 overflow-y-auto p-4 lg:p-6',
            mode === 'simple' ? 'lg:p-8' : 'lg:p-6'
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
