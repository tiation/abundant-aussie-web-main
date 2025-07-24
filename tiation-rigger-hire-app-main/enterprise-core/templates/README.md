# 🏢 Enterprise Templates

This directory contains clean, git-history-free templates for rapid Tiation project creation.

## 📁 Available Templates

### 🔵 React Template (`react/`)
**Purpose:** Modern React applications with enterprise standards
**Features:**
- ⚛️ React 18 with TypeScript
- 🎨 Dark neon theme (cyan/magenta)
- 📱 Mobile-first responsive design
- 🛠️ Vite build system
- 🧩 Shadcn/ui components
- 📊 Built-in SaaS patterns

**Quick Start:**
```bash
cp -r enterprise-core/templates/react/ ../new-react-project/
cd ../new-react-project/
npm install && npm run dev
```

### 🟢 Svelte Template (`svelte/`)
**Purpose:** Lightweight Svelte applications for modern web development
**Features:**
- ⚡ SvelteKit with TypeScript
- 🎨 Dark neon enterprise theme
- 📱 Mobile-optimized components
- 🚀 Vite + PostCSS
- 💰 SaaS pricing components
- 🏭 Industry presets

**Quick Start:**
```bash
cp -r enterprise-core/templates/svelte/ ../new-svelte-project/
cd ../new-svelte-project/
npm install && npm run dev
```

### 🔷 Intranet Template (`intranet/`)
**Purpose:** Corporate intranet and internal tool development
**Features:**
- 🏢 Vue 3 with TypeScript
- 👥 Employee management system
- 📊 Dashboard with analytics
- 🔐 Authentication patterns
- 📅 Calendar integration
- ⚙️ Settings management

**Quick Start:**
```bash
cp -r enterprise-core/templates/intranet/ ../new-intranet-project/
cd ../new-intranet-project/
npm install && npm run dev
```

## 🛠️ Template Features

### 🎨 Design Standards
- **Dark Neon Theme:** Cyan (#00d4aa) + Magenta (#ff6b9d)
- **Mobile-First:** Responsive design from 320px up
- **Enterprise Typography:** Professional font hierarchy
- **Accessibility:** WCAG 2.1 AA compliance

### 🔧 Technical Standards
- **TypeScript:** Full type safety across all templates
- **Modern Build Tools:** Vite for fast development
- **Code Quality:** ESLint + Prettier configuration
- **CI/CD Ready:** GitHub Actions workflows included

### 💼 Enterprise Patterns
- **Component Architecture:** Reusable UI components
- **State Management:** Pinia (Vue) / Zustand (React) / Svelte stores
- **API Integration:** Standardized service patterns
- **Error Handling:** Comprehensive error boundaries

## 📋 Usage Instructions

### 1. Copy Template
```bash
# Choose your template
cp -r enterprise-core/templates/[react|svelte|intranet]/ ../your-project-name/
```

### 2. Initialize Project
```bash
cd ../your-project-name/
npm install
```

### 3. Customize
- Update `package.json` name and details
- Modify branding in assets/
- Configure environment variables
- Customize theme colors if needed

### 4. Start Development
```bash
npm run dev
```

## 🏗️ Template Customization

### Branding
- Logo: Replace `public/favicon.ico` and assets
- Colors: Update `tailwind.config.*` theme section
- Fonts: Modify CSS custom properties

### Features
- Add/remove components from `src/components/`
- Modify routing in respective router files
- Update API endpoints in service files

## 📚 Additional Resources

- **Branding Guidelines:** `../branding/`
- **Configuration Patterns:** `../configuration/`
- **Documentation Templates:** `../documentation/`
- **Workflow Templates:** `../workflows/`

## 🔄 Template Updates

Templates are maintained as clean copies without git history for:
- ⚡ Faster project initialization
- 🧹 Cleaner project structure
- 🚀 Reduced repository size
- 📦 Easier distribution

## 💡 Pro Tips

- Use `scripts/create-new-project.sh` for automated setup
- Run mobile audits with included scripts
- Follow the naming convention: `tiation-[category]-[name]`
- Implement dark theme toggle in settings

---

**Template Version:** 1.0  
**Last Updated:** July 19, 2025  
**Maintainer:** Tiation Enterprise Team
