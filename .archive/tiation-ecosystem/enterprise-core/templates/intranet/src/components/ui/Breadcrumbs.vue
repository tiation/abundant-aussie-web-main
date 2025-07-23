<template>
  <nav class="flex mb-6" aria-label="Breadcrumb">
    <ol class="inline-flex items-center space-x-1 md:space-x-3">
      <li class="inline-flex items-center">
        <router-link
          to="/dashboard"
          class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
        >
          <svg
            class="w-4 h-4 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          Home
        </router-link>
      </li>
      
      <li v-for="(crumb, index) in breadcrumbs" :key="index">
        <div class="flex items-center">
          <svg
            class="w-6 h-6 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
          </svg>
          
          <router-link
            v-if="crumb.to && index < breadcrumbs.length - 1"
            :to="crumb.to"
            class="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white"
          >
            {{ crumb.text }}
          </router-link>
          
          <span
            v-else
            class="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400"
            aria-current="page"
          >
            {{ crumb.text }}
          </span>
        </div>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

interface Breadcrumb {
  text: string
  to?: string
}

const route = useRoute()

const breadcrumbs = computed<Breadcrumb[]>(() => {
  const crumbs: Breadcrumb[] = []
  
  // Map route names to breadcrumb configurations
  const routeMap: Record<string, Breadcrumb[]> = {
    'Dashboard': [],
    
    'Projects': [
      { text: 'Projects' }
    ],
    
    'Team': [
      { text: 'Team' }
    ],
    
    'Employees': [
      { text: 'People', to: '/team' },
      { text: 'Employees' }
    ],
    
    'Departments': [
      { text: 'People', to: '/team' },
      { text: 'Departments' }
    ],
    
    'Settings': [
      { text: 'Settings' }
    ]
  }
  
  const routeName = route.name as string
  
  if (routeName && routeMap[routeName]) {
    crumbs.push(...routeMap[routeName])
  } else if (route.path !== '/dashboard') {
    // Fallback: create breadcrumb from path
    const pathSegments = route.path.split('/').filter(segment => segment)
    
    pathSegments.forEach((segment, index) => {
      const isLast = index === pathSegments.length - 1
      const path = '/' + pathSegments.slice(0, index + 1).join('/')
      
      crumbs.push({
        text: capitalizeFirst(segment),
        to: isLast ? undefined : path
      })
    })
  }
  
  return crumbs
})

const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
</script>
