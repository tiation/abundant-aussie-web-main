# BuildAI - Complete Setup & Deployment Guide

This comprehensive guide covers setting up BuildAI for development and deploying to Netlify.

## 📋 Prerequisites

- Node.js 18+ and npm 8+
- Git
- A Netlify account
- (Optional) Supabase account for authentication
- (Optional) OpenAI API key for AI features
- (Optional) PostHog account for analytics

## 🚀 Quick Start

### 1. Clone and Setup

```bash
# Navigate to project directory
cd /path/to/your/buildai-project

# Install dependencies
npm install --legacy-peer-deps

# Copy environment template
cp .env.example .env.local

# Edit .env.local with your actual values
nano .env.local
```

### 2. Development

```bash
# Start development server
npm run dev

# The app will be available at http://localhost:3000
```

### 3. Build and Test

```bash
# Build the application
npm run build

# Start production server locally
npm start

# Run tests
npm test

# Type check
npm run type-check

# Lint code
npm run lint
```

## 🔧 Configuration Files Created

The following files have been created for optimal deployment:

### Core Configuration

- **`package.json`** - Dependencies and scripts for BuildAI
- **`next.config.js`** - Next.js 13 configuration with app directory
- **`tailwind.config.js`** - Custom BuildAI theme and styling
- **`tsconfig.json`** - TypeScript configuration with path mapping
- **`postcss.config.js`** - PostCSS for Tailwind CSS processing

### Deployment Configuration

- **`netlify.toml`** - Netlify build and deployment settings
- **`.env.example`** - Environment variables template
- **`deploy-netlify.sh`** - Automated deployment preparation script
- **`DEPLOYMENT.md`** - Detailed deployment instructions

## 🌐 Netlify Deployment

### Method 1: Automated Script

```bash
# Make script executable (if not already)
chmod +x deploy-netlify.sh

# Run deployment preparation
./deploy-netlify.sh
```

### Method 2: Manual Steps

1. **Install dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Test build locally**:
   ```bash
   npm run build
   ```

3. **Commit changes**:
   ```bash
   git add .
   git commit -m "feat: add Netlify deployment configuration"
   git push origin main
   ```

4. **Deploy on Netlify**:
   - Go to [Netlify](https://app.netlify.com)
   - Click "New site from Git"
   - Select your repository
   - Configure build settings:
     * **Build command**: `npm run build && npm run export`
     * **Publish directory**: `out`
     * **Node version**: `18` (in environment variables)

## 🔑 Environment Variables

### Required for Full Functionality

Add these in your Netlify dashboard (Site settings → Environment variables):

```env
# Core Configuration
NODE_VERSION=18
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# Authentication (Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# AI Features (OpenAI)
OPENAI_API_KEY=sk-your-openai-api-key

# Authentication (NextAuth)
NEXTAUTH_URL=https://your-site.netlify.app
NEXTAUTH_SECRET=your-secure-secret-key

# Analytics (PostHog)
NEXT_PUBLIC_POSTHOG_KEY=phc_your-posthog-key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### Optional Variables

```env
# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_AI_CHAT=true
NEXT_PUBLIC_ENABLE_AUTHENTICATION=true

# Database (if using direct connection)
DATABASE_URL=postgresql://username:password@host:port/database

# Email (for contact forms)
SENDGRID_API_KEY=SG.your-sendgrid-key
```

## 🎨 Theme & Styling

BuildAI comes with a comprehensive design system:

### Colors
- **Primary**: Blue color palette for main branding
- **Secondary**: Gray scale for text and backgrounds
- **Accent**: Red color palette for highlights
- **AI Theme**: Purple, blue, cyan gradients for AI features

### Typography
- **Sans**: Inter font family for body text
- **Display**: Poppins for headings
- **Mono**: JetBrains Mono for code

### Components
- Responsive design system
- Dark mode support
- Accessible color contrasts
- Smooth animations and transitions

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
npm run lint:fix
```

### Build Testing
```bash
npm run build
npm start
```

## 📊 Features Included

### Core Features
- ✅ Next.js 13 with App Directory
- ✅ TypeScript configuration
- ✅ Tailwind CSS with custom theme
- ✅ Responsive design
- ✅ Dark mode support
- ✅ SEO optimization

### Authentication
- ✅ Supabase integration ready
- ✅ NextAuth.js configuration
- ✅ Protected routes setup
- ✅ User management

### AI Integration
- ✅ OpenAI API integration
- ✅ Chat interface components
- ✅ AI-powered features
- ✅ Free tier optimization

### Analytics & Monitoring
- ✅ PostHog analytics
- ✅ Performance monitoring
- ✅ Error tracking
- ✅ User behavior insights

### Development Tools
- ✅ ESLint configuration
- ✅ Prettier formatting
- ✅ Husky pre-commit hooks
- ✅ Jest testing setup

## 🚨 Troubleshooting

### Common Issues

#### Permission Errors
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

#### Build Failures
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

#### Dependency Issues
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

#### Environment Variables
- Ensure all required variables are set
- Use `NEXT_PUBLIC_` prefix for client-side variables
- Redeploy Netlify site after adding variables

### Getting Help

1. **Check build logs** in Netlify dashboard
2. **Review error messages** carefully
3. **Test locally** before deploying
4. **Consult documentation**:
   - [Next.js Docs](https://nextjs.org/docs)
   - [Netlify Docs](https://docs.netlify.com)
   - [Tailwind CSS Docs](https://tailwindcss.com/docs)

## 🎯 Next Steps

After successful deployment:

1. **Configure custom domain** (optional)
2. **Set up authentication providers**
3. **Add content and pages**
4. **Optimize performance**
5. **Set up monitoring**
6. **Configure analytics**

## 📈 Performance Optimization

### Built-in Optimizations
- **SWC minification** for faster builds
- **Bundle splitting** for optimal loading
- **Image optimization** with Next.js Image component
- **Static asset caching** with long-term headers
- **Code splitting** for better performance

### Monitoring
- **Core Web Vitals** tracking
- **Performance metrics** with PostHog
- **Error boundaries** for graceful failures
- **Loading states** for better UX

## 🔒 Security

### Implemented Security Measures
- **Content Security Policy** headers
- **XSS protection** enabled
- **Frame options** to prevent clickjacking
- **Secure authentication** with Supabase/NextAuth
- **Environment variable** security
- **HTTPS enforcement** on Netlify

---

## 🎉 Deployment Success!

Once deployed, your BuildAI application will be available at your Netlify URL. The application includes:

- **Landing page** with hero section and features
- **Authentication system** ready for user sign-up/login
- **AI chat interface** for building websites
- **Responsive design** that works on all devices
- **Analytics tracking** for user insights
- **SEO optimization** for search visibility

**Your BuildAI platform is now ready to help users create amazing websites with AI assistance!**
