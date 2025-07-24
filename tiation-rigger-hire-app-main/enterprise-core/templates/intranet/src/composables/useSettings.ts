import { computed } from 'vue'
import { useSettingsStore } from '../stores/settings'
import type { Language, DateFormat, TimeFormat, AppSettings } from '../stores/settings'

/**
 * Settings composable for managing application preferences
 * Provides reactive settings state and actions
 */
export function useSettings() {
  const settingsStore = useSettingsStore()

  // Reactive settings state
  const settings = computed(() => settingsStore.settings)
  const isLoading = computed(() => settingsStore.isLoading)
  const lastSyncTime = computed(() => settingsStore.lastSyncTime)

  // Individual setting getters
  const language = computed(() => settingsStore.currentLanguage)
  const dateFormat = computed(() => settingsStore.currentDateFormat)
  const timeFormat = computed(() => settingsStore.currentTimeFormat)
  const notificationsEnabled = computed(() => settingsStore.notificationsEnabled)
  const accessibilityEnabled = computed(() => settingsStore.accessibilityEnabled)

  // Settings management actions
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    settingsStore.updateSettings(newSettings)
  }

  const updateLanguage = (newLanguage: Language) => {
    settingsStore.updateLanguage(newLanguage)
  }

  const updateDateFormat = (format: DateFormat) => {
    settingsStore.updateDateFormat(format)
  }

  const updateTimeFormat = (format: TimeFormat) => {
    settingsStore.updateTimeFormat(format)
  }

  const updateNotifications = (notifications: Partial<AppSettings['notifications']>) => {
    settingsStore.updateNotifications(notifications)
  }

  const updateAccessibility = (accessibility: Partial<AppSettings['accessibility']>) => {
    settingsStore.updateAccessibility(accessibility)
  }

  const updateDashboard = (dashboard: Partial<AppSettings['dashboard']>) => {
    settingsStore.updateDashboard(dashboard)
  }

  const resetSettings = () => {
    settingsStore.resetSettings()
  }

  const initializeSettings = () => {
    settingsStore.initializeSettings()
  }

  const syncWithServer = () => {
    return settingsStore.syncWithServer()
  }

  // Utility functions for formatting
  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date
    const format = dateFormat.value

    switch (format) {
      case 'MM/DD/YYYY':
        return d.toLocaleDateString('en-US')
      case 'DD/MM/YYYY':
        return d.toLocaleDateString('en-GB')
      case 'YYYY-MM-DD':
        return d.toISOString().split('T')[0]
      default:
        return d.toLocaleDateString()
    }
  }

  const formatTime = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date
    const format = timeFormat.value

    return d.toLocaleTimeString(language.value, {
      hour12: format === '12h',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  const formatDateTime = (date: Date | string) => {
    return `${formatDate(date)} ${formatTime(date)}`
  }

  // Language utilities
  const getLanguageLabel = (lang: Language): string => {
    const labels: Record<Language, string> = {
      en: 'English',
      es: 'Español',
      fr: 'Français',
      de: 'Deutsch',
      ja: '日本語',
      zh: '中文'
    }
    return labels[lang] || lang
  }

  const availableLanguages = computed(() => [
    { code: 'en' as Language, label: 'English', flag: '🇺🇸' },
    { code: 'es' as Language, label: 'Español', flag: '🇪🇸' },
    { code: 'fr' as Language, label: 'Français', flag: '🇫🇷' },
    { code: 'de' as Language, label: 'Deutsch', flag: '🇩🇪' },
    { code: 'ja' as Language, label: '日本語', flag: '🇯🇵' },
    { code: 'zh' as Language, label: '中文', flag: '🇨🇳' }
  ])

  // Date format utilities
  const availableDateFormats = computed(() => [
    { format: 'MM/DD/YYYY' as DateFormat, label: 'MM/DD/YYYY', example: '12/31/2023' },
    { format: 'DD/MM/YYYY' as DateFormat, label: 'DD/MM/YYYY', example: '31/12/2023' },
    { format: 'YYYY-MM-DD' as DateFormat, label: 'YYYY-MM-DD', example: '2023-12-31' }
  ])

  // Time format utilities
  const availableTimeFormats = computed(() => [
    { format: '12h' as TimeFormat, label: '12 Hour', example: '11:30 PM' },
    { format: '24h' as TimeFormat, label: '24 Hour', example: '23:30' }
  ])

  // Accessibility helpers
  const toggleReducedMotion = () => {
    updateAccessibility({
      reducedMotion: !settings.value.accessibility.reducedMotion
    })
  }

  const toggleHighContrast = () => {
    updateAccessibility({
      highContrast: !settings.value.accessibility.highContrast
    })
  }

  const toggleLargeText = () => {
    updateAccessibility({
      largeText: !settings.value.accessibility.largeText
    })
  }

  // Notification helpers
  const toggleEmailNotifications = () => {
    updateNotifications({
      email: !settings.value.notifications.email
    })
  }

  const togglePushNotifications = () => {
    updateNotifications({
      push: !settings.value.notifications.push
    })
  }

  const toggleDesktopNotifications = () => {
    updateNotifications({
      desktop: !settings.value.notifications.desktop
    })
  }

  return {
    // State
    settings,
    isLoading,
    lastSyncTime,
    
    // Individual settings
    language,
    dateFormat,
    timeFormat,
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
    syncWithServer,
    
    // Utilities
    formatDate,
    formatTime,
    formatDateTime,
    getLanguageLabel,
    
    // Options
    availableLanguages,
    availableDateFormats,
    availableTimeFormats,
    
    // Toggle helpers
    toggleReducedMotion,
    toggleHighContrast,
    toggleLargeText,
    toggleEmailNotifications,
    togglePushNotifications,
    toggleDesktopNotifications
  }
}
