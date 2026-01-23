/**
 * Permission-Aware System Actions Component
 * Demonstrates system-level permission integration for Super Admin
 */

import React from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { Module, PermissionAction, UserRole } from '@/types/permissions';
import { PermissionGate, RoleGate } from '@/components/permissions/PermissionGate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Settings, 
  Users, 
  Shield, 
  Database, 
  Activity, 
  AlertTriangle, 
  Download, 
  Upload,
  Lock,
  Unlock,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

export function PermissionAwareSystemActions() {
  const { 
    userRole, 
    isSuperAdmin, 
    isFamilyAdmin,
    canView,
    canCreate,
    canEdit,
    canDelete,
    canExport,
    canOverride,
    canAudit,
    hasModuleAccess
  } = usePermissions();

  const systemModules = [
    Module.SYSTEM_CONFIG,
    Module.AUDIT_LOGS,
    Module.AUTHENTICATION,
    Module.FAMILY_MANAGEMENT,
    Module.EMERGENCY_ACCESS
  ];

  return (
    <div className="space-y-6">
      {/* Role Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            System Access Status
          </CardTitle>
          <CardDescription>
            Your current role and system-level permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className={isSuperAdmin ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}>
                {userRole}
              </Badge>
              {isSuperAdmin && (
                <Badge className="bg-green-100 text-green-800">
                  Platform Authority
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {systemModules.map((module) => (
                <div key={module} className="p-3 border rounded">
                  <div className="font-medium text-sm mb-1">{module.replace('_', ' ')}</div>
                  <Badge className={hasModuleAccess(module) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {hasModuleAccess(module) ? 'Access' : 'No Access'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Configuration Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            System Configuration
          </CardTitle>
          <CardDescription>
            Platform-wide settings and configuration management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <PermissionGate
              module={Module.SYSTEM_CONFIG}
              action={PermissionAction.VIEW}
              fallback={
                <div className="p-4 border rounded bg-muted/50">
                  <Lock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground text-center">No access to system settings</p>
                </div>
              }
            >
              <div className="p-4 border rounded">
                <Settings className="h-8 w-8 text-primary mb-2" />
                <h4 className="font-medium mb-1">Global Settings</h4>
                <p className="text-sm text-muted-foreground mb-3">Configure platform-wide settings</p>
                
                <div className="space-y-2">
                  <PermissionGate module={Module.SYSTEM_CONFIG} action={PermissionAction.EDIT}>
                    <Button size="sm" className="w-full">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Settings
                    </Button>
                  </PermissionGate>
                  
                  <PermissionGate module={Module.SYSTEM_CONFIG} action={PermissionAction.EXPORT}>
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Export Config
                    </Button>
                  </PermissionGate>
                </div>
              </div>
            </PermissionGate>

            <PermissionGate
              module={Module.SYSTEM_CONFIG}
              action={PermissionAction.OVERRIDE}
              fallback={
                <div className="p-4 border rounded bg-muted/50">
                  <Lock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground text-center">No override permissions</p>
                </div>
              }
            >
              <div className="p-4 border rounded">
                <Unlock className="h-8 w-8 text-orange-500 mb-2" />
                <h4 className="font-medium mb-1">System Overrides</h4>
                <p className="text-sm text-muted-foreground mb-3">Override system constraints</p>
                
                <Button variant="outline" size="sm" className="w-full">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Emergency Override
                </Button>
              </div>
            </PermissionGate>

            <PermissionGate
              module={Module.SYSTEM_CONFIG}
              action={PermissionAction.DELETE}
              fallback={
                <div className="p-4 border rounded bg-muted/50">
                  <Lock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground text-center">No deletion permissions</p>
                </div>
              }
            >
              <div className="p-4 border rounded">
                <Trash2 className="h-8 w-8 text-red-500 mb-2" />
                <h4 className="font-medium mb-1">System Cleanup</h4>
                <p className="text-sm text-muted-foreground mb-3">Remove system data</p>
                
                <Button variant="destructive" size="sm" className="w-full">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Cleanup Data
                </Button>
              </div>
            </PermissionGate>
          </div>
        </CardContent>
      </Card>

      {/* User Management Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Management
          </CardTitle>
          <CardDescription>
            Platform-wide user administration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PermissionGate
              module={Module.AUTHENTICATION}
              action={PermissionAction.VIEW}
            >
              <div className="p-4 border rounded">
                <Eye className="h-8 w-8 text-blue-500 mb-2" />
                <h4 className="font-medium mb-1">View All Users</h4>
                <p className="text-sm text-muted-foreground mb-3">Access global user directory</p>
                
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <Users className="h-4 w-4 mr-2" />
                    User Directory
                  </Button>
                  
                  <PermissionGate module={Module.AUTHENTICATION} action={PermissionAction.EXPORT}>
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Export Users
                    </Button>
                  </PermissionGate>
                </div>
              </div>
            </PermissionGate>

            <PermissionGate
              module={Module.AUTHENTICATION}
              action={PermissionAction.CREATE}
            >
              <div className="p-4 border rounded">
                <Users className="h-8 w-8 text-green-500 mb-2" />
                <h4 className="font-medium mb-1">Create Users</h4>
                <p className="text-sm text-muted-foreground mb-3">Add new platform users</p>
                
                <div className="space-y-2">
                  <Button size="sm" className="w-full">
                    <Users className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                  
                  <Button variant="outline" size="sm" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Bulk Import
                  </Button>
                </div>
              </div>
            </PermissionGate>
          </div>
        </CardContent>
      </Card>

      {/* Audit and Monitoring */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Monitoring
          </CardTitle>
          <CardDescription>
            Platform audit logs and system monitoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PermissionGate
              module={Module.AUDIT_LOGS}
              action={PermissionAction.VIEW}
              fallback={
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    No access to audit logs
                  </AlertDescription>
                </Alert>
              }
            >
              <div className="p-4 border rounded">
                <Activity className="h-8 w-8 text-purple-500 mb-2" />
                <h4 className="font-medium mb-1">System Audit Logs</h4>
                <p className="text-sm text-muted-foreground mb-3">View all platform activities</p>
                
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    View Logs
                  </Button>
                  
                  <PermissionGate module={Module.AUDIT_LOGS} action={PermissionAction.EXPORT}>
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Export Logs
                    </Button>
                  </PermissionGate>
                </div>
              </div>
            </PermissionGate>

            <PermissionGate
              module={Module.EMERGENCY_ACCESS}
              action={PermissionAction.VIEW}
            >
              <div className="p-4 border rounded">
                <AlertTriangle className="h-8 w-8 text-orange-500 mb-2" />
                <h4 className="font-medium mb-1">Emergency Access</h4>
                <p className="text-sm text-muted-foreground mb-3">Monitor emergency access grants</p>
                
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    View Emergency Access
                  </Button>
                  
                  <PermissionGate module={Module.EMERGENCY_ACCESS} action={PermissionAction.CREATE}>
                    <Button size="sm" className="w-full">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Grant Emergency Access
                    </Button>
                  </PermissionGate>
                </div>
              </div>
            </PermissionGate>
          </div>
        </CardContent>
      </Card>

      {/* Role-Based Sections */}
      <RoleGate allowedRoles={[UserRole.SUPER_ADMIN]}>
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Super Admin Exclusive:</strong> You have unrestricted access to all platform functions.
            Use these powers responsibly and ensure all actions are properly audited.
          </AlertDescription>
        </Alert>
      </RoleGate>

      <RoleGate 
        allowedRoles={[UserRole.FAMILY_ADMIN]} 
        fallback={
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Family Admin features are not available to your current role.
            </AlertDescription>
          </Alert>
        }
      >
        <Alert>
          <Users className="h-4 w-4" />
          <AlertDescription>
            <strong>Family Admin:</strong> You have administrative access within your family context.
            System-wide functions are restricted.
          </AlertDescription>
        </Alert>
      </RoleGate>
    </div>
  );
}