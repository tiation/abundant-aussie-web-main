import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { emailService } from '../utils/emailService';
import { catchAsync, AppError } from '../middleware/errorHandler';

// Register new user
export const register = catchAsync(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400);
  }

  const { name, email, password, role } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('User already exists with this email', 400);
  }

  // Create new user
  const user = new User({
    name,
    email,
    password,
    role: role || 'agent',
  });

  // Generate email verification token
  const verificationToken = user.generateEmailVerificationToken();
  await user.save();

  // Send verification email
  await emailService.sendEmailVerificationEmail(email, verificationToken, name);

  res.status(201).json({
    success: true,
    message: 'User registered successfully. Please check your email to verify your account.',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    },
  });
});

// Login user
export const login = catchAsync(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400);
  }

  const { email, password } = req.body;

  // Find user and include password field
  const user = await User.findOne({ email }).select('+password +tokens');
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  // Check if account is locked
  if (user.isLocked()) {
    throw new AppError('Account is temporarily locked due to too many failed login attempts. Please try again later or reset your password.', 423);
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    await user.incrementLoginAttempts();
    throw new AppError('Invalid email or password', 401);
  }

  // Check if account is active
  if (!user.isActive) {
    throw new AppError('Account has been deactivated. Please contact support.', 401);
  }

  // Reset login attempts on successful login
  if (user.loginAttempts > 0) {
    await user.resetLoginAttempts();
  }

  // Generate JWT token
  const token = user.generateAuthToken();
  user.lastLogin = new Date();
  await user.save();

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        lastLogin: user.lastLogin,
      },
      token,
    },
  });
});

// Logout user
export const logout = catchAsync(async (req: Request, res: Response) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (req.user && token) {
    const user = req.user as IUser;
    // Remove the token from user's tokens array
    user.tokens = user.tokens.filter((t: string) => t !== token);
    await user.save();
  }

  res.json({
    success: true,
    message: 'Logout successful',
  });
});

// Logout from all devices
export const logoutAll = catchAsync(async (req: Request, res: Response) => {
  if (req.user) {
    const user = req.user as IUser;
    user.tokens = [];
    await user.save();
  }

  res.json({
    success: true,
    message: 'Logged out from all devices successfully',
  });
});

// Send password reset email
export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400);
  }

  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    // Don't reveal if email exists or not for security
    res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.',
    });
    return;
  }

  // Generate password reset token
  const resetToken = user.generatePasswordResetToken();
  await user.save();

  // Send password reset email
  const emailSent = await emailService.sendPasswordResetEmail(email, resetToken, user.name);
  
  if (!emailSent) {
    // Remove the reset token if email failed to send
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    
    throw new AppError('Failed to send password reset email. Please try again later.', 500);
  }

  res.json({
    success: true,
    message: 'Password reset link has been sent to your email.',
  });
});

// Reset password with token
export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400);
  }

  const { token, password } = req.body;

  // Verify the reset token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as any;
  } catch (error) {
    throw new AppError('Invalid or expired password reset token', 400);
  }

  // Find user with valid reset token
  const user = await User.findOne({
    _id: decoded._id,
    passwordResetToken: token,
    passwordResetExpires: { $gt: new Date() },
  });

  if (!user) {
    throw new AppError('Invalid or expired password reset token', 400);
  }

  // Update password and clear reset token
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.tokens = []; // Logout from all devices
  
  // Reset login attempts if any
  if (user.loginAttempts > 0) {
    await user.resetLoginAttempts();
  }

  await user.save();

  res.json({
    success: true,
    message: 'Password has been reset successfully. Please login with your new password.',
  });
});

// Verify email address
export const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const { token } = req.query;

  if (!token) {
    throw new AppError('Email verification token is required', 400);
  }

  // Verify the token
  let decoded;
  try {
    decoded = jwt.verify(token as string, process.env.JWT_SECRET || 'default-secret') as any;
  } catch (error) {
    throw new AppError('Invalid or expired email verification token', 400);
  }

  // Find user with valid verification token
  const user = await User.findOne({
    _id: decoded._id,
    emailVerificationToken: token,
    emailVerificationExpires: { $gt: new Date() },
  });

  if (!user) {
    throw new AppError('Invalid or expired email verification token', 400);
  }

  // Verify email and clear verification token
  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  // Send welcome email
  await emailService.sendWelcomeEmail(user.email, user.name);

  res.json({
    success: true,
    message: 'Email verified successfully. Welcome to PosCalls4U!',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    },
  });
});

// Resend email verification
export const resendEmailVerification = catchAsync(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400);
  }

  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user.isEmailVerified) {
    throw new AppError('Email is already verified', 400);
  }

  // Generate new verification token
  const verificationToken = user.generateEmailVerificationToken();
  await user.save();

  // Send verification email
  const emailSent = await emailService.sendEmailVerificationEmail(email, verificationToken, user.name);
  
  if (!emailSent) {
    throw new AppError('Failed to send verification email. Please try again later.', 500);
  }

  res.json({
    success: true,
    message: 'Verification email has been sent.',
  });
});

// Get current user profile
export const getProfile = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('User not found', 404);
  }

  const user = req.user as IUser;
  res.json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        socialProviders: user.socialProviders,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      },
    },
  });
});

// Social login success callback
export const socialLoginSuccess = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IUser;
  
  if (!user) {
    throw new AppError('Social login failed', 401);
  }

  // Generate JWT token
  const token = user.generateAuthToken();
  await user.save();

  // Redirect to frontend with token
  const redirectUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/auth/callback?token=${token}`;
  res.redirect(redirectUrl);
});

// Social login failure callback  
export const socialLoginFailure = catchAsync(async (req: Request, res: Response) => {
  const redirectUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/login?error=social_login_failed`;
  res.redirect(redirectUrl);
});
