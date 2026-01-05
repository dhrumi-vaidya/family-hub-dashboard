import { useState } from 'react';
import { Plus, Shield, User, MoreHorizontal, Eye, Pencil, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';

const members = [
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

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-heading-lg text-foreground">Family Members</h1>
          <p className="mt-1 text-body text-muted-foreground">
            Manage members and their access permissions.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Member
        </Button>
      </div>

      {/* Members Grid */}
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit Member</DropdownMenuItem>
                    <DropdownMenuItem>Change Role</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
    </div>
  );
}
