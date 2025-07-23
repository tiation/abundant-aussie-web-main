# RiggerBackend - Consolidated Backend Architecture

## Overview

This repository serves as the centralized backend infrastructure for the entire Rigger ecosystem under ChaseWhiteRabbit NGO. All backend services, APIs, and infrastructure components are consolidated here to ensure maintainability, scalability, and enterprise-grade DevOps practices.

## Architecture Principles

- **Microservices Architecture**: Modular, independently deployable services
- **API-First Design**: RESTful APIs with OpenAPI documentation
- **Security by Design**: OAuth 2.0, JWT tokens, role-based access control
- **Scalable Infrastructure**: Docker containers, Kubernetes orchestration
- **Observability**: Comprehensive logging, metrics, and tracing
- **CI/CD Ready**: Automated testing, building, and deployment

## Directory Structure

```
RiggerBackend/
├── api/                          # Legacy API structure (being migrated)
├── backend-apis/                 # Modern microservices architecture
│   ├── rigger-hub/              # RiggerHub-specific backend services
│   ├── rigger-connect/          # RiggerConnect-specific backend services
│   ├── rigger-shared/           # Shared backend components
│   └── tiation-ai/              # AI/ML services and agents
├── services/                     # Consolidated shared services
│   ├── abnService.js            # Australian Business Number validation
│   ├── emailService.js          # Email notification service
│   ├── tokenBlacklistService.js # JWT token management
│   └── worksafeService.js       # WorkSafe WA integration
├── infrastructure/               # DevOps and deployment configs
│   ├── ci-cd/                   # CI/CD pipeline configurations
│   ├── monitoring/              # Grafana dashboards, alerts
│   └── docs/                    # Infrastructure documentation
├── middleware/                   # Express.js middleware components
├── models/                       # Database models and schemas
├── routes/                       # API route definitions
├── utils/                        # Utility functions and helpers
├── tests/                        # Test suites and fixtures
├── scripts/                      # Deployment and maintenance scripts
└── docs/                         # API and technical documentation
```

## Backend Services Architecture

### Core APIs

#### 1. Authentication & Authorization Service
- **Location**: `backend-apis/rigger-shared/auth/`
- **Purpose**: Centralized authentication for all Rigger apps
- **Features**:
  - OAuth 2.0 / JWT token management
  - Multi-factor authentication (2FA)
  - Role-based access control (RBAC)
  - Session management
  - Password reset and email verification

#### 2. User Management Service
- **Location**: `backend-apis/rigger-shared/users/`
- **Purpose**: User profile and account management
- **Features**:
  - User registration and profiles
  - Account verification and validation
  - Preference management
  - Privacy controls

#### 3. Job Management Service
- **Location**: `backend-apis/rigger-shared/jobs/`
- **Purpose**: Core job posting and management functionality
- **Features**:
  - Job creation, editing, and deletion
  - Job search and filtering
  - Application tracking
  - Job status management

#### 4. Payment Processing Service
- **Location**: `backend-apis/rigger-shared/payments/`
- **Purpose**: Financial transactions and billing
- **Features**:
  - Stripe/PayPal integration
  - Invoice generation
  - Payment tracking
  - Escrow management

#### 5. Notification Service
- **Location**: `services/emailService.js` (consolidated)
- **Purpose**: Multi-channel notifications
- **Features**:
  - Email notifications
  - Push notifications
  - SMS alerts
  - In-app messaging

### App-Specific APIs

#### RiggerHub APIs
- **Location**: `backend-apis/rigger-hub/`
- **Purpose**: Business/employer-focused features
- **Services**:
  - Company profile management
  - Worker pool management
  - Project management
  - Compliance tracking
  - Performance analytics

#### RiggerConnect APIs  
- **Location**: `backend-apis/rigger-connect/`
- **Purpose**: Worker/contractor-focused features
- **Services**:
  - Worker profile management
  - Job application system
  - Timesheet management
  - Earnings tracking
  - Skills assessment

#### TiationAI APIs
- **Location**: `backend-apis/tiation-ai/`
- **Purpose**: AI-powered features and automation
- **Services**:
  - Job matching algorithms
  - Predictive analytics
  - Automated compliance checking
  - Chatbot services
  - Performance insights

## Integration with VPS Infrastructure

### Production Deployment
- **Primary Backend**: docker.sxc.codes (145.223.22.7)
- **Database**: supabase.sxc.codes (93.127.167.157)
- **Load Balancer**: helm.sxc.codes (145.223.21.248)
- **Monitoring**: grafana.sxc.codes (153.92.214.1)
- **Logs**: elastic.sxc.codes (145.223.22.14)

### CI/CD Pipeline
- **GitLab CI**: gitlab.sxc.codes (145.223.22.10)
- **Secondary CI**: GitHub Actions
- **Container Registry**: Docker Hub + GitLab Registry
- **Deployment**: Kubernetes via Helm charts

## Database Architecture

### Primary Database (Supabase)
- **User Management**: Supabase Auth
- **Real-time Features**: Supabase Realtime
- **File Storage**: Supabase Storage
- **Edge Functions**: Supabase Functions

### Data Models
```sql
-- Core tables
Users (id, email, profile_data, created_at, updated_at)
Jobs (id, title, description, company_id, location, status, created_at)
Applications (id, job_id, user_id, status, applied_at)
Companies (id, name, abn, verification_status, created_at)
Payments (id, job_id, amount, status, processed_at)
```

## Security Implementation

### Authentication Flow
1. User registration/login via OAuth 2.0
2. JWT token generation with expiry
3. Refresh token rotation
4. Multi-factor authentication for sensitive operations

### Data Protection
- Encryption at rest and in transit
- PII data anonymization
- GDPR compliance
- Audit logging for all data access

### API Security
- Rate limiting and throttling  
- Input validation and sanitization
- SQL injection prevention
- CORS configuration
- API key management

## Monitoring and Observability

### Metrics Collection
- Application performance metrics
- Business KPIs and analytics
- Infrastructure monitoring
- Error tracking and alerting

### Logging Strategy
- Structured JSON logging
- Centralized log aggregation (ELK stack)
- Log retention policies
- Security event monitoring

### Health Checks
- Application health endpoints
- Database connection monitoring
- External service dependency checks
- Automated recovery procedures

## Development Guidelines

### Code Standards
- TypeScript/JavaScript ES6+
- ESLint + Prettier configuration
- Comprehensive test coverage (>80%)
- API documentation with OpenAPI/Swagger

### Testing Strategy
- Unit tests for business logic
- Integration tests for API endpoints
- End-to-end tests for critical paths
- Load testing for performance validation

### Deployment Process
1. Feature development on feature branches
2. Automated testing on pull requests
3. Code review and approval process
4. Staging deployment and validation
5. Production deployment with rollback capability

## Environment Configuration

### Environment Variables
```bash
# Database
DATABASE_URL=postgresql://user:pass@host:port/db
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# Authentication
JWT_SECRET=your-jwt-secret
OAUTH_CLIENT_ID=your-oauth-client-id
OAUTH_CLIENT_SECRET=your-oauth-client-secret

# External Services
STRIPE_SECRET_KEY=sk_live_...
WORKSAFE_API_KEY=your-worksafe-api-key
EMAIL_SERVICE_API_KEY=your-email-api-key

# Infrastructure
REDIS_URL=redis://localhost:6379
ELASTICSEARCH_URL=http://localhost:9200
```

## Migration Strategy

### Phase 1: Consolidation (Current)
- Move all backend components to RiggerBackend repository
- Standardize API structure and documentation
- Implement centralized authentication

### Phase 2: Microservices Separation
- Split monolithic APIs into discrete services
- Implement service mesh architecture
- Add inter-service communication patterns

### Phase 3: Advanced Features
- Implement event-driven architecture
- Add real-time features with WebSockets
- Advanced analytics and ML integration

## Maintenance and Support

### Regular Tasks
- Security patches and updates
- Performance optimization
- Database maintenance
- Backup verification

### Monitoring Alerts
- API response time degradation
- Database connection issues
- High error rates
- Security breach attempts

### Incident Response
1. Immediate alert notification
2. Incident assessment and triage
3. Mitigation and resolution
4. Post-incident review and improvements

---

## ChaseWhiteRabbit NGO Alignment

This backend architecture supports the NGO's mission through:

- **Ethical Technology**: Privacy-first design, transparent data handling
- **Social Impact**: Job matching for underserved communities
- **Safety Focus**: Comprehensive compliance and safety monitoring
- **Open Source**: Documented, maintainable, and extensible codebase

---

*Last Updated: July 2024*  
*Maintained by: ChaseWhiteRabbit NGO Development Team*
