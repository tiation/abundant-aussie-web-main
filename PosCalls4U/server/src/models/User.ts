import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'supervisor' | 'agent';
  team?: mongoose.Types.ObjectId;
  isActive: boolean;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  lastLogin?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  
  // Social login fields
  googleId?: string;
  facebookId?: string;
  socialProviders: string[];
  
  // JWT tokens
  tokens: string[];
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  
  // Instance methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
  generatePasswordResetToken(): string;
  generateEmailVerificationToken(): string;
  isLocked(): boolean;
  incrementLoginAttempts(): Promise<void>;
  resetLoginAttempts(): Promise<void>;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    minlength: 8,
    select: false // Don't include password in queries by default
  },
  role: {
    type: String,
    enum: ['admin', 'supervisor', 'agent'],
    default: 'agent'
  },
  team: {
    type: Schema.Types.ObjectId,
    ref: 'Team'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastLogin: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  
  // Social login fields
  googleId: String,
  facebookId: String,
  socialProviders: [{
    type: String,
    enum: ['google', 'facebook']
  }],
  
  tokens: [{
    type: String
  }]
}, {
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      delete ret.password;
      delete ret.passwordResetToken;
      delete ret.passwordResetExpires;
      delete ret.emailVerificationToken;
      delete ret.emailVerificationExpires;
      delete (ret as any).tokens;
      delete (ret as any).loginAttempts;
      delete ret.lockUntil;
      return ret;
    }
  }
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ passwordResetToken: 1 });
userSchema.index({ emailVerificationToken: 1 });
userSchema.index({ googleId: 1 });
userSchema.index({ facebookId: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  const user = this as IUser;
  
  if (!user.isModified('password')) return next();
  
  try {
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(user.password!, saltRounds);
    user.password = hashedPassword;
    next();
  } catch (error) {
    next(error as any);
  }
});

// Instance method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  const user = this as IUser;
  if (!user.password) return false;
  return bcrypt.compare(candidatePassword, user.password);
};

// Instance method to generate auth token
userSchema.methods.generateAuthToken = function(): string {
  const user = this as IUser;
  const token = jwt.sign(
    { _id: (user._id as any).toString(), email: user.email, role: user.role },
    process.env.JWT_SECRET || 'default-secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
  );
  
  user.tokens = user.tokens.concat(token);
  return token;
};

// Instance method to generate password reset token
userSchema.methods.generatePasswordResetToken = function(): string {
  const user = this as IUser;
  const resetToken = jwt.sign(
    { _id: (user._id as any).toString(), purpose: 'password-reset' },
    process.env.JWT_SECRET || 'default-secret',
    { expiresIn: '1h' } as jwt.SignOptions
  );
  
  user.passwordResetToken = resetToken;
  user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  
  return resetToken;
};

// Instance method to generate email verification token
userSchema.methods.generateEmailVerificationToken = function(): string {
  const user = this as IUser;
  const verificationToken = jwt.sign(
    { _id: (user._id as any).toString(), purpose: 'email-verification' },
    process.env.JWT_SECRET || 'default-secret',
    { expiresIn: '24h' } as jwt.SignOptions
  );
  
  user.emailVerificationToken = verificationToken;
  user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  
  return verificationToken;
};

// Check if account is locked
userSchema.methods.isLocked = function(): boolean {
  const user = this as IUser;
  return !!(user.lockUntil && user.lockUntil > new Date());
};

// Increment login attempts
userSchema.methods.incrementLoginAttempts = async function(): Promise<void> {
  const user = this as IUser;
  const maxAttempts = 5;
  const lockTime = 2 * 60 * 60 * 1000; // 2 hours
  
  user.loginAttempts += 1;
  
  if (user.loginAttempts >= maxAttempts && !user.isLocked()) {
    user.lockUntil = new Date(Date.now() + lockTime);
  }
  
  await user.save();
};

// Reset login attempts
userSchema.methods.resetLoginAttempts = async function(): Promise<void> {
  const user = this as IUser;
  user.loginAttempts = 0;
  user.lockUntil = undefined;
  await user.save();
};

export const User = mongoose.model<IUser>('User', userSchema);
