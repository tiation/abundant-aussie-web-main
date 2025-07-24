#!/bin/bash

# Tiation GitHub Workspace Cleanup Script
# Enterprise-grade cleanup for optimal space utilization

set -e

echo "🚀 Starting Tiation Workspace Cleanup..."
echo "📊 Analyzing current space usage..."

# Function to display space saved
calculate_space_saved() {
    echo "💾 Calculating space savings..."
    df -h . | tail -1
}

# Store initial space usage
INITIAL_SPACE=$(du -sh . | cut -f1)
echo "📈 Initial workspace size: $INITIAL_SPACE"

echo "🧹 Phase 1: Node Modules Cleanup"
echo "Removing node_modules directories (can be regenerated with npm/yarn install)..."

# Find and remove node_modules directories
find . -name "node_modules" -type d -prune -exec rm -rf {} + 2>/dev/null || true

echo "✅ Node modules cleanup complete"

echo "🧹 Phase 2: Build Artifacts Cleanup"
echo "Removing build directories and artifacts..."

# Remove build directories (regeneratable)
find . -name "build" -type d -path "*/ios/*" -prune -exec rm -rf {} + 2>/dev/null || true
find . -name "dist" -type d -not -path "*/node_modules/*" -prune -exec rm -rf {} + 2>/dev/null || true
find . -name ".next" -type d -prune -exec rm -rf {} + 2>/dev/null || true

echo "✅ Build artifacts cleanup complete"

echo "🧹 Phase 3: Cache and Temporary Files"
echo "Removing cache and temporary files..."

# Remove various cache directories
find . -name ".cache" -type d -prune -exec rm -rf {} + 2>/dev/null || true
find . -name "tmp" -type d -prune -exec rm -rf {} + 2>/dev/null || true
find . -name "temp" -type d -prune -exec rm -rf {} + 2>/dev/null || true

# Remove iOS build artifacts
find . -name "*.dSYM" -type d -prune -exec rm -rf {} + 2>/dev/null || true
find . -name "DerivedData" -type d -prune -exec rm -rf {} + 2>/dev/null || true

# Remove Android build artifacts  
find . -name ".gradle" -type d -prune -exec rm -rf {} + 2>/dev/null || true

# Remove package manager caches
find . -name ".pnpm-store" -type d -prune -exec rm -rf {} + 2>/dev/null || true
find . -name ".yarn/cache" -type d -prune -exec rm -rf {} + 2>/dev/null || true

echo "✅ Cache and temporary files cleanup complete"

echo "🧹 Phase 4: Log and Debug Files"
echo "Removing log files and debug artifacts..."

# Remove log files
find . -name "*.log" -type f -size +10M -delete 2>/dev/null || true
find . -name "npm-debug.log*" -type f -delete 2>/dev/null || true
find . -name "yarn-debug.log*" -type f -delete 2>/dev/null || true

echo "✅ Log files cleanup complete"

echo "🧹 Phase 5: Git Cleanup"
echo "Cleaning git repositories..."

# Clean git repositories
find . -name ".git" -type d -exec sh -c 'cd "$1/.." && git gc --prune=now --aggressive 2>/dev/null || true' _ {} \;

echo "✅ Git cleanup complete"

# Calculate final space usage
FINAL_SPACE=$(du -sh . | cut -f1)
echo ""
echo "🎉 Cleanup Complete!"
echo "📊 Initial size: $INITIAL_SPACE"
echo "📊 Final size: $FINAL_SPACE"
echo ""
echo "✨ Enterprise workspace optimized!"
echo ""
echo "🔄 To restore dependencies:"
echo "  • Run 'npm install' or 'yarn install' in project directories"
echo "  • Run 'pod install' in iOS project directories"
echo "  • Rebuild projects as needed"
echo ""
echo "🏢 Workspace is now enterprise-grade optimized!"
