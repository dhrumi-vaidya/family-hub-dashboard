/**
 * KutumbOS Validation Middleware
 * Request validation using express-validator
 */

import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Handle validation errors
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: errors.array()
    });
    return;
  }
  next();
};

// Login validation
export const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required')
    .isLength({ min: 1, max: 255 })
    .withMessage('Email must be between 1 and 255 characters'),
  
  body('password')
    .isLength({ min: 1 })
    .withMessage('Password is required')
];

// Registration validation
export const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required')
    .isLength({ min: 1, max: 255 })
    .withMessage('Email must be between 1 and 255 characters'),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  
  body('familyName')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Family name must be between 1 and 100 characters')
    .matches(/^[a-zA-Z0-9\s\-_']+$/)
    .withMessage('Family name can only contain letters, numbers, spaces, hyphens, underscores, and apostrophes'),
  
  body('inviteToken')
    .optional()
    .isLength({ min: 1, max: 255 })
    .withMessage('Invalid invite token format'),
  
  // Custom validation: either familyName or inviteToken must be provided
  body().custom((value, { req }) => {
    if (!req.body.familyName && !req.body.inviteToken) {
      throw new Error('Either familyName or inviteToken is required');
    }
    if (req.body.familyName && req.body.inviteToken) {
      throw new Error('Cannot provide both familyName and inviteToken');
    }
    return true;
  })
];

// Refresh token validation
export const refreshTokenValidation = [
  body('refreshToken')
    .optional()
    .isLength({ min: 1 })
    .withMessage('Refresh token is required')
    .isHexadecimal()
    .withMessage('Invalid refresh token format')
];

// Family context validation
export const familyContextValidation = [
  body('familyId')
    .optional()
    .isUUID()
    .withMessage('Invalid family ID format'),
  
  // Custom validation for X-FAMILY-ID header
  (req: Request, res: Response, next: NextFunction) => {
    const familyId = req.headers['x-family-id'] as string;
    if (familyId && !/^[a-zA-Z0-9_-]+$/.test(familyId)) {
      res.status(400).json({
        success: false,
        error: 'Invalid family ID format in header',
        code: 'INVALID_FAMILY_ID'
      });
      return;
    }
    next();
  }
];

// Invite token generation validation
export const inviteTokenValidation = [
  body('recipientEmail')
    .optional()
    .isEmail()
    .withMessage('Invalid email address'),
    
  body('roleToAssign')
    .isIn(['FAMILY_ADMIN', 'ADULT', 'SENIOR', 'TEEN', 'CHILD', 'EMERGENCY'])
    .withMessage('Invalid role. Must be one of: FAMILY_ADMIN, ADULT, SENIOR, TEEN, CHILD, EMERGENCY'),
  
  body('expiresInHours')
    .optional()
    .isInt({ min: 1, max: 168 }) // 1 hour to 7 days
    .withMessage('Expiry must be between 1 and 168 hours (7 days)')
];

// Role change validation
export const roleChangeValidation = [
  body('targetUserId')
    .isLength({ min: 1 })
    .withMessage('Target user ID is required'),
  
  body('familyId')
    .isLength({ min: 1 })
    .withMessage('Family ID is required'),
  
  body('newRole')
    .isIn(['FAMILY_ADMIN', 'ADULT', 'SENIOR', 'TEEN', 'CHILD', 'EMERGENCY'])
    .withMessage('Invalid role. Must be one of: FAMILY_ADMIN, ADULT, SENIOR, TEEN, CHILD, EMERGENCY')
];

// Password change validation
export const passwordChangeValidation = [
  body('currentPassword')
    .isLength({ min: 1 })
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  
  // Custom validation: new password must be different from current
  body('newPassword').custom((value, { req }) => {
    if (value === req.body.currentPassword) {
      throw new Error('New password must be different from current password');
    }
    return true;
  })
];

// Sanitize input middleware
export const sanitizeInput = (req: Request, res: Response, next: NextFunction): void => {
  // Remove any potential XSS attempts
  const sanitizeString = (str: string): string => {
    return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
              .replace(/javascript:/gi, '')
              .replace(/on\w+\s*=/gi, '');
  };

  const sanitizeObject = (obj: any): any => {
    if (typeof obj === 'string') {
      return sanitizeString(obj);
    }
    if (typeof obj === 'object' && obj !== null) {
      const sanitized: any = {};
      for (const key in obj) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
      return sanitized;
    }
    return obj;
  };

  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  next();
};