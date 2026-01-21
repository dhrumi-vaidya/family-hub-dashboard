import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Settings,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  icon: typeof LayoutDashboard;
  label: string;
  path: string;
  description: string;
}

/**
 * Main Admin Panel Navigation
 * 
 * System-level navigation for platform administration.
 * No family-related features - only system management.
 */
const navItems: NavItem[] = [
  { 
    icon: LayoutDashboard, 
    label: 'Dashboard', 
    path: '/admin',
    description: 'System overview and metrics'
  },
  { 
    icon: Users, 
    label: 'Family Management', 
    path: '/admin/families',
    description: 'Manage families and their status'
  },
  { 
    icon: UserCheck, 
    label: 'User Management', 
    path: '/admin/users',
    description: 'Platform user administration'
  },
  { 
    icon: Settings, 
    label: 'Configuration', 
    path: '/admin/config',
    description: 'System settings and limits'
  },
  { 
    icon: FileText, 
    label: 'Audit Logs', 
    path: '/admin/logs',
    description: 'System activity and security logs'
  },
];

export function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 border-r border-slate-200 bg-white">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-start gap-3 rounded-lg px-3 py-3 text-sm transition-colors',
                isActive
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              )}
            >
              <item.icon className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <div className="font-medium">{item.label}</div>
                <div className={cn(
                  'text-xs mt-0.5',
                  isActive ? 'text-slate-300' : 'text-slate-500'
                )}>
                  {item.description}
                </div>
              </div>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}