import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface LoadingState {
  id: string
  message?: string
  progress?: number // 0-100 for progress bars
  type?: 'spinner' | 'progress' | 'skeleton'
  cancelable?: boolean
  onCancel?: () => void
}

export const useLoadingStore = defineStore('loading', () => {
  // State
  const activeLoading = ref<Map<string, LoadingState>>(new Map())
  const globalMessage = ref<string>('')

  // Getters
  const isLoading = computed(() => activeLoading.value.size > 0)
  const loadingCount = computed(() => activeLoading.value.size)
  
  const currentLoadingStates = computed(() => Array.from(activeLoading.value.values()))
  
  const primaryLoading = computed(() => {
    if (activeLoading.value.size === 0) return null
    // Return the first loading state as primary
    return Array.from(activeLoading.value.values())[0]
  })

  const hasProgressLoading = computed(() => 
    Array.from(activeLoading.value.values()).some(state => state.progress !== undefined)
  )

  const totalProgress = computed(() => {
    const progressStates = Array.from(activeLoading.value.values())
      .filter(state => state.progress !== undefined)
    
    if (progressStates.length === 0) return 0
    
    const total = progressStates.reduce((sum, state) => sum + (state.progress || 0), 0)
    return Math.round(total / progressStates.length)
  })

  // Actions
  const startLoading = (
    id: string, 
    options: Omit<LoadingState, 'id'> = {}
  ) => {
    const loadingState: LoadingState = {
      id,
      message: options.message || 'Loading...',
      progress: options.progress,
      type: options.type || 'spinner',
      cancelable: options.cancelable || false,
      onCancel: options.onCancel
    }
    
    activeLoading.value.set(id, loadingState)
  }

  const updateLoading = (
    id: string,
    updates: Partial<Omit<LoadingState, 'id'>>
  ) => {
    const existing = activeLoading.value.get(id)
    if (existing) {
      activeLoading.value.set(id, { ...existing, ...updates })
    }
  }

  const updateProgress = (id: string, progress: number, message?: string) => {
    const updates: Partial<LoadingState> = { progress: Math.max(0, Math.min(100, progress)) }
    if (message) updates.message = message
    updateLoading(id, updates)
  }

  const stopLoading = (id: string) => {
    activeLoading.value.delete(id)
  }

  const stopAllLoading = () => {
    activeLoading.value.clear()
    globalMessage.value = ''
  }

  const setGlobalMessage = (message: string) => {
    globalMessage.value = message
  }

  const clearGlobalMessage = () => {
    globalMessage.value = ''
  }

  // Utility functions for common loading patterns
  const withLoading = async <T>(
    id: string,
    asyncFn: () => Promise<T>,
    message?: string
  ): Promise<T> => {
    startLoading(id, { message })
    try {
      return await asyncFn()
    } finally {
      stopLoading(id)
    }
  }

  const withProgressLoading = async <T>(
    id: string,
    asyncFn: (updateProgress: (progress: number, message?: string) => void) => Promise<T>,
    initialMessage?: string
  ): Promise<T> => {
    startLoading(id, { 
      message: initialMessage || 'Loading...', 
      progress: 0, 
      type: 'progress' 
    })
    
    try {
      return await asyncFn((progress, message) => updateProgress(id, progress, message))
    } finally {
      stopLoading(id)
    }
  }

  const cancelLoading = (id: string) => {
    const loadingState = activeLoading.value.get(id)
    if (loadingState?.cancelable && loadingState.onCancel) {
      loadingState.onCancel()
    }
    stopLoading(id)
  }

  // Specific loading contexts for the application
  const startAuthLoading = (message = 'Authenticating...') => {
    startLoading('auth', { message, type: 'spinner' })
  }

  const startDataLoading = (message = 'Loading data...') => {
    startLoading('data', { message, type: 'skeleton' })
  }

  const startFormLoading = (message = 'Saving...') => {
    startLoading('form', { message, type: 'spinner' })
  }

  const startUploadLoading = (message = 'Uploading...') => {
    startLoading('upload', { 
      message, 
      progress: 0, 
      type: 'progress',
      cancelable: true 
    })
  }

  const isAuthLoading = computed(() => activeLoading.value.has('auth'))
  const isDataLoading = computed(() => activeLoading.value.has('data'))
  const isFormLoading = computed(() => activeLoading.value.has('form'))
  const isUploadLoading = computed(() => activeLoading.value.has('upload'))

  return {
    // State
    globalMessage: computed(() => globalMessage.value),
    
    // Getters
    isLoading,
    loadingCount,
    currentLoadingStates,
    primaryLoading,
    hasProgressLoading,
    totalProgress,
    
    // Specific loading states
    isAuthLoading,
    isDataLoading,
    isFormLoading,
    isUploadLoading,
    
    // Actions
    startLoading,
    updateLoading,
    updateProgress,
    stopLoading,
    stopAllLoading,
    setGlobalMessage,
    clearGlobalMessage,
    cancelLoading,
    
    // Utility functions
    withLoading,
    withProgressLoading,
    
    // Context-specific actions
    startAuthLoading,
    startDataLoading,
    startFormLoading,
    startUploadLoading
  }
})
