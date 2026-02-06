/**
 * Role Management Component
 * Allows admins to manage user roles and permissions
 */

import React, { useState, useEffect } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { UserRole, Module, PermissionAction } from '@/types/permissions';
import { PermissionGate } from './PermissionGate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, Shield, Edit, Trash2, Plus, AlertTriangle } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface FamilyMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  joinedAt: Date;
  lastActive: Date;
  status: 'active' | 'inactive' | 'pending';
}

export function RoleManagement() {
  const { isSuperAdmin, isFamilyAdmin, canEdit } = usePermissions();
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState<UserRole | ''>('');

  useEffect(() => {
    const fetchFamilyMembers = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/family/members');
        if (response.success) {
          const membersData = response.data || [];
          // Convert date strings to Date objects
          const processedMembers = membersData.map((member: any) => ({
            ...member,
            joinedAt: new Date(member.joinedAt),
            lastActive: new Date(member.lastActive)
          }));
          setMembers(processedMembers);
        }
      } catch (error) {
        console.error('Failed to fetch family members:', error);
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFamilyMembers();
  }, []);

  const roleLabels: Record<UserRole, string> = {
    [UserRole.SUPER_ADMIN]: 'Super Admin',
    [UserRole.FAMILY_ADMIN]: 'Family Admin',
    [UserRole.ADULT_MEMBER]: 'Adult Member',
    [UserRole.SENIOR_MEMBER]: 'Senior Member',
    [UserRole.TEEN_MEMBER]: 'Teen Member',
    [UserRole.CHILD_MEMBER]: 'Child Member',
    [UserRole.EMERGENCY_USER]: 'Emergency User'
  };

  const roleColors: Record<UserRole, string> = {
    [UserRole.SUPER_ADMIN]: 'bg-red-100 text-red-800',
    [UserRole.FAMILY_ADMIN]: 'bg-purple-100 text-purple-800',
    [UserRole.ADULT_MEMBER]: 'bg-blue-100 text-blue-800',
    [UserRole.SENIOR_MEMBER]: 'bg-green-100 text-green-800',
    [UserRole.TEEN_MEMBER]: 'bg-yellow-100 text-yellow-800',
    [UserRole.CHILD_MEMBER]: 'bg-pink-100 text-pink-800',
    [UserRole.EMERGENCY_USER]: 'bg-orange-100 text-orange-800'
  };

  const canManageRoles = isSuperAdmin || isFamilyAdmin;

  const handleRoleChange = async (memberId: string, role: UserRole) => {
    try {
      const response = await apiClient.put(`/family/members/${memberId}/role`, { role });
      if (response.success) {
        setMembers(prev => prev.map(member => 
          member.id === memberId ? { ...member, role } : member
        ));
        setIsEditDialogOpen(false);
        setSelectedMember(null);
        setNewRole('');
      }
    } catch (error) {
      console.error('Failed to update member role:', error);
    }
  };

  const getAvailableRoles = (currentRole: UserRole): UserRole[] => {
    if (isSuperAdmin) {
      return Object.values(UserRole);
    }
    
    if (isFamilyAdmin) {
      // Family admins can assign family-level roles only
      return [
        UserRole.ADULT_MEMBER,
        UserRole.SENIOR_MEMBER,
        UserRole.TEEN_MEMBER,
        UserRole.CHILD_MEMBER
      ];
    }
    
    return [];
  };

  const openEditDialog = (member: FamilyMember) => {
    setSelectedMember(member);
    setNewRole(member.role);
    setIsEditDialogOpen(true);
  };

  return (
    <PermissionGate
      module={Module.FAMILY_MANAGEMENT}
      action={PermissionAction.VIEW}
      fallback={
        <Alert variant="destructive">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to view role management.
          </AlertDescription>
        </Alert>
      }
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Family Role Management
            </CardTitle>
            <CardDescription>
              Manage roles and permissions for family members
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading family members...</div>
            ) : members.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No family members found</div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Last Active</TableHead>
                      {canManageRoles && <TableHead>Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-sm text-muted-foreground">{member.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={roleColors[member.role]}>
                            {roleLabels[member.role]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                            {member.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {member.joinedAt.toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {member.lastActive.toLocaleDateString()}
                        </TableCell>
                        {canManageRoles && (
                          <TableCell>
                            <PermissionGate
                              module={Module.FAMILY_MANAGEMENT}
                              action={PermissionAction.EDIT}
                              resourceId={member.id}
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditDialog(member)}
                                className="mr-2"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </PermissionGate>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Role Change Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Role</DialogTitle>
              <DialogDescription>
                Change the role for {selectedMember?.name}
              </DialogDescription>
            </DialogHeader>
            
            {selectedMember && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Current Role</label>
                  <div className="mt-1">
                    <Badge className={roleColors[selectedMember.role]}>
                      {roleLabels[selectedMember.role]}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">New Role</label>
                  <Select value={newRole} onValueChange={(value) => setNewRole(value as UserRole)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableRoles(selectedMember.role).map((role) => (
                        <SelectItem key={role} value={role}>
                          {roleLabels[role]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {newRole && newRole !== selectedMember.role && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Changing roles will immediately update the user's permissions.
                      This action cannot be undone.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => selectedMember && newRole && handleRoleChange(selectedMember.id, newRole as UserRole)}
                disabled={!newRole || newRole === selectedMember?.role}
              >
                Update Role
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PermissionGate>
  );
}