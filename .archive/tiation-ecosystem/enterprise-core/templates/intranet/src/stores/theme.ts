import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export type ThemeMode = 'light' | 'dark' | 'system'

export const useThemeStore = defineStore('theme', () => {
  const mode = ref<ThemeMode>('system')
  const isDark = ref(false)

  // System preference detection
  const prefersDark = computed(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  // Computed theme state
  const currentTheme = computed(() => {
    if (mode.value === 'system') {
      return prefersDark.value ? 'dark' : 'light'
    }
    return mode.value
  })

  // Initialize theme from localStorage
  const initializeTheme = () => {
    const savedMode = localStorage.getItem('theme-mode') as ThemeMode
    if (savedMode && ['light', 'dark', 'system'].includes(savedMode)) {
      mode.value = savedMode
    }
    
    updateTheme()
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateTheme)
  }

  // Update theme
  const updateTheme = () => {
    const newIsDark = currentTheme.value === 'dark'
    isDark.value = newIsDark
    
    if (newIsDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Set theme mode
  const setTheme = (newMode: ThemeMode) => {
    mode.value = newMode
    localStorage.setItem('theme-mode', newMode)
    updateTheme()
  }

  // Toggle between light and dark (skips system)
  const toggleTheme = () => {
    if (currentTheme.value === 'dark') {
      setTheme('light')
    } else {
      setTheme('dark')
    }
  }

  // Watch for mode changes
  watch(mode, updateTheme)

  return {
    mode,
    isDark,
    currentTheme,
    initializeTheme,
    setTheme,
    toggleTheme
  }
})
