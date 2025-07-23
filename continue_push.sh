#!/bin/bash

# Continue pushing remaining repositories
set +e  # Don't exit on errors

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get remaining repositories
REMAINING_REPOS=(
    "AflFantasyManager"
    "unit-22-clean-guide"
    "dnd-assets"
    "netmaker"
    "tiation-ai-platform"
    "dnddiceroller-android"
    "tiation-kindness-web"
    "shattered-realms-nexus"
    "abundant-aussie-web-main"
    "onedev"
    "headscale-admin"
    "MetricsDashboard"
    "new-project-default-react"
    "go-project-template"
    "dnd-character-sheets-saas"
    "tiation-portfolio"
    "ChaseWhiteRabbit-Business-Overview"
    "tabletop-adventures-crafted-main"
    "flutter-intl-vscode"
)

echo -e "${BLUE}=== Continuing Push Operation for Remaining Repositories ===${NC}"

for repo in "${REMAINING_REPOS[@]}"; do
    if [[ -d "$repo" ]]; then
        echo -e "\n${BLUE}=== Processing: $repo ===${NC}"
        cd "$repo"
        
        if [[ ! -d ".git" ]]; then
            echo -e "${YELLOW}Not a git repository, skipping${NC}"
            cd ..
            continue
        fi
        
        # Check for changes
        if git diff --quiet && git diff --cached --quiet; then
            # Check for unpushed commits
            unpushed=$(git log --oneline @{u}.. 2>/dev/null | wc -l | tr -d ' ' || echo "0")
            if [[ "$unpushed" -eq 0 ]]; then
                echo -e "${GREEN}✓ Repository is clean and up to date${NC}"
            else
                echo -e "${YELLOW}Found $unpushed unpushed commits${NC}"
                current_branch=$(git branch --show-current)
                echo "Pushing to origin $current_branch..."
                if git push origin "$current_branch" 2>/dev/null; then
                    echo -e "${GREEN}✓ Successfully pushed to remote${NC}"
                else
                    if git push --set-upstream origin "$current_branch" 2>/dev/null; then
                        echo -e "${GREEN}✓ Successfully pushed with upstream set${NC}"
                    else
                        echo -e "${RED}✗ Failed to push changes${NC}"
                    fi
                fi
            fi
        else
            echo -e "${YELLOW}Found uncommitted changes${NC}"
            git add .
            commit_msg="Auto-commit: Enterprise documentation consolidation $(date '+%Y-%m-%d %H:%M:%S')"
            git commit -m "$commit_msg" || echo "Commit failed or nothing to commit"
            
            current_branch=$(git branch --show-current)
            if git push origin "$current_branch" 2>/dev/null; then
                echo -e "${GREEN}✓ Successfully pushed to remote${NC}"
            else
                if git push --set-upstream origin "$current_branch" 2>/dev/null; then
                    echo -e "${GREEN}✓ Successfully pushed with upstream set${NC}"
                else
                    echo -e "${RED}✗ Failed to push changes${NC}"
                fi
            fi
        fi
        
        cd ..
    else
        echo -e "${YELLOW}Repository $repo not found${NC}"
    fi
done

echo -e "\n${GREEN}=== Continue Push Operation Complete ===${NC}"
