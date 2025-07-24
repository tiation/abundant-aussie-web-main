#!/bin/bash

# GitHub Pages Deployment Script
# This script builds the project and deploys it to the gh-pages branch

set -e

echo "🏗️  Building the project..."
npm run build

echo "📁 Switching to gh-pages branch..."
git checkout gh-pages

echo "🧹 Cleaning up old files..."
git rm -rf . --quiet

echo "📋 Copying new build files..."
cp -r dist/* .

echo "🗑️  Cleaning up dist folder..."
rm -rf dist

echo "✅ Adding files to git..."
git add .

echo "💾 Committing changes..."
git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')"

echo "🚀 Pushing to GitHub..."
git push origin gh-pages

echo "🔄 Switching back to main branch..."
git checkout main

echo "✨ Deployment complete! Your site will be available at:"
echo "   https://tiation.github.io/company-intranet/"
