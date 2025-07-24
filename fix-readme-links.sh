#!/bin/bash

# README Link Fixer - ChaseWhiteRabbit NGO
# Purpose: Fix broken links in README files across all repositories

echo "=== Fixing README Links ==="
echo ""

fixed_count=0

# Function to fix links in a README file
fix_readme() {
    local readme_file="$1"
    local repo_name="$2"
    
    if [ ! -f "$readme_file" ]; then
        return
    fi
    
    echo "Checking: $repo_name/$(basename "$readme_file")"
    
    # Create backup
    cp "$readme_file" "${readme_file}.backup"
    
    # Fix relative repository links to absolute GitHub links
    sed -i.tmp "s|](../\([^/)]*\)/|](https://github.com/tiaastor/\1/|g" "$readme_file"
    
    # Fix broken internal links
    sed -i.tmp "s|](/docs/|](docs/|g" "$readme_file"
    sed -i.tmp "s|](/assets/|](assets/|g" "$readme_file"
    sed -i.tmp "s|](/src/|](src/|g" "$readme_file"
    
    # Fix enterprise repository index links
    sed -i.tmp "s|../ENTERPRISE_REPOSITORY_INDEX.md|https://github.com/tiaastor/tiation-repos/blob/main/ENTERPRISE_REPOSITORY_INDEX.md|g" "$readme_file"
    
    # Check if file was modified
    if ! cmp -s "$readme_file" "${readme_file}.backup"; then
        echo "  ✓ Fixed links in $(basename "$readme_file")"
        fixed_count=$((fixed_count + 1))
        rm "${readme_file}.backup"
    else
        echo "  - No changes needed"
        mv "${readme_file}.backup" "$readme_file"
    fi
    
    # Clean up temp file
    rm -f "${readme_file}.tmp"
}

# Main execution
cd "/Users/tiaastor/Github/tiation-repos"

# Process all git repositories
for git_dir in $(find . -name ".git" -type d); do
    repo_path=$(dirname "$git_dir")
    repo_name=$(basename "$repo_path")
    
    cd "$repo_path"
    
    # Find and fix README files
    for readme in README.md readme.md README.rst; do
        if [ -f "$readme" ]; then
            fix_readme "$readme" "$repo_name"
        fi
    done
    
    cd "/Users/tiaastor/Github/tiation-repos"
done

echo ""
echo "=== LINK FIXING COMPLETE ==="
echo "Fixed links in $fixed_count files"
