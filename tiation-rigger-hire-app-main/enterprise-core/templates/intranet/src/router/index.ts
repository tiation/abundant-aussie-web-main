import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
    meta: { public: true }
  },
  
  // Public routes (guest only)
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { requiresGuest: true, public: true }
  },
  {
    path: '/register',
    name: 'Register', 
    component: () => import('../views/RegisterView.vue'),
    meta: { requiresGuest: true, public: true }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('../views/ForgotPasswordView.vue'),
    meta: { requiresGuest: true, public: true }
  },
  
  // Protected routes (requires authentication)
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { requiresAuth: true, title: 'Dashboard' }
  },
  {
    path: '/projects',
    name: 'Projects',
    component: () => import('../views/ProjectsView.vue'),
    meta: { requiresAuth: true, title: 'Projects' }
  },
  {
    path: '/team',
    name: 'Team',
    component: () => import('../views/TeamView.vue'),
    meta: { requiresAuth: true, title: 'Team' }
  },
  {
    path: '/employees',
    name: 'Employees',
    component: () => import('../views/EmployeesView.vue'),
    meta: { requiresAuth: true, title: 'Employees' }
  },
  {
    path: '/departments',
    name: 'Departments',
    component: () => import('../views/DepartmentsView.vue'),
    meta: { requiresAuth: true, title: 'Departments' }
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: () => import('../views/CalendarView.vue'),
    meta: { requiresAuth: true, title: 'Calendar' }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/SettingsView.vue'),
    meta: { requiresAuth: true, title: 'Settings' }
  },
  
  // 404 route - must be last
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue'),
    meta: { title: 'Page Not Found' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Initialize auth if not already done
  if (!authStore.user && !authStore.isLoading) {
    await authStore.initializeAuth()
  }
  
  const isAuthenticated = authStore.isAuthenticated
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)
  
  // Set page title
  if (to.meta.title) {
    document.title = `${to.meta.title} - Company Intranet`
  } else {
    document.title = 'Company Intranet'
  }
  
  // Handle authentication redirects
  if (requiresAuth && !isAuthenticated) {
    // Redirect to login if route requires auth and user is not authenticated
    next({
      name: 'Login',
      query: { redirect: to.fullPath }
    })
    return
  }
  
  if (requiresGuest && isAuthenticated) {
    // Redirect to dashboard if route requires guest and user is authenticated
    const redirectPath = from.query.redirect as string
    if (redirectPath && redirectPath !== '/login' && redirectPath !== '/register') {
      next(redirectPath)
    } else {
      next({ name: 'Dashboard' })
    }
    return
  }
  
  // Handle JWT token refresh
  if (isAuthenticated && authStore.token) {
    // Check if token needs refresh (implement token expiry check here)
    // For now, we'll skip automatic refresh
  }
  
  next()
})

// After each route change
router.afterEach(() => {
  // You can add analytics tracking here
  // window.gtag?.('config', 'GA_MEASUREMENT_ID', {
  //   page_path: to.path,
  // })
})

export default router
