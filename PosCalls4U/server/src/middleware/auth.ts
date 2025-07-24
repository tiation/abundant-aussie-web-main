import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';

// Middleware to authenticate JWT tokens
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as any;
    const user = await User.findById(decoded._id).select('+tokens');
    
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.'
      });
      return;
    }

    // Check if token is still valid (exists in user's tokens array)
    if (!user.tokens.includes(token)) {
      res.status(401).json({
        success: false,
        message: 'Invalid token. Please login again.'
      });
      return;
    }

    // Check if account is active
    if (!user.isActive) {
      res.status(401).json({
        success: false,
        message: 'Account has been deactivated. Please contact support.'
      });
      return;
    }

    // Check if account is locked
    if (user.isLocked()) {
      res.status(423).json({
        success: false,
        message: 'Account is temporarily locked due to too many failed login attempts. Please try again later or reset your password.'
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
      return;
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: 'Token has expired. Please login again.'
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Server error during authentication.'
    });
  }
};

// Middleware to check if user has required role
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Access denied. Authentication required.'
      });
      return;
    }

    const user = req.user as IUser;
    if (!roles.includes(user.role)) {
      res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
      return;
    }

    next();
  };
};

// Middleware to check if user is admin
export const requireAdmin = authorize('admin');

// Middleware to check if user is supervisor or admin
export const requireSupervisor = authorize('admin', 'supervisor');

// Optional authentication - doesn't fail if no token provided
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      next();
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as any;
    const user = await User.findById(decoded._id);
    
    if (user && user.isActive && !user.isLocked()) {
      req.user = user;
    }
    
    next();
  } catch (error) {
    // Ignore authentication errors in optional auth
    next();
  }
};
