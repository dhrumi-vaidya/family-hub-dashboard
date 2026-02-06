/**
 * Family Management Routes
 * Handles family-related operations and data fetching
 */

import express, { Request, Response } from 'express';
import { Database } from '../models/database';
import { AuthenticatedRequest } from '../types/auth';
import {
  authenticateToken,
  validateFamilyContext,
  requireFamilyAdmin,
  auditLog,
  getClientIP,
  getUserAgent
} from '../middleware/auth';
import { AuditAction } from '../models/database';

const router = express.Router();

// GET /api/family/members - Get family members
router.get('/members',
  authenticateToken,
  validateFamilyContext,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const familyId = req.familyContext!.familyId;
      const members = await Database.getFamilyMembers(familyId);
      
      // Transform data for frontend
      const membersData = members.map(member => ({
        id: member.user_id,
        name: member.user?.email?.split('@')[0] || 'Unknown', // Use email prefix as name for now
        email: member.user?.email || '',
        role: member.role,
        joinedAt: member.joined_at,
        lastActive: member.user?.last_login || member.joined_at,
        status: 'active' // Default status
      }));

      res.json({
        success: true,
        data: membersData
      });
    } catch (error) {
      console.error('Failed to fetch family members:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch family members'
      });
    }
  }
);

// PUT /api/family/members/:memberId/role - Update member role
router.put('/members/:memberId/role',
  authenticateToken,
  validateFamilyContext,
  requireFamilyAdmin,
  auditLog(AuditAction.ROLE_CHANGED),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { memberId } = req.params;
      const { role } = req.body;
      const familyId = req.familyContext!.familyId;

      const success = await Database.updateFamilyMemberRole(
        memberId,
        familyId,
        role
      );

      if (success) {
        res.json({
          success: true,
          message: 'Member role updated successfully'
        });
      } else {
        res.status(404).json({
          success: false,
          error: 'Member not found'
        });
      }
    } catch (error) {
      console.error('Failed to update member role:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update member role'
      });
    }
  }
);

// GET /api/family/invitations - Get sent invitations for the family
router.get('/invitations',
  authenticateToken,
  validateFamilyContext,
  requireFamilyAdmin,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const familyId = req.familyContext!.familyId;
      const invitations = await Database.getFamilyInvitations(familyId);
      
      // Transform data for frontend
      const invitationsData = invitations.map(invitation => ({
        id: invitation.id,
        recipientEmail: invitation.recipient_email,
        role: invitation.role_to_assign,
        expiresAt: invitation.expires_at,
        createdAt: invitation.created_at,
        isUsed: invitation.used_at !== null,
        inviteUrl: `${process.env.FRONTEND_URL || 'http://localhost:8080'}/new-register?invite=${invitation.token}`,
        invitedBy: invitation.created_by
      }));

      res.json({
        success: true,
        data: invitationsData
      });
    } catch (error) {
      console.error('Failed to fetch family invitations:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch invitations'
      });
    }
  }
);

// DELETE /api/family/invitations/:invitationId - Revoke an invitation
router.delete('/invitations/:invitationId',
  authenticateToken,
  validateFamilyContext,
  requireFamilyAdmin,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { invitationId } = req.params;
      const familyId = req.familyContext!.familyId;
      
      const success = await Database.revokeInvitation(invitationId, familyId);
      
      if (success) {
        res.json({
          success: true,
          message: 'Invitation revoked successfully'
        });
      } else {
        res.status(404).json({
          success: false,
          error: 'Invitation not found'
        });
      }
    } catch (error) {
      console.error('Failed to revoke invitation:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to revoke invitation'
      });
    }
  }
);

export default router;