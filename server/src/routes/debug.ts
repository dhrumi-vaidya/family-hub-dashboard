import express from 'express';
import { Database } from '../models/database';

const router = express.Router();

// Get all users (without passwords)
router.get('/users', async (req, res) => {
  try {
    const users = (Database as any).users.map((user: any) => ({
      id: user.id,
      email: user.email,
      global_role: user.global_role,
      created_at: user.created_at,
      last_login: user.last_login,
      failed_login_attempts: user.failed_login_attempts,
      is_emergency_user: user.is_emergency_user
    }));
    
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch users' });
  }
});

// Get all families
router.get('/families', async (req, res) => {
  try {
    const families = (Database as any).families;
    res.json({ success: true, data: families });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch families' });
  }
});

// Get all family members
router.get('/family-members', async (req, res) => {
  try {
    const members = (Database as any).familyMembers;
    res.json({ success: true, data: members });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch family members' });
  }
});

// Get audit logs
router.get('/audit-logs', async (req, res) => {
  try {
    const logs = await Database.getAuditLogs({ limit: 50 });
    res.json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch audit logs' });
  }
});

// Get refresh tokens (without actual tokens)
router.get('/refresh-tokens', async (req, res) => {
  try {
    const tokens = (Database as any).refreshTokens.map((token: any) => ({
      id: token.id,
      user_id: token.user_id,
      expires_at: token.expires_at,
      created_at: token.created_at
    }));
    res.json({ success: true, data: tokens });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch refresh tokens' });
  }
});

// Get invite tokens
router.get('/invite-tokens', async (req, res) => {
  try {
    const invites = (Database as any).inviteTokens;
    res.json({ success: true, data: invites });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch invite tokens' });
  }
});

export default router;