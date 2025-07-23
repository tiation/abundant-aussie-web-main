import { computed } from 'vue'
import { useThemeStore } from '../stores/theme'
import type { ThemeMode } from '../stores/theme'

/**
 * Theme composable for managing application theme
 * Provides reactive theme state and actions
 */
export function useTheme() {
  const themeStore = useThemeStore()

  // Reactive theme state
  const mode = computed(() => themeStore.mode)
  const isDark = computed(() => themeStore.isDark)
  const currentTheme = computed(() => themeStore.currentTheme)

  // Theme management actions
  const setTheme = (newMode: ThemeMode) => {
    themeStore.setTheme(newMode)
  }

  const toggleTheme = () => {
    themeStore.toggleTheme()
  }

  const initializeTheme = () => {
    themeStore.initializeTheme()
  }

  // Utility functions
  const isLightMode = computed(() => currentTheme.value === 'light')
  const isDarkMode = computed(() => currentTheme.value === 'dark')
  const isSystemMode = computed(() => mode.value === 'system')

  // Theme-specific classes for conditional styling
  const themeClasses = computed(() => ({
    'theme-light': isLightMode.value,
    'theme-dark': isDarkMode.value,
    'theme-system': isSystemMode.value
  }))

  // Get theme-appropriate colors
  const getThemeColor = (lightColor: string, darkColor: string) => {
    return isDark.value ? darkColor : lightColor
  }

  // Common theme-aware utilities
  const themeUtils = {
    // Card background colors
    cardBg: computed(() => 
      getThemeColor('bg-white', 'bg-gray-800')
    ),
    
    // Text colors
    textPrimary: computed(() => 
      getThemeColor('text-gray-900', 'text-gray-100')
    ),
    
    textSecondary: computed(() => 
      getThemeColor('text-gray-600', 'text-gray-400')
    ),
    
    // Border colors
    border: computed(() => 
      getThemeColor('border-gray-200', 'border-gray-700')
    ),
    
    // Hover states
    hover: computed(() => 
      getThemeColor('hover:bg-gray-50', 'hover:bg-gray-700')
    ),
    
    // Focus states
    focus: computed(() => 
      'focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
    ),
    
    // Button variants
    buttonPrimary: computed(() => 
      'bg-blue-600 hover:bg-blue-700 text-white'
    ),
    
    buttonSecondary: computed(() => 
      getThemeColor(
        'bg-gray-200 hover:bg-gray-300 text-gray-900',
        'bg-gray-700 hover:bg-gray-600 text-gray-100'
      )
    )
  }

  return {
    // State
    mode,
    isDark,
    currentTheme,
    
    // Computed helpers
    isLightMode,
    isDarkMode,
    isSystemMode,
    themeClasses,
    
    // Actions
    setTheme,
    toggleTheme,
    initializeTheme,
    
    // Utilities
    getThemeColor,
    themeUtils
  }
}
