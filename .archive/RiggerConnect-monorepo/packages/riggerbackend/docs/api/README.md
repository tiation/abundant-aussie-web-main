# API Documentation

## Overview
This directory contains comprehensive API documentation for the Rigger ecosystem component. Our APIs follow RESTful design principles and include GraphQL endpoints for complex data operations.

## Base URLs

### Environments
- **Development**: `http://localhost:3000/api/v1`
- **Staging**: `https://staging-api.rigger.sxc.codes/api/v1`
- **Production**: `https://api.rigger.sxc.codes/api/v1`

## Authentication

### JWT Authentication
All API endpoints require authentication via JWT tokens.

```bash
# Include the token in the Authorization header
Authorization: Bearer <your-jwt-token>
```

### Authentication Endpoints

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "user"
    }
  }
}
```

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Refresh Token
```http
POST /auth/refresh
Authorization: Bearer <refresh-token>
```

## Core API Endpoints

### Users API

#### Get User Profile
```http
GET /users/profile
Authorization: Bearer <token>
```

#### Update User Profile
```http
PUT /users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Professional rigger with 10+ years experience"
}
```

### Jobs API

#### List Jobs
```http
GET /jobs?page=1&limit=10&location=city&skill=rigging
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (integer): Page number (default: 1)
- `limit` (integer): Items per page (default: 10, max: 100)
- `location` (string): Filter by location
- `skill` (string): Filter by required skill
- `salary_min` (integer): Minimum salary filter
- `salary_max` (integer): Maximum salary filter

**Response:**
```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "id": "uuid",
        "title": "Senior Rigger",
        "company": "Construction Corp",
        "location": "New York, NY",
        "salary": 75000,
        "description": "Experienced rigger needed...",
        "requirements": ["5+ years experience", "OSHA certification"],
        "createdAt": "2025-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 150,
      "pages": 15
    }
  }
}
```

#### Create Job Posting
```http
POST /jobs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Senior Rigger",
  "company": "Construction Corp",
  "location": "New York, NY",
  "salary": 75000,
  "description": "We are seeking an experienced rigger...",
  "requirements": ["5+ years experience", "OSHA certification"],
  "skills": ["rigging", "crane operation", "safety"]
}
```

#### Get Job Details
```http
GET /jobs/{job_id}
Authorization: Bearer <token>
```

#### Apply to Job
```http
POST /jobs/{job_id}/apply
Authorization: Bearer <token>
Content-Type: application/json

{
  "coverLetter": "I am interested in this position because...",
  "resumeUrl": "https://example.com/resume.pdf"
}
```

### Applications API

#### Get User Applications
```http
GET /applications/user
Authorization: Bearer <token>
```

#### Get Job Applications (Employer only)
```http
GET /applications/job/{job_id}
Authorization: Bearer <token>
```

#### Update Application Status
```http
PUT /applications/{application_id}/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "reviewed" // pending, reviewed, accepted, rejected
}
```

## GraphQL API

### Endpoint
```
POST /graphql
Authorization: Bearer <token>
Content-Type: application/json
```

### Example Queries

#### Get User with Jobs
```graphql
query GetUserWithJobs($userId: ID!) {
  user(id: $userId) {
    id
    email
    firstName
    lastName
    profile {
      bio
      skills
      certifications
    }
    applications {
      id
      status
      job {
        id
        title
        company
        location
      }
    }
  }
}
```

#### Search Jobs with Filters
```graphql
query SearchJobs($filters: JobFilters!, $pagination: PaginationInput!) {
  jobs(filters: $filters, pagination: $pagination) {
    data {
      id
      title
      company
      location
      salary
      skills
      createdAt
    }
    pagination {
      page
      limit
      total
      pages
    }
  }
}
```

## Webhooks

### Job Application Webhook
When a user applies to a job, a webhook is sent to the employer's registered endpoint.

```json
{
  "event": "job.application.created",
  "timestamp": "2025-01-01T00:00:00Z",
  "data": {
    "applicationId": "uuid",
    "jobId": "uuid",
    "applicantId": "uuid",
    "applicant": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com"
    }
  }
}
```

## Error Handling

### Standard Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The provided data is invalid",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `429` - Rate Limited
- `500` - Internal Server Error

## Rate Limiting

### Limits
- **Authenticated requests**: 1000 requests per hour
- **Public endpoints**: 100 requests per hour
- **File uploads**: 10 uploads per hour

### Headers
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1609459200
```

## Data Models

### User Model
```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'employer' | 'admin';
  profile?: UserProfile;
  createdAt: string;
  updatedAt: string;
}

interface UserProfile {
  bio?: string;
  skills: string[];
  certifications: string[];
  experience?: number;
  location?: string;
  avatarUrl?: string;
}
```

### Job Model
```typescript
interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  skills: string[];
  location: string;
  salary?: number;
  salaryRange?: {
    min: number;
    max: number;
  };
  employerId: string;
  status: 'active' | 'paused' | 'closed';
  createdAt: string;
  updatedAt: string;
}
```

### Application Model
```typescript
interface Application {
  id: string;
  jobId: string;
  applicantId: string;
  coverLetter?: string;
  resumeUrl?: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}
```

## SDK and Libraries

### JavaScript/TypeScript SDK
```bash
npm install @rigger/api-client
```

```javascript
import { RiggerAPIClient } from '@rigger/api-client';

const client = new RiggerAPIClient({
  baseURL: 'https://api.rigger.sxc.codes',
  apiKey: 'your-api-key'
});

// Get jobs
const jobs = await client.jobs.list({
  location: 'New York',
  page: 1,
  limit: 10
});
```

### Python SDK
```bash
pip install rigger-api-client
```

```python
from rigger_api import RiggerClient

client = RiggerClient(
    base_url='https://api.rigger.sxc.codes',
    api_key='your-api-key'
)

# Get jobs
jobs = client.jobs.list(location='New York', page=1, limit=10)
```

## Testing

### Postman Collection
Download our Postman collection: [Rigger API Collection](./postman/rigger-api.collection.json)

### OpenAPI Specification
Our complete API specification is available in OpenAPI 3.0 format: [openapi.yaml](./openapi.yaml)

## Changelog

### v1.2.0 (2025-01-15)
- Added GraphQL endpoints
- Enhanced job search filters
- Improved error responses
- Added webhook support

### v1.1.0 (2025-01-01)
- Added job applications API
- Implemented rate limiting
- Enhanced authentication
- Added user profiles

### v1.0.0 (2024-12-01)
- Initial API release
- Basic CRUD operations
- JWT authentication
- User and job management

---

**API Version**: v1.2.0
**Last Updated**: January 2025
**Maintained By**: Rigger API Team

For API support and questions:
- **Primary**: tiatheone@protonmail.com
- **Technical**: garrett@sxc.codes
- **Documentation**: [https://docs.rigger.sxc.codes](https://docs.rigger.sxc.codes)
