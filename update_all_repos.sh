#!/bin/bash

# Script to update all source repositories in /Users/tiaastor/Github/tiation-repos
# Ensures enterprise-grade standards with proper error handling and logging

BASE_DIR="/Users/tiaastor/Github/tiation-repos"
LOG_FILE="${BASE_DIR}/repo_update_log.txt"

# Function to log messages
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Function to update a single repository
update_repo() {
    local repo_dir="$1"
    local repo_name=$(basename "$repo_dir")
    
    if [ ! -d "$repo_dir/.git" ]; then
        log_message "⚠️  $repo_name: Not a git repository, skipping..."
        return 0
    fi
    
    log_message "🔄 Updating $repo_name..."
    
    cd "$repo_dir" || {
        log_message "❌ Failed to enter directory: $repo_dir"
        return 1
    }
    
    # Check if there are uncommitted changes
    if ! git diff-index --quiet HEAD --; then
        log_message "⚠️  $repo_name: Has uncommitted changes, stashing..."
        git stash push -m "Auto-stash before update $(date)"
    fi
    
    # Abort any ongoing rebase
    if [ -d ".git/rebase-merge" ] || [ -d ".git/rebase-apply" ]; then
        log_message "⚠️  $repo_name: Aborting ongoing rebase..."
        git rebase --abort 2>/dev/null || true
    fi
    
    # Fetch latest changes
    if git fetch origin 2>/dev/null; then
        log_message "✅ $repo_name: Fetched latest changes"
    else
        log_message "❌ $repo_name: Failed to fetch from origin"
        return 1
    fi
    
    # Get current branch
    current_branch=$(git branch --show-current)
    
    # Try to pull main/master branch
    for branch in main master; do
        if git show-ref --verify --quiet refs/remotes/origin/$branch; then
            if [ "$current_branch" != "$branch" ]; then
                git checkout "$branch" 2>/dev/null || git checkout -b "$branch" origin/"$branch" 2>/dev/null
            fi
            
            if git reset --hard origin/"$branch" 2>/dev/null; then
                log_message "✅ $repo_name: Updated to latest $branch"
                return 0
            else
                log_message "⚠️  $repo_name: Failed to reset to origin/$branch"
            fi
        fi
    done
    
    log_message "⚠️  $repo_name: No main or master branch found"
    return 1
}

# Main execution
log_message "🚀 Starting repository update process..."
log_message "📁 Base directory: $BASE_DIR"

cd "$BASE_DIR" || {
    log_message "❌ Failed to enter base directory: $BASE_DIR"
    exit 1
}

# Key repositories to prioritize
PRIORITY_REPOS=(
    "tiation-rigger-workspace"
    "tiation-rigger-ecosystem"
    "RiggerConnect-web"
    "RiggerConnect-android"
    "RiggerConnect-ios"
    "RiggerHub-web"
    "RiggerHub-android"
    "RiggerHub-ios"
    "RiggerShared"
    "RiggerBackend"
    "tiation-ecosystem"
    "tiation-monorepo"
)

# Update priority repositories first
log_message "🎯 Updating priority repositories..."
for repo in "${PRIORITY_REPOS[@]}"; do
    if [ -d "$repo" ]; then
        update_repo "$BASE_DIR/$repo"
    else
        log_message "⚠️  Priority repository not found: $repo"
    fi
done

# Update all other git repositories
log_message "📦 Updating remaining repositories..."
for dir in */; do
    dir_name=$(basename "$dir")
    if [ -d "$dir/.git" ] && [[ ! " ${PRIORITY_REPOS[@]} " =~ " ${dir_name} " ]]; then
        update_repo "$BASE_DIR/$dir"
    fi
done

log_message "✅ Repository update process completed!"
log_message "📊 Check $LOG_FILE for detailed results"

# Show summary
echo ""
echo "=== UPDATE SUMMARY ==="
echo "📁 Updated repositories in: $BASE_DIR"
echo "📝 Detailed log: $LOG_FILE"
echo "🔍 To verify updates, check individual repository status"
echo ""
