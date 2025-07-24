#!/bin/bash

# 🚀 Tiation GitHub - Push All Repositories Script
# Pushes all changes across all Tiation repositories to remote GitHub

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
LOG_FILE="$ROOT_DIR/git-push-log-$(date +%Y%m%d_%H%M%S).txt"

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
║            🚀 TIATION GITHUB REPOSITORY SYNC                  ║
║                                                                ║
║              Push All Changes to Remote GitHub                 ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
}

check_git_status() {
    local repo_path="$1"
    local repo_name="$2"
    
    cd "$repo_path"
    
    # Check if it's a git repository
    if [[ ! -d ".git" ]]; then
        log_warning "$repo_name: Not a git repository, skipping"
        SKIPPED_REPOS+=("$repo_name (not a git repo)")
        ((SKIPPED_COUNT++))
        return 1
    fi
    
    # Check for uncommitted changes
    if [[ -n "$(git status --porcelain)" ]]; then
        log_info "$repo_name: Has uncommitted changes"
        return 2
    fi
    
    # Check if there are commits to push
    local unpushed=$(git rev-list --count @{upstream}..HEAD 2>/dev/null || echo "0")
    if [[ "$unpushed" == "0" ]]; then
        log_info "$repo_name: No commits to push"
        return 3
    fi
    
    return 0
}

commit_and_push_repo() {
    local repo_path="$1"
    local repo_name="$2"
    local commit_message="${3:-"🚀 Update: Automated push from deployment script"}"
    
    log "Processing repository: $repo_name"
    cd "$repo_path"
    
    local status_code
    check_git_status "$repo_path" "$repo_name"
    status_code=$?
    
    case $status_code in
        1) # Not a git repo
            return 0
            ;;
        3) # No commits to push
            SKIPPED_REPOS+=("$repo_name (up to date)")
            ((SKIPPED_COUNT++))
            return 0
            ;;
    esac
    
    try_push_repo "$repo_path" "$repo_name" "$commit_message"
}

try_push_repo() {
    local repo_path="$1"
    local repo_name="$2"
    local commit_message="$3"
    
    cd "$repo_path"
    
    # Get current branch
    local current_branch=$(git branch --show-current)
    
    # Stage all changes if there are any
    if [[ -n "$(git status --porcelain)" ]]; then
        log_info "$repo_name: Staging changes..."
        git add -A
        
        # Commit changes
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

get_all_repositories() {
    # Find all directories that contain .git folders or are git repositories
    local repos=()
    
    # Add the main tiation-github directory
    if [[ -d "$ROOT_DIR/.git" ]]; then
        repos+=("$ROOT_DIR:tiation-github")
    fi
    
    # Find all subdirectories with .git folders
    while IFS= read -r -d '' git_dir; do
        local repo_dir=$(dirname "$git_dir")
        local repo_name=$(basename "$repo_dir")
        
        # Skip if it's the main directory (already added)
        if [[ "$repo_dir" != "$ROOT_DIR" ]]; then
            repos+=("$repo_dir:$repo_name")
        fi
    done < <(find "$ROOT_DIR" -name ".git" -type d -print0 2>/dev/null)
    
    # Also check for known repository directories
    local known_repos=(
        "tiation-ai-agents"
        "tiation-rigger-platform"
        "tiation-react-template"
        "tiation-svelte-enterprise-template"
        "enterprise-core"
        "RiggerHireApp"
        "RiggerHireApp-Backend"
        "dnddiceroller-android"
        "tiation-docker-debian"
        "tiation-cms"
        "tiation-interactive-demos"
        "ios-enterprise-templates"
        "shared-templates-monetization-templates"
        "temp-github-pages"
    )
    
    for repo_name in "${known_repos[@]}"; do
        local repo_path="$ROOT_DIR/$repo_name"
        if [[ -d "$repo_path/.git" ]]; then
            # Check if already in list
            local found=false
            for existing in "${repos[@]}"; do
                if [[ "$existing" == *":$repo_name" ]]; then
                    found=true
                    break
                fi
            done
            if [[ "$found" == false ]]; then
                repos+=("$repo_path:$repo_name")
            fi
        fi
    done
    
    printf '%s\n' "${repos[@]}"
}

generate_commit_message() {
    local repo_name="$1"
    local timestamp=$(date "+%Y-%m-%d %H:%M:%S")
    
    case "$repo_name" in
        *"ai-agents"*)
            echo "🤖 AI Agents: Updated README and deployment configurations - $timestamp"
            ;;
        *"rigger"*)
            echo "🏗️ Rigger Platform: Enterprise deployment updates - $timestamp"
            ;;
        *"template"*)
            echo "📋 Template: Updated enterprise template structure - $timestamp"
            ;;
        *"enterprise"*)
            echo "🏢 Enterprise: Core system updates and optimizations - $timestamp"
            ;;
        *"docker"*)
            echo "🐳 Docker: Container and deployment improvements - $timestamp"
            ;;
        *"mobile"*|*"ios"*|*"android"*)
            echo "📱 Mobile: App updates and configuration changes - $timestamp"
            ;;
        *"docs"*|*"pages"*)
            echo "📚 Documentation: Updated docs and GitHub Pages - $timestamp"
            ;;
        *)
            echo "🚀 Update: Automated deployment sync - $timestamp"
            ;;
    esac
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
    
    log "Starting GitHub repository sync process..."
    log "Log file: $LOG_FILE"
    
    # Check if git is installed
    if ! command -v git &> /dev/null; then
        log_error "Git is not installed or not in PATH"
        exit 1
    fi
    
    # Get all repositories
    log "Discovering repositories..."
    local repositories=()
    while IFS= read -r line; do
        repositories+=("$line")
    done < <(get_all_repositories)
    
    TOTAL_REPOS=${#repositories[@]}
    log "Found $TOTAL_REPOS repositories to process"
    
    if [[ $TOTAL_REPOS -eq 0 ]]; then
        log_warning "No git repositories found"
        exit 0
    fi
    
    # Process each repository
    for repo_info in "${repositories[@]}"; do
        IFS=':' read -r repo_path repo_name <<< "$repo_info"
        
        if [[ -d "$repo_path" ]]; then
            local commit_msg=$(generate_commit_message "$repo_name")
            commit_and_push_repo "$repo_path" "$repo_name" "$commit_msg"
        else
            log_warning "Repository path does not exist: $repo_path"
            SKIPPED_REPOS+=("$repo_name (path not found)")
            ((SKIPPED_COUNT++))
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
