<template>
  <footer class="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="py-8">
        <!-- Main Footer Content -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- Company Info -->
          <div class="col-span-1 lg:col-span-2">
            <div class="flex items-center space-x-3 mb-4">
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
              <div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">
                  {{ companyName }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ companyTagline }}
                </p>
              </div>
            </div>
            
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-md">
              {{ companyDescription }}
            </p>
            
            <!-- Social Links -->
            <div class="flex space-x-4">
              <a
                v-for="social in socialLinks"
                :key="social.name"
                :href="social.href"
                :title="social.name"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path :d="social.icon" />
                </svg>
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div>
            <h4 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul class="space-y-2">
              <li v-for="link in quickLinks" :key="link.name">
                <router-link
                  v-if="link.internal"
                  :to="link.href"
                  class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {{ link.name }}
                </router-link>
                <a
                  v-else
                  :href="link.href"
                  class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ link.name }}
                </a>
              </li>
            </ul>
          </div>

          <!-- TiaAstor Resources -->
          <div>
            <h4 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              TiaAstor Resources
            </h4>
            <ul class="space-y-2">
              <li v-for="link in tiaAstorLinks" :key="link.name">
                <a
                  :href="link.href"
                  class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ link.name }}
                </a>
              </li>
            </ul>
          </div>

          <!-- Support & Resources -->
          <div>
            <h4 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Support
            </h4>
            <ul class="space-y-2">
              <li v-for="link in supportLinks" :key="link.name">
                <router-link
                  v-if="link.internal"
                  :to="link.href"
                  class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {{ link.name }}
                </router-link>
                <a
                  v-else
                  :href="link.href"
                  class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ link.name }}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between">
            <!-- Copyright & Version -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <p>
                © {{ currentYear }} {{ companyName }}. All rights reserved.
              </p>
              <div class="flex items-center space-x-4 mt-2 sm:mt-0">
                <span class="flex items-center space-x-1">
                  <span>Version {{ version }}</span>
                  <div 
                    :class="[
                      'h-2 w-2 rounded-full',
                      systemStatus === 'online' ? 'bg-green-500' : 
                      systemStatus === 'maintenance' ? 'bg-yellow-500' : 'bg-red-500'
                    ]"
                    :title="`System ${systemStatus}`"
                  ></div>
                </span>
                <span v-if="buildInfo" class="hidden sm:inline">
                  Build {{ buildInfo }}
                </span>
              </div>
            </div>

            <!-- Legal Links -->
            <div class="flex items-center space-x-4 mt-4 md:mt-0">
              <router-link
                v-for="link in legalLinks"
                :key="link.name"
                :to="link.href"
                class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                {{ link.name }}
              </router-link>
            </div>
          </div>
        </div>

        <!-- Environment Indicator (dev only) -->
        <div 
          v-if="isDevelopment" 
          class="mt-4 p-2 bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 rounded-md"
        >
          <div class="flex items-center justify-center">
            <svg class="h-4 w-4 text-yellow-600 dark:text-yellow-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span class="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Development Environment
            </span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

// Reactive data
const showFallbackLogo = ref(false)

// Environment and system info
const isDevelopment = computed(() => import.meta.env.DEV)
const currentYear = new Date().getFullYear()
const version = computed(() => import.meta.env.VITE_APP_VERSION || '1.0.0')
const buildInfo = computed(() => import.meta.env.VITE_BUILD_INFO || null)
const systemStatus = ref<'online' | 'maintenance' | 'offline'>('online')

// Company information
const companyName = computed(() => import.meta.env.VITE_COMPANY_NAME || 'Company')
const companyTagline = computed(() => import.meta.env.VITE_COMPANY_TAGLINE || 'Your Digital Workplace')
const companyDescription = computed(() => 
  import.meta.env.VITE_COMPANY_DESCRIPTION || 
  'Empowering teams to collaborate, communicate, and achieve their goals through innovative digital solutions.'
)

const companyInitials = computed(() => {
  return companyName.value
    .split(' ')
    .map((word: string) => word.charAt(0))
    .join('')
    .substring(0, 2)
    .toUpperCase()
})

// Social media links
const socialLinks = [
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/company/yourcompany',
    icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com/yourcompany',
    icon: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z'
  },
  {
    name: 'GitHub',
    href: 'https://github.com/yourcompany',
    icon: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z'
  }
]

// Navigation links
const quickLinks = [
  { name: 'Dashboard', href: '/dashboard', internal: true },
  { name: 'Projects', href: '/projects', internal: true },
  { name: 'Team Directory', href: '/employees', internal: true },
  { name: 'Calendar', href: '/calendar', internal: true },
  { name: 'Resources', href: '/resources', internal: true }
]

const tiaAstorLinks = [
  { name: 'TiaAstor GitHub', href: import.meta.env.VITE_TIAASTOR_GITHUB || 'https://github.com/TiaAstor' },
  { name: 'ChaseWhiteRabbit', href: import.meta.env.VITE_TIAASTOR_MAIN_REPO || 'https://github.com/TiaAstor/ChaseWhiteRabbit' },
  { name: '19 Trillion Solution', href: import.meta.env.VITE_TIAASTOR_SOLUTION_REPO || 'https://github.com/TiaAstor/19-trillion-solution' },
  { name: 'RiggerConnect Projects', href: 'https://github.com/TiaAstor?tab=repositories&q=riggerjobs' }
]

const supportLinks = [
  { name: 'Help Center', href: '/help', internal: true },
  { name: 'Contact Support', href: '/support', internal: true },
  { name: 'System Status', href: 'https://status.yourcompany.com', internal: false },
  { name: 'Release Notes', href: '/releases', internal: true },
  { name: 'API Documentation', href: '/docs/api', internal: true }
]

const legalLinks = [
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Terms of Service', href: '/terms' },
  { name: 'Cookie Policy', href: '/cookies' }
]

// System status check (mock implementation)
const checkSystemStatus = () => {
  // In a real implementation, this would check actual system health
  // For now, just simulate based on environment
  if (isDevelopment.value) {
    systemStatus.value = 'online'
  } else {
    systemStatus.value = 'online'
  }
}

// Initialize status check
checkSystemStatus()
</script>
