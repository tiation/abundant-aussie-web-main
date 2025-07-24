# 🔮 Tiation SvelteKit Enterprise Template

## 🎯 Purpose
This is the official Tiation enterprise-grade SvelteKit template, designed to create consistent, professional, and mobile-optimized applications across the Tiation ecosystem.

## 🚀 Quick Start

### Option 1: Automated Creation (Recommended)
```bash
cd /Users/tiaastor/tiation-github/tiation-svelte-enterprise-template
./scripts/create-new-project.sh your-new-project-name
```

### Option 2: Manual Creation
```bash
# 1. Copy template
cd /Users/tiaastor/tiation-github
cp -r tiation-svelte-enterprise-template your-new-project

# 2. Navigate and customize
cd your-new-project
./scripts/customize-template.sh

# 3. Initialize git repository
git init
git add .
git commit -m "feat: initial project setup from tiation-svelte-enterprise-template"
git branch -M main
git remote add origin https://github.com/tiation/your-repo-name.git
git push -u origin main
```

## 📐 Naming Convention

### Required Pattern
```
tiation-[category]-[type]-[name]
```

### Categories
- `ai` - AI/Machine Learning
- `cms` - Content Management
- `svelte` - SvelteKit apps
- `react` - React apps
- `rigger` - Mining/Construction
- `terminal` - CLI tools
- `docker` - Containers/DevOps
- `mobile` - Mobile apps

### Types
- `platform` - Large platforms
- `app` - Applications
- `tool` - Utility tools
- `template` - Templates
- `dashboard` - Analytics/monitoring
- `api` - API services

### Examples
- ✅ `tiation-ai-analytics-platform`
- ✅ `tiation-svelte-dashboard-tool`
- ✅ `tiation-rigger-safety-app`
- ❌ `my-cool-app`
- ❌ `tiation_analytics_app`

## 🎨 Features Included

### Enterprise-Grade Structure
- ✅ Professional README with badges and sections
- ✅ Comprehensive documentation structure
- ✅ GitHub Actions for automated deployment
- ✅ Contributing guidelines and templates
- ✅ Enterprise support information

### Tiation Branding
- ✅ Dark neon theme (cyan/magenta gradients)
- ✅ Custom Tailwind configuration
- ✅ Tiation ecosystem integration
- ✅ Professional typography (Quicksand, Space Grotesk)
- ✅ Mobile-first responsive design

### Technical Stack
- ✅ SvelteKit with TypeScript
- ✅ TailwindCSS with Skeleton UI
- ✅ Vite build system
- ✅ ESLint + Prettier
- ✅ Vitest testing setup
- ✅ GitHub Pages deployment

## 📝 Template Placeholders

The following placeholders will be replaced during customization:

### Project Information
- `{{PROJECT_NAME}}` - Full project name
- `{{PROJECT_SLUG}}` - URL-safe project identifier
- `{{GITHUB_REPO_NAME}}` - GitHub repository name
- `{{PROJECT_DESCRIPTION}}` - Brief description
- `{{PROJECT_DESCRIPTION_DETAILED}}` - Detailed description

### Features
- `{{FEATURE_1_TITLE}}` / `{{FEATURE_1_DESCRIPTION}}`
- `{{FEATURE_2_TITLE}}` / `{{FEATURE_2_DESCRIPTION}}`
- `{{FEATURE_3_TITLE}}` / `{{FEATURE_3_DESCRIPTION}}`

### Technical Details
- `{{DOMAIN_NAME}}` - Business domain
- `{{API_NAME}}` - API service name
- `{{BACKEND_SERVICE}}` - Backend service name
- `{{BACKEND_TECHNOLOGY}}` - Backend tech stack
- `{{DATABASE_TECHNOLOGY}}` - Database system
- `{{DATA_LAYER}}` - Data persistence layer
- `{{BUSINESS_LOGIC}}` - Core business logic

### Core Features
- `{{CORE_FEATURE_1}}` through `{{CORE_FEATURE_4}}`
- Plus corresponding descriptions

### Requirements & Usage
- `{{ADDITIONAL_REQUIREMENTS}}` - Extra system requirements
- `{{SYSTEM_REQUIREMENTS}}` - Minimum system specs
- `{{BASIC_USAGE_INSTRUCTIONS}}` - How to use (basic)
- `{{ADVANCED_USAGE_INSTRUCTIONS}}` - Advanced usage
- `{{USAGE_EXAMPLES}}` - Code examples

## 🛠️ Customization Process

### 1. Project Creation
Run the creation script:
```bash
./scripts/create-new-project.sh tiation-your-category-project-name
```

### 2. Template Customization
The script will prompt for:
- Project details (name, description, repository)
- Feature information (3 main features)
- Technical stack details
- Core functionality (4 main features)
- Usage instructions and examples

### 3. Post-Customization
After customization:
1. Review all generated files
2. Update any missed placeholders
3. Add actual screenshots and assets
4. Test the application locally
5. Push to GitHub and verify deployment

## 📁 Generated Structure

```
your-new-project/
├── .github/workflows/       # GitHub Actions
│   └── deploy.yml          # Automated deployment
├── docs/                   # Documentation
├── src/                    # Source code
│   ├── lib/               # Shared components
│   ├── routes/            # SvelteKit routes
│   ├── app.html           # HTML template
│   ├── app.postcss        # Global styles
│   └── app.d.ts           # Type definitions
├── static/                 # Static assets
├── package.json           # Dependencies & scripts
├── tailwind.config.ts     # Tailwind configuration
├── svelte.config.js       # SvelteKit configuration
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite configuration
├── README.md              # Project documentation
└── CONTRIBUTING.md        # Contribution guidelines
```

## 🔍 Pre-Creation Checklist

Before creating a new project:

1. **Search for existing projects**:
   ```bash
   find /Users/tiaastor/tiation-github/ -name "*keyword*" -type d
   ```

2. **Check project registry**:
   Review `PROJECT-NAMING-SYSTEM.md` for existing projects

3. **Validate naming convention**:
   Ensure follows `tiation-[category]-[type]-[name]` pattern

4. **Verify uniqueness**:
   No similar functionality exists in ecosystem

## 🎯 Best Practices

### Development
1. **Follow Tiation conventions** - Use established patterns
2. **Mobile-first design** - Always optimize for mobile
3. **Dark neon theme** - Maintain visual consistency
4. **Enterprise standards** - Professional code quality

### Documentation
1. **Complete README** - Fill all sections thoroughly
2. **Clear installation** - Step-by-step instructions
3. **Usage examples** - Practical code samples
4. **Architecture diagrams** - Visual system overview

### Deployment
1. **GitHub Pages ready** - Automated deployment included
2. **Responsive design** - Test on all screen sizes
3. **Performance optimized** - Fast loading times
4. **SEO optimized** - Proper meta tags included

## 📚 Resources

### Documentation
- [PROJECT-NAMING-SYSTEM.md](PROJECT-NAMING-SYSTEM.md) - Complete naming guide
- [Tiation Ecosystem](https://github.com/tiation) - Related projects
- [SvelteKit Docs](https://kit.svelte.dev/) - Framework documentation
- [Skeleton UI](https://www.skeleton.dev/) - Component library

### Templates & Examples
- [Tiation Headscale Admin](../network-headscale-admin) - Reference implementation
- [Tiation AI Platform](../tiation-ai-platform) - Large-scale example
- [Rigger Workspace](../tiation-rigger-workspace) - Multi-app example

## 🆘 Support

### Issues
- Template bugs: Create issue in this repository
- Project-specific: Use project's own issue tracker
- General questions: Tiation discussions

### Contact
- Email: [tiatheone@protonmail.com](mailto:tiatheone@protonmail.com)
- GitHub: [@tiation](https://github.com/tiation)

---

<div align="center">
  <p>
    <strong>Built with ❤️ by the Tiation Team</strong>
  </p>
  <p>
    <a href="https://github.com/tiation">
      <img src="https://img.shields.io/badge/Powered%20by-Tiation-cyan.svg" alt="Powered by Tiation">
    </a>
  </p>
</div>
