<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Page Header -->
    <header class="bg-white dark:bg-gray-800 shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <!-- Title and Breadcrumb -->
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Calendar</h1>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage your schedule and team events
              </p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center space-x-3">
            <button
              @click="showCreateEventModal = true"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Event
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Calendar Controls -->
      <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <!-- View Toggle -->
        <div class="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            v-for="view in viewOptions"
            :key="view.value"
            @click="currentView = view.value"
            :class="[
              'px-3 py-2 text-sm font-medium rounded-md transition-all duration-200',
              currentView === view.value
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            ]"
          >
            {{ view.label }}
          </button>
        </div>

        <!-- Navigation Controls -->
        <div class="flex items-center space-x-4">
          <!-- Today Button -->
          <button
            @click="goToToday"
            class="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Today
          </button>

          <!-- Date Navigation -->
          <div class="flex items-center space-x-2">
            <button
              @click="navigateDate('prev')"
              class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-200"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <h2 class="text-lg font-semibold text-gray-900 dark:text-white min-w-[200px] text-center">
              {{ currentDateRange }}
            </h2>

            <button
              @click="navigateDate('next')"
              class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-200"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Calendar Content -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <!-- Monthly View -->
        <div v-if="currentView === 'month'" class="calendar-month">
          <div class="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-600">
            <!-- Day Headers -->
            <div
              v-for="day in dayHeaders"
              :key="day"
              class="bg-gray-50 dark:bg-gray-700 py-2 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide"
            >
              {{ day }}
            </div>

            <!-- Calendar Days -->
            <div
              v-for="day in calendarDays"
              :key="`${day.date}-${day.month}`"
              :class="[
                'bg-white dark:bg-gray-800 min-h-[100px] p-2 relative',
                day.isCurrentMonth ? '' : 'bg-gray-50 dark:bg-gray-700 text-gray-400',
                day.isToday ? 'bg-blue-50 dark:bg-blue-900' : ''
              ]"
            >
              <div class="flex justify-between items-start">
                <span
                  :class="[
                    'text-sm font-medium',
                    day.isCurrentMonth ? 'text-gray-900 dark:text-white' : 'text-gray-400',
                    day.isToday ? 'text-blue-600 dark:text-blue-400' : ''
                  ]"
                >
                  {{ day.date }}
                </span>
              </div>
              
              <!-- Sample Events (placeholder) -->
              <div v-if="day.isCurrentMonth && day.date <= 15" class="mt-1 space-y-1">
                <div
                  v-if="day.date === 5"
                  class="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded truncate"
                >
                  Team Meeting
                </div>
                <div
                  v-if="day.date === 12"
                  class="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded truncate"
                >
                  Project Review
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Weekly View -->
        <div v-else-if="currentView === 'week'" class="calendar-week">
          <div class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Weekly View</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Weekly calendar view coming soon...
            </p>
          </div>
        </div>

        <!-- Daily View -->
        <div v-else-if="currentView === 'day'" class="calendar-day">
          <div class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Daily View</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Daily calendar view coming soon...
            </p>
          </div>
        </div>
      </div>
    </main>

    <!-- Create Event Modal (placeholder) -->
    <div
      v-if="showCreateEventModal"
      class="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showCreateEventModal = false"></div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                  Create New Event
                </h3>
                <div class="mt-4">
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Event creation functionality will be implemented in the next phase.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              @click="showCreateEventModal = false"
              type="button"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Types
interface CalendarDay {
  date: number
  month: number
  year: number
  isCurrentMonth: boolean
  isToday: boolean
}

interface ViewOption {
  label: string
  value: 'month' | 'week' | 'day'
}

// Reactive state
const currentView = ref<'month' | 'week' | 'day'>('month')
const currentDate = ref(new Date())
const showCreateEventModal = ref(false)

// View options for toggle
const viewOptions: ViewOption[] = [
  { label: 'Month', value: 'month' },
  { label: 'Week', value: 'week' },
  { label: 'Day', value: 'day' }
]

// Day headers for calendar
const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Computed properties
const currentDateRange = computed(() => {
  const date = currentDate.value
  
  switch (currentView.value) {
    case 'month':
      return date.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      })
    case 'week':
      // Calculate week range
      const startOfWeek = new Date(date)
      startOfWeek.setDate(date.getDate() - date.getDay())
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)
      
      return `${startOfWeek.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })} - ${endOfWeek.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      })}`
    case 'day':
      return date.toLocaleDateString('en-US', { 
        weekday: 'long',
        month: 'long', 
        day: 'numeric',
        year: 'numeric' 
      })
    default:
      return ''
  }
})

const calendarDays = computed((): CalendarDay[] => {
  const date = currentDate.value
  const year = date.getFullYear()
  const month = date.getMonth()
  
  // First day of the month
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  
  // Start from the Sunday before the first day of the month
  const startDate = new Date(firstDay)
  startDate.setDate(firstDay.getDate() - firstDay.getDay())
  
  // End on the Saturday after the last day of the month
  const endDate = new Date(lastDay)
  endDate.setDate(lastDay.getDate() + (6 - lastDay.getDay()))
  
  const days: CalendarDay[] = []
  const today = new Date()
  
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const isCurrentMonth = d.getMonth() === month
    const isToday = d.toDateString() === today.toDateString()
    
    days.push({
      date: d.getDate(),
      month: d.getMonth(),
      year: d.getFullYear(),
      isCurrentMonth,
      isToday
    })
  }
  
  return days
})

// Methods
const navigateDate = (direction: 'prev' | 'next') => {
  const date = new Date(currentDate.value)
  
  switch (currentView.value) {
    case 'month':
      date.setMonth(date.getMonth() + (direction === 'next' ? 1 : -1))
      break
    case 'week':
      date.setDate(date.getDate() + (direction === 'next' ? 7 : -7))
      break
    case 'day':
      date.setDate(date.getDate() + (direction === 'next' ? 1 : -1))
      break
  }
  
  currentDate.value = date
}

const goToToday = () => {
  currentDate.value = new Date()
}

// Lifecycle
onMounted(() => {
  // Initialize with today's date
  currentDate.value = new Date()
})
</script>

<style scoped>
.calendar-month {
  @apply min-h-[600px];
}

.calendar-week,
.calendar-day {
  @apply min-h-[400px];
}
</style>
