import { ReactNode, useState, useEffect } from 'react';
import { AdminHeader } from './AdminHeader';
import { AdminSidebar } from './AdminSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: ReactNode;
}

/**
 * Main Admin Panel Layout
 * 
 * This layout is specifically for the System/Super Admin panel.
 * It's completely separate from the family dashboard layout to maintain
 * clear separation between system administration and family management.
 */
export function AdminLayout({ children }: AdminLayoutProps) {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on mobile when screen size changes
  useEffect(() => {
    if (!isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader />
      <div className="flex relative">
        {/* Mobile overlay */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Mobile menu button */}
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="fixed top-4 left-4 z-50 lg:hidden"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        )}

        {/* Sidebar */}
        <div
          className={cn(
            'transition-transform duration-300 ease-in-out',
            isMobile
              ? cn(
                  'fixed left-0 top-0 z-50 h-full',
                  sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                )
              : 'relative'
          )}
        >
          <AdminSidebar />
        </div>

        {/* Main content */}
        <main className={cn(
          'flex-1 p-6',
          isMobile && 'pl-6' // Ensure content doesn't get hidden behind mobile menu button
        )}>
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}