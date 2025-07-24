#!/bin/bash

# BuildAI Netlify Deployment Script
# This script prepares the application for Netlify deployment

set -e

echo "🚀 Preparing BuildAI for Netlify deployment..."

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if required files exist
echo "📋 Checking required configuration files..."

if [ ! -f "netlify.toml" ]; then
    echo "❌ Error: netlify.toml not found. Please ensure it exists."
    exit 1
fi

if [ ! -f "next.config.js" ]; then
    echo "❌ Error: next.config.js not found. Please ensure it exists."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --legacy-peer-deps

# Type check
echo "🔍 Running type check..."
npm run type-check

# Lint the code
echo "🧹 Linting code..."
npm run lint

# Build the application
echo "🏗️  Building application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Build output is in the .next directory"
    echo ""
    echo "🌐 Ready for Netlify deployment!"
    echo ""
    echo "📝 Next steps:"
    echo "1. Commit and push your changes to Git"
    echo "2. Connect your repository to Netlify"
    echo "3. Set the following build settings in Netlify:"
    echo "   - Build command: npm run build"
    echo "   - Publish directory: .next"
    echo "4. Add your environment variables in Netlify dashboard"
    echo ""
    echo "🔑 Required environment variables:"
    echo "   - NEXT_PUBLIC_SUPABASE_URL"
    echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "   - NEXT_PUBLIC_POSTHOG_KEY"
    echo "   - NEXT_PUBLIC_POSTHOG_HOST"
    echo "   - OPENAI_API_KEY"
    echo "   - NEXTAUTH_URL"
    echo "   - NEXTAUTH_SECRET"
else
    echo "❌ Build failed! Please fix the errors and try again."
    exit 1
fi
