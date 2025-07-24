# Environment Variables Documentation

This document provides a comprehensive guide to all environment variables used in the PosCalls4U platform, including their purpose, default values, and configuration examples.

## Overview

PosCalls4U uses environment variables for configuration to support different deployment environments (development, staging, production) while maintaining security best practices. Variables are loaded from `.env` files and system environment.

## Variable Categories

### Core Application Settings

#### NODE_ENV
- **Purpose**: Defines the application environment
- **Type**: String
- **Default**: `development`
- **Options**: `development`, `staging`, `production`
- **Example**: `NODE_ENV=production`
- **Impact**: Affects logging levels, error handling, and performance optimizations

#### PORT
- **Purpose**: Server port number
- **Type**: Number
- **Default**: `5000`
- **Range**: `1024-65535`
- **Example**: `PORT=5000`
- **Note**: Use ports > 1024 for non-root users

#### APP_NAME
- **Purpose**: Application name for logging and monitoring
- **Type**: String
- **Default**: `PosCalls4U`
- **Example**: `APP_NAME=PosCalls4U`
- **Usage**: Used in logs, email templates, and monitoring

#### APP_VERSION
- **Purpose**: Application version for tracking and deployment
- **Type**: String (Semantic Versioning)
- **Default**: `1.0.0`
- **Example**: `APP_VERSION=1.4.0`
- **Format**: `MAJOR.MINOR.PATCH`

## Security Configuration

### JWT Settings

#### JWT_SECRET
- **Purpose**: Secret key for signing JWT tokens
- **Type**: String
- **Required**: Yes
- **Minimum Length**: 32 characters
- **Example**: `JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters`
- **Security**: Must be cryptographically strong and unique per environment
- **Generation**: `openssl rand -base64 32`

#### JWT_EXPIRES_IN
- **Purpose**: JWT token expiration time
- **Type**: String (Zeit/ms format)
- **Default**: `7d`
- **Examples**: 
  - `1h` (1 hour)
  - `24h` (24 hours)
  - `7d` (7 days)
  - `30d` (30 days)
- **Recommendation**: 7d for development, 1h for high-security production

#### BCRYPT_ROUNDS
- **Purpose**: Number of bcrypt hashing rounds
- **Type**: Number
- **Default**: `12`
- **Range**: `10-15`
- **Example**: `BCRYPT_ROUNDS=12`
- **Performance**: Higher values = more secure but slower

## Database Configuration

### MongoDB Settings

#### MONGODB_URI
- **Purpose**: MongoDB connection string
- **Type**: String (MongoDB URI)
- **Required**: Yes
- **Format**: `mongodb://[username:password@]host[:port]/database[?options]`
- **Examples**:
  ```bash
  # Local MongoDB
  MONGODB_URI=mongodb://localhost:27017/poscalls4u
  
  # MongoDB with authentication
  MONGODB_URI=mongodb://user:password@localhost:27017/poscalls4u
  
  # MongoDB Atlas
  MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/poscalls4u?retryWrites=true&w=majority
  
  # Replica Set
  MONGODB_URI=mongodb://user:password@host1:27017,host2:27017,host3:27017/poscalls4u?replicaSet=rs0
  ```

#### MONGODB_OPTIONS
- **Purpose**: Additional MongoDB connection options as JSON
- **Type**: JSON String
- **Default**: `{}`
- **Example**:
  ```bash
  MONGODB_OPTIONS='{"useUnifiedTopology":true,"maxPoolSize":20,"minPoolSize":5}'
  ```
- **Common Options**:
  - `maxPoolSize`: Maximum connection pool size (default: 100)
  - `minPoolSize`: Minimum connection pool size (default: 0)
  - `maxIdleTimeMS`: Maximum idle time for connections (default: 0)
  - `serverSelectionTimeoutMS`: Server selection timeout (default: 30000)

### Redis Configuration

#### REDIS_URL
- **Purpose**: Redis connection string
- **Type**: String (Redis URI)
- **Required**: No (optional for caching)
- **Format**: `redis://[username:password@]host[:port][/database]`
- **Examples**:
  ```bash
  # Local Redis
  REDIS_URL=redis://localhost:6379
  
  # Redis with password
  REDIS_URL=redis://:password@localhost:6379
  
  # Redis with username and password
  REDIS_URL=redis://username:password@localhost:6379
  
  # Redis Cloud
  REDIS_URL=redis://user:pass@redis-cluster.example.com:6379
  ```

#### REDIS_OPTIONS
- **Purpose**: Additional Redis connection options as JSON
- **Type**: JSON String
- **Default**: `{}`
- **Example**:
  ```bash
  REDIS_OPTIONS='{"maxRetriesPerRequest":3,"retryDelayOnFailover":100}'
  ```

## Client Configuration

#### CLIENT_URL
- **Purpose**: Frontend application URL
- **Type**: String (URL)
- **Required**: Yes
- **Examples**:
  ```bash
  # Development
  CLIENT_URL=http://localhost:3000
  
  # Production
  CLIENT_URL=https://your-domain.com
  ```
- **Usage**: CORS configuration, OAuth callbacks, email links

#### ALLOWED_ORIGINS
- **Purpose**: Comma-separated list of allowed CORS origins
- **Type**: String (comma-separated URLs)
- **Default**: Uses CLIENT_URL if not specified
- **Example**:
  ```bash
  ALLOWED_ORIGINS=https://your-domain.com,https://api.your-domain.com,https://admin.your-domain.com
  ```

## Email Service Configuration

### Core Email Settings

#### EMAIL_SERVICE
- **Purpose**: Email service provider
- **Type**: String
- **Required**: Yes for email functionality
- **Options**: `gmail`, `sendgrid`, `ses`, `smtp`
- **Example**: `EMAIL_SERVICE=gmail`

#### EMAIL_USER
- **Purpose**: Email service username/API key
- **Type**: String
- **Required**: Yes
- **Examples**:
  ```bash
  # Gmail
  EMAIL_USER=your-email@gmail.com
  
  # SendGrid
  EMAIL_USER=apikey
  
  # AWS SES
  EMAIL_USER=AKIAIOSFODNN7EXAMPLE
  ```

#### EMAIL_PASSWORD
- **Purpose**: Email service password/secret
- **Type**: String
- **Required**: Yes
- **Security**: Use app passwords for Gmail, API keys for services
- **Examples**:
  ```bash
  # Gmail App Password
  EMAIL_PASSWORD=abcd-efgh-ijkl-mnop
  
  # SendGrid API Key
  EMAIL_PASSWORD=SG.abcdefg...
  
  # AWS SES Secret Key
  EMAIL_PASSWORD=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
  ```

#### EMAIL_FROM
- **Purpose**: Default sender email address
- **Type**: String (email format)
- **Required**: Yes
- **Format**: `Name <email@domain.com>` or `email@domain.com`
- **Example**: `EMAIL_FROM=PosCalls4U <noreply@your-domain.com>`

#### EMAIL_REPLY_TO
- **Purpose**: Default reply-to email address
- **Type**: String (email format)
- **Required**: No
- **Example**: `EMAIL_REPLY_TO=support@your-domain.com`

### SMTP Configuration (for EMAIL_SERVICE=smtp)

#### EMAIL_HOST
- **Purpose**: SMTP server hostname
- **Type**: String
- **Required**: Yes (when using SMTP)
- **Example**: `EMAIL_HOST=smtp.your-provider.com`

#### EMAIL_PORT
- **Purpose**: SMTP server port
- **Type**: Number
- **Default**: `587`
- **Common Ports**: `25`, `465` (SSL), `587` (TLS)
- **Example**: `EMAIL_PORT=587`

#### EMAIL_SECURE
- **Purpose**: Use SSL/TLS for SMTP
- **Type**: Boolean
- **Default**: `true`
- **Example**: `EMAIL_SECURE=true`

## OAuth Configuration

### Google OAuth

#### GOOGLE_CLIENT_ID
- **Purpose**: Google OAuth client ID
- **Type**: String
- **Required**: No (if social login disabled)
- **Example**: `GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com`
- **Source**: Google Developer Console

#### GOOGLE_CLIENT_SECRET
- **Purpose**: Google OAuth client secret
- **Type**: String
- **Required**: No (if social login disabled)
- **Example**: `GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnop`
- **Security**: Keep confidential

#### GOOGLE_CALLBACK_URL
- **Purpose**: Google OAuth callback URL
- **Type**: String (URL)
- **Format**: `{BASE_URL}/api/auth/google/callback`
- **Examples**:
  ```bash
  # Development
  GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
  
  # Production
  GOOGLE_CALLBACK_URL=https://your-domain.com/api/auth/google/callback
  ```

### Facebook OAuth

#### FACEBOOK_CLIENT_ID
- **Purpose**: Facebook OAuth app ID
- **Type**: String
- **Required**: No (if social login disabled)
- **Example**: `FACEBOOK_CLIENT_ID=1234567890123456`
- **Source**: Facebook Developers

#### FACEBOOK_CLIENT_SECRET
- **Purpose**: Facebook OAuth app secret
- **Type**: String
- **Required**: No (if social login disabled)
- **Example**: `FACEBOOK_CLIENT_SECRET=abcdefghijklmnopqrstuvwxyz123456`
- **Security**: Keep confidential

#### FACEBOOK_CALLBACK_URL
- **Purpose**: Facebook OAuth callback URL
- **Type**: String (URL)
- **Format**: `{BASE_URL}/api/auth/facebook/callback`
- **Examples**:
  ```bash
  # Development
  FACEBOOK_CALLBACK_URL=http://localhost:5000/api/auth/facebook/callback
  
  # Production
  FACEBOOK_CALLBACK_URL=https://your-domain.com/api/auth/facebook/callback
  ```

## Logging Configuration

#### LOG_LEVEL
- **Purpose**: Logging verbosity level
- **Type**: String
- **Default**: `info`
- **Options**: `error`, `warn`, `info`, `http`, `verbose`, `debug`, `silly`
- **Example**: `LOG_LEVEL=info`
- **Production**: Use `info` or `warn`

#### LOG_FILE
- **Purpose**: Log file path
- **Type**: String (file path)
- **Default**: No file logging (console only)
- **Example**: `LOG_FILE=/var/log/poscalls4u/app.log`
- **Note**: Ensure directory exists with proper permissions

#### LOG_MAX_SIZE
- **Purpose**: Maximum log file size before rotation
- **Type**: String (size format)
- **Default**: `20MB`
- **Examples**: `100MB`, `1GB`
- **Example**: `LOG_MAX_SIZE=100MB`

#### LOG_MAX_FILES
- **Purpose**: Maximum number of rotated log files to keep
- **Type**: Number
- **Default**: `5`
- **Example**: `LOG_MAX_FILES=10`

#### ERROR_REPORTING_URL
- **Purpose**: External error reporting service URL
- **Type**: String (URL)
- **Required**: No
- **Example**: `ERROR_REPORTING_URL=https://sentry.io/api/projects/123/store/`
- **Services**: Sentry, Bugsnag, LogRocket

## Performance Settings

### Rate Limiting

#### RATE_LIMIT_WINDOW_MS
- **Purpose**: Rate limiting time window in milliseconds
- **Type**: Number
- **Default**: `900000` (15 minutes)
- **Example**: `RATE_LIMIT_WINDOW_MS=900000`

#### RATE_LIMIT_MAX_REQUESTS
- **Purpose**: Maximum requests per time window
- **Type**: Number
- **Default**: `100`
- **Example**: `RATE_LIMIT_MAX_REQUESTS=100`

### Caching

#### CACHE_TTL
- **Purpose**: Default cache TTL in seconds
- **Type**: Number
- **Default**: `300` (5 minutes)
- **Example**: `CACHE_TTL=300`

#### SESSION_TTL
- **Purpose**: Session TTL in seconds
- **Type**: Number
- **Default**: `604800` (7 days)
- **Example**: `SESSION_TTL=604800`

## Feature Flags

#### ENABLE_SOCIAL_LOGIN
- **Purpose**: Enable/disable social login features
- **Type**: Boolean
- **Default**: `true`
- **Example**: `ENABLE_SOCIAL_LOGIN=true`

#### ENABLE_EMAIL_VERIFICATION
- **Purpose**: Require email verification for new accounts
- **Type**: Boolean
- **Default**: `true`
- **Example**: `ENABLE_EMAIL_VERIFICATION=true`

#### ENABLE_RATE_LIMITING
- **Purpose**: Enable/disable rate limiting
- **Type**: Boolean
- **Default**: `true`
- **Example**: `ENABLE_RATE_LIMITING=true`

#### ENABLE_CACHING
- **Purpose**: Enable/disable Redis caching
- **Type**: Boolean
- **Default**: `true`
- **Example**: `ENABLE_CACHING=true`

#### ENABLE_DEBUG_MODE
- **Purpose**: Enable debug features and verbose logging
- **Type**: Boolean
- **Default**: `false`
- **Example**: `ENABLE_DEBUG_MODE=false`
- **Note**: Should be `false` in production

## External Services

### PBX Integration

#### PBX_HOST
- **Purpose**: PBX server hostname
- **Type**: String
- **Required**: No (if PBX integration disabled)
- **Example**: `PBX_HOST=pbx.your-company.com`

#### PBX_PORT
- **Purpose**: PBX server port
- **Type**: Number
- **Default**: `5060`
- **Example**: `PBX_PORT=5060`

#### PBX_USERNAME
- **Purpose**: PBX authentication username
- **Type**: String
- **Required**: No
- **Example**: `PBX_USERNAME=api-user`

#### PBX_PASSWORD
- **Purpose**: PBX authentication password
- **Type**: String
- **Required**: No
- **Example**: `PBX_PASSWORD=secure-password`
- **Security**: Use strong passwords

#### PBX_PROTOCOL
- **Purpose**: PBX communication protocol
- **Type**: String
- **Default**: `SIP`
- **Options**: `SIP`, `IAX2`, `H323`
- **Example**: `PBX_PROTOCOL=SIP`

## Health Check Configuration

#### HEALTH_CHECK_TIMEOUT
- **Purpose**: Health check timeout in milliseconds
- **Type**: Number
- **Default**: `5000`
- **Example**: `HEALTH_CHECK_TIMEOUT=5000`

#### DB_HEALTH_CHECK_TIMEOUT
- **Purpose**: Database health check timeout in milliseconds
- **Type**: Number
- **Default**: `3000`
- **Example**: `DB_HEALTH_CHECK_TIMEOUT=3000`

#### REDIS_HEALTH_CHECK_TIMEOUT
- **Purpose**: Redis health check timeout in milliseconds
- **Type**: Number
- **Default**: `2000`
- **Example**: `REDIS_HEALTH_CHECK_TIMEOUT=2000`

## Development Settings

#### DEBUG
- **Purpose**: Enable debug output for specific modules
- **Type**: String (comma-separated)
- **Default**: None
- **Examples**:
  ```bash
  # All debug output
  DEBUG=*
  
  # Express debug only
  DEBUG=express:*
  
  # Application debug only
  DEBUG=app:*
  
  # Multiple modules
  DEBUG=express:*,mongoose:*
  ```

#### HOT_RELOAD
- **Purpose**: Enable hot reload in development
- **Type**: Boolean
- **Default**: `true` (development), `false` (production)
- **Example**: `HOT_RELOAD=true`

## Environment-Specific Examples

### Development (.env.development)
```bash
NODE_ENV=development
PORT=5000
DEBUG=app:*

# Database
MONGODB_URI=mongodb://localhost:27017/poscalls4u_dev
REDIS_URL=redis://localhost:6379/0

# Security (less strict for development)
JWT_SECRET=dev-secret-key-not-for-production-use
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=10

# Client
CLIENT_URL=http://localhost:3000

# Email (development - optional)
EMAIL_SERVICE=gmail
EMAIL_USER=dev@your-domain.com
EMAIL_PASSWORD=dev-app-password
EMAIL_FROM=PosCalls4U Dev <dev@your-domain.com>

# Features
ENABLE_DEBUG_MODE=true
ENABLE_RATE_LIMITING=false
LOG_LEVEL=debug
```

### Staging (.env.staging)
```bash
NODE_ENV=staging
PORT=5000

# Database
MONGODB_URI=mongodb+srv://user:pass@staging-cluster.mongodb.net/poscalls4u_staging
REDIS_URL=redis://user:pass@staging-redis.example.com:6379

# Security
JWT_SECRET=staging-super-secret-key-32-chars-min
JWT_EXPIRES_IN=1d
BCRYPT_ROUNDS=12

# Client
CLIENT_URL=https://staging.your-domain.com
ALLOWED_ORIGINS=https://staging.your-domain.com

# Email
EMAIL_SERVICE=sendgrid
EMAIL_USER=apikey
EMAIL_PASSWORD=SG.staging-api-key...
EMAIL_FROM=PosCalls4U Staging <staging@your-domain.com>

# Features
ENABLE_DEBUG_MODE=false
ENABLE_RATE_LIMITING=true
LOG_LEVEL=info
LOG_FILE=/var/log/poscalls4u/staging.log
```

### Production (.env.production)
```bash
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb+srv://prod-user:secure-pass@prod-cluster.mongodb.net/poscalls4u
REDIS_URL=redis://prod-user:secure-pass@prod-redis.example.com:6379

# Security (maximum security)
JWT_SECRET=production-super-strong-secret-minimum-32-characters
JWT_EXPIRES_IN=1h
BCRYPT_ROUNDS=12

# Client
CLIENT_URL=https://your-domain.com
ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com

# Email
EMAIL_SERVICE=sendgrid
EMAIL_USER=apikey
EMAIL_PASSWORD=SG.production-api-key...
EMAIL_FROM=PosCalls4U <noreply@your-domain.com>
EMAIL_REPLY_TO=support@your-domain.com

# OAuth
GOOGLE_CLIENT_ID=prod-google-client-id
GOOGLE_CLIENT_SECRET=prod-google-client-secret
FACEBOOK_CLIENT_ID=prod-facebook-app-id
FACEBOOK_CLIENT_SECRET=prod-facebook-app-secret

# Performance
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CACHE_TTL=300
SESSION_TTL=604800

# Features
ENABLE_DEBUG_MODE=false
ENABLE_RATE_LIMITING=true
ENABLE_CACHING=true
ENABLE_EMAIL_VERIFICATION=true
ENABLE_SOCIAL_LOGIN=true

# Logging
LOG_LEVEL=info
LOG_FILE=/var/log/poscalls4u/app.log
LOG_MAX_SIZE=100MB
LOG_MAX_FILES=10
ERROR_REPORTING_URL=https://sentry.io/api/projects/123/store/

# External Services
PBX_HOST=pbx.your-company.com
PBX_PORT=5060
PBX_USERNAME=api-user
PBX_PASSWORD=secure-pbx-password

# Health Checks
HEALTH_CHECK_TIMEOUT=5000
DB_HEALTH_CHECK_TIMEOUT=3000
REDIS_HEALTH_CHECK_TIMEOUT=2000
```

## Security Best Practices

### Secret Management
1. **Never commit secrets to version control**
2. **Use different secrets for each environment**
3. **Rotate secrets regularly**
4. **Use secure secret management services in production**
5. **Limit access to environment files**

### File Permissions
```bash
# Secure environment file permissions
chmod 600 .env
chown app-user:app-group .env

# Secure environment directory
chmod 700 /etc/poscalls4u
chown app-user:app-group /etc/poscalls4u
```

### Environment Validation
The application validates environment variables on startup and will fail to start if required variables are missing or invalid.

### Troubleshooting

#### Common Issues
1. **Missing required variables**: Check startup logs for validation errors
2. **Invalid MongoDB URI**: Verify connection string format and credentials
3. **OAuth callback mismatch**: Ensure callback URLs match provider configuration
4. **Email authentication failure**: Verify email service credentials
5. **File permission errors**: Check environment file permissions

#### Debug Commands
```bash
# Check if environment variables are loaded
node -e "console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET')"

# Validate MongoDB connection
node -e "
  const mongoose = require('mongoose');
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB error:', err.message));
"

# Test Redis connection
redis-cli -u $REDIS_URL ping
```

---

This documentation provides comprehensive guidance for configuring all aspects of the PosCalls4U platform through environment variables, ensuring secure and flexible deployment across different environments.
