<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Welcome to {{ appName }}
        </h1>
        <p class="text-xl text-gray-600 mb-4">
          Your central hub for company information and collaboration
        </p>
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <h2 class="text-lg font-semibold text-blue-900 mb-2">TiaAstor Innovation Hub</h2>
          <p class="text-blue-800">Explore cutting-edge solutions and repositories from TiaAstor's innovative development ecosystem.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Dashboard</h3>
            <p class="text-gray-600 mb-4">View your personalized dashboard with key metrics and updates.</p>
            <router-link
              to="/dashboard"
              class="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              Go to Dashboard
            </router-link>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Employees</h3>
            <p class="text-gray-600 mb-4">Browse employee directory and contact information.</p>
            <router-link
              to="/employees"
              class="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              View Employees
            </router-link>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Departments</h3>
            <p class="text-gray-600 mb-4">Explore different departments and their structure.</p>
            <router-link
              to="/departments"
              class="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              View Departments
            </router-link>
          </div>
        </div>
        
        <!-- TiaAstor Resources Section -->
        <div class="mt-16">
          <h2 class="text-2xl font-bold text-gray-900 mb-8 text-center">TiaAstor Resources</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <a
              v-for="resource in tiaAstorResources"
              :key="resource.name"
              :href="resource.url"
              target="_blank"
              rel="noopener noreferrer"
              class="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              <div class="flex items-center mb-4">
                <svg class="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="resource.icon" />
                </svg>
                <h3 class="text-lg font-semibold">{{ resource.name }}</h3>
              </div>
              <p class="text-blue-100 text-sm mb-4">{{ resource.description }}</p>
              <div class="flex items-center text-sm text-blue-200">
                <span>View Repository</span>
                <svg class="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const appName = computed(() => import.meta.env.VITE_APP_NAME || 'Company Intranet')

// TiaAstor Resources
const tiaAstorResources = [
  {
    name: 'TiaAstor GitHub',
    url: import.meta.env.VITE_TIAASTOR_GITHUB || 'https://github.com/TiaAstor',
    description: 'Explore TiaAstor\'s main GitHub profile with all repositories and contributions.',
    icon: 'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z'
  },
  {
    name: 'ChaseWhiteRabbit',
    url: import.meta.env.VITE_TIAASTOR_MAIN_REPO || 'https://github.com/TiaAstor/ChaseWhiteRabbit',
    description: 'The main TiaAstor project repository with innovative solutions and cutting-edge development.',
    icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
  },
  {
    name: '19 Trillion Solution',
    url: import.meta.env.VITE_TIAASTOR_SOLUTION_REPO || 'https://github.com/TiaAstor/19-trillion-solution',
    description: 'Advanced analytical solutions and data-driven insights for complex problem solving.',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
  },
  {
    name: 'RiggerConnect',
    url: 'https://github.com/TiaAstor?tab=repositories&q=riggerjobs',
    description: 'Workforce management and job connection platform for specialized industries.',
    icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a4 4 0 11-8 0 4 4 0 018 0z'
  }
]
</script>
