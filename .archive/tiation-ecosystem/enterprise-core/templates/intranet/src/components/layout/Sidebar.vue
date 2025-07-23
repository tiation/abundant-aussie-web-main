<template>
  <div class="flex">
    <!-- Mobile overlay -->
    <div
      v-if="isMobile && isOpen"
      @click="$emit('close-sidebar')"
      class="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
    ></div>

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out lg:static lg:inset-auto lg:translate-x-0',
        'bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700',
        isMobile
          ? isOpen
            ? 'translate-x-0 w-64'
            : '-translate-x-full w-64'
          : isCollapsed
          ? 'w-16'
          : 'w-64'
      ]"
    >
      <!-- Sidebar Header -->
      <div class="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
        <!-- Logo (when expanded) -->
        <div v-if="!isCollapsed || isMobile" class="flex items-center space-x-3">
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
            <div class="text-lg font-bold text-gray-900 dark:text-white">
              {{ appName }}
            </div>
          </div>
        </div>

        <!-- Mini logo (when collapsed) -->
        <div v-else class="flex justify-center w-full">
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
        </div>

        <!-- Desktop collapse toggle -->
        <button
          v-if="!isMobile"
          @click="$emit('toggle-collapse')"
          class="p-1 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
        >
          <svg 
            :class="[
              'h-5 w-5 transition-transform duration-200',
              isCollapsed ? 'rotate-180' : ''
            ]" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <!-- Mobile close button -->
        <button
          v-if="isMobile"
          @click="$emit('close-sidebar')"
          class="p-1 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        <!-- Main Navigation Items -->
        <div class="space-y-1">
          <router-link
            v-for="item in mainNavItems"
            :key="item.name"
            :to="item.route"
            :class="[
              'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-200',
              'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white',
              'focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500'
            ]"
            active-class="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200"
            :title="isCollapsed ? item.name : ''"
          >
            <svg
              :class="[
                'flex-shrink-0 h-5 w-5',
                isCollapsed ? '' : 'mr-3'
              ]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                :d="getIcon(item.icon)"
              />
            </svg>
            <span v-if="!isCollapsed || isMobile" class="truncate">
              {{ item.name }}
            </span>
            <span
              v-if="item.badge && (!isCollapsed || isMobile)"
              class="ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
            >
              {{ item.badge }}
            </span>
          </router-link>
        </div>

        <!-- Separator -->
        <div class="border-t border-gray-200 dark:border-gray-700 my-4"></div>

        <!-- TiaAstor Resources -->
        <div class="space-y-1">
          <div 
            v-if="!isCollapsed || isMobile" 
            class="px-2 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
          >
            TiaAstor Resources
          </div>
          
          <a
            v-for="item in tiaAstorNavItems"
            :key="item.name"
            :href="item.url"
            target="_blank"
            rel="noopener noreferrer"
            :class="[
              'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-200',
              'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white',
              'focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500'
            ]"
            :title="isCollapsed ? item.name : ''"
          >
            <svg
              :class="[
                'flex-shrink-0 h-5 w-5',
                isCollapsed ? '' : 'mr-3'
              ]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                :d="getIcon(item.icon)"
              />
            </svg>
            <span v-if="!isCollapsed || isMobile" class="truncate">
              {{ item.name }}
            </span>
            <svg
              v-if="!isCollapsed || isMobile"
              class="ml-auto h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        <!-- Separator -->
        <div class="border-t border-gray-200 dark:border-gray-700 my-4"></div>

        <!-- Secondary Navigation -->
        <div class="space-y-1">
          <div 
            v-if="!isCollapsed || isMobile" 
            class="px-2 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
          >
            Workspace
          </div>
          
          <router-link
            v-for="item in secondaryNavItems"
            :key="item.name"
            :to="item.route"
            :class="[
              'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-200',
              'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white',
              'focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500'
            ]"
            active-class="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200"
            :title="isCollapsed ? item.name : ''"
          >
            <svg
              :class="[
                'flex-shrink-0 h-5 w-5',
                isCollapsed ? '' : 'mr-3'
              ]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                :d="getIcon(item.icon)"
              />
            </svg>
            <span v-if="!isCollapsed || isMobile" class="truncate">
              {{ item.name }}
            </span>
          </router-link>
        </div>
      </nav>

      <!-- Sidebar Footer -->
      <div class="border-t border-gray-200 dark:border-gray-700 p-4">
        <!-- Version info (when expanded) -->
        <div v-if="!isCollapsed || isMobile" class="text-center">
          <div class="text-xs text-gray-500 dark:text-gray-400">
            Version {{ version }}
          </div>
          <div class="text-xs text-gray-400 dark:text-gray-500 mt-1">
            © {{ currentYear }} {{ companyName }}
          </div>
        </div>

        <!-- Mini version indicator (when collapsed) -->
        <div v-else class="flex justify-center">
          <div class="h-2 w-2 bg-green-500 rounded-full" title="System Online"></div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

// Props
interface Props {
  isOpen: boolean
  isCollapsed: boolean
  isMobile: boolean
}

defineProps<Props>()

// Emits
defineEmits(['close-sidebar', 'toggle-collapse'])

// Reactive data
const showFallbackLogo = ref(false)

// Company branding
const appName = computed(() => import.meta.env.VITE_APP_NAME || 'Company Intranet')
const companyName = computed(() => import.meta.env.VITE_COMPANY_NAME || 'Company')
const version = computed(() => import.meta.env.VITE_APP_VERSION || '1.0.0')
const currentYear = new Date().getFullYear()

const companyInitials = computed(() => {
  return appName.value
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .substring(0, 2)
    .toUpperCase()
})

// Navigation items
const mainNavItems = [
  {
    name: 'Dashboard',
    route: '/dashboard',
    icon: 'DashboardIcon',
    badge: null
  },
  {
    name: 'Calendar',
    route: '/calendar',
    icon: 'CalendarIcon',
    badge: null
  },
  {
    name: 'Projects',
    route: '/projects',
    icon: 'ProjectsIcon',
    badge: '4'
  },
  {
    name: 'Team',
    route: '/team',
    icon: 'TeamIcon',
    badge: null
  },
  {
    name: 'Employees',
    route: '/employees',
    icon: 'EmployeesIcon',
    badge: null
  },
  {
    name: 'Departments',
    route: '/departments',
    icon: 'DepartmentsIcon',
    badge: null
  }
]

const secondaryNavItems = [
  {
    name: 'Settings',
    route: '/settings',
    icon: 'SettingsIcon'
  }
]

// TiaAstor navigation items
const tiaAstorNavItems = [
  {
    name: 'TiaAstor GitHub',
    url: import.meta.env.VITE_TIAASTOR_GITHUB || 'https://github.com/TiaAstor',
    icon: 'GithubIcon'
  },
  {
    name: 'ChaseWhiteRabbit',
    url: import.meta.env.VITE_TIAASTOR_MAIN_REPO || 'https://github.com/TiaAstor/ChaseWhiteRabbit',
    icon: 'ProjectsIcon'
  },
  {
    name: '19 Trillion Solution',
    url: import.meta.env.VITE_TIAASTOR_SOLUTION_REPO || 'https://github.com/TiaAstor/19-trillion-solution',
    icon: 'AnalyticsIcon'
  }
]

// Icon lookup for dynamic rendering
const getIcon = (iconName: string) => {
  const icons: Record<string, string> = {
    'DashboardIcon': 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z M8 5a2 2 0 012-2h4a2 2 0 012 2v14l-5-3-5 3V5z',
    'ProjectsIcon': 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
    'TeamIcon': 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a4 4 0 11-8 0 4 4 0 018 0z',
    'EmployeesIcon': 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    'DepartmentsIcon': 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    'CalendarIcon': 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    'MessagesIcon': 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
    'AnalyticsIcon': 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    'FilesIcon': 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    'SettingsIcon': 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    'SupportIcon': 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    'GithubIcon': 'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z'
  }
  return icons[iconName] || icons['DashboardIcon']
}
</script>
