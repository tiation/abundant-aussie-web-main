// Base types
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

// API Response types
export interface ApiResponse<T = any> {
  data: T
  message?: string
  error?: string
  success: boolean
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Analytics types
export interface AnalyticsEvent {
  name: string
  properties?: Record<string, any>
  timestamp: Date
  userId?: string
  sessionId?: string
}

// Builder types
export type BuilderFramework = 'html' | 'react' | 'vue' | 'angular'
export type BuilderTheme = 'light' | 'dark' | 'auto'
export type ProjectStatus = 'draft' | 'building' | 'completed' | 'error'
export type PreviewMode = 'desktop' | 'tablet' | 'mobile'

// Chat types
export type MessageRole = 'user' | 'assistant' | 'system'

// Component props
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

// Form types
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox'
  placeholder?: string
  required?: boolean
  options?: { label: string; value: string }[]
  validation?: {
    minLength?: number
    maxLength?: number
    pattern?: RegExp
    custom?: (value: any) => string | boolean
  }
}

// API endpoints
export interface ApiEndpoints {
  auth: {
    login: string
    logout: string
    register: string
    refresh: string
  }
  projects: {
    list: string
    create: string
    get: (id: string) => string
    update: (id: string) => string
    delete: (id: string) => string
  }
  chat: {
    sessions: string
    messages: (sessionId: string) => string
    send: (sessionId: string) => string
  }
  ai: {
    generate: string
    complete: string
  }
}

// Environment variables
export interface EnvironmentConfig {
  NODE_ENV: 'development' | 'production' | 'test'
  NEXT_PUBLIC_SUPABASE_URL: string
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string
  NEXT_PUBLIC_POSTHOG_KEY: string
  NEXT_PUBLIC_POSTHOG_HOST: string
  GOOGLE_AI_API_KEY: string
  NEXTAUTH_URL: string
  NEXTAUTH_SECRET: string
}

// Utility types
export type Nullable<T> = T | null
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

// Error types
export interface AppError {
  code: string
  message: string
  details?: any
  timestamp: Date
}

// Feature flags
export interface FeatureFlags {
  enableAnalytics: boolean
  enableAIChat: boolean
  enableAuthentication: boolean
  enableDarkMode: boolean
  enablePreview: boolean
}

// Configuration
export interface AppConfig {
  name: string
  version: string
  description: string
  author: string
  repository: string
  features: FeatureFlags
  api: {
    baseUrl: string
    timeout: number
    retries: number
  }
  ui: {
    theme: 'light' | 'dark' | 'system'
    animations: boolean
    reducedMotion: boolean
  }
}
