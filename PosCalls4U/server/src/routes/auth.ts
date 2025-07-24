import express from 'express';
import { body, query } from 'express-validator';
import passport from 'passport';
import {
  register,
  login,
  logout,
  logoutAll,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendEmailVerification,
  getProfile,
  socialLoginSuccess,
  socialLoginFailure
} from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { catchAsync } from '../middleware/errorHandler';

const router = express.Router();

// Register
router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
], register);

// Login
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password is required'),
], login);

// Logout
router.post('/logout', authenticate, logout);

// Logout from all devices
router.post('/logout-all', authenticate, logoutAll);

// Password reset - request
router.post('/forgot-password', [
  body('email').isEmail().withMessage('Valid email is required'),
], forgotPassword);

// Password reset - confirm
router.post('/reset-password', [
  body('token').notEmpty().withMessage('Token is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
], resetPassword);

// Email verification
router.post('/verify-email', [
  query('token').notEmpty().withMessage('Verification token is required')
], verifyEmail);

// Resend email verification
router.post('/resend-verification', [
  body('email').isEmail().withMessage('Valid email is required'),
], resendEmailVerification);

// Social login (Google)
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  socialLoginSuccess);

// Social login (Facebook)
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  socialLoginSuccess);

// Profiling
router.get('/profile', authenticate, getProfile);

export default router;

