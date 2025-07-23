<template>
  <div class="p-6">
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Manage your account settings and preferences
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Sidebar -->
      <div class="lg:col-span-1">
        <nav class="space-y-1">
          <button
            v-for="section in sections"
            :key="section.id"
            @click="activeSection = section.id"
            :class="[
              activeSection === section.id
                ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                : 'border-transparent text-gray-900 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700',
              'group border-l-4 px-3 py-2 flex items-center text-sm font-medium w-full text-left'
            ]"
          >
            <component
              :is="section.icon"
              :class="[
                activeSection === section.id ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500',
                'flex-shrink-0 -ml-1 mr-3 h-5 w-5'
              ]"
            />
            <span class="truncate">{{ section.name }}</span>
          </button>
        </nav>
      </div>

      <!-- Content -->
      <div class="lg:col-span-3">
        <!-- Profile Section -->
        <div v-if="activeSection === 'profile'" class="space-y-6">
          <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Profile Information
              </h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Update your account profile information and email address.
              </p>
              
              <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <!-- Avatar -->
                <div class="sm:col-span-6">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Photo
                  </label>
                  <div class="mt-1 flex items-center">
                    <img
                      :src="profile.avatar"
                      :alt="profile.name"
                      class="h-12 w-12 rounded-full"
                    />
                    <button
                      type="button"
                      class="ml-5 bg-white dark:bg-gray-700 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Change
                    </button>
                  </div>
                </div>

                <!-- Name -->
                <div class="sm:col-span-3">
                  <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Full Name
                  </label>
                  <input
                    id="name"
                    v-model="profile.name"
                    type="text"
                    class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <!-- Email -->
                <div class="sm:col-span-3">
                  <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Address
                  </label>
                  <input
                    id="email"
                    v-model="profile.email"
                    type="email"
                    class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <!-- Department -->
                <div class="sm:col-span-3">
                  <label for="department" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Department
                  </label>
                  <select
                    id="department"
                    v-model="profile.department"
                    class="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:text-white"
                  >
                    <option value="IT">IT</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>

                <!-- Role -->
                <div class="sm:col-span-3">
                  <label for="role" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Role
                  </label>
                  <input
                    id="role"
                    v-model="profile.role"
                    type="text"
                    disabled
                    class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-600 dark:text-gray-300"
                  />
                </div>
              </div>

              <div class="mt-6">
                <button
                  type="button"
                  class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Security Section -->
        <div v-if="activeSection === 'security'" class="space-y-6">
          <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Change Password
              </h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Update your password to keep your account secure.
              </p>
              
              <div class="mt-6 grid grid-cols-1 gap-y-6">
                <div>
                  <label for="current-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Current Password
                  </label>
                  <input
                    id="current-password"
                    v-model="security.currentPassword"
                    type="password"
                    class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label for="new-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    New Password
                  </label>
                  <input
                    id="new-password"
                    v-model="security.newPassword"
                    type="password"
                    class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label for="confirm-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Confirm New Password
                  </label>
                  <input
                    id="confirm-password"
                    v-model="security.confirmPassword"
                    type="password"
                    class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div class="mt-6">
                <button
                  type="button"
                  class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>

          <!-- Two-Factor Authentication -->
          <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Two-Factor Authentication
              </h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Add an extra layer of security to your account.
              </p>
              
              <div class="mt-6 flex items-center justify-between">
                <div class="flex items-center">
                  <div
                    :class="[
                      security.twoFactorEnabled ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-600',
                      'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200'
                    ]"
                    @click="security.twoFactorEnabled = !security.twoFactorEnabled"
                  >
                    <span
                      :class="[
                        security.twoFactorEnabled ? 'translate-x-5' : 'translate-x-0',
                        'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                      ]"
                    />
                  </div>
                  <span class="ml-3 text-sm font-medium text-gray-900 dark:text-white">
                    {{ security.twoFactorEnabled ? 'Enabled' : 'Disabled' }}
                  </span>
                </div>
                
                <button
                  v-if="!security.twoFactorEnabled"
                  type="button"
                  class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Setup 2FA
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Preferences Section -->
        <div v-if="activeSection === 'preferences'" class="space-y-6">
          <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Display Preferences
              </h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Customize how the application looks and behaves.
              </p>
              
              <div class="mt-6 space-y-6">
                <!-- Theme -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Theme
                  </label>
                  <div class="mt-2 space-y-2">
                    <label class="inline-flex items-center">
                      <input
                        v-model="preferences.theme"
                        type="radio"
                        value="light"
                        class="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Light</span>
                    </label>
                    <label class="inline-flex items-center ml-6">
                      <input
                        v-model="preferences.theme"
                        type="radio"
                        value="dark"
                        class="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Dark</span>
                    </label>
                    <label class="inline-flex items-center ml-6">
                      <input
                        v-model="preferences.theme"
                        type="radio"
                        value="system"
                        class="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">System</span>
                    </label>
                  </div>
                </div>

                <!-- Language -->
                <div>
                  <label for="language" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Language
                  </label>
                  <select
                    id="language"
                    v-model="preferences.language"
                    class="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:text-white"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>

                <!-- Timezone -->
                <div>
                  <label for="timezone" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Timezone
                  </label>
                  <select
                    id="timezone"
                    v-model="preferences.timezone"
                    class="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:text-white"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                  </select>
                </div>
              </div>

              <div class="mt-6">
                <button
                  type="button"
                  class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Notifications Section -->
        <div v-if="activeSection === 'notifications'" class="space-y-6">
          <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Notification Settings
              </h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Choose what notifications you want to receive.
              </p>
              
              <div class="mt-6 space-y-6">
                <div v-for="notification in notifications" :key="notification.type" class="flex items-center justify-between">
                  <div>
                    <h4 class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ notification.title }}
                    </h4>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      {{ notification.description }}
                    </p>
                  </div>
                  <div
                    :class="[
                      notification.enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600',
                      'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200'
                    ]"
                    @click="notification.enabled = !notification.enabled"
                  >
                    <span
                      :class="[
                        notification.enabled ? 'translate-x-5' : 'translate-x-0',
                        'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                      ]"
                    />
                  </div>
                </div>
              </div>

              <div class="mt-6">
                <button
                  type="button"
                  class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save Notification Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'

// Icons (simplified for this example)
const UserIcon = 'svg'
const ShieldIcon = 'svg'
const CogIcon = 'svg'
const BellIcon = 'svg'

const authStore = useAuthStore()
const activeSection = ref('profile')

const sections = [
  { id: 'profile', name: 'Profile', icon: UserIcon },
  { id: 'security', name: 'Security', icon: ShieldIcon },
  { id: 'preferences', name: 'Preferences', icon: CogIcon },
  { id: 'notifications', name: 'Notifications', icon: BellIcon }
]

const profile = ref({
  name: authStore.user?.name || '',
  email: authStore.user?.email || '',
  department: authStore.user?.department || '',
  role: authStore.user?.role || '',
  avatar: authStore.user?.avatar || ''
})

const security = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  twoFactorEnabled: false
})

const preferences = ref({
  theme: 'system',
  language: 'en',
  timezone: 'America/New_York'
})

const notifications = ref([
  {
    type: 'email',
    title: 'Email Notifications',
    description: 'Receive notifications via email',
    enabled: true
  },
  {
    type: 'project_updates',
    title: 'Project Updates',
    description: 'Get notified about project status changes',
    enabled: true
  },
  {
    type: 'team_mentions',
    title: 'Team Mentions',
    description: 'Get notified when someone mentions you',
    enabled: true
  },
  {
    type: 'system_alerts',
    title: 'System Alerts',
    description: 'Important system maintenance and security alerts',
    enabled: false
  }
])
</script>
