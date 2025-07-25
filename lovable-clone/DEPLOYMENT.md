# BuildAI - Netlify Deployment Guide

This guide will walk you through deploying BuildAI to Netlify.

## 🏗️ Pre-deployment Checklist

- [ ] All configuration files are in place (`netlify.toml`, `next.config.js`, `tailwind.config.js`, etc.)
- [ ] Dependencies are installed and up to date
- [ ] Application builds successfully locally
- [ ] Environment variables are documented

## 🔧 Configuration Files

The following configuration files have been created for optimal Netlify deployment:

- **`netlify.toml`** - Netlify-specific configuration with build settings, redirects, and security headers
- **`next.config.js`** - Next.js configuration optimized for Netlify deployment
- **`tailwind.config.js`** - Tailwind CSS configuration with BuildAI theme
- **`tsconfig.json`** - TypeScript configuration with path mapping
- **`postcss.config.js`** - PostCSS configuration for Tailwind CSS
- **`.env.example`** - Environment variables template

## 🚀 Deployment Steps

### 1. Prepare Your Repository

```bash
# Run the deployment preparation script
./deploy-netlify.sh
```

This script will:
- Install dependencies
- Run type checking
- Lint the code
- Build the application
- Verify everything is ready for deployment

### 2. Connect to Netlify

1. Go to [Netlify](https://netlify.com) and sign in
2. Click "New site from Git"
3. Choose your Git provider (GitHub, GitLab, etc.)
4. Select your BuildAI repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Node.js version**: `18` (set in Environment variables)

### 3. Environment Variables

Add the following environment variables in your Netlify dashboard (Site settings → Environment variables):

#### Required Variables

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
GOOGLE_AI_API_KEY=your_google_ai_api_key
NEXTAUTH_URL=https://your-site.netlify.app
NEXTAUTH_SECRET=your_nextauth_secret_key
```

#### Optional Variables

```
DATABASE_URL=your_database_connection_string
NEXT_PUBLIC_API_URL=https://your-site.netlify.app/api
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_AI_CHAT=true
NEXT_PUBLIC_ENABLE_AUTHENTICATION=true
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

### 4. Deploy

Once you've configured everything:
1. Click "Deploy site"
2. Netlify will automatically build and deploy your site
3. Your BuildAI application will be available at your Netlify URL

## 🔧 Build Configuration

### Build Settings

The `netlify.toml` file configures:
- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Node.js version**: `18`
- **Next.js plugin**: Automatic serverless function handling

### Security Headers

Automatically configured security headers include:
- X-Frame-Options
- X-XSS-Protection
- Content Security Policy
- Referrer Policy

### Performance Optimization

- Static asset caching (1 year for immutable assets)
- Optimized bundle splitting
- Image optimization settings
- SWC minification enabled

## 🐛 Troubleshooting

### Common Issues

#### Build Fails
```bash
# Check for TypeScript errors
npm run type-check

# Check for linting errors
npm run lint

# Try building locally
npm run build
```

#### Environment Variables Not Working
- Ensure environment variables are set in Netlify dashboard
- Prefix client-side variables with `NEXT_PUBLIC_`
- Redeploy after adding new environment variables

#### Authentication Issues
- Verify `NEXTAUTH_URL` matches your Netlify domain
- Check `NEXTAUTH_SECRET` is set and secure
- Ensure callback URLs are configured in your auth providers

#### API Routes Not Working
- Check that API routes are in the correct `/api` directory
- Verify serverless functions are enabled
- Check function logs in Netlify dashboard

### Performance Issues

#### Slow Build Times
- Consider optimizing bundle splitting in `next.config.js`
- Review and remove unused dependencies
- Use Netlify's build cache

#### Large Bundle Size
- Use dynamic imports for large components
- Optimize images and assets
- Consider code splitting strategies

## 📊 Monitoring & Analytics

### Built-in Analytics

BuildAI includes:
- **PostHog**: User analytics and feature flags
- **Next.js Analytics**: Performance monitoring
- **Error Boundaries**: Automatic error tracking

### Netlify Analytics

Enable Netlify Analytics for additional insights:
- Page views and unique visitors
- Top pages and referrers
- Bandwidth usage

## 🔄 Continuous Deployment

Once configured, Netlify will automatically:
- Deploy when you push to your main branch
- Run build previews for pull requests
- Send deployment notifications

### Branch Deploys

Configure branch deployments for:
- **Production**: `main` or `master` branch
- **Staging**: `develop` or `staging` branch
- **Feature**: Any other branch (optional)

## 🚨 Production Checklist

Before going live:
- [ ] All API keys are secure and production-ready
- [ ] Domain is configured (if using custom domain)
- [ ] SSL certificate is active
- [ ] Analytics are properly configured
- [ ] Error monitoring is set up
- [ ] Performance is optimized
- [ ] SEO meta tags are configured
- [ ] Social media sharing is tested

## 📞 Support

If you encounter issues during deployment:

1. Check the [Netlify Documentation](https://docs.netlify.com/)
2. Review [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
3. Check the build logs in Netlify dashboard
4. Consult the [BuildAI repository issues](https://github.com/tiation-repos/buildai/issues)

---

**Happy Deploying! 🎉**

Your BuildAI application will be live and ready to help users create amazing websites with AI assistance.
