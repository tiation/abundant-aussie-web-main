/**
 * Job model for RiggerConnect React Native App
 * Migrated from Android Kotlin data models
 * 
 * Australian Mining & Construction Industry Focus:
 * - FIFO/DIDO arrangements
 * - Pilbara region specialization
 * - Mining, Construction, Industrial sectors
 * - Australian workplace compliance
 */

import { Location, Coordinates } from './User';

export enum JobType {
  PERMANENT = 'PERMANENT',
  CONTRACT = 'CONTRACT',
  CASUAL = 'CASUAL',
  TEMP = 'TEMP',
  APPRENTICESHIP = 'APPRENTICESHIP',
  INTERNSHIP = 'INTERNSHIP'
}

export enum Industry {
  MINING = 'MINING',
  CONSTRUCTION = 'CONSTRUCTION',
  INDUSTRIAL = 'INDUSTRIAL',
  INFRASTRUCTURE = 'INFRASTRUCTURE',
  ENERGY = 'ENERGY',
  MANUFACTURING = 'MANUFACTURING',
  LOGISTICS = 'LOGISTICS'
}

export enum ExperienceLevel {
  ENTRY_LEVEL = 'ENTRY_LEVEL',
  MID_LEVEL = 'MID_LEVEL',
  SENIOR_LEVEL = 'SENIOR_LEVEL',
  EXPERT_LEVEL = 'EXPERT_LEVEL'
}

export enum ShiftType {
  DAY_SHIFT = 'DAY_SHIFT',
  NIGHT_SHIFT = 'NIGHT_SHIFT',
  SWING_SHIFT = 'SWING_SHIFT',
  FIFO = 'FIFO', // Fly In Fly Out
  DIDO = 'DIDO', // Drive In Drive Out
  ROSTER_2_1 = 'ROSTER_2_1', // 2 weeks on, 1 week off
  ROSTER_4_1 = 'ROSTER_4_1', // 4 weeks on, 1 week off
  ROSTER_8_6 = 'ROSTER_8_6'  // 8 days on, 6 days off
}

export interface Job {
  id: string;
  title: string;
  companyName: string;
  description: string;
  shortDescription: string;
  requirements: string[];
  benefits: string[];
  jobType: JobType;
  industry: Industry;
  location: Location | null;
  salaryMin: number;
  salaryMax: number;
  hourlyRate: number;
  isRemote: boolean;
  isUrgent: boolean;
  experienceLevel: ExperienceLevel;
  skillsRequired: string[];
  certificationsRequired: string[];
  contactEmail: string;
  contactPhone: string;
  applicationDeadline: Date | null;
  startDate: Date | null;
  endDate: Date | null;
  duration: string;
  shift: ShiftType;
  accommodation: boolean;
  transport: boolean;
  meals: boolean;
  ppe: boolean; // Personal Protective Equipment provided
  postedDate: Date;
  isActive: boolean;
  viewCount: number;
  applicationCount: number;
  employerId: string;
  tags: string[];
  images: string[];
  coordinates: Coordinates | null;
}

export enum ApplicationStatus {
  PENDING = 'PENDING',
  REVIEWED = 'REVIEWED',
  SHORTLISTED = 'SHORTLISTED',
  INTERVIEW = 'INTERVIEW',
  REJECTED = 'REJECTED',
  ACCEPTED = 'ACCEPTED',
  WITHDRAWN = 'WITHDRAWN'
}

/**
 * Job Application model
 */
export interface JobApplication {
  id: string;
  jobId: string;
  userId: string;
  coverLetter: string;
  proposedRate: number;
  status: ApplicationStatus;
  appliedDate: Date;
  reviewedDate: Date | null;
  notes: string;
  attachments: string[];
}

export enum SortBy {
  NEWEST = 'NEWEST',
  OLDEST = 'OLDEST',
  SALARY_HIGH_TO_LOW = 'SALARY_HIGH_TO_LOW',
  SALARY_LOW_TO_HIGH = 'SALARY_LOW_TO_HIGH',
  DISTANCE = 'DISTANCE',
  RELEVANCE = 'RELEVANCE'
}

/**
 * Job search filters
 */
export interface JobFilters {
  searchQuery: string;
  location: string;
  radius: number; // km
  jobTypes: JobType[];
  industries: Industry[];
  experienceLevel: ExperienceLevel | null;
  salaryMin: number | null;
  salaryMax: number | null;
  isRemote: boolean | null;
  isUrgent: boolean | null;
  hasAccommodation: boolean | null;
  hasTransport: boolean | null;
  skills: string[];
  sortBy: SortBy;
}

/**
 * Job creation/update payload
 */
export interface JobCreatePayload {
  title: string;
  companyName: string;
  description: string;
  shortDescription: string;
  requirements: string[];
  benefits: string[];
  jobType: JobType;
  industry: Industry;
  location: Location;
  salaryMin?: number;
  salaryMax?: number;
  hourlyRate?: number;
  isRemote: boolean;
  isUrgent: boolean;
  experienceLevel: ExperienceLevel;
  skillsRequired: string[];
  certificationsRequired: string[];
  contactEmail: string;
  contactPhone: string;
  applicationDeadline?: Date;
  startDate?: Date;
  endDate?: Date;
  duration: string;
  shift: ShiftType;
  accommodation: boolean;
  transport: boolean;
  meals: boolean;
  ppe: boolean;
  tags: string[];
  images: string[];
}

/**
 * Job statistics for employers
 */
export interface JobStats {
  totalViews: number;
  totalApplications: number;
  averageApplicationsPerDay: number;
  applicationConversionRate: number;
  shortlistedCandidates: number;
  interviewScheduled: number;
  hired: number;
  rejectedApplications: number;
  withdrawnApplications: number;
}

/**
 * Australian mining locations (Pilbara focus)
 */
export const AUSTRALIAN_MINING_LOCATIONS = [
  'Perth, WA',
  'Karratha, WA',
  'Port Hedland, WA',
  'Newman, WA',
  'Tom Price, WA',
  'Paraburdoo, WA',
  'Mount Gibson, WA',
  'Geraldton, WA',
  'Kalgoorlie, WA',
  'Brisbane, QLD',
  'Gladstone, QLD',
  'Mackay, QLD',
  'Mount Isa, QLD',
  'Townsville, QLD',
  'Darwin, NT',
  'Adelaide, SA',
  'Melbourne, VIC',
  'Sydney, NSW',
  'Newcastle, NSW'
] as const;

/**
 * Common job benefits in Australian mining/construction
 */
export const COMMON_BENEFITS = [
  'FIFO flights covered',
  'Accommodation provided',
  'Meals included',
  'Transport to site',
  'PPE provided',
  'Training provided',
  'Career progression',
  'Health insurance',
  'Superannuation',
  'Leave loading',
  'Site allowances',
  'Remote area allowance',
  'Overtime rates',
  'Tool allowance',
  'Safety bonus'
] as const;

/**
 * Roster patterns common in Australian mining
 */
export const ROSTER_PATTERNS = [
  { type: ShiftType.ROSTER_2_1, description: '2 weeks on, 1 week off' },
  { type: ShiftType.ROSTER_4_1, description: '4 weeks on, 1 week off' },
  { type: ShiftType.ROSTER_8_6, description: '8 days on, 6 days off' },
  { type: ShiftType.FIFO, description: 'Fly In Fly Out' },
  { type: ShiftType.DIDO, description: 'Drive In Drive Out' },
  { type: ShiftType.DAY_SHIFT, description: 'Day Shift (6am-6pm)' },
  { type: ShiftType.NIGHT_SHIFT, description: 'Night Shift (6pm-6am)' },
  { type: ShiftType.SWING_SHIFT, description: 'Rotating Shifts' }
] as const;

export type AustralianMiningLocation = typeof AUSTRALIAN_MINING_LOCATIONS[number];
export type CommonBenefit = typeof COMMON_BENEFITS[number];
