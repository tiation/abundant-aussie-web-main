#!/bin/bash
# Push all Rigger repositories with new documentation to GitHub
# ChaseWhiteRabbit NGO - Enterprise Documentation Standards

set -euo pipefail

REPOS=(
    "RiggerConnect-web" 
    "RiggerBackend"
    "RiggerConnect-android"
    "RiggerConnect-ios"
    "RiggerHub-web"
    "RiggerHub-android" 
    "RiggerHub-ios"
    "RiggerShared"
)

BASE_DIR="/Users/tiaastor/Github/tiation-repos"
COMMIT_MESSAGE="🏗️ Add enterprise-grade documentation structure

- Added comprehensive docs/ structure with API, architecture, security, testing, and ethics documentation
- Implemented ChaseWhiteRabbit NGO ethical technology standards
- Created striking visual README with enterprise-grade design
- Added DevOps automation scripts and CI/CD readiness
- Included responsible AI guidelines and bias prevention protocols
- Enhanced security documentation with GDPR compliance
- Implemented comprehensive testing strategies
- Added ethical framework for worker empowerment technology

Part of ChaseWhiteRabbit NGO initiative for ethical blue-collar technology"

echo "🏗️ ChaseWhiteRabbit NGO - Pushing documentation updates to all repositories..."
echo ""

for repo in "${REPOS[@]}"; do
    echo "📁 Processing $repo..."
    cd "$BASE_DIR/$repo"
    
    # Check if we're in a git repository
    if [ ! -d ".git" ]; then
        echo "❌ $repo is not a git repository. Skipping..."
        continue
    fi
    
    # Add all changes
    git add -A
    
    # Check if there are changes to commit
    if git diff --staged --quiet; then
        echo "✅ $repo - No changes to commit"
    else
        echo "📝 $repo - Committing changes..."
        git commit -m "$COMMIT_MESSAGE"
        echo "✅ $repo - Changes committed"
    fi
    
    # Push to remote
    echo "🚀 $repo - Pushing to remote..."
    if git push; then
        echo "✅ $repo - Successfully pushed to remote"
    else
        echo "❌ $repo - Failed to push to remote"
    fi
    
    echo ""
done

echo "🎉 All repositories processed!"
echo "📚 Enterprise documentation standards implemented across Rigger ecosystem"
echo "🏆 ChaseWhiteRabbit NGO ethical technology standards applied"
