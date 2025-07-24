#!/bin/bash

# Tiation Interactive Demos - GitHub Pages Deployment Script
# Author: TiaAstor (tiatheone@protonmail.com)

echo "🚀 Deploying Tiation Interactive Demos to GitHub Pages..."

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html not found. Please run this script from the project root."
    exit 1
fi

# Build and prepare for deployment
echo "📦 Preparing files for deployment..."

# Create .nojekyll file to bypass Jekyll processing if needed
touch .nojekyll

# Add git repository if not already initialized
if [ ! -d ".git" ]; then
    echo "🔧 Initializing git repository..."
    git init
    git branch -M gh-pages
fi

# Add and commit all changes
echo "📝 Committing changes..."
git add .
git commit -m "Deploy interactive demos - $(date '+%Y-%m-%d %H:%M:%S')"

# Check if remote exists, if not add it
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "🔗 Adding remote origin..."
    echo "Please create a GitHub repository named 'tiation-interactive-demos' first"
    echo "Then run: git remote add origin https://github.com/tiaastor/tiation-interactive-demos.git"
    exit 1
fi

# Push to GitHub Pages
echo "⬆️  Pushing to GitHub Pages..."
git push -u origin gh-pages --force

echo "✅ Deployment complete!"
echo "🌐 Your site will be available at: https://tiaastor.github.io/tiation-interactive-demos"
echo ""
echo "📋 Next steps:"
echo "1. Go to your GitHub repository settings"
echo "2. Navigate to 'Pages' section"
echo "3. Set source to 'Deploy from a branch'"
echo "4. Select 'gh-pages' branch"
echo "5. Click 'Save'"
echo ""
echo "🎉 Your interactive demos will be live in a few minutes!"
