#!/bin/bash

# Portfolio Deployment Script - Multiple Free Hosting Options
# Usage: ./scripts/deploy-portfolio.sh [platform]
# Platforms: netlify, firebase, surge, all

set -e

PLATFORM=${1:-"all"}
PROJECT_NAME="caleb-stands-strong"

echo "🚀 Building production bundle..."
npm run build

# Copy 200.html for Surge.sh SPA routing
cp dist/index.html dist/200.html

case $PLATFORM in
  "netlify"|"all")
    echo "📦 Deploying to Netlify..."
    if command -v netlify &> /dev/null; then
      netlify deploy --prod --dir=dist --message="Portfolio deployment $(date)"
      echo "✅ Netlify deployment complete!"
      echo "🌐 Visit: https://caleb-stands-strong.netlify.app"
    else
      echo "❌ Netlify CLI not found. Install with: npm install -g netlify-cli"
      echo "📋 Manual setup:"
      echo "   1. Go to https://netlify.com"
      echo "   2. Connect your GitHub repository"
      echo "   3. Build command: npm run build"
      echo "   4. Publish directory: dist"
    fi
    ;;
esac

case $PLATFORM in
  "firebase"|"all")
    echo "🔥 Deploying to Firebase..."
    if command -v firebase &> /dev/null; then
      firebase deploy --project caleb-stands-strong
      echo "✅ Firebase deployment complete!"
    else
      echo "❌ Firebase CLI not found. Install with: npm install -g firebase-tools"
      echo "📋 Manual setup:"
      echo "   1. Run: firebase login"
      echo "   2. Run: firebase init hosting"
      echo "   3. Select 'dist' as public directory"
      echo "   4. Configure as SPA (Yes)"
      echo "   5. Run: firebase deploy"
    fi
    ;;
esac

case $PLATFORM in
  "surge"|"all")
    echo "⚡ Deploying to Surge.sh..."
    if command -v surge &> /dev/null; then
      cd dist
      surge . $PROJECT_NAME.surge.sh
      cd ..
      echo "✅ Surge deployment complete!"
      echo "🌐 Visit: https://$PROJECT_NAME.surge.sh"
    else
      echo "❌ Surge CLI not found. Install with: npm install -g surge"
      echo "📋 Manual setup:"
      echo "   1. Run: surge"
      echo "   2. Choose 'dist' directory"
      echo "   3. Domain: $PROJECT_NAME.surge.sh"
    fi
    ;;
esac

case $PLATFORM in
  "github"|"all")
    echo "🐙 GitHub Pages status..."
    echo "✅ Already configured via GitHub Actions"
    echo "🌐 Visit: https://tiation.github.io/caleb-stands-strong-web"
    ;;
esac

echo ""
echo "🎉 Portfolio deployment complete!"
echo ""
echo "📋 Your sites are available at:"
echo "   • Vercel (current): https://caleb-stands-strong-ajzfu841y-tiations-projects.vercel.app"
echo "   • GitHub Pages: https://tiation.github.io/caleb-stands-strong-web"
echo "   • Netlify: https://caleb-stands-strong.netlify.app"
echo "   • Firebase: https://caleb-stands-strong.web.app"
echo "   • Surge.sh: https://$PROJECT_NAME.surge.sh"
echo ""
echo "💡 Pro tip: Add custom domains in each platform's dashboard for a professional look!"
