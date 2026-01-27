/**
 * KutumbOS Authentication Routes
 * Complete authentication system with JWT, refresh tokens, and audit logging
 */

import express, { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { emailService } from '../services/emailService';
import { Database, GlobalRole, FamilyRole, AuditAction } from '../models/database';
import { AuthenticatedRequest } from '../types/auth';
import {
  loginValidation,
  registerValidation,
  refreshTokenValidation,
  inviteTokenValidation,
  roleChangeValidation,
  passwordChangeValidation,
  handleValidationErrors,
  sanitizeInput
} from '../middleware/validation';
import {
  authenticateToken,
  validateFamilyContext,
  requireSuperAdmin,
  requireFamilyAdmin,
  preventSuperAdminSelfDemotion,
  authRateLimit,
  refreshRateLimit,
  getClientIP,
  getUserAgent,
  auditLog
} from '../middleware/auth';

const router = express.Router();

// POST /api/auth/login
router.post('/login', 
  authRateLimit,
  sanitizeInput,
  loginValidation, 
  handleValidationErrors,
  auditLog(AuditAction.LOGIN_SUCCESS),
  async (req: Request, res: Response) => {
    try {
      const loginResponse = await AuthService.login(
        req.body,
        getClientIP(req),
        getUserAgent(req)
      );
      
      // Set refresh token as HttpOnly cookie
      if (loginResponse.refreshToken) {
        res.cookie('kutumbos_refresh_token', loginResponse.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          path: '/'
        });
        
        // Don't send refresh token in response body
        const { refreshToken, ...responseWithoutRefreshToken } = loginResponse;
        res.json(responseWithoutRefreshToken);
      } else {
        res.json(loginResponse);
      }
    } catch (error) {
      console.error('Login error:', error);
      res.status(401).json({
        success: false,
        error: error instanceof Error ? error.message : 'Login failed',
        code: 'LOGIN_FAILED'
      });
    }
  }
);

// POST /api/auth/register
router.post('/register',
  authRateLimit,
  sanitizeInput,
  registerValidation,
  handleValidationErrors,
  auditLog(AuditAction.USER_CREATED),
  async (req: Request, res: Response) => {
    try {
      const registerResponse = await AuthService.register(
        req.body,
        getClientIP(req),
        getUserAgent(req)
      );
      
      // Set refresh token as HttpOnly cookie
      if (registerResponse.refreshToken) {
        res.cookie('kutumbos_refresh_token', registerResponse.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          path: '/'
        });
        
        // Don't send refresh token in response body
        const { refreshToken, ...responseWithoutRefreshToken } = registerResponse;
        res.status(201).json(responseWithoutRefreshToken);
      } else {
        res.status(201).json(registerResponse);
      }
    } catch (error) {
      console.error('Registration error:', error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Registration failed',
        code: 'REGISTRATION_FAILED'
      });
    }
  }
);

// POST /api/auth/refresh
router.post('/refresh',
  refreshRateLimit,
  sanitizeInput,
  handleValidationErrors,
  auditLog(AuditAction.TOKEN_REFRESH),
  async (req: Request, res: Response) => {
    try {
      // Get refresh token from cookie
      const refreshToken = req.cookies?.kutumbos_refresh_token;
      
      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          error: 'Refresh token not found',
          code: 'REFRESH_TOKEN_MISSING'
        });
      }

      const refreshResponse = await AuthService.refreshToken(
        { refreshToken },
        getClientIP(req),
        getUserAgent(req)
      );
      
      // Set new refresh token as HttpOnly cookie
      if (refreshResponse.refreshToken) {
        res.cookie('kutumbos_refresh_token', refreshResponse.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          path: '/'
        });
        
        // Don't send refresh token in response body
        const { refreshToken: newRefreshToken, ...responseWithoutRefreshToken } = refreshResponse;
        res.json(responseWithoutRefreshToken);
      } else {
        res.json(refreshResponse);
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      res.status(401).json({
        success: false,
        error: error instanceof Error ? error.message : 'Token refresh failed',
        code: 'REFRESH_FAILED'
      });
    }
  }
);

// POST /api/auth/logout
router.post('/logout',
  authenticateToken,
  auditLog(AuditAction.LOGOUT),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const refreshToken = req.cookies?.kutumbos_refresh_token;
      
      if (refreshToken) {
        await AuthService.logout(
          req.user!.id,
          refreshToken,
          getClientIP(req),
          getUserAgent(req)
        );
      }
      
      // Clear refresh token cookie
      res.clearCookie('kutumbos_refresh_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      });
      
      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        error: 'Logout failed',
        code: 'LOGOUT_FAILED'
      });
    }
  }
);

// POST /api/auth/logout-all
router.post('/logout-all',
  authenticateToken,
  auditLog(AuditAction.LOGOUT),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      await AuthService.logoutAll(
        req.user!.id,
        getClientIP(req),
        getUserAgent(req)
      );
      
      // Clear refresh token cookie
      res.clearCookie('kutumbos_refresh_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      });
      
      res.json({
        success: true,
        message: 'Logged out from all devices successfully'
      });
    } catch (error) {
      console.error('Logout all error:', error);
      res.status(500).json({
        success: false,
        error: 'Logout from all devices failed',
        code: 'LOGOUT_ALL_FAILED'
      });
    }
  }
);

// GET /api/auth/me
router.get('/me',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = await Database.findUserById(req.user!.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        });
      }

      const userProfile = AuthService.userToProfile(user);
      res.json({
        success: true,
        user: userProfile
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get user information',
        code: 'GET_USER_FAILED'
      });
    }
  }
);

// GET /api/auth/families
router.get('/families',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const families = await Database.getUserFamilies(req.user!.id);
      const familiesResponse = AuthService.familiesToResponse(families);
      
      res.json({
        success: true,
        families: familiesResponse
      });
    } catch (error) {
      console.error('Get families error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get families',
        code: 'GET_FAMILIES_FAILED'
      });
    }
  }
);

// Debug endpoint to test body parsing
router.post('/debug-body',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    console.log('Debug body request:', {
      body: req.body,
      headers: req.headers,
      method: req.method,
      url: req.url,
      user: req.user
    });
    
    res.json({
      success: true,
      receivedBody: req.body,
      bodyType: typeof req.body,
      bodyKeys: Object.keys(req.body || {}),
      contentLength: req.headers['content-length'],
      user: req.user
    });
  }
);

// POST /api/auth/validate-family
router.post('/validate-family',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      console.log('Validate family request body:', req.body);
      console.log('Validate family request headers:', req.headers);
      
      const { familyId } = req.body;
      
      if (!familyId) {
        console.log('Family ID missing from request body');
        return res.status(400).json({
          success: false,
          error: 'Family ID is required',
          code: 'FAMILY_ID_REQUIRED'
        });
      }

      const familyContext = await AuthService.validateFamilyContext(req.user!.id, familyId);
      
      res.json({
        success: true,
        familyContext
      });
    } catch (error) {
      console.error('Validate family error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to validate family context',
        code: 'VALIDATE_FAMILY_FAILED'
      });
    }
  }
);

// POST /api/auth/switch-family
router.post('/switch-family',
  authenticateToken,
  sanitizeInput,
  auditLog(AuditAction.FAMILY_SWITCH),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { familyId } = req.body;
      
      if (!familyId) {
        return res.status(400).json({
          success: false,
          error: 'Family ID is required',
          code: 'FAMILY_ID_REQUIRED'
        });
      }

      const familyContext = await AuthService.validateFamilyContext(req.user!.id, familyId);
      
      if (!familyContext.isValid) {
        return res.status(403).json({
          success: false,
          error: 'You do not have access to this family',
          code: 'FAMILY_ACCESS_DENIED'
        });
      }

      res.json({
        success: true,
        message: 'Family context switched successfully',
        familyContext
      });
    } catch (error) {
      console.error('Switch family error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to switch family context',
        code: 'SWITCH_FAMILY_FAILED'
      });
    }
  }
);

// POST /api/auth/generate-invite
router.post('/generate-invite',
  authenticateToken,
  validateFamilyContext,
  requireFamilyAdmin,
  sanitizeInput,
  inviteTokenValidation,
  handleValidationErrors,
  auditLog(AuditAction.INVITE_SENT),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { roleToAssign, expiresInHours = 24, recipientEmail } = req.body;
      const familyId = req.familyContext!.familyId;

      const inviteToken = await AuthService.generateInviteToken(
        familyId,
        roleToAssign as FamilyRole,
        req.user!.id,
        expiresInHours,
        recipientEmail
      );

      const inviteUrl = `${process.env.FRONTEND_URL}/new-register?invite=${inviteToken}`;

      // Send email if recipient email is provided
      if (recipientEmail) {
        // Get family and user details for email
        const family = await Database.findFamilyById(familyId);
        const inviter = await Database.findUserById(req.user!.id);

        if (family && inviter) {
          const emailResult = await emailService.sendInviteEmail({
            recipientEmail,
            familyName: family.name,
            inviterName: inviter.email, // Using email as name for now
            inviterEmail: inviter.email,
            role: roleToAssign as FamilyRole,
            inviteUrl,
            expiresInHours
          });

          if (!emailResult.success) {
            console.warn('Failed to send invite email:', emailResult.error);
          }
        }
      }

      res.json({
        success: true,
        inviteToken,
        expiresInHours,
        inviteUrl,
        emailSent: !!recipientEmail
      });
    } catch (error) {
      console.error('Generate invite error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate invite token',
        code: 'GENERATE_INVITE_FAILED'
      });
    }
  }
);

// GET /api/auth/test-email (Development only)
router.get('/test-email',
  async (req: Request, res: Response) => {
    try {
      const testResult = await emailService.testConnection();
      
      if (testResult.success) {
        // Send a test email
        const testEmailResult = await emailService.sendInviteEmail({
          recipientEmail: 'test@example.com',
          familyName: 'Test Family',
          inviterName: 'Test User',
          inviterEmail: 'admin@testfamily.com',
          role: FamilyRole.ADULT,
          inviteUrl: 'http://localhost:8080/new-register?invite=test-token',
          expiresInHours: 24
        });

        res.json({
          success: true,
          message: 'Email service is working',
          emailTest: testEmailResult
        });
      } else {
        res.json({
          success: false,
          message: 'Email service not configured or connection failed',
          error: testResult.error
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Email test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

// GET /api/auth/invite/:token
router.get('/invite/:token',
  async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      
      const inviteData = await AuthService.decodeInviteToken(token);
      
      if (!inviteData) {
        return res.status(404).json({
          success: false,
          error: 'Invalid or expired invite token',
          code: 'INVITE_NOT_FOUND'
        });
      }

      res.json({
        success: true,
        invite: inviteData
      });
    } catch (error) {
      console.error('Get invite error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get invite information',
        code: 'GET_INVITE_FAILED'
      });
    }
  }
);

// POST /api/auth/change-role
router.post('/change-role',
  authenticateToken,
  validateFamilyContext,
  requireFamilyAdmin,
  preventSuperAdminSelfDemotion,
  sanitizeInput,
  roleChangeValidation,
  handleValidationErrors,
  auditLog(AuditAction.ROLE_CHANGED),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { targetUserId, newRole } = req.body;
      const familyId = req.familyContext!.familyId;

      await AuthService.changeUserRole(
        targetUserId,
        familyId,
        newRole as FamilyRole,
        req.user!.id,
        getClientIP(req),
        getUserAgent(req)
      );

      res.json({
        success: true,
        message: 'User role changed successfully'
      });
    } catch (error) {
      console.error('Change role error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to change user role',
        code: 'CHANGE_ROLE_FAILED'
      });
    }
  }
);

// GET /api/auth/audit-logs
router.get('/audit-logs',
  authenticateToken,
  validateFamilyContext,
  requireFamilyAdmin,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { limit = '50', action } = req.query;
      const familyId = req.user!.globalRole === GlobalRole.SUPER_ADMIN 
        ? undefined 
        : req.familyContext!.familyId;

      const auditLogs = await Database.getAuditLogs({
        familyId,
        action: action as any,
        limit: parseInt(limit as string)
      });

      res.json({
        success: true,
        auditLogs
      });
    } catch (error) {
      console.error('Get audit logs error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get audit logs',
        code: 'GET_AUDIT_LOGS_FAILED'
      });
    }
  }
);

export default router;