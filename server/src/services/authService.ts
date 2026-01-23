/**
 * KutumbOS Authentication Service
 * Core authentication logic with JWT, refresh tokens, and audit logging
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Database, GlobalRole, FamilyRole, AuditAction } from '../models/database';
import { 
  JWTPayload, 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  RegisterResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  UserProfile,
  FamilyWithRole,
  FamilyContext,
  InviteTokenData,
  PasswordRequirements
} from '../types/auth';

export class AuthService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  private static readonly ACCESS_TOKEN_EXPIRY = '15m';
  private static readonly REFRESH_TOKEN_EXPIRY = '7d';
  
  private static readonly PASSWORD_REQUIREMENTS: PasswordRequirements = {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true
  };

  // Password validation
  static validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const req = this.PASSWORD_REQUIREMENTS;

    if (password.length < req.minLength) {
      errors.push(`Password must be at least ${req.minLength} characters long`);
    }
    if (req.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (req.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (req.requireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (req.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Generate JWT tokens
  static generateAccessToken(payload: JWTPayload): string {
    return jwt.sign(payload, this.JWT_SECRET, { 
      expiresIn: this.ACCESS_TOKEN_EXPIRY,
      issuer: 'kutumbos',
      audience: 'kutumbos-client'
    });
  }

  static generateRefreshToken(): string {
    return crypto.randomBytes(64).toString('hex');
  }

  // Verify JWT token
  static verifyAccessToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET, {
        issuer: 'kutumbos',
        audience: 'kutumbos-client'
      }) as JWTPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }

  // Hash refresh token for storage
  static hashRefreshToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  // Convert user to profile (remove sensitive data)
  static userToProfile(user: any): UserProfile {
    return {
      id: user.id,
      email: user.email,
      globalRole: user.global_role,
      createdAt: user.created_at,
      lastLogin: user.last_login
    };
  }

  // Convert families to response format
  static familiesToResponse(families: any[]): FamilyWithRole[] {
    return families.map(family => ({
      id: family.id,
      name: family.name,
      role: family.role,
      createdAt: family.created_at
    }));
  }

  // Login user
  static async login(
    loginData: LoginRequest, 
    ipAddress: string, 
    userAgent: string
  ): Promise<LoginResponse> {
    const { email, password } = loginData;

    // Find user
    const user = await Database.findUserByEmail(email);
    if (!user) {
      // Log failed attempt
      await Database.createAuditLog({
        user_id: null,
        family_id: null,
        action: AuditAction.LOGIN_FAILED,
        details: { email, reason: 'User not found' },
        ip_address: ipAddress,
        user_agent: userAgent
      });
      
      throw new Error('Invalid credentials');
    }

    // Check if account is locked
    const isLocked = await Database.isAccountLocked(user.id);
    if (isLocked) {
      await Database.createAuditLog({
        user_id: user.id,
        family_id: null,
        action: AuditAction.LOGIN_FAILED,
        details: { email, reason: 'Account locked' },
        ip_address: ipAddress,
        user_agent: userAgent
      });
      
      throw new Error('Account is temporarily locked due to multiple failed login attempts. Please try again later.');
    }

    // Check if emergency user has expired
    if (user.is_emergency_user) {
      const isExpired = await Database.isEmergencyUserExpired(user.id);
      if (isExpired) {
        throw new Error('Emergency access has expired');
      }
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      // Increment failed attempts and potentially lock account
      const wasLocked = await Database.incrementFailedLoginAttempts(user.id);
      
      // Log failed attempt
      await Database.createAuditLog({
        user_id: user.id,
        family_id: null,
        action: AuditAction.LOGIN_FAILED,
        details: { 
          email, 
          reason: 'Invalid password',
          attempts: user.failed_login_attempts + 1,
          locked: wasLocked
        },
        ip_address: ipAddress,
        user_agent: userAgent
      });
      
      if (wasLocked) {
        throw new Error('Account has been locked due to multiple failed login attempts. Please try again in 15 minutes.');
      } else {
        const remainingAttempts = 5 - (user.failed_login_attempts + 1);
        throw new Error(`Invalid credentials. ${remainingAttempts} attempts remaining before account lockout.`);
      }
    }

    // Reset failed login attempts on successful login
    await Database.resetFailedLoginAttempts(user.id);

    // Update last login
    await Database.updateUser(user.id, { last_login: new Date() });

    // Generate tokens
    const accessToken = this.generateAccessToken({
      userId: user.id,
      globalRole: user.global_role,
      tokenVersion: user.token_version
    });

    const refreshToken = this.generateRefreshToken();
    const refreshTokenHash = this.hashRefreshToken(refreshToken);

    // Store refresh token
    await Database.createRefreshToken({
      user_id: user.id,
      token_hash: refreshTokenHash,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });

    // Get user families
    const families = await Database.getUserFamilies(user.id);

    // Log successful login
    await Database.createAuditLog({
      user_id: user.id,
      family_id: null,
      action: AuditAction.LOGIN_SUCCESS,
      details: { 
        email,
        isEmergencyUser: user.is_emergency_user,
        emergencyExpiresAt: user.emergency_expires_at
      },
      ip_address: ipAddress,
      user_agent: userAgent
    });

    return {
      success: true,
      user: this.userToProfile(user),
      accessToken,
      refreshToken,
      families: this.familiesToResponse(families)
    };
  }

  // Register new user
  static async register(
    registerData: RegisterRequest,
    ipAddress: string,
    userAgent: string
  ): Promise<RegisterResponse> {
    const { email, password, familyName, inviteToken } = registerData;

    // Check if user already exists
    const existingUser = await Database.findUserByEmail(email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Validate password
    const passwordValidation = this.validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new Error(`Password validation failed: ${passwordValidation.errors.join(', ')}`);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const newUser = await Database.createUser({
      email: email.toLowerCase(),
      password_hash: passwordHash,
      global_role: GlobalRole.USER,
      token_version: 0,
      last_login: null,
      failed_login_attempts: 0,
      locked_until: null,
      is_emergency_user: false,
      emergency_expires_at: null
    });

    let familyId: string;
    let familyRole: FamilyRole;

    if (inviteToken) {
      // Join existing family via invite
      const invite = await Database.findInviteToken(inviteToken);
      if (!invite) {
        throw new Error('Invalid or expired invite token');
      }

      familyId = invite.family_id;
      familyRole = invite.role_to_assign;

      // Add user to family
      await Database.addFamilyMember({
        user_id: newUser.id,
        family_id: familyId,
        role: familyRole,
        invited_by: invite.created_by
      });

      // Mark invite as used
      await Database.useInviteToken(inviteToken, newUser.id);

      // Log invite acceptance
      await Database.createAuditLog({
        user_id: newUser.id,
        family_id: familyId,
        action: AuditAction.INVITE_ACCEPTED,
        details: { inviteToken, role: familyRole },
        ip_address: ipAddress,
        user_agent: userAgent
      });

    } else if (familyName) {
      // Create new family
      const newFamily = await Database.createFamily({
        name: familyName,
        created_by: newUser.id,
        is_active: true
      });

      familyId = newFamily.id;
      familyRole = FamilyRole.FAMILY_ADMIN;

      // Add user as family admin
      await Database.addFamilyMember({
        user_id: newUser.id,
        family_id: familyId,
        role: familyRole,
        invited_by: newUser.id
      });

      // Log family creation
      await Database.createAuditLog({
        user_id: newUser.id,
        family_id: familyId,
        action: AuditAction.FAMILY_CREATED,
        details: { familyName },
        ip_address: ipAddress,
        user_agent: userAgent
      });

    } else {
      throw new Error('Either familyName or inviteToken is required for registration');
    }

    // Generate tokens
    const accessToken = this.generateAccessToken({
      userId: newUser.id,
      globalRole: newUser.global_role,
      tokenVersion: newUser.token_version
    });

    const refreshToken = this.generateRefreshToken();
    const refreshTokenHash = this.hashRefreshToken(refreshToken);

    // Store refresh token
    await Database.createRefreshToken({
      user_id: newUser.id,
      token_hash: refreshTokenHash,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });

    // Get user families
    const families = await Database.getUserFamilies(newUser.id);

    // Log user creation
    await Database.createAuditLog({
      user_id: newUser.id,
      family_id: null,
      action: AuditAction.USER_CREATED,
      details: { email, registrationType: inviteToken ? 'invite' : 'new_family' },
      ip_address: ipAddress,
      user_agent: userAgent
    });

    return {
      success: true,
      user: this.userToProfile(newUser),
      accessToken,
      refreshToken,
      families: this.familiesToResponse(families)
    };
  }

  // Refresh access token
  static async refreshToken(
    refreshData: RefreshTokenRequest,
    ipAddress: string,
    userAgent: string
  ): Promise<RefreshTokenResponse> {
    const { refreshToken } = refreshData;
    const refreshTokenHash = this.hashRefreshToken(refreshToken);

    // Find refresh token
    const storedToken = await Database.findRefreshToken(refreshTokenHash);
    if (!storedToken) {
      throw new Error('Invalid or expired refresh token');
    }

    // Find user
    const user = await Database.findUserById(storedToken.user_id);
    if (!user) {
      throw new Error('User not found');
    }

    // Generate new tokens (rotating refresh token)
    const newAccessToken = this.generateAccessToken({
      userId: user.id,
      globalRole: user.global_role,
      tokenVersion: user.token_version
    });

    const newRefreshToken = this.generateRefreshToken();
    const newRefreshTokenHash = this.hashRefreshToken(newRefreshToken);

    // Revoke old refresh token
    await Database.revokeRefreshToken(refreshTokenHash);

    // Store new refresh token
    await Database.createRefreshToken({
      user_id: user.id,
      token_hash: newRefreshTokenHash,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });

    // Log token refresh
    await Database.createAuditLog({
      user_id: user.id,
      family_id: null,
      action: AuditAction.TOKEN_REFRESH,
      details: {},
      ip_address: ipAddress,
      user_agent: userAgent
    });

    return {
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    };
  }

  // Logout user
  static async logout(
    userId: string,
    refreshToken: string,
    ipAddress: string,
    userAgent: string
  ): Promise<void> {
    const refreshTokenHash = this.hashRefreshToken(refreshToken);
    
    // Revoke refresh token
    await Database.revokeRefreshToken(refreshTokenHash);

    // Log logout
    await Database.createAuditLog({
      user_id: userId,
      family_id: null,
      action: AuditAction.LOGOUT,
      details: {},
      ip_address: ipAddress,
      user_agent: userAgent
    });
  }

  // Logout from all devices
  static async logoutAll(
    userId: string,
    ipAddress: string,
    userAgent: string
  ): Promise<void> {
    // Increment token version to invalidate all access tokens
    await Database.incrementTokenVersion(userId);

    // Revoke all refresh tokens
    await Database.revokeAllUserTokens(userId);

    // Log logout all
    await Database.createAuditLog({
      user_id: userId,
      family_id: null,
      action: AuditAction.LOGOUT,
      details: { logoutAll: true },
      ip_address: ipAddress,
      user_agent: userAgent
    });
  }

  // Validate family context
  static async validateFamilyContext(userId: string, familyId: string): Promise<FamilyContext> {
    const familyMember = await Database.getFamilyMember(userId, familyId);
    
    if (!familyMember) {
      return {
        familyId,
        userRole: FamilyRole.ADULT, // Default, but isValid will be false
        isValid: false
      };
    }

    return {
      familyId,
      userRole: familyMember.role,
      isValid: true
    };
  }

  // Generate invite token
  static async generateInviteToken(
    familyId: string,
    roleToAssign: FamilyRole,
    createdBy: string,
    expiresInHours: number = 24
  ): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);

    await Database.createInviteToken({
      family_id: familyId,
      role_to_assign: roleToAssign,
      expires_at: expiresAt,
      token,
      created_by: createdBy
    });

    return token;
  }

  // Decode invite token
  static async decodeInviteToken(token: string): Promise<InviteTokenData | null> {
    const invite = await Database.findInviteToken(token);
    if (!invite) return null;

    const family = await Database.findFamilyById(invite.family_id);
    if (!family) return null;

    const inviter = await Database.findUserById(invite.created_by);
    if (!inviter) return null;

    return {
      familyId: invite.family_id,
      familyName: family.name,
      roleToAssign: invite.role_to_assign,
      invitedBy: inviter.email,
      expiresAt: invite.expires_at
    };
  }

  // Change user role (with audit)
  static async changeUserRole(
    targetUserId: string,
    familyId: string,
    newRole: FamilyRole,
    changedBy: string,
    ipAddress: string,
    userAgent: string
  ): Promise<void> {
    const familyMember = await Database.getFamilyMember(targetUserId, familyId);
    if (!familyMember) {
      throw new Error('User is not a member of this family');
    }

    const oldRole = familyMember.role;

    // Update role (this would be a database update in real implementation)
    // For now, we'll simulate it by logging the change
    
    // Log role change
    await Database.createAuditLog({
      user_id: changedBy,
      family_id: familyId,
      action: AuditAction.ROLE_CHANGED,
      details: { 
        targetUserId, 
        oldRole, 
        newRole,
        changedBy 
      },
      ip_address: ipAddress,
      user_agent: userAgent
    });

    // Invalidate user sessions if role changed
    await Database.incrementTokenVersion(targetUserId);
  }
}