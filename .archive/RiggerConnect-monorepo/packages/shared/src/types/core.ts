// Core user types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  location?: Location;
  skills: string[];
  experience: ExperienceLevel;
  rating: number;
  verificationStatus: VerificationStatus;
  profileCompleteness: number;
  isOnline: boolean;
  lastSeen: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface RiggerProfile extends User {
  portfolio: PortfolioItem[];
  certifications: Certification[];
  availability: Availability;
  hourlyRate?: number;
  preferredJobTypes: JobType[];
  workRadius: number; // in miles
  equipment: Equipment[];
  completedJobs: number;
  totalEarnings: number;
}

export interface ClientProfile extends User {
  companyName?: string;
  companySize?: CompanySize;
  industry?: string;
  paymentMethods: PaymentMethod[];
  totalSpent: number;
  jobsPosted: number;
  activeJobs: number;
}

// Job-related types
export interface Job {
  id: string;
  title: string;
  description: string;
  type: JobType;
  category: JobCategory;
  status: JobStatus;
  priority: Priority;
  budget: Budget;
  location: Location;
  requirements: JobRequirement[];
  timeline: Timeline;
  clientId: string;
  assignedRiggerId?: string;
  applicants: JobApplication[];
  milestones: Milestone[];
  tags: string[];
  attachments: Attachment[];
  createdAt: Date;
  updatedAt: Date;
  startDate?: Date;
  completionDate?: Date;
}

export interface JobApplication {
  id: string;
  jobId: string;
  riggerId: string;
  riggerProfile: RiggerProfile;
  proposedRate: number;
  estimatedDuration: string;
  coverLetter: string;
  status: ApplicationStatus;
  submittedAt: Date;
  reviewedAt?: Date;
}

export interface Milestone {
  id: string;
  jobId: string;
  title: string;
  description: string;
  amount: number;
  dueDate: Date;
  status: MilestoneStatus;
  completedAt?: Date;
  approvedAt?: Date;
}

// Supporting types
export interface Location {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Budget {
  type: 'fixed' | 'hourly';
  amount: number;
  currency: string;
  negotiable: boolean;
}

export interface Timeline {
  startDate: Date;
  endDate: Date;
  duration: string; // e.g., "2 weeks", "1 month"
  flexibility: 'strict' | 'flexible' | 'very_flexible';
}

export interface JobRequirement {
  id: string;
  type: 'skill' | 'certification' | 'experience' | 'equipment';
  value: string;
  required: boolean;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  images: string[];
  videos?: string[];
  jobType: JobType;
  completedAt: Date;
  clientFeedback?: string;
  rating?: number;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issuedAt: Date;
  expiresAt?: Date;
  credentialId?: string;
  verificationUrl?: string;
}

export interface Equipment {
  id: string;
  name: string;
  type: EquipmentType;
  brand?: string;
  model?: string;
  specifications?: Record<string, any>;
  condition: EquipmentCondition;
  purchaseDate?: Date;
  lastMaintenanceDate?: Date;
}

export interface Availability {
  schedule: WeeklySchedule;
  timeZone: string;
  blackoutDates: DateRange[];
  maxConcurrentJobs: number;
  travelWillingness: TravelWillingness;
}

export interface WeeklySchedule {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface DaySchedule {
  available: boolean;
  startTime?: string; // HH:MM format
  endTime?: string; // HH:MM format
  breaks?: TimeSlot[];
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
  reason?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'bank_account' | 'paypal' | 'crypto';
  lastFour?: string;
  brand?: string;
  isDefault: boolean;
  expiresAt?: Date;
}

export interface Attachment {
  id: string;
  filename: string;
  url: string;
  size: number;
  mimeType: string;
  uploadedAt: Date;
  uploadedBy: string;
}

// Enums
export enum JobType {
  RIGGING = 'rigging',
  LIGHTING = 'lighting',
  SOUND = 'sound',
  VIDEO = 'video',
  STAGING = 'staging',
  TRUCKING = 'trucking',
  CREW_CHIEF = 'crew_chief',
  TECHNICAL_DIRECTION = 'technical_direction',
  EQUIPMENT_RENTAL = 'equipment_rental',
  CONSULTATION = 'consultation',
}

export enum JobCategory {
  CONCERT = 'concert',
  CORPORATE_EVENT = 'corporate_event',
  THEATER = 'theater',
  FESTIVAL = 'festival',
  TRADE_SHOW = 'trade_show',
  WEDDING = 'wedding',
  BROADCAST = 'broadcast',
  FILM_TV = 'film_tv',
  INSTALLATION = 'installation',
  MAINTENANCE = 'maintenance',
}

export enum JobStatus {
  DRAFT = 'draft',
  POSTED = 'posted',
  IN_PROGRESS = 'in_progress',
  UNDER_REVIEW = 'under_review',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  DISPUTED = 'disputed',
}

export enum ApplicationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn',
}

export enum MilestoneStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  APPROVED = 'approved',
  DISPUTED = 'disputed',
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum ExperienceLevel {
  ENTRY = 'entry',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert',
}

export enum VerificationStatus {
  UNVERIFIED = 'unverified',
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

export enum CompanySize {
  SOLO = 'solo',
  SMALL = 'small', // 2-10
  MEDIUM = 'medium', // 11-50
  LARGE = 'large', // 51-200
  ENTERPRISE = 'enterprise', // 200+
}

export enum EquipmentType {
  RIGGING_HARDWARE = 'rigging_hardware',
  LIGHTING_FIXTURE = 'lighting_fixture',
  AUDIO_EQUIPMENT = 'audio_equipment',
  VIDEO_EQUIPMENT = 'video_equipment',
  STAGING = 'staging',
  TRANSPORT = 'transport',
  SAFETY_EQUIPMENT = 'safety_equipment',
  TOOLS = 'tools',
}

export enum EquipmentCondition {
  NEW = 'new',
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  NEEDS_REPAIR = 'needs_repair',
}

export enum TravelWillingness {
  LOCAL_ONLY = 'local_only', // Within 25 miles
  REGIONAL = 'regional', // Within 100 miles
  NATIONAL = 'national', // Anywhere in country
  INTERNATIONAL = 'international', // Worldwide
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Search and filter types
export interface JobSearchFilters {
  query?: string;
  types?: JobType[];
  categories?: JobCategory[];
  location?: {
    address: string;
    radius: number;
  };
  budgetRange?: {
    min: number;
    max: number;
  };
  dateRange?: {
    start: Date;
    end: Date;
  };
  priority?: Priority[];
  clientRating?: number;
  verified?: boolean;
}

export interface RiggerSearchFilters {
  query?: string;
  skills?: string[];
  experience?: ExperienceLevel[];
  location?: {
    address: string;
    radius: number;
  };
  rateRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  availability?: {
    startDate: Date;
    endDate: Date;
  };
  equipment?: EquipmentType[];
  verified?: boolean;
}
