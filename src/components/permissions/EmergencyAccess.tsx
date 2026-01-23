/**
 * Emergency Access Component
 * Manages emergency access grants and monitoring
 */

import React, { useState } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { UserRole, Module, PermissionAction, EmergencyAccess as EmergencyAccessType } from '@/types/permissions';
import { PermissionGate } from './PermissionGate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertTriangle, Clock, Shield, Eye, Plus, X, Activity } from 'lucide-react';

// Mock data for demonstration
const mockEmergencyAccess: EmergencyAccessType[] = [
  {
    id: '1',
    userId: 'user-123',
    familyId: 'family-1',
    grantedBy: 'admin-456',
    grantedAt: new Date('2024-01-22T10:00:00Z'),
    expiresAt: new Date('2024-01-22T16:00:00Z'),
    modules: [Module.HEALTH_RECORDS, Module.EXPENSE_MANAGEMENT],
    actions: [PermissionAction.VIEW, PermissionAction.EXPORT],
    ipRestrictions: ['192.168.1.100', '10.0.0.50'],
    isActive: true,
    auditLog: [
      {
        timestamp: new Date('2024-01-22T10:05:00Z'),
        action: 'ACCESS_GRANTED',
        userId: 'user-123',
        ipAddress: '192.168.1.100',
        details: { module: 'HEALTH_RECORDS', resource: 'medical-report-456' }
      }
    ]
  }
];

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

interface GrantEmergencyAccessForm {
  userId: string;
  reason: string;
  duration: number; // hours
  modules: Module[];
  actions: PermissionAction[];
  ipRestrictions: string[];
}

export function EmergencyAccess() {
  const { isSuperAdmin, isFamilyAdmin, canCreate, canView } = usePermissions();
  const [emergencyAccess, setEmergencyAccess] = useState<EmergencyAccessType[]>(mockEmergencyAccess);
  const [isGrantDialogOpen, setIsGrantDialogOpen] = useState(false);
  const [grantForm, setGrantForm] = useState<GrantEmergencyAccessForm>({
    userId: '',
    reason: '',
    duration: 6,
    modules: [],
    actions: [PermissionAction.VIEW],
    ipRestrictions: []
  });

  const canManageEmergencyAccess = isSuperAdmin || isFamilyAdmin;

  const handleGrantAccess = () => {
    const newAccess: EmergencyAccessType = {
      id: `emergency-${Date.now()}`,
      userId: grantForm.userId,
      familyId: 'current-family-id', // Would come from context
      grantedBy: 'current-user-id', // Would come from auth context
      grantedAt: new Date(),
      expiresAt: new Date(Date.now() + grantForm.duration * 60 * 60 * 1000),
      modules: grantForm.modules,
      actions: grantForm.actions,
      ipRestrictions: grantForm.ipRestrictions.filter(ip => ip.trim()),
      isActive: true,
      auditLog: []
    };

    setEmergencyAccess(prev => [...prev, newAccess]);
    setIsGrantDialogOpen(false);
    setGrantForm({
      userId: '',
      reason: '',
      duration: 6,
      modules: [],
      actions: [PermissionAction.VIEW],
      ipRestrictions: []
    });
  };

  const revokeAccess = (accessId: string) => {
    setEmergencyAccess(prev => 
      prev.map(access => 
        access.id === accessId 
          ? { ...access, isActive: false }
          : access
      )
    );
  };

  const getTimeRemaining = (expiresAt: Date) => {
    const now = new Date();
    const remaining = expiresAt.getTime() - now.getTime();
    
    if (remaining <= 0) return 'Expired';
    
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const getStatusBadge = (access: EmergencyAccessType) => {
    const now = new Date();
    const isExpired = now > access.expiresAt;
    
    if (!access.isActive) {
      return <Badge variant="secondary">Revoked</Badge>;
    } else if (isExpired) {
      return <Badge variant="destructive">Expired</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-800">Active</Badge>;
    }
  };

  return (
    <PermissionGate
      module={Module.EMERGENCY_ACCESS}
      action={PermissionAction.VIEW}
      fallback={
        <Alert variant="destructive">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to view emergency access.
          </AlertDescription>
        </Alert>
      }
    >
      <div className="space-y-6">
        {/* Active Emergency Access Banner */}
        {emergencyAccess.some(access => access.isActive && new Date() < access.expiresAt) && (
          <Alert variant="destructive" className="border-orange-500 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Emergency Access Active</strong> - There are active emergency access grants. 
              All actions are being logged and monitored.
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Emergency Access Management
                </CardTitle>
                <CardDescription>
                  Grant and monitor time-limited emergency access to family data
                </CardDescription>
              </div>
              {canManageEmergencyAccess && (
                <PermissionGate
                  module={Module.EMERGENCY_ACCESS}
                  action={PermissionAction.CREATE}
                >
                  <Dialog open={isGrantDialogOpen} onOpenChange={setIsGrantDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Grant Emergency Access
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Grant Emergency Access</DialogTitle>
                        <DialogDescription>
                          Grant temporary, limited access to family data for emergency situations
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="userId">User ID or Email</Label>
                          <Input
                            id="userId"
                            value={grantForm.userId}
                            onChange={(e) => setGrantForm(prev => ({ ...prev, userId: e.target.value }))}
                            placeholder="Enter user ID or email"
                          />
                        </div>

                        <div>
                          <Label htmlFor="reason">Reason for Emergency Access</Label>
                          <Textarea
                            id="reason"
                            value={grantForm.reason}
                            onChange={(e) => setGrantForm(prev => ({ ...prev, reason: e.target.value }))}
                            placeholder="Describe the emergency situation requiring access"
                            rows={3}
                          />
                        </div>

                        <div>
                          <Label htmlFor="duration">Duration (hours)</Label>
                          <Select 
                            value={grantForm.duration.toString()} 
                            onValueChange={(value) => setGrantForm(prev => ({ ...prev, duration: parseInt(value) }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 hour</SelectItem>
                              <SelectItem value="2">2 hours</SelectItem>
                              <SelectItem value="4">4 hours</SelectItem>
                              <SelectItem value="6">6 hours</SelectItem>
                              <SelectItem value="12">12 hours</SelectItem>
                              <SelectItem value="24">24 hours</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Modules</Label>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {Object.values(Module).map((module) => (
                              <div key={module} className="flex items-center space-x-2">
                                <Checkbox
                                  id={module}
                                  checked={grantForm.modules.includes(module)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setGrantForm(prev => ({ 
                                        ...prev, 
                                        modules: [...prev.modules, module] 
                                      }));
                                    } else {
                                      setGrantForm(prev => ({ 
                                        ...prev, 
                                        modules: prev.modules.filter(m => m !== module) 
                                      }));
                                    }
                                  }}
                                />
                                <Label htmlFor={module} className="text-sm">
                                  {moduleLabels[module]}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label>Actions</Label>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {Object.values(PermissionAction).map((action) => (
                              <div key={action} className="flex items-center space-x-2">
                                <Checkbox
                                  id={action}
                                  checked={grantForm.actions.includes(action)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setGrantForm(prev => ({ 
                                        ...prev, 
                                        actions: [...prev.actions, action] 
                                      }));
                                    } else {
                                      setGrantForm(prev => ({ 
                                        ...prev, 
                                        actions: prev.actions.filter(a => a !== action) 
                                      }));
                                    }
                                  }}
                                />
                                <Label htmlFor={action} className="text-sm">
                                  {actionLabels[action]}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="ipRestrictions">IP Restrictions (optional)</Label>
                          <Textarea
                            id="ipRestrictions"
                            value={grantForm.ipRestrictions.join('\n')}
                            onChange={(e) => setGrantForm(prev => ({ 
                              ...prev, 
                              ipRestrictions: e.target.value.split('\n').filter(ip => ip.trim()) 
                            }))}
                            placeholder="Enter IP addresses (one per line)"
                            rows={3}
                          />
                        </div>

                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            Emergency access is automatically logged and monitored. 
                            Access will expire after the specified duration and cannot be extended.
                          </AlertDescription>
                        </Alert>
                      </div>

                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsGrantDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleGrantAccess}
                          disabled={!grantForm.userId || !grantForm.reason || grantForm.modules.length === 0}
                        >
                          Grant Access
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </PermissionGate>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Modules</TableHead>
                    <TableHead>Actions</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Granted By</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emergencyAccess.map((access) => (
                    <TableRow key={access.id}>
                      <TableCell>
                        <div className="font-medium">{access.userId}</div>
                        <div className="text-sm text-muted-foreground">
                          {access.ipRestrictions?.length ? 
                            `IP: ${access.ipRestrictions.join(', ')}` : 
                            'No IP restrictions'
                          }
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(access)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {access.modules.map((module) => (
                            <Badge key={module} variant="outline" className="text-xs">
                              {moduleLabels[module]}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {access.actions.map((action) => (
                            <Badge key={action} variant="secondary" className="text-xs">
                              {actionLabels[action]}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">{getTimeRemaining(access.expiresAt)}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {access.expiresAt.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        {access.grantedBy}
                      </TableCell>
                      <TableCell>
                        {access.isActive && new Date() < access.expiresAt && (
                          <PermissionGate
                            module={Module.EMERGENCY_ACCESS}
                            action={PermissionAction.DELETE}
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => revokeAccess(access.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </PermissionGate>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Audit Log */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Emergency Access Audit Log
            </CardTitle>
            <CardDescription>
              All emergency access activities are logged here
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {emergencyAccess.flatMap(access => 
                access.auditLog.map((entry, index) => (
                  <div key={`${access.id}-${index}`} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">{entry.action}</div>
                      <div className="text-sm text-muted-foreground">
                        User: {entry.userId} | IP: {entry.ipAddress}
                      </div>
                      {entry.details && (
                        <div className="text-xs text-muted-foreground">
                          {JSON.stringify(entry.details)}
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {entry.timestamp.toLocaleString()}
                    </div>
                  </div>
                ))
              )}
              {emergencyAccess.every(access => access.auditLog.length === 0) && (
                <div className="text-center text-muted-foreground py-8">
                  No audit entries yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </PermissionGate>
  );
}