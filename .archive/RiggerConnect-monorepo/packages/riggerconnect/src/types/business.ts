// Job-related types
export interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  location: string;
  payRate: number;
  payType: 'hourly' | 'daily' | 'project';
  startDate: Date;
  endDate?: Date;
  status: 'draft' | 'active' | 'paused' | 'closed';
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobApplication {
  id: string;
  jobId: string;
  workerId: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';
  appliedAt: Date;
  reviewedAt?: Date;
  notes?: string;
}

// Worker-related types
export interface Worker {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  skills: string[];
  certifications: Certification[];
  experience: WorkExperience[];
  location: string;
  availability: 'available' | 'busy' | 'unavailable';
  rating: number;
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Certification {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: Date;
  expiryDate?: Date;
  verified: boolean;
}

export interface WorkExperience {
  id: string;
  jobTitle: string;
  company: string;
  startDate: Date;
  endDate?: Date;
  description: string;
}

// Company-related types
export interface Company {
  id: string;
  name: string;
  description: string;
  industry: string;
  size: 'small' | 'medium' | 'large' | 'enterprise';
  location: string;
  website?: string;
  logo?: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Compliance-related types
export interface ComplianceRecord {
  id: string;
  workerId: string;
  type: 'safety_training' | 'background_check' | 'drug_test' | 'certification';
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  documentUrl?: string;
  expiryDate?: Date;
  verifiedAt?: Date;
  verifiedBy?: string;
  notes?: string;
}

export interface SafetyIncident {
  id: string;
  jobSiteId: string;
  reportedBy: string;
  incidentDate: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  injuriesReported: boolean;
  actionsTaken: string;
  status: 'open' | 'investigating' | 'resolved' | 'closed';
}

// Recruitment-related types
export interface RecruitmentPipeline {
  id: string;
  name: string;
  stages: RecruitmentStage[];
  companyId: string;
  isDefault: boolean;
}

export interface RecruitmentStage {
  id: string;
  name: string;
  order: number;
  type: 'application' | 'screening' | 'interview' | 'assessment' | 'offer';
  requirements?: string[];
}

export interface Interview {
  id: string;
  applicationId: string;
  scheduledAt: Date;
  duration: number; // in minutes
  interviewerIds: string[];
  type: 'phone' | 'video' | 'in_person';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  rating?: number;
}

// Search and filter types
export interface WorkerSearchFilters {
  skills?: string[];
  location?: string;
  availability?: string;
  experience?: number; // minimum years
  certification?: string[];
  rating?: number; // minimum rating
}

export interface JobSearchFilters {
  location?: string;
  payRate?: {
    min?: number;
    max?: number;
  };
  payType?: string;
  startDate?: Date;
  skills?: string[];
}
