/**
 * KutumbOS - Role-Based Access Control (RBAC) System
 * Authoritative permission types and enums
 */

// Core Permission Actions (Atomic)
export enum PermissionAction {
  VIEW = 'VIEW',
  CREATE = 'CREATE',
  EDIT = 'EDIT',
  DELETE = 'DELETE',
  APPROVE = 'APPROVE',
  EXPORT = 'EXPORT',
  OVERRIDE = 'OVERRIDE',
  AUDIT = 'AUDIT'
}

// System Roles (Strict Hierarchy)
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  FAMILY_ADMIN = 'FAMILY_ADMIN',
  ADULT_MEMBER = 'ADULT_MEMBER',
  SENIOR_MEMBER = 'SENIOR_MEMBER',
  TEEN_MEMBER = 'TEEN_MEMBER',
  CHILD_MEMBER = 'CHILD_MEMBER',
  EMERGENCY_USER = 'EMERGENCY_USER'
}

// Platform Modules
export enum Module {
  // Platform-Level
  AUTHENTICATION = 'AUTHENTICATION',
  FAMILY_MANAGEMENT = 'FAMILY_MANAGEMENT',
  
  // Core Family Modules
  EXPENSE_MANAGEMENT = 'EXPENSE_MANAGEMENT',
  HEALTH_RECORDS = 'HEALTH_RECORDS',
  RESPONSIBILITY_ENGINE = 'RESPONSIBILITY_ENGINE',
  NOTIFICATIONS = 'NOTIFICATIONS',
  
  // System Modules
  UI_MODE_CONTROL = 'UI_MODE_CONTROL',
  AUDIT_LOGS = 'AUDIT_LOGS',
  SYSTEM_CONFIG = 'SYSTEM_CONFIG',
  EMERGENCY_ACCESS = 'EMERGENCY_ACCESS'
}

// UI Modes
export enum UIMode {
  SIMPLE = 'SIMPLE',
  FAST = 'FAST'
}

// Permission Context
export interface PermissionContext {
  userId: string;
  familyId?: string;
  role: UserRole;
  isOwner?: boolean; // Record ownership
  emergencyAccess?: EmergencyAccess;
}

// Emergency Access Configuration
export interface EmergencyAccess {
  id: string;
  userId: string;
  familyId: string;
  grantedBy: string;
  grantedAt: Date;
  expiresAt: Date;
  modules: Module[];
  actions: PermissionAction[];
  ipRestrictions?: string[];
  isActive: boolean;
  auditLog: EmergencyAuditEntry[];
}

export interface EmergencyAuditEntry {
  timestamp: Date;
  action: string;
  userId: string;
  ipAddress: string;
  details: Record<string, any>;
}

// Permission Check Result
export interface PermissionResult {
  allowed: boolean;
  reason?: string;
  constraints?: PermissionConstraint[];
}

// Permission Constraints
export interface PermissionConstraint {
  type: 'TIME_LIMIT' | 'IP_RESTRICTION' | 'CATEGORY_LIMIT' | 'AMOUNT_LIMIT' | 'READ_ONLY';
  value: any;
  message: string;
}

// Family Context
export interface FamilyContext {
  id: string;
  name: string;
  adminId: string;
  members: FamilyMember[];
  settings: FamilySettings;
}

export interface FamilyMember {
  userId: string;
  role: UserRole;
  joinedAt: Date;
  permissions?: CustomPermission[];
}

export interface FamilySettings {
  uiMode?: UIMode;
  uiModeLocked?: boolean;
  expenseCategories?: string[];
  budgetLimits?: Record<string, number>;
  emergencyAccessEnabled?: boolean;
}

// Custom Permission Override
export interface CustomPermission {
  module: Module;
  action: PermissionAction;
  allowed: boolean;
  constraints?: PermissionConstraint[];
  grantedBy: string;
  grantedAt: Date;
  expiresAt?: Date;
}

// System Configuration
export interface SystemConfig {
  modules: {
    [key in Module]: {
      enabled: boolean;
      features?: string[];
    };
  };
  globalLimits: {
    maxFamiliesPerUser: number;
    maxMembersPerFamily: number;
    apiRateLimit: number;
    emergencyAccessDuration: number; // hours
  };
  experimentalFeatures: string[];
}

// Audit Log Entry
export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  userId: string;
  familyId?: string;
  module: Module;
  action: PermissionAction;
  resource?: string;
  resourceId?: string;
  result: 'SUCCESS' | 'DENIED' | 'ERROR';
  reason?: string;
  ipAddress: string;
  userAgent: string;
  metadata?: Record<string, any>;
}

// Permission Matrix Type
export type PermissionMatrix = {
  [role in UserRole]: {
    [module in Module]: {
      [action in PermissionAction]: boolean | 'CONDITIONAL';
    };
  };
};