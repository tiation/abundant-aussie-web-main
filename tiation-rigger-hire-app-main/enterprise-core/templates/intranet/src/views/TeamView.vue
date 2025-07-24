<template>
  <div class="p-6">
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Team</h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Manage team members and organizational structure
      </p>
    </div>

    <!-- Tabs -->
    <div class="mb-6">
      <nav class="flex space-x-8" aria-label="Tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            activeTab === tab.id
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300',
            'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm'
          ]"
        >
          {{ tab.name }}
        </button>
      </nav>
    </div>

    <!-- Members Tab -->
    <div v-if="activeTab === 'members'">
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
              v-model="memberSearch"
              type="text"
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 text-sm"
              placeholder="Search team members..."
            />
          </div>
        </div>
        
        <div class="flex items-center gap-3">
          <select
            v-model="departmentFilter"
            class="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Departments</option>
            <option value="IT">IT</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
          </select>
          
          <button
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Member
          </button>
        </div>
      </div>

      <!-- Members Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="member in filteredMembers"
          :key="member.id"
          class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
        >
          <div class="p-6 text-center">
            <img
              :src="member.avatar"
              :alt="member.name"
              class="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-gray-100 dark:border-gray-700"
            />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ member.name }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
              {{ member.position }}
            </p>
            <span
              :class="getDepartmentColor(member.department)"
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-4"
            >
              {{ member.department }}
            </span>
            
            <div class="flex justify-center space-x-2">
              <button
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                :title="`Email ${member.name}`"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </button>
              <button
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                :title="`Call ${member.name}`"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Departments Tab -->
    <div v-if="activeTab === 'departments'">
      <!-- Department Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div
          v-for="dept in departmentStats"
          :key="dept.name"
          class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6"
        >
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div :class="dept.color" class="w-8 h-8 rounded-md flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  {{ dept.name }}
                </dt>
                <dd class="text-lg font-medium text-gray-900 dark:text-white">
                  {{ dept.count }} members
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Department Details -->
      <div class="space-y-6">
        <div
          v-for="dept in departmentDetails"
          :key="dept.name"
          class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700"
        >
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ dept.name }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ dept.description }}
            </p>
          </div>
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Department Head: {{ dept.head }}
              </span>
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {{ dept.members.length }} members
              </span>
            </div>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="member in dept.members"
                :key="member"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
              >
                {{ member }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Org Chart Tab -->
    <div v-if="activeTab === 'org-chart'">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-8">
        <div class="text-center mb-8">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Organizational Structure
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Visual representation of company hierarchy
          </p>
        </div>
        
        <!-- Simplified Org Chart -->
        <div class="space-y-6">
          <!-- CEO Level -->
          <div class="text-center">
            <div class="inline-block bg-blue-100 dark:bg-blue-900 rounded-lg p-4">
              <div class="font-semibold text-blue-800 dark:text-blue-200">CEO</div>
              <div class="text-sm text-blue-600 dark:text-blue-300">John Smith</div>
            </div>
          </div>
          
          <!-- Department Heads Level -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="text-center">
              <div class="bg-green-100 dark:bg-green-900 rounded-lg p-3">
                <div class="font-medium text-green-800 dark:text-green-200">CTO</div>
                <div class="text-sm text-green-600 dark:text-green-300">Sarah Johnson</div>
                <div class="text-xs text-green-500 dark:text-green-400">IT Department</div>
              </div>
            </div>
            <div class="text-center">
              <div class="bg-purple-100 dark:bg-purple-900 rounded-lg p-3">
                <div class="font-medium text-purple-800 dark:text-purple-200">CMO</div>
                <div class="text-sm text-purple-600 dark:text-purple-300">Mike Wilson</div>
                <div class="text-xs text-purple-500 dark:text-purple-400">Marketing</div>
              </div>
            </div>
            <div class="text-center">
              <div class="bg-orange-100 dark:bg-orange-900 rounded-lg p-3">
                <div class="font-medium text-orange-800 dark:text-orange-200">CFO</div>
                <div class="text-sm text-orange-600 dark:text-orange-300">Lisa Davis</div>
                <div class="text-xs text-orange-500 dark:text-orange-400">Finance</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const activeTab = ref('members')
const memberSearch = ref('')
const departmentFilter = ref('')

const tabs = [
  { id: 'members', name: 'Members' },
  { id: 'departments', name: 'Departments' },
  { id: 'org-chart', name: 'Org Chart' }
]

// Mock data - replace with actual API calls
const members = ref([
  {
    id: '1',
    name: 'Sarah Johnson',
    position: 'Chief Technology Officer',
    department: 'IT',
    email: 'sarah.johnson@company.com',
    phone: '+1 (555) 123-4567',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=random'
  },
  {
    id: '2',
    name: 'Mike Wilson',
    position: 'Marketing Director',
    department: 'Marketing',
    email: 'mike.wilson@company.com',
    phone: '+1 (555) 234-5678',
    avatar: 'https://ui-avatars.com/api/?name=Mike+Wilson&background=random'
  },
  {
    id: '3',
    name: 'Emily Brown',
    position: 'Frontend Developer',
    department: 'IT',
    email: 'emily.brown@company.com',
    phone: '+1 (555) 345-6789',
    avatar: 'https://ui-avatars.com/api/?name=Emily+Brown&background=random'
  },
  {
    id: '4',
    name: 'David Chen',
    position: 'Product Manager',
    department: 'IT',
    email: 'david.chen@company.com',
    phone: '+1 (555) 456-7890',
    avatar: 'https://ui-avatars.com/api/?name=David+Chen&background=random'
  },
  {
    id: '5',
    name: 'Lisa Davis',
    position: 'Finance Manager',
    department: 'Finance',
    email: 'lisa.davis@company.com',
    phone: '+1 (555) 567-8901',
    avatar: 'https://ui-avatars.com/api/?name=Lisa+Davis&background=random'
  },
  {
    id: '6',
    name: 'Alex Kim',
    position: 'Sales Representative',
    department: 'Sales',
    email: 'alex.kim@company.com',
    phone: '+1 (555) 678-9012',
    avatar: 'https://ui-avatars.com/api/?name=Alex+Kim&background=random'
  },
  {
    id: '7',
    name: 'Jennifer Lee',
    position: 'HR Specialist',
    department: 'HR',
    email: 'jennifer.lee@company.com',
    phone: '+1 (555) 789-0123',
    avatar: 'https://ui-avatars.com/api/?name=Jennifer+Lee&background=random'
  },
  {
    id: '8',
    name: 'Robert Martinez',
    position: 'Backend Developer',
    department: 'IT',
    email: 'robert.martinez@company.com',
    phone: '+1 (555) 890-1234',
    avatar: 'https://ui-avatars.com/api/?name=Robert+Martinez&background=random'
  }
])

const filteredMembers = computed(() => {
  return members.value.filter(member => {
    const matchesSearch = !memberSearch.value || 
      member.name.toLowerCase().includes(memberSearch.value.toLowerCase()) ||
      member.position.toLowerCase().includes(memberSearch.value.toLowerCase()) ||
      member.email.toLowerCase().includes(memberSearch.value.toLowerCase())
    
    const matchesDepartment = !departmentFilter.value || member.department === departmentFilter.value
    
    return matchesSearch && matchesDepartment
  })
})

const departmentStats = computed(() => {
  const stats = members.value.reduce((acc, member) => {
    acc[member.department] = (acc[member.department] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const colors = {
    'IT': 'bg-blue-500',
    'Marketing': 'bg-purple-500',
    'Sales': 'bg-green-500',
    'Finance': 'bg-orange-500',
    'HR': 'bg-pink-500'
  }

  return Object.entries(stats).map(([name, count]) => ({
    name,
    count,
    color: colors[name as keyof typeof colors] || 'bg-gray-500'
  }))
})

const departmentDetails = [
  {
    name: 'Information Technology',
    description: 'Responsible for all technical infrastructure and software development',
    head: 'Sarah Johnson',
    members: ['Sarah Johnson', 'Emily Brown', 'David Chen', 'Robert Martinez']
  },
  {
    name: 'Marketing',
    description: 'Drives brand awareness and customer acquisition strategies',
    head: 'Mike Wilson',
    members: ['Mike Wilson']
  },
  {
    name: 'Sales',
    description: 'Manages customer relationships and revenue generation',
    head: 'Alex Kim',
    members: ['Alex Kim']
  },
  {
    name: 'Finance',
    description: 'Oversees financial planning and accounting operations',
    head: 'Lisa Davis',
    members: ['Lisa Davis']
  },
  {
    name: 'Human Resources',
    description: 'Manages employee relations and organizational development',
    head: 'Jennifer Lee',
    members: ['Jennifer Lee']
  }
]

const getDepartmentColor = (department: string) => {
  const colors = {
    'IT': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Marketing': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'Sales': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'Finance': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    'HR': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
  }
  return colors[department as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}
</script>
