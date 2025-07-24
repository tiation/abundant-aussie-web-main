# Layout Components Documentation

## Overview

This document describes the newly implemented reusable core UI components that provide a comprehensive layout system for the company intranet application. The layout includes modern features like dark/light theme toggle, responsive design, and professional company branding.

## 🎨 Core Components

### 1. Header Component (`src/components/layout/Header.vue`)

The header component provides the top navigation with company branding and user management features.

**Features:**
- **Company Branding**
  - Dynamic company logo with fallback
  - Company name and tagline from environment variables
  - Gradient fallback logo with company initials
- **User Management**
  - User avatar and dropdown menu
  - User profile information display
  - Logout functionality
  - Auth state handling (login/register buttons for guests)
- **Notifications System**
  - Bell icon with notification count badge
  - Dropdown notifications panel
  - Timestamp formatting ("2h ago", etc.)
  - Placeholder for real notification data
- **Theme Toggle**
  - Sun/Moon icon toggle
  - Immediate theme switching
  - Persistence across sessions
- **Mobile Responsive**
  - Hamburger menu for mobile sidebar toggle
  - Optimized layout for different screen sizes

**Configuration via Environment Variables:**
```env
VITE_APP_NAME=Company Intranet
VITE_COMPANY_TAGLINE=Your Digital Workplace
```

### 2. Sidebar Component (`src/components/layout/Sidebar.vue`)

The sidebar provides navigation with collapsible functionality and comprehensive menu structure.

**Features:**
- **Navigation Structure**
  - Main navigation items (Dashboard, Projects, Team, Settings)
  - Secondary workspace items (Analytics, Files, Support)
  - Badge indicators for notifications/counts
- **Responsive Design**
  - Desktop: Collapsible to icon-only view
  - Mobile: Overlay sidebar with backdrop
  - Smooth transitions and animations
- **State Management**
  - Collapsed state persistence via localStorage
  - Mobile/desktop state detection
  - Keyboard shortcuts (Ctrl/Cmd + B)
- **Visual Features**
  - SVG icons for all navigation items
  - Hover states and active route highlighting
  - Company logo and branding
  - Version indicator when collapsed

**Navigation Items:**
- **Main:** Dashboard, Projects, Team, Calendar, Messages
- **Workspace:** Analytics, Files, Settings, Help & Support

### 3. Footer Component (`src/components/layout/Footer.vue`)

The footer provides comprehensive company information and legal links.

**Features:**
- **Company Information**
  - Logo, name, and description
  - Social media links (LinkedIn, Twitter, GitHub)
  - Customizable company description
- **Navigation Links**
  - Quick links to main app sections
  - Support and resource links
  - Legal compliance links (Privacy, Terms, Cookies)
- **System Information**
  - Version number and build info
  - System status indicator
  - Copyright information
- **Developer Features**
  - Development environment indicator
  - Build information display

**Configuration:**
```env
VITE_COMPANY_NAME=Your Company
VITE_COMPANY_DESCRIPTION=Empowering teams to collaborate...
VITE_APP_VERSION=1.0.0
VITE_BUILD_INFO=dev-build
```

### 4. AppLayout Component (`src/components/layout/AppLayout.vue`)

The main layout wrapper that orchestrates all components.

**Features:**
- **Layout Management**
  - Header, Sidebar, Footer coordination
  - Content area with proper spacing
  - Responsive behavior handling
- **State Management**
  - Sidebar collapse/expand state
  - Mobile sidebar overlay
  - Window resize handling
- **User Experience**
  - Global loading indicator
  - Keyboard shortcuts
  - Smooth animations
  - Auto-close mobile sidebar on desktop

**Keyboard Shortcuts:**
- `Ctrl/Cmd + B`: Toggle sidebar
- `Escape`: Close mobile sidebar

## 🎭 Theme System

### Theme Store (`src/stores/theme.ts`)

A Pinia store managing the dark/light theme system.

**Features:**
- **Theme Modes**
  - Light mode
  - Dark mode  
  - System preference detection
- **Persistence**
  - localStorage saving
  - Auto-restore on page load
- **System Integration**
  - Automatic dark mode based on OS preference
  - CSS class management (`dark` class on `<html>`)

**API:**
```typescript
const themeStore = useThemeStore()

// Toggle between light/dark
themeStore.toggleTheme()

// Set specific theme
themeStore.setTheme('dark')

// Current state
themeStore.isDark         // Boolean
themeStore.currentTheme   // 'light' | 'dark'
themeStore.mode          // 'light' | 'dark' | 'system'
```

## 🎨 Design System

### Color Palette
- **Primary:** Blue gradient (`#3B82F6` to `#8B5CF6`)
- **Success:** Green (`#10B981`)
- **Warning:** Yellow (`#F59E0B`)
- **Error:** Red (`#EF4444`)

### Dark Mode Support
- Automatic class-based dark mode
- Tailwind CSS `dark:` variants
- Smooth color transitions
- System preference detection

### Typography
- **Font:** Inter (system fallback)
- **Sizes:** Responsive typography scale
- **Weight:** 400-700 range

## 📱 Responsive Design

### Breakpoints
- **Mobile:** < 768px
- **Tablet:** 768px - 1024px  
- **Desktop:** > 1024px

### Mobile Optimizations
- Touch-friendly button sizes
- Overlay navigation
- Optimized spacing
- Swipe gestures support

## 🔧 Configuration

### Environment Variables

```env
# Application
VITE_APP_NAME=Company Intranet
VITE_APP_VERSION=1.0.0
VITE_BUILD_INFO=dev-build

# Company Branding
VITE_COMPANY_NAME=Your Company
VITE_COMPANY_TAGLINE=Your Digital Workplace
VITE_COMPANY_DESCRIPTION=Empowering teams to collaborate...
```

### Tailwind Configuration

Updated `tailwind.config.js`:
- Dark mode: `'class'`
- Custom color palette
- Typography plugin
- Forms plugin

## 🚀 Usage

### Basic Implementation

```vue
<template>
  <!-- For authenticated routes -->
  <AppLayout v-if="showLayout">
    <router-view />
  </AppLayout>
  
  <!-- For auth pages (login/register) -->
  <div v-else class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <router-view />
  </div>
</template>
```

### Component Integration

The layout is automatically applied to all authenticated routes. Individual page components just need to provide their content:

```vue
<template>
  <div>
    <h1>Page Title</h1>
    <p>Page content goes here</p>
  </div>
</template>
```

## 🎯 Features Implemented

- ✅ **Reusable core components** (Header, Sidebar, Footer)
- ✅ **Company branding** with logo, name, and tagline
- ✅ **User dropdown** with profile and logout
- ✅ **Notifications bell** with badge and dropdown
- ✅ **Collapsible sidebar** with main navigation
- ✅ **Navigation items** (Dashboard, Projects, Team, Settings)
- ✅ **Responsive footer** with company info and version
- ✅ **Dark/light theme toggle** with persistence
- ✅ **Mobile responsive design**
- ✅ **Keyboard shortcuts**
- ✅ **Environment-based configuration**

## 🔄 State Management

### Theme State
- Stored in Pinia (`useThemeStore`)
- Persisted in localStorage
- Automatic system preference detection

### Layout State
- Sidebar collapse state (localStorage)
- Mobile/desktop detection
- Window resize handling

### User State
- Authentication status
- User profile information
- Role-based access

## 🎨 Customization

### Logo Replacement
Replace `/public/company-logo.svg` with your company logo, or the system will show a gradient fallback with company initials.

### Color Scheme
Modify the Tailwind configuration in `tailwind.config.js` to change the color palette.

### Navigation Items
Update the navigation arrays in `Sidebar.vue` to customize menu items.

### Company Information
Use environment variables to customize all company-related text and branding.

## 🚀 Next Steps

The layout system is now ready for:
1. **Real API Integration** - Replace mock data with actual API calls
2. **Advanced Notifications** - Implement real-time notifications
3. **User Profile Management** - Add profile editing capabilities
4. **Role-Based Navigation** - Show/hide menu items based on user roles
5. **Analytics Integration** - Add usage tracking
6. **Accessibility** - WCAG compliance improvements

## 📁 File Structure

```
src/
├── components/
│   └── layout/
│       ├── Header.vue         # Top navigation
│       ├── Sidebar.vue        # Side navigation  
│       ├── Footer.vue         # Bottom footer
│       └── AppLayout.vue      # Main layout wrapper
├── stores/
│   ├── theme.ts              # Theme management
│   └── index.ts              # Store exports
└── App.vue                   # Layout integration
```

This layout system provides a solid foundation for a modern, professional company intranet with excellent user experience across all devices and themes.
