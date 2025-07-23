#!/bin/bash

# Script to push all local changes to remote GitHub repositories
# Following user preferences for SSH protocol and enterprise standards

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Official Rigger repositories (from user rules)
OFFICIAL_RIGGER_REPOS=(
    "RiggerConnect-web"
    "RiggerConnect-android" 
    "RiggerConnect-ios"
    "RiggerHub-web"
    "RiggerHub-android"
    "RiggerHub-ios"
    "RiggerShared"
    "RiggerBackend"
)

# All repositories
ALL_REPOS=($(find . -name ".git" -type d | sed 's|/.git||' | sed 's|./||'))

echo -e "${BLUE}=== Pushing All Local Changes to Remote GitHub ===${NC}"
echo "Found ${#ALL_REPOS[@]} repositories"

# Function to push changes for a repository
push_repo_changes() {
    local repo_name="$1"
    local is_priority="$2"
    
    if [[ ! -d "$repo_name" ]]; then
        echo -e "${RED}Repository $repo_name not found${NC}"
        return 1
    fi
    
    cd "$repo_name"
    
    echo -e "\n${BLUE}=== Processing: $repo_name ===${NC}"
    
    # Check if it's a git repository
    if [[ ! -d ".git" ]]; then
        echo -e "${YELLOW}Not a git repository, skipping${NC}"
        cd ..
        return 0
    fi
    
    # Check git status
    if git diff --quiet && git diff --cached --quiet; then
        # Check if there are unpushed commits
        local unpushed=$(git log --oneline @{u}.. 2>/dev/null | wc -l | tr -d ' ')
        if [[ "$unpushed" -eq 0 ]]; then
            echo -e "${GREEN}✓ Repository is clean and up to date${NC}"
            cd ..
            return 0
        else
            echo -e "${YELLOW}Found $unpushed unpushed commits${NC}"
        fi
    else
        echo -e "${YELLOW}Found uncommitted changes${NC}"
        git status --porcelain
        
        # Add all changes
        echo "Adding all changes..."
        git add .
        
        # Commit with timestamp
        local commit_msg="Auto-commit: Enterprise documentation consolidation $(date '+%Y-%m-%d %H:%M:%S')"
        if [[ "$is_priority" == "true" ]]; then
            commit_msg="Enterprise: Rigger documentation consolidation $(date '+%Y-%m-%d %H:%M:%S')"
        fi
        
        git commit -m "$commit_msg"
        echo -e "${GREEN}✓ Changes committed${NC}"
    fi
    
    # Check if remote exists
    if ! git remote get-url origin >/dev/null 2>&1; then
        echo -e "${RED}No origin remote found. Skipping push.${NC}"
        echo -e "${YELLOW}To add remote: git remote add origin <repository-url>${NC}"
        cd ..
        return 0
    fi
    
    # Get current branch
    local current_branch=$(git branch --show-current)
    
    # Push changes
    echo "Pushing to origin $current_branch..."
    if git push origin "$current_branch" 2>/dev/null; then
        echo -e "${GREEN}✓ Successfully pushed to remote${NC}"
    else
        # Try to set upstream and push
        echo "Setting upstream and pushing..."
        if git push --set-upstream origin "$current_branch"; then
            echo -e "${GREEN}✓ Successfully pushed with upstream set${NC}"
        else
            echo -e "${RED}✗ Failed to push changes${NC}"
            echo "Manual intervention required for $repo_name"
        fi
    fi
    
    cd ..
}

# First, process official Rigger repositories (priority)
echo -e "\n${BLUE}=== Processing Official Rigger Repositories (Priority) ===${NC}"
for repo in "${OFFICIAL_RIGGER_REPOS[@]}"; do
    if [[ -d "$repo" ]]; then
        push_repo_changes "$repo" "true"
    else
        echo -e "${YELLOW}Official repository $repo not found${NC}"
    fi
done

# Then process all other repositories
echo -e "\n${BLUE}=== Processing All Other Repositories ===${NC}"
for repo in "${ALL_REPOS[@]}"; do
    # Skip if already processed as official Rigger repo
    if [[ " ${OFFICIAL_RIGGER_REPOS[@]} " =~ " ${repo} " ]]; then
        continue
    fi
    
    push_repo_changes "$repo" "false"
done

echo -e "\n${GREEN}=== Push Operation Complete ===${NC}"
echo "All repositories have been processed."
echo "Check the output above for any repositories that require manual intervention."
