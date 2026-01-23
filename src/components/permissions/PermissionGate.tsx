/**
 * Permission Gate Component
 * Conditionally renders content based on permissions
 */

import React from 'react';
import { usePermission, useModuleAccess } from '@/hooks/usePermissions';
import { PermissionAction, Module } from '@/types/permissions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Lock, Clock, AlertTriangle } from 'lucide-react';

interface PermissionGateProps {
  children: React.ReactNode;
  module: Module;
  action?: PermissionAction;
  resourceId?: string;
  metadata?: Record<string, any>;
  fallback?: React.ReactNode;
  showReason?: boolean;
  requireAll?: boolean; // For multiple permissions
}

/**
 * Single Permission Gate
 */
export function PermissionGate({
  children,
  module,
  action,
  resourceId,
  metadata,
  fallback,
  showReason = false
}: PermissionGateProps) {
  // If no action specified, check module access
  const hasModuleAccess = useModuleAccess(module);
  const permissionResult = usePermission(
    module,
    action || PermissionAction.VIEW,
    resourceId,
    metadata
  );

  const isAllowed = action ? permissionResult.allowed : hasModuleAccess;

  if (isAllowed) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (showReason && permissionResult.reason) {
    return (
      <Alert variant="destructive" className="my-4">
        <Lock className="h-4 w-4" />
        <AlertDescription>
          Access Denied: {permissionResult.reason}
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}

/**
 * Multiple Permissions Gate
 */
interface MultiplePermissionGateProps {
  children: React.ReactNode;
  permissions: Array<{
    module: Module;
    action: PermissionAction;
    resourceId?: string;
    metadata?: Record<string, any>;
  }>;
  requireAll?: boolean;
  fallback?: React.ReactNode;
  showReason?: boolean;
}

export function MultiplePermissionGate({
  children,
  permissions,
  requireAll = true,
  fallback,
  showReason = false
}: MultiplePermissionGateProps) {
  const { checkMultiplePermissions } = usePermissions();
  
  const results = checkMultiplePermissions(permissions.map((perm, index) => ({
    ...perm,
    key: `${perm.module}_${perm.action}_${index}`
  })));

  const resultValues = Object.values(results);
  const isAllowed = requireAll 
    ? resultValues.every(result => result.allowed)
    : resultValues.some(result => result.allowed);

  if (isAllowed) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (showReason) {
    const deniedReasons = resultValues
      .filter(result => !result.allowed)
      .map(result => result.reason)
      .filter(Boolean);

    if (deniedReasons.length > 0) {
      return (
        <Alert variant="destructive" className="my-4">
          <Lock className="h-4 w-4" />
          <AlertDescription>
            Access Denied: {deniedReasons.join(', ')}
          </AlertDescription>
        </Alert>
      );
    }
  }

  return null;
}

/**
 * Role-based Gate
 */
interface RoleGateProps {
  children: React.ReactNode;
  allowedRoles: string[];
  fallback?: React.ReactNode;
  showReason?: boolean;
}

export function RoleGate({
  children,
  allowedRoles,
  fallback,
  showReason = false
}: RoleGateProps) {
  const { userRole } = usePermissions();
  
  const isAllowed = allowedRoles.includes(userRole);

  if (isAllowed) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (showReason) {
    return (
      <Alert variant="destructive" className="my-4">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Access Denied: Required role not met. Your role: {userRole}
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}

/**
 * Permission Constraints Display
 */
interface PermissionConstraintsProps {
  module: Module;
  action: PermissionAction;
  resourceId?: string;
  metadata?: Record<string, any>;
  className?: string;
}

export function PermissionConstraints({
  module,
  action,
  resourceId,
  metadata,
  className
}: PermissionConstraintsProps) {
  const permissionResult = usePermission(module, action, resourceId, metadata);

  if (!permissionResult.allowed || !permissionResult.constraints?.length) {
    return null;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {permissionResult.constraints.map((constraint, index) => {
        const getIcon = () => {
          switch (constraint.type) {
            case 'TIME_LIMIT':
              return <Clock className="h-4 w-4" />;
            case 'IP_RESTRICTION':
              return <Shield className="h-4 w-4" />;
            case 'READ_ONLY':
              return <Lock className="h-4 w-4" />;
            default:
              return <AlertTriangle className="h-4 w-4" />;
          }
        };

        const getVariant = () => {
          switch (constraint.type) {
            case 'TIME_LIMIT':
              return 'default';
            case 'IP_RESTRICTION':
              return 'secondary';
            case 'READ_ONLY':
              return 'outline';
            default:
              return 'destructive';
          }
        };

        return (
          <Alert key={index} variant={getVariant() as any} className="py-2">
            {getIcon()}
            <AlertDescription className="text-sm">
              {constraint.message}
            </AlertDescription>
          </Alert>
        );
      })}
    </div>
  );
}

/**
 * Emergency Access Banner
 */
interface EmergencyAccessBannerProps {
  className?: string;
}

export function EmergencyAccessBanner({ className }: EmergencyAccessBannerProps) {
  // This would check if current user has emergency access
  // For now, we'll show a placeholder
  const hasEmergencyAccess = false; // TODO: Implement emergency access check

  if (!hasEmergencyAccess) {
    return null;
  }

  return (
    <Alert variant="destructive" className={`border-orange-500 bg-orange-50 ${className}`}>
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertDescription className="text-orange-800">
        <strong>Emergency Access Active</strong> - Your actions are being logged. 
        Access expires in 45 minutes.
      </AlertDescription>
    </Alert>
  );
}