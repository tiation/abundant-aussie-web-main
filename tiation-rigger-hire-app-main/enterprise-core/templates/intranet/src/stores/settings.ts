import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type Language = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'zh'
export type DateFormat = 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD'
export type TimeFormat = '12h' | '24h'

export interface AppSettings {
  language: Language
  dateFormat: DateFormat
  timeFormat: TimeFormat
  notifications: {
    email: boolean
    push: boolean
    desktop: boolean
  }
  accessibility: {
    reducedMotion: boolean
    highContrast: boolean
    largeText: boolean
  }
  dashboard: {
    compactMode: boolean
    showWeather: boolean
    defaultView: 'overview' | 'departments' | 'employees'
  }
}

const DEFAULT_SETTINGS: AppSettings = {
  language: 'en',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
  notifications: {
    email: true,
    push: true,
    desktop: false
  },
  accessibility: {
    reducedMotion: false,
    highContrast: false,
    largeText: false
  },
  dashboard: {
    compactMode: false,
    showWeather: true,
    defaultView: 'overview'
  }
}

export const useSettingsStore = defineStore('settings', () => {
  // State
  const settings = ref<AppSettings>({ ...DEFAULT_SETTINGS })
  const isLoading = ref(false)
  const lastSyncTime = ref<Date | null>(null)

  // Getters
  const currentLanguage = computed(() => settings.value.language)
  const currentDateFormat = computed(() => settings.value.dateFormat)
  const currentTimeFormat = computed(() => settings.value.timeFormat)
  const notificationsEnabled = computed(() => 
    settings.value.notifications.email || 
    settings.value.notifications.push || 
    settings.value.notifications.desktop
  )
  const accessibilityEnabled = computed(() =>
    settings.value.accessibility.reducedMotion ||
    settings.value.accessibility.highContrast ||
    settings.value.accessibility.largeText
  )

  // Actions
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    settings.value = { ...settings.value, ...newSettings }
    saveToStorage()
  }

  const updateLanguage = (language: Language) => {
    settings.value.language = language
    saveToStorage()
    // Trigger language change event for i18n
    document.documentElement.lang = language
  }

  const updateDateFormat = (format: DateFormat) => {
    settings.value.dateFormat = format
    saveToStorage()
  }

  const updateTimeFormat = (format: TimeFormat) => {
    settings.value.timeFormat = format
    saveToStorage()
  }

  const updateNotifications = (notifications: Partial<AppSettings['notifications']>) => {
    settings.value.notifications = { ...settings.value.notifications, ...notifications }
    saveToStorage()
  }

  const updateAccessibility = (accessibility: Partial<AppSettings['accessibility']>) => {
    settings.value.accessibility = { ...settings.value.accessibility, ...accessibility }
    saveToStorage()
    applyAccessibilitySettings()
  }

  const updateDashboard = (dashboard: Partial<AppSettings['dashboard']>) => {
    settings.value.dashboard = { ...settings.value.dashboard, ...dashboard }
    saveToStorage()
  }

  const resetSettings = () => {
    settings.value = { ...DEFAULT_SETTINGS }
    saveToStorage()
    applyAccessibilitySettings()
  }

  const saveToStorage = () => {
    try {
      localStorage.setItem('app_settings', JSON.stringify(settings.value))
      lastSyncTime.value = new Date()
    } catch (error) {
      console.error('Failed to save settings to localStorage:', error)
    }
  }

  const loadFromStorage = () => {
    try {
      const saved = localStorage.getItem('app_settings')
      if (saved) {
        const parsedSettings = JSON.parse(saved)
        // Merge with defaults to handle new settings in app updates
        settings.value = { ...DEFAULT_SETTINGS, ...parsedSettings }
        applyAccessibilitySettings()
        document.documentElement.lang = settings.value.language
        lastSyncTime.value = new Date()
      }
    } catch (error) {
      console.error('Failed to load settings from localStorage:', error)
      settings.value = { ...DEFAULT_SETTINGS }
    }
  }

  const applyAccessibilitySettings = () => {
    const { reducedMotion, highContrast, largeText } = settings.value.accessibility
    
    // Apply reduced motion
    if (reducedMotion) {
      document.documentElement.style.setProperty('--animation-duration', '0s')
      document.documentElement.style.setProperty('--transition-duration', '0s')
    } else {
      document.documentElement.style.removeProperty('--animation-duration')
      document.documentElement.style.removeProperty('--transition-duration')
    }

    // Apply high contrast
    document.documentElement.classList.toggle('high-contrast', highContrast)

    // Apply large text
    document.documentElement.classList.toggle('large-text', largeText)
  }

  // Initialize settings on store creation
  const initializeSettings = () => {
    loadFromStorage()
  }

  // Sync settings with server (placeholder for future implementation)
  const syncWithServer = async () => {
    isLoading.value = true
    try {
      // TODO: Implement server sync in Phase 2
      // const response = await apiService.get('/user/settings')
      // if (response.success) {
      //   settings.value = { ...DEFAULT_SETTINGS, ...response.data }
      //   saveToStorage()
      // }
      await new Promise(resolve => setTimeout(resolve, 500)) // Mock delay
    } catch (error) {
      console.error('Failed to sync settings with server:', error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    settings: computed(() => settings.value),
    isLoading: computed(() => isLoading.value),
    lastSyncTime: computed(() => lastSyncTime.value),
    
    // Getters
    currentLanguage,
    currentDateFormat,
    currentTimeFormat,
    notificationsEnabled,
    accessibilityEnabled,
    
    // Actions
    updateSettings,
    updateLanguage,
    updateDateFormat,
    updateTimeFormat,
    updateNotifications,
    updateAccessibility,
    updateDashboard,
    resetSettings,
    initializeSettings,
    syncWithServer
  }
})
