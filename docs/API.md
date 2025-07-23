# API Documentation - Abundant Aussie Web

This document provides comprehensive information about the API endpoints and integration patterns for the Abundant Aussie Web platform.

## Base URL

```
Production: https://api.abundant-aussie.tiation.net
Staging: https://staging-api.abundant-aussie.tiation.net
Development: http://localhost:3000
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Authentication Endpoints

#### POST /auth/login
Login with credentials.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "12345",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe",
  "organization": "ChaseWhiteRabbit NGO"
}
```

#### POST /auth/refresh
Refresh an expired JWT token.

**Request Body:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

## Core API Endpoints

### User Management

#### GET /api/users/profile
Get current user profile information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "12345",
  "email": "user@example.com",
  "name": "John Doe",
  "organization": "ChaseWhiteRabbit NGO",
  "role": "user",
  "preferences": {
    "theme": "light",
    "notifications": true
  },
  "createdAt": "2025-01-01T00:00:00Z",
  "lastLoginAt": "2025-07-23T12:00:00Z"
}
```

#### PUT /api/users/profile
Update user profile information.

**Request Body:**
```json
{
  "name": "Jane Doe",
  "preferences": {
    "theme": "dark",
    "notifications": false
  }
}
```

### Analytics & Metrics

#### GET /api/analytics/dashboard
Get dashboard analytics data.

**Query Parameters:**
- `period` (optional): `7d`, `30d`, `90d`, `1y` (default: `30d`)
- `metrics` (optional): comma-separated list of metrics to include

**Response:**
```json
{
  "period": "30d",
  "summary": {
    "totalUsers": 1250,
    "activeUsers": 892,
    "engagement": 78.5,
    "growth": 12.3
  },
  "chartData": [
    {
      "date": "2025-07-01",
      "users": 45,
      "engagement": 76.2
    }
  ],
  "topPages": [
    {
      "path": "/dashboard",
      "views": 5420,
      "uniqueVisitors": 1230
    }
  ]
}
```

#### GET /api/analytics/numbers
Get detailed numerical analytics.

**Response:**
```json
{
  "kpis": {
    "totalImpact": 25000,
    "communitiesReached": 150,
    "sustainabilityScore": 85.7,
    "ethicalRating": 92.3
  },
  "trends": {
    "userGrowth": 15.2,
    "engagementGrowth": 8.7,
    "retentionRate": 89.4
  },
  "realTimeMetrics": {
    "activeNow": 23,
    "todaySignups": 5,
    "currentLoad": 67.2
  }
}
```

### Content Management

#### GET /api/content/pages
Get page content and metadata.

**Query Parameters:**
- `page` (required): Page identifier (`home`, `learn-more`, `contact`, etc.)
- `version` (optional): Content version (default: `latest`)

**Response:**
```json
{
  "page": "learn-more",
  "version": "1.2.0",
  "content": {
    "title": "Learn More About Our Mission",
    "sections": [
      {
        "id": "mission",
        "type": "text",
        "content": "Our mission is to empower communities...",
        "metadata": {
          "lastUpdated": "2025-07-20T10:00:00Z",
          "author": "ChaseWhiteRabbit NGO"
        }
      }
    ]
  },
  "seo": {
    "title": "Learn More | Abundant Aussie Web",
    "description": "Discover how our platform empowers communities...",
    "keywords": ["community", "empowerment", "technology"]
  }
}
```

### Health & Monitoring

#### GET /health
Application health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-07-23T12:00:00Z",
  "version": "1.0.0",
  "services": {
    "database": "healthy",
    "cache": "healthy",
    "external_apis": "healthy"
  },
  "metrics": {
    "uptime": 2592000,
    "memory_usage": 67.2,
    "cpu_usage": 23.5
  }
}
```

#### GET /api/system/status
Detailed system status for administrators.

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "environment": "production",
  "deployment": {
    "version": "1.0.0",
    "buildId": "abc123",
    "deployedAt": "2025-07-23T10:00:00Z"
  },
  "infrastructure": {
    "server": "docker.sxc.codes",
    "database": "supabase.sxc.codes",
    "monitoring": "grafana.sxc.codes"
  },
  "performance": {
    "averageResponseTime": 245,
    "requestsPerMinute": 150,
    "errorRate": 0.02
  }
}
```

## Error Handling

The API uses standard HTTP status codes and returns errors in a consistent format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The provided email address is invalid",
    "details": {
      "field": "email",
      "value": "invalid-email"
    }
  },
  "timestamp": "2025-07-23T12:00:00Z",
  "requestId": "req_123456789"
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

## Rate Limiting

API endpoints are rate-limited to ensure fair usage:

- **Authentication endpoints**: 5 requests per minute per IP
- **Standard endpoints**: 100 requests per minute per user
- **Analytics endpoints**: 50 requests per minute per user
- **Admin endpoints**: 200 requests per minute per admin user

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 85
X-RateLimit-Reset: 1627847100
```

## WebSocket Events

Real-time features are provided via WebSocket connections:

### Connection
```javascript
const ws = new WebSocket('wss://api.abundant-aussie.tiation.net/ws');
```

### Events

#### User Activity
```json
{
  "type": "user_activity",
  "data": {
    "userId": "12345",
    "action": "page_view",
    "page": "/dashboard",
    "timestamp": "2025-07-23T12:00:00Z"
  }
}
```

#### System Notifications
```json
{
  "type": "system_notification",
  "data": {
    "level": "info",
    "message": "System maintenance scheduled for tonight",
    "timestamp": "2025-07-23T12:00:00Z"
  }
}
```

## SDKs and Libraries

### JavaScript/TypeScript
```bash
npm install @abundant-aussie/api-client
```

```javascript
import { AbundantAussieAPI } from '@abundant-aussie/api-client';

const api = new AbundantAussieAPI({
  baseURL: 'https://api.abundant-aussie.tiation.net',
  token: 'your-jwt-token'
});

// Get analytics data
const analytics = await api.analytics.getDashboard({ period: '30d' });
```

### Python
```bash
pip install abundant-aussie-api
```

```python
from abundant_aussie import API

api = API(
    base_url='https://api.abundant-aussie.tiation.net',
    token='your-jwt-token'
)

# Get user profile
profile = api.users.get_profile()
```

## Support & Contact

- **Technical Support**: [GitHub Issues](https://github.com/tiation/abundant-aussie-web-main/issues)  
- **API Questions**: support@chasewhiterabbit.org
- **Tiation Team**: tiatheone@protonmail.com
- **Documentation**: This guide is maintained by the Tiation team

## Changelog

### v1.0.0 (2025-07-23)
- Initial API release
- Authentication and user management
- Analytics and metrics endpoints
- Content management system
- Health monitoring endpoints
- WebSocket real-time features

---

*This API documentation is maintained by [Tiation](https://github.com/tiation-repos) in partnership with [ChaseWhiteRabbit NGO](https://github.com/ChaseWhiteRabbit-repos).*
