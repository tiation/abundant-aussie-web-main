#!/bin/bash

# Build Script for Abundant Aussie Web
# Part of ChaseWhiteRabbit NGO CI/CD Pipeline

set -e  # Exit on any error

echo "🚀 Starting build process for Abundant Aussie Web..."

# Environment detection
if [ -z "$NODE_ENV" ]; then
    NODE_ENV="production"
fi

echo "📋 Environment: $NODE_ENV"

# Check for required tools
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    exit 1
fi

if ! command -v bun &> /dev/null; then
    echo "⚠️  Bun is not installed, falling back to npm"
    PACKAGE_MANAGER="npm"
else
    PACKAGE_MANAGER="bun"
    echo "✅ Using Bun as package manager"
fi

# Install dependencies
echo "📦 Installing dependencies..."
if [ "$PACKAGE_MANAGER" = "bun" ]; then
    bun install --frozen-lockfile
else
    npm ci
fi

# Run linting
echo "🔍 Running code quality checks..."
if [ "$PACKAGE_MANAGER" = "bun" ]; then
    bun run lint
else
    npm run lint
fi

# Run TypeScript check
echo "🔧 Running TypeScript type checking..."
if [ "$PACKAGE_MANAGER" = "bun" ]; then
    bunx tsc --noEmit
else
    npx tsc --noEmit
fi

# Build the application
echo "🏗️  Building application..."
if [ "$NODE_ENV" = "development" ]; then
    if [ "$PACKAGE_MANAGER" = "bun" ]; then
        bun run build:dev
    else
        npm run build:dev
    fi
else
    if [ "$PACKAGE_MANAGER" = "bun" ]; then
        bun run build
    else
        npm run build
    fi
fi

# Verify build output
if [ ! -d "dist" ]; then
    echo "❌ Build failed - dist directory not found"
    exit 1
fi

echo "✅ Build completed successfully!"
echo "📁 Build output available in dist/ directory"
echo "📊 Build size:"
du -sh dist/

echo "🎉 Build process completed for ChaseWhiteRabbit NGO project!"
