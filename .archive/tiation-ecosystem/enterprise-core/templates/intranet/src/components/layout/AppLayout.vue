<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <!-- Header -->
    <Header @toggle-sidebar="toggleMobileSidebar" />
    
    <div class="flex">
      <!-- Sidebar -->
      <Sidebar
        :is-open="isMobileSidebarOpen"
        :is-collapsed="isSidebarCollapsed"
        :is-mobile="isMobile"
        @close-sidebar="closeMobileSidebar"
        @toggle-collapse="toggleSidebarCollapse"
      />
      
      <!-- Main Content Area -->
      <main 
        :class="[
          'flex-1 flex flex-col transition-all duration-300 ease-in-out',
          'min-h-screen',
          !isMobile && !isSidebarCollapsed ? 'lg:ml-0' : '',
          !isMobile && isSidebarCollapsed ? 'lg:ml-0' : ''
        ]"
      >
        <!-- Content Container -->
        <div class="flex-1 flex flex-col">
          <!-- Page Content -->
          <div class="flex-1 p-4 sm:p-6 lg:p-8">
            <div class="max-w-full mx-auto">
              <!-- Breadcrumbs -->
              <Breadcrumbs v-if="showBreadcrumbs" />
              
              <slot />
            </div>
          </div>
          
          <!-- Footer -->
          <Footer />
        </div>
      </main>
    </div>
    
    <!-- Global Loading Indicator -->
    <Teleport to="body">
      <div
        v-if="isLoading"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl">
          <div class="flex items-center space-x-3">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span class="text-gray-900 dark:text-white font-medium">{{ loadingMessage }}</span>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useThemeStore } from '../../stores/theme'
import Header from './Header.vue'
import Sidebar from './Sidebar.vue'
import Footer from './Footer.vue'
import Breadcrumbs from '../ui/Breadcrumbs.vue'

// Props
interface Props {
  loading?: boolean
  loadingMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  loadingMessage: 'Loading...'
})

// Stores and route
const route = useRoute()
const themeStore = useThemeStore()

// Reactive data
const isMobileSidebarOpen = ref(false)
const isSidebarCollapsed = ref(false)
const windowWidth = ref(window.innerWidth)

// Computed properties
const isMobile = computed(() => windowWidth.value < 1024) // lg breakpoint
const isLoading = computed(() => props.loading)
const showBreadcrumbs = computed(() => {
  // Don't show breadcrumbs on dashboard (home page)
  return route.name !== 'Dashboard' && route.name !== 'Home'
})

// Methods
const toggleMobileSidebar = () => {
  isMobileSidebarOpen.value = !isMobileSidebarOpen.value
}

const closeMobileSidebar = () => {
  isMobileSidebarOpen.value = false
}

const toggleSidebarCollapse = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
  // Save preference to localStorage
  localStorage.setItem('sidebar-collapsed', isSidebarCollapsed.value.toString())
}

const handleResize = () => {
  windowWidth.value = window.innerWidth
  
  // Auto-close mobile sidebar when switching to desktop
  if (!isMobile.value) {
    isMobileSidebarOpen.value = false
  }
}

// Keyboard shortcuts
const handleKeyDown = (event: KeyboardEvent) => {
  // Toggle sidebar with Ctrl/Cmd + B
  if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
    event.preventDefault()
    if (isMobile.value) {
      toggleMobileSidebar()
    } else {
      toggleSidebarCollapse()
    }
  }
  
  // Close mobile sidebar with Escape
  if (event.key === 'Escape' && isMobileSidebarOpen.value) {
    closeMobileSidebar()
  }
}

// Lifecycle hooks
onMounted(() => {
  // Initialize theme
  themeStore.initializeTheme()
  
  // Restore sidebar state from localStorage
  const savedCollapsed = localStorage.getItem('sidebar-collapsed')
  if (savedCollapsed !== null) {
    isSidebarCollapsed.value = savedCollapsed === 'true'
  }
  
  // Add event listeners
  window.addEventListener('resize', handleResize)
  document.addEventListener('keydown', handleKeyDown)
  
  // Set initial window width
  handleResize()
})

onUnmounted(() => {
  // Remove event listeners
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('keydown', handleKeyDown)
})

// Expose methods for parent components
defineExpose({
  toggleMobileSidebar,
  closeMobileSidebar,
  toggleSidebarCollapse
})
</script>

<style scoped>
/* Custom scrollbar for webkit browsers */
:deep(.overflow-y-auto)::-webkit-scrollbar {
  width: 6px;
}

:deep(.overflow-y-auto)::-webkit-scrollbar-track {
  @apply bg-gray-100 dark:bg-gray-800;
}

:deep(.overflow-y-auto)::-webkit-scrollbar-thumb {
  @apply bg-gray-300 dark:bg-gray-600 rounded-full;
}

:deep(.overflow-y-auto)::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400 dark:bg-gray-500;
}

/* Smooth transitions */
.transition-colors {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
</style>
