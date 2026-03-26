/**
 * KutumbOS Database Models
 * PostgreSQL-compatible database layer with proper schema
 */

import bcrypt from 'bcryptjs';

// Enums matching the requirements
export enum GlobalRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  USER = 'USER'
}

export enum FamilyRole {
  FAMILY_ADMIN = 'FAMILY_ADMIN',
  ADULT = 'ADULT',
  SENIOR = 'SENIOR',
  TEEN = 'TEEN',
  CHILD = 'CHILD',
  EMERGENCY = 'EMERGENCY'
}

export enum AuditAction {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
  LOGOUT = 'LOGOUT',
  TOKEN_REFRESH = 'TOKEN_REFRESH',
  ROLE_CHANGED = 'ROLE_CHANGED',
  FAMILY_SWITCH = 'FAMILY_SWITCH',
  FAMILY_CREATED = 'FAMILY_CREATED',
  FAMILY_JOINED = 'FAMILY_JOINED',
  FAMILY_LEFT = 'FAMILY_LEFT',
  USER_CREATED = 'USER_CREATED',
  PASSWORD_CHANGED = 'PASSWORD_CHANGED',
  INVITE_SENT = 'INVITE_SENT',
  INVITE_ACCEPTED = 'INVITE_ACCEPTED',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  ACCOUNT_UNLOCKED = 'ACCOUNT_UNLOCKED',
  EMERGENCY_ACCESS_GRANTED = 'EMERGENCY_ACCESS_GRANTED',
  EMERGENCY_ACCESS_EXPIRED = 'EMERGENCY_ACCESS_EXPIRED',
  PROFILE_UPDATED = 'PROFILE_UPDATED'
}

// Database Models
export interface User {
  id: string;
  email: string;
  password_hash: string;
  global_role: GlobalRole;
  token_version: number;
  created_at: Date;
  updated_at: Date;
  last_login: Date | null;
  failed_login_attempts: number;
  locked_until: Date | null;
  is_emergency_user: boolean;
  emergency_expires_at: Date | null;
}

export interface Family {
  id: string;
  name: string;
  created_by: string; // FK to users.id
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
}

export interface FamilyMember {
  id: string;
  user_id: string; // FK to users.id
  family_id: string; // FK to families.id
  role: FamilyRole;
  joined_at: Date;
  invited_by: string; // FK to users.id
}

export interface RefreshToken {
  id: string;
  user_id: string; // FK to users.id
  token_hash: string;
  expires_at: Date;
  created_at: Date;
}

export interface AuditLog {
  id: string;
  user_id: string | null; // FK to users.id, nullable for system actions
  family_id: string | null; // FK to families.id, nullable for platform actions
  action: AuditAction;
  details: Record<string, any>;
  ip_address: string;
  user_agent: string;
  created_at: Date;
}

export interface InviteToken {
  id: string;
  family_id: string; // FK to families.id
  role_to_assign: FamilyRole;
  expires_at: Date;
  token: string; // Unique invite token
  created_by: string; // FK to users.id
  created_at: Date;
  used_at: Date | null;
  used_by: string | null; // FK to users.id
  recipient_email: string | null; // Email address of the invited person
}

export interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  date_of_birth: string;
  blood_group: string;
  emergency_contact: string;
  family_role: string;
  photo_base64: string; // base64 encoded image
  updated_at: Date;
}


class MockDatabase {
  private users: User[] = [];
  private families: Family[] = [];
  private familyMembers: FamilyMember[] = [];
  private refreshTokens: RefreshToken[] = [];
  private auditLogs: AuditLog[] = [];
  private inviteTokens: InviteToken[] = [];
  private userProfiles: UserProfile[] = [];

  constructor() {
    this.initializeData();
  }

  private async initializeData() {
    // Create Super Admin only - no dummy families or users
    const superAdminPasswordHash = await bcrypt.hash('Qwerty@123', 12);
    const superAdmin: User = {
      id: 'super_admin_1',
      email: 'super.admin@kutumb.com',
      password_hash: superAdminPasswordHash,
      global_role: GlobalRole.SUPER_ADMIN,
      token_version: 0,
      created_at: new Date(),
      updated_at: new Date(),
      last_login: null,
      failed_login_attempts: 0,
      locked_until: null,
      is_emergency_user: false,
      emergency_expires_at: null
    };

    // Initialize with only super admin - all other data will be created dynamically
    this.users = [superAdmin];
    this.families = [];
    this.familyMembers = [];
    this.refreshTokens = [];
    this.auditLogs = [];
    this.inviteTokens = [];
  }

  // User operations
  async findUserByEmail(email: string): Promise<User | null> {
    // Support phone number login for demo
    if (email === '9876543210') {
      return this.users.find(u => u.id === 'user_1') || null;
    }
    if (email === '9876543211') {
      return this.users.find(u => u.id === 'user_2') || null;
    }
    
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  async findUserById(id: string): Promise<User | null> {
    return this.users.find(u => u.id === id) || null;
  }

  async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const newUser: User = {
      ...userData,
      id: `user_${Date.now()}`,
      created_at: new Date(),
      updated_at: new Date()
    };
    this.users.push(newUser);
    return newUser;
  }

  async updateUser(id: string, updates: Partial<Omit<User, 'id' | 'created_at'>>): Promise<User | null> {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) return null;

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updates,
      updated_at: new Date()
    };
    return this.users[userIndex];
  }

  // Account lockout methods
  async incrementFailedLoginAttempts(userId: string): Promise<boolean> {
    const user = await this.findUserById(userId);
    if (!user) return false;

    const newAttempts = user.failed_login_attempts + 1;
    const shouldLock = newAttempts >= 5;
    
    const updates: Partial<User> = {
      failed_login_attempts: newAttempts
    };

    if (shouldLock) {
      updates.locked_until = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    }

    await this.updateUser(userId, updates);

    if (shouldLock) {
      await this.createAuditLog({
        user_id: userId,
        family_id: null,
        action: AuditAction.ACCOUNT_LOCKED,
        details: { attempts: newAttempts, lockDuration: '15 minutes' },
        ip_address: 'system',
        user_agent: 'system'
      });
    }

    return shouldLock;
  }

  async resetFailedLoginAttempts(userId: string): Promise<boolean> {
    const user = await this.findUserById(userId);
    if (!user) return false;

    await this.updateUser(userId, { 
      failed_login_attempts: 0,
      locked_until: null
    });
    return true;
  }

  async isAccountLocked(userId: string): Promise<boolean> {
    const user = await this.findUserById(userId);
    if (!user) return false;

    if (user.locked_until && user.locked_until > new Date()) {
      return true;
    }

    // Auto-unlock if lock period has expired
    if (user.locked_until && user.locked_until <= new Date()) {
      await this.updateUser(userId, { 
        locked_until: null,
        failed_login_attempts: 0
      });
      
      await this.createAuditLog({
        user_id: userId,
        family_id: null,
        action: AuditAction.ACCOUNT_UNLOCKED,
        details: { reason: 'Lock period expired' },
        ip_address: 'system',
        user_agent: 'system'
      });
    }

    return false;
  }

  // Emergency user methods
  async createEmergencyUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at' | 'is_emergency_user' | 'emergency_expires_at'>, expiresInHours: number = 24): Promise<User> {
    const emergencyUser: User = {
      ...userData,
      id: `emergency_${Date.now()}`,
      created_at: new Date(),
      updated_at: new Date(),
      is_emergency_user: true,
      emergency_expires_at: new Date(Date.now() + expiresInHours * 60 * 60 * 1000)
    };
    this.users.push(emergencyUser);
    return emergencyUser;
  }

  async isEmergencyUserExpired(userId: string): Promise<boolean> {
    const user = await this.findUserById(userId);
    if (!user || !user.is_emergency_user) return false;

    if (user.emergency_expires_at && user.emergency_expires_at <= new Date()) {
      // Log expiration
      await this.createAuditLog({
        user_id: userId,
        family_id: null,
        action: AuditAction.EMERGENCY_ACCESS_EXPIRED,
        details: { expiredAt: user.emergency_expires_at },
        ip_address: 'system',
        user_agent: 'system'
      });
      return true;
    }

    return false;
  }

  async incrementTokenVersion(userId: string): Promise<boolean> {
    const user = await this.findUserById(userId);
    if (!user) return false;

    await this.updateUser(userId, { token_version: user.token_version + 1 });
    // Revoke all refresh tokens for this user
    this.refreshTokens = this.refreshTokens.filter(rt => rt.user_id !== userId);
    return true;
  }

  // Family operations
  async findFamilyById(id: string): Promise<Family | null> {
    return this.families.find(f => f.id === id && f.is_active) || null;
  }

  async createFamily(familyData: Omit<Family, 'id' | 'created_at' | 'updated_at'>): Promise<Family> {
    const newFamily: Family = {
      ...familyData,
      id: `family_${Date.now()}`,
      created_at: new Date(),
      updated_at: new Date()
    };
    this.families.push(newFamily);
    return newFamily;
  }

  // Family member operations
  async getUserFamilies(userId: string): Promise<Array<Family & { role: FamilyRole }>> {
    const userMemberships = this.familyMembers.filter(fm => fm.user_id === userId);
    const familiesWithRoles: Array<Family & { role: FamilyRole }> = [];

    for (const membership of userMemberships) {
      const family = await this.findFamilyById(membership.family_id);
      if (family) {
        familiesWithRoles.push({
          ...family,
          role: membership.role
        });
      }
    }

    return familiesWithRoles;
  }

  async getFamilyMember(userId: string, familyId: string): Promise<FamilyMember | null> {
    return this.familyMembers.find(fm => 
      fm.user_id === userId && fm.family_id === familyId
    ) || null;
  }

  async addFamilyMember(memberData: Omit<FamilyMember, 'id' | 'joined_at'>): Promise<FamilyMember> {
    // Check if user is already a member
    const existing = await this.getFamilyMember(memberData.user_id, memberData.family_id);
    if (existing) {
      throw new Error('User is already a member of this family');
    }

    const newMember: FamilyMember = {
      ...memberData,
      id: `member_${Date.now()}`,
      joined_at: new Date()
    };
    this.familyMembers.push(newMember);
    return newMember;
  }

  async ensureFamilyHasAdmin(familyId: string): Promise<boolean> {
    const admins = this.familyMembers.filter(fm => 
      fm.family_id === familyId && fm.role === FamilyRole.FAMILY_ADMIN
    );
    return admins.length > 0;
  }

  // Refresh token operations
  async createRefreshToken(tokenData: Omit<RefreshToken, 'id' | 'created_at'>): Promise<RefreshToken> {
    const newToken: RefreshToken = {
      ...tokenData,
      id: `token_${Date.now()}`,
      created_at: new Date()
    };
    this.refreshTokens.push(newToken);
    return newToken;
  }

  async findRefreshToken(tokenHash: string): Promise<RefreshToken | null> {
    return this.refreshTokens.find(rt => 
      rt.token_hash === tokenHash && rt.expires_at > new Date()
    ) || null;
  }

  async revokeRefreshToken(tokenHash: string): Promise<boolean> {
    const tokenIndex = this.refreshTokens.findIndex(rt => rt.token_hash === tokenHash);
    if (tokenIndex === -1) return false;
    
    this.refreshTokens.splice(tokenIndex, 1);
    return true;
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    this.refreshTokens = this.refreshTokens.filter(rt => rt.user_id !== userId);
  }

  // Audit log operations
  async createAuditLog(logData: Omit<AuditLog, 'id' | 'created_at'>): Promise<AuditLog> {
    const newLog: AuditLog = {
      ...logData,
      id: `audit_${Date.now()}`,
      created_at: new Date()
    };
    this.auditLogs.push(newLog);
    return newLog;
  }

  async getAuditLogs(filters?: {
    userId?: string;
    familyId?: string;
    action?: AuditAction;
    limit?: number;
  }): Promise<AuditLog[]> {
    let logs = [...this.auditLogs];

    if (filters?.userId) {
      logs = logs.filter(log => log.user_id === filters.userId);
    }
    if (filters?.familyId) {
      logs = logs.filter(log => log.family_id === filters.familyId);
    }
    if (filters?.action) {
      logs = logs.filter(log => log.action === filters.action);
    }

    // Sort by created_at desc
    logs.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());

    if (filters?.limit) {
      logs = logs.slice(0, filters.limit);
    }

    return logs;
  }

  // Invite token operations
  async createInviteToken(inviteData: Omit<InviteToken, 'id' | 'created_at' | 'used_at' | 'used_by'>): Promise<InviteToken> {
    const newInvite: InviteToken = {
      ...inviteData,
      id: `invite_${Date.now()}`,
      created_at: new Date(),
      used_at: null,
      used_by: null
    };
    this.inviteTokens.push(newInvite);
    return newInvite;
  }

  async findInviteToken(token: string): Promise<InviteToken | null> {
    return this.inviteTokens.find(it => 
      it.token === token && 
      it.expires_at > new Date() && 
      it.used_at === null
    ) || null;
  }

  async useInviteToken(token: string, userId: string): Promise<boolean> {
    const inviteIndex = this.inviteTokens.findIndex(it => it.token === token);
    if (inviteIndex === -1) return false;

    this.inviteTokens[inviteIndex].used_at = new Date();
    this.inviteTokens[inviteIndex].used_by = userId;
    return true;
  }

  // Additional methods needed by the new routes
  async getFamilyMembers(familyId: string): Promise<Array<FamilyMember & { user?: User }>> {
    const members = this.familyMembers.filter(fm => fm.family_id === familyId);
    return members.map(member => ({
      ...member,
      user: this.users.find(u => u.id === member.user_id)
    }));
  }

  async getAllFamilies(): Promise<Family[]> {
    return this.families;
  }

  async getAllUsers(): Promise<User[]> {
    return this.users;
  }

  async updateFamily(id: string, updates: Partial<Omit<Family, 'id' | 'created_at'>>): Promise<Family | null> {
    const familyIndex = this.families.findIndex(f => f.id === id);
    if (familyIndex === -1) return null;

    this.families[familyIndex] = {
      ...this.families[familyIndex],
      ...updates,
      updated_at: new Date()
    };
    return this.families[familyIndex];
  }

  async updateFamilyMemberRole(userId: string, familyId: string, role: FamilyRole): Promise<boolean> {
    const memberIndex = this.familyMembers.findIndex(fm => 
      fm.user_id === userId && fm.family_id === familyId
    );
    if (memberIndex === -1) return false;

    this.familyMembers[memberIndex].role = role;
    return true;
  }

  async getFamilyInvitations(familyId: string): Promise<InviteToken[]> {
    return this.inviteTokens.filter(invite => invite.family_id === familyId);
  }

  async revokeInvitation(invitationId: string, familyId: string): Promise<boolean> {
    const inviteIndex = this.inviteTokens.findIndex(invite => 
      invite.id === invitationId && invite.family_id === familyId
    );
    if (inviteIndex === -1) return false;

    // Mark as used to effectively revoke it
    this.inviteTokens[inviteIndex].used_at = new Date();
    this.inviteTokens[inviteIndex].used_by = 'revoked';
    return true;
  }

  // User profile operations
  async getProfile(userId: string): Promise<UserProfile | null> {
    return this.userProfiles.find(p => p.user_id === userId) || null;
  }

  async upsertProfile(userId: string, data: Omit<UserProfile, 'id' | 'user_id' | 'updated_at'>): Promise<UserProfile> {
    const existing = this.userProfiles.findIndex(p => p.user_id === userId);
    if (existing !== -1) {
      this.userProfiles[existing] = {
        ...this.userProfiles[existing],
        ...data,
        updated_at: new Date(),
      };
      return this.userProfiles[existing];
    }
    const newProfile: UserProfile = {
      id: `profile_${Date.now()}`,
      user_id: userId,
      ...data,
      updated_at: new Date(),
    };
    this.userProfiles.push(newProfile);
    return newProfile;
  }
}

// Export singleton instance
export const Database = new MockDatabase();