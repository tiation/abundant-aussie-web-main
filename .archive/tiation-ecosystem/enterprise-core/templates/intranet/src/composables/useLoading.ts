import { computed } from 'vue'
import { useLoadingStore } from '../stores/loading'
import type { LoadingState } from '../stores/loading'

/**
 * Loading composable for managing application loading states
 * Provides reactive loading state and utilities
 */
export function useLoading() {
  const loadingStore = useLoadingStore()

  // Global loading state
  const isLoading = computed(() => loadingStore.isLoading)
  const loadingCount = computed(() => loadingStore.loadingCount)
  const currentLoadingStates = computed(() => loadingStore.currentLoadingStates)
  const primaryLoading = computed(() => loadingStore.primaryLoading)
  const globalMessage = computed(() => loadingStore.globalMessage)

  // Progress loading
  const hasProgressLoading = computed(() => loadingStore.hasProgressLoading)
  const totalProgress = computed(() => loadingStore.totalProgress)

  // Specific context loading states
  const isAuthLoading = computed(() => loadingStore.isAuthLoading)
  const isDataLoading = computed(() => loadingStore.isDataLoading)
  const isFormLoading = computed(() => loadingStore.isFormLoading)
  const isUploadLoading = computed(() => loadingStore.isUploadLoading)

  // Basic loading actions
  const startLoading = (id: string, options?: Omit<LoadingState, 'id'>) => {
    loadingStore.startLoading(id, options)
  }

  const updateLoading = (id: string, updates: Partial<Omit<LoadingState, 'id'>>) => {
    loadingStore.updateLoading(id, updates)
  }

  const updateProgress = (id: string, progress: number, message?: string) => {
    loadingStore.updateProgress(id, progress, message)
  }

  const stopLoading = (id: string) => {
    loadingStore.stopLoading(id)
  }

  const stopAllLoading = () => {
    loadingStore.stopAllLoading()
  }

  const cancelLoading = (id: string) => {
    loadingStore.cancelLoading(id)
  }

  // Global message management
  const setGlobalMessage = (message: string) => {
    loadingStore.setGlobalMessage(message)
  }

  const clearGlobalMessage = () => {
    loadingStore.clearGlobalMessage()
  }

  // Utility wrapper functions
  const withLoading = <T>(
    id: string,
    asyncFn: () => Promise<T>,
    message?: string
  ): Promise<T> => {
    return loadingStore.withLoading(id, asyncFn, message)
  }

  const withProgressLoading = <T>(
    id: string,
    asyncFn: (updateProgress: (progress: number, message?: string) => void) => Promise<T>,
    initialMessage?: string
  ): Promise<T> => {
    return loadingStore.withProgressLoading(id, asyncFn, initialMessage)
  }

  // Context-specific loading actions
  const startAuthLoading = (message?: string) => {
    loadingStore.startAuthLoading(message)
  }

  const startDataLoading = (message?: string) => {
    loadingStore.startDataLoading(message)
  }

  const startFormLoading = (message?: string) => {
    loadingStore.startFormLoading(message)
  }

  const startUploadLoading = (message?: string) => {
    loadingStore.startUploadLoading(message)
  }

  // Higher-level utility functions
  const withAuthLoading = <T>(asyncFn: () => Promise<T>, message?: string): Promise<T> => {
    return withLoading('auth', asyncFn, message || 'Authenticating...')
  }

  const withDataLoading = <T>(asyncFn: () => Promise<T>, message?: string): Promise<T> => {
    return withLoading('data', asyncFn, message || 'Loading data...')
  }

  const withFormLoading = <T>(asyncFn: () => Promise<T>, message?: string): Promise<T> => {
    return withLoading('form', asyncFn, message || 'Saving...')
  }

  const withUploadProgress = <T>(
    asyncFn: (updateProgress: (progress: number, message?: string) => void) => Promise<T>,
    initialMessage?: string
  ): Promise<T> => {
    return withProgressLoading('upload', asyncFn, initialMessage || 'Uploading...')
  }

  // Utility for creating unique loading IDs
  const createLoadingId = (prefix: string = 'loading') => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  // Check if specific loading ID is active
  const isLoadingActive = (id: string) => {
    return computed(() => currentLoadingStates.value.some(state => state.id === id))
  }

  // Get specific loading state
  const getLoadingState = (id: string) => {
    return computed(() => currentLoadingStates.value.find(state => state.id === id) || null)
  }

  // Multiple loading management
  const startMultipleLoading = (loadingStates: Array<{ id: string } & Omit<LoadingState, 'id'>>) => {
    loadingStates.forEach(state => {
      const { id, ...options } = state
      startLoading(id, options)
    })
  }

  const stopMultipleLoading = (ids: string[]) => {
    ids.forEach(id => stopLoading(id))
  }

  // Loading state helpers for components
  const getLoadingClasses = (type: 'spinner' | 'progress' | 'skeleton' = 'spinner') => {
    const baseClasses = 'transition-opacity duration-200'
    
    switch (type) {
      case 'spinner':
        return `${baseClasses} flex items-center justify-center`
      case 'progress':
        return `${baseClasses} w-full`
      case 'skeleton':
        return `${baseClasses} animate-pulse bg-gray-200 dark:bg-gray-700 rounded`
      default:
        return baseClasses
    }
  }

  return {
    // State
    isLoading,
    loadingCount,
    currentLoadingStates,
    primaryLoading,
    globalMessage,
    
    // Progress state
    hasProgressLoading,
    totalProgress,
    
    // Context-specific states
    isAuthLoading,
    isDataLoading,
    isFormLoading,
    isUploadLoading,
    
    // Basic actions
    startLoading,
    updateLoading,
    updateProgress,
    stopLoading,
    stopAllLoading,
    cancelLoading,
    
    // Global message actions
    setGlobalMessage,
    clearGlobalMessage,
    
    // Utility wrappers
    withLoading,
    withProgressLoading,
    
    // Context-specific actions
    startAuthLoading,
    startDataLoading,
    startFormLoading,
    startUploadLoading,
    
    // Higher-level utilities
    withAuthLoading,
    withDataLoading,
    withFormLoading,
    withUploadProgress,
    
    // Helpers
    createLoadingId,
    isLoadingActive,
    getLoadingState,
    startMultipleLoading,
    stopMultipleLoading,
    getLoadingClasses
  }
}
