#!/bin/bash

# Repository Status Verification and Final Push Script
echo "🔍 Verifying repository status and completing final pushes..."
echo "============================================================"

# Function to check and push a single repository
check_and_push_repo() {
    local repo_dir="$1"
    local repo_name=$(basename "$repo_dir")
    
    if [ ! -d "$repo_dir" ]; then
        echo "⚠️  Directory not found: $repo_dir"
        return 1
    fi
    
    if [ ! -d "$repo_dir/.git" ]; then
        echo "📄 Not a git repo: $repo_name"
        return 0
    fi
    
    echo -e "\n🔍 Checking: $repo_name"
    echo "----------------------------------------"
    cd "$repo_dir" || return 1
    
    # Check if there are uncommitted changes
    if ! git diff --quiet || ! git diff --staged --quiet; then
        echo "📝 Found uncommitted changes, committing..."
        git add .
        git commit -m "Final repository update and name changes"
    fi
    
    # Check remote status
    local branch=$(git branch --show-current)
    if [ -z "$branch" ]; then
        branch="main"
    fi
    
    # Try to push
    local remote_exists=$(git remote | head -1)
    if [ -n "$remote_exists" ]; then
        echo "⬆️  Pushing to remote..."
        if git push origin "$branch" 2>/dev/null || git push origin main 2>/dev/null || git push origin master 2>/dev/null; then
            echo "✅ $repo_name: Successfully pushed"
        else
            echo "❌ $repo_name: Push failed"
        fi
    else
        echo "⚠️  $repo_name: No remote configured"
    fi
    
    cd "$ORIGINAL_DIR"
}

# Store original directory
ORIGINAL_DIR=$(pwd)

# First handle the main repository
echo "🏠 Completing main repository..."
git add .
git commit -m "Final enterprise structure organization and cleanup" || echo "Nothing to commit"
git push origin main

# Get list of all directories that are git repositories
echo -e "\n🔍 Finding all git repositories..."
REPO_DIRS=()
for dir in */; do
    if [ -d "$dir/.git" ]; then
        REPO_DIRS+=("$dir")
    fi
done

# Process each repository
SUCCESS_COUNT=0
FAIL_COUNT=0
NOT_GIT_COUNT=0

echo -e "\n📋 Processing ${#REPO_DIRS[@]} git repositories..."

for repo_dir in "${REPO_DIRS[@]}"; do
    if check_and_push_repo "$repo_dir"; then
        ((SUCCESS_COUNT++))
    else
        ((FAIL_COUNT++))
    fi
done

# Summary
echo -e "\n============================================================"
echo "📊 FINAL VERIFICATION SUMMARY"
echo "============================================================"
echo "✅ Successfully processed: $SUCCESS_COUNT repositories"
echo "❌ Failed to process: $FAIL_COUNT repositories"
echo "📄 Non-git directories: $NOT_GIT_COUNT directories"
echo "============================================================"

# Check main repository final status
echo -e "\n🏠 Main repository final status:"
git status --porcelain | head -10
if [ "$(git status --porcelain | wc -l)" -gt 0 ]; then
    echo "⚠️  Main repository still has uncommitted changes"
else
    echo "✅ Main repository is clean"
fi
