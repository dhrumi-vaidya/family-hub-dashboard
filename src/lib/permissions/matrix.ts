/**
 * KutumbOS Permission Matrix
 * Defines explicit permissions for each role-module-action combination
 */

import { UserRole, Module, PermissionAction, PermissionMatrix } from '@/types/permissions';

export const PERMISSION_MATRIX: PermissionMatrix = {
  [UserRole.SUPER_ADMIN]: {
    // Platform-Level Modules
    [Module.AUTHENTICATION]: {
      [PermissionAction.VIEW]: true,
      [PermissionAction.CREATE]: true,
      [PermissionAction.EDIT]: true,
      [PermissionAction.DELETE]: true,
      [PermissionAction.APPROVE]: true,
      [PermissionAction.EXPORT]: true,
      [PermissionAction.OVERRIDE]: true,
      [PermissionAction.AUDIT]: true,
    },
    [Module.FAMILY_MANAGEMENT]: {
      [PermissionAction.VIEW]: true,
      [PermissionAction.CREATE]: true,
      [PermissionAction.EDIT]: true,
      [PermissionAction.DELETE]: true,
      [PermissionAction.APPROVE]: true,
      [PermissionAction.EXPORT]: true,
      [PermissionAction.OVERRIDE]: true,
      [PermissionAction.AUDIT]: true,
    },
    // Core Family Modules
    [Module.EXPENSE_MANAGEMENT]: {
      [PermissionAction.VIEW]: true,
      [PermissionAction.CREATE]: true,
      [PermissionAction.EDIT]: true,
      [PermissionAction.DELETE]: true,
      [PermissionAction.APPROVE]: true,
      [PermissionAction.EXPORT]: true,
      [PermissionAction.OVERRIDE]: true,
      [PermissionAction.AUDIT]: true,
    },
    [Module.HEALTH_RECORDS]: {
      [PermissionAction.VIEW]: true,
      [PermissionAction.CREATE]: true,
      [PermissionAction.EDIT]: true,
      [PermissionAction.DELETE]: true, // Only role allowed hard delete
      [PermissionAction.APPROVE]: true,
      [PermissionAction.EXPORT]: true,
      [PermissionAction.OVERRIDE]: true,
      [PermissionAction.AUDIT]: true,
    },
    [Module.RESPONSIBILITY_ENGINE]: {
      [PermissionAction.VIEW]: true,
      [PermissionAction.CREATE]: true,
      [PermissionAction.EDIT]: true,
      [PermissionAction.DELETE]: true,
      [PermissionAction.APPROVE]: true,
      [PermissionAction.EXPORT]: true,
      [PermissionAction.OVERRIDE]: true,
      [PermissionAction.AUDIT]: true,
    },
    [Module.NOTIFICATIONS]: {
      [PermissionAction.VIEW]: true,
      [PermissionAction.CREATE]: true,
      [PermissionAction.EDIT]: true,
      [PermissionAction.DELETE]: true,
      [PermissionAction.APPROVE]: true,
      [PermissionAction.EXPORT]: true,
      [PermissionAction.OVERRIDE]: true,
      [PermissionAction.AUDIT]: true,
    },
    [Module.UI_MODE_CONTROL]: {
      [PermissionAction.VIEW]: true,
      [PermissionAction.CREATE]: false,
      [PermissionAction.EDIT]: true,
      [PermissionAction.DELETE]: false,
      [PermissionAction.APPROVE]: true,
      [PermissionAction.EXPORT]: false,
      [PermissionAction.OVERRIDE]: true,
      [PermissionAction.AUDIT]: true,
    },
    [Module.AUDIT_LOGS]: {
      [PermissionAction.VIEW]: true,
      [PermissionAction.CREATE]: false,
      [PermissionAction.EDIT]: false,
      [PermissionAction.DELETE]: false,
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: true,
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: true,
    },
    [Module.SYSTEM_CONFIG]: {
      [PermissionAction.VIEW]: true,
      [PermissionAction.CREATE]: true,
      [PermissionAction.EDIT]: true,
      [PermissionAction.DELETE]: true,
      [PermissionAction.APPROVE]: true,
      [PermissionAction.EXPORT]: true,
      [PermissionAction.OVERRIDE]: true,
      [PermissionAction.AUDIT]: true,
    },
    [Module.EMERGENCY_ACCESS]: {
      [PermissionAction.VIEW]: true,
      [PermissionAction.CREATE]: true,
      [PermissionAction.EDIT]: true,
      [PermissionAction.DELETE]: true,
      [PermissionAction.APPROVE]: true,
      [PermissionAction.EXPORT]: true,
      [PermissionAction.OVERRIDE]: true,
      [PermissionAction.AUDIT]: true,
    },
  },

  [UserRole.FAMILY_ADMIN]: {
    // Platform-Level Modules
    [Module.AUTHENTICATION]: {
      [PermissionAction.VIEW]: 'CONDITIONAL', // Family members only
      [PermissionAction.CREATE]: 'CONDITIONAL', // Family members only
      [PermissionAction.EDIT]: 'CONDITIONAL', // Family members only
      [PermissionAction.DELETE]: false,
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: 'CONDITIONAL', // Family data only
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: 'CONDITIONAL', // Family logs only
    },
    [Module.FAMILY_MANAGEMENT]: {
      [PermissionAction.VIEW]: 'CONDITIONAL', // Own family only
      [PermissionAction.CREATE]: 'CONDITIONAL', // Invite members only
      [PermissionAction.EDIT]: 'CONDITIONAL', // Own family only
      [PermissionAction.DELETE]: 'CONDITIONAL', // Remove members only
      [PermissionAction.APPROVE]: 'CONDITIONAL', // Family actions only
      [PermissionAction.EXPORT]: 'CONDITIONAL', // Family data only
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: 'CONDITIONAL', // Family logs only
    },
    // Core Family Modules
    [Module.EXPENSE_MANAGEMENT]: {
      [PermissionAction.VIEW]: true,
      [PermissionAction.CREATE]: true,
      [PermissionAction.EDIT]: true,
      [PermissionAction.DELETE]: 'CONDITIONAL', // Soft delete only
      [PermissionAction.APPROVE]: true,
      [PermissionAction.EXPORT]: true,
      [PermissionAction.OVERRIDE]: 'CONDITIONAL', // Budget overrides
      [PermissionAction.AUDIT]: true,
    },
    [Module.HEALTH_RECORDS]: {
      [PermissionAction.VIEW]: true,
      [PermissionAction.CREATE]: true,
      [PermissionAction.EDIT]: 'CONDITIONAL', // Own records only
      [PermissionAction.DELETE]: false,
      [PermissionAction.APPROVE]: true,
      [PermissionAction.EXPORT]: true,
      [PermissionAction.OVERRIDE]: 'CONDITIONAL', // Emergency access
      [PermissionAction.AUDIT]: true,
    },
    [Module.RESPONSIBILITY_ENGINE]: {
      [PermissionAction.VIEW]: true,
      [PermissionAction.CREATE]: true,
      [PermissionAction.EDIT]: true,
      [PermissionAction.DELETE]: true,
      [PermissionAction.APPROVE]: true,
      [PermissionAction.EXPORT]: true,
      [PermissionAction.OVERRIDE]: true,
      [PermissionAction.AUDIT]: true,
    },
    [Module.NOTIFICATIONS]: {
      [PermissionAction.VIEW]: true,
      [PermissionAction.CREATE]: 'CONDITIONAL', // Family alerts only
      [PermissionAction.EDIT]: 'CONDITIONAL', // Own notifications
      [PermissionAction.DELETE]: 'CONDITIONAL', // Own notifications
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: false,
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: false,
    },
    [Module.UI_MODE_CONTROL]: {
      [PermissionAction.VIEW]: true,
      [PermissionAction.CREATE]: false,
      [PermissionAction.EDIT]: 'CONDITIONAL', // Family level
      [PermissionAction.DELETE]: false,
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: false,
      [PermissionAction.OVERRIDE]: 'CONDITIONAL', // Force mode
      [PermissionAction.AUDIT]: false,
    },
    [Module.AUDIT_LOGS]: {
      [PermissionAction.VIEW]: 'CONDITIONAL', // Family logs only
      [PermissionAction.CREATE]: false,
      [PermissionAction.EDIT]: false,
      [PermissionAction.DELETE]: false,
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: 'CONDITIONAL', // Family logs only
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: false,
    },
    [Module.SYSTEM_CONFIG]: {
      [PermissionAction.VIEW]: false,
      [PermissionAction.CREATE]: false,
      [PermissionAction.EDIT]: false,
      [PermissionAction.DELETE]: false,
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: false,
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: false,
    },
    [Module.EMERGENCY_ACCESS]: {
      [PermissionAction.VIEW]: 'CONDITIONAL', // Family emergency access
      [PermissionAction.CREATE]: 'CONDITIONAL', // Grant within family
      [PermissionAction.EDIT]: 'CONDITIONAL', // Revoke within family
      [PermissionAction.DELETE]: 'CONDITIONAL', // Revoke within family
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: false,
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: 'CONDITIONAL', // Family emergency logs
    },
  },

  [UserRole.ADULT_MEMBER]: {
    // Platform-Level Modules
    [Module.AUTHENTICATION]: {
      [PermissionAction.VIEW]: 'CONDITIONAL', // Own credentials only
      [PermissionAction.CREATE]: false,
      [PermissionAction.EDIT]: 'CONDITIONAL', // Own credentials only
      [PermissionAction.DELETE]: false,
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: false,
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: false,
    },
    [Module.FAMILY_MANAGEMENT]: {
      [PermissionAction.VIEW]: 'CONDITIONAL', // Own family info only
      [PermissionAction.CREATE]: false,
      [PermissionAction.EDIT]: false,
      [PermissionAction.DELETE]: false,
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: false,
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: false,
    },
    // Core Family Modules
    [Module.EXPENSE_MANAGEMENT]: {
      [PermissionAction.VIEW]: 'CONDITIONAL', // Own + shared family expenses
      [PermissionAction.CREATE]: true,
      [PermissionAction.EDIT]: 'CONDITIONAL', // Own expenses only
      [PermissionAction.DELETE]: 'CONDITIONAL', // Own expenses only
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: 'CONDITIONAL', // Own expenses only
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: false,
    },
    [Module.HEALTH_RECORDS]: {
      [PermissionAction.VIEW]: 'CONDITIONAL', // Own records only
      [PermissionAction.CREATE]: true,
      [PermissionAction.EDIT]: 'CONDITIONAL', // Own manual entries only
      [PermissionAction.DELETE]: false,
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: 'CONDITIONAL', // Own records only
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: false,
    },
    [Module.RESPONSIBILITY_ENGINE]: {
      [PermissionAction.VIEW]: 'CONDITIONAL', // Assigned tasks only
      [PermissionAction.CREATE]: false,
      [PermissionAction.EDIT]: 'CONDITIONAL', // Status updates only
      [PermissionAction.DELETE]: false,
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: false,
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: false,
    },
    [Module.NOTIFICATIONS]: {
      [PermissionAction.VIEW]: true,
      [PermissionAction.CREATE]: false,
      [PermissionAction.EDIT]: 'CONDITIONAL', // Mark as read only
      [PermissionAction.DELETE]: false,
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: false,
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: false,
    },
    [Module.UI_MODE_CONTROL]: {
      [PermissionAction.VIEW]: true,
      [PermissionAction.CREATE]: false,
      [PermissionAction.EDIT]: 'CONDITIONAL', // Own mode only
      [PermissionAction.DELETE]: false,
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: false,
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: false,
    },
    [Module.AUDIT_LOGS]: {
      [PermissionAction.VIEW]: false,
      [PermissionAction.CREATE]: false,
      [PermissionAction.EDIT]: false,
      [PermissionAction.DELETE]: false,
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: false,
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: false,
    },
    [Module.SYSTEM_CONFIG]: {
      [PermissionAction.VIEW]: false,
      [PermissionAction.CREATE]: false,
      [PermissionAction.EDIT]: false,
      [PermissionAction.DELETE]: false,
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: false,
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: false,
    },
    [Module.EMERGENCY_ACCESS]: {
      [PermissionAction.VIEW]: false,
      [PermissionAction.CREATE]: false,
      [PermissionAction.EDIT]: false,
      [PermissionAction.DELETE]: false,
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: false,
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: false,
    },
  },

  [UserRole.SENIOR_MEMBER]: {
    // Platform-Level Modules
    [Module.AUTHENTICATION]: {
      [PermissionAction.VIEW]: 'CONDITIONAL', // Own credentials only
      [PermissionAction.CREATE]: false,
      [PermissionAction.EDIT]: 'CONDITIONAL', // Own credentials only
      [PermissionAction.DELETE]: false,
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: false,
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: false,
    },
    [Module.FAMILY_MANAGEMENT]: {
      [PermissionAction.VIEW]: 'CONDITIONAL', // Own family info only
      [PermissionAction.CREATE]: false,
      [PermissionAction.EDIT]: false,
      [PermissionAction.DELETE]: false,
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: false,
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: false,
    },
    // Core Family Modules
    [Module.EXPENSE_MANAGEMENT]: {
      [PermissionAction.VIEW]: 'CONDITIONAL', // Own expenses only
      [PermissionAction.CREATE]: true,
      [PermissionAction.EDIT]: false, // No edit permission
      [PermissionAction.DELETE]: false, // No delete permission
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: false,
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: false,
    },
    [Module.HEALTH_RECORDS]: {
      [PermissionAction.VIEW]: 'CONDITIONAL', // Own records only
      [PermissionAction.CREATE]: false, // No uploads or edits
      [PermissionAction.EDIT]: false,
      [PermissionAction.DELETE]: false,
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: false,
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: false,
    },
    [Module.RESPONSIBILITY_ENGINE]: {
      [PermissionAction.VIEW]: 'CONDITIONAL', // Assigned tasks only
      [PermissionAction.CREATE]: false,
      [PermissionAction.EDIT]: 'CONDITIONAL', // Status updates only
      [PermissionAction.DELETE]: false,
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: false,
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: false,
    },
    [Module.NOTIFICATIONS]: {
      [PermissionAction.VIEW]: true,
      [PermissionAction.CREATE]: false,
      [PermissionAction.EDIT]: 'CONDITIONAL', // Mark as read only
      [PermissionAction.DELETE]: false,
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: false,
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: false,
    },
    [Module.UI_MODE_CONTROL]: {
      [PermissionAction.VIEW]: true,
      [PermissionAction.CREATE]: false,
      [PermissionAction.EDIT]: false, // Mode fixed by admin
      [PermissionAction.DELETE]: false,
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: false,
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: false,
    },
    [Module.AUDIT_LOGS]: {
      [PermissionAction.VIEW]: false,
      [PermissionAction.CREATE]: false,
      [PermissionAction.EDIT]: false,
      [PermissionAction.DELETE]: false,
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: false,
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: false,
    },
    [Module.SYSTEM_CONFIG]: {
      [PermissionAction.VIEW]: false,
      [PermissionAction.CREATE]: false,
      [PermissionAction.EDIT]: false,
      [PermissionAction.DELETE]: false,
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: false,
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: false,
    },
    [Module.EMERGENCY_ACCESS]: {
      [PermissionAction.VIEW]: false,
      [PermissionAction.CREATE]: false,
      [PermissionAction.EDIT]: false,
      [PermissionAction.DELETE]: false,
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: false,
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: false,
    },
  },

  [UserRole.TEEN_MEMBER]: {
    // Platform-Level Modules
    [Module.AUTHENTICATION]: {
      [PermissionAction.VIEW]: 'CONDITIONAL', // Own credentials only
      [PermissionAction.CREATE]: false,
      [PermissionAction.EDIT]: 'CONDITIONAL', // Limited credential changes
      [PermissionAction.DELETE]: false,
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: false,
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: false,
    },
    [Module.FAMILY_MANAGEMENT]: {
      [PermissionAction.VIEW]: 'CONDITIONAL', // Basic family info only
      [PermissionAction.CREATE]: false,
      [PermissionAction.EDIT]: false,
      [PermissionAction.DELETE]: false,
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: false,
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: false,
    },
    // Core Family Modules
    [Module.EXPENSE_MANAGEMENT]: {
      [PermissionAction.VIEW]: 'CONDITIONAL', // Own expenses only
      [PermissionAction.CREATE]: 'CONDITIONAL', // Within predefined caps
      [PermissionAction.EDIT]: false, // No edit permission
      [PermissionAction.DELETE]: false, // No delete permission
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: false,
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: false,
    },
    [Module.HEALTH_RECORDS]: {
      [PermissionAction.VIEW]: 'CONDITIONAL', // Own records only
      [PermissionAction.CREATE]: false, // No uploads or edits
      [PermissionAction.EDIT]: false,
      [PermissionAction.DELETE]: false,
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: false,
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: false,
    },
    [Module.RESPONSIBILITY_ENGINE]: {
      [PermissionAction.VIEW]: 'CONDITIONAL', // Assigned tasks only
      [PermissionAction.CREATE]: false,
      [PermissionAction.EDIT]: 'CONDITIONAL', // Status updates only
      [PermissionAction.DELETE]: false,
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: false,
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: false,
    },
    [Module.NOTIFICATIONS]: {
      [PermissionAction.VIEW]: true,
      [PermissionAction.CREATE]: false,
      [PermissionAction.EDIT]: 'CONDITIONAL', // Mark as read only
      [PermissionAction.DELETE]: false,
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: false,
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: false,
    },
    [Module.UI_MODE_CONTROL]: {
      [PermissionAction.VIEW]: true,
      [PermissionAction.CREATE]: false,
      [PermissionAction.EDIT]: false, // Mode fixed by admin
      [PermissionAction.DELETE]: false,
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: false,
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: false,
    },
    [Module.AUDIT_LOGS]: {
      [PermissionAction.VIEW]: false,
      [PermissionAction.CREATE]: false,
      [PermissionAction.EDIT]: false,
      [PermissionAction.DELETE]: false,
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: false,
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: false,
    },
    [Module.SYSTEM_CONFIG]: {
      [PermissionAction.VIEW]: false,
      [PermissionAction.CREATE]: false,
      [PermissionAction.EDIT]: false,
      [PermissionAction.DELETE]: false,
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: false,
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: false,
    },
    [Module.EMERGENCY_ACCESS]: {
      [PermissionAction.VIEW]: false,
      [PermissionAction.CREATE]: false,
      [PermissionAction.EDIT]: false,
      [PermissionAction.DELETE]: false,
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: false,
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: false,
    },
  },

  [UserRole.CHILD_MEMBER]: {
    // Platform-Level Modules
    [Module.AUTHENTICATION]: {
      [PermissionAction.VIEW]: false, // Managed by parents
      [PermissionAction.CREATE]: false,
      [PermissionAction.EDIT]: false,
      [PermissionAction.DELETE]: false,
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: false,
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: false,
    },
    [Module.FAMILY_MANAGEMENT]: {
      [PermissionAction.VIEW]: 'CONDITIONAL', // Basic family info only
      [PermissionAction.CREATE]: false,
      [PermissionAction.EDIT]: false,
      [PermissionAction.DELETE]: false,
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: false,
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: false,
    },
    // Core Family Modules
    [Module.EXPENSE_MANAGEMENT]: {
      [PermissionAction.VIEW]: 'CONDITIONAL', // Own expenses only
      [PermissionAction.CREATE]: 'CONDITIONAL', // Within strict caps
      [PermissionAction.EDIT]: false, // No edit permission
      [PermissionAction.DELETE]: false, // No delete permission
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: false,
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: false,
    },
    [Module.HEALTH_RECORDS]: {
      [PermissionAction.VIEW]: 'CONDITIONAL', // Own records only
      [PermissionAction.CREATE]: false, // No uploads or edits
      [PermissionAction.EDIT]: false,
      [PermissionAction.DELETE]: false,
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: false,
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: false,
    },
    [Module.RESPONSIBILITY_ENGINE]: {
      [PermissionAction.VIEW]: 'CONDITIONAL', // Assigned tasks only
      [PermissionAction.CREATE]: false,
      [PermissionAction.EDIT]: 'CONDITIONAL', // Status updates only
      [PermissionAction.DELETE]: false,
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: false,
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: false,
    },
    [Module.NOTIFICATIONS]: {
      [PermissionAction.VIEW]: true,
      [PermissionAction.CREATE]: false,
      [PermissionAction.EDIT]: 'CONDITIONAL', // Mark as read only
      [PermissionAction.DELETE]: false,
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: false,
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: false,
    },
    [Module.UI_MODE_CONTROL]: {
      [PermissionAction.VIEW]: true,
      [PermissionAction.CREATE]: false,
      [PermissionAction.EDIT]: false, // Mode fixed by admin
      [PermissionAction.DELETE]: false,
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: false,
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: false,
    },
    [Module.AUDIT_LOGS]: {
      [PermissionAction.VIEW]: false,
      [PermissionAction.CREATE]: false,
      [PermissionAction.EDIT]: false,
      [PermissionAction.DELETE]: false,
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: false,
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: false,
    },
    [Module.SYSTEM_CONFIG]: {
      [PermissionAction.VIEW]: false,
      [PermissionAction.CREATE]: false,
      [PermissionAction.EDIT]: false,
      [PermissionAction.DELETE]: false,
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: false,
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: false,
    },
    [Module.EMERGENCY_ACCESS]: {
      [PermissionAction.VIEW]: false,
      [PermissionAction.CREATE]: false,
      [PermissionAction.EDIT]: false,
      [PermissionAction.DELETE]: false,
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: false,
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: false,
    },
  },

  [UserRole.EMERGENCY_USER]: {
    // Platform-Level Modules
    [Module.AUTHENTICATION]: {
      [PermissionAction.VIEW]: false,
      [PermissionAction.CREATE]: false,
      [PermissionAction.EDIT]: false,
      [PermissionAction.DELETE]: false,
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: false,
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: false,
    },
    [Module.FAMILY_MANAGEMENT]: {
      [PermissionAction.VIEW]: 'CONDITIONAL', // Scoped access only
      [PermissionAction.CREATE]: false,
      [PermissionAction.EDIT]: false,
      [PermissionAction.DELETE]: false,
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: false,
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: false,
    },
    // Core Family Modules - All conditional based on emergency access scope
    [Module.EXPENSE_MANAGEMENT]: {
      [PermissionAction.VIEW]: 'CONDITIONAL', // Read-only by default
      [PermissionAction.CREATE]: false,
      [PermissionAction.EDIT]: false,
      [PermissionAction.DELETE]: false,
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: false,
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: false,
    },
    [Module.HEALTH_RECORDS]: {
      [PermissionAction.VIEW]: 'CONDITIONAL', // Emergency access only
      [PermissionAction.CREATE]: false,
      [PermissionAction.EDIT]: false,
      [PermissionAction.DELETE]: false,
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: false,
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: false,
    },
    [Module.RESPONSIBILITY_ENGINE]: {
      [PermissionAction.VIEW]: 'CONDITIONAL',
      [PermissionAction.CREATE]: false,
      [PermissionAction.EDIT]: false,
      [PermissionAction.DELETE]: false,
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: false,
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: false,
    },
    [Module.NOTIFICATIONS]: {
      [PermissionAction.VIEW]: 'CONDITIONAL',
      [PermissionAction.CREATE]: false,
      [PermissionAction.EDIT]: false,
      [PermissionAction.DELETE]: false,
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: false,
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: false,
    },
    [Module.UI_MODE_CONTROL]: {
      [PermissionAction.VIEW]: false,
      [PermissionAction.CREATE]: false,
      [PermissionAction.EDIT]: false,
      [PermissionAction.DELETE]: false,
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: false,
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: false,
    },
    [Module.AUDIT_LOGS]: {
      [PermissionAction.VIEW]: false,
      [PermissionAction.CREATE]: false,
      [PermissionAction.EDIT]: false,
      [PermissionAction.DELETE]: false,
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: false,
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: false,
    },
    [Module.SYSTEM_CONFIG]: {
      [PermissionAction.VIEW]: false,
      [PermissionAction.CREATE]: false,
      [PermissionAction.EDIT]: false,
      [PermissionAction.DELETE]: false,
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: false,
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: false,
    },
    [Module.EMERGENCY_ACCESS]: {
      [PermissionAction.VIEW]: false,
      [PermissionAction.CREATE]: false,
      [PermissionAction.EDIT]: false,
      [PermissionAction.DELETE]: false,
      [PermissionAction.APPROVE]: false,
      [PermissionAction.EXPORT]: false,
      [PermissionAction.OVERRIDE]: false,
      [PermissionAction.AUDIT]: false,
    },
  },
};