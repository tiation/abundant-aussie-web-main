# Welcome to Caleb Stands Strong Web

🌐 **Live Site**: [https://tiation.github.io/caleb-stands-strong-web](https://tiation.github.io/caleb-stands-strong-web)

This documentation will guide you through setting up, deploying, and managing your own version of the site. Whether you're a complete beginner or experienced developer, this guide will help you get started!

## Table of Contents

1. [Introduction](#introduction)
2. [Quick Start for Beginners](#quick-start-for-beginners)
3. [Prerequisites](#prerequisites)
4. [Setting Up GitHub](#setting-up-github)
5. [Deploying with Vercel](#deploying-with-vercel)
6. [Using GitHub Pages](#using-github-pages)
7. [Running the Project Locally](#running-the-project-locally)
8. [Making Your First Changes](#making-your-first-changes)
9. [Common Issues](#common-issues)

## Introduction

Caleb Stands Strong Web is a modern, responsive website built with React and Vite, featuring:
- ⚡ Lightning-fast performance with optimized builds
- 📱 Mobile-first responsive design
- 🔒 Enterprise-grade security configurations
- 🚀 Automated deployment pipelines
- 📊 Built-in analytics and monitoring
- 🛡️ Error boundaries and graceful error handling

## Quick Start for Beginners

**New to web development?** No problem! Follow these steps:

1. **Create a GitHub account** at [github.com](https://github.com)
2. **Fork this repository** by clicking the "Fork" button at the top of the GitHub page
3. **Enable GitHub Pages** in your fork's settings (see detailed steps below)
4. **Your site will be live** at `https://YOUR-USERNAME.github.io/caleb-stands-strong-web`

That's it! You now have your own version of the site running online. 🎉

## Prerequisites

- GitHub account
- Basic understanding of command line
- Node.js and npm installed on your machine

## Setting Up GitHub

1. **Sign Up**
   - Go to [GitHub](https://github.com/) and create an account.
2. **Install GitHub CLI**
   - Follow the official [GitHub CLI installation guide](https://cli.github.com/manual/installation).
3. **Clone the Repository**
   - Open your terminal and run:
     ```shell
     git clone https://github.com/your-username/caleb-stands-strong-web.git
     cd caleb-stands-strong-web
     ```

## Deploying with Vercel

1. **Vercel Account**
   - Sign up for a [Vercel account](https://vercel.com/).
2. **Connect Repository**
   - Use the Vercel dashboard to connect your GitHub repository.
3. **Configure Deployments**
   - Set up any environment variables and build settings in Vercel.

## Using GitHub Pages

**GitHub Pages is free hosting for your website!** Here's how to set it up:

### 1. Enable GitHub Pages (Step-by-step)

1. **Go to your repository** on GitHub.com
2. **Click the 'Settings' tab** (it's at the top of your repo page)
3. **Scroll down to 'Pages'** in the left sidebar
4. **Under 'Source'**, select "Deploy from a branch"
5. **Choose 'main' branch** and '/ (root)' folder
6. **Click 'Save'**

🎉 **That's it!** Your site will be available at:
`https://YOUR-USERNAME.github.io/caleb-stands-strong-web`

### 2. Wait for Deployment
- GitHub will take 1-10 minutes to build and deploy your site
- You'll see a green checkmark in the 'Actions' tab when it's ready
- Any future changes you push to the `main` branch will automatically update your live site!

### 3. Custom Domain (Optional)
- Want your own domain like `www.yoursite.com`?
- Follow [GitHub's custom domain guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- You'll need to purchase a domain and configure DNS settings

## Running the Project Locally

1. **Install Dependencies**
   ```shell
   npm install
   ```
2. **Run Development Server**
   ```shell
   npm run dev
   ```
3. **View Your Site**
   - Open your browser and go to `http://localhost:5173`
   - You'll see your site running locally!

## Making Your First Changes

**Ready to customize the site?** Here's how to get started:

### 1. Edit Content
- **Main content**: Look in `src/components/` for React components
- **Styles**: Check `src/styles/` for CSS and styling files
- **Images**: Add your images to `public/images/`

### 2. Test Your Changes
```shell
# Run locally to test
npm run dev

# Build to make sure everything works
npm run build
```

### 3. Deploy Your Changes
```shell
# Add your changes
git add .

# Commit with a meaningful message
git commit -m "Update homepage content"

# Push to GitHub (this triggers automatic deployment!)
git push origin main
```

**✨ Pro Tip**: Your changes will automatically appear on your live site within a few minutes thanks to GitHub Actions!

### 4. Common Customizations
- **Change colors**: Edit CSS variables in `src/styles/main.css`
- **Update text**: Look for text content in React components
- **Add pages**: Create new components and update routing
- **Replace images**: Add new images to `public/images/` and update references

## Common Issues

### 🚨 Build Errors

**Problem**: Site won't build or deploy
**Solutions**:
```shell
# Install missing dependencies
npm install terser --save-dev

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Test build locally
npm run build
```

### 🔐 Environment Variables

**Problem**: Features not working (analytics, etc.)
**Solution**: Check that environment variables are set up correctly
- Look at `.env.example` for required variables
- Set them in GitHub repository settings > Secrets and variables > Actions

### 🌐 GitHub Pages Not Working

**Problem**: Site not appearing at GitHub Pages URL
**Solutions**:
1. **Check Actions tab** - look for failed deployments (red X)
2. **Verify Pages settings** - make sure source is set to 'main' branch
3. **Wait longer** - initial deployment can take up to 10 minutes
4. **Check repository is public** - private repos need GitHub Pro for Pages

### 💻 Local Development Issues

**Problem**: `npm run dev` not working
**Solutions**:
```shell
# Make sure Node.js is installed (version 16+)
node --version

# Install dependencies
npm install

# Clear cache
npm cache clean --force
```

### 🆘 Still Need Help?

1. **Check the [GitHub Issues](https://github.com/tiation/caleb-stands-strong-web/issues)** for similar problems
2. **Create a new issue** with details about your problem
3. **Include error messages** and what you were trying to do
4. **Refer to official documentation**:
   - [GitHub Pages Guide](https://docs.github.com/en/pages)
   - [Vercel Documentation](https://vercel.com/docs)
   - [React Documentation](https://react.dev/)

**Remember**: Every developer encounters issues - it's part of the learning process! 💪
