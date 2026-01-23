/**
 * Permissions Demo Page
 * Demonstrates the complete RBAC permission system
 */

import React, { useState } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { Module, PermissionAction, UserRole } from '@/types/permissions';
import { PermissionGate, MultiplePermissionGate, RoleGate, PermissionConstraints, EmergencyAccessBanner } from '@/components/permissions/PermissionGate';
import { RoleManagement } from '@/components/permissions/RoleManagement';
import { PermissionMatrix } from '@/components/permissions/PermissionMatrix';
import { EmergencyAccess } from '@/components/permissions/EmergencyAccess';
import { runPermissionTests } from '@/lib/permissions/test';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Shield, Users, Grid, AlertTriangle, Eye, Edit, Trash2, Plus, Download, Settings, Lock, Play, CheckCircle, XCircle } from 'lucide-react';

export function PermissionsDemo() {
  const {
    userRole,
    userId,
    familyId,
    isSuperAdmin,
    isFamilyAdmin,
    isAdultMember,
    canView,
    canCreate,
    canEdit,
    canDelete,
    canExport,
    hasModuleAccess,
    getAllowedActions,
    checkPermission
  } = usePermissions();

  const [selectedModule, setSelectedModule] = useState<Module>(Module.EXPENSE_MANAGEMENT);
  const [testResults, setTestResults] = useState<any>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);

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

  const roleLabels: Record<UserRole, string> = {
    [UserRole.SUPER_ADMIN]: 'Super Admin',
    [UserRole.FAMILY_ADMIN]: 'Family Admin',
    [UserRole.ADULT_MEMBER]: 'Adult Member',
    [UserRole.SENIOR_MEMBER]: 'Senior Member',
    [UserRole.TEEN_MEMBER]: 'Teen Member',
    [UserRole.CHILD_MEMBER]: 'Child Member',
    [UserRole.EMERGENCY_USER]: 'Emergency User'
  };

  const runTests = async () => {
    setIsRunningTests(true);
    // Simulate async test execution
    await new Promise(resolve => setTimeout(resolve, 1000));
    const results = runPermissionTests();
    setTestResults(results);
    setIsRunningTests(false);
  };

  const renderPermissionDemo = () => {
    const allowedActions = getAllowedActions(selectedModule);
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Permission Testing for {moduleLabels[selectedModule]}
          </CardTitle>
          <CardDescription>
            Test your current permissions for different actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Your Role & Context</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Role: {roleLabels[userRole]}</Badge>
                <Badge variant="outline">User ID: {userId}</Badge>
                {familyId && <Badge variant="outline">Family ID: {familyId}</Badge>}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Module Access</h4>
              <Badge className={hasModuleAccess(selectedModule) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {hasModuleAccess(selectedModule) ? 'Has Access' : 'No Access'}
              </Badge>
            </div>

            <div>
              <h4 className="font-medium mb-2">Allowed Actions</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {Object.values(PermissionAction).map((action) => {
                  const isAllowed = allowedActions.includes(action);
                  const result = checkPermission(selectedModule, action);
                  
                  return (
                    <div key={action} className="p-3 border rounded">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{action}</span>
                        <Badge className={isAllowed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {isAllowed ? '✓' : '✗'}
                        </Badge>
                      </div>
                      {result.constraints && result.constraints.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          {result.constraints.length} constraint(s)
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Permission Constraints</h4>
              <PermissionConstraints
                module={selectedModule}
                action={PermissionAction.CREATE}
                className="space-y-1"
              />
            </div>

            <div>
              <h4 className="font-medium mb-2">Module Selection</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {Object.values(Module).map((module) => (
                  <Button
                    key={module}
                    variant={selectedModule === module ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedModule(module)}
                    className="justify-start"
                  >
                    {moduleLabels[module]}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderPermissionGateExamples = () => {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Single Permission Gates</CardTitle>
            <CardDescription>
              Components that show/hide based on single permissions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Expense Management Actions</h4>
              <div className="flex flex-wrap gap-2">
                <PermissionGate module={Module.EXPENSE_MANAGEMENT} action={PermissionAction.VIEW}>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Expenses
                  </Button>
                </PermissionGate>
                
                <PermissionGate module={Module.EXPENSE_MANAGEMENT} action={PermissionAction.CREATE}>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Expense
                  </Button>
                </PermissionGate>
                
                <PermissionGate module={Module.EXPENSE_MANAGEMENT} action={PermissionAction.EDIT}>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Expense
                  </Button>
                </PermissionGate>
                
                <PermissionGate module={Module.EXPENSE_MANAGEMENT} action={PermissionAction.DELETE}>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Expense
                  </Button>
                </PermissionGate>
                
                <PermissionGate module={Module.EXPENSE_MANAGEMENT} action={PermissionAction.EXPORT}>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </PermissionGate>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">System Administration</h4>
              <div className="flex flex-wrap gap-2">
                <PermissionGate module={Module.SYSTEM_CONFIG} action={PermissionAction.VIEW}>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    System Settings
                  </Button>
                </PermissionGate>
                
                <PermissionGate module={Module.AUDIT_LOGS} action={PermissionAction.VIEW}>
                  <Button variant="outline" size="sm">
                    <Shield className="h-4 w-4 mr-2" />
                    Audit Logs
                  </Button>
                </PermissionGate>
                
                <PermissionGate module={Module.EMERGENCY_ACCESS} action={PermissionAction.CREATE}>
                  <Button variant="outline" size="sm">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Grant Emergency Access
                  </Button>
                </PermissionGate>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Role-Based Gates</CardTitle>
            <CardDescription>
              Components that show/hide based on user roles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <RoleGate allowedRoles={[UserRole.SUPER_ADMIN]} showReason>
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  This content is only visible to Super Admins
                </AlertDescription>
              </Alert>
            </RoleGate>

            <RoleGate allowedRoles={[UserRole.SUPER_ADMIN, UserRole.FAMILY_ADMIN]} showReason>
              <Alert>
                <Users className="h-4 w-4" />
                <AlertDescription>
                  This content is visible to Super Admins and Family Admins
                </AlertDescription>
              </Alert>
            </RoleGate>

            <RoleGate allowedRoles={[UserRole.ADULT_MEMBER, UserRole.SENIOR_MEMBER]} showReason>
              <Alert>
                <Eye className="h-4 w-4" />
                <AlertDescription>
                  This content is visible to Adult and Senior Members
                </AlertDescription>
              </Alert>
            </RoleGate>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Multiple Permission Gates</CardTitle>
            <CardDescription>
              Components requiring multiple permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MultiplePermissionGate
              permissions={[
                { module: Module.EXPENSE_MANAGEMENT, action: PermissionAction.VIEW },
                { module: Module.EXPENSE_MANAGEMENT, action: PermissionAction.EXPORT }
              ]}
              requireAll={true}
              showReason
            >
              <Alert>
                <Download className="h-4 w-4" />
                <AlertDescription>
                  You can view AND export expense data
                </AlertDescription>
              </Alert>
            </MultiplePermissionGate>

            <MultiplePermissionGate
              permissions={[
                { module: Module.HEALTH_RECORDS, action: PermissionAction.VIEW },
                { module: Module.HEALTH_RECORDS, action: PermissionAction.EDIT }
              ]}
              requireAll={false}
              showReason
            >
              <Alert>
                <Eye className="h-4 w-4" />
                <AlertDescription>
                  You can view OR edit health records
                </AlertDescription>
              </Alert>
            </MultiplePermissionGate>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderTestRunner = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Permission System Tests
          </CardTitle>
          <CardDescription>
            Run comprehensive tests to verify the RBAC implementation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button 
                onClick={runTests} 
                disabled={isRunningTests}
                className="flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                {isRunningTests ? 'Running Tests...' : 'Run Permission Tests'}
              </Button>
              
              {testResults && (
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800">
                    {testResults.passed} Passed
                  </Badge>
                  <Badge className="bg-red-100 text-red-800">
                    {testResults.failed} Failed
                  </Badge>
                  <Badge variant="outline">
                    {Math.round((testResults.passed / (testResults.passed + testResults.failed)) * 100)}% Success
                  </Badge>
                </div>
              )}
            </div>

            {isRunningTests && (
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Running permission tests...</div>
                <Progress value={75} className="w-full" />
              </div>
            )}

            {testResults && (
              <div className="space-y-2">
                <h4 className="font-medium">Test Results</h4>
                <div className="max-h-64 overflow-y-auto space-y-1">
                  {testResults.results.map((result: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded text-sm">
                      {result.status === 'PASSED' ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className="flex-1">{result.name}</span>
                      <Badge className={result.status === 'PASSED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {result.status}
                      </Badge>
                    </div>
                  ))}
                </div>
                
                {testResults.failed === 0 && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      🎉 All tests passed! The permission system is working correctly.
                    </AlertDescription>
                  </Alert>
                )}
                
                {testResults.failed > 0 && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>
                      ⚠️ Some tests failed. Please review the permission implementation.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">RBAC Permission System</h1>
          <p className="text-muted-foreground">
            Comprehensive Role-Based Access Control demonstration
          </p>
        </div>
        <Badge className="bg-blue-100 text-blue-800">
          Current Role: {roleLabels[userRole]}
        </Badge>
      </div>

      <EmergencyAccessBanner />

      <Tabs defaultValue="demo" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="demo">Permission Demo</TabsTrigger>
          <TabsTrigger value="tests">System Tests</TabsTrigger>
          <TabsTrigger value="gates">Permission Gates</TabsTrigger>
          <TabsTrigger value="roles">Role Management</TabsTrigger>
          <TabsTrigger value="matrix">Permission Matrix</TabsTrigger>
          <TabsTrigger value="emergency">Emergency Access</TabsTrigger>
        </TabsList>

        <TabsContent value="demo" className="space-y-4">
          {renderPermissionDemo()}
        </TabsContent>

        <TabsContent value="tests" className="space-y-4">
          {renderTestRunner()}
        </TabsContent>

        <TabsContent value="gates" className="space-y-4">
          {renderPermissionGateExamples()}
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <RoleManagement />
        </TabsContent>

        <TabsContent value="matrix" className="space-y-4">
          <PermissionMatrix />
        </TabsContent>

        <TabsContent value="emergency" className="space-y-4">
          <EmergencyAccess />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default PermissionsDemo;