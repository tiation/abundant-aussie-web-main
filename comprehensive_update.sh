#!/bin/bash

# Comprehensive repository update script for tiation-repos
# Follows enterprise-grade standards with proper error handling

BASE_DIR="/Users/tiaastor/Github/tiation-repos"
LOG_FILE="${BASE_DIR}/comprehensive_update_log.txt"
SUCCESS_COUNT=0
FAIL_COUNT=0
SKIP_COUNT=0

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to log messages with colors
log_message() {
    local color="$1"
    local message="$2"
    echo -e "${color}[$(date '+%Y-%m-%d %H:%M:%S')] $message${NC}" | tee -a "$LOG_FILE"
}

# Function to update a single repository
update_repository() {
    local repo_dir="$1"
    local repo_name=$(basename "$repo_dir")
    
    if [ ! -d "$repo_dir/.git" ]; then
        log_message "$YELLOW" "⚠️  $repo_name: Not a git repository, skipping..."
        ((SKIP_COUNT++))
        return 0
    fi
    
    log_message "$BLUE" "🔄 Processing $repo_name..."
    
    cd "$repo_dir" || {
        log_message "$RED" "❌ $repo_name: Failed to enter directory"
        ((FAIL_COUNT++))
        return 1
    }
    
    # Clean up any ongoing operations
    if [ -d ".git/rebase-merge" ] || [ -d ".git/rebase-apply" ]; then
        log_message "$YELLOW" "⚠️  $repo_name: Cleaning up rebase state..."
        git rebase --abort 2>/dev/null || true
    fi
    
    # Stash any uncommitted changes
    if ! git diff-index --quiet HEAD -- 2>/dev/null; then
        log_message "$YELLOW" "⚠️  $repo_name: Stashing uncommitted changes..."
        git stash push -m "Auto-stash before update $(date)" 2>/dev/null || true
    fi
    
    # Fetch from origin
    if git fetch origin 2>/dev/null; then
        log_message "$GREEN" "✅ $repo_name: Fetched from origin"
    else
        log_message "$RED" "❌ $repo_name: Failed to fetch from origin"
        ((FAIL_COUNT++))
        return 1
    fi
    
    # Determine and switch to default branch
    local default_branch=""
    for branch in main master; do
        if git show-ref --verify --quiet refs/remotes/origin/$branch; then
            default_branch="$branch"
            break
        fi
    done
    
    if [ -z "$default_branch" ]; then
        log_message "$YELLOW" "⚠️  $repo_name: No main or master branch found"
        ((SKIP_COUNT++))
        return 0
    fi
    
    # Switch to default branch
    local current_branch=$(git branch --show-current 2>/dev/null || echo "unknown")
    if [ "$current_branch" != "$default_branch" ]; then
        git checkout "$default_branch" 2>/dev/null || git checkout -b "$default_branch" origin/"$default_branch" 2>/dev/null
    fi
    
    # Update to latest
    if git reset --hard origin/"$default_branch" 2>/dev/null; then
        log_message "$GREEN" "✅ $repo_name: Updated to latest $default_branch"
        ((SUCCESS_COUNT++))
        return 0
    else
        log_message "$RED" "❌ $repo_name: Failed to update to origin/$default_branch"
        ((FAIL_COUNT++))
        return 1
    fi
}

# Main execution
clear
echo "================================================================="
echo "🚀 TIATION REPOSITORIES COMPREHENSIVE UPDATE"
echo "================================================================="
echo

log_message "$BLUE" "🚀 Starting comprehensive repository update..."
log_message "$BLUE" "📁 Base directory: $BASE_DIR"

cd "$BASE_DIR" || {
    log_message "$RED" "❌ Failed to enter base directory: $BASE_DIR"
    exit 1
}

# Get all git repositories
repositories=()
while IFS= read -r repo; do
    repositories+=("$repo")
done < <(find . -name ".git" -exec dirname {} \; | sed 's|^\./||')

# Sort repositories for consistent processing
IFS=$'\n' repositories=($(sort <<<"${repositories[*]}"))
unset IFS

log_message "$BLUE" "📊 Found ${#repositories[@]} git repositories"
echo

# Process each repository
for repo in "${repositories[@]}"; do
    update_repository "$BASE_DIR/$repo"
done

# Final summary
echo
echo "================================================================="
echo "📊 UPDATE SUMMARY"
echo "================================================================="
log_message "$GREEN" "✅ Successfully updated: $SUCCESS_COUNT repositories"
log_message "$RED" "❌ Failed to update: $FAIL_COUNT repositories"
log_message "$YELLOW" "⚠️  Skipped: $SKIP_COUNT repositories"
log_message "$BLUE" "📝 Detailed log: $LOG_FILE"
echo "================================================================="
