import { ReactNode, useState, useEffect } from 'react';
import { SuperAdminSidebar } from './SuperAdminSidebar';
import { SuperAdminHeader } from './SuperAdminHeader';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface SuperAdminLayoutProps {
  children: ReactNode;
}

export function SuperAdminLayout({ children }: SuperAdminLayoutProps) {
  const isMobile = useIsMobile();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true); // Always start collapsed

  // Don't auto-collapse when switching to mobile if user has opened it
  // Only auto-collapse when switching from mobile to desktop
  useEffect(() => {
    // Only auto-collapse when switching from mobile to desktop
    if (!isMobile && sidebarCollapsed) {
      // On desktop, we might want to show the sidebar by default
      // But for now, keep it collapsed until user interacts
    }
  }, [isMobile, sidebarCollapsed]);

  const toggleSidebar = () => {
    console.log('Toggling sidebar from', sidebarCollapsed, 'to', !sidebarCollapsed);
    console.log('isMobile:', isMobile);
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Debug logging
  console.log('SuperAdminLayout render:', { isMobile, sidebarCollapsed });

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Mobile overlay */}
      {isMobile && !sidebarCollapsed && (
        <div
          className="fixed inset-0 z-[55] bg-black/20 backdrop-blur-sm"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      <SuperAdminSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <SuperAdminHeader onToggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
