/**
 * KutumbOS Authentication Types
 * Type definitions for the new auth system
 */

import { Request, Response, NextFunction } from 'express';
import { GlobalRole, FamilyRole, AuditAction } from '../models/database';

// JWT Payload (minimal as per requirements)
export interface JWTPayload {
  userId: string;
  globalRole: GlobalRole;
  tokenVersion: number;
}

// Request/Response types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user: UserProfile;
  accessToken: string;
  refreshToken: string;
  families: FamilyWithRole[];
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  familyName?: string; // For creating new family
  inviteToken?: string; // For joining existing family
}

export interface RegisterResponse {
  success: boolean;
  user: UserProfile;
  accessToken: string;
  refreshToken: string;
  families: FamilyWithRole[];
}

// User profile (without sensitive data)
export interface UserProfile {
  id: string;
  email: string;
  globalRole: GlobalRole;
  createdAt: Date;
  lastLogin: Date | null;
}

// Family with user's role
export interface FamilyWithRole {
  id: string;
  name: string;
  role: FamilyRole;
  createdAt: Date;
}

// Family context validation
export interface FamilyContext {
  familyId: string;
  userRole: FamilyRole;
  isValid: boolean;
}

// Invite token data
export interface InviteTokenData {
  familyId: string;
  familyName: string;
  roleToAssign: FamilyRole;
  invitedBy: string;
  expiresAt: Date;
  recipientEmail: string | null;
}

// Audit log entry
export interface AuditLogEntry {
  id: string;
  userId: string | null;
  familyId: string | null;
  action: AuditAction;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
}

// Extended Express Request with auth data
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    globalRole: GlobalRole;
    tokenVersion: number;
  };
  familyContext?: FamilyContext;
}

// Error response
export interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
}

// Success response
export interface SuccessResponse<T = any> {
  success: true;
  data?: T;
  message?: string;
}

// API Response type
export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse;

// Rate limiting info
export interface RateLimitInfo {
  windowMs: number;
  max: number;
  remaining: number;
  resetTime: Date;
}

// Password validation requirements
export interface PasswordRequirements {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
}

// Session info
export interface SessionInfo {
  userId: string;
  globalRole: GlobalRole;
  activeFamilyId?: string;
  activeFamilyRole?: FamilyRole;
  loginTime: Date;
  lastActivity: Date;
  ipAddress: string;
  userAgent: string;
}