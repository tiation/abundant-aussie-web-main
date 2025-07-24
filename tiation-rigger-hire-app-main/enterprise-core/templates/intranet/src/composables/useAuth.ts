import { useAuthStore } from '../stores/auth'

/**
 * Legacy useAuth composable for backward compatibility
 * @deprecated Use useAuthStore directly instead
 */
export function useAuth() {
  const authStore = useAuthStore()
  
  return {
    user: authStore.user,
    token: authStore.token,
    isAuthenticated: authStore.isAuthenticated,
    isLoading: authStore.isLoading,
    login: authStore.login,
    logout: authStore.logout,
    initAuth: authStore.initializeAuth,
  }
}
