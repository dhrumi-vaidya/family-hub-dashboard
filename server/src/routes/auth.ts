import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Database } from '../config/database';
import { AuthRequest, AuthResponse, JWTPayload } from '../types/auth';
import { loginValidation, handleValidationErrors } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Generate JWT tokens
const generateTokens = (user: any) => {
  const jwtSecret = process.env.JWT_SECRET!;
  
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    familyIds: user.families.map((f: any) => f.id),
  };

  const token = jwt.sign(payload, jwtSecret, { expiresIn: '7d' });
  const refreshToken = jwt.sign(
    { userId: user.id, tokenVersion: 1 },
    jwtSecret,
    { expiresIn: '30d' }
  );

  return { token, refreshToken };
};

// POST /api/auth/login
router.post('/login', loginValidation, handleValidationErrors, async (req: Request, res: Response) => {
  try {
    const { email, password }: AuthRequest = req.body;

    // Find user by email or phone
    const user = await Database.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Incorrect details. Please try again.',
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Incorrect details. Please try again.',
      });
    }

    // Generate tokens
    const { token, refreshToken } = generateTokens(user);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    const response: AuthResponse = {
      success: true,
      user: userWithoutPassword,
      token,
      refreshToken,
    };

    return res.json(response);
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'Login failed. Please try again.',
    });
  }
});

// POST /api/auth/refresh
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: 'Refresh token required',
      });
    }

    const jwtSecret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(refreshToken, jwtSecret) as any;

    // Find user
    const user = await Database.findUserById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found',
      });
    }

    // Generate new tokens
    const { token, refreshToken: newRefreshToken } = generateTokens(user);

    return res.json({
      success: true,
      token,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    return res.status(401).json({
      success: false,
      error: 'Invalid refresh token',
    });
  }
});

// POST /api/auth/logout
router.post('/logout', authenticateToken, async (req: Request, res: Response) => {
  try {
    // In a real app, you'd invalidate the refresh token in the database
    // For now, we'll just return success
    return res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      success: false,
      error: 'Logout failed',
    });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = await Database.findUserById(req.user!.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    const { password: _, ...userWithoutPassword } = user;
    return res.json({
      success: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get user information',
    });
  }
});

// GET /api/auth/families
router.get('/families', authenticateToken, async (req: Request, res: Response) => {
  try {
    const families = await Database.getUserFamilies(req.user!.id);
    return res.json({
      success: true,
      families,
    });
  } catch (error) {
    console.error('Get families error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get families',
    });
  }
});

export default router;