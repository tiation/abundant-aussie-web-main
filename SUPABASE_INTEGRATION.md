# Supabase Integration Documentation

This document outlines the comprehensive Supabase integration implemented across the Rigger platform applications.

## Overview

Both **RiggerConnect-web** (business portal) and **RiggerHub-web** (worker portal) have been integrated with Supabase for:

- **Authentication & User Management**: Sign-up, login, password reset, user profiles
- **Database Operations**: CRUD operations for jobs, applications, user profiles
- **Real-time Features**: Ready for real-time updates and notifications
- **Security**: Row-level security policies and role-based access control

## Configuration

### Environment Variables

#### RiggerConnect-web (Next.js)
```bash
# Supabase Configuration
SUPABASE_URL=https://qzjmwhjjzlsyppstljcw.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# Database Configuration (using Supabase PostgreSQL)
DATABASE_URL=postgresql://postgres:password@db.qzjmwhjjzlsyppstljcw.supabase.co:5432/postgres
```

#### RiggerHub-web (Vite/React)
```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://qzjmwhjjzlsyppstljcw.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Application Configuration
VITE_APP_URL=http://localhost:5173
VITE_API_URL=http://localhost:3001
```

### Supabase Project Configuration

- **Project URL**: `https://qzjmwhjjzlsyppstljcw.supabase.co`
- **Hosted on**: `supabase.sxc.codes` (93.127.167.157)
- **Database**: PostgreSQL with real-time capabilities
- **Authentication**: Email/password with metadata support

## Database Schema

### Core Tables

#### `users`
```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT CHECK (role IN ('rigger', 'employer', 'administrator')) NOT NULL,
  avatar TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `user_profiles`
```sql
CREATE TABLE user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company TEXT,
  skills TEXT[],
  experience INTEGER,
  hourly_rate DECIMAL(10,2),
  availability TEXT CHECK (availability IN ('available', 'busy', 'unavailable')),
  verification_status TEXT CHECK (verification_status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending',
  rating DECIMAL(3,2),
  total_jobs INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `jobs`
```sql
CREATE TABLE jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  requirements TEXT[],
  hourly_rate DECIMAL(10,2) NOT NULL,
  duration TEXT,
  status TEXT CHECK (status IN ('draft', 'published', 'in_progress', 'completed', 'cancelled')) DEFAULT 'draft',
  employer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  assigned_rigger_id UUID REFERENCES users(id),
  deadline TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `applications`
```sql
CREATE TABLE applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  rigger_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')) DEFAULT 'pending',
  proposed_rate DECIMAL(10,2),
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Architecture

### RiggerConnect-web (Next.js)

**File Structure:**
```
lib/
├── supabase/
│   ├── client.ts              # Supabase client configuration
│   └── database.types.ts      # TypeScript database types
├── auth/
│   └── auth-service.ts        # Authentication services
└── services/
    └── job-service.ts         # Job management services
```

**Key Features:**
- Server-side and client-side Supabase clients
- Service role client for admin operations
- Comprehensive authentication service
- Job CRUD operations
- Application management
- Type-safe database operations

### RiggerHub-web (Vite/React)

**File Structure:**
```
src/lib/
├── supabase/
│   ├── client.ts              # Supabase client configuration
│   └── database.types.ts      # TypeScript database types
└── auth/
    └── auth-service.ts        # Authentication services
```

**Key Features:**
- Client-side Supabase integration
- User authentication and profile management
- Job browsing and application submission
- Real-time updates ready

## Authentication Flow

### Sign Up Process
1. User submits registration form
2. Supabase Auth creates user account
3. User metadata stored (name, role, phone)
4. Email verification sent
5. User profile created in `user_profiles` table

### Sign In Process
1. User submits credentials
2. Supabase Auth validates credentials
3. Session token generated
4. User data retrieved with profile information
5. Role-based access control applied

### Password Reset
1. User requests password reset
2. Supabase sends reset email
3. User clicks reset link
4. New password set through secure flow

## API Usage Examples

### Authentication (RiggerConnect-web)
```typescript
import { clientAuth } from '@/lib/auth/auth-service'

// Sign up new user
const { user, error } = await clientAuth.signUp({
  email: 'user@example.com',
  password: 'securepassword',
  firstName: 'John',
  lastName: 'Doe',
  role: 'employer',
  phone: '+1234567890'
})

// Sign in existing user
const { user, session, error } = await clientAuth.signIn({
  email: 'user@example.com',
  password: 'securepassword'
})
```

### Job Management (RiggerConnect-web)
```typescript
import { jobService } from '@/lib/services/job-service'

// Create new job posting
const { job, error } = await jobService.createJob({
  title: 'Tower Crane Operator',
  description: 'Looking for experienced crane operator...',
  location: 'Sydney, NSW',
  requirements: ['Tower crane license', '5+ years experience'],
  hourlyRate: 85.00,
  duration: '6 months',
  deadline: '2024-08-01'
}, employerId)

// Get published jobs
const { jobs, error } = await jobService.getPublishedJobs(20, 0)
```

### Profile Management (RiggerHub-web)
```typescript
import { authService } from '@/lib/auth/auth-service'

// Get current user profile
const { profile, error } = await authService.getCurrentUserProfile()

// Update user profile
const { profile, error } = await authService.updateUserProfile({
  company: 'ABC Construction',
  skills: ['Tower crane', 'Mobile crane', 'Rigging'],
  experience: 8,
  hourlyRate: 90.00,
  availability: 'available'
})
```

## Security Best Practices

### Environment Variables
- All Supabase credentials stored in environment variables
- Different keys for client-side and server-side operations
- Service role key only used for admin operations
- Production keys stored securely and rotated regularly

### Row Level Security (RLS)
```sql
-- Users can only read their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Employers can only manage their own jobs
CREATE POLICY "Employers can manage own jobs" ON jobs
  FOR ALL USING (auth.uid() = employer_id);

-- Riggers can apply to published jobs
CREATE POLICY "Riggers can apply to jobs" ON applications
  FOR INSERT WITH CHECK (
    auth.uid() = rigger_id AND
    EXISTS (SELECT 1 FROM jobs WHERE id = job_id AND status = 'published')
  );
```

### Data Validation
- TypeScript interfaces for all data structures
- Input validation on both client and server
- Sanitization of user inputs
- Rate limiting on authentication endpoints

## Deployment Configuration

### Development
- Local environment variables in `.env` files
- Supabase local development available
- Hot reloading for both applications

### Production
- Environment variables injected via CI/CD
- SSL/TLS encryption for all communications
- CDN for static assets
- Database connection pooling

## Monitoring and Logging

### Supabase Dashboard
- Real-time database activity
- Authentication metrics
- API usage statistics
- Performance monitoring

### Application Logging
- Authentication events logged
- Database operations tracked
- Error reporting integrated
- User activity monitoring

## Next Steps

1. **Real-time Features**: Implement real-time job updates and notifications
2. **File Storage**: Add Supabase Storage for user avatars and documents
3. **Edge Functions**: Deploy serverless functions for complex business logic
4. **Analytics**: Implement user behavior tracking and job performance metrics
5. **Mobile Integration**: Extend Supabase integration to mobile applications

## Support and Maintenance

- **Database Migrations**: Version controlled schema changes
- **Backup Strategy**: Automated daily backups with point-in-time recovery
- **Monitoring**: 24/7 uptime monitoring and alerting
- **Updates**: Regular updates to Supabase client libraries

---

*This integration provides a robust, scalable foundation for the Rigger platform with enterprise-grade security and performance.*
