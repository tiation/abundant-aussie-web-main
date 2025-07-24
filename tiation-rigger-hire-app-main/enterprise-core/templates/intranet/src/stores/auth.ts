import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginCredentials, RegisterCredentials, AuthResponse, AuthError } from '../types'
import { apiService } from '../services/api'
import { useLoadingStore } from './loading'

export const useAuthStore = defineStore('auth', () => {
  // Get loading store instance
  const loadingStore = useLoadingStore()
  
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const error = ref<AuthError | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userRole = computed(() => user.value?.role || null)
  const userDepartment = computed(() => user.value?.department || null)
  const isLoading = computed(() => loadingStore.isAuthLoading)

  // Actions
  const setAuthData = (authData: AuthResponse) => {
    user.value = authData.user
    token.value = authData.token
    refreshToken.value = authData.refreshToken
    
    // Persist to localStorage
    localStorage.setItem('auth_token', authData.token)
    localStorage.setItem('refresh_token', authData.refreshToken)
    localStorage.setItem('user_data', JSON.stringify(authData.user))
    
    // Set API token
    apiService.setAuthToken(authData.token)
  }

  const clearAuthData = () => {
    user.value = null
    token.value = null
    refreshToken.value = null
    
    // Clear localStorage
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_data')
    
    // Remove API token
    apiService.removeAuthToken()
  }

  const setError = (authError: AuthError | null) => {
    error.value = authError
  }

  const clearError = () => {
    error.value = null
  }

  // Login action
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    loadingStore.startAuthLoading('Signing in...')
    clearError()
    
    try {
      // For demo purposes, we'll mock the API response
      // Replace this with actual API call: const response = await apiService.post<AuthResponse>('/auth/login', credentials)
      
      const response = await mockLogin(credentials)
      
      if (response.success) {
        setAuthData(response.data)
        return true
      } else {
        setError({ message: response.message })
        return false
      }
    } catch (err: any) {
      setError({ message: err.message || 'Login failed. Please try again.' })
      return false
    } finally {
      loadingStore.stopLoading('auth')
    }
  }

  // Register action
  const register = async (credentials: RegisterCredentials): Promise<boolean> => {
    loadingStore.startAuthLoading('Creating account...')
    clearError()

    try {
      // Validate passwords match
      if (credentials.password !== credentials.confirmPassword) {
        setError({ field: 'confirmPassword', message: 'Passwords do not match' })
        return false
      }

      // For demo purposes, we'll mock the API response
      // Replace this with actual API call: const response = await apiService.post<AuthResponse>('/auth/register', credentials)
      
      const response = await mockRegister(credentials)
      
      if (response.success) {
        setAuthData(response.data)
        return true
      } else {
        setError({ message: response.message })
        return false
      }
    } catch (err: any) {
      setError({ message: err.message || 'Registration failed. Please try again.' })
      return false
    } finally {
      loadingStore.stopLoading('auth')
    }
  }

  // Logout action
  const logout = async () => {
    loadingStore.startAuthLoading('Signing out...')
    
    try {
      // Optional: Call logout endpoint to invalidate token on server
      // await apiService.post('/auth/logout')
      
      clearAuthData()
      clearError()
    } catch (err) {
      console.error('Logout error:', err)
      // Clear local data even if server call fails
      clearAuthData()
    } finally {
      loadingStore.stopLoading('auth')
    }
  }

  // Refresh token action
  const refreshAccessToken = async (): Promise<boolean> => {
    if (!refreshToken.value) return false

    try {
      // For demo purposes, we'll mock the refresh
      // Replace this with actual API call: const response = await apiService.post<AuthResponse>('/auth/refresh', { refreshToken: refreshToken.value })
      
      const response = await mockRefreshToken(refreshToken.value)
      
      if (response.success) {
        setAuthData(response.data)
        return true
      } else {
        clearAuthData()
        return false
      }
    } catch (err) {
      console.error('Token refresh failed:', err)
      clearAuthData()
      return false
    }
  }

  // Initialize auth from localStorage
  const initializeAuth = async () => {
    const savedToken = localStorage.getItem('auth_token')
    const savedRefreshToken = localStorage.getItem('refresh_token')
    const savedUser = localStorage.getItem('user_data')

    if (savedToken && savedRefreshToken && savedUser) {
      try {
        token.value = savedToken
        refreshToken.value = savedRefreshToken
        user.value = JSON.parse(savedUser)
        
        apiService.setAuthToken(savedToken)
        
        // Verify token is still valid by calling /me endpoint
        // For demo purposes, we'll skip this validation
        // const response = await apiService.get<User>('/auth/me')
        // if (!response.success) {
        //   await refreshAccessToken()
        // }
        
      } catch (err) {
        console.error('Auth initialization failed:', err)
        clearAuthData()
      }
    }
  }

  // Check if user has specific role
  const hasRole = (role: string): boolean => {
    return user.value?.role === role
  }

  // Check if user has any of the specified roles
  const hasAnyRole = (roles: string[]): boolean => {
    return user.value ? roles.includes(user.value.role) : false
  }

  return {
    // State
    user: computed(() => user.value),
    token: computed(() => token.value),
    refreshToken: computed(() => refreshToken.value),
    isLoading,
    error: computed(() => error.value),
    
    // Getters
    isAuthenticated,
    userRole,
    userDepartment,
    
    // Actions
    login,
    register,
    logout,
    refreshAccessToken,
    initializeAuth,
    clearError,
    hasRole,
    hasAnyRole,
  }
})

// Mock API functions (replace with actual API calls)
const mockLogin = async (credentials: LoginCredentials): Promise<{ success: boolean; data: AuthResponse; message: string }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Mock validation
  if (credentials.email === 'admin@company.com' && credentials.password === 'password123') {
    return {
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: '1',
          name: 'John Admin',
          email: credentials.email,
          department: 'IT',
          role: 'admin',
          avatar: 'https://ui-avatars.com/api/?name=John+Admin&background=random'
        },
        token: 'mock-jwt-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now()
      }
    }
  } else if (credentials.email === 'user@company.com' && credentials.password === 'password123') {
    return {
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: '2',
          name: 'Jane User',
          email: credentials.email,
          department: 'Marketing',
          role: 'user',
          avatar: 'https://ui-avatars.com/api/?name=Jane+User&background=random'
        },
        token: 'mock-jwt-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now()
      }
    }
  } else {
    return {
      success: false,
      message: 'Invalid email or password',
      data: {} as AuthResponse
    }
  }
}

const mockRegister = async (credentials: RegisterCredentials): Promise<{ success: boolean; data: AuthResponse; message: string }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200))
  
  // Mock email uniqueness check
  if (credentials.email === 'admin@company.com' || credentials.email === 'user@company.com') {
    return {
      success: false,
      message: 'Email already exists',
      data: {} as AuthResponse
    }
  }
  
  return {
    success: true,
    message: 'Registration successful',
    data: {
      user: {
        id: 'new-' + Date.now(),
        name: credentials.name,
        email: credentials.email,
        department: credentials.department,
        role: 'user',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(credentials.name)}&background=random`
      },
      token: 'mock-jwt-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now()
    }
  }
}

const mockRefreshToken = async (_refreshToken: string): Promise<{ success: boolean; data: AuthResponse; message: string }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // For demo, always return success
  return {
    success: true,
    message: 'Token refreshed',
    data: {
      user: {
        id: '1',
        name: 'John Admin',
        email: 'admin@company.com',
        department: 'IT',
        role: 'admin',
        avatar: 'https://ui-avatars.com/api/?name=John+Admin&background=random'
      },
      token: 'mock-jwt-token-refreshed-' + Date.now(),
      refreshToken: 'mock-refresh-token-refreshed-' + Date.now()
    }
  }
}
