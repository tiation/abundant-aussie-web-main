#!/bin/bash

# 🚀 Tiation GitHub - Push All Changes to Remote Repositories
# Enhanced version with better error handling and logging

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$SCRIPT_DIR"
LOG_FILE="$ROOT_DIR/push-all-log-$(date +%Y%m%d_%H%M%S).txt"

# Global counters
TOTAL_REPOS=0
SUCCESS_COUNT=0
FAILED_COUNT=0
SKIPPED_COUNT=0

# Arrays to track results
declare -a SUCCESSFUL_REPOS=()
declare -a FAILED_REPOS=()
declare -a SKIPPED_REPOS=()

# Functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}" | tee -a "$LOG_FILE"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}" | tee -a "$LOG_FILE"
}

log_error() {
    echo -e "${RED}❌ $1${NC}" | tee -a "$LOG_FILE"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}" | tee -a "$LOG_FILE"
}

log_info() {
    echo -e "${CYAN}ℹ️  $1${NC}" | tee -a "$LOG_FILE"
}

show_banner() {
    echo -e "${PURPLE}"
    cat << "EOF"
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║          🚀 TIATION GITHUB - PUSH ALL REPOSITORIES           ║
║                                                                ║
║            Push All Changes to Remote GitHub                   ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
}

process_repository() {
    local repo_path="$1"
    local repo_name="$2"
    
    ((TOTAL_REPOS++))
    
    log "Processing repository: $repo_name"
    cd "$repo_path"
    
    # Check if it's a git repository
    if [[ ! -d ".git" ]]; then
        log_warning "$repo_name: Not a git repository, skipping"
        SKIPPED_REPOS+=("$repo_name (not a git repo)")
        ((SKIPPED_COUNT++))
        return 0
    fi
    
    # Check for changes
    local has_changes=false
    
    # Check for uncommitted changes
    if [[ -n "$(git status --porcelain)" ]]; then
        has_changes=true
        log_info "$repo_name: Has uncommitted changes"
    fi
    
    # Check for unpushed commits
    local unpushed_commits=""
    if git rev-parse --verify HEAD >/dev/null 2>&1; then
        unpushed_commits=$(git rev-list --count @{upstream}..HEAD 2>/dev/null || echo "0")
        if [[ "$unpushed_commits" != "0" ]]; then
            has_changes=true
            log_info "$repo_name: Has $unpushed_commits unpushed commits"
        fi
    else
        log_info "$repo_name: No commits yet"
        if [[ -n "$(git status --porcelain)" ]]; then
            has_changes=true
        fi
    fi
    
    # Skip if no changes
    if [[ "$has_changes" == "false" ]]; then
        log_info "$repo_name: No changes to push"
        SKIPPED_REPOS+=("$repo_name (up to date)")
        ((SKIPPED_COUNT++))
        return 0
    fi
    
    # Get current branch
    local current_branch=""
    if git rev-parse --verify HEAD >/dev/null 2>&1; then
        current_branch=$(git branch --show-current 2>/dev/null || git rev-parse --short HEAD)
    else
        current_branch="main"  # Default for new repos
    fi
    
    # Generate commit message
    local commit_message=$(generate_commit_message "$repo_name")
    
    # Stage and commit if there are uncommitted changes
    if [[ -n "$(git status --porcelain)" ]]; then
        log_info "$repo_name: Staging changes..."
        git add -A
        
        log_info "$repo_name: Committing changes..."
        if git commit -m "$commit_message" --quiet; then
            log_success "$repo_name: Changes committed"
        else
            log_error "$repo_name: Failed to commit changes"
            FAILED_REPOS+=("$repo_name (commit failed)")
            ((FAILED_COUNT++))
            return 1
        fi
    fi
    
    # Push to remote
    log_info "$repo_name: Pushing to remote ($current_branch)..."
    
    # First, try to set upstream if it doesn't exist
    if ! git rev-parse --verify @{upstream} >/dev/null 2>&1; then
        log_info "$repo_name: Setting upstream branch..."
        if git push --set-upstream origin "$current_branch" --quiet 2>>"$LOG_FILE"; then
            log_success "$repo_name: Successfully pushed and set upstream"
            SUCCESSFUL_REPOS+=("$repo_name")
            ((SUCCESS_COUNT++))
            return 0
        else
            log_error "$repo_name: Failed to push and set upstream"
            FAILED_REPOS+=("$repo_name (upstream push failed)")
            ((FAILED_COUNT++))
            return 1
        fi
    fi
    
    # Regular push
    if git push origin "$current_branch" --quiet 2>>"$LOG_FILE"; then
        log_success "$repo_name: Successfully pushed to GitHub"
        SUCCESSFUL_REPOS+=("$repo_name")
        ((SUCCESS_COUNT++))
    else
        log_error "$repo_name: Failed to push to remote"
        FAILED_REPOS+=("$repo_name (push failed)")
        ((FAILED_COUNT++))
        return 1
    fi
}

generate_commit_message() {
    local repo_name="$1"
    local timestamp=$(date "+%Y-%m-%d %H:%M:%S")
    
    case "$repo_name" in
        *"ai-agents"*)
            echo "🤖 AI Agents: Enterprise deployment and feature updates - $timestamp"
            ;;
        *"rigger"*)
            echo "🏗️ Rigger Platform: Updated enterprise deployment configurations - $timestamp"
            ;;
        *"template"*|*"enterprise"*)
            echo "📋 Enterprise Template: Updated structure and configurations - $timestamp"
            ;;
        *"docker"*)
            echo "🐳 Docker: Container and deployment improvements - $timestamp"
            ;;
        *"mobile"*|*"ios"*|*"android"*)
            echo "📱 Mobile: App updates and configuration changes - $timestamp"
            ;;
        *"docs"*|*"pages"*)
            echo "📚 Documentation: Updated documentation and GitHub Pages - $timestamp"
            ;;
        *"backend"*)
            echo "⚙️ Backend: API and service improvements - $timestamp"
            ;;
        *"frontend"*|*"react"*|*"svelte"*|*"vue"*)
            echo "🎨 Frontend: UI/UX updates and component improvements - $timestamp"
            ;;
        *)
            echo "🚀 Update: Automated deployment and configuration sync - $timestamp"
            ;;
    esac
}

find_all_repositories() {
    local repos=()
    
    # Find all git repositories
    find "$ROOT_DIR" -name ".git" -type d 2>/dev/null | while read git_dir; do
        local repo_dir=$(dirname "$git_dir")
        local repo_name=$(basename "$repo_dir")
        
        # Skip if it's a nested .git in another repo
        local parent_git=$(find "$(dirname "$repo_dir")" -maxdepth 1 -name ".git" -type d 2>/dev/null)
        if [[ -n "$parent_git" && "$parent_git" != "$git_dir" ]]; then
            continue
        fi
        
        echo "$repo_dir:$repo_name"
    done
}

show_summary() {
    echo -e "\n${PURPLE}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}║                        PUSH SUMMARY                           ║${NC}"
    echo -e "${PURPLE}╠════════════════════════════════════════════════════════════════╣${NC}"
    echo -e "${PURPLE}║ Total Repositories: $(printf '%2d' $TOTAL_REPOS)                                      ║${NC}"
    echo -e "${PURPLE}║ Successfully Pushed: $(printf '%2d' $SUCCESS_COUNT)                                    ║${NC}"
    echo -e "${PURPLE}║ Failed: $(printf '%2d' $FAILED_COUNT)                                                  ║${NC}"
    echo -e "${PURPLE}║ Skipped: $(printf '%2d' $SKIPPED_COUNT)                                                 ║${NC}"
    echo -e "${PURPLE}╚════════════════════════════════════════════════════════════════╝${NC}"
    
    if [[ ${#SUCCESSFUL_REPOS[@]} -gt 0 ]]; then
        echo -e "\n${GREEN}✅ Successfully Pushed:${NC}"
        for repo in "${SUCCESSFUL_REPOS[@]}"; do
            echo -e "${GREEN}  • $repo${NC}"
        done
    fi
    
    if [[ ${#SKIPPED_REPOS[@]} -gt 0 ]]; then
        echo -e "\n${YELLOW}⏭️  Skipped:${NC}"
        for repo in "${SKIPPED_REPOS[@]}"; do
            echo -e "${YELLOW}  • $repo${NC}"
        done
    fi
    
    if [[ ${#FAILED_REPOS[@]} -gt 0 ]]; then
        echo -e "\n${RED}❌ Failed:${NC}"
        for repo in "${FAILED_REPOS[@]}"; do
            echo -e "${RED}  • $repo${NC}"
        done
        echo -e "\n${RED}Check the log file for details: $LOG_FILE${NC}"
    fi
    
    echo -e "\n${CYAN}📋 Full log available at: $LOG_FILE${NC}"
}

main() {
    show_banner
    
    log "Starting GitHub repository push process..."
    log "Log file: $LOG_FILE"
    
    # Check if git is installed
    if ! command -v git &> /dev/null; then
        log_error "Git is not installed or not in PATH"
        exit 1
    fi
    
    # Get all repositories
    log "Discovering git repositories..."
    local repositories=()
    while IFS= read -r line; do
        repositories+=("$line")
    done < <(find_all_repositories)
    
    if [[ ${#repositories[@]} -eq 0 ]]; then
        log_warning "No git repositories found"
        exit 0
    fi
    
    log "Found ${#repositories[@]} potential repositories to process"
    
    # Process each repository
    for repo_info in "${repositories[@]}"; do
        IFS=':' read -r repo_path repo_name <<< "$repo_info"
        
        if [[ -d "$repo_path" ]]; then
            process_repository "$repo_path" "$repo_name"
        else
            log_warning "Repository path does not exist: $repo_path"
        fi
        
        echo # Add spacing between repos
    done
    
    # Show summary
    show_summary
    
    # Exit with appropriate code
    if [[ $FAILED_COUNT -gt 0 ]]; then
        log_error "Some repositories failed to push"
        exit 1
    else
        log_success "All repositories processed successfully!"
        exit 0
    fi
}

# Handle script interruption
trap 'echo -e "\n${RED}❌ Script interrupted by user${NC}"; exit 130' INT TERM

# Run main function
main "$@"
