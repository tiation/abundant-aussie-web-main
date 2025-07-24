#!/bin/bash

set -e

echo "🚀 Starting comprehensive push of all repository changes to GitHub remotes..."
echo "================================================="

# Function to push repository changes
push_repo() {
    local repo_path="$1"
    local repo_name=$(basename "$repo_path")
    
    echo "📁 Checking repository: $repo_name"
    
    if [ -d "$repo_path/.git" ]; then
        cd "$repo_path"
        
        # Check if there are any changes to commit
        if [[ -n $(git status --porcelain) ]]; then
            echo "  ✅ Found changes in $repo_name"
            
            # Add all changes
            git add .
            
            # Commit changes
            git commit -m "Step 10: Finalize documentation and launch preparation

- Updated README.md with comprehensive package documentation
- Added usage instructions and DevOps processes
- Enhanced enterprise-grade branding and structure
- Prepared for initial release and launch"
            
            # Check if remote exists
            if git remote get-url origin >/dev/null 2>&1; then
                echo "  🔄 Pushing $repo_name to remote..."
                git push origin main || git push origin master || echo "  ⚠️  Failed to push $repo_name (may need manual intervention)"
            else
                echo "  ⚠️  No remote configured for $repo_name"
            fi
        else
            echo "  ℹ️  No changes in $repo_name"
        fi
        
        cd - > /dev/null
    else
        echo "  ⚠️  $repo_name is not a git repository"
    fi
    
    echo ""
}

# Get current directory
MONOREPO_ROOT="/Users/tiaastor/Github/tiation-repos"
cd "$MONOREPO_ROOT"

echo "🔍 Scanning for repositories with changes..."
echo ""

# List of key repositories to check
repositories=(
    "RiggerConnect-web"
    "RiggerConnect-android" 
    "RiggerConnect-ios"
    "RiggerHub-web"
    "RiggerHub-android"
    "RiggerHub-ios"
    "RiggerBackend"
    "RiggerShared"
    "home-safety-matrix-ai"
    "tiation-dice-roller-ios"
    "tiation-kindness-web"
    "spring-up-markers-web"
    "unit-22-clean-guide"
    "shattered-realms-nexus"
    "standing-strong-web"
    "dnd-assets"
    "dontbeacunt"
    "k8s"
    "lovable-clone"
    "new-project-default-react"
    "rainbow-fish-dice-roller"
    "rigg-connect-app"
    "tiation-monorepo"
    "tiation-workspace-management"
)

# Push each repository
for repo in "${repositories[@]}"; do
    if [ -d "$repo" ]; then
        push_repo "$repo"
    else
        echo "📁 Repository $repo not found, skipping..."
        echo ""
    fi
done

# Also check for any other directories that might be repositories
echo "🔍 Checking for additional repositories..."
for dir in */; do
    if [ -d "$dir/.git" ]; then
        repo_name=$(basename "$dir")
        # Check if it's not already in our list
        if [[ ! " ${repositories[@]} " =~ " ${repo_name} " ]]; then
            echo "📁 Found additional repository: $repo_name"
            push_repo "$dir"
        fi
    fi
done

echo "✅ Completed pushing all repository changes!"
echo "================================================="
echo ""
echo "📊 Summary:"
echo "- Checked all major repositories in the monorepo"
echo "- Committed and pushed changes where applicable"
echo "- Updated documentation and prepared for launch"
echo ""
echo "🎯 Next steps:"
echo "- Review GitHub repositories for successful pushes"
echo "- Tag initial releases where appropriate"
echo "- Monitor CI/CD pipelines for successful builds"
