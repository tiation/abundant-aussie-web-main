#!/bin/bash

# Sync All Tiation Repositories Script
# This script checks and syncs all repositories in the tiation-repos directory

REPOS_DIR="/Users/tiaastor/Github/tiation-repos"
REPOS_SYNCED=0
REPOS_FAILED=0

echo "🚀 Starting repository sync process..."
echo "📁 Scanning directory: $REPOS_DIR"
echo "=" "$(printf '=%.0s' {1..60})"

# Function to sync a single repository
sync_repo() {
    local repo_path="$1"
    local repo_name=$(basename "$repo_path")
    
    # Skip non-git directories
    if [ ! -d "$repo_path/.git" ]; then
        echo "⏭️  Skipping $repo_name (not a git repository)"
        return 0
    fi
    
    echo ""
    echo "🔄 Processing: $repo_name"
    echo "📍 Path: $repo_path"
    
    cd "$repo_path" || {
        echo "❌ Failed to enter directory: $repo_path"
        return 1
    }
    
    # Check if there's a remote origin
    if ! git remote get-url origin &>/dev/null; then
        echo "⚠️  No remote origin configured for $repo_name"
        return 1
    fi
    
    # Get current branch
    current_branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
    if [ -z "$current_branch" ]; then
        echo "❌ Could not determine current branch"
        return 1
    fi
    
    echo "📋 Current branch: $current_branch"
    
    # Check for uncommitted changes
    if ! git diff-index --quiet HEAD --; then
        echo "📝 Uncommitted changes detected, adding and committing..."
        git add .
        git commit -m "Auto-commit: Sync changes before push $(date '+%Y-%m-%d %H:%M:%S')"
    fi
    
    # Check for untracked files
    if [ -n "$(git ls-files --others --exclude-standard)" ]; then
        echo "📄 Untracked files detected, adding and committing..."
        git add .
        git commit -m "Auto-commit: Add untracked files $(date '+%Y-%m-%d %H:%M:%S')"
    fi
    
    # Fetch latest changes
    echo "📥 Fetching latest changes..."
    if ! git fetch origin; then
        echo "❌ Failed to fetch from origin"
        return 1
    fi
    
    # Check if local branch is behind remote
    local_commit=$(git rev-parse HEAD)
    remote_commit=$(git rev-parse "origin/$current_branch" 2>/dev/null)
    
    if [ "$local_commit" != "$remote_commit" ] && [ -n "$remote_commit" ]; then
        echo "🔄 Local branch is behind remote, pulling changes..."
        if ! git pull origin "$current_branch"; then
            echo "❌ Failed to pull changes"
            return 1
        fi
    fi
    
    # Push changes
    echo "📤 Pushing changes to remote..."
    if git push origin "$current_branch"; then
        echo "✅ Successfully synced $repo_name"
        return 0
    else
        echo "❌ Failed to push $repo_name"
        return 1
    fi
}

# Main execution
for repo_dir in "$REPOS_DIR"/*; do
    if [ -d "$repo_dir" ] && [ "$(basename "$repo_dir")" != ".claude" ]; then
        if sync_repo "$repo_dir"; then
            ((REPOS_SYNCED++))
        else
            ((REPOS_FAILED++))
        fi
    fi
done

echo ""
echo "=" "$(printf '=%.0s' {1..60})"
echo "📊 Sync Summary:"
echo "✅ Successfully synced: $REPOS_SYNCED repositories"
echo "❌ Failed to sync: $REPOS_FAILED repositories"
echo "🏁 Sync process completed!"

# Return to original directory
cd "$REPOS_DIR"
