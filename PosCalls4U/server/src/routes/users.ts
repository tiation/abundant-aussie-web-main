import express, { Request, Response } from 'express';
import { authenticate, requireAdmin, requireSupervisor } from '../middleware/auth';
import { catchAsync } from '../middleware/errorHandler';

const router = express.Router();

// Get all users (admin only)
router.get('/', authenticate, requireAdmin, catchAsync(async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'User management endpoints will be implemented in future steps',
    data: []
  });
}));

export default router;
