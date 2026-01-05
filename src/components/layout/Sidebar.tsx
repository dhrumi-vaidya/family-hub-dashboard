import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Wallet,
  Heart,
  CheckSquare,
  Users,
  Settings,
  FileText,
  ChevronLeft,
  Home,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Wallet, label: 'Expenses', path: '/expenses' },
  { icon: Heart, label: 'Health Records', path: '/health' },
  { icon: CheckSquare, label: 'Responsibilities', path: '/responsibilities' },
  { icon: Users, label: 'Members', path: '/members' },
  { icon: Settings, label: 'Settings', path: '/settings' },
  { icon: FileText, label: 'Audit Logs', path: '/audit-logs' },
];

export function Sidebar() {
  const { mode, sidebarCollapsed, setSidebarCollapsed } = useApp();
  const location = useLocation();

  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.matchMedia('(min-width: 1024px)').matches;
  });

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)');
    const onChange = () => setIsDesktop(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  // Desktop: Simple mode is always expanded; Fast mode can collapse.
  // Small screens: both modes use the collapsed state to open/close the drawer.
  const isCollapsed = isDesktop ? (mode === 'fast' ? sidebarCollapsed : false) : sidebarCollapsed;
  const showOverlay = !isDesktop && !isCollapsed;

  // After navigating on small screens, close the drawer so the page is usable.
  useEffect(() => {
    if (!isDesktop) setSidebarCollapsed(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <>
      {/* Mobile/Tablet Overlay */}
      {showOverlay && (
        <div
          className="fixed inset-0 z-40 bg-overlay/20 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-full flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 lg:relative lg:z-0',
          isCollapsed ? 'w-16' : 'w-64',
          'lg:translate-x-0',
          !isCollapsed ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Home className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-heading-sm text-foreground">KutumbOS</span>
            </div>
          )}
          {isCollapsed && (
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Home className="h-5 w-5 text-primary-foreground" />
            </div>
          )}

          {/* Close button on smaller screens so the sidebar never blocks content */}
          {!isDesktop && !isCollapsed && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setSidebarCollapsed(true)}
              className="ml-auto"
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </Button>
          )}

          {/* Collapse button (Fast Mode desktop) */}
          {isDesktop && mode === 'fast' && !isCollapsed && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setSidebarCollapsed(true)}
              className="hidden lg:flex"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-body font-medium transition-all duration-200',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground',
                  isCollapsed && 'justify-center px-2'
                )}
                onClick={() => {
                  if (!isDesktop) {
                    setSidebarCollapsed(true);
                  }
                }}
              >
                <item.icon className={cn('h-5 w-5 shrink-0', isActive && 'text-primary')} />
                {!isCollapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Expand button (Fast Mode only) */}
        {mode === 'fast' && isCollapsed && (
          <div className="hidden border-t border-sidebar-border p-3 lg:block">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setSidebarCollapsed(false)}
              className="w-full"
            >
              <ChevronLeft className="h-4 w-4 rotate-180" />
            </Button>
          </div>
        )}
      </aside>
    </>
  );
}
