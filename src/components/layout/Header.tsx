import { Bell, ChevronDown, User, Menu, LogOut, Settings, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';

export function Header() {
  const navigate = useNavigate();
  const { mode, setMode, currentFamily, setCurrentFamily, families, sidebarCollapsed, setSidebarCollapsed } = useApp();
  const { user, logout, selectedFamily } = useAuth();

  const isFamilyAdmin = selectedFamily?.role === 'FAMILY_ADMIN';

  // Display name: email prefix as fallback, family name if nothing else
  const emailPrefix = user?.email?.split('@')[0] ?? '';
  const displayName = emailPrefix || selectedFamily?.name || currentFamily?.name || 'User';
  const avatarChar = displayName.charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 transition-colors duration-200">
      <div className="flex h-full items-center justify-between px-4 lg:px-6 gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="lg:hidden touch-target"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Family Selector - Only show for Admins with multiple families */}
          {isFamilyAdmin && families.length > 1 ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 font-medium min-w-0 max-w-48">
                  <span className="hidden sm:inline text-muted-foreground">Family:</span>
                  <span className="text-primary truncate">{currentFamily.name}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {families.map((family) => (
                  <DropdownMenuItem
                    key={family.id}
                    onClick={() => setCurrentFamily(family)}
                    className={currentFamily.id === family.id ? 'bg-accent' : ''}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{family.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {family.memberCount} members
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="font-medium text-foreground min-w-0">
              <span className="hidden sm:inline text-muted-foreground mr-1">Family:</span>
              <span className="text-primary truncate">{currentFamily.name}</span>
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Mode Toggle - Enhanced for better UX */}
          <div className="hidden items-center gap-2 rounded-lg bg-muted/50 px-3 py-1.5 sm:flex border border-border/50">
            <span className={cn(
              "text-sm transition-colors duration-200",
              mode === 'simple' ? 'font-medium text-foreground' : 'text-muted-foreground'
            )}>
              Simple
            </span>
            <Switch
              checked={mode === 'fast'}
              onCheckedChange={(checked) => setMode(checked ? 'fast' : 'simple')}
              className="data-[state=checked]:bg-primary"
              aria-label={`Switch to ${mode === 'simple' ? 'Fast' : 'Simple'} mode`}
            />
            <span className={cn(
              "text-sm transition-colors duration-200",
              mode === 'fast' ? 'font-medium text-foreground' : 'text-muted-foreground'
            )}>
              Fast
            </span>
          </div>

          {/* Notifications - Made interactive */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative touch-target"
            onClick={() => navigate('/notifications')}
            aria-label="View notifications (3 unread)"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              3
            </span>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full touch-target"
                aria-label="User menu"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground font-medium">
                  {avatarChar}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="font-medium text-foreground">{displayName}</p>
                <p className="text-sm text-muted-foreground">
                  {isFamilyAdmin ? '👑 Family Admin' : '👤 Family Member'}
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="mr-2 h-4 w-4" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                App Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
