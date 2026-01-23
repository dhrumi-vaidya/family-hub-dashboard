/**
 * React Hook for Permission Management
 * Provides easy access to permission checks in components
 */

import { useMemo } from 'react';
import { useAuth, UserRole as AuthUserRole } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { 
  PermissionContext, 
  PermissionResult, 
  PermissionAction, 
  Module, 
  UserRole 
} from '@/types/permissions';
import { PermissionEngine } from '@/lib/permissions/engine';

// Map AuthContext roles to Permission system roles
const mapToPermissionRole = (authRole: AuthUserRole, globalRole: 'SUPER_ADMIN' | 'USER'): UserRole => {
  if (globalRole === 'SUPER_ADMIN') {
    return UserRole.SUPER_ADMIN;
  }
  
  switch (authRole) {
    case 'FAMILY_ADMIN':
      return UserRole.FAMILY_ADMIN;
    case 'ADULT':
      return UserRole.ADULT_MEMBER;
    case 'SENIOR':
      return UserRole.SENIOR_MEMBER;
    case 'TEEN':
      return UserRole.TEEN_MEMBER;
    case 'CHILD':
      return UserRole.CHILD_MEMBER;
    case 'EMERGENCY':
      return UserRole.EMERGENCY_USER;
    default:
      return UserRole.ADULT_MEMBER;
  }
};

export interface UsePermissionsReturn {
  // Core permission checks
  checkPermission: (
    module: Module,
    action: PermissionAction,
    resourceId?: string,
    metadata?: Record<string, any>
  ) => PermissionResult;
  
  // Convenience methods
  canView: (module: Module, resourceId?: string, metadata?: Record<string, any>) => boolean;
  canCreate: (module: Module, metadata?: Record<string, any>) => boolean;
  canEdit: (module: Module, resourceId?: string, metadata?: Record<string, any>) => boolean;
  canDelete: (module: Module, resourceId?: string, metadata?: Record<string, any>) => boolean;
  canExport: (module: Module, resourceId?: string, metadata?: Record<string, any>) => boolean;
  canApprove: (module: Module, resourceId?: string, metadata?: Record<string, any>) => boolean;
  canOverride: (module: Module, resourceId?: string, metadata?: Record<string, any>) => boolean;
  canAudit: (module: Module, resourceId?: string, metadata?: Record<string, any>) => boolean;
  
  // Module access
  hasModuleAccess: (module: Module) => boolean;
  getAllowedActions: (module: Module) => PermissionAction[];
  
  // Role checks
  isSuperAdmin: boolean;
  isFamilyAdmin: boolean;
  isAdultMember: boolean;
  isSeniorMember: boolean;
  isTeenMember: boolean;
  isChildMember: boolean;
  isEmergencyUser: boolean;
  
  // Context info
  userRole: UserRole;
  familyId?: string;
  userId: string;
  
  // Batch operations
  checkMultiplePermissions: (
    checks: Array<{
      module: Module;
      action: PermissionAction;
      resourceId?: string;
      metadata?: Record<string, any>;
    }>
  ) => Record<string, PermissionResult>;
}

export function usePermissions(): UsePermissionsReturn {
  const { user, selectedFamily } = useAuth();
  const { currentFamily } = useApp();

  // Build permission context
  const permissionContext: PermissionContext = useMemo(() => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get user's role in the selected family
    const familyRole = selectedFamily?.role || 'ADULT';
    const permissionRole = mapToPermissionRole(familyRole, user.globalRole);

    return {
      userId: user.id,
      familyId: selectedFamily?.id || currentFamily?.id,
      role: permissionRole,
      // Note: isOwner and emergencyAccess would be set per resource check
    };
  }, [user, selectedFamily, currentFamily]);

  // Core permission check function
  const checkPermission = useMemo(() => {
    return (
      module: Module,
      action: PermissionAction,
      resourceId?: string,
      metadata?: Record<string, any>
    ): PermissionResult => {
      return PermissionEngine.checkPermission(
        permissionContext,
        module,
        action,
        resourceId,
        metadata
      );
    };
  }, [permissionContext]);

  // Convenience methods
  const canView = useMemo(() => {
    return (module: Module, resourceId?: string, metadata?: Record<string, any>): boolean => {
      return checkPermission(module, PermissionAction.VIEW, resourceId, metadata).allowed;
    };
  }, [checkPermission]);

  const canCreate = useMemo(() => {
    return (module: Module, metadata?: Record<string, any>): boolean => {
      return checkPermission(module, PermissionAction.CREATE, undefined, metadata).allowed;
    };
  }, [checkPermission]);

  const canEdit = useMemo(() => {
    return (module: Module, resourceId?: string, metadata?: Record<string, any>): boolean => {
      return checkPermission(module, PermissionAction.EDIT, resourceId, metadata).allowed;
    };
  }, [checkPermission]);

  const canDelete = useMemo(() => {
    return (module: Module, resourceId?: string, metadata?: Record<string, any>): boolean => {
      return checkPermission(module, PermissionAction.DELETE, resourceId, metadata).allowed;
    };
  }, [checkPermission]);

  const canExport = useMemo(() => {
    return (module: Module, resourceId?: string, metadata?: Record<string, any>): boolean => {
      return checkPermission(module, PermissionAction.EXPORT, resourceId, metadata).allowed;
    };
  }, [checkPermission]);

  const canApprove = useMemo(() => {
    return (module: Module, resourceId?: string, metadata?: Record<string, any>): boolean => {
      return checkPermission(module, PermissionAction.APPROVE, resourceId, metadata).allowed;
    };
  }, [checkPermission]);

  const canOverride = useMemo(() => {
    return (module: Module, resourceId?: string, metadata?: Record<string, any>): boolean => {
      return checkPermission(module, PermissionAction.OVERRIDE, resourceId, metadata).allowed;
    };
  }, [checkPermission]);

  const canAudit = useMemo(() => {
    return (module: Module, resourceId?: string, metadata?: Record<string, any>): boolean => {
      return checkPermission(module, PermissionAction.AUDIT, resourceId, metadata).allowed;
    };
  }, [checkPermission]);

  // Module access
  const hasModuleAccess = useMemo(() => {
    return (module: Module): boolean => {
      return PermissionEngine.hasModuleAccess(permissionContext, module);
    };
  }, [permissionContext]);

  const getAllowedActions = useMemo(() => {
    return (module: Module): PermissionAction[] => {
      return PermissionEngine.getAllowedActions(permissionContext, module);
    };
  }, [permissionContext]);

  // Role checks
  const roleChecks = useMemo(() => {
    const role = permissionContext.role;
    return {
      isSuperAdmin: role === UserRole.SUPER_ADMIN,
      isFamilyAdmin: role === UserRole.FAMILY_ADMIN,
      isAdultMember: role === UserRole.ADULT_MEMBER,
      isSeniorMember: role === UserRole.SENIOR_MEMBER,
      isTeenMember: role === UserRole.TEEN_MEMBER,
      isChildMember: role === UserRole.CHILD_MEMBER,
      isEmergencyUser: role === UserRole.EMERGENCY_USER,
    };
  }, [permissionContext.role]);

  // Batch operations
  const checkMultiplePermissions = useMemo(() => {
    return (
      checks: Array<{
        module: Module;
        action: PermissionAction;
        resourceId?: string;
        metadata?: Record<string, any>;
      }>
    ): Record<string, PermissionResult> => {
      return PermissionEngine.checkMultiplePermissions(permissionContext, checks);
    };
  }, [permissionContext]);

  return {
    // Core permission checks
    checkPermission,
    
    // Convenience methods
    canView,
    canCreate,
    canEdit,
    canDelete,
    canExport,
    canApprove,
    canOverride,
    canAudit,
    
    // Module access
    hasModuleAccess,
    getAllowedActions,
    
    // Role checks
    ...roleChecks,
    
    // Context info
    userRole: permissionContext.role,
    familyId: permissionContext.familyId,
    userId: permissionContext.userId,
    
    // Batch operations
    checkMultiplePermissions,
  };
}

/**
 * Hook for checking a single permission
 * Useful for conditional rendering
 */
export function usePermission(
  module: Module,
  action: PermissionAction,
  resourceId?: string,
  metadata?: Record<string, any>
): PermissionResult {
  const { checkPermission } = usePermissions();
  
  return useMemo(() => {
    return checkPermission(module, action, resourceId, metadata);
  }, [checkPermission, module, action, resourceId, metadata]);
}

/**
 * Hook for checking module access
 * Useful for navigation and menu rendering
 */
export function useModuleAccess(module: Module): boolean {
  const { hasModuleAccess } = usePermissions();
  
  return useMemo(() => {
    return hasModuleAccess(module);
  }, [hasModuleAccess, module]);
}