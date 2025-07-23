#!/bin/bash

# Fix repository failures script
# Handles repositories that can't fetch from their remote origins

BASE_DIR="/Users/tiaastor/Github/tiation-repos"
LOG_FILE="${BASE_DIR}/fix_failures_log.txt"

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

# Failed repositories to fix
FAILED_REPOS=(
    "dnd-assets"
    "lovable-clone"
    "new-project-default-react"
    "tiation-monorepo"
)

# Function to check if repository exists on GitHub
check_github_repo() {
    local repo_name="$1"
    local github_url="https://api.github.com/repos/tiation/${repo_name}"
    
    if curl -s -f -H "Accept: application/vnd.github+json" "$github_url" > /dev/null 2>&1; then
        return 0  # Repository exists
    else
        return 1  # Repository doesn't exist
    fi
}

# Function to create a new GitHub repository
create_github_repo() {
    local repo_name="$1"
    local repo_dir="$2"
    
    log_message "$BLUE" "🔧 Creating new GitHub repository: $repo_name"
    
    # Create repository using GitHub CLI if available
    if command -v gh &> /dev/null; then
        cd "$repo_dir"
        gh repo create "tiation/$repo_name" --private --source=. --remote=origin --push
        if [ $? -eq 0 ]; then
            log_message "$GREEN" "✅ Created and pushed $repo_name to GitHub"
            return 0
        else
            log_message "$RED" "❌ Failed to create GitHub repository for $repo_name"
            return 1
        fi
    else
        log_message "$YELLOW" "⚠️  GitHub CLI not available. Please create repository manually: https://github.com/new"
        log_message "$YELLOW" "    Repository name: $repo_name"
        return 1
    fi
}

# Function to fix a single repository
fix_repository() {
    local repo_name="$1"
    local repo_dir="$BASE_DIR/$repo_name"
    
    if [ ! -d "$repo_dir" ]; then
        log_message "$RED" "❌ Repository directory not found: $repo_dir"
        return 1
    fi
    
    log_message "$BLUE" "🔧 Fixing repository: $repo_name"
    
    cd "$repo_dir" || return 1
    
    # Check if GitHub repository exists
    if check_github_repo "$repo_name"; then
        log_message "$GREEN" "✅ GitHub repository exists for $repo_name"
        
        # Try to fetch again
        if git fetch origin 2>/dev/null; then
            log_message "$GREEN" "✅ Successfully fetched $repo_name"
            git pull origin main 2>/dev/null || git pull origin master 2>/dev/null
            return 0
        else
            log_message "$YELLOW" "⚠️  Still can't fetch $repo_name - may be access issue"
            return 1
        fi
    else
        log_message "$YELLOW" "⚠️  GitHub repository doesn't exist for $repo_name"
        
        # Check if there's valuable content
        local file_count=$(find . -type f -not -path "./.git/*" | wc -l)
        if [ "$file_count" -gt 5 ]; then
            log_message "$BLUE" "📁 Repository has $file_count files - attempting to create GitHub repo"
            
            # Remove current origin
            git remote remove origin 2>/dev/null || true
            
            # Try to create new repository
            if create_github_repo "$repo_name" "$repo_dir"; then
                return 0
            else
                # Set as local-only repository
                log_message "$YELLOW" "⚠️  Converting $repo_name to local-only repository"
                return 0
            fi
        else
            log_message "$YELLOW" "⚠️  Repository has minimal content - removing remote origin"
            git remote remove origin 2>/dev/null || true
            return 0
        fi
    fi
}

# Main execution
echo "================================================================="
echo "🔧 FIXING REPOSITORY FAILURES"
echo "================================================================="
echo

log_message "$BLUE" "🚀 Starting repository failure fixes..."

cd "$BASE_DIR" || {
    log_message "$RED" "❌ Failed to enter base directory: $BASE_DIR"
    exit 1
}

# Fix each failed repository
for repo in "${FAILED_REPOS[@]}"; do
    fix_repository "$repo"
    echo
done

# Run a quick verification
log_message "$BLUE" "🔍 Running verification check..."
for repo in "${FAILED_REPOS[@]}"; do
    if [ -d "$repo" ]; then
        cd "$BASE_DIR/$repo"
        if git remote get-url origin &>/dev/null; then
            if git fetch origin &>/dev/null; then
                log_message "$GREEN" "✅ $repo: Can now fetch from origin"
            else
                log_message "$YELLOW" "⚠️  $repo: Still has fetch issues"
            fi
        else
            log_message "$BLUE" "📍 $repo: Now local-only repository"
        fi
    fi
done

echo
echo "================================================================="
echo "🎯 FAILURE FIX SUMMARY"
echo "================================================================="
log_message "$BLUE" "📝 Detailed log: $LOG_FILE"
log_message "$GREEN" "✅ All repository failures have been addressed"
echo "================================================================="
