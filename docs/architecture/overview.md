# Rigger Platform Architecture Overview

**Version:** 1.0  
**Date:** 2024  
**Organization:** ChaseWhiteRabbit NGO  
**Project:** Rigger Ecosystem Platform  

## Executive Summary

The Rigger Platform is an enterprise-grade, ethical ecosystem designed to connect construction industry professionals with opportunities through a suite of interconnected applications. This architecture document outlines the comprehensive system design, data flow, microservices architecture, authentication mechanisms, and deployment pipeline details.

## Table of Contents

1. [System Architecture Overview](#system-architecture-overview)
2. [Data Flow Diagram](#data-flow-diagram)
3. [Application Architecture](#application-architecture)
4. [Microservices Architecture](#microservices-architecture)
5. [Authentication & Authorization](#authentication--authorization)
6. [Shared Libraries](#shared-libraries)
7. [Infrastructure & Deployment](#infrastructure--deployment)
8. [Security Considerations](#security-considerations)
9. [Monitoring & Observability](#monitoring--observability)
10. [Development Workflow](#development-workflow)

## System Architecture Overview

The Rigger Platform consists of multiple interconnected applications:

### Core Applications
- **RiggerConnect**: Professional networking and learning platform
- **RiggerHub**: Business management portal for employers
- **RiggerConnect Mobile**: Cross-platform mobile applications (iOS/Android)
- **RiggerBackend**: Centralized API and microservices layer
- **RiggerShared**: Common libraries and utilities

### Infrastructure Components
- **Kubernetes Cluster**: Container orchestration on helm.sxc.codes (145.223.21.248)
- **Docker Registry**: Container hosting on docker.sxc.codes (145.223.22.7)
- **CI/CD Pipeline**: GitLab-based automation on gitlab.sxc.codes (145.223.22.10)
- **Monitoring Stack**: Grafana dashboards on grafana.sxc.codes (153.92.214.1)
- **Log Aggregation**: ELK stack on elastic.sxc.codes (145.223.22.14)
- **Database Services**: Supabase on supabase.sxc.codes (93.127.167.157)

## Data Flow Diagram

```mermaid
graph TB
    %% Repository Layer - All 8 Official Repositories
    subgraph "Rigger Ecosystem Repositories"
        REPO_CONNECT_WEB[RiggerConnect-web<br/>React Web Platform]
        REPO_CONNECT_ANDROID[RiggerConnect-android<br/>Native Android App]
        REPO_CONNECT_IOS[RiggerConnect-ios<br/>Native iOS App]
        REPO_HUB_WEB[RiggerHub-web<br/>Business Web Platform]
        REPO_HUB_ANDROID[RiggerHub-android<br/>Business Android App]
        REPO_HUB_IOS[RiggerHub-ios<br/>Business iOS App]
        REPO_BACKEND[RiggerBackend<br/>API Services & Microservices]
        REPO_SHARED[RiggerShared<br/>Common Libraries & Utilities]
    end

    %% Client Layer - Runtime Applications
    subgraph "Client Layer"
        WEB1[RiggerConnect Web]
        WEB2[RiggerHub Web]
        MOB1[RiggerConnect iOS]
        MOB2[RiggerConnect Android]
        MOB3[RiggerHub iOS]
        MOB4[RiggerHub Android]
    end

    %% API Gateway
    subgraph "API Layer"
        GATEWAY[API Gateway/Load Balancer]
        AUTH[Authentication Service]
    end

    %% Microservices
    subgraph "Microservices Layer"
        USER[User Service]
        JOB[Job Service]
        NOTIF[Notification Service]
        PAYMENT[Payment Service]
        COMPLIANCE[Compliance Service]
        MATCHING[Matching Engine]
        WORKSAFE[WorkSafe Integration]
    end

    %% Shared Resources
    subgraph "Shared Layer"
        SHARED[RiggerShared Libraries]
        CACHE[Redis Cache]
        QUEUE[Message Queue]
    end

    %% Data Layer
    subgraph "Data Layer"
        SUPABASE[(Supabase PostgreSQL)]
        ELASTIC[(Elasticsearch)]
        FILES[File Storage]
    end

    %% External Services
    subgraph "External Services"
        WORKSAFE_EXT[WorkSafe WA API]
        PAYMENT_EXT[Payment Gateways]
        EMAIL[Email Service]
        SMS[SMS Service]
    end

    %% Repository to Client Connections
    REPO_CONNECT_WEB -.-> WEB1
    REPO_HUB_WEB -.-> WEB2
    REPO_CONNECT_IOS -.-> MOB1
    REPO_CONNECT_ANDROID -.-> MOB2
    REPO_HUB_IOS -.-> MOB3
    REPO_HUB_ANDROID -.-> MOB4
    REPO_BACKEND -.-> GATEWAY
    REPO_SHARED -.-> SHARED

    %% Client to API Connections
    WEB1 --> GATEWAY
    WEB2 --> GATEWAY
    MOB1 --> GATEWAY
    MOB2 --> GATEWAY
    MOB3 --> GATEWAY
    MOB4 --> GATEWAY

    %% API Gateway Connections
    GATEWAY --> AUTH
    GATEWAY --> USER
    GATEWAY --> JOB
    GATEWAY --> NOTIF
    GATEWAY --> PAYMENT
    GATEWAY --> COMPLIANCE
    GATEWAY --> MATCHING
    GATEWAY --> WORKSAFE

    %% Microservices to Shared Library Connections
    USER --> SHARED
    JOB --> SHARED
    NOTIF --> SHARED
    PAYMENT --> SHARED
    COMPLIANCE --> SHARED
    MATCHING --> SHARED
    WORKSAFE --> SHARED

    %% Microservices to Database Connections
    USER --> SUPABASE
    JOB --> SUPABASE
    NOTIF --> SUPABASE
    PAYMENT --> SUPABASE
    COMPLIANCE --> SUPABASE
    MATCHING --> SUPABASE
    WORKSAFE --> SUPABASE

    %% Queue and Cache Connections
    NOTIF --> QUEUE
    MATCHING --> QUEUE
    
    USER --> CACHE
    JOB --> CACHE
    
    %% Search and Analytics
    NOTIF --> ELASTIC
    USER --> ELASTIC
    JOB --> ELASTIC

    %% External Service Connections
    WORKSAFE --> WORKSAFE_EXT
    PAYMENT --> PAYMENT_EXT
    NOTIF --> EMAIL
    NOTIF --> SMS

    %% Repository Styling
    classDef repoStyle fill:#2D3748,stroke:#4A5568,stroke-width:2px,color:#E2E8F0
    classDef webStyle fill:#3182CE,stroke:#2B6CB0,stroke-width:2px,color:#E6FFFA
    classDef mobileStyle fill:#38A169,stroke:#2F855A,stroke-width:2px,color:#F0FFF4
    classDef backendStyle fill:#D69E2E,stroke:#B7791F,stroke-width:2px,color:#FFFBEB
    classDef sharedStyle fill:#805AD5,stroke:#6B46C1,stroke-width:2px,color:#FAF5FF
    
    class REPO_CONNECT_WEB,REPO_HUB_WEB webStyle
    class REPO_CONNECT_ANDROID,REPO_CONNECT_IOS,REPO_HUB_ANDROID,REPO_HUB_IOS mobileStyle
    class REPO_BACKEND backendStyle
    class REPO_SHARED sharedStyle
```

## Application Architecture

### RiggerConnect Web
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with custom Rigger theme
- **State Management**: Redux Toolkit
- **Routing**: React Router
- **Build Tool**: Vite
- **Testing**: Jest + React Testing Library

### RiggerHub Web
- **Framework**: Next.js with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **API**: tRPC for type-safe APIs
- **Database**: Prisma ORM
- **Authentication**: NextAuth.js

### RiggerConnect Mobile
- **Framework**: React Native with Capacitor
- **Cross-platform**: iOS and Android
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation
- **Native Features**: Capacitor plugins
- **Testing**: Detox for E2E testing

### RiggerBackend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL via Supabase
- **ORM**: Prisma
- **Authentication**: JWT + OAuth 2.0
- **Documentation**: OpenAPI/Swagger
- **Testing**: Jest + Supertest

## Microservices Architecture

### User Service
- **Responsibilities**:
  - User registration and profile management
  - Authentication and authorization
  - Profile verification and document management
  - Skills and certification tracking
- **Database Tables**: users, profiles, skills, certifications, documents
- **APIs**: RESTful with GraphQL subscriptions
- **Events**: user.created, user.updated, user.verified

### Job Service
- **Responsibilities**:
  - Job posting and management
  - Application processing
  - Job matching algorithms
  - Search and filtering
- **Database Tables**: jobs, applications, job_requirements, job_skills
- **APIs**: RESTful with real-time updates
- **Events**: job.created, job.applied, application.status_changed

### Notification Service
- **Responsibilities**:
  - Push notifications (mobile)
  - Email notifications
  - SMS alerts
  - In-app messaging
- **Queue System**: Redis-based message queue
- **Templates**: Dynamic email and SMS templates
- **Delivery Tracking**: Read receipts and engagement metrics

### Payment Service
- **Responsibilities**:
  - Subscription management
  - Payment processing
  - Invoice generation
  - Financial reporting
- **Integration**: Stripe, PayPal, bank transfers
- **Compliance**: PCI DSS compliance
- **Security**: End-to-end encryption

### Compliance Service
- **Responsibilities**:
  - WorkSafe WA integration
  - Safety certification tracking
  - Audit trail management
  - Compliance reporting
- **External APIs**: WorkSafe WA API integration
- **Document Management**: Secure document storage
- **Audit Logging**: Comprehensive compliance logs

### Matching Engine
- **Responsibilities**:
  - Intelligent job-candidate matching
  - ML-based recommendations
  - Skills gap analysis
  - Performance metrics
- **Algorithms**: Machine learning models
- **Data Processing**: Real-time and batch processing
- **Analytics**: Advanced matching metrics

## Authentication & Authorization

### Authentication Methods
1. **JWT Tokens**
   - Access tokens (15 minutes expiry)
   - Refresh tokens (7 days expiry)
   - Secure HTTP-only cookies

2. **OAuth 2.0 Providers**
   - Google OAuth
   - LinkedIn OAuth
   - Microsoft Azure AD

3. **Multi-Factor Authentication (MFA)**
   - TOTP (Time-based One-Time Passwords)
   - SMS verification
   - Email verification

### Authorization Framework
- **Role-Based Access Control (RBAC)**
  - Roles: Admin, Employer, Worker, Moderator
  - Permissions: Create, Read, Update, Delete
  - Resource-based permissions

- **Attribute-Based Access Control (ABAC)**
  - Context-aware permissions
  - Location-based access
  - Time-based restrictions

### Security Implementation
```typescript
// Example JWT middleware
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
```

## Shared Libraries

### RiggerShared Package Structure
```
RiggerShared/
├── src/
│   ├── types/           # TypeScript type definitions
│   │   ├── User.ts
│   │   ├── Job.ts
│   │   └── Common.ts
│   ├── utils/           # Utility functions
│   │   ├── validation.ts
│   │   ├── formatting.ts
│   │   └── constants.ts
│   ├── hooks/           # React hooks
│   │   ├── useAuth.ts
│   │   ├── useApi.ts
│   │   └── useSocket.ts
│   ├── components/      # Shared UI components
│   │   ├── Button/
│   │   ├── Modal/
│   │   └── Form/
│   ├── api/             # API clients
│   │   ├── client.ts
│   │   ├── auth.ts
│   │   └── endpoints.ts
│   └── theme/           # Design system
│       ├── colors.ts
│       ├── typography.ts
│       └── spacing.ts
├── package.json
└── tsconfig.json
```

### Key Shared Components
- **API Client**: Unified HTTP client with interceptors
- **Type Definitions**: Shared TypeScript interfaces
- **Validation Schemas**: Zod-based validation
- **UI Components**: Reusable React components
- **Utility Functions**: Common business logic
- **Theme System**: Consistent design tokens

## Infrastructure & Deployment

### Kubernetes Architecture

#### Cluster Configuration (helm.sxc.codes)
```yaml
apiVersion: v1
kind: Cluster
metadata:
  name: rigger-production
spec:
  nodes:
    - name: master-node
      role: master
      resources:
        cpu: "4"
        memory: "8Gi"
    - name: worker-node-1
      role: worker
      resources:
        cpu: "8"
        memory: "16Gi"
    - name: worker-node-2
      role: worker
      resources:
        cpu: "8"
        memory: "16Gi"
```

#### Namespace Structure
- `rigger-production`: Production environment
- `rigger-staging`: Staging environment
- `rigger-development`: Development environment
- `rigger-monitoring`: Monitoring stack
- `rigger-logging`: Logging infrastructure

### Docker Configuration

#### Multi-stage Dockerfile Example
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Runtime stage
FROM node:18-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

#### Container Registry (docker.sxc.codes)
- **Base Images**: Optimized Node.js, nginx, PostgreSQL
- **Application Images**: Versioned application containers
- **Security Scanning**: Automated vulnerability scanning
- **Image Signing**: Digital signatures for integrity

### Helm Charts Structure

```
rigger-helm-charts/
├── charts/
│   ├── rigger-backend/
│   │   ├── Chart.yaml
│   │   ├── values.yaml
│   │   ├── values-prod.yaml
│   │   ├── values-staging.yaml
│   │   └── templates/
│   │       ├── deployment.yaml
│   │       ├── service.yaml
│   │       ├── ingress.yaml
│   │       ├── configmap.yaml
│   │       └── secret.yaml
│   ├── rigger-web/
│   └── rigger-mobile-api/
└── umbrella-chart/
    ├── Chart.yaml
    ├── values.yaml
    └── requirements.yaml
```

#### Example Helm Values
```yaml
# values-prod.yaml
image:
  repository: docker.sxc.codes/rigger-backend
  tag: "v1.0.0"
  pullPolicy: IfNotPresent

replicas: 3

resources:
  requests:
    cpu: 500m
    memory: 1Gi
  limits:
    cpu: 2000m
    memory: 4Gi

service:
  type: ClusterIP
  port: 3000

ingress:
  enabled: true
  hostname: api.riggerconnect.com
  tls: true

env:
  NODE_ENV: production
  DATABASE_URL: postgresql://user:pass@supabase.sxc.codes/rigger_prod
```

### CI/CD Pipeline (GitLab)

#### Pipeline Stages
1. **Source**: Code checkout and dependency installation
2. **Test**: Unit tests, integration tests, security scans
3. **Build**: Docker image creation and optimization
4. **Security**: Vulnerability scanning and SAST/DAST
5. **Deploy**: Helm chart deployment to Kubernetes
6. **Verify**: Health checks and smoke tests
7. **Monitor**: Performance and error monitoring

#### GitLab CI Configuration
```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - security
  - deploy
  - verify

variables:
  DOCKER_REGISTRY: docker.sxc.codes
  HELM_CHART_REPO: helm.sxc.codes
  KUBE_NAMESPACE: rigger-production

test:
  stage: test
  script:
    - npm ci
    - npm run test:unit
    - npm run test:integration
    - npm run lint
    - npm run type-check
  coverage: '/Statements\s*:\s*(\d+\.?\d*)%/'

build:
  stage: build
  script:
    - docker build -t $DOCKER_REGISTRY/rigger-backend:$CI_COMMIT_SHA .
    - docker push $DOCKER_REGISTRY/rigger-backend:$CI_COMMIT_SHA
  only:
    - main
    - develop

security-scan:
  stage: security
  script:
    - trivy image $DOCKER_REGISTRY/rigger-backend:$CI_COMMIT_SHA
    - sonar-scanner
  allow_failure: false

deploy-production:
  stage: deploy
  script:
    - helm upgrade --install rigger-backend
        ./helm-charts/rigger-backend
        --namespace $KUBE_NAMESPACE
        --values values-prod.yaml
        --set image.tag=$CI_COMMIT_SHA
  environment:
    name: production
    url: https://api.riggerconnect.com
  only:
    - main

verify-deployment:
  stage: verify
  script:
    - kubectl rollout status deployment/rigger-backend -n $KUBE_NAMESPACE
    - curl -f https://api.riggerconnect.com/health
  dependencies:
    - deploy-production
```

### Infrastructure as Code

#### Terraform Configuration
```hcl
# infrastructure/main.tf
provider "kubernetes" {
  config_path = "~/.kube/config"
}

resource "kubernetes_namespace" "rigger_production" {
  metadata {
    name = "rigger-production"
    labels = {
      environment = "production"
      project     = "rigger"
    }
  }
}

resource "kubernetes_secret" "database_credentials" {
  metadata {
    name      = "database-credentials"
    namespace = kubernetes_namespace.rigger_production.metadata[0].name
  }

  type = "Opaque"

  data = {
    username = var.db_username
    password = var.db_password
    host     = var.db_host
  }
}
```

## Security Considerations

### Application Security
- **Input Validation**: Comprehensive input sanitization
- **SQL Injection Prevention**: Parameterized queries and ORM
- **XSS Protection**: Content Security Policy and input encoding
- **CSRF Protection**: CSRF tokens and SameSite cookies
- **Rate Limiting**: API rate limiting and DDoS protection

### Infrastructure Security
- **Network Segmentation**: VPC isolation and security groups
- **TLS Everywhere**: End-to-end encryption in transit
- **Secrets Management**: Kubernetes secrets and HashiCorp Vault
- **Container Security**: Minimal base images and security scanning
- **Access Control**: RBAC and least privilege principles

### Compliance & Auditing
- **GDPR Compliance**: Data privacy and right to be forgotten
- **SOC 2 Type II**: Security and availability controls
- **ISO 27001**: Information security management
- **Audit Logging**: Comprehensive security event logging
- **Data Encryption**: AES-256 encryption at rest

## Monitoring & Observability

### Metrics Stack (Grafana)
- **Application Metrics**: Performance, errors, business metrics
- **Infrastructure Metrics**: CPU, memory, disk, network
- **Custom Dashboards**: Role-specific monitoring views
- **Alerting**: Proactive issue detection and notification

### Logging Stack (ELK)
- **Centralized Logging**: All application and infrastructure logs
- **Log Parsing**: Structured logging with JSON format
- **Search & Analytics**: Elasticsearch-powered log analysis
- **Retention Policies**: Automated log rotation and archival

### Distributed Tracing
- **Request Tracing**: End-to-end request flow visibility
- **Performance Profiling**: Bottleneck identification
- **Error Tracking**: Exception monitoring and alerting
- **User Journey Tracking**: Business process monitoring

### Health Checks & SLA Monitoring
```typescript
// Health check endpoint
app.get('/health', async (req, res) => {
  const checks = {
    database: await checkDatabase(),
    redis: await checkRedis(),
    externalApi: await checkExternalServices(),
    diskSpace: await checkDiskSpace(),
    memory: await checkMemoryUsage()
  };

  const isHealthy = Object.values(checks).every(check => check.status === 'healthy');
  
  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    checks
  });
});
```

## Development Workflow

### Git Workflow
- **Main Branch**: Production-ready code
- **Develop Branch**: Integration branch for features
- **Feature Branches**: Individual feature development
- **Release Branches**: Release preparation and bug fixes
- **Hotfix Branches**: Critical production fixes

### Code Quality
- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit checks
- **SonarQube**: Code quality and security analysis
- **Test Coverage**: Minimum 80% coverage requirement

### Development Environment
- **Docker Compose**: Local development stack
- **VS Code DevContainers**: Consistent development environment
- **Hot Reloading**: Fast development feedback loop
- **Mock Services**: Local API mocking for frontend development

### Testing Strategy
- **Unit Tests**: Component and function-level testing
- **Integration Tests**: API and database testing
- **E2E Tests**: Full user journey testing
- **Load Tests**: Performance and scalability testing
- **Security Tests**: Automated security vulnerability testing

## Conclusion

The Rigger Platform architecture provides a robust, scalable, and secure foundation for connecting construction industry professionals. The microservices architecture ensures maintainability and scalability, while the comprehensive DevOps pipeline enables rapid, reliable deployments.

### Key Architectural Benefits
- **Scalability**: Horizontal scaling through microservices and Kubernetes
- **Reliability**: High availability through redundancy and health monitoring
- **Security**: Enterprise-grade security controls and compliance
- **Maintainability**: Modular architecture and comprehensive documentation
- **Performance**: Optimized for speed and responsiveness

### Future Roadmap
- **AI/ML Integration**: Enhanced matching algorithms and predictive analytics
- **Blockchain Integration**: Decentralized credential verification
- **IoT Integration**: Real-time job site monitoring and safety
- **Advanced Analytics**: Business intelligence and reporting
- **Mobile Enhancement**: Offline capabilities and progressive web app

---

**Document Maintained By**: ChaseWhiteRabbit NGO Technical Team  
**Last Updated**: 2024  
**Next Review**: Quarterly
