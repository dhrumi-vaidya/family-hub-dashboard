import { useState, useEffect } from 'react';
import { 
  Building2, 
  Search, 
  Eye, 
  Ban, 
  CheckCircle2, 
  MoreHorizontal,
  AlertTriangle,
  Users,
  UserCog
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { apiClient } from '@/lib/api';

interface Family {
  id: string;
  name: string;
  adminCount: number;
  memberCount: number;
  createdAt: string;
  status: 'active' | 'flagged' | 'suspended';
}

interface FamiliesPreviewPanelProps {
  onViewFamily?: (family: Family) => void;
  onSuspendFamily?: (family: Family) => void;
  onReinstateFamily?: (family: Family) => void;
}

export function FamiliesPreviewPanel({
  onViewFamily,
  onSuspendFamily,
  onReinstateFamily,
}: FamiliesPreviewPanelProps) {
  const [families, setFamilies] = useState<Family[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: 'suspend' | 'reinstate';
    family: Family | null;
  }>({ open: false, action: 'suspend', family: null });

  useEffect(() => {
    const fetchFamilies = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get('/admin/families');
        if (response.success) {
          setFamilies(response.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch families:', error);
        setFamilies([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFamilies();
  }, []);

  const statusConfig = {
    active: {
      label: 'Active',
      className: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      icon: CheckCircle2,
    },
    flagged: {
      label: 'Flagged',
      className: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      icon: AlertTriangle,
    },
    suspended: {
      label: 'Suspended',
      className: 'bg-red-500/20 text-red-300 border-red-500/30',
      icon: Ban,
    },
  };

  const filteredFamilies = families.filter((family) =>
    family.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAction = (action: 'suspend' | 'reinstate', family: Family) => {
    setConfirmDialog({ open: true, action, family });
  };

  const confirmAction = () => {
    if (confirmDialog.family) {
      if (confirmDialog.action === 'suspend') {
        onSuspendFamily?.(confirmDialog.family);
      } else {
        onReinstateFamily?.(confirmDialog.family);
      }
    }
    setConfirmDialog({ open: false, action: 'suspend', family: null });
  };

  if (isLoading) {
    return (
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-foreground">Families Management</CardTitle>
            <Skeleton className="h-9 w-48 bg-muted" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 min-w-0">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <Skeleton className="h-10 w-10 rounded-lg bg-muted shrink-0" />
                <div className="space-y-2 min-w-0 flex-1">
                  <Skeleton className="h-4 w-28 bg-muted" />
                  <Skeleton className="h-3 w-40 bg-muted" />
                </div>
              </div>
              <Skeleton className="h-6 w-20 rounded-full bg-muted shrink-0" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-lg text-foreground flex items-center gap-2">
              <Building2 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              Families Management
            </CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search families..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-background border-input text-foreground placeholder:text-muted-foreground h-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredFamilies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Building2 className="h-8 w-8 text-muted-foreground" />
              </div>
              {searchQuery ? (
                <>
                  <p className="text-foreground font-medium">No families found</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    No families match "{searchQuery}"
                  </p>
                </>
              ) : (
                <>
                  <p className="text-foreground font-medium">No families registered</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Families will appear here when they join the platform
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredFamilies.map((family) => {
                const status = statusConfig[family.status];
                const StatusIcon = status.icon;

                return (
                  <div
                    key={family.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border hover:bg-muted/50 transition-colors min-w-0"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground truncate">{family.name}</p>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1 shrink-0">
                            <UserCog className="h-3.5 w-3.5" />
                            {family.adminCount} Admin{family.adminCount !== 1 ? 's' : ''}
                          </span>
                          <span className="flex items-center gap-1 shrink-0">
                            <Users className="h-3.5 w-3.5" />
                            {family.memberCount} Member{family.memberCount !== 1 ? 's' : ''}
                          </span>
                          <span className="truncate">Created {family.createdAt}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <Badge variant="outline" className={cn('flex items-center gap-1', status.className)}>
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-muted">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover border-border">
                          <DropdownMenuItem 
                            className="text-foreground hover:bg-muted cursor-pointer"
                            onClick={() => onViewFamily?.(family)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-border" />
                          {family.status === 'suspended' ? (
                            <DropdownMenuItem 
                              className="text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-500/10 cursor-pointer"
                              onClick={() => handleAction('reinstate', family)}
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Reinstate Family
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem 
                              className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 cursor-pointer"
                              onClick={() => handleAction('suspend', family)}
                            >
                              <Ban className="mr-2 h-4 w-4" />
                              Suspend Family
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-border">
            <Button 
              variant="outline" 
              className="w-full text-amber-600 border-amber-200 hover:bg-amber-50 hover:text-amber-700 dark:text-amber-400 dark:border-amber-500/30 dark:hover:bg-amber-500/10 dark:hover:text-amber-300"
            >
              View All Families
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialog.open} onOpenChange={(open) => !open && setConfirmDialog({ ...confirmDialog, open: false })}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              {confirmDialog.action === 'suspend' ? 'Suspend Family' : 'Reinstate Family'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              {confirmDialog.action === 'suspend' ? (
                <>
                  Are you sure you want to suspend <strong className="text-foreground">{confirmDialog.family?.name}</strong>? 
                  This will restrict all family members from accessing the platform.
                </>
              ) : (
                <>
                  Are you sure you want to reinstate <strong className="text-foreground">{confirmDialog.family?.name}</strong>? 
                  This will restore access for all family members.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-secondary border-border text-secondary-foreground hover:bg-secondary/80">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAction}
              className={cn(
                confirmDialog.action === 'suspend' 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-emerald-600 hover:bg-emerald-700'
              )}
            >
              {confirmDialog.action === 'suspend' ? 'Suspend' : 'Reinstate'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
