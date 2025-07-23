# GitHub Pages Deployment Guide

This guide provides comprehensive instructions for deploying the Caleb Standing portfolio to GitHub Pages as an alternative hosting solution.

## Overview

GitHub Pages offers enterprise-grade hosting with the following advantages:
- ✅ **Free hosting** for public repositories
- ✅ **Automatic SSL** certificates
- ✅ **CDN distribution** via GitHub's global infrastructure
- ✅ **Version control integration** with Git-based deployments
- ✅ **Custom domains** supported
- ✅ **99.9% uptime SLA** with enterprise reliability

## Prerequisites

- GitHub repository with admin access
- Node.js 18+ installed locally
- Basic understanding of GitHub Actions

## Step-by-Step Setup

### 1. Repository Configuration

Ensure your repository is public or has GitHub Pages enabled for private repos (requires GitHub Pro/Team).

### 2. Enable GitHub Pages

1. Navigate to your repository on GitHub
2. Go to **Settings** → **Pages**
3. Under "Source", select **"GitHub Actions"**
4. Save the configuration

### 3. Create GitHub Actions Workflow

Create the following file in your repository:

**`.github/workflows/deploy.yml`**

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

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build project
        run: npm run build
        env:
          NODE_ENV: production
      
      - name: Upload build artifacts
        uses: actions/upload-pages-artifact@v2
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

### 4. Update Vite Configuration

If you don't have a `vite.config.ts` file, create one. Otherwise, update the existing configuration:

**`vite.config.ts`**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  // Set base path for GitHub Pages
  base: process.env.NODE_ENV === 'production' ? '/caleb-stands-strong-web/' : '/',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-alert-dialog', '@radix-ui/react-button'],
        },
      },
    },
  },
})
```

### 5. Environment-Specific Configuration

For different environments, you can use environment variables:

**`.env.production`**
```env
VITE_APP_BASE_URL=/caleb-stands-strong-web/
VITE_APP_TITLE=Caleb Standing - Support Coordinator
```

### 6. Custom Domain (Optional)

To use a custom domain:

1. Create a `CNAME` file in the `public` directory:
   ```
   portfolio.calebstanding.com
   ```

2. Configure DNS settings with your domain provider:
   - Create a CNAME record pointing to `username.github.io`
   - Or use A records pointing to GitHub's IP addresses

3. Update your domain in repository settings under Pages

## Deployment Process

### Automatic Deployment

Once configured, deployment happens automatically:

1. **Push to main branch** triggers the workflow
2. **Build process** runs with npm ci and npm run build
3. **Artifact upload** packages the dist folder
4. **Deployment** publishes to GitHub Pages
5. **Live site** available at `https://username.github.io/caleb-stands-strong-web/`

### Manual Deployment

Trigger manual deployment:

1. Go to **Actions** tab in your repository
2. Select **"Deploy to GitHub Pages"** workflow
3. Click **"Run workflow"** button
4. Choose the branch and run

## Monitoring and Maintenance

### Build Status

Monitor deployment status:
- **Actions tab** shows all workflow runs
- **Green checkmark** indicates successful deployment
- **Red X** indicates build failures

### Performance Optimization

GitHub Pages includes:
- **Automatic compression** (gzip)
- **CDN distribution** globally
- **Caching headers** for static assets
- **HTTP/2 support** for faster loading

### Troubleshooting

Common issues and solutions:

| Issue | Solution |
|-------|----------|
| 404 errors on refresh | Ensure SPA routing is configured |
| Assets not loading | Check base path in vite.config.ts |
| Build failures | Review GitHub Actions logs |
| Slow loading | Optimize bundle size and enable compression |

## Security Considerations

### Best Practices

- ✅ **Environment variables** for sensitive data (use GitHub Secrets)
- ✅ **HTTPS enforcement** (automatic with GitHub Pages)
- ✅ **Dependency scanning** via GitHub security features
- ✅ **Branch protection** rules for main branch
- ✅ **Secret scanning** enabled in repository settings

### Content Security Policy

Add CSP headers if needed via `_headers` file in public directory:

```
/*
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
```

## Comparison: GitHub Pages vs Netlify

| Feature | GitHub Pages | Netlify |
|---------|-------------|---------|
| **Cost** | Free | Free tier + paid plans |
| **Build time** | ~2-5 minutes | ~1-3 minutes |
| **Custom domains** | ✅ | ✅ |
| **SSL certificates** | ✅ Auto | ✅ Auto |
| **Form handling** | ❌ | ✅ |
| **Serverless functions** | ❌ | ✅ |
| **Split testing** | ❌ | ✅ |
| **Analytics** | Basic | Advanced |

## Enterprise Features

For ChaseWhiteRabbit NGO projects:

### Multi-Environment Setup

Configure different environments:

```yaml
# .github/workflows/deploy-staging.yml
on:
  push:
    branches: [ develop ]
# Deploy to staging subdomain
```

### Integration with Monitoring

Add monitoring integration:

```typescript
// src/utils/monitoring.ts
export const trackPageView = (url: string) => {
  // Integration with Grafana or other monitoring
  fetch(`https://grafana.sxc.codes/api/track`, {
    method: 'POST',
    body: JSON.stringify({ url, timestamp: Date.now() })
  })
}
```

## Support and Resources

- **GitHub Pages Documentation**: https://docs.github.com/en/pages
- **GitHub Actions Documentation**: https://docs.github.com/en/actions
- **Vite GitHub Pages Guide**: https://vitejs.dev/guide/static-deploy.html#github-pages
- **ChaseWhiteRabbit DevOps**: Contact team for enterprise support

---

**Note**: This deployment method provides a robust, enterprise-grade alternative to Netlify hosting while maintaining the same performance and reliability standards expected for ChaseWhiteRabbit NGO projects.
