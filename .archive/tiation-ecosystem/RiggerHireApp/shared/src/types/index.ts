import { z } from 'zod';

// User types
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  role: z.enum(['WORKER', 'EMPLOYER', 'ADMIN']),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

// Job types
export const JobSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  location: z.string(),
  rate: z.number(),
  employerId: z.string(),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'COMPLETED']),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Job = z.infer<typeof JobSchema>;

// Payment types
export const PaymentSchema = z.object({
  id: z.string(),
  jobId: z.string(),
  amount: z.number(),
  status: z.enum(['PENDING', 'COMPLETED', 'FAILED']),
  stripePaymentId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Payment = z.infer<typeof PaymentSchema>;

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}
