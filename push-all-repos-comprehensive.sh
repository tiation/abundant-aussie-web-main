#!/bin/bash

# Comprehensive Repository Sync and README Link Fix Script
# ChaseWhiteRabbit NGO - Tiation Enterprise Repository Management
# Purpose: Push all local changes and ensure README links are working

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
TOTAL_REPOS=0
SUCCESSFUL_PUSHES=0
FAILED_PUSHES=0
FIXED_LINKS=0

# Log file
LOG_FILE="$(pwd)/repository_sync_$(date +%Y%m%d_%H%M%S).log"

echo -e "${BLUE}=== ChaseWhiteRabbit NGO Repository Sync ===${NC}"
echo -e "${BLUE}Starting comprehensive repository synchronization...${NC}"
echo "Log file: $LOG_FILE"
echo ""

# Function to log messages
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
    echo -e "$1"
}

# Function to check and fix README links
fix_readme_links() {
    local repo_path="$1"
    local repo_name="$2"
    
    # Find all README files
    local readme_files=$(find "$repo_path" -name "README.md" -o -name "readme.md" -o -name "README.rst" 2>/dev/null)
    
    if [ -n "$readme_files" ]; then
        while IFS= read -r readme_file; do
            if [ -f "$readme_file" ]; then
                local fixed=false
                
                # Create backup
                cp "$readme_file" "${readme_file}.backup"
                
                # Fix common broken link patterns
                # Fix relative links to other repos in the same organization
                if sed -i.tmp 's|](\.\.\/\([^)]*\)\/|](https://github.com/tiaastor/\1/|g' "$readme_file" 2>/dev/null; then
                    if ! cmp -s "$readme_file" "${readme_file}.tmp"; then
                        fixed=true
                    fi
                    rm -f "${readme_file}.tmp"
                fi
                
                # Fix broken internal links
                if sed -i.tmp 's|](\/docs\/|](docs/|g' "$readme_file" 2>/dev/null; then
                    if ! cmp -s "$readme_file" "${readme_file}.tmp"; then
                        fixed=true
                    fi
                    rm -f "${readme_file}.tmp"
                fi
                
                # Fix broken asset links
                if sed -i.tmp 's|](\/assets\/|](assets/|g' "$readme_file" 2>/dev/null; then
                    if ! cmp -s "$readme_file" "${readme_file}.tmp"; then
                        fixed=true
                    fi
                    rm -f "${readme_file}.tmp"
                fi
                
                if [ "$fixed" = true ]; then
                    log_message "  ${GREEN}✓${NC} Fixed links in: $(basename "$readme_file")"
                    FIXED_LINKS=$((FIXED_LINKS + 1))
                else
                    # Remove backup if no changes
                    rm -f "${readme_file}.backup"
                fi
            fi
        done <<< "$readme_files"
    fi
}

# Function to process each repository
process_repository() {
    local repo_path="$1"
    local repo_name=$(basename "$repo_path")
    
    TOTAL_REPOS=$((TOTAL_REPOS + 1))
    
    log_message "${YELLOW}[$TOTAL_REPOS] Processing: $repo_name${NC}"
    
    cd "$repo_path"
    
    # Check if it's a git repository
    if [ ! -d ".git" ]; then
        log_message "  ${RED}✗${NC} Not a git repository, skipping"
        return
    fi
    
    # Fix README links first
    fix_readme_links "$repo_path" "$repo_name"
    
    # Check if there are any changes
    if git diff --quiet && git diff --cached --quiet; then
        # Check for untracked files
        if [ -z "$(git ls-files --others --exclude-standard)" ]; then
            log_message "  ${BLUE}ℹ${NC} No changes to commit"
            
            # Still try to push in case there are unpushed commits
            if git log --branches --not --remotes --oneline | grep -q .; then
                log_message "  ${YELLOW}↑${NC} Found unpushed commits, pushing..."
                if git push origin HEAD 2>>"$LOG_FILE"; then
                    log_message "  ${GREEN}✓${NC} Successfully pushed existing commits"
                    SUCCESSFUL_PUSHES=$((SUCCESSFUL_PUSHES + 1))
                else
                    log_message "  ${RED}✗${NC} Failed to push existing commits"
                    FAILED_PUSHES=$((FAILED_PUSHES + 1))
                fi
            fi
            return
        fi
    fi
    
    # Stage all changes
    git add -A
    
    # Check if there are staged changes
    if git diff --cached --quiet; then
        log_message "  ${BLUE}ℹ${NC} No staged changes after git add"
        return
    fi
    
    # Create commit message
    local commit_msg="Update repository: $(date '+%Y-%m-%d %H:%M:%S')

- Automated sync of all local changes
- README link fixes and improvements
- Enterprise standards compliance update
- ChaseWhiteRabbit NGO repository maintenance"
    
    # Commit changes
    if git commit -m "$commit_msg" >>"$LOG_FILE" 2>&1; then
        log_message "  ${GREEN}✓${NC} Changes committed"
        
        # Push to remote
        local remote_url=$(git remote get-url origin 2>/dev/null || echo "")
        if [ -n "$remote_url" ]; then
            log_message "  ${YELLOW}↑${NC} Pushing to: $remote_url"
            
            if git push origin HEAD >>"$LOG_FILE" 2>&1; then
                log_message "  ${GREEN}✓${NC} Successfully pushed to remote"
                SUCCESSFUL_PUSHES=$((SUCCESSFUL_PUSHES + 1))
            else
                log_message "  ${RED}✗${NC} Failed to push to remote"
                FAILED_PUSHES=$((FAILED_PUSHES + 1))
                
                # Try to set upstream if it doesn't exist
                local current_branch=$(git branch --show-current)
                if git push -u origin "$current_branch" >>"$LOG_FILE" 2>&1; then
                    log_message "  ${GREEN}✓${NC} Successfully pushed with upstream set"
                    SUCCESSFUL_PUSHES=$((SUCCESSFUL_PUSHES + 1))
                    FAILED_PUSHES=$((FAILED_PUSHES - 1))
                else
                    log_message "  ${RED}✗${NC} Failed to push with upstream"
                fi
            fi
        else
            log_message "  ${RED}✗${NC} No remote origin configured"
            FAILED_PUSHES=$((FAILED_PUSHES + 1))
        fi
    else
        log_message "  ${RED}✗${NC} Failed to commit changes"
        FAILED_PUSHES=$((FAILED_PUSHES + 1))
    fi
    
    echo ""
}

# Main execution
cd "/Users/tiaastor/Github/tiation-repos"

# Find all git repositories and process them
log_message "Searching for git repositories..."
find . -name ".git" -type d | while read -r git_dir; do
    repo_path=$(dirname "$git_dir")
    process_repository "$repo_path"
done

# Final summary
echo -e "${BLUE}=== SYNCHRONIZATION COMPLETE ===${NC}"
echo -e "${GREEN}Total repositories processed: $TOTAL_REPOS${NC}"
echo -e "${GREEN}Successful pushes: $SUCCESSFUL_PUSHES${NC}"
echo -e "${RED}Failed pushes: $FAILED_PUSHES${NC}"
echo -e "${YELLOW}README links fixed: $FIXED_LINKS${NC}"
echo ""
echo -e "${BLUE}Log file: $LOG_FILE${NC}"

# Summary to log
log_message "=== FINAL SUMMARY ==="
log_message "Total repositories: $TOTAL_REPOS"
log_message "Successful pushes: $SUCCESSFUL_PUSHES"
log_message "Failed pushes: $FAILED_PUSHES"
log_message "README links fixed: $FIXED_LINKS"

if [ $FAILED_PUSHES -eq 0 ]; then
    echo -e "${GREEN}🎉 All repositories successfully synchronized!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  Some repositories had issues. Check the log file for details.${NC}"
    exit 1
fi
