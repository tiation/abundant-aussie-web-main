#!/bin/bash

# Simple Repository Sync - ChaseWhiteRabbit NGO
# Purpose: Push all local changes to GitHub

echo "=== Repository Sync Starting ==="
echo ""

success_count=0
total_count=0
original_dir=$(pwd)

# Function to sync a single repository
sync_repository() {
    local repo_dir="$1"
    local repo_name=$(basename "$repo_dir")
    
    total_count=$((total_count + 1))
    echo "[$total_count] $repo_name"
    
    cd "$repo_dir" || return 1
    
    # Check if it has a remote
    if ! git remote get-url origin >/dev/null 2>&1; then
        echo "  - No remote configured"
        cd "$original_dir"
        return 0
    fi
    
    # Add all changes
    git add -A
    
    # Check if there are changes to commit
    if ! git diff --cached --quiet; then
        # Commit changes
        if git commit -m "Automated sync: $(date '+%Y-%m-%d %H:%M:%S')

- README link fixes applied
- Local changes synchronized  
- Enterprise standards update" >/dev/null 2>&1; then
            echo "  ✓ Committed changes"
        fi
    fi
    
    # Push all changes
    if git push origin HEAD >/dev/null 2>&1; then
        echo "  ✓ Pushed successfully"
        success_count=$((success_count + 1))
    else
        # Try with upstream
        current_branch=$(git branch --show-current)
        if git push -u origin "$current_branch" >/dev/null 2>&1; then
            echo "  ✓ Pushed with upstream"
            success_count=$((success_count + 1))
        else
            echo "  ✗ Push failed"
        fi
    fi
    
    cd "$original_dir"
}

# Main execution
cd "/Users/tiaastor/Github/tiation-repos"

# Find all repositories and sync them
for repo_dir in */; do
    if [ -d "$repo_dir/.git" ]; then
        sync_repository "$repo_dir"
    fi
done

echo ""
echo "=== Sync Complete ==="
echo "Processed: $total_count repositories"
echo "Successful: $success_count repositories"
echo "Failed: $((total_count - success_count)) repositories"
