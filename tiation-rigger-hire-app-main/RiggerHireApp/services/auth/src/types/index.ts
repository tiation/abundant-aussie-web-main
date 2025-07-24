import { z } from 'zod';

// Role definitions aligned with Western Australia construction industry
export enum Role {
  ADMIN = 'ADMIN',
  EMPLOYER = 'EMPLOYER',
  RIGGER = 'RIGGER',
  DOGGER = 'DOGGER',
  CRANE_OPERATOR = 'CRANE_OPERATOR',
  SAFETY_OFFICER = 'SAFETY_OFFICER'
}

// Permission definitions
export enum Permission {
  CREATE_JOB = 'CREATE_JOB',
  VIEW_JOBS = 'VIEW_JOBS',
  MANAGE_USERS = 'MANAGE_USERS',
  VERIFY_CREDENTIALS = 'VERIFY_CREDENTIALS',
  MANAGE_SAFETY_RECORDS = 'MANAGE_SAFETY_RECORDS'
}

// User schema with Zod validation
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  passwordHash: z.string(),
  role: z.nativeEnum(Role),
  permissions: z.array(z.nativeEnum(Permission)),
  safetyLicenses: z.array(z.object({
    type: z.string(),
    number: z.string(),
    expiryDate: z.date(),
    isVerified: z.boolean()
  })),
  mobileNumber: z.string(),
  lastLogin: z.date().optional(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type User = z.infer<typeof UserSchema>;

// Token types
export interface JWTPayload {
  userId: string;
  role: Role;
  permissions: Permission[];
  exp: number;
}

export interface RefreshToken {
  token: string;
  userId: string;
  expiresAt: Date;
}
