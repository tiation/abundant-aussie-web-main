import { z } from 'zod';

// Notification channels
export enum NotificationChannel {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH = 'PUSH',
  IN_APP = 'IN_APP'
}

// Notification priority levels
export enum NotificationPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

// Notification categories specific to construction industry
export enum NotificationCategory {
  SAFETY_ALERT = 'SAFETY_ALERT',
  LICENSE_EXPIRY = 'LICENSE_EXPIRY',
  JOB_MATCH = 'JOB_MATCH',
  DOCUMENT_VERIFICATION = 'DOCUMENT_VERIFICATION',
  SHIFT_UPDATE = 'SHIFT_UPDATE',
  PAYMENT_UPDATE = 'PAYMENT_UPDATE',
  COMPLIANCE_UPDATE = 'COMPLIANCE_UPDATE'
}

// Notification template schema
export const NotificationTemplateSchema = z.object({
  id: z.string().uuid(),
  category: z.nativeEnum(NotificationCategory),
  channel: z.nativeEnum(NotificationChannel),
  subject: z.string(),
  content: z.string(),
  variables: z.array(z.string()),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type NotificationTemplate = z.infer<typeof NotificationTemplateSchema>;

// Notification recipient schema
export const RecipientSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  pushToken: z.string().optional(),
  preferredChannels: z.array(z.nativeEnum(NotificationChannel)),
  timezone: z.string().default('Australia/Perth'),
  unsubscribedCategories: z.array(z.nativeEnum(NotificationCategory)).optional(),
  lastNotified: z.date().optional()
});

export type Recipient = z.infer<typeof RecipientSchema>;

// Notification request schema
export const NotificationRequestSchema = z.object({
  id: z.string().uuid(),
  category: z.nativeEnum(NotificationCategory),
  priority: z.nativeEnum(NotificationPriority),
  recipients: z.array(RecipientSchema),
  templateId: z.string().uuid(),
  variables: z.record(z.string(), z.string()),
  scheduledFor: z.date().optional(),
  expiresAt: z.date().optional(),
  metadata: z.record(z.string(), z.unknown()).optional()
});

export type NotificationRequest = z.infer<typeof NotificationRequestSchema>;

// Notification delivery status
export interface DeliveryStatus {
  notificationId: string;
  recipientId: string;
  channel: NotificationChannel;
  status: 'QUEUED' | 'SENT' | 'DELIVERED' | 'FAILED';
  attemptCount: number;
  lastAttempt: Date;
  error?: string;
}

// Notification batch
export interface NotificationBatch {
  id: string;
  notifications: NotificationRequest[];
  priority: NotificationPriority;
  processedCount: number;
  failedCount: number;
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
  createdAt: Date;
  completedAt?: Date;
}
