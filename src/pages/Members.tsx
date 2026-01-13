import { useState } from 'react';
import { Plus, Shield, User, MoreHorizontal, Eye, Pencil, CheckCircle, Trash2, UserX, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { useApp } from '@/contexts/AppContext';
import { Hint } from '@/components/onboarding/Hint';
import { AddMemberModal } from '@/components/modals/AddMemberModal';
import { LoadingSkeleton, ErrorState } from '@/components/ui/page-states';
import { AdminOnly, useIsAdmin } from '@/components/ui/role-visibility';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Member {
  id: number;
  name: string;
  age: number;
  role: 'Admin' | 'Member';
  permissions: string[];
  avatar: string;
}

const initialMembers: Member[] = [
  {
    id: 1,
    name: 'Rajesh Sharma',
    age: 52,
    role: 'Admin',
    permissions: ['Read', 'Write', 'Confirm'],
    avatar: 'RS',
  },
  {
    id: 2,
    name: 'Anita Sharma',
    age: 48,
    role: 'Admin',
    permissions: ['Read', 'Write', 'Confirm'],
    avatar: 'AS',
  },
  {
    id: 3,
    name: 'Vikram Sharma',
    age: 25,
    role: 'Member',
    permissions: ['Read', 'Confirm'],
    avatar: 'VS',
  },
  {
    id: 4,
    name: 'Priya Sharma',
    age: 22,
    role: 'Member',
    permissions: ['Read', 'Confirm'],
    avatar: 'PS',
  },
  {
    id: 5,
    name: 'Shanti Devi',
    age: 75,
    role: 'Member',
    permissions: ['Read'],
    avatar: 'SD',
  },
];

const permissionIcons = {
  Read: Eye,
  Write: Pencil,
  Confirm: CheckCircle,
};

export default function Members() {
  const { mode } = useApp();
  const isAdmin = useIsAdmin();
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleDeleteClick = (member: Member) => {
    setMemberToDelete(member);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (memberToDelete) {
      setMembers(prev => prev.filter(m => m.id !== memberToDelete.id));
      toast.success(`${memberToDelete.name} has been removed from the family.`);
      setDeleteDialogOpen(false);
      setMemberToDelete(null);
    }
  };

  // Error State
  if (error) {
    return (
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-heading-lg text-foreground">Family Members</h1>
          <p className="mt-1 text-body text-muted-foreground">
            Manage members and their access permissions.
          </p>
        </div>
        <ErrorState 
          variant="network" 
          message={error}
          onRetry={handleRetry}
        />
      </div>
    );
  }

  // Loading State
  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-heading-lg text-foreground">Family Members</h1>
          <p className="mt-1 text-body text-muted-foreground">
            Manage members and their access permissions.
          </p>
        </div>
        <LoadingSkeleton variant="card" count={6} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-heading-lg text-foreground">Family Members</h1>
          <p className="mt-1 text-body text-muted-foreground">
            {isAdmin 
              ? 'Manage members and their access permissions.'
              : 'View your family members.'}
          </p>
        </div>
        {/* Admin-only add button */}
        <AdminOnly>
          <Button className="gap-2" onClick={() => setAddMemberOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Member
          </Button>
        </AdminOnly>
      </div>
      
      <Hint id="members-intro">
        {isAdmin 
          ? 'Add family members and set their roles. Admins can manage everything, while Members can only view and confirm tasks assigned to them.'
          : 'Here you can see all your family members. Contact an admin if you need any changes.'}
      </Hint>

      {/* Members Grid */}
      {members.length > 0 ? (
        <div className={cn(
          'grid gap-4',
          mode === 'simple' ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'
        )}>
          {members.map((member, index) => (
            <Card
              key={member.id}
              hover
              className="animate-fade-in opacity-0"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="py-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-full text-lg font-semibold',
                      member.role === 'Admin'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    )}>
                      {member.avatar}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">Age: {member.age}</p>
                    </div>
                  </div>
                  {/* Admin-only actions menu */}
                  <AdminOnly>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit Member
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Shield className="h-4 w-4 mr-2" />
                          Change Role
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDeleteClick(member)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </AdminOnly>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <Badge
                    variant={member.role === 'Admin' ? 'default' : 'secondary'}
                    className="gap-1"
                  >
                    {member.role === 'Admin' ? (
                      <Shield className="h-3 w-3" />
                    ) : (
                      <User className="h-3 w-3" />
                    )}
                    {member.role}
                  </Badge>
                </div>

                {mode === 'simple' && (
                  <div className="mt-4 border-t border-border pt-4">
                    <p className="mb-2 text-sm font-medium text-muted-foreground">Permissions</p>
                    <div className="flex flex-wrap gap-2">
                      {member.permissions.map((perm) => {
                        const Icon = permissionIcons[perm as keyof typeof permissionIcons];
                        return (
                          <Badge key={perm} variant="outline" className="gap-1">
                            <Icon className="h-3 w-3" />
                            {perm}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Empty State */
        <Card className="animate-fade-in">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/50 mb-6">
              <UserX className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No family members yet
            </h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Add family members to start managing responsibilities and health records together.
            </p>
            <AdminOnly>
              <Button size="lg" className="gap-2" onClick={() => setAddMemberOpen(true)}>
                <Plus className="h-5 w-5" />
                Add First Member
              </Button>
            </AdminOnly>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Remove Family Member
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <strong>{memberToDelete?.name}</strong> from the family? 
              This action cannot be undone. They will lose access to all family data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove Member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AddMemberModal open={addMemberOpen} onOpenChange={setAddMemberOpen} />
    </div>
  );
}
