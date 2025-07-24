# PosCalls4U Architecture Overview

## System Architecture

PosCalls4U is a modern, scalable call center platform built with a microservices-inspired architecture using Node.js, React, and MongoDB. The system follows enterprise-grade patterns with clear separation of concerns, robust security, and comprehensive testing.

## High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client        │    │   Server        │    │   Database      │
│   (React/Vite)  │◄──►│   (Node.js)     │◄──►│   (MongoDB)     │
│   Port: 3000    │    │   Port: 5000    │    │   Port: 27017   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Build Tools   │    │   External      │    │   Caching       │
│   - Vite        │    │   Services      │    │   (Redis)       │
│   - TypeScript  │    │   - Email       │    │   Port: 6379    │
│   - Tailwind    │    │   - OAuth       │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Technology Stack

### Frontend Stack
- **React 18**: Component-based UI framework
- **TypeScript**: Type-safe JavaScript
- **Vite**: Modern build tool with HMR
- **Tailwind CSS**: Utility-first CSS framework
- **Redux Toolkit**: State management
- **React Query**: Server state management
- **React Router**: Client-side routing
- **React Hook Form**: Form handling
- **Socket.io Client**: Real-time communication

### Backend Stack
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **TypeScript**: Type-safe JavaScript
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB ODM
- **Socket.io**: Real-time communication
- **Redis**: Caching and session storage
- **JWT**: Authentication tokens
- **Passport.js**: Authentication middleware
- **Nodemailer**: Email service
- **Winston**: Logging framework

### Development & Testing
- **Jest**: Testing framework
- **Supertest**: HTTP testing
- **React Testing Library**: Component testing
- **MongoDB Memory Server**: Test database
- **Cypress**: E2E testing
- **ESLint**: Code linting
- **Prettier**: Code formatting

## Directory Structure

```
PosCalls4U/
├── client/                     # React frontend application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Auth/         # Authentication components
│   │   │   ├── Dashboard/    # Dashboard components
│   │   │   ├── Layout/       # Layout components
│   │   │   ├── Stats/        # Statistics components
│   │   │   ├── Teams/        # Team management components
│   │   │   └── UI/           # Basic UI components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API service layer
│   │   ├── store/            # Redux store configuration
│   │   ├── types/            # TypeScript type definitions
│   │   ├── utils/            # Utility functions
│   │   └── tests/            # Test setup and utilities
│   ├── public/               # Static assets
│   └── package.json          # Client dependencies
├── server/                    # Node.js backend application
│   ├── src/
│   │   ├── config/           # Configuration files
│   │   │   ├── database.ts   # Database connection
│   │   │   └── passport.ts   # Authentication strategies
│   │   ├── controllers/      # Business logic controllers
│   │   ├── middleware/       # Express middleware
│   │   │   ├── auth.ts       # Authentication middleware
│   │   │   ├── cache.ts      # Caching middleware
│   │   │   └── errorHandler.ts # Error handling
│   │   ├── models/           # Database models
│   │   ├── routes/           # API route definitions
│   │   ├── services/         # Business logic services
│   │   ├── types/            # TypeScript type definitions
│   │   ├── utils/            # Utility functions
│   │   └── tests/            # Test files
│   ├── dist/                 # Compiled JavaScript
│   ├── logs/                 # Application logs
│   └── package.json          # Server dependencies
├── docs/                      # Documentation
│   ├── api/                  # API documentation
│   ├── diagrams/             # Architecture diagrams
│   └── deployment/           # Deployment guides
├── cypress/                   # E2E tests
└── .github/                   # GitHub workflows
```

## Core Components

### Authentication System

The authentication system implements multiple layers of security:

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Login      │    │   JWT        │    │   Session    │
│   Component  │───►│   Validation │───►│   Management │
└──────────────┘    └──────────────┘    └──────────────┘
        │                    │                    │
        ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Social     │    │   Password   │    │   Token      │
│   OAuth      │    │   Reset      │    │   Blacklist  │
└──────────────┘    └──────────────┘    └──────────────┘
```

**Components:**
- **JWT Authentication**: Stateless token-based authentication
- **Social OAuth**: Google and Facebook login integration
- **Password Security**: Bcrypt hashing, reset functionality
- **Session Management**: Multi-device support, token blacklisting
- **Account Protection**: Lockout after failed attempts

### Data Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Application Layer                       │
├─────────────────────────────────────────────────────────────┤
│                     Service Layer                           │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │   Auth      │ │   User      │ │   Team      │          │
│  │   Service   │ │   Service   │ │   Service   │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
├─────────────────────────────────────────────────────────────┤
│                     Data Access Layer                       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │   User      │ │   Team      │ │   Call      │          │
│  │   Model     │ │   Model     │ │   Model     │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
├─────────────────────────────────────────────────────────────┤
│                     Database Layer                          │
│              MongoDB + Redis (Caching)                     │
└─────────────────────────────────────────────────────────────┘
```

### API Architecture

RESTful API design with consistent patterns:

```
/api/v1/
├── /auth/                    # Authentication endpoints
│   ├── POST /login          # User login
│   ├── POST /register       # User registration
│   ├── POST /logout         # Logout current session
│   ├── POST /logout-all     # Logout all sessions
│   ├── POST /forgot-password # Password reset request
│   ├── POST /reset-password # Password reset
│   ├── GET  /google         # Google OAuth
│   ├── GET  /facebook       # Facebook OAuth
│   └── GET  /profile        # User profile
├── /users/                   # User management
│   ├── GET    /             # List users
│   ├── GET    /:id          # Get user
│   ├── PUT    /:id          # Update user
│   └── DELETE /:id          # Delete user
├── /teams/                   # Team management
│   ├── GET    /             # List teams
│   ├── POST   /             # Create team
│   ├── GET    /:id          # Get team
│   ├── PUT    /:id          # Update team
│   └── DELETE /:id          # Delete team
└── /stats/                   # Statistics
    ├── GET /dashboard       # Dashboard stats
    ├── GET /calls           # Call statistics
    └── GET /performance     # Performance metrics
```

## Data Flow Architecture

### Authentication Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Client    │    │   Server    │    │  Database   │    │   External  │
│   Request   │───►│ Validation  │───►│   Query     │    │   Services  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       ▲                   │                   │                   │
       │                   ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Token     │◄───│   JWT       │◄───│   User      │    │   OAuth     │
│   Storage   │    │   Creation  │    │   Retrieval │    │   Provider  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

### Real-time Data Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Client    │    │   Server    │    │  Database   │
│   (Socket)  │◄──►│  (Socket.io)│◄──►│  (MongoDB)  │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   UI        │    │   Event     │    │   Change    │
│   Updates   │    │   Handlers  │    │   Streams   │
└─────────────┘    └─────────────┘    └─────────────┘
```

## Security Architecture

### Multi-Layer Security

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Security                         │
│  • HTTPS Only • CSP Headers • XSS Protection               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Transport Security                        │
│  • TLS 1.3 • Certificate Validation • HSTS                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 Application Security                        │
│  • JWT Tokens • Rate Limiting • Input Validation           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Database Security                         │
│  • Encrypted Connections • Access Control • Audit Logs     │
└─────────────────────────────────────────────────────────────┘
```

### Authentication Security Features
- **Password Hashing**: Bcrypt with 12 salt rounds
- **JWT Security**: Signed tokens with expiration
- **Account Protection**: Lockout after failed attempts
- **Session Management**: Token blacklisting
- **Social OAuth**: Secure callback handling
- **Rate Limiting**: Prevent brute force attacks

## Performance Architecture

### Caching Strategy

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Browser   │    │   Server    │    │  Database   │
│   Cache     │    │   Cache     │    │   Index     │
│   (Memory)  │    │   (Redis)   │    │   (MongoDB) │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Assets    │    │   Session   │    │   Query     │
│   Static    │    │   Data      │    │   Results   │
│   Content   │    │   User Info │    │   Indexes   │
└─────────────┘    └─────────────┘    └─────────────┘
```

### Database Optimization
- **Indexes**: Strategic indexing for frequently queried fields
- **Aggregation**: MongoDB aggregation pipelines for complex queries
- **Connection Pooling**: Efficient database connection management
- **Query Optimization**: Lean queries and projection
- **Data Modeling**: Optimized document structure

## Scalability Architecture

### Horizontal Scaling Preparation

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Load      │    │   Server    │    │  Database   │
│   Balancer  │───►│   Cluster   │───►│   Cluster   │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   SSL       │    │   Multiple  │    │   Replica   │
│   Termination│    │   Instances │    │   Set       │
└─────────────┘    └─────────────┘    └─────────────┘
```

### Microservices Ready
The current monolithic structure is designed to be easily split into microservices:

- **Authentication Service**: User management and authentication
- **Team Service**: Team and role management
- **Statistics Service**: Analytics and reporting
- **Communication Service**: Real-time messaging
- **PBX Service**: Call management integration

## Error Handling Architecture

### Centralized Error Management

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Client    │    │   Server    │    │   Logging   │
│   Error     │───►│   Error     │───►│   System    │
│   Boundary  │    │   Handler   │    │   (Winston) │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   User      │    │   HTTP      │    │   File &    │
│   Feedback  │    │   Status    │    │   Console   │
└─────────────┘    └─────────────┘    └─────────────┘
```

## Monitoring & Observability

### Application Monitoring

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Client    │    │   Server    │    │  Database   │
│   Metrics   │───►│   Metrics   │───►│   Metrics   │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Browser   │    │   Winston   │    │   MongoDB   │
│   DevTools  │    │   Logging   │    │   Profiler  │
└─────────────┘    └─────────────┘    └─────────────┘
```

### Health Checks
- **Application Health**: `/health` endpoint
- **Database Health**: Connection and query tests
- **External Services**: OAuth and email service checks
- **Performance Metrics**: Response times and throughput

## Development Architecture

### Development Workflow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Local     │    │   Testing   │    │   CI/CD     │
│   Development│───►│   Pipeline  │───►│   Pipeline  │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Hot       │    │   Unit &    │    │   Build &   │
│   Reload    │    │   Integration│    │   Deploy    │
└─────────────┘    └─────────────┘    └─────────────┘
```

### Code Quality Pipeline
- **Linting**: ESLint for code quality
- **Formatting**: Prettier for consistent style
- **Type Checking**: TypeScript compilation
- **Testing**: Unit, integration, and E2E tests
- **Coverage**: Code coverage requirements (80%+)

## Deployment Architecture

### Production Deployment

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   CDN       │    │   App       │    │  Database   │
│   (Static)  │    │   Server    │    │   Cluster   │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Edge      │    │   Container │    │   Replica   │
│   Caching   │    │   (Docker)  │    │   Set       │
└─────────────┘    └─────────────┘    └─────────────┘
```

## Future Architecture Considerations

### Planned Enhancements
- **Microservices Migration**: Split into domain-specific services
- **Message Queue**: Add Redis/RabbitMQ for async processing
- **API Gateway**: Centralized API management
- **Service Mesh**: Inter-service communication
- **Container Orchestration**: Kubernetes deployment
- **Monitoring Stack**: Prometheus + Grafana
- **Distributed Tracing**: OpenTelemetry integration

### Integration Points
- **PBX Systems**: SIP/WebRTC integration
- **CRM Systems**: Customer data integration
- **Analytics Platforms**: Business intelligence
- **Communication Tools**: Slack, Microsoft Teams
- **Cloud Services**: AWS, Azure, GCP deployment

---

This architecture provides a solid foundation for a scalable, secure, and maintainable call center platform while remaining flexible for future enhancements and integrations.
