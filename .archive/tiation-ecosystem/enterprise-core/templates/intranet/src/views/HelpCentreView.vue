<template>
  <div>
    <!-- Breadcrumb Navigation -->
    <Breadcrumbs />

    <!-- Page Header with Search -->
    <div class="md:flex md:items-center md:justify-between mb-8">
      <div class="flex-1 min-w-0">
        <h1 class="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
          Help Centre
        </h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Find answers, get support, and learn how to make the most of our platform.
        </p>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="mb-8">
      <div class="max-w-2xl mx-auto">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search help articles, FAQs, tutorials..."
            class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white dark:bg-gray-800 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:placeholder-gray-400 dark:focus:placeholder-gray-500 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 sm:text-sm transition-colors"
          />
          <div v-if="searchQuery" class="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              @click="clearSearch"
              class="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Search Results or Main Content -->
    <div v-if="searchQuery && filteredContent.length > 0" class="mb-8">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Search Results ({{ filteredContent.length }})
      </h2>
      <div class="space-y-4">
        <div
          v-for="item in filteredContent"
          :key="item.id"
          class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
          @click="openArticle(item)"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">{{ item.title }}</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">{{ item.excerpt }}</p>
              <div class="flex items-center space-x-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {{ item.category }}
                </span>
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  {{ item.readTime }} min read
                </span>
              </div>
            </div>
            <svg class="h-5 w-5 text-gray-400 dark:text-gray-500 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- No Search Results -->
    <div v-else-if="searchQuery && filteredContent.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No results found</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Try different keywords or browse the categories below.
      </p>
    </div>

    <!-- Main Help Centre Content -->
    <div v-else>
      <!-- Quick Help Section -->
      <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 mb-8">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-2xl font-bold text-white mb-2">Need Help?</h2>
          <p class="text-blue-100 mb-6">Get instant answers to common questions or contact our support team.</p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              @click="openLiveChat"
              class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 transition-colors"
            >
              <svg class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Live Chat
            </button>
            <button
              @click="contactSupport"
              class="inline-flex items-center px-6 py-3 border border-white border-opacity-60 text-base font-medium rounded-md text-white hover:bg-white hover:bg-opacity-10 transition-colors"
            >
              <svg class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Support
            </button>
          </div>
        </div>
      </div>

      <!-- Popular Articles -->
      <div class="mb-12">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Popular Articles</h2>
          <button class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors">
            View all articles
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="article in popularArticles"
            :key="article.id"
            class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
            @click="openArticle(article)"
          >
            <div class="flex items-center mb-3">
              <div class="flex-shrink-0">
                <div class="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <svg class="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
              <div class="ml-3 flex-1">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  {{ article.category }}
                </span>
              </div>
            </div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">{{ article.title }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">{{ article.excerpt }}</p>
            <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>{{ article.readTime }} min read</span>
              <span>{{ article.views }} views</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Help Categories -->
      <div class="mb-12">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">Browse by Category</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="category in helpCategories"
            :key="category.id"
            class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all cursor-pointer"
            @click="browseCategory(category)"
          >
            <div class="flex items-center mb-4">
              <div :class="category.iconBg" class="h-10 w-10 rounded-lg flex items-center justify-center">
                <svg :class="category.iconColor" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="category.iconPath" />
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ category.name }}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ category.articleCount }} articles</p>
              </div>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ category.description }}</p>
          </div>
        </div>
      </div>

      <!-- FAQ Section -->
      <div class="mb-12">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
        <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
          <div
            v-for="faq in frequentQuestions"
            :key="faq.id"
            class="p-6"
          >
            <button
              @click="toggleFaq(faq.id)"
              class="w-full flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-2 -m-2"
            >
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ faq.question }}</h3>
              <svg
                :class="{ 'rotate-180': faq.isOpen }"
                class="h-5 w-5 text-gray-500 dark:text-gray-400 transform transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div
              v-show="faq.isOpen"
              class="mt-4 prose prose-sm max-w-none text-gray-600 dark:text-gray-400"
              v-html="faq.answer"
            ></div>
          </div>
        </div>
      </div>

      <!-- Contact Support -->
      <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-8 text-center">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Still need help?</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Our support team is here to help you with any questions or issues.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            @click="contactSupport"
            class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <svg class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contact Support
          </button>
          <button
            @click="viewTickets"
            class="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <svg class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a1 1 0 001 1h1a1 1 0 001-1V7a2 2 0 00-2-2H5zM5 14a2 2 0 00-2 2v3a1 1 0 001 1h1a1 1 0 001-1v-3a2 2 0 00-2-2H5z" />
            </svg>
            View My Tickets
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import Breadcrumbs from '../components/ui/Breadcrumbs.vue'

// Search functionality
const searchQuery = ref('')

// Mock data (replace with real API calls)
const popularArticles = ref([
  {
    id: 1,
    title: 'Getting Started with Your Account',
    excerpt: 'Learn how to set up your profile, configure settings, and get the most out of your account.',
    category: 'Getting Started',
    readTime: 5,
    views: 1234
  },
  {
    id: 2,
    title: 'Managing Team Projects',
    excerpt: 'A comprehensive guide to creating, organizing, and collaborating on team projects.',
    category: 'Projects',
    readTime: 8,
    views: 856
  },
  {
    id: 3,
    title: 'Understanding User Permissions',
    excerpt: 'Learn about different user roles, permissions, and how to manage access controls.',
    category: 'Administration',
    readTime: 6,
    views: 742
  },
  {
    id: 4,
    title: 'Troubleshooting Login Issues',
    excerpt: 'Common solutions for login problems, password resets, and account access issues.',
    category: 'Account',
    readTime: 4,
    views: 2156
  },
  {
    id: 5,
    title: 'Mobile App Guide',
    excerpt: 'How to download, install, and use our mobile application effectively.',
    category: 'Mobile',
    readTime: 7,
    views: 623
  },
  {
    id: 6,
    title: 'Data Export and Backup',
    excerpt: 'Learn how to export your data, create backups, and ensure data security.',
    category: 'Data Management',
    readTime: 10,
    views: 445
  }
])

const helpCategories = ref([
  {
    id: 1,
    name: 'Getting Started',
    description: 'Learn the basics and get up and running quickly',
    articleCount: 12,
    iconBg: 'bg-green-100 dark:bg-green-900',
    iconColor: 'text-green-600 dark:text-green-400',
    iconPath: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
  },
  {
    id: 2,
    name: 'Account Management',
    description: 'Manage your profile, settings, and account preferences',
    articleCount: 8,
    iconBg: 'bg-blue-100 dark:bg-blue-900',
    iconColor: 'text-blue-600 dark:text-blue-400',
    iconPath: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
  },
  {
    id: 3,
    name: 'Projects & Collaboration',
    description: 'Work with teams, manage projects, and collaborate effectively',
    articleCount: 15,
    iconBg: 'bg-purple-100 dark:bg-purple-900',
    iconColor: 'text-purple-600 dark:text-purple-400',
    iconPath: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
  },
  {
    id: 4,
    name: 'Security & Privacy',
    description: 'Keep your data safe and understand our privacy policies',
    articleCount: 6,
    iconBg: 'bg-red-100 dark:bg-red-900',
    iconColor: 'text-red-600 dark:text-red-400',
    iconPath: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
  },
  {
    id: 5,
    name: 'Integrations',
    description: 'Connect with third-party tools and services',
    articleCount: 10,
    iconBg: 'bg-indigo-100 dark:bg-indigo-900',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    iconPath: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1'
  },
  {
    id: 6,
    name: 'Troubleshooting',
    description: 'Resolve common issues and technical problems',
    articleCount: 18,
    iconBg: 'bg-yellow-100 dark:bg-yellow-900',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    iconPath: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
  }
])

const frequentQuestions = reactive([
  {
    id: 1,
    question: 'How do I reset my password?',
    answer: '<p>To reset your password:</p><ol><li>Click on "Forgot Password" on the login page</li><li>Enter your email address</li><li>Check your email for a reset link</li><li>Follow the instructions in the email to create a new password</li></ol>',
    isOpen: false
  },
  {
    id: 2,
    question: 'How can I update my profile information?',
    answer: '<p>You can update your profile by:</p><ol><li>Going to Settings from the user menu</li><li>Selecting "Profile" from the left sidebar</li><li>Making your desired changes</li><li>Clicking "Save Changes" to apply the updates</li></ol>',
    isOpen: false
  },
  {
    id: 3,
    question: 'What browsers are supported?',
    answer: '<p>We support the latest versions of:</p><ul><li>Google Chrome (recommended)</li><li>Mozilla Firefox</li><li>Safari</li><li>Microsoft Edge</li></ul><p>For the best experience, we recommend using Chrome or Firefox.</p>',
    isOpen: false
  },
  {
    id: 4,
    question: 'How do I invite team members?',
    answer: '<p>To invite team members:</p><ol><li>Navigate to the Team page</li><li>Click "Invite Members" button</li><li>Enter email addresses of people you want to invite</li><li>Select their role and permissions</li><li>Click "Send Invitations"</li></ol>',
    isOpen: false
  },
  {
    id: 5,
    question: 'Is my data secure?',
    answer: '<p>Yes, we take data security seriously:</p><ul><li>All data is encrypted in transit and at rest</li><li>Regular security audits and penetration testing</li><li>SOC 2 Type II compliant</li><li>GDPR and CCPA compliant</li><li>24/7 monitoring and threat detection</li></ul>',
    isOpen: false
  }
])

// All content for search
const allContent = computed(() => [
  ...popularArticles.value,
  // Add more content types here as needed
])

// Filtered content based on search
const filteredContent = computed(() => {
  if (!searchQuery.value) return []
  
  const query = searchQuery.value.toLowerCase()
  return allContent.value.filter(item =>
    item.title.toLowerCase().includes(query) ||
    item.excerpt.toLowerCase().includes(query) ||
    item.category.toLowerCase().includes(query)
  )
})

// Methods
const clearSearch = () => {
  searchQuery.value = ''
}

const openArticle = (article: any) => {
  console.log('Opening article:', article.title)
  // Implement navigation to article detail page
}

const browseCategory = (category: any) => {
  console.log('Browsing category:', category.name)
  // Implement navigation to category page
}

const toggleFaq = (faqId: number) => {
  const faq = frequentQuestions.find(f => f.id === faqId)
  if (faq) {
    faq.isOpen = !faq.isOpen
  }
}

const openLiveChat = () => {
  console.log('Opening live chat')
  // Implement live chat functionality
}

const contactSupport = () => {
  console.log('Opening contact support')
  // Implement contact support functionality
}

const viewTickets = () => {
  console.log('Viewing support tickets')
  // Implement support ticket viewing
}
</script>

<style scoped>
.prose {
  color: inherit;
}

.prose ol {
  list-style-type: decimal;
  margin-left: 1.5rem;
}

.prose ul {
  list-style-type: disc;
  margin-left: 1.5rem;
}

.prose li {
  margin: 0.25rem 0;
}

.prose p {
  margin: 0.5rem 0;
}
</style>
