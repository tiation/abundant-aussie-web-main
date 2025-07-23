# Caleb Standing - Support Coordinator Portfolio

A modern, responsive portfolio website showcasing Caleb Standing's professional services as a Support Coordinator, built with React, TypeScript, and Tailwind CSS.

## 🌟 Features

- **Modern Design**: Clean, accessible interface with smooth animations
- **Responsive Layout**: Optimized for all devices and screen sizes
- **Interactive Elements**: Engaging hover effects and transitions
- **Professional Branding**: Consistent color scheme and typography
- **Contact Integration**: Easy ways to get in touch and learn more about services
- **Error Boundaries**: Comprehensive error handling with monitoring integration
- **Performance Optimized**: Built with Vite for fast loading and optimal performance

## 🚀 Live Demo

**View the live portfolio**: [https://caleb-stands-strong-portfolio.netlify.app](https://caleb-stands-strong-portfolio.netlify.app)

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Build Tool**: Vite
- **Deployment**: Netlify
- **Error Monitoring**: Grafana integration
- **Performance**: Gzip & Brotli compression

## 📱 Services Highlighted

- Support Coordination
- NDIS Planning Support
- Advocacy Services
- Community Connection
- Goal Achievement Support

## 🏗️ Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Deployment

### Primary Deployment (Netlify)

The site is automatically deployed to Netlify on every push to the main branch. The deployment includes:

- Optimized production build
- CDN distribution
- Automatic compression
- SSL certificate
- Error boundary monitoring

### Alternative Deployment (GitHub Pages)

For additional deployment flexibility or as a backup hosting solution, this project can also be deployed to GitHub Pages:

#### Setup GitHub Pages Deployment

1. **Enable GitHub Pages**:
   - Go to your repository's Settings → Pages
   - Select "GitHub Actions" as the source

2. **GitHub Actions Workflow**:
   Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main ]
     workflow_dispatch:
   
   permissions:
     contents: read
     pages: write
     id-token: write
   
   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
             node-version: '18'
             cache: 'npm'
         - run: npm ci
         - run: npm run build
         - uses: actions/upload-pages-artifact@v2
           with:
             path: ./dist
     
     deploy:
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       runs-on: ubuntu-latest
       needs: build
       steps:
         - uses: actions/deploy-pages@v2
           id: deployment
   ```

3. **Vite Configuration**:
   Update `vite.config.ts` for GitHub Pages:
   ```typescript
   export default defineConfig({
     // ... existing config
     base: '/caleb-stands-strong-web/', // Replace with your repo name
   })
   ```

4. **Access Your Site**:
   - URL: `https://[username].github.io/caleb-stands-strong-web/`
   - Custom domain supported via CNAME file in public directory

#### Benefits of GitHub Pages
- **Free hosting** for public repositories
- **Version control integration** with automatic deployments
- **Custom domains** supported with SSL
- **CDN distribution** via GitHub's infrastructure
- **Branch-based deployments** for staging/preview
- **Enterprise-grade reliability** with 99.9% uptime SLA

#### Use Cases
- **Backup deployment** if primary hosting fails
- **Preview deployments** for pull requests
- **Development/staging** environments
- **Cost-effective scaling** for multiple projects

## 📄 License

© 2025 Caleb Standing. All rights reserved.

---

**Always Standing By You** - Professional support coordination services in Australia.
