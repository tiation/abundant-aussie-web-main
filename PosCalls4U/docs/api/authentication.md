# Authentication API Documentation

This document covers the authentication endpoints for PosCalls4U, including password reset functionality and social login options.

## Base URL

```
http://localhost:5000/api/auth
```

## Authentication Flow

All authenticated endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### User Registration

**POST** `/register`

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "agent" // optional: "admin", "supervisor", "agent" (default: "agent")
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully. Please check your email to verify your account.",
  "data": {
    "user": {
      "id": "60f7b3c4e3b3a520b4f1b2e1",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "agent",
      "isEmailVerified": false
    }
  }
}
```

### User Login

**POST** `/login`

Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "60f7b3c4e3b3a520b4f1b2e1",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "agent",
      "isEmailVerified": true,
      "lastLogin": "2024-07-24T11:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Logout

**POST** `/logout`

Logout from current session.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### Logout All Devices

**POST** `/logout-all`

Logout from all devices/sessions.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out from all devices successfully"
}
```

## Password Reset Flow

### Request Password Reset

**POST** `/forgot-password`

Request a password reset email.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset link has been sent to your email."
}
```

**Features:**
- Secure JWT token with 1-hour expiration
- Professional HTML email template
- Security warnings and instructions
- Rate limiting protection

### Reset Password

**POST** `/reset-password`

Reset password using the token from email.

**Request Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "password": "newSecurePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password has been reset successfully. Please login with your new password."
}
```

**Security Features:**
- Token validation with expiration check
- Automatic logout from all devices
- Login attempt counter reset
- Secure password hashing

## Email Verification

### Verify Email

**POST** `/verify-email?token=<verification-token>`

Verify email address using token from registration email.

**Query Parameters:**
- `token`: Email verification token

**Response:**
```json
{
  "success": true,
  "message": "Email verified successfully. Welcome to PosCalls4U!",
  "data": {
    "user": {
      "id": "60f7b3c4e3b3a520b4f1b2e1",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "agent",
      "isEmailVerified": true
    }
  }
}
```

### Resend Email Verification

**POST** `/resend-verification`

Resend email verification link.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Verification email has been sent."
}
```

## Social Login Integration

### Google OAuth

**GET** `/google`

Initiate Google OAuth login flow.

**Usage:**
Redirect users to this endpoint to start Google authentication:
```
http://localhost:5000/api/auth/google
```

**Flow:**
1. User clicks "Login with Google" button
2. Frontend redirects to `/api/auth/google`
3. User completes Google authentication
4. Google redirects to `/api/auth/google/callback`
5. Server processes authentication and redirects to frontend with token

**Callback URL:** `/google/callback`

### Facebook OAuth

**GET** `/facebook`

Initiate Facebook OAuth login flow.

**Usage:**
Redirect users to this endpoint to start Facebook authentication:
```
http://localhost:5000/api/auth/facebook
```

**Flow:**
1. User clicks "Login with Facebook" button
2. Frontend redirects to `/api/auth/facebook`
3. User completes Facebook authentication
4. Facebook redirects to `/api/auth/facebook/callback`
5. Server processes authentication and redirects to frontend with token

**Callback URL:** `/facebook/callback`

### Social Login Success

After successful social authentication, users are redirected to:
```
http://localhost:3000/auth/callback?token=<jwt-token>
```

The frontend should extract the token from the URL and store it for API requests.

### Social Login Failure

On authentication failure, users are redirected to:
```
http://localhost:3000/login?error=social_login_failed
```

## User Profile

### Get Profile

**GET** `/profile`

Get current user profile information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "60f7b3c4e3b3a520b4f1b2e1",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "agent",
      "isEmailVerified": true,
      "socialProviders": ["google"],
      "lastLogin": "2024-07-24T11:30:00.000Z",
      "createdAt": "2024-07-20T10:00:00.000Z"
    }
  }
}
```

## Error Responses

All endpoints return standardized error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created (registration)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid credentials)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (user not found)
- `423` - Locked (account locked due to failed attempts)
- `429` - Too Many Requests (rate limiting)
- `500` - Internal Server Error

## Security Features

### Account Protection
- Account lockout after 5 failed login attempts
- 2-hour lockout duration
- Automatic unlock after lockout period
- Password reset clears lockout status

### Token Security
- JWT tokens with configurable expiration
- Token blacklisting on logout
- Secure token generation and validation
- Multi-device session management

### Password Security
- Minimum 8 character requirement
- Bcrypt hashing with 12 salt rounds
- Password reset tokens expire in 1 hour
- Secure password validation

### Email Security
- Email verification required for new accounts
- Professional HTML email templates
- Secure token-based verification
- Rate limiting on email sending

### Social Login Security
- OAuth 2.0 standard compliance
- Secure callback URL handling
- Account linking for existing users
- Automatic email verification for social accounts

## Environment Configuration

Required environment variables:

```bash
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=PosCalls4U <noreply@poscalls4u.com>

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Facebook OAuth
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret
FACEBOOK_CALLBACK_URL=http://localhost:5000/api/auth/facebook/callback

# Client Configuration
CLIENT_URL=http://localhost:3000
```

## Testing

Use the provided test endpoints to verify functionality:

```bash
# Health check
curl http://localhost:5000/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Implementation Notes

- All password reset and email verification tokens expire automatically
- Social login automatically creates accounts if they don't exist
- Email verification is required for security
- Rate limiting prevents abuse of authentication endpoints
- All sensitive operations are logged for security monitoring
- CORS is configured to allow frontend communication
