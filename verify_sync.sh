#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counter variables
total_repos=0
clean_repos=0
dirty_repos=0
out_of_sync_repos=0

echo -e "${BLUE}=== Git Repository Synchronization Verification ===${NC}"
echo -e "${BLUE}Checking all repositories in /Users/tiaastor/Github/tiation-repos${NC}"
echo ""

# Find all git repositories
find /Users/tiaastor/Github/tiation-repos -name ".git" -type d 2>/dev/null | while read git_dir; do
    repo_dir=$(dirname "$git_dir")
    repo_name=$(basename "$repo_dir")
    
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}📁 Repository: ${YELLOW}$repo_name${NC}"
    echo -e "${BLUE}📍 Path: $repo_dir${NC}"
    
    cd "$repo_dir" || continue
    total_repos=$((total_repos + 1))
    
    # Check if we have a remote origin
    if ! git remote get-url origin >/dev/null 2>&1; then
        echo -e "${RED}❌ No remote origin configured${NC}"
        continue
    fi
    
    echo -e "${BLUE}🔗 Remote origin: $(git remote get-url origin)${NC}"
    
    # Fetch from remote
    echo -e "${BLUE}🔄 Fetching from remote...${NC}"
    if git fetch --all --quiet 2>/dev/null; then
        echo -e "${GREEN}✅ Fetch successful${NC}"
    else
        echo -e "${RED}❌ Fetch failed${NC}"
    fi
    
    # Check git status
    echo -e "${BLUE}📊 Checking repository status...${NC}"
    
    # Check for uncommitted changes
    if ! git diff-index --quiet HEAD --; then
        echo -e "${RED}⚠️  Uncommitted changes detected${NC}"
        dirty_repos=$((dirty_repos + 1))
        git status --porcelain | head -10
    else
        echo -e "${GREEN}✅ No uncommitted changes${NC}"
        clean_repos=$((clean_repos + 1))
    fi
    
    # Check if branch is up to date with remote
    current_branch=$(git branch --show-current)
    if [ -n "$current_branch" ]; then
        echo -e "${BLUE}🌿 Current branch: $current_branch${NC}"
        
        # Check if remote tracking branch exists
        if git rev-parse --verify "origin/$current_branch" >/dev/null 2>&1; then
            local_hash=$(git rev-parse HEAD)
            remote_hash=$(git rev-parse "origin/$current_branch")
            
            if [ "$local_hash" = "$remote_hash" ]; then
                echo -e "${GREEN}✅ Branch is up to date with remote${NC}"
            else
                echo -e "${YELLOW}⚠️  Branch is out of sync with remote${NC}"
                out_of_sync_repos=$((out_of_sync_repos + 1))
                
                # Check if we're ahead or behind
                ahead=$(git rev-list --count "origin/$current_branch..HEAD" 2>/dev/null || echo "0")
                behind=$(git rev-list --count "HEAD..origin/$current_branch" 2>/dev/null || echo "0")
                
                if [ "$ahead" -gt 0 ]; then
                    echo -e "${YELLOW}  📤 $ahead commits ahead of remote${NC}"
                fi
                if [ "$behind" -gt 0 ]; then
                    echo -e "${YELLOW}  📥 $behind commits behind remote${NC}"
                fi
            fi
        else
            echo -e "${YELLOW}⚠️  No remote tracking branch found${NC}"
        fi
    else
        echo -e "${RED}❌ Not on any branch${NC}"
    fi
    
    echo ""
done

echo -e "${BLUE}=== SUMMARY ===${NC}"
echo -e "${BLUE}Total repositories checked: $total_repos${NC}"
echo -e "${GREEN}Clean repositories: $clean_repos${NC}"
echo -e "${RED}Repositories with uncommitted changes: $dirty_repos${NC}"
echo -e "${YELLOW}Repositories out of sync: $out_of_sync_repos${NC}"

if [ $dirty_repos -eq 0 ] && [ $out_of_sync_repos -eq 0 ]; then
    echo -e "${GREEN}🎉 All repositories are clean and synchronized!${NC}"
else
    echo -e "${YELLOW}⚠️  Some repositories need attention${NC}"
fi
