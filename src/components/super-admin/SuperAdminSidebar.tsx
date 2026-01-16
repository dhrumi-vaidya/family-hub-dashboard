import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  ScrollText, 
  FileBarChart, 
  Settings, 
  Shield, 
  ToggleLeft, 
  Gauge,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const mainNavItems = [
  { title: 'Dashboard', url: '/super-admin', icon: LayoutDashboard },
  { title: 'Families', url: '/super-admin/families', icon: Building2 },
  { title: 'Users', url: '/super-admin/users', icon: Users },
  { title: 'Audit Logs', url: '/super-admin/audit', icon: ScrollText },
  { title: 'Reports', url: '/super-admin/reports', icon: FileBarChart },
  { title: 'System Settings', url: '/super-admin/settings', icon: Settings },
];

const adminNavItems = [
  { title: 'Compliance', url: '/super-admin/compliance', icon: Shield },
  { title: 'Feature Flags', url: '/super-admin/features', icon: ToggleLeft },
  { title: 'Platform Limits', url: '/super-admin/limits', icon: Gauge },
];

export function SuperAdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const NavItem = ({ item }: { item: typeof mainNavItems[0] }) => {
    const isActive = location.pathname === item.url;
    const Icon = item.icon;

    const linkContent = (
      <NavLink
        to={item.url}
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
          'hover:bg-slate-800/60',
          isActive 
            ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border-l-2 border-amber-400' 
            : 'text-slate-400 hover:text-slate-200',
          collapsed && 'justify-center px-2'
        )}
      >
        <Icon className={cn('h-5 w-5 shrink-0', isActive && 'text-amber-400')} />
        {!collapsed && <span>{item.title}</span>}
      </NavLink>
    );

    if (collapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            {linkContent}
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-slate-800 border-slate-700">
            {item.title}
          </TooltipContent>
        </Tooltip>
      );
    }

    return linkContent;
  };

  return (
    <div 
      className={cn(
        'flex flex-col border-r border-slate-800 bg-slate-950 transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className={cn(
        'flex items-center gap-3 p-4 border-b border-slate-800',
        collapsed && 'justify-center'
      )}>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20">
          <Shield className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <div>
            <h1 className="text-lg font-bold text-white">KutumbOS</h1>
            <p className="text-xs text-amber-400 font-medium">Super Admin</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {mainNavItems.map((item) => (
          <NavItem key={item.url} item={item} />
        ))}
        
        <Separator className="my-4 bg-slate-800" />
        
        {!collapsed && (
          <p className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Admin Only
          </p>
        )}
        
        {adminNavItems.map((item) => (
          <NavItem key={item.url} item={item} />
        ))}
      </div>

      {/* Collapse Toggle */}
      <div className="p-3 border-t border-slate-800">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'w-full text-slate-400 hover:text-slate-200 hover:bg-slate-800',
            collapsed && 'px-2'
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Collapse
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
