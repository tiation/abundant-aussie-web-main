/**
 * User model for RiggerConnect React Native App
 * Migrated from Android Kotlin data models
 * 
 * Australian Rigging Industry Focus:
 * - Mining, Construction, Industrial sectors
 * - FIFO/DIDO work arrangements
 * - Certification and compliance tracking
 */

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string; // Default: "WA" for Western Australia
  country: string; // Default: "Australia"
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export enum UserType {
  RIGGER = 'RIGGER',
  EMPLOYER = 'EMPLOYER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profileImageUrl: string;
  userType: UserType;
  isVerified: boolean;
  isActive: boolean;
  profileCompleteness: number; // 0.0 to 1.0
  averageRating: number;
  totalJobs: number;
  yearsOfExperience: number;
  hourlyRate: number;
  skills: string[];
  certifications: string[];
  location: Location | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Authentication state management
 * Supports JWT tokens and biometric authentication
 */
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string;
  refreshToken: string;
  isLoading: boolean;
  error: string | null;
}

/**
 * User profile creation/update payload
 */
export interface UserUpdatePayload {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  skills?: string[];
  certifications?: string[];
  location?: Location;
  hourlyRate?: number;
  yearsOfExperience?: number;
}

/**
 * Authentication credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
  useBiometric?: boolean;
}

export interface RegisterCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  userType: UserType;
  agreeToTerms: boolean;
}

/**
 * User search and filtering
 */
export interface UserFilters {
  location?: string;
  radius?: number; // km
  skills?: string[];
  certifications?: string[];
  hourlyRateMin?: number;
  hourlyRateMax?: number;
  experienceMin?: number;
  rating?: number;
  isAvailable?: boolean;
}

/**
 * User statistics for employers
 */
export interface UserStats {
  totalJobsCompleted: number;
  averageRating: number;
  onTimePercentage: number;
  safetyScore: number;
  certificationCount: number;
  skillsCount: number;
  responseTime: number; // hours
  availability: 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE';
}

/**
 * Australian rigging certifications
 */
export const AUSTRALIAN_CERTIFICATIONS = [
  'Rigging Intermediate (RI)',
  'Rigging Advanced (RA)',
  'Dogging (DG)',
  'Crane Operations (CO)',
  'Scaffolding (SC)',
  'EWP Operation (EWP)',
  'High Risk Work License',
  'White Card (Construction Induction)',
  'First Aid Certificate',
  'Working at Heights',
  'Confined Space Entry',
  'Gas Test Atmosphere'
] as const;

/**
 * Common rigging skills
 */
export const RIGGING_SKILLS = [
  'Crane Operation',
  'Heavy Lifting',
  'Load Calculations',
  'Safety Management',
  'Equipment Inspection',
  'Signal Operations',
  'Rigging Hardware',
  'Mobile Cranes',
  'Tower Cranes',
  'Overhead Cranes',
  'Winch Operations',
  'Steel Erection',
  'Precast Installation',
  'Mining Equipment',
  'Oil & Gas Rigging',
  'Marine Operations'
] as const;

export type AustralianCertification = typeof AUSTRALIAN_CERTIFICATIONS[number];
export type RiggingSkill = typeof RIGGING_SKILLS[number];
