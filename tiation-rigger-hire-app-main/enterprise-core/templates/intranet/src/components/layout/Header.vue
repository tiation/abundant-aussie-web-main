<template>
  <header class="bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700">
    <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo and Company Branding -->
        <div class="flex items-center space-x-4">
          <!-- Sidebar Toggle -->
          <button
            @click="$emit('toggle-sidebar')"
            class="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <!-- Company Logo -->
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0">
              <img 
                class="h-8 w-8" 
                src="/company-logo.svg" 
                alt="Company Logo"
                @error="showFallbackLogo = true"
                v-if="!showFallbackLogo"
              />
              <!-- Fallback Logo -->
              <div 
                v-else
                class="h-8 w-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center"
              >
                <span class="text-white font-bold text-sm">{{ companyInitials }}</span>
              </div>
            </div>
            
            <div class="hidden sm:block">
              <router-link 
                to="/dashboard" 
                class="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {{ appName }}
              </router-link>
              <div class="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {{ companyTagline }}
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side: Theme Toggle, Notifications, User Menu -->
        <div class="flex items-center space-x-4">
          <!-- Theme Toggle -->
          <button
            @click="themeStore.toggleTheme()"
            class="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            :title="`Switch to ${themeStore.currentTheme === 'dark' ? 'light' : 'dark'} mode`"
          >
            <!-- Sun Icon (Light Mode) -->
            <svg 
              v-if="themeStore.currentTheme === 'dark'" 
              class="h-5 w-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <!-- Moon Icon (Dark Mode) -->
            <svg 
              v-else 
              class="h-5 w-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>

          <!-- Notifications -->
          <div class="relative">
            <button
              @click="showNotifications = !showNotifications"
              class="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 relative"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5-5H9l-5 5h5a3 3 0 006 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 3h-2l-.447 2.894A2 2 0 008.618 7.382l-2.894-.447v2l2.894.447A2 2 0 008.618 16.618l-.447 2.894h2l.447-2.894A2 2 0 0015.382 16.618l2.894.447v-2l-2.894-.447A2 2 0 0015.382 7.382L15.829 4.894z" />
              </svg>
              <!-- Notification Badge -->
              <span 
                v-if="notificationCount > 0"
                class="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
              >
                {{ notificationCount > 99 ? '99+' : notificationCount }}
              </span>
            </button>

            <!-- Notifications Dropdown -->
            <div
              v-if="showNotifications"
              v-click-outside="() => showNotifications = false"
              class="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700"
            >
              <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
              </div>
              
              <div class="max-h-64 overflow-y-auto">
                <div 
                  v-if="notifications.length === 0" 
                  class="px-4 py-8 text-center text-gray-500 dark:text-gray-400 text-sm"
                >
                  No new notifications
                </div>
                
                <div 
                  v-for="notification in notifications" 
                  :key="notification.id"
                  class="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                >
                  <div class="flex items-start space-x-3">
                    <div class="flex-shrink-0">
                      <div class="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900 dark:text-white">
                        {{ notification.title }}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {{ notification.message }}
                      </p>
                      <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {{ formatTime(notification.timestamp) }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                <button class="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200">
                  View all notifications
                </button>
              </div>
            </div>
          </div>

          <!-- User Menu -->
          <div class="relative" v-if="authStore.user">
            <button
              @click="showUserMenu = !showUserMenu"
              class="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 rounded-md p-2"
            >
              <img
                :src="authStore.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(authStore.user.name)}&background=random`"
                :alt="authStore.user.name"
                class="h-8 w-8 rounded-full border-2 border-gray-200 dark:border-gray-700"
              />
              <span class="hidden md:block text-sm font-medium">{{ authStore.user.name }}</span>
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <!-- User Dropdown Menu -->
            <div
              v-if="showUserMenu"
              v-click-outside="() => showUserMenu = false"
              class="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700"
            >
              <!-- User Info -->
              <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <div class="flex items-center space-x-3">
                  <img
                    :src="authStore.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(authStore.user.name)}&background=random`"
                    :alt="authStore.user.name"
                    class="h-10 w-10 rounded-full"
                  />
                  <div class="flex-1 min-w-0">
                    <div class="font-medium text-gray-900 dark:text-white truncate">
                      {{ authStore.user.name }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {{ authStore.user.email }}
                    </div>
                    <div class="text-xs text-gray-400 dark:text-gray-500">
                      {{ authStore.user.department }} • {{ authStore.user.role }}
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Menu Items -->
              <div class="py-1">
                <router-link
                  to="/profile"
                  class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <svg class="mr-3 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </router-link>
                
                <router-link
                  to="/settings"
                  class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <svg class="mr-3 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </router-link>
                
                <hr class="my-1 border-gray-200 dark:border-gray-700">
                
                <button
                  @click="handleLogout"
                  class="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <svg class="mr-3 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign out
                </button>
              </div>
            </div>
          </div>

          <!-- Auth Buttons for non-authenticated users -->
          <div v-else class="flex items-center space-x-2">
            <router-link
              to="/login"
              class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Sign in
            </router-link>
            <router-link
              to="/register"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Sign up
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useThemeStore } from '../../stores/theme'

// Emits
defineEmits(['toggle-sidebar'])

// Stores
const authStore = useAuthStore()
const themeStore = useThemeStore()
const router = useRouter()

// Reactive data
const showUserMenu = ref(false)
const showNotifications = ref(false)
const showFallbackLogo = ref(false)

// Company branding
const appName = computed(() => import.meta.env.VITE_APP_NAME || 'Company Intranet')
const companyTagline = computed(() => import.meta.env.VITE_COMPANY_TAGLINE || 'Your Digital Workplace')
const companyInitials = computed(() => {
  return appName.value
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .substring(0, 2)
    .toUpperCase()
})

// Mock notifications (replace with real data later)
const notifications = ref([
  {
    id: 1,
    title: 'Welcome to the company!',
    message: 'Complete your profile to get started.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false
  },
  {
    id: 2,
    title: 'Team Meeting Tomorrow',
    message: 'Don\'t forget about the team sync at 10 AM.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false
  }
])

const notificationCount = computed(() => {
  return notifications.value.filter(n => !n.read).length
})

// Methods
const handleLogout = async () => {
  showUserMenu.value = false
  await authStore.logout()
  router.push('/login')
}

const formatTime = (timestamp: Date) => {
  const now = new Date()
  const diff = now.getTime() - timestamp.getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 60) {
    return `${minutes}m ago`
  } else if (hours < 24) {
    return `${hours}h ago`
  } else {
    return `${days}d ago`
  }
}

// Click outside directive
const vClickOutside = {
  mounted(el: any, binding: any) {
    el.clickOutsideEvent = function (event: Event) {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el: any) {
    document.removeEventListener('click', el.clickOutsideEvent)
  },
}

// Initialize theme on mount
onMounted(() => {
  themeStore.initializeTheme()
})
</script>
