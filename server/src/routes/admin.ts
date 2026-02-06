/**
 * Admin Routes
 * Super admin functionality for managing families and platform
 */

import express, { Request, Response } from 'express';
import { Database } from '../models/database';
import { AuthenticatedRequest } from '../types/auth';
import {
  authenticateToken,
  requireSuperAdmin,
  auditLog,
  getClientIP,
  getUserAgent
} from '../middleware/auth';
import { AuditAction } from '../models/database';

const router = express.Router();

// GET /api/admin/users - Get all users with their family details
router.get('/users',
  authenticateToken,
  requireSuperAdmin,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const users = await Database.getAllUsers();
      
      // Transform data for frontend with family details
      const usersData = await Promise.all(users.map(async (user) => {
        const families = await Database.getUserFamilies(user.id);
        
        return {
          id: user.id,
          email: user.email,
          globalRole: user.global_role,
          createdAt: user.created_at,
          lastLogin: user.last_login,
          failedLoginAttempts: user.failed_login_attempts,
          isLocked: user.locked_until ? user.locked_until > new Date() : false,
          isEmergencyUser: user.is_emergency_user,
          emergencyExpiresAt: user.emergency_expires_at,
          families: families.map(f => ({
            id: f.id,
            name: f.name,
            role: f.role,
            createdAt: f.created_at
          }))
        };
      }));

      res.json({
        success: true,
        data: usersData
      });
    } catch (error) {
      console.error('Failed to fetch users:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch users'
      });
    }
  }
);

// GET /api/admin/families - Get all families for super admin
router.get('/families',
  authenticateToken,
  requireSuperAdmin,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const families = await Database.getAllFamilies();
      
      // Transform data for frontend
      const familiesData = await Promise.all(families.map(async (family) => {
        const members = await Database.getFamilyMembers(family.id);
        const adminCount = members.filter(m => m.role === 'FAMILY_ADMIN').length;
        
        return {
          id: family.id,
          name: family.name,
          adminCount,
          memberCount: members.length,
          createdAt: family.created_at.toISOString().split('T')[0], // Format as YYYY-MM-DD
          status: family.is_active ? 'active' : 'suspended'
        };
      }));

      res.json({
        success: true,
        data: familiesData
      });
    } catch (error) {
      console.error('Failed to fetch families:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch families'
      });
    }
  }
);

// PUT /api/admin/families/:familyId/suspend - Suspend a family
router.put('/families/:familyId/suspend',
  authenticateToken,
  requireSuperAdmin,
  auditLog(AuditAction.FAMILY_LEFT), // Using closest available action
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { familyId } = req.params;
      
      const success = await Database.updateFamily(familyId, {
        is_active: false,
        updated_at: new Date()
      });

      if (success) {
        res.json({
          success: true,
          message: 'Family suspended successfully'
        });
      } else {
        res.status(404).json({
          success: false,
          error: 'Family not found'
        });
      }
    } catch (error) {
      console.error('Failed to suspend family:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to suspend family'
      });
    }
  }
);

// PUT /api/admin/families/:familyId/reinstate - Reinstate a family
router.put('/families/:familyId/reinstate',
  authenticateToken,
  requireSuperAdmin,
  auditLog(AuditAction.FAMILY_JOINED), // Using closest available action
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { familyId } = req.params;
      
      const success = await Database.updateFamily(familyId, {
        is_active: true,
        updated_at: new Date()
      });

      if (success) {
        res.json({
          success: true,
          message: 'Family reinstated successfully'
        });
      } else {
        res.status(404).json({
          success: false,
          error: 'Family not found'
        });
      }
    } catch (error) {
      console.error('Failed to reinstate family:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to reinstate family'
      });
    }
  }
);

export default router;