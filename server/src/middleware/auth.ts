/**
 * KutumbOS Authentication Middleware
 * JWT validation, family context validation, and role-based access control
 */

import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { AuthService } from '../services/authService';
import { Database, GlobalRole, FamilyRole } from '../models/database';
import { AuthenticatedRequest, FamilyContext } from '../types/auth';

// Rate limiting for auth endpoints
export const authRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 attempts per minute per IP
  message: {
    success: false,
    error: 'Too many authentication attempts. Please try again later.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for refresh token endpoint (but with different limits)
    return req.path === '/refresh';
  }
});

// Rate limiting for refresh token endpoint
export const refreshRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 refresh attempts per minute per IP
  message: {
    success: false,
    error: 'Too many token refresh attempts. Please try again later.',
    code: 'REFRESH_RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Extract IP address from request
export const getClientIP = (req: Request): string => {
  return (
    (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    'unknown'
  );
};

// Extract user agent from request
export const getUserAgent = (req: Request): string => {
  return req.headers['user-agent'] || 'unknown';
};

// JWT Authentication Middleware
export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Access token required',
        code: 'TOKEN_MISSING'
      });
      return;
    }

    // Verify JWT token
    const payload = AuthService.verifyAccessToken(token);
    if (!payload) {
      res.status(401).json({
        success: false,
        error: 'Invalid or expired access token',
        code: 'TOKEN_INVALID'
      });
      return;
    }

    // Check if user exists and token version matches
    const user = await Database.findUserById(payload.userId);
    if (!user) {
      res.status(401).json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
      return;
    }

    if (user.token_version !== payload.tokenVersion) {
      res.status(401).json({
        success: false,
        error: 'Token has been invalidated. Please login again.',
        code: 'TOKEN_INVALIDATED'
      });
      return;
    }

    // Attach user to request
    req.user = {
      id: payload.userId,
      globalRole: payload.globalRole,
      tokenVersion: payload.tokenVersion
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      error: 'Authentication failed',
      code: 'AUTH_ERROR'
    });
  }
};

// Family Context Validation Middleware
export const validateFamilyContext = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
      return;
    }

    // Super Admin bypasses family context validation
    if (req.user.globalRole === GlobalRole.SUPER_ADMIN) {
      req.familyContext = {
        familyId: 'super_admin',
        userRole: FamilyRole.FAMILY_ADMIN, // Super admin has all permissions
        isValid: true
      };
      next();
      return;
    }

    // Get family ID from header
    const familyId = req.headers['x-family-id'] as string;
    if (!familyId) {
      res.status(400).json({
        success: false,
        error: 'Family context required. Please select a family.',
        code: 'FAMILY_CONTEXT_MISSING'
      });
      return;
    }

    // Validate family context
    const familyContext = await AuthService.validateFamilyContext(req.user.id, familyId);
    if (!familyContext.isValid) {
      res.status(403).json({
        success: false,
        error: 'You do not have access to this family',
        code: 'FAMILY_ACCESS_DENIED'
      });
      return;
    }

    req.familyContext = familyContext;
    next();
  } catch (error) {
    console.error('Family context validation error:', error);
    res.status(500).json({
      success: false,
      error: 'Family context validation failed',
      code: 'FAMILY_CONTEXT_ERROR'
    });
  }
};

// Role-based access control middleware
export const requireGlobalRole = (allowedRoles: GlobalRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
      return;
    }

    if (!allowedRoles.includes(req.user.globalRole)) {
      res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
      return;
    }

    next();
  };
};

// Family role-based access control middleware
export const requireFamilyRole = (allowedRoles: FamilyRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
      return;
    }

    if (!req.familyContext) {
      res.status(400).json({
        success: false,
        error: 'Family context required',
        code: 'FAMILY_CONTEXT_MISSING'
      });
      return;
    }

    // Super Admin bypasses family role checks
    if (req.user.globalRole === GlobalRole.SUPER_ADMIN) {
      next();
      return;
    }

    if (!allowedRoles.includes(req.familyContext.userRole)) {
      res.status(403).json({
        success: false,
        error: 'Insufficient family permissions',
        code: 'INSUFFICIENT_FAMILY_PERMISSIONS'
      });
      return;
    }

    next();
  };
};

// Super Admin only middleware
export const requireSuperAdmin = requireGlobalRole([GlobalRole.SUPER_ADMIN]);

// Family Admin or Super Admin middleware
export const requireFamilyAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: 'Authentication required',
      code: 'AUTH_REQUIRED'
    });
    return;
  }

  // Super Admin always allowed
  if (req.user.globalRole === GlobalRole.SUPER_ADMIN) {
    next();
    return;
  }

  // Check family admin role
  if (!req.familyContext || req.familyContext.userRole !== FamilyRole.FAMILY_ADMIN) {
    res.status(403).json({
      success: false,
      error: 'Family admin permissions required',
      code: 'FAMILY_ADMIN_REQUIRED'
    });
    return;
  }

  next();
};

// Middleware to prevent Super Admin self-demotion
export const preventSuperAdminSelfDemotion = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: 'Authentication required',
      code: 'AUTH_REQUIRED'
    });
    return;
  }

  // Check if Super Admin is trying to modify their own role
  const targetUserId = req.params.userId || req.body.userId;
  if (
    req.user.globalRole === GlobalRole.SUPER_ADMIN &&
    targetUserId === req.user.id &&
    (req.body.globalRole !== GlobalRole.SUPER_ADMIN || req.body.role !== 'SUPER_ADMIN')
  ) {
    res.status(403).json({
      success: false,
      error: 'Super Admin cannot demote themselves',
      code: 'SUPER_ADMIN_SELF_DEMOTION_DENIED'
    });
    return;
  }

  next();
};

// Optional authentication middleware (for public endpoints that can benefit from user context)
export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const payload = AuthService.verifyAccessToken(token);
      if (payload) {
        const user = await Database.findUserById(payload.userId);
        if (user && user.token_version === payload.tokenVersion) {
          req.user = {
            id: payload.userId,
            globalRole: payload.globalRole,
            tokenVersion: payload.tokenVersion
          };
        }
      }
    }

    next();
  } catch (error) {
    // Ignore errors in optional auth
    next();
  }
};

// Audit logging middleware
export const auditLog = (action: string) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Store original res.json to intercept response
      const originalJson = res.json;
      
      res.json = function(body: any) {
        // Log the action after response
        setImmediate(async () => {
          try {
            await Database.createAuditLog({
              user_id: req.user?.id || null,
              family_id: req.familyContext?.familyId || null,
              action: action as any,
              details: {
                method: req.method,
                path: req.path,
                body: req.body,
                success: body.success
              },
              ip_address: getClientIP(req),
              user_agent: getUserAgent(req)
            });
          } catch (error) {
            console.error('Audit logging error:', error);
          }
        });

        return originalJson.call(this, body);
      };

      next();
    } catch (error) {
      console.error('Audit middleware error:', error);
      next();
    }
  };
};