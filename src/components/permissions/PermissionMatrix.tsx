/**
 * Permission Matrix Component
 * Visual display of permissions across roles and modules
 */

import React, { useState } from 'react';
import { UserRole, Module, PermissionAction } from '@/types/permissions';
import { PERMISSION_MATRIX } from '@/lib/permissions/matrix';
import { usePermissions } from '@/hooks/usePermissions';
import { PermissionGate } from './PermissionGate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Check, X, AlertTriangle, Eye, Filter } from 'lucide-react';

const roleLabels: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: 'Super Admin',
  [UserRole.FAMILY_ADMIN]: 'Family Admin',
  [UserRole.ADULT_MEMBER]: 'Adult Member',
  [UserRole.SENIOR_MEMBER]: 'Senior Member',
  [UserRole.TEEN_MEMBER]: 'Teen Member',
  [UserRole.CHILD_MEMBER]: 'Child Member',
  [UserRole.EMERGENCY_USER]: 'Emergency User'
};

const moduleLabels: Record<Module, string> = {
  [Module.AUTHENTICATION]: 'Authentication',
  [Module.FAMILY_MANAGEMENT]: 'Family Management',
  [Module.EXPENSE_MANAGEMENT]: 'Expense Management',
  [Module.HEALTH_RECORDS]: 'Health Records',
  [Module.RESPONSIBILITY_ENGINE]: 'Tasks & Responsibilities',
  [Module.NOTIFICATIONS]: 'Notifications',
  [Module.UI_MODE_CONTROL]: 'UI Mode Control',
  [Module.AUDIT_LOGS]: 'Audit Logs',
  [Module.SYSTEM_CONFIG]: 'System Configuration',
  [Module.EMERGENCY_ACCESS]: 'Emergency Access'
};

const actionLabels: Record<PermissionAction, string> = {
  [PermissionAction.VIEW]: 'View',
  [PermissionAction.CREATE]: 'Create',
  [PermissionAction.EDIT]: 'Edit',
  [PermissionAction.DELETE]: 'Delete',
  [PermissionAction.APPROVE]: 'Approve',
  [PermissionAction.EXPORT]: 'Export',
  [PermissionAction.OVERRIDE]: 'Override',
  [PermissionAction.AUDIT]: 'Audit'
};

const getPermissionIcon = (permission: boolean | 'CONDITIONAL') => {
  if (permission === true) {
    return <Check className="h-4 w-4 text-green-600" />;
  } else if (permission === 'CONDITIONAL') {
    return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
  } else {
    return <X className="h-4 w-4 text-red-600" />;
  }
};

const getPermissionBadge = (permission: boolean | 'CONDITIONAL') => {
  if (permission === true) {
    return <Badge className="bg-green-100 text-green-800">Allowed</Badge>;
  } else if (permission === 'CONDITIONAL') {
    return <Badge className="bg-yellow-100 text-yellow-800">Conditional</Badge>;
  } else {
    return <Badge className="bg-red-100 text-red-800">Denied</Badge>;
  }
};

export function PermissionMatrix() {
  const { isSuperAdmin, isFamilyAdmin } = usePermissions();
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.FAMILY_ADMIN);
  const [selectedModule, setSelectedModule] = useState<Module | 'ALL'>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  const canViewMatrix = isSuperAdmin || isFamilyAdmin;

  const filteredModules = selectedModule === 'ALL' 
    ? Object.values(Module) 
    : [selectedModule as Module];

  const renderRolePermissions = (role: UserRole) => {
    return (
      <div className="space-y-4">
        {filteredModules.map((module) => (
          <Card key={module}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{moduleLabels[module]}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.values(PermissionAction).map((action) => {
                  const permission = PERMISSION_MATRIX[role][module][action];
                  return (
                    <div key={action} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm font-medium">{actionLabels[action]}</span>
                      {getPermissionIcon(permission)}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderMatrixTable = () => {
    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Module</TableHead>
              {Object.values(PermissionAction).map((action) => (
                <TableHead key={action} className="text-center min-w-[100px]">
                  {actionLabels[action]}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredModules.map((module) => (
              <TableRow key={module}>
                <TableCell className="font-medium">
                  {moduleLabels[module]}
                </TableCell>
                {Object.values(PermissionAction).map((action) => {
                  const permission = PERMISSION_MATRIX[selectedRole][module][action];
                  return (
                    <TableCell key={action} className="text-center">
                      {getPermissionBadge(permission)}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <PermissionGate
      module={Module.SYSTEM_CONFIG}
      action={PermissionAction.VIEW}
      fallback={
        <Alert variant="destructive">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to view the permission matrix.
          </AlertDescription>
        </Alert>
      }
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Permission Matrix
            </CardTitle>
            <CardDescription>
              View permissions across all roles and modules
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <label className="text-sm font-medium">Role</label>
                <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(UserRole).map((role) => (
                      <SelectItem key={role} value={role}>
                        {roleLabels[role]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1">
                <label className="text-sm font-medium">Module</label>
                <Select value={selectedModule} onValueChange={setSelectedModule}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Modules</SelectItem>
                    {Object.values(Module).map((module) => (
                      <SelectItem key={module} value={module}>
                        {moduleLabels[module]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <label className="text-sm font-medium">View</label>
                <Select value={viewMode} onValueChange={(value) => setViewMode(value as 'grid' | 'table')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="table">Table View</SelectItem>
                    <SelectItem value="grid">Grid View</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'grid' | 'table')}>
              <TabsList className="mb-4">
                <TabsTrigger value="table">Table View</TabsTrigger>
                <TabsTrigger value="grid">Grid View</TabsTrigger>
              </TabsList>
              
              <TabsContent value="table">
                {renderMatrixTable()}
              </TabsContent>
              
              <TabsContent value="grid">
                {renderRolePermissions(selectedRole)}
              </TabsContent>
            </Tabs>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Legend</h4>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>Allowed - Full permission granted</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span>Conditional - Permission depends on context</span>
                </div>
                <div className="flex items-center gap-2">
                  <X className="h-4 w-4 text-red-600" />
                  <span>Denied - Permission not granted</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PermissionGate>
  );
}