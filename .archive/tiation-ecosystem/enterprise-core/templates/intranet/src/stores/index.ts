import { createPinia } from 'pinia'

export const pinia = createPinia()

// Export stores
export { useAuthStore } from './auth'
export { useThemeStore } from './theme'
export { useSettingsStore } from './settings'
export { useLoadingStore } from './loading'

export default pinia
