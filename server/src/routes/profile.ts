/**
 * KutumbOS Profile Routes
 * GET  /api/profile      — fetch current user's profile
 * PUT  /api/profile      — create or update current user's profile
 */

import express, { Response } from 'express';
import { body, validationResult } from 'express-validator';
import { Database, AuditAction } from '../models/database';
import { AuthenticatedRequest } from '../types/auth';
import { authenticateToken, getClientIP, getUserAgent } from '../middleware/auth';
import { sanitizeInput } from '../middleware/validation';

const router = express.Router();

// Validation rules
const profileValidation = [
  body('name')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters'),

  body('phone')
    .optional()
    .matches(/^[+\d\s\-()]{7,20}$/)
    .withMessage('Invalid phone number format'),

  body('email')
    .optional()
    .isEmail()
    .withMessage('Invalid email address'),

  body('date_of_birth')
    .optional()
    .isISO8601()
    .withMessage('Date of birth must be a valid date (YYYY-MM-DD)'),

  body('blood_group')
    .optional()
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', ''])
    .withMessage('Invalid blood group'),

  body('emergency_contact')
    .optional()
    .matches(/^[+\d\s\-()]{0,20}$/)
    .withMessage('Invalid emergency contact format'),

  body('family_role')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Family role too long'),

  body('photo_base64')
    .optional()
    .custom((val: string) => {
      if (!val) return true;
      // Must be a valid base64 data URL (image/jpeg, image/png, image/webp)
      if (!/^data:image\/(jpeg|png|webp);base64,/.test(val)) {
        throw new Error('Photo must be a base64 encoded JPEG, PNG or WebP image');
      }
      // Rough size check: base64 of 2MB ≈ 2.7M chars
      if (val.length > 2_800_000) {
        throw new Error('Photo must be under 2MB');
      }
      return true;
    }),
];

// GET /api/profile
router.get('/',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const profile = await Database.getProfile(req.user!.id);
      res.json({
        success: true,
        profile: profile ?? null,
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch profile' });
    }
  }
);

// PUT /api/profile
router.put('/',
  authenticateToken,
  sanitizeInput,
  profileValidation,
  async (req: AuthenticatedRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    try {
      const {
        name = '',
        phone = '',
        date_of_birth = '',
        blood_group = '',
        emergency_contact = '',
        family_role = '',
        photo_base64 = '',
      } = req.body;

      const profile = await Database.upsertProfile(req.user!.id, {
        name,
        phone,
        date_of_birth,
        blood_group,
        emergency_contact,
        family_role,
        photo_base64,
      });

      // Audit log
      await Database.createAuditLog({
        user_id: req.user!.id,
        family_id: null,
        action: AuditAction.PROFILE_UPDATED,
        details: {
          fields_updated: Object.keys(req.body).filter(k => k !== 'photo_base64'),
          photo_updated: !!photo_base64,
        },
        ip_address: getClientIP(req),
        user_agent: getUserAgent(req),
      });

      console.log(`[Profile] Updated for user ${req.user!.id}:`, {
        name,
        phone,
        date_of_birth,
        blood_group,
        emergency_contact,
        family_role,
        photo_updated: !!photo_base64,
        updated_at: profile.updated_at,
      });

      res.json({
        success: true,
        profile,
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ success: false, error: 'Failed to update profile' });
    }
  }
);

export default router;
