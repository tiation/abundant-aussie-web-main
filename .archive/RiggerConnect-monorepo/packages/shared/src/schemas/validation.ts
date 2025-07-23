import { z } from 'zod';
import {
  JobType,
  JobCategory,
  JobStatus,
  ApplicationStatus,
  MilestoneStatus,
  Priority,
  ExperienceLevel,
  VerificationStatus,
  CompanySize,
  EquipmentType,
  EquipmentCondition,
  TravelWillingness,
} from '../types/core';

// Enum schemas
export const JobTypeSchema = z.nativeEnum(JobType);
export const JobCategorySchema = z.nativeEnum(JobCategory);
export const JobStatusSchema = z.nativeEnum(JobStatus);
export const ApplicationStatusSchema = z.nativeEnum(ApplicationStatus);
export const MilestoneStatusSchema = z.nativeEnum(MilestoneStatus);
export const PrioritySchema = z.nativeEnum(Priority);
export const ExperienceLevelSchema = z.nativeEnum(ExperienceLevel);
export const VerificationStatusSchema = z.nativeEnum(VerificationStatus);
export const CompanySizeSchema = z.nativeEnum(CompanySize);
export const EquipmentTypeSchema = z.nativeEnum(EquipmentType);
export const EquipmentConditionSchema = z.nativeEnum(EquipmentCondition);
export const TravelWillingnessSchema = z.nativeEnum(TravelWillingness);

// Supporting schemas
export const LocationSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(5, 'Valid zip code is required'),
  country: z.string().min(1, 'Country is required'),
  coordinates: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }).optional(),
});

export const BudgetSchema = z.object({
  type: z.enum(['fixed', 'hourly']),
  amount: z.number().min(0, 'Amount must be positive'),
  currency: z.string().min(3).max(3),
  negotiable: z.boolean(),
});

export const TimelineSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
  duration: z.string().min(1),
  flexibility: z.enum(['strict', 'flexible', 'very_flexible']),
}).refine((data) => data.endDate > data.startDate, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

export const JobRequirementSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['skill', 'certification', 'experience', 'equipment']),
  value: z.string().min(1),
  required: z.boolean(),
});

export const AttachmentSchema = z.object({
  id: z.string().uuid(),
  filename: z.string().min(1),
  url: z.string().url(),
  size: z.number().min(0),
  mimeType: z.string().min(1),
  uploadedAt: z.date(),
  uploadedBy: z.string().uuid(),
});

export const TimeSlotSchema = z.object({
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
}).refine((data) => data.endTime > data.startTime, {
  message: 'End time must be after start time',
  path: ['endTime'],
});

export const DayScheduleSchema = z.object({
  available: z.boolean(),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  breaks: z.array(TimeSlotSchema).optional(),
});

export const WeeklyScheduleSchema = z.object({
  monday: DayScheduleSchema,
  tuesday: DayScheduleSchema,
  wednesday: DayScheduleSchema,
  thursday: DayScheduleSchema,
  friday: DayScheduleSchema,
  saturday: DayScheduleSchema,
  sunday: DayScheduleSchema,
});

export const DateRangeSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
  reason: z.string().optional(),
}).refine((data) => data.endDate >= data.startDate, {
  message: 'End date must be on or after start date',
  path: ['endDate'],
});

export const AvailabilitySchema = z.object({
  schedule: WeeklyScheduleSchema,
  timeZone: z.string().min(1),
  blackoutDates: z.array(DateRangeSchema),
  maxConcurrentJobs: z.number().min(1).max(10),
  travelWillingness: TravelWillingnessSchema,
});

export const PaymentMethodSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['credit_card', 'bank_account', 'paypal', 'crypto']),
  lastFour: z.string().length(4).optional(),
  brand: z.string().optional(),
  isDefault: z.boolean(),
  expiresAt: z.date().optional(),
});

export const EquipmentSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Equipment name is required'),
  type: EquipmentTypeSchema,
  brand: z.string().optional(),
  model: z.string().optional(),
  specifications: z.record(z.any()).optional(),
  condition: EquipmentConditionSchema,
  purchaseDate: z.date().optional(),
  lastMaintenanceDate: z.date().optional(),
});

export const CertificationSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Certification name is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  issuedAt: z.date(),
  expiresAt: z.date().optional(),
  credentialId: z.string().optional(),
  verificationUrl: z.string().url().optional(),
}).refine((data) => !data.expiresAt || data.expiresAt > data.issuedAt, {
  message: 'Expiration date must be after issue date',
  path: ['expiresAt'],
});

export const PortfolioItemSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  images: z.array(z.string().url()).min(1, 'At least one image is required'),
  videos: z.array(z.string().url()).optional(),
  jobType: JobTypeSchema,
  completedAt: z.date(),
  clientFeedback: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
});

// Core entity schemas
export const BaseUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  avatar: z.string().url().optional(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional(),
  location: LocationSchema.optional(),
  skills: z.array(z.string().min(1)).min(1, 'At least one skill is required'),
  experience: ExperienceLevelSchema,
  rating: z.number().min(0).max(5),
  verificationStatus: VerificationStatusSchema,
  profileCompleteness: z.number().min(0).max(100),
  isOnline: z.boolean(),
  lastSeen: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const RiggerProfileSchema = BaseUserSchema.extend({
  portfolio: z.array(PortfolioItemSchema),
  certifications: z.array(CertificationSchema),
  availability: AvailabilitySchema,
  hourlyRate: z.number().min(0).optional(),
  preferredJobTypes: z.array(JobTypeSchema).min(1),
  workRadius: z.number().min(0).max(500), // max 500 miles
  equipment: z.array(EquipmentSchema),
  completedJobs: z.number().min(0),
  totalEarnings: z.number().min(0),
});

export const ClientProfileSchema = BaseUserSchema.extend({
  companyName: z.string().min(1).optional(),
  companySize: CompanySizeSchema.optional(),
  industry: z.string().optional(),
  paymentMethods: z.array(PaymentMethodSchema).min(1, 'At least one payment method is required'),
  totalSpent: z.number().min(0),
  jobsPosted: z.number().min(0),
  activeJobs: z.number().min(0),
});

export const MilestoneSchema = z.object({
  id: z.string().uuid(),
  jobId: z.string().uuid(),
  title: z.string().min(1, 'Milestone title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  amount: z.number().min(0, 'Amount must be positive'),
  dueDate: z.date(),
  status: MilestoneStatusSchema,
  completedAt: z.date().optional(),
  approvedAt: z.date().optional(),
});

export const JobApplicationSchema = z.object({
  id: z.string().uuid(),
  jobId: z.string().uuid(),
  riggerId: z.string().uuid(),
  riggerProfile: RiggerProfileSchema,
  proposedRate: z.number().min(0, 'Rate must be positive'),
  estimatedDuration: z.string().min(1, 'Duration estimate is required'),
  coverLetter: z.string().min(50, 'Cover letter must be at least 50 characters'),
  status: ApplicationStatusSchema,
  submittedAt: z.date(),
  reviewedAt: z.date().optional(),
});

export const JobSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, 'Job title is required'),
  description: z.string().min(50, 'Job description must be at least 50 characters'),
  type: JobTypeSchema,
  category: JobCategorySchema,
  status: JobStatusSchema,
  priority: PrioritySchema,
  budget: BudgetSchema,
  location: LocationSchema,
  requirements: z.array(JobRequirementSchema),
  timeline: TimelineSchema,
  clientId: z.string().uuid(),
  assignedRiggerId: z.string().uuid().optional(),
  applicants: z.array(JobApplicationSchema),
  milestones: z.array(MilestoneSchema),
  tags: z.array(z.string().min(1)).max(10, 'Maximum 10 tags allowed'),
  attachments: z.array(AttachmentSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
  startDate: z.date().optional(),
  completionDate: z.date().optional(),
});

// API schemas
export const ApiErrorSchema = z.object({
  code: z.string().min(1),
  message: z.string().min(1),
  details: z.record(z.any()).optional(),
});

export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: ApiErrorSchema.optional(),
    message: z.string().optional(),
    timestamp: z.string().datetime(),
  });

export const PaginationSchema = z.object({
  page: z.number().min(1),
  limit: z.number().min(1).max(100),
  total: z.number().min(0),
  totalPages: z.number().min(0),
  hasNext: z.boolean(),
  hasPrev: z.boolean(),
});

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  ApiResponseSchema(z.array(dataSchema)).extend({
    pagination: PaginationSchema,
  });

// Search filter schemas
export const JobSearchFiltersSchema = z.object({
  query: z.string().optional(),
  types: z.array(JobTypeSchema).optional(),
  categories: z.array(JobCategorySchema).optional(),
  location: z.object({
    address: z.string().min(1),
    radius: z.number().min(1).max(500),
  }).optional(),
  budgetRange: z.object({
    min: z.number().min(0),
    max: z.number().min(0),
  }).optional().refine((data) => !data || data.max >= data.min, {
    message: 'Maximum budget must be greater than or equal to minimum budget',
    path: ['max'],
  }),
  dateRange: z.object({
    start: z.date(),
    end: z.date(),
  }).optional().refine((data) => !data || data.end >= data.start, {
    message: 'End date must be on or after start date',
    path: ['end'],
  }),
  priority: z.array(PrioritySchema).optional(),
  clientRating: z.number().min(0).max(5).optional(),
  verified: z.boolean().optional(),
});

export const RiggerSearchFiltersSchema = z.object({
  query: z.string().optional(),
  skills: z.array(z.string().min(1)).optional(),
  experience: z.array(ExperienceLevelSchema).optional(),
  location: z.object({
    address: z.string().min(1),
    radius: z.number().min(1).max(500),
  }).optional(),
  rateRange: z.object({
    min: z.number().min(0),
    max: z.number().min(0),
  }).optional().refine((data) => !data || data.max >= data.min, {
    message: 'Maximum rate must be greater than or equal to minimum rate',
    path: ['max'],
  }),
  rating: z.number().min(0).max(5).optional(),
  availability: z.object({
    startDate: z.date(),
    endDate: z.date(),
  }).optional().refine((data) => !data || data.endDate >= data.startDate, {
    message: 'End date must be on or after start date',
    path: ['endDate'],
  }),
  equipment: z.array(EquipmentTypeSchema).optional(),
  verified: z.boolean().optional(),
});

// Form schemas for creation/updates
export const CreateJobSchema = JobSchema.omit({
  id: true,
  applicants: true,
  createdAt: true,
  updatedAt: true,
  assignedRiggerId: true,
  startDate: true,
  completionDate: true,
}).extend({
  status: z.literal(JobStatus.DRAFT).optional(),
});

export const UpdateJobSchema = CreateJobSchema.partial().extend({
  id: z.string().uuid(),
});

export const CreateUserSchema = BaseUserSchema.omit({
  id: true,
  rating: true,
  verificationStatus: true,
  profileCompleteness: true,
  isOnline: true,
  lastSeen: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const UpdateUserSchema = CreateUserSchema.omit({
  password: true,
  confirmPassword: true,
}).partial().extend({
  id: z.string().uuid(),
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export const ResetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Export type inference helpers
export type JobSchemaType = z.infer<typeof JobSchema>;
export type CreateJobSchemaType = z.infer<typeof CreateJobSchema>;
export type UpdateJobSchemaType = z.infer<typeof UpdateJobSchema>;
export type RiggerProfileSchemaType = z.infer<typeof RiggerProfileSchema>;
export type ClientProfileSchemaType = z.infer<typeof ClientProfileSchema>;
export type JobSearchFiltersSchemaType = z.infer<typeof JobSearchFiltersSchema>;
export type RiggerSearchFiltersSchemaType = z.infer<typeof RiggerSearchFiltersSchema>;
export type LoginSchemaType = z.infer<typeof LoginSchema>;
export type CreateUserSchemaType = z.infer<typeof CreateUserSchema>;
export type UpdateUserSchemaType = z.infer<typeof UpdateUserSchema>;
