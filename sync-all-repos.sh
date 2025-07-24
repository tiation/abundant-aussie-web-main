#!/bin/bash

# Rigger Ecosystem - Sync All Repositories to GitHub
# This script ensures all local changes are committed and pushed to remote repositories

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Base directory
BASE_DIR="/Users/tiaastor/Github/tiation-repos"

# Repository list
REPOSITORIES=(
    "RiggerBackend"
    "RiggerConnect-android"
    "RiggerConnect-capacitor"  
    "RiggerConnect-ios"
    "RiggerConnect-web"
    "RiggerHub-android"
    "RiggerHub-ios"
    "RiggerHub-web"
    "RiggerShared"
)

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}🚀 $1${NC}"
    echo -e "${BLUE}================================${NC}"
}

print_step() {
    echo -e "${PURPLE}🔧 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Function to check if directory is a git repository
is_git_repo() {
    local repo_path="$1"
    [ -d "$repo_path/.git" ]
}

# Function to get current branch
get_current_branch() {
    local repo_path="$1"
    cd "$repo_path"
    git branch --show-current 2>/dev/null || echo "unknown"
}

# Function to get remote URL
get_remote_url() {
    local repo_path="$1"
    cd "$repo_path"
    git remote get-url origin 2>/dev/null || echo "no-remote"
}

# Function to check if there are uncommitted changes
has_uncommitted_changes() {
    local repo_path="$1"
    cd "$repo_path"
    ! git diff-index --quiet HEAD -- 2>/dev/null
}

# Function to check if there are untracked files
has_untracked_files() {
    local repo_path="$1"
    cd "$repo_path"
    [ -n "$(git ls-files --others --exclude-standard 2>/dev/null)" ]
}

# Function to check if there are unpushed commits
has_unpushed_commits() {
    local repo_path="$1"
    cd "$repo_path"
    local branch=$(get_current_branch "$repo_path")
    if [ "$branch" != "unknown" ]; then
        git log origin/$branch..$branch --oneline 2>/dev/null | grep -q . || return 1
    else
        return 1
    fi
}

# Function to sync a single repository
sync_repository() {
    local repo_name="$1"
    local repo_path="$BASE_DIR/$repo_name"
    
    print_header "Processing $repo_name"
    
    # Check if directory exists
    if [ ! -d "$repo_path" ]; then
        print_error "Directory not found: $repo_path"
        return 1
    fi
    
    # Check if it's a git repository
    if ! is_git_repo "$repo_path"; then
        print_error "Not a git repository: $repo_path"
        return 1
    fi
    
    cd "$repo_path"
    
    # Get repository information
    local current_branch=$(get_current_branch "$repo_path")
    local remote_url=$(get_remote_url "$repo_path")
    
    print_info "Repository: $repo_name"
    print_info "Path: $repo_path"
    print_info "Branch: $current_branch"
    print_info "Remote: $remote_url"
    
    # Check repository status
    local has_uncommitted=$(has_uncommitted_changes "$repo_path" && echo "yes" || echo "no")
    local has_untracked=$(has_untracked_files "$repo_path" && echo "yes" || echo "no")
    local has_unpushed=$(has_unpushed_commits "$repo_path" && echo "yes" || echo "no")
    
    echo ""
    echo -e "${YELLOW}Repository Status:${NC}"
    echo "  Uncommitted changes: $has_uncommitted"
    echo "  Untracked files: $has_untracked"
    echo "  Unpushed commits: $has_unpushed"
    echo ""
    
    # Handle untracked files
    if [ "$has_untracked" = "yes" ]; then
        print_step "Adding untracked files..."
        git add . 2>/dev/null || print_warning "Failed to add some files"
        print_success "Added untracked files"
    fi
    
    # Handle uncommitted changes
    if [ "$has_uncommitted" = "yes" ] || [ "$has_untracked" = "yes" ]; then
        print_step "Committing changes..."
        
        # Generate commit message
        local commit_msg="🚀 Sync local changes - $(date '+%Y-%m-%d %H:%M:%S')"
        
        # Add deployment plan if it exists in root
        if [ -f "$BASE_DIR/RIGGER_ECOSYSTEM_DEPLOYMENT_PLAN.md" ] && [ "$repo_name" = "RiggerShared" ]; then
            cp "$BASE_DIR/RIGGER_ECOSYSTEM_DEPLOYMENT_PLAN.md" "$repo_path/"
            git add RIGGER_ECOSYSTEM_DEPLOYMENT_PLAN.md
            commit_msg="📋 Add comprehensive ecosystem deployment plan"
        fi
        
        git commit -m "$commit_msg" 2>/dev/null || print_error "Failed to commit changes"
        print_success "Committed changes: $commit_msg"
        has_unpushed="yes"  # Update status after commit
    fi
    
    # Handle unpushed commits
    if [ "$has_unpushed" = "yes" ]; then
        print_step "Pushing to remote repository..."
        
        # Check if remote exists and is accessible
        if [ "$remote_url" = "no-remote" ]; then
            print_error "No remote repository configured"
            return 1
        fi
        
        # Fetch latest changes first
        print_step "Fetching latest changes from remote..."
        git fetch origin 2>/dev/null || print_warning "Failed to fetch from remote"
        
        # Check if we need to pull first
        local behind_count=$(git rev-list --count HEAD..origin/$current_branch 2>/dev/null || echo "0")
        if [ "$behind_count" -gt 0 ]; then
            print_warning "Local branch is $behind_count commits behind remote"
            print_step "Pulling latest changes..."
            git pull origin $current_branch --no-edit 2>/dev/null || {
                print_error "Failed to pull changes. Manual intervention may be required."
                return 1
            }
        fi
        
        # Push changes
        git push origin $current_branch 2>/dev/null || {
            print_error "Failed to push to remote repository"
            return 1
        }
        
        print_success "Successfully pushed to remote repository"
    fi
    
    # Final status check
    print_step "Final status check..."
    local final_status=$(git status --porcelain 2>/dev/null)
    if [ -z "$final_status" ]; then
        print_success "Repository is clean and synchronized"
    else
        print_warning "Repository still has uncommitted changes:"
        echo "$final_status"
    fi
    
    # Show recent commits
    print_info "Recent commits:"
    git log --oneline -3 2>/dev/null || echo "No commits found"
    
    echo ""
    print_success "✅ $repo_name synchronization complete"
    echo ""
    echo "----------------------------------------"
    echo ""
}

# Function to show summary
show_summary() {
    local successful_repos=()
    local failed_repos=()
    
    print_header "Synchronization Summary"
    
    for repo in "${REPOSITORIES[@]}"; do
        local repo_path="$BASE_DIR/$repo"
        if [ -d "$repo_path" ] && is_git_repo "$repo_path"; then
            cd "$repo_path"
            local status=$(git status --porcelain 2>/dev/null)
            if [ -z "$status" ]; then
                successful_repos+=("$repo")
                echo -e "${GREEN}✅ $repo${NC} - Clean and synchronized"
            else
                failed_repos+=("$repo")
                echo -e "${RED}❌ $repo${NC} - Has uncommitted changes"
            fi
        else
            failed_repos+=("$repo")
            echo -e "${RED}❌ $repo${NC} - Not a git repository or doesn't exist"
        fi
    done
    
    echo ""
    echo -e "${BLUE}Summary:${NC}"
    echo "  Successfully synchronized: ${#successful_repos[@]} repositories"
    echo "  Failed or incomplete: ${#failed_repos[@]} repositories"
    
    if [ ${#failed_repos[@]} -gt 0 ]; then
        echo ""
        echo -e "${YELLOW}Repositories requiring attention:${NC}"
        for repo in "${failed_repos[@]}"; do
            echo "  - $repo"
        done
    fi
}

# Main execution
main() {
    print_header "Rigger Ecosystem Repository Synchronization"
    echo -e "${BLUE}Starting synchronization of all Rigger repositories...${NC}"
    echo ""
    
    # Change to base directory
    cd "$BASE_DIR"
    
    # Process each repository
    for repo in "${REPOSITORIES[@]}"; do
        sync_repository "$repo"
    done
    
    # Show final summary
    show_summary
    
    print_header "Synchronization Complete"
    echo -e "${GREEN}All repositories have been processed!${NC}"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo "1. Review any repositories that failed synchronization"
    echo "2. Check GitHub to confirm all changes are pushed"
    echo "3. Proceed with the deployment plan implementation"
}

# Run the main function
main "$@"
