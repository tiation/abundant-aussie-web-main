-- Row Level Security Policies for RiggerConnect
-- Multi-tenant data privacy with Western Australian compliance considerations

-- =============================================
-- ENABLE RLS ON ALL TABLES
-- =============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_audits ENABLE ROW LEVEL SECURITY;

-- =============================================
-- PROFILES TABLE POLICIES
-- =============================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can create their own profile
CREATE POLICY "Users can create own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Clients can view rigger profiles (for job matching)
CREATE POLICY "Clients can view rigger profiles" 
ON public.profiles 
FOR SELECT 
USING (
  user_role = 'rigger' 
  AND is_active = true 
  AND EXISTS (
    SELECT 1 FROM public.profiles client_profile 
    WHERE client_profile.user_id = auth.uid() 
    AND client_profile.user_role IN ('client', 'contractor')
  )
);

-- Safety officers can view all profiles in their jurisdiction
CREATE POLICY "Safety officers can view profiles" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles safety_profile 
    WHERE safety_profile.user_id = auth.uid() 
    AND safety_profile.user_role = 'safety_officer'
  )
);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles admin_profile 
    WHERE admin_profile.user_id = auth.uid() 
    AND admin_profile.user_role = 'admin'
  )
);

-- =============================================
-- COMPANIES TABLE POLICIES
-- =============================================

-- Company owners can view and manage their own company
CREATE POLICY "Owners can manage own company" 
ON public.companies 
FOR ALL 
USING (auth.uid() = owner_id);

-- All authenticated users can view active companies (for job applications)
CREATE POLICY "Users can view active companies" 
ON public.companies 
FOR SELECT 
USING (is_active = true AND auth.role() = 'authenticated');

-- Safety officers can view company compliance information
CREATE POLICY "Safety officers can view company compliance" 
ON public.companies 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles safety_profile 
    WHERE safety_profile.user_id = auth.uid() 
    AND safety_profile.user_role = 'safety_officer'
  )
);

-- =============================================
-- CERTIFICATIONS TABLE POLICIES
-- =============================================

-- Users can view and manage their own certifications
CREATE POLICY "Users can manage own certifications" 
ON public.certifications 
FOR ALL 
USING (
  profile_id IN (
    SELECT id FROM public.profiles 
    WHERE user_id = auth.uid()
  )
);

-- Employers can view certifications of job applicants
CREATE POLICY "Employers can view applicant certifications" 
ON public.certifications 
FOR SELECT 
USING (
  profile_id IN (
    SELECT ja.applicant_id 
    FROM public.job_applications ja
    JOIN public.jobs j ON ja.job_id = j.id
    JOIN public.companies c ON j.company_id = c.id
    WHERE c.owner_id = auth.uid()
  )
);

-- Safety officers can view all certifications for compliance
CREATE POLICY "Safety officers can view certifications" 
ON public.certifications 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles safety_profile 
    WHERE safety_profile.user_id = auth.uid() 
    AND safety_profile.user_role = 'safety_officer'
  )
);

-- =============================================
-- SAFETY RECORDS TABLE POLICIES
-- =============================================

-- Users can view and update their own safety records
CREATE POLICY "Users can manage own safety records" 
ON public.safety_records 
FOR ALL 
USING (
  profile_id IN (
    SELECT id FROM public.profiles 
    WHERE user_id = auth.uid()
  )
);

-- Employers can view safety records of their workers
CREATE POLICY "Employers can view worker safety records" 
ON public.safety_records 
FOR SELECT 
USING (
  profile_id IN (
    SELECT j.assigned_to 
    FROM public.jobs j
    JOIN public.companies c ON j.company_id = c.id
    WHERE c.owner_id = auth.uid()
    AND j.assigned_to IS NOT NULL
  )
);

-- Safety officers can view all safety records
CREATE POLICY "Safety officers can view safety records" 
ON public.safety_records 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles safety_profile 
    WHERE safety_profile.user_id = auth.uid() 
    AND safety_profile.user_role = 'safety_officer'
  )
);

-- =============================================
-- SAFETY INCIDENTS TABLE POLICIES
-- =============================================

-- Users can view and report their own safety incidents
CREATE POLICY "Users can manage own safety incidents" 
ON public.safety_incidents 
FOR ALL 
USING (
  profile_id IN (
    SELECT id FROM public.profiles 
    WHERE user_id = auth.uid()
  )
);

-- Companies can view incidents related to their operations
CREATE POLICY "Companies can view related incidents" 
ON public.safety_incidents 
FOR SELECT 
USING (
  company_id IN (
    SELECT id FROM public.companies 
    WHERE owner_id = auth.uid()
  )
);

-- Safety officers can view and manage all incidents
CREATE POLICY "Safety officers can manage incidents" 
ON public.safety_incidents 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles safety_profile 
    WHERE safety_profile.user_id = auth.uid() 
    AND safety_profile.user_role = 'safety_officer'
  )
);

-- =============================================
-- JOBS TABLE POLICIES
-- =============================================

-- All authenticated users can view active jobs
CREATE POLICY "Users can view active jobs" 
ON public.jobs 
FOR SELECT 
USING (
  is_active = true 
  AND status IN ('posted', 'applications_open') 
  AND auth.role() = 'authenticated'
);

-- Company owners can manage their own jobs
CREATE POLICY "Companies can manage own jobs" 
ON public.jobs 
FOR ALL 
USING (
  company_id IN (
    SELECT id FROM public.companies 
    WHERE owner_id = auth.uid()
  )
);

-- Assigned workers can view their assigned jobs
CREATE POLICY "Workers can view assigned jobs" 
ON public.jobs 
FOR SELECT 
USING (
  assigned_to IN (
    SELECT id FROM public.profiles 
    WHERE user_id = auth.uid()
  )
);

-- Job applicants can view jobs they applied to
CREATE POLICY "Applicants can view applied jobs" 
ON public.jobs 
FOR SELECT 
USING (
  id IN (
    SELECT job_id FROM public.job_applications 
    WHERE applicant_id IN (
      SELECT id FROM public.profiles 
      WHERE user_id = auth.uid()
    )
  )
);

-- =============================================
-- JOB APPLICATIONS TABLE POLICIES
-- =============================================

-- Applicants can manage their own applications
CREATE POLICY "Applicants can manage own applications" 
ON public.job_applications 
FOR ALL 
USING (
  applicant_id IN (
    SELECT id FROM public.profiles 
    WHERE user_id = auth.uid()
  )
);

-- Employers can view applications for their jobs
CREATE POLICY "Employers can view job applications" 
ON public.job_applications 
FOR SELECT 
USING (
  company_id IN (
    SELECT id FROM public.companies 
    WHERE owner_id = auth.uid()
  )
);

-- Employers can update application status
CREATE POLICY "Employers can update application status" 
ON public.job_applications 
FOR UPDATE 
USING (
  company_id IN (
    SELECT id FROM public.companies 
    WHERE owner_id = auth.uid()
  )
) 
WITH CHECK (
  company_id IN (
    SELECT id FROM public.companies 
    WHERE owner_id = auth.uid()
  )
);

-- =============================================
-- JOB REQUIREMENTS TABLE POLICIES
-- =============================================

-- All users can view job requirements
CREATE POLICY "Users can view job requirements" 
ON public.job_requirements 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Company owners can manage requirements for their jobs
CREATE POLICY "Companies can manage job requirements" 
ON public.job_requirements 
FOR ALL 
USING (
  job_id IN (
    SELECT j.id FROM public.jobs j
    JOIN public.companies c ON j.company_id = c.id
    WHERE c.owner_id = auth.uid()
  )
);

-- =============================================
-- WORK HISTORY TABLE POLICIES
-- =============================================

-- Users can manage their own work history
CREATE POLICY "Users can manage own work history" 
ON public.work_history 
FOR ALL 
USING (
  profile_id IN (
    SELECT id FROM public.profiles 
    WHERE user_id = auth.uid()
  )
);

-- Employers can view work history of job applicants and employees
CREATE POLICY "Employers can view relevant work history" 
ON public.work_history 
FOR SELECT 
USING (
  profile_id IN (
    -- Job applicants
    SELECT ja.applicant_id 
    FROM public.job_applications ja
    JOIN public.jobs j ON ja.job_id = j.id
    JOIN public.companies c ON j.company_id = c.id
    WHERE c.owner_id = auth.uid()
    UNION
    -- Current employees
    SELECT j.assigned_to 
    FROM public.jobs j
    JOIN public.companies c ON j.company_id = c.id
    WHERE c.owner_id = auth.uid()
    AND j.assigned_to IS NOT NULL
  )
);

-- =============================================
-- NOTIFICATIONS TABLE POLICIES
-- =============================================

-- Users can view and manage their own notifications
CREATE POLICY "Users can manage own notifications" 
ON public.notifications 
FOR ALL 
USING (auth.uid() = user_id);

-- System can insert notifications for any user (for automation)
CREATE POLICY "System can create notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (auth.role() = 'service_role');

-- =============================================
-- COMPLIANCE AUDITS TABLE POLICIES
-- =============================================

-- Users can view audits related to their profiles/companies
CREATE POLICY "Users can view related audits" 
ON public.compliance_audits 
FOR SELECT 
USING (
  (entity_type = 'profile' AND entity_id IN (
    SELECT id FROM public.profiles 
    WHERE user_id = auth.uid()
  ))
  OR
  (entity_type = 'company' AND entity_id IN (
    SELECT id FROM public.companies 
    WHERE owner_id = auth.uid()
  ))
  OR
  (entity_type = 'job' AND entity_id IN (
    SELECT j.id FROM public.jobs j
    JOIN public.companies c ON j.company_id = c.id
    WHERE c.owner_id = auth.uid()
  ))
);

-- Safety officers can view and create all audits
CREATE POLICY "Safety officers can manage audits" 
ON public.compliance_audits 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles safety_profile 
    WHERE safety_profile.user_id = auth.uid() 
    AND safety_profile.user_role = 'safety_officer'
  )
);

-- Admins can view all audits
CREATE POLICY "Admins can view all audits" 
ON public.compliance_audits 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles admin_profile 
    WHERE admin_profile.user_id = auth.uid() 
    AND admin_profile.user_role = 'admin'
  )
);

-- =============================================
-- HELPER FUNCTIONS FOR RLS
-- =============================================

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND user_role = 'admin'
  );
END;
$$;

-- Function to check if user is safety officer
CREATE OR REPLACE FUNCTION public.is_safety_officer()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND user_role = 'safety_officer'
  );
END;
$$;

-- Function to check if user owns company
CREATE OR REPLACE FUNCTION public.owns_company(company_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.companies 
    WHERE id = company_uuid 
    AND owner_id = auth.uid()
  );
END;
$$;

-- Function to get user's profile ID
CREATE OR REPLACE FUNCTION public.get_user_profile_id()
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN (
    SELECT id FROM public.profiles 
    WHERE user_id = auth.uid()
  );
END;
$$;

-- =============================================
-- ADDITIONAL WA COMPLIANCE POLICIES
-- =============================================

-- Policy to ensure safety incidents are properly reported
CREATE POLICY "Ensure safety incident compliance" 
ON public.safety_incidents 
FOR INSERT 
WITH CHECK (
  -- Serious incidents must be flagged for WorkSafe WA reporting
  CASE 
    WHEN severity IN ('serious_injury', 'fatality') THEN
      reported_to_worksafe = true
    ELSE true
  END
);

-- Policy to ensure certification verification for high-risk work
CREATE POLICY "High-risk work certification verification" 
ON public.jobs 
FOR INSERT 
WITH CHECK (
  -- High-risk jobs must require verified certifications
  CASE 
    WHEN job_type IN ('crane_operator', 'rigger_level_3', 'lifting_supervisor') 
    AND height_work = true THEN
      required_certifications IS NOT NULL 
      AND array_length(required_certifications, 1) > 0
    ELSE true
  END
);

-- Policy to enforce medical certificate requirements
CREATE POLICY "Medical certificate enforcement" 
ON public.job_applications 
FOR INSERT 
WITH CHECK (
  -- Applications for high-risk positions require current medical certificates
  NOT EXISTS (
    SELECT 1 FROM public.jobs j
    WHERE j.id = job_id
    AND j.medical_requirements IS NOT NULL
    AND j.medical_requirements != ''
    AND NOT EXISTS (
      SELECT 1 FROM public.certifications c
      JOIN public.profiles p ON c.profile_id = p.id
      WHERE p.id = applicant_id
      AND c.certification_type = 'medical_certificate'
      AND c.is_active = true
      AND (c.expiry_date IS NULL OR c.expiry_date > CURRENT_DATE)
    )
  )
);

-- =============================================
-- PERFORMANCE OPTIMIZATIONS
-- =============================================

-- Create indexes to support RLS policies
CREATE INDEX IF NOT EXISTS idx_profiles_user_id_role ON public.profiles(user_id, user_role);
CREATE INDEX IF NOT EXISTS idx_companies_owner_active ON public.companies(owner_id, is_active);
CREATE INDEX IF NOT EXISTS idx_jobs_company_status ON public.jobs(company_id, status, is_active);
CREATE INDEX IF NOT EXISTS idx_applications_applicant_company ON public.job_applications(applicant_id, company_id);

-- =============================================
-- COMMENTS FOR DOCUMENTATION
-- =============================================

COMMENT ON POLICY "Users can view own profile" ON public.profiles IS 
'Western Australian Privacy Act compliance - users can only access their own personal information';

COMMENT ON POLICY "Clients can view rigger profiles" ON public.profiles IS 
'Limited access for job matching purposes, adhering to WA employment law requirements';

COMMENT ON POLICY "Safety officers can view profiles" ON public.profiles IS 
'WorkSafe WA compliance - authorized safety officers can access worker information for regulatory purposes';

COMMENT ON POLICY "Ensure safety incident compliance" ON public.safety_incidents IS 
'WorkSafe WA reporting requirements - serious incidents must be flagged for mandatory reporting';

COMMENT ON POLICY "High-risk work certification verification" ON public.jobs IS 
'WA High Risk Work License requirements - ensures compliance with DMIRS regulations';

COMMENT ON POLICY "Medical certificate enforcement" ON public.job_applications IS 
'WA mining industry medical fitness requirements for safety-critical positions';
