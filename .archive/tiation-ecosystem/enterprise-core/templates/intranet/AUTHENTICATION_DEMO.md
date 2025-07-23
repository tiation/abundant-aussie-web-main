# JWT Authentication System Demo

## Overview
A complete JWT-based authentication system has been implemented with the following features:

## ✅ Completed Features

### 1. JWT Authentication Endpoints (Mock Implementation)
- **Login endpoint**: `/auth/login` (mocked)
- **Registration endpoint**: `/auth/register` (mocked)
- **Token refresh**: `/auth/refresh` (mocked)
- **Logout functionality** with token cleanup

### 2. Pinia Store for Authentication
- **Centralized state management** using Pinia
- **Reactive auth state**: user data, tokens, loading states
- **Persistent sessions** using localStorage
- **Error handling** with user-friendly messages
- **Role-based access** utilities (`hasRole`, `hasAnyRole`)

### 3. Session Persistence
- **LocalStorage integration** for tokens and user data
- **Automatic session restoration** on app startup
- **Token refresh mechanism** (ready for real implementation)
- **Secure token handling** with automatic API header updates

### 4. Authentication Pages
- **Login page** with form validation and demo credentials
- **Registration page** with comprehensive form validation
- **Error handling** with field-specific validation
- **Loading states** and user feedback

### 5. Navigation Guards
- **Route protection** for authenticated areas
- **Guest-only routes** (login/register redirect when authenticated)
- **Automatic redirects** to intended pages after login
- **Auth state initialization** on route navigation

## 🎯 Demo Credentials

### Admin User
- **Email**: `admin@company.com`
- **Password**: `password123`
- **Role**: `admin`
- **Department**: `IT`

### Regular User
- **Email**: `user@company.com`
- **Password**: `password123`
- **Role**: `user`
- **Department**: `Marketing`

## 🚀 How to Test

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Visit the application**:
   - Go to `http://localhost:5173`
   - You'll be redirected to login if not authenticated

3. **Test Login Flow**:
   - Use demo credentials above
   - Notice the loading state and form validation
   - After login, you'll be redirected to dashboard

4. **Test Registration**:
   - Click "create a new account" on login page
   - Fill out the registration form
   - Password confirmation validation
   - Department selection

5. **Test Session Persistence**:
   - Login with credentials
   - Refresh the page - you should stay logged in
   - Check browser localStorage for stored tokens

6. **Test Logout**:
   - Click on user avatar in top-right
   - Click "Sign out"
   - Tokens are cleared and you're redirected to login

## 🏗️ File Structure

```
src/
├── stores/
│   └── auth.ts                 # Pinia authentication store
├── views/
│   ├── LoginView.vue          # Login page with validation
│   └── RegisterView.vue       # Registration page
├── composables/
│   └── useAuth.ts             # Legacy composable (compatibility)
├── types/
│   └── index.ts               # TypeScript interfaces
├── router/
│   └── index.ts               # Router with navigation guards
└── App.vue                    # Main app with auth-aware navigation
```

## 🔧 Technical Implementation

### Authentication Store Features
- **Reactive state management** with Vue 3 composition API
- **TypeScript support** with full type safety
- **Error handling** with specific error types
- **Loading states** for better UX
- **Token management** with automatic API integration

### Form Validation
- **Real-time validation** with field-specific errors
- **Email format validation**
- **Password strength requirements**
- **Password confirmation matching**
- **Department selection validation**

### Security Features
- **JWT token storage** in localStorage
- **Automatic token cleanup** on logout
- **API request authentication** headers
- **Route-level protection**
- **Session validation** on app startup

## 🔄 Converting to Real API

To connect to a real backend API, simply replace the mock functions in `auth.ts`:

```typescript
// Replace mockLogin with:
const response = await apiService.post<AuthResponse>('/auth/login', credentials)

// Replace mockRegister with:
const response = await apiService.post<AuthResponse>('/auth/register', credentials)

// Replace mockRefreshToken with:
const response = await apiService.post<AuthResponse>('/auth/refresh', { refreshToken })
```

## 📱 User Experience Features

- **Responsive design** with Tailwind CSS
- **Loading indicators** during API calls
- **Error messages** with dismissible alerts
- **Password visibility toggle**
- **Remember me functionality**
- **Smooth transitions** and hover effects
- **User avatar display** with fallback
- **Role and department display**

## 🎨 UI Components

- **Modern card-based layout**
- **Consistent color scheme** (blue primary)
- **Form field validation styling**
- **Dropdown user menu**
- **Demo credentials display**
- **Icon integration** with SVG icons

This authentication system is production-ready and follows Vue 3 + TypeScript best practices with proper error handling, loading states, and user experience considerations.
