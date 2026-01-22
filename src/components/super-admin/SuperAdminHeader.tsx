import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  LogOut, 
  User, 
  Settings, 
  Shield,
  CheckCircle2,
  AlertTriangle,
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface SuperAdminHeaderProps {
  onToggleSidebar?: () => void;
}

export function SuperAdminHeader({ onToggleSidebar }: SuperAdminHeaderProps) {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const isMobile = useIsMobile();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-card/95 backdrop-blur px-4 sm:px-6">
      {/* Left Section */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
        {/* Mobile Menu Button */}
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="shrink-0 text-muted-foreground hover:text-foreground hover:bg-accent"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}

        {/* System Status - Hidden on very small screens */}
        <div className={cn(
          "flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20",
          isMobile ? "hidden xs:flex" : "flex"
        )}>
          <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500" />
          <span className="text-xs sm:text-sm font-medium text-emerald-600 dark:text-emerald-400">
            {isMobile ? "Healthy" : "System Healthy"}
          </span>
        </div>
      </div>

      {/* Center - Global Search - Hidden on mobile */}
      {!isMobile && (
        <div className="flex-1 max-w-xl mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search families, users, logs..."
              className="pl-10 bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-amber-500/50 focus:ring-amber-500/20"
            />
          </div>
        </div>
      )}

      {/* Right Section */}
      <div className="flex items-center gap-1 sm:gap-3 shrink-0">
        {/* Mobile Search Button */}
        {isMobile && (
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-accent">
            <Search className="h-5 w-5" />
          </Button>
        )}

        <ThemeToggle />

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground hover:bg-accent">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-3 border-b border-border">
              <p className="font-semibold text-foreground">Notifications</p>
            </div>
            <div className="max-h-64 overflow-y-auto">
              <DropdownMenuItem className="p-3 cursor-pointer">
                <div className="flex gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                  <div>
                    <p className="text-sm text-foreground">Policy violation detected</p>
                    <p className="text-xs text-muted-foreground">Sharma Family • 2 min ago</p>
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-3 cursor-pointer">
                <div className="flex gap-3">
                  <Shield className="h-5 w-5 text-red-500 shrink-0" />
                  <div>
                    <p className="text-sm text-foreground">Emergency access granted</p>
                    <p className="text-xs text-muted-foreground">Verma Family • 15 min ago</p>
                  </div>
                </div>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="p-3 text-center text-amber-500 cursor-pointer">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 text-foreground hover:bg-accent p-1 sm:p-2">
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600">
                <User className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-sm font-medium">{user?.name || 'Super Admin'}</p>
                <p className="text-xs text-amber-500">Super Admin</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-3 py-2">
              <p className="font-medium text-foreground">{user?.name || 'Super Admin'}</p>
              <p className="text-sm text-amber-500">Super Admin</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-foreground cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="text-foreground cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout}
              className="text-red-500 hover:bg-red-500/10 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
