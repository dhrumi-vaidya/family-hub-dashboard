/**
 * KutumbOS Permission Engine
 * Core permission evaluation logic
 */

import { 
  PermissionContext, 
  PermissionResult, 
  PermissionAction, 
  Module, 
  UserRole,
  PermissionConstraint,
  EmergencyAccess,
  CustomPermission
} from '@/types/permissions';
import { PERMISSION_MATRIX } from './matrix';

export class PermissionEngine {
  /**
   * Main permission check method
   * Evaluates: User Role × Family Context × Module × Action × Record Ownership × System Constraints
   */
  static checkPermission(
    context: PermissionContext,
    module: Module,
    action: PermissionAction,
    resourceId?: string,
    metadata?: Record<string, any>
  ): PermissionResult {
    try {
      // 1. Get base permission from matrix
      const basePermission = PERMISSION_MATRIX[context.role][module][action];
      
      if (basePermission === false) {
        return {
          allowed: false,
          reason: `Role ${context.role} does not have ${action} permission for ${module}`
        };
      }

      // 2. Handle unconditional permissions (Super Admin mostly)
      if (basePermission === true) {
        return {
          allowed: true,
          constraints: this.getSystemConstraints(context, module, action)
        };
      }

      // 3. Handle conditional permissions
      if (basePermission === 'CONDITIONAL') {
        return this.evaluateConditionalPermission(
          context, 
          module, 
          action, 
          resourceId, 
          metadata
        );
      }

      return {
        allowed: false,
        reason: 'Unknown permission state'
      };

    } catch (error) {
      console.error('Permission check error:', error);
      return {
        allowed: false,
        reason: 'Permission evaluation failed'
      };
    }
  }

  /**
   * Evaluate conditional permissions based on context
   */
  private static evaluateConditionalPermission(
    context: PermissionContext,
    module: Module,
    action: PermissionAction,
    resourceId?: string,
    metadata?: Record<string, any>
  ): PermissionResult {
    const constraints: PermissionConstraint[] = [];

    // Check emergency access first
    if (context.emergencyAccess) {
      const emergencyResult = this.checkEmergencyAccess(
        context.emergencyAccess, 
        module, 
        action
      );
      if (!emergencyResult.allowed) {
        return emergencyResult;
      }
      constraints.push(...(emergencyResult.constraints || []));
    }

    // Module-specific conditional logic
    switch (module) {
      case Module.AUTHENTICATION:
        return this.checkAuthenticationPermission(context, action, resourceId, metadata);
      
      case Module.FAMILY_MANAGEMENT:
        return this.checkFamilyManagementPermission(context, action, resourceId, metadata);
      
      case Module.EXPENSE_MANAGEMENT:
        return this.checkExpensePermission(context, action, resourceId, metadata);
      
      case Module.HEALTH_RECORDS:
        return this.checkHealthRecordsPermission(context, action, resourceId, metadata);
      
      case Module.RESPONSIBILITY_ENGINE:
        return this.checkResponsibilityPermission(context, action, resourceId, metadata);
      
      case Module.NOTIFICATIONS:
        return this.checkNotificationPermission(context, action, resourceId, metadata);
      
      case Module.UI_MODE_CONTROL:
        return this.checkUIModePermission(context, action, resourceId, metadata);
      
      case Module.AUDIT_LOGS:
        return this.checkAuditLogPermission(context, action, resourceId, metadata);
      
      case Module.EMERGENCY_ACCESS:
        return this.checkEmergencyAccessPermission(context, action, resourceId, metadata);
      
      default:
        return {
          allowed: false,
          reason: `No conditional logic defined for module ${module}`
        };
    }
  }

  /**
   * Authentication module permissions
   */
  private static checkAuthenticationPermission(
    context: PermissionContext,
    action: PermissionAction,
    resourceId?: string,
    metadata?: Record<string, any>
  ): PermissionResult {
    switch (context.role) {
      case UserRole.FAMILY_ADMIN:
        // Can manage family members only
        if (metadata?.targetUserId && metadata?.familyId === context.familyId) {
          return { allowed: true };
        }
        return {
          allowed: false,
          reason: 'Can only manage users within own family'
        };

      case UserRole.ADULT_MEMBER:
      case UserRole.SENIOR_MEMBER:
        // Can only manage own credentials
        if (resourceId === context.userId || metadata?.targetUserId === context.userId) {
          return { allowed: true };
        }
        return {
          allowed: false,
          reason: 'Can only manage own credentials'
        };

      case UserRole.TEEN_MEMBER:
        // Limited credential changes
        if (resourceId === context.userId && action === PermissionAction.EDIT) {
          return {
            allowed: true,
            constraints: [{
              type: 'READ_ONLY',
              value: ['password'], // Can't change password
              message: 'Password changes require parent approval'
            }]
          };
        }
        return {
          allowed: false,
          reason: 'Limited credential access for teens'
        };

      default:
        return { allowed: false, reason: 'No authentication permissions' };
    }
  }

  /**
   * Family Management permissions
   */
  private static checkFamilyManagementPermission(
    context: PermissionContext,
    action: PermissionAction,
    resourceId?: string,
    metadata?: Record<string, any>
  ): PermissionResult {
    switch (context.role) {
      case UserRole.FAMILY_ADMIN:
        // Can manage own family only
        if (resourceId === context.familyId || metadata?.familyId === context.familyId) {
          return { allowed: true };
        }
        return {
          allowed: false,
          reason: 'Can only manage own family'
        };

      case UserRole.ADULT_MEMBER:
      case UserRole.SENIOR_MEMBER:
      case UserRole.TEEN_MEMBER:
      case UserRole.CHILD_MEMBER:
        // Can only view basic family info
        if (action === PermissionAction.VIEW && resourceId === context.familyId) {
          return {
            allowed: true,
            constraints: [{
              type: 'READ_ONLY',
              value: ['basic_info'],
              message: 'Limited family information access'
            }]
          };
        }
        return {
          allowed: false,
          reason: 'No family management permissions'
        };

      default:
        return { allowed: false, reason: 'No family management permissions' };
    }
  }

  /**
   * Expense Management permissions
   */
  private static checkExpensePermission(
    context: PermissionContext,
    action: PermissionAction,
    resourceId?: string,
    metadata?: Record<string, any>
  ): PermissionResult {
    const constraints: PermissionConstraint[] = [];

    switch (context.role) {
      case UserRole.FAMILY_ADMIN:
        // Full access to family expenses
        return { allowed: true };

      case UserRole.ADULT_MEMBER:
        if (action === PermissionAction.VIEW) {
          // Can view own + shared family expenses
          return {
            allowed: true,
            constraints: [{
              type: 'READ_ONLY',
              value: 'shared_expenses',
              message: 'Can view shared family expenses but not edit'
            }]
          };
        }
        // Can create/edit/delete own expenses only
        if (context.isOwner || metadata?.ownerId === context.userId) {
          return { allowed: true };
        }
        return {
          allowed: false,
          reason: 'Can only manage own expenses'
        };

      case UserRole.SENIOR_MEMBER:
        if (action === PermissionAction.CREATE) {
          return { allowed: true };
        }
        if (action === PermissionAction.VIEW && context.isOwner) {
          return { allowed: true };
        }
        return {
          allowed: false,
          reason: 'Seniors can only create and view own expenses'
        };

      case UserRole.TEEN_MEMBER:
      case UserRole.CHILD_MEMBER:
        if (action === PermissionAction.CREATE) {
          // Apply spending caps
          const maxAmount = context.role === UserRole.TEEN_MEMBER ? 100 : 25;
          constraints.push({
            type: 'AMOUNT_LIMIT',
            value: maxAmount,
            message: `Maximum expense amount: $${maxAmount}`
          });

          // Restrict categories
          const allowedCategories = context.role === UserRole.TEEN_MEMBER 
            ? ['food', 'transport', 'education', 'entertainment']
            : ['food', 'toys', 'education'];
          
          constraints.push({
            type: 'CATEGORY_LIMIT',
            value: allowedCategories,
            message: `Allowed categories: ${allowedCategories.join(', ')}`
          });

          return { allowed: true, constraints };
        }
        if (action === PermissionAction.VIEW && context.isOwner) {
          return { allowed: true };
        }
        return {
          allowed: false,
          reason: 'Limited expense permissions for minors'
        };

      default:
        return { allowed: false, reason: 'No expense permissions' };
    }
  }

  /**
   * Health Records permissions
   */
  private static checkHealthRecordsPermission(
    context: PermissionContext,
    action: PermissionAction,
    resourceId?: string,
    metadata?: Record<string, any>
  ): PermissionResult {
    switch (context.role) {
      case UserRole.FAMILY_ADMIN:
        if (action === PermissionAction.DELETE) {
          return {
            allowed: false,
            reason: 'Only Super Admin can delete health records'
          };
        }
        // Can view all family health records
        return { allowed: true };

      case UserRole.ADULT_MEMBER:
        // Can only manage own records
        if (context.isOwner || metadata?.ownerId === context.userId) {
          if (action === PermissionAction.EDIT && metadata?.recordType === 'uploaded') {
            return {
              allowed: false,
              reason: 'Uploaded documents are immutable'
            };
          }
          return { allowed: true };
        }
        return {
          allowed: false,
          reason: 'Can only access own health records'
        };

      case UserRole.SENIOR_MEMBER:
      case UserRole.TEEN_MEMBER:
      case UserRole.CHILD_MEMBER:
        // Can only view own records
        if (action === PermissionAction.VIEW && context.isOwner) {
          return { allowed: true };
        }
        return {
          allowed: false,
          reason: 'Can only view own health records'
        };

      default:
        return { allowed: false, reason: 'No health records permissions' };
    }
  }

  /**
   * Responsibility Engine permissions
   */
  private static checkResponsibilityPermission(
    context: PermissionContext,
    action: PermissionAction,
    resourceId?: string,
    metadata?: Record<string, any>
  ): PermissionResult {
    switch (context.role) {
      case UserRole.FAMILY_ADMIN:
        // Full task management
        return { allowed: true };

      case UserRole.ADULT_MEMBER:
      case UserRole.SENIOR_MEMBER:
      case UserRole.TEEN_MEMBER:
      case UserRole.CHILD_MEMBER:
        if (action === PermissionAction.VIEW) {
          // Can view assigned tasks only
          if (metadata?.assignedTo === context.userId) {
            return { allowed: true };
          }
          return {
            allowed: false,
            reason: 'Can only view tasks assigned to you'
          };
        }
        if (action === PermissionAction.EDIT) {
          // Can only update status
          if (metadata?.assignedTo === context.userId && metadata?.field === 'status') {
            return { allowed: true };
          }
          return {
            allowed: false,
            reason: 'Can only update status of assigned tasks'
          };
        }
        return {
          allowed: false,
          reason: 'No task creation or deletion permissions'
        };

      default:
        return { allowed: false, reason: 'No responsibility permissions' };
    }
  }

  /**
   * Notification permissions
   */
  private static checkNotificationPermission(
    context: PermissionContext,
    action: PermissionAction,
    resourceId?: string,
    metadata?: Record<string, any>
  ): PermissionResult {
    switch (context.role) {
      case UserRole.FAMILY_ADMIN:
        if (action === PermissionAction.CREATE) {
          // Can send family-level alerts only
          if (metadata?.scope === 'family' && metadata?.familyId === context.familyId) {
            return { allowed: true };
          }
          return {
            allowed: false,
            reason: 'Can only send family-level notifications'
          };
        }
        return { allowed: true };

      case UserRole.ADULT_MEMBER:
      case UserRole.SENIOR_MEMBER:
      case UserRole.TEEN_MEMBER:
      case UserRole.CHILD_MEMBER:
        if (action === PermissionAction.VIEW) {
          return { allowed: true };
        }
        if (action === PermissionAction.EDIT && metadata?.field === 'read_status') {
          // Can only mark as read
          return { allowed: true };
        }
        return {
          allowed: false,
          reason: 'Can only view and mark notifications as read'
        };

      default:
        return { allowed: false, reason: 'No notification permissions' };
    }
  }

  /**
   * UI Mode Control permissions
   */
  private static checkUIModePermission(
    context: PermissionContext,
    action: PermissionAction,
    resourceId?: string,
    metadata?: Record<string, any>
  ): PermissionResult {
    switch (context.role) {
      case UserRole.FAMILY_ADMIN:
        // Can force UI mode at family level
        return { allowed: true };

      case UserRole.ADULT_MEMBER:
        // Can change own mode only
        if (action === PermissionAction.EDIT && resourceId === context.userId) {
          return { allowed: true };
        }
        return {
          allowed: false,
          reason: 'Can only change own UI mode'
        };

      case UserRole.SENIOR_MEMBER:
      case UserRole.TEEN_MEMBER:
      case UserRole.CHILD_MEMBER:
        // Mode fixed by admin
        if (action === PermissionAction.VIEW) {
          return { allowed: true };
        }
        return {
          allowed: false,
          reason: 'UI mode is fixed by family admin'
        };

      default:
        return { allowed: false, reason: 'No UI mode permissions' };
    }
  }

  /**
   * Audit Log permissions
   */
  private static checkAuditLogPermission(
    context: PermissionContext,
    action: PermissionAction,
    resourceId?: string,
    metadata?: Record<string, any>
  ): PermissionResult {
    switch (context.role) {
      case UserRole.FAMILY_ADMIN:
        // Can view family logs only
        if (action === PermissionAction.VIEW || action === PermissionAction.EXPORT) {
          if (metadata?.familyId === context.familyId) {
            return { allowed: true };
          }
          return {
            allowed: false,
            reason: 'Can only view own family logs'
          };
        }
        return {
          allowed: false,
          reason: 'No audit log modification permissions'
        };

      default:
        return { allowed: false, reason: 'No audit log permissions' };
    }
  }

  /**
   * Emergency Access permissions
   */
  private static checkEmergencyAccessPermission(
    context: PermissionContext,
    action: PermissionAction,
    resourceId?: string,
    metadata?: Record<string, any>
  ): PermissionResult {
    switch (context.role) {
      case UserRole.FAMILY_ADMIN:
        // Can grant emergency access within family
        if (metadata?.familyId === context.familyId) {
          return { allowed: true };
        }
        return {
          allowed: false,
          reason: 'Can only manage emergency access within own family'
        };

      default:
        return { allowed: false, reason: 'No emergency access permissions' };
    }
  }

  /**
   * Check emergency access validity
   */
  private static checkEmergencyAccess(
    emergencyAccess: EmergencyAccess,
    module: Module,
    action: PermissionAction
  ): PermissionResult {
    const now = new Date();
    
    if (!emergencyAccess.isActive) {
      return {
        allowed: false,
        reason: 'Emergency access is not active'
      };
    }

    if (now > emergencyAccess.expiresAt) {
      return {
        allowed: false,
        reason: 'Emergency access has expired'
      };
    }

    if (!emergencyAccess.modules.includes(module)) {
      return {
        allowed: false,
        reason: 'Module not included in emergency access scope'
      };
    }

    if (!emergencyAccess.actions.includes(action)) {
      return {
        allowed: false,
        reason: 'Action not included in emergency access scope'
      };
    }

    const constraints: PermissionConstraint[] = [];

    // Add time limit constraint
    const remainingTime = Math.floor((emergencyAccess.expiresAt.getTime() - now.getTime()) / (1000 * 60));
    constraints.push({
      type: 'TIME_LIMIT',
      value: remainingTime,
      message: `Emergency access expires in ${remainingTime} minutes`
    });

    // Add IP restrictions if configured
    if (emergencyAccess.ipRestrictions && emergencyAccess.ipRestrictions.length > 0) {
      constraints.push({
        type: 'IP_RESTRICTION',
        value: emergencyAccess.ipRestrictions,
        message: 'Access restricted to specific IP addresses'
      });
    }

    // Emergency access is read-only by default
    if (action !== PermissionAction.VIEW) {
      constraints.push({
        type: 'READ_ONLY',
        value: true,
        message: 'Emergency access is read-only by default'
      });
    }

    return {
      allowed: true,
      constraints
    };
  }

  /**
   * Get system-level constraints
   */
  private static getSystemConstraints(
    context: PermissionContext,
    module: Module,
    action: PermissionAction
  ): PermissionConstraint[] {
    const constraints: PermissionConstraint[] = [];

    // Add role-based constraints
    if (context.role === UserRole.TEEN_MEMBER || context.role === UserRole.CHILD_MEMBER) {
      constraints.push({
        type: 'TIME_LIMIT',
        value: '22:00', // 10 PM curfew
        message: 'Access restricted after 10 PM'
      });
    }

    return constraints;
  }

  /**
   * Check if user has any permission for a module
   */
  static hasModuleAccess(context: PermissionContext, module: Module): boolean {
    const modulePermissions = PERMISSION_MATRIX[context.role][module];
    return Object.values(modulePermissions).some(permission => 
      permission === true || permission === 'CONDITIONAL'
    );
  }

  /**
   * Get all allowed actions for a module
   */
  static getAllowedActions(context: PermissionContext, module: Module): PermissionAction[] {
    const modulePermissions = PERMISSION_MATRIX[context.role][module];
    const allowedActions: PermissionAction[] = [];

    Object.entries(modulePermissions).forEach(([action, permission]) => {
      if (permission === true || permission === 'CONDITIONAL') {
        allowedActions.push(action as PermissionAction);
      }
    });

    return allowedActions;
  }

  /**
   * Batch permission check for multiple actions
   */
  static checkMultiplePermissions(
    context: PermissionContext,
    checks: Array<{
      module: Module;
      action: PermissionAction;
      resourceId?: string;
      metadata?: Record<string, any>;
    }>
  ): Record<string, PermissionResult> {
    const results: Record<string, PermissionResult> = {};

    checks.forEach((check, index) => {
      const key = `${check.module}_${check.action}_${index}`;
      results[key] = this.checkPermission(
        context,
        check.module,
        check.action,
        check.resourceId,
        check.metadata
      );
    });

    return results;
  }
}