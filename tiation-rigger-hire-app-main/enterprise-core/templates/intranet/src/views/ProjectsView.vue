<template>
  <div class="p-6">
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Projects</h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Manage and track all company projects
      </p>
    </div>

    <!-- Action Bar -->
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="flex-1 max-w-md">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            v-model="searchTerm"
            type="text"
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 text-sm"
            placeholder="Search projects..."
          />
        </div>
      </div>
      
      <div class="flex items-center gap-3">
        <select
          v-model="statusFilter"
          class="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="on-hold">On Hold</option>
        </select>
        
        <button
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Project
        </button>
      </div>
    </div>

    <!-- Projects Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="project in filteredProjects"
        :key="project.id"
        class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
      >
        <div class="p-6">
          <!-- Project Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ project.name }}
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {{ project.description }}
              </p>
            </div>
            <span
              :class="getStatusClass(project.status)"
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            >
              {{ project.status }}
            </span>
          </div>

          <!-- Project Details -->
          <div class="space-y-3">
            <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {{ project.manager }}
            </div>
            
            <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Due: {{ formatDate(project.dueDate) }}
            </div>

            <!-- Progress Bar -->
            <div>
              <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                <span>Progress</span>
                <span>{{ project.progress }}%</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  :class="getProgressColor(project.progress)"
                  class="h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${project.progress}%` }"
                ></div>
              </div>
            </div>

            <!-- Team Members -->
            <div class="flex items-center justify-between">
              <div class="flex -space-x-2">
                <img
                  v-for="member in project.team.slice(0, 3)"
                  :key="member.id"
                  :src="member.avatar"
                  :alt="member.name"
                  :title="member.name"
                  class="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800"
                />
                <div
                  v-if="project.team.length > 3"
                  class="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300"
                >
                  +{{ project.team.length - 3 }}
                </div>
              </div>
              
              <button class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredProjects.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No projects found</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {{ searchTerm || statusFilter ? 'Try adjusting your search or filter criteria.' : 'Get started by creating a new project.' }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const searchTerm = ref('')
const statusFilter = ref('')

// Mock data - replace with actual API call
const projects = ref([
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Complete overhaul of company website with modern design',
    status: 'active',
    manager: 'Sarah Johnson',
    dueDate: '2024-03-15',
    progress: 75,
    team: [
      { id: '1', name: 'John Doe', avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=random' },
      { id: '2', name: 'Jane Smith', avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=random' },
      { id: '3', name: 'Mike Wilson', avatar: 'https://ui-avatars.com/api/?name=Mike+Wilson&background=random' },
    ]
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'Native mobile application for iOS and Android platforms',
    status: 'active',
    manager: 'David Chen',
    dueDate: '2024-05-20',
    progress: 45,
    team: [
      { id: '4', name: 'Emily Brown', avatar: 'https://ui-avatars.com/api/?name=Emily+Brown&background=random' },
      { id: '5', name: 'Alex Kim', avatar: 'https://ui-avatars.com/api/?name=Alex+Kim&background=random' },
      { id: '6', name: 'Lisa Wong', avatar: 'https://ui-avatars.com/api/?name=Lisa+Wong&background=random' },
      { id: '7', name: 'Tom Anderson', avatar: 'https://ui-avatars.com/api/?name=Tom+Anderson&background=random' },
    ]
  },
  {
    id: '3',
    name: 'Database Migration',
    description: 'Migrate legacy database to new cloud infrastructure',
    status: 'completed',
    manager: 'Robert Martinez',
    dueDate: '2024-01-31',
    progress: 100,
    team: [
      { id: '8', name: 'Chris Taylor', avatar: 'https://ui-avatars.com/api/?name=Chris+Taylor&background=random' },
      { id: '9', name: 'Anna Davis', avatar: 'https://ui-avatars.com/api/?name=Anna+Davis&background=random' },
    ]
  },
  {
    id: '4',
    name: 'Security Audit',
    description: 'Comprehensive security assessment of all systems',
    status: 'on-hold',
    manager: 'Jennifer Lee',
    dueDate: '2024-04-10',
    progress: 25,
    team: [
      { id: '10', name: 'Mark Johnson', avatar: 'https://ui-avatars.com/api/?name=Mark+Johnson&background=random' },
    ]
  }
])

const filteredProjects = computed(() => {
  return projects.value.filter(project => {
    const matchesSearch = !searchTerm.value || 
      project.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      project.manager.toLowerCase().includes(searchTerm.value.toLowerCase())
    
    const matchesStatus = !statusFilter.value || project.status === statusFilter.value
    
    return matchesSearch && matchesStatus
  })
})

const getStatusClass = (status: string) => {
  const classes = {
    'active': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'completed': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'on-hold': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}

const getProgressColor = (progress: number) => {
  if (progress >= 75) return 'bg-green-500'
  if (progress >= 50) return 'bg-blue-500'
  if (progress >= 25) return 'bg-yellow-500'
  return 'bg-red-500'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>
