#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== FINAL SYNCHRONIZATION SUMMARY REPORT ===${NC}"
echo -e "${BLUE}Generated: $(date)${NC}"
echo ""

# Create temp files for counting
temp_dir=$(mktemp -d)
clean_file="$temp_dir/clean"
dirty_file="$temp_dir/dirty"
out_of_sync_file="$temp_dir/out_of_sync"
no_remote_file="$temp_dir/no_remote"
fetch_failed_file="$temp_dir/fetch_failed"

# Find all git repositories and analyze each one
find /Users/tiaastor/Github/tiation-repos -name ".git" -type d 2>/dev/null | while read git_dir; do
    repo_dir=$(dirname "$git_dir")
    repo_name=$(basename "$repo_dir")
    
    cd "$repo_dir" || continue
    
    # Check if we have a remote origin
    if ! git remote get-url origin >/dev/null 2>&1; then
        echo "$repo_name" >> "$no_remote_file"
        continue
    fi
    
    # Try to fetch
    if ! git fetch --all --quiet 2>/dev/null; then
        echo "$repo_name" >> "$fetch_failed_file"
    fi
    
    # Check for uncommitted changes
    if ! git diff-index --quiet HEAD --; then
        echo "$repo_name" >> "$dirty_file"
    else
        # Check if branch is up to date with remote
        current_branch=$(git branch --show-current)
        if [ -n "$current_branch" ] && git rev-parse --verify "origin/$current_branch" >/dev/null 2>&1; then
            local_hash=$(git rev-parse HEAD)
            remote_hash=$(git rev-parse "origin/$current_branch")
            
            if [ "$local_hash" != "$remote_hash" ]; then
                echo "$repo_name" >> "$out_of_sync_file"
            else
                echo "$repo_name" >> "$clean_file"
            fi
        else
            # No remote tracking branch or not on any branch
            echo "$repo_name" >> "$clean_file"
        fi
    fi
done

# Count results
total_repos=$(find /Users/tiaastor/Github/tiation-repos -name ".git" -type d 2>/dev/null | wc -l | tr -d ' ')
clean_count=$([ -f "$clean_file" ] && wc -l < "$clean_file" | tr -d ' ' || echo 0)
dirty_count=$([ -f "$dirty_file" ] && wc -l < "$dirty_file" | tr -d ' ' || echo 0)
out_of_sync_count=$([ -f "$out_of_sync_file" ] && wc -l < "$out_of_sync_file" | tr -d ' ' || echo 0)
no_remote_count=$([ -f "$no_remote_file" ] && wc -l < "$no_remote_file" | tr -d ' ' || echo 0)
fetch_failed_count=$([ -f "$fetch_failed_file" ] && wc -l < "$fetch_failed_file" | tr -d ' ' || echo 0)

echo -e "${BLUE}📊 REPOSITORY COUNTS:${NC}"
echo -e "  Total repositories found: ${BLUE}$total_repos${NC}"
echo -e "  Clean & synchronized: ${GREEN}$clean_count${NC}"
echo -e "  With uncommitted changes: ${RED}$dirty_count${NC}"
echo -e "  Out of sync with remote: ${YELLOW}$out_of_sync_count${NC}"
echo -e "  No remote configured: ${RED}$no_remote_count${NC}"
echo -e "  Fetch failed: ${RED}$fetch_failed_count${NC}"
echo ""

# Show detailed breakdowns
if [ "$dirty_count" -gt 0 ]; then
    echo -e "${RED}🚨 REPOSITORIES WITH UNCOMMITTED CHANGES:${NC}"
    while read repo; do
        echo -e "  • ${RED}$repo${NC}"
    done < "$dirty_file"
    echo ""
fi

if [ "$out_of_sync_count" -gt 0 ]; then
    echo -e "${YELLOW}⚠️  REPOSITORIES OUT OF SYNC:${NC}"
    while read repo; do
        echo -e "  • ${YELLOW}$repo${NC}"
    done < "$out_of_sync_file"
    echo ""
fi

if [ "$no_remote_count" -gt 0 ]; then
    echo -e "${RED}❌ REPOSITORIES WITHOUT REMOTE ORIGIN:${NC}"
    while read repo; do
        echo -e "  • ${RED}$repo${NC}"
    done < "$no_remote_file"
    echo ""
fi

if [ "$fetch_failed_count" -gt 0 ]; then
    echo -e "${RED}💥 REPOSITORIES WITH FETCH FAILURES:${NC}"
    while read repo; do
        echo -e "  • ${RED}$repo${NC}"
    done < "$fetch_failed_file"
    echo ""
fi

# DevOps best practices assessment
echo -e "${BLUE}🏗️  DEVOPS BEST PRACTICES ASSESSMENT:${NC}"

# Check for CI/CD files
ci_repos=0
find /Users/tiaastor/Github/tiation-repos -name ".git" -type d 2>/dev/null | while read git_dir; do
    repo_dir=$(dirname "$git_dir")
    repo_name=$(basename "$repo_dir")
    
    cd "$repo_dir" || continue
    
    # Check for common CI/CD files
    has_ci=false
    if [ -d ".github/workflows" ] || [ -f ".gitlab-ci.yml" ] || [ -f "Dockerfile" ] || [ -f "docker-compose.yml" ] || [ -d ".circleci" ] || [ -f "Jenkinsfile" ]; then
        has_ci=true
        ci_repos=$((ci_repos + 1))
    fi
    
    # Check for documentation
    has_docs=false
    if [ -f "README.md" ] || [ -d "docs" ]; then
        has_docs=true
    fi
    
    # Only report repos that don't meet best practices
    if ! $has_ci || ! $has_docs; then
        echo -e "  • ${YELLOW}$repo_name${NC}: Missing CI/CD ($has_ci) or docs ($has_docs)"
    fi
done

# Final verdict
echo ""
echo -e "${BLUE}🎯 FINAL VERDICT:${NC}"
if [ "$dirty_count" -eq 0 ] && [ "$out_of_sync_count" -eq 0 ] && [ "$no_remote_count" -eq 0 ] && [ "$fetch_failed_count" -eq 0 ]; then
    echo -e "${GREEN}✅ ALL REPOSITORIES ARE PROPERLY SYNCHRONIZED!${NC}"
    echo -e "${GREEN}✅ No uncommitted changes detected${NC}"
    echo -e "${GREEN}✅ All repositories are up to date with remotes${NC}"
    echo -e "${GREEN}✅ All repositories have proper remote origins configured${NC}"
else
    echo -e "${YELLOW}⚠️  ATTENTION REQUIRED FOR SOME REPOSITORIES${NC}"
    echo -e "${YELLOW}Please address the issues listed above to achieve full synchronization${NC}"
fi

# Clean up temp files
rm -rf "$temp_dir"
