# Supabase Configuration Guide

This document outlines the Supabase configuration setup across all Rigger ecosystem Capacitor projects.

## Overview

All Capacitor projects in the Rigger ecosystem are configured to use the same Supabase instance with consistent authentication flows while maintaining platform-specific configurations.

## Supabase Instance Details

- **URL**: `https://qzjmwhjjzlsyppstljcw.supabase.co`
- **Project Reference**: `qzjmwhjjzlsyppstljcw`
- **Service Role Key**: Configured in environment variables (see individual project .env files)

## Project Configuration

### Environment Variables

Each project has a `.env` file containing:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://qzjmwhjjzlsyppstljcw.supabase.co
VITE_SUPABASE_ANON_KEY=[service_role_key]

# Application Configuration
VITE_APP_NAME=[Project Name]
VITE_APP_VERSION=1.0.0
VITE_API_BASE_URL=[API Base URL]

# Platform Configuration
VITE_PLATFORM=[android|ios|web]
VITE_CAPACITOR_ENABLED=true

# Development Settings
VITE_NODE_ENV=development
VITE_DEBUG=true
```

### Configured Projects

1. **RiggerConnect-capacitor** (Main Web/PWA)
   - Location: `/Users/tiaastor/Github/tiation-repos/RiggerConnect-capacitor/`
   - Environment: `.env`
   - Service: `src/services/supabase.ts`

2. **RiggerConnect-android**
   - Location: `/Users/tiaastor/Github/tiation-repos/RiggerConnect-android/capacitor/`
   - Environment: `.env`
   - Platform Headers: `X-Client-Platform: android`

3. **RiggerConnect-ios**
   - Location: `/Users/tiaastor/Github/tiation-repos/RiggerConnect-ios/`
   - Environment: `.env`
   - Service: `src/services/supabase.ts`
   - Platform Headers: `X-Client-Platform: ios`

4. **RiggerHub-android**
   - Location: `/Users/tiaastor/Github/tiation-repos/RiggerHub-android/capacitor/`
   - Environment: `.env`
   - Service: `src/services/supabase.ts`
   - Platform Headers: `X-Client-Platform: android`

5. **RiggerHub-ios**
   - Location: `/Users/tiaastor/Github/tiation-repos/RiggerHub-ios/capacitor/`
   - Environment: `.env`
   - Service: `src/services/supabase.ts`
   - Platform Headers: `X-Client-Platform: ios`

## Authentication Flow Alignment

### Shared Configuration
- **Session Persistence**: Enabled across all platforms
- **Auto Token Refresh**: Enabled
- **URL Detection**: Enabled for web-based auth flows

### Platform-Specific Storage
- **Web/PWA**: Uses `localStorage`
- **Mobile (Android/iOS)**: Uses Capacitor's native storage when available
- **Storage Keys**: Platform-specific to prevent conflicts
  - RiggerConnect Android: `riggerconnect-android-auth-token`
  - RiggerConnect iOS: `riggerconnect-ios-auth-token`
  - RiggerHub Android: `riggerhub-android-auth-token`
  - RiggerHub iOS: `riggerhub-ios-auth-token`

### Enhanced Auth Manager

Each project includes an `authStateManager` with consistent methods:

```typescript
export const authStateManager = {
  async getCurrentSession(),
  async signIn(email: string, password: string),
  async signOut(),
  onAuthStateChange(callback)
};
```

## Platform Identification

Each client sends platform-specific headers:

```typescript
headers: {
  'X-Client-Platform': '[android|ios|web]',
  'X-Client-Info': '[App Name] [Platform]'
}
```

## Configuration Fallbacks

The configuration supports multiple fallback mechanisms:

1. `window.APP_CONFIG` (runtime configuration)
2. `import.meta.env.VITE_*` (build-time environment variables)
3. Hardcoded fallbacks (for development)

## Development vs Production

### Development
- Debug mode enabled
- Development environment URLs
- Local storage for web platforms

### Production
- Debug mode disabled
- Production API endpoints
- Secure native storage for mobile platforms

## Troubleshooting

### Common Issues

1. **Authentication not persisting**: Check storage keys and platform configuration
2. **CORS errors**: Verify Supabase URL configuration and domain whitelist
3. **Token refresh failures**: Ensure `autoRefreshToken` is enabled

### Debugging

Enable debug mode by setting:
```env
VITE_DEBUG=true
VITE_NODE_ENV=development
```

## Security Considerations

- Service role keys are stored in environment variables
- Each platform uses isolated storage keys
- Platform identification helps with analytics and debugging
- Session storage is platform-appropriate (native vs web)

## Backend Integration

The existing RiggerConnect backend authentication flow is maintained through:
- Consistent Supabase instance usage
- Shared user database and auth tables
- Platform-specific client identification
- Unified session management across all platforms
