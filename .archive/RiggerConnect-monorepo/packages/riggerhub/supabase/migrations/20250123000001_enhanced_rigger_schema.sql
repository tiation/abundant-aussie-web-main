-- Enhanced RiggerConnect Database Schema for Western Australian Mining Industry
-- This migration enhances the existing profiles table and adds comprehensive
-- tables for compliance, job matching, and multi-tenant data privacy

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- =============================================
-- ENUMS AND TYPES
-- =============================================

-- User role types
CREATE TYPE user_role AS ENUM (
  'rigger',
  'client', 
  'contractor',
  'safety_officer',
  'admin'
);

-- Experience levels aligned with WA mining standards
CREATE TYPE experience_level AS ENUM (
  'trainee',           -- 0-1 years
  'apprentice',        -- 1-3 years
  'competent',         -- 3-5 years
  'experienced',       -- 5-10 years
  'expert',           -- 10+ years
  'supervisor'        -- Leadership roles
);

-- Job types specific to Western Australian mining
CREATE TYPE job_type AS ENUM (
  'mobile_crane_operator',
  'tower_crane_operator',
  'overhead_crane_operator',
  'rigger_level_1',
  'rigger_level_2', 
  'rigger_level_3',
  'dogger',
  'scaffolder',
  'signaller',
  'safety_observer',
  'lifting_supervisor',
  'crane_supervisor'
);

-- Shift patterns common in WA mining
CREATE TYPE shift_pattern AS ENUM (
  'day_shift',         -- 6am-6pm
  'night_shift',       -- 6pm-6am
  'swing_shift',       -- Rotating
  'fifo_2_1',         -- 2 weeks on, 1 week off
  'fifo_4_1',         -- 4 weeks on, 1 week off
  'fifo_8_6',         -- 8 days on, 6 days off
  'continuous_12hr',   -- 12-hour continuous
  'dido'              -- Drive in, drive out
);

-- Job status tracking
CREATE TYPE job_status AS ENUM (
  'draft',
  'posted',
  'applications_open',
  'applications_closed',
  'assigned',
  'in_progress',
  'completed',
  'cancelled',
  'on_hold',
  'disputed'
);

-- Application status
CREATE TYPE application_status AS ENUM (
  'pending',
  'under_review',
  'shortlisted',
  'accepted',
  'rejected',
  'withdrawn',
  'expired'
);

-- Safety incident severity levels
CREATE TYPE incident_severity AS ENUM (
  'near_miss',
  'first_aid',
  'medical_treatment',
  'lost_time',
  'serious_injury',
  'fatality'
);

-- WA-specific certification types
CREATE TYPE certification_type AS ENUM (
  'worksafe_wa',
  'dmirs_permit',
  'high_risk_work_licence',
  'crane_operator_licence',
  'rigging_licence',
  'scaffolding_licence',
  'forklift_licence',
  'white_card',
  'mining_induction',
  'site_specific',
  'company_specific',
  'medical_certificate'
);

-- Industry sectors in WA
CREATE TYPE industry_sector AS ENUM (
  'iron_ore_mining',
  'gold_mining',
  'lithium_mining',
  'coal_mining',
  'construction',
  'oil_and_gas',
  'infrastructure',
  'manufacturing',
  'port_operations',
  'renewable_energy'
);

-- Company size classification
CREATE TYPE company_size AS ENUM (
  'sole_trader',       -- 1 person
  'small',            -- 2-19 employees
  'medium',           -- 20-199 employees
  'large',            -- 200+ employees
  'multinational'     -- International operations
);

-- =============================================
-- ENHANCED PROFILES TABLE
-- =============================================

-- Drop existing simple profiles table and recreate with enhanced fields
DROP TABLE IF EXISTS public.profiles CASCADE;

CREATE TABLE public.profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic information
  full_name TEXT NOT NULL,
  phone TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  date_of_birth DATE,
  
  -- Address information
  street_address TEXT,
  suburb TEXT,
  state TEXT DEFAULT 'WA',
  postcode TEXT,
  country TEXT DEFAULT 'Australia',
  
  -- Professional information
  user_role user_role NOT NULL DEFAULT 'rigger',
  experience_level experience_level DEFAULT 'competent',
  years_experience INTEGER DEFAULT 0,
  specializations job_type[],
  
  -- Availability and preferences
  availability_status TEXT DEFAULT 'available',
  preferred_shift_patterns shift_pattern[],
  maximum_travel_distance INTEGER DEFAULT 50, -- km
  fifo_available BOOLEAN DEFAULT false,
  hourly_rate_min DECIMAL(10,2),
  hourly_rate_max DECIMAL(10,2),
  
  -- Location data for job matching
  home_location GEOGRAPHY(POINT, 4326),
  willing_to_relocate BOOLEAN DEFAULT false,
  
  -- Profile completeness and verification
  profile_completion_percentage INTEGER DEFAULT 0,
  identity_verified BOOLEAN DEFAULT false,
  background_check_completed BOOLEAN DEFAULT false,
  background_check_expiry DATE,
  
  -- Metadata
  bio TEXT,
  profile_image_url TEXT,
  linkedin_url TEXT,
  is_active BOOLEAN DEFAULT true,
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =============================================
-- COMPANIES TABLE
-- =============================================

CREATE TABLE public.companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Company identification
  company_name TEXT NOT NULL,
  trading_name TEXT,
  abn TEXT UNIQUE,
  acn TEXT,
  
  -- Company details
  industry_sector industry_sector NOT NULL,
  company_size company_size DEFAULT 'small',
  established_year INTEGER,
  website_url TEXT,
  description TEXT,
  
  -- Contact information
  business_address TEXT,
  business_suburb TEXT,
  business_state TEXT DEFAULT 'WA',
  business_postcode TEXT,
  business_country TEXT DEFAULT 'Australia',
  
  -- Operational information
  operating_locations TEXT[],
  primary_contact_name TEXT,
  primary_contact_email TEXT,
  primary_contact_phone TEXT,
  
  -- Financial and legal
  public_liability_insurance DECIMAL(12,2),
  workers_compensation_policy TEXT,
  tax_file_number TEXT,
  gst_registered BOOLEAN DEFAULT false,
  
  -- Safety and compliance
  safety_management_system BOOLEAN DEFAULT false,
  worksafe_wa_registered BOOLEAN DEFAULT false,
  dmirs_registered BOOLEAN DEFAULT false,
  safety_rating DECIMAL(3,2) DEFAULT 5.0, -- Out of 5
  
  -- Business metrics
  total_jobs_posted INTEGER DEFAULT 0,
  total_jobs_completed INTEGER DEFAULT 0,
  average_job_rating DECIMAL(3,2) DEFAULT 5.0,
  
  -- Verification status
  company_verified BOOLEAN DEFAULT false,
  verification_documents JSONB,
  
  -- Metadata
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =============================================
-- CERTIFICATIONS TABLE
-- =============================================

CREATE TABLE public.certifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Certification details
  certification_name TEXT NOT NULL,
  certification_type certification_type NOT NULL,
  issuing_authority TEXT NOT NULL,
  licence_number TEXT,
  
  -- Dates and validity
  issue_date DATE NOT NULL,
  expiry_date DATE,
  is_lifetime BOOLEAN DEFAULT false,
  
  -- Verification
  verification_status TEXT DEFAULT 'pending', -- pending, verified, expired, suspended
  verification_date DATE,
  verified_by UUID REFERENCES auth.users(id),
  
  -- Documents
  certificate_url TEXT,
  document_hash TEXT, -- For document integrity
  
  -- Metadata
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =============================================
-- SAFETY RECORDS TABLE
-- =============================================

CREATE TABLE public.safety_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Safety statistics
  incident_free_hours INTEGER DEFAULT 0,
  total_working_hours INTEGER DEFAULT 0,
  last_incident_date DATE,
  
  -- Training records
  last_safety_training_date DATE,
  safety_training_provider TEXT,
  
  -- Medical fitness
  last_medical_check_date DATE,
  medical_certificate_expiry DATE,
  medical_restrictions TEXT,
  
  -- Overall safety rating
  safety_score INTEGER DEFAULT 100, -- Out of 100
  safety_grade TEXT DEFAULT 'A', -- A, B, C, D, F
  
  -- Compliance status
  worksafe_wa_compliant BOOLEAN DEFAULT true,
  dmirs_compliant BOOLEAN DEFAULT true,
  
  -- Metadata
  last_updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =============================================
-- SAFETY INCIDENTS TABLE
-- =============================================

CREATE TABLE public.safety_incidents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies(id),
  
  -- Incident details
  incident_date DATE NOT NULL,
  incident_time TIME,
  incident_location TEXT,
  severity incident_severity NOT NULL,
  
  -- Description
  incident_description TEXT NOT NULL,
  root_cause_analysis TEXT,
  preventive_measures TEXT,
  
  -- Reporting
  reported_to_worksafe BOOLEAN DEFAULT false,
  worksafe_reference TEXT,
  investigation_completed BOOLEAN DEFAULT false,
  
  -- Follow-up actions
  corrective_actions TEXT,
  action_completion_date DATE,
  lessons_learned TEXT,
  
  -- Verification
  incident_verified BOOLEAN DEFAULT false,
  verified_by UUID REFERENCES auth.users(id),
  verification_date DATE,
  
  -- Metadata
  reported_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =============================================
-- JOBS TABLE
-- =============================================

CREATE TABLE public.jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  posted_by UUID NOT NULL REFERENCES auth.users(id),
  
  -- Job basic information
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  job_type job_type NOT NULL,
  experience_level experience_level NOT NULL,
  
  -- Location and logistics
  site_name TEXT,
  site_address TEXT,
  site_suburb TEXT,
  site_state TEXT DEFAULT 'WA',
  site_postcode TEXT,
  job_location GEOGRAPHY(POINT, 4326),
  accommodation_provided BOOLEAN DEFAULT false,
  transport_provided BOOLEAN DEFAULT false,
  
  -- Timing and scheduling
  shift_pattern shift_pattern NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  estimated_hours_per_week INTEGER,
  is_ongoing BOOLEAN DEFAULT false,
  
  -- Compensation
  hourly_rate DECIMAL(10,2) NOT NULL,
  overtime_rate DECIMAL(10,2),
  allowances JSONB, -- JSON object for various allowances
  penalty_rates JSONB, -- JSON object for penalty rate conditions
  
  -- Requirements
  required_certifications TEXT[],
  required_experience_years INTEGER DEFAULT 0,
  equipment_provided BOOLEAN DEFAULT true,
  special_requirements TEXT,
  medical_requirements TEXT,
  
  -- Safety requirements
  safety_requirements TEXT[],
  ppe_provided BOOLEAN DEFAULT true,
  safety_induction_required BOOLEAN DEFAULT true,
  height_work BOOLEAN DEFAULT false,
  confined_space_work BOOLEAN DEFAULT false,
  
  -- Job management
  status job_status DEFAULT 'draft',
  max_applications INTEGER DEFAULT 50,
  application_deadline DATE,
  urgency_level TEXT DEFAULT 'standard', -- standard, priority, urgent, emergency
  
  -- Assignment
  assigned_to UUID REFERENCES public.profiles(id),
  assignment_date TIMESTAMP WITH TIME ZONE,
  
  -- Completion tracking
  actual_start_date DATE,
  actual_end_date DATE,
  hours_worked DECIMAL(8,2),
  job_completion_notes TEXT,
  
  -- Ratings and feedback
  client_rating INTEGER CHECK (client_rating >= 1 AND client_rating <= 5),
  worker_rating INTEGER CHECK (worker_rating >= 1 AND worker_rating <= 5),
  client_feedback TEXT,
  worker_feedback TEXT,
  
  -- Financial
  total_cost DECIMAL(12,2),
  payment_status TEXT DEFAULT 'pending', -- pending, partial, paid, disputed
  invoice_reference TEXT,
  payment_date DATE,
  
  -- Metadata
  views INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =============================================
-- JOB APPLICATIONS TABLE
-- =============================================

CREATE TABLE public.job_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  
  -- Application details
  status application_status DEFAULT 'pending',
  cover_letter TEXT,
  proposed_rate DECIMAL(10,2),
  availability_date DATE,
  
  -- Experience and qualifications
  relevant_experience TEXT,
  additional_certifications TEXT[],
  portfolio_links TEXT[],
  
  -- Preferences and constraints
  can_work_weekends BOOLEAN DEFAULT false,
  can_work_nights BOOLEAN DEFAULT false,
  maximum_travel_distance INTEGER,
  accommodation_needed BOOLEAN DEFAULT false,
  transport_needed BOOLEAN DEFAULT false,
  
  -- Application process tracking
  application_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  reviewed_date TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id),
  
  -- Response from employer
  employer_response TEXT,
  interview_scheduled BOOLEAN DEFAULT false,
  interview_date TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  
  -- Follow-up and feedback
  applicant_notified BOOLEAN DEFAULT false,
  feedback_provided BOOLEAN DEFAULT false,
  
  -- Metadata
  priority_score INTEGER DEFAULT 0, -- Algorithm-calculated priority
  matching_score DECIMAL(5,2), -- Job matching algorithm score
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Ensure unique applications per job
  UNIQUE(job_id, applicant_id)
);

-- =============================================
-- JOB REQUIREMENTS TABLE
-- =============================================

CREATE TABLE public.job_requirements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  
  -- Requirement details
  requirement_type TEXT NOT NULL, -- certification, experience, equipment, medical
  requirement_name TEXT NOT NULL,
  is_mandatory BOOLEAN DEFAULT true,
  description TEXT,
  
  -- Verification requirements
  verification_required BOOLEAN DEFAULT false,
  verification_authority TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =============================================
-- WORK HISTORY TABLE
-- =============================================

CREATE TABLE public.work_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  job_id UUID REFERENCES public.jobs(id),
  company_id UUID REFERENCES public.companies(id),
  
  -- Work details
  position_title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  
  -- Job specifics
  job_description TEXT,
  key_responsibilities TEXT[],
  achievements TEXT[],
  technologies_used TEXT[],
  
  -- Performance metrics
  safety_incidents INTEGER DEFAULT 0,
  client_rating DECIMAL(3,2),
  supervisor_rating DECIMAL(3,2),
  
  -- Verification
  reference_contact_name TEXT,
  reference_contact_phone TEXT,
  reference_contact_email TEXT,
  reference_verified BOOLEAN DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =============================================
-- NOTIFICATIONS TABLE
-- =============================================

CREATE TABLE public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Notification details
  type TEXT NOT NULL, -- job_match, application_update, safety_alert, certification_expiry
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  
  -- Related entities
  related_job_id UUID REFERENCES public.jobs(id),
  related_application_id UUID REFERENCES public.job_applications(id),
  related_company_id UUID REFERENCES public.companies(id),
  
  -- Delivery and status
  is_read BOOLEAN DEFAULT false,
  is_email_sent BOOLEAN DEFAULT false,
  is_sms_sent BOOLEAN DEFAULT false,
  priority TEXT DEFAULT 'normal', -- low, normal, high, urgent
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- =============================================
-- COMPLIANCE AUDITS TABLE
-- =============================================

CREATE TABLE public.compliance_audits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type TEXT NOT NULL, -- profile, company, job
  entity_id UUID NOT NULL,
  
  -- Audit details
  audit_type TEXT NOT NULL, -- safety, certification, legal, financial
  audit_date DATE NOT NULL,
  auditor_name TEXT,
  audit_authority TEXT,
  
  -- Results
  compliance_status TEXT NOT NULL, -- compliant, non_compliant, partial, pending
  findings TEXT[],
  recommendations TEXT[],
  corrective_actions_required TEXT[],
  
  -- Follow-up
  follow_up_date DATE,
  corrective_actions_completed BOOLEAN DEFAULT false,
  re_audit_required BOOLEAN DEFAULT false,
  
  -- Documentation
  audit_report_url TEXT,
  supporting_documents TEXT[],
  
  -- Metadata
  conducted_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Profiles indexes
CREATE INDEX idx_profiles_user_role ON public.profiles(user_role);
CREATE INDEX idx_profiles_experience_level ON public.profiles(experience_level);
CREATE INDEX idx_profiles_location ON public.profiles USING GIST(home_location);
CREATE INDEX idx_profiles_specializations ON public.profiles USING GIN(specializations);
CREATE INDEX idx_profiles_active ON public.profiles(is_active) WHERE is_active = true;

-- Companies indexes
CREATE INDEX idx_companies_industry ON public.companies(industry_sector);
CREATE INDEX idx_companies_size ON public.companies(company_size);
CREATE INDEX idx_companies_verified ON public.companies(company_verified);
CREATE INDEX idx_companies_owner ON public.companies(owner_id);

-- Jobs indexes
CREATE INDEX idx_jobs_status ON public.jobs(status);
CREATE INDEX idx_jobs_type ON public.jobs(job_type);
CREATE INDEX idx_jobs_location ON public.jobs USING GIST(job_location);
CREATE INDEX idx_jobs_start_date ON public.jobs(start_date);
CREATE INDEX idx_jobs_company ON public.jobs(company_id);
CREATE INDEX idx_jobs_active ON public.jobs(is_active) WHERE is_active = true;
CREATE INDEX idx_jobs_featured ON public.jobs(is_featured) WHERE is_featured = true;

-- Compound indexes for common queries
CREATE INDEX idx_jobs_status_location ON public.jobs(status, job_location) USING GIST(job_location) WHERE status = 'posted';
CREATE INDEX idx_jobs_type_experience ON public.jobs(job_type, experience_level, start_date);

-- Applications indexes
CREATE INDEX idx_applications_job ON public.job_applications(job_id);
CREATE INDEX idx_applications_applicant ON public.job_applications(applicant_id);
CREATE INDEX idx_applications_status ON public.job_applications(status);
CREATE INDEX idx_applications_date ON public.job_applications(application_date);

-- Certifications indexes
CREATE INDEX idx_certifications_profile ON public.certifications(profile_id);
CREATE INDEX idx_certifications_type ON public.certifications(certification_type);
CREATE INDEX idx_certifications_expiry ON public.certifications(expiry_date) WHERE expiry_date IS NOT NULL;
CREATE INDEX idx_certifications_active ON public.certifications(is_active) WHERE is_active = true;

-- Safety records indexes
CREATE INDEX idx_safety_records_profile ON public.safety_records(profile_id);
CREATE INDEX idx_safety_records_score ON public.safety_records(safety_score);

-- Notifications indexes
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX idx_notifications_type ON public.notifications(type);

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Function to calculate profile completion percentage
CREATE OR REPLACE FUNCTION public.calculate_profile_completion(profile_row public.profiles)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  completion_score INTEGER := 0;
  total_fields INTEGER := 20; -- Adjust based on required fields
BEGIN
  -- Basic information (5 points each)
  IF profile_row.full_name IS NOT NULL AND profile_row.full_name != '' THEN
    completion_score := completion_score + 5;
  END IF;
  
  IF profile_row.phone IS NOT NULL AND profile_row.phone != '' THEN
    completion_score := completion_score + 5;
  END IF;
  
  IF profile_row.date_of_birth IS NOT NULL THEN
    completion_score := completion_score + 5;
  END IF;
  
  IF profile_row.street_address IS NOT NULL AND profile_row.street_address != '' THEN
    completion_score := completion_score + 5;
  END IF;
  
  -- Professional information (10 points each)
  IF profile_row.years_experience > 0 THEN
    completion_score := completion_score + 10;
  END IF;
  
  IF profile_row.specializations IS NOT NULL AND array_length(profile_row.specializations, 1) > 0 THEN
    completion_score := completion_score + 10;
  END IF;
  
  IF profile_row.hourly_rate_min IS NOT NULL AND profile_row.hourly_rate_max IS NOT NULL THEN
    completion_score := completion_score + 10;
  END IF;
  
  -- Additional fields (5 points each)
  IF profile_row.bio IS NOT NULL AND profile_row.bio != '' THEN
    completion_score := completion_score + 5;
  END IF;
  
  IF profile_row.profile_image_url IS NOT NULL AND profile_row.profile_image_url != '' THEN
    completion_score := completion_score + 5;
  END IF;
  
  IF profile_row.emergency_contact_name IS NOT NULL AND profile_row.emergency_contact_name != '' THEN
    completion_score := completion_score + 5;
  END IF;
  
  -- Check for certifications (15 points)
  IF EXISTS (SELECT 1 FROM public.certifications WHERE profile_id = profile_row.id AND is_active = true) THEN
    completion_score := completion_score + 15;
  END IF;
  
  -- Check for work history (10 points)
  IF EXISTS (SELECT 1 FROM public.work_history WHERE profile_id = profile_row.id) THEN
    completion_score := completion_score + 10;
  END IF;
  
  -- Check for safety record (10 points)
  IF EXISTS (SELECT 1 FROM public.safety_records WHERE profile_id = profile_row.id) THEN
    completion_score := completion_score + 10;
  END IF;
  
  RETURN LEAST(completion_score, 100); -- Cap at 100%
END;
$$;

-- Function to handle new user signup (enhanced)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Create profile for new user
  INSERT INTO public.profiles (user_id, full_name, user_role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'user_role')::user_role, 'rigger'::user_role)
  );
  
  -- Create initial safety record
  INSERT INTO public.safety_records (profile_id)
  SELECT id FROM public.profiles WHERE user_id = NEW.id;
  
  RETURN NEW;
END;
$$;

-- Function to update job application count
CREATE OR REPLACE FUNCTION public.update_job_application_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Update the jobs table with current application count
  UPDATE public.jobs 
  SET updated_at = now()
  WHERE id = COALESCE(NEW.job_id, OLD.job_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Function to check certification expiry and create notifications
CREATE OR REPLACE FUNCTION public.check_certification_expiry()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  cert_record RECORD;
BEGIN
  -- Check for certifications expiring in the next 30 days
  FOR cert_record IN 
    SELECT c.*, p.user_id 
    FROM public.certifications c
    JOIN public.profiles p ON c.profile_id = p.id
    WHERE c.expiry_date IS NOT NULL 
    AND c.expiry_date BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '30 days')
    AND c.is_active = true
    AND NOT EXISTS (
      SELECT 1 FROM public.notifications 
      WHERE user_id = p.user_id 
      AND type = 'certification_expiry'
      AND related_job_id IS NULL
      AND message LIKE '%' || c.certification_name || '%'
      AND created_at > (CURRENT_DATE - INTERVAL '7 days')
    )
  LOOP
    INSERT INTO public.notifications (
      user_id, 
      type, 
      title, 
      message,
      priority
    ) VALUES (
      cert_record.user_id,
      'certification_expiry',
      'Certification Expiring Soon',
      'Your ' || cert_record.certification_name || ' certification expires on ' || cert_record.expiry_date,
      CASE 
        WHEN cert_record.expiry_date <= (CURRENT_DATE + INTERVAL '7 days') THEN 'high'
        ELSE 'normal'
      END
    );
  END LOOP;
END;
$$;

-- =============================================
-- TRIGGERS
-- =============================================

-- Updated timestamp triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_applications_updated_at
  BEFORE UPDATE ON public.job_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_certifications_updated_at
  BEFORE UPDATE ON public.certifications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_safety_records_updated_at
  BEFORE UPDATE ON public.safety_records
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_work_history_updated_at
  BEFORE UPDATE ON public.work_history
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- New user trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Job application count trigger
CREATE TRIGGER update_job_applications_count
  AFTER INSERT OR UPDATE OR DELETE ON public.job_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_job_application_count();
