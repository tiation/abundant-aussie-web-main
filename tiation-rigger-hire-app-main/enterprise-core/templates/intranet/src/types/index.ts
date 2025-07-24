// Global type definitions
export interface User {
  id: string
  name: string
  email: string
  department: string
  role: string
  avatar?: string
}

export interface Department {
  id: string
  name: string
  description: string
  managerId: string
  employeeCount: number
}

export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
  confirmPassword: string
  department: string
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
}

export interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface AuthError {
  field?: string
  message: string
}
