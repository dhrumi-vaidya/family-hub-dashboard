/**
 * Dashboard Data Routes
 * Provides data for dashboard components
 */

import express, { Request, Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import {
  authenticateToken,
  validateFamilyContext
} from '../middleware/auth';

const router = express.Router();

// GET /api/budget/monthly-summary - Get monthly budget data
router.get('/budget/monthly-summary',
  authenticateToken,
  validateFamilyContext,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      // For now, return empty array - this would be replaced with actual budget data
      const budgetData = [];

      res.json({
        success: true,
        data: budgetData
      });
    } catch (error) {
      console.error('Failed to fetch budget data:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch budget data'
      });
    }
  }
);

// GET /api/expenses/category-summary - Get expense category data
router.get('/expenses/category-summary',
  authenticateToken,
  validateFamilyContext,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      // For now, return empty array - this would be replaced with actual expense data
      const expenseData = [];

      res.json({
        success: true,
        data: expenseData
      });
    } catch (error) {
      console.error('Failed to fetch expense data:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch expense data'
      });
    }
  }
);

// GET /api/tasks/personal - Get personal tasks
router.get('/tasks/personal',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      // For now, return empty array - this would be replaced with actual task data
      const tasks = [];

      res.json({
        success: true,
        data: tasks
      });
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch tasks'
      });
    }
  }
);

// GET /api/health/latest-record - Get latest health record
router.get('/health/latest-record',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      // For now, return null - this would be replaced with actual health data
      const healthRecord = null;

      res.json({
        success: true,
        data: healthRecord
      });
    } catch (error) {
      console.error('Failed to fetch health record:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch health record'
      });
    }
  }
);

// GET /api/health/medicines/today - Get today's medicines
router.get('/health/medicines/today',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      // For now, return empty array - this would be replaced with actual medicine data
      const medicines = [];

      res.json({
        success: true,
        data: medicines
      });
    } catch (error) {
      console.error('Failed to fetch medicines:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch medicines'
      });
    }
  }
);

export default router;