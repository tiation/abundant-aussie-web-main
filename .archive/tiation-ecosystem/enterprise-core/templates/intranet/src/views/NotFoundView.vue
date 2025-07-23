<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full text-center">
      <div class="mb-8">
        <!-- 404 Illustration -->
        <div class="mx-auto h-32 w-32 text-gray-400 mb-6">
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            class="w-full h-full"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1"
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0118 12M6 20.291A7.962 7.962 0 016 12m0 8.291a7.962 7.962 0 010-8.291m12 0a7.962 7.962 0 010 8.291M6 12a6 6 0 1112 0v0"
            />
          </svg>
        </div>
        
        <!-- 404 Text -->
        <h1 class="text-6xl font-bold text-gray-900 dark:text-white mb-4">
          404
        </h1>
        
        <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Page Not Found
        </h2>
        
        <p class="text-gray-500 dark:text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>

      <!-- Navigation Options -->
      <div class="space-y-4">
        <!-- Back Button -->
        <button
          @click="goBack"
          class="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Go Back
        </button>

        <!-- Home Button -->
        <router-link
          to="/dashboard"
          class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Go to Dashboard
        </router-link>
      </div>

      <!-- Quick Links -->
      <div class="mt-8">
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Or try one of these popular pages:
        </p>
        <div class="flex flex-wrap justify-center gap-2">
          <router-link
            to="/projects"
            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Projects
          </router-link>
          <router-link
            to="/team"
            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Team
          </router-link>
          <router-link
            to="/employees"
            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Employees
          </router-link>
          <router-link
            to="/departments"
            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Departments
          </router-link>
          <router-link
            to="/settings"
            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Settings
          </router-link>
        </div>
      </div>

      <!-- Search Box -->
      <div class="mt-8">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            v-model="searchQuery"
            @keyup.enter="handleSearch"
            type="text"
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 text-sm"
            placeholder="Search for a page or feature..."
          />
        </div>
      </div>

      <!-- Help Text -->
      <div class="mt-8 text-xs text-gray-400 dark:text-gray-500">
        <p>
          If you believe this is an error, please contact your system administrator.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')

const goBack = () => {
  // Go back to previous page if available, otherwise go to dashboard
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/dashboard')
  }
}

const handleSearch = () => {
  if (!searchQuery.value.trim()) return
  
  // Simple search logic - in a real app this would be more sophisticated
  const query = searchQuery.value.toLowerCase().trim()
  
  // Map common search terms to routes
  const searchMap: Record<string, string> = {
    'dashboard': '/dashboard',
    'home': '/dashboard',
    'projects': '/projects',
    'project': '/projects',
    'team': '/team',
    'teams': '/team',
    'employees': '/employees',
    'employee': '/employees',
    'departments': '/departments',
    'department': '/departments',
    'settings': '/settings',
    'setting': '/settings',
    'profile': '/settings',
    'login': '/login',
    'logout': '/login'
  }
  
  const route = searchMap[query]
  if (route) {
    router.push(route)
  } else {
    // If no direct match, try to navigate to dashboard and show the search
    router.push({
      path: '/dashboard',
      query: { search: searchQuery.value }
    })
  }
}
</script>
