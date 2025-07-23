<template>
  <!-- Use new layout for authenticated routes -->
  <AppLayout v-if="showLayout">
    <router-view />
  </AppLayout>
  
  <!-- Simple layout for auth pages -->
  <div v-else class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore, useThemeStore } from './stores'
import AppLayout from './components/layout/AppLayout.vue'

const route = useRoute()
const authStore = useAuthStore()
const themeStore = useThemeStore()

// Show layout for all pages except auth pages and 404
const showLayout = computed(() => {
  const authPages = ['Login', 'Register', 'ForgotPassword']
  const specialPages = ['NotFound']
  const routeName = route.name as string
  
  return !authPages.includes(routeName) && !specialPages.includes(routeName)
})

// Initialize stores on app mount
onMounted(async () => {
  await authStore.initializeAuth()
  themeStore.initializeTheme()
})
</script>
