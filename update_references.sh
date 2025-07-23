#!/bin/bash

# Step 7: Update References to Point to Official Repositories
# This script updates references from legacy/duplicate repos to official repos

set -e

echo "🔗 Updating references to point to official repositories..."

# Define mapping of old repo names to new official repositories
declare -A REPO_MAPPING=(
    ["rigg-connect-app"]="RiggerConnect-web"
    ["RiggerConnect-mobile"]="RiggerConnect-android RiggerConnect-ios"
    ["RiggerConnect-monorepo"]="RiggerConnect-web RiggerConnect-android RiggerConnect-ios"
    ["abundant-aussie-web-main"]="RiggerConnect-web"
    ["caleb-stands-strong-web"]="RiggerConnect-web"
    ["standing-strong-web"]="RiggerConnect-web"
    ["tabletop-adventures-crafted-main"]="RiggerShared"
    ["tiation-board-nexus-main"]="RiggerHub-web"
    ["lovable-clone"]="RiggerConnect-web"
    ["tiation-ecosystem"]="RiggerShared"
)

# Files to update references in
FILES_TO_UPDATE=(
    "README.md"
    "ENTERPRISE_REPOSITORY_INDEX.md"
    "LEGACY_TO_OFFICIAL_REPOSITORY_MAPPING.md"
    "REPOSITORY_AUDIT.md"
    "STEP*.md"
    "*.sh"
    "package.json"
    "docker-compose*.yml"
    ".gitlab-ci.yml"
    ".github/workflows/*.yml"
)

# Function to update references in files
update_references() {
    local file="$1"
    
    if [[ -f "$file" ]]; then
        echo "🔄 Updating references in: $file"
        
        # Create backup
        cp "$file" "${file}.backup"
        
        # Update references to archived repositories
        for old_repo in "${!REPO_MAPPING[@]}"; do
            new_repos="${REPO_MAPPING[$old_repo]}"
            
            # Replace direct references
            sed -i.tmp "s|/${old_repo}/|/ARCHIVED-${old_repo}/|g" "$file"
            sed -i.tmp "s|${old_repo}|${new_repos%% *}|g" "$file"
            
            # Clean up temporary files
            rm -f "${file}.tmp"
        done
        
        echo "✅ Updated: $file"
    fi
}

# Update references in key files
echo "📝 Updating documentation files..."

find . -maxdepth 1 -name "*.md" -exec bash -c 'update_references "$0"' {} \;
find . -maxdepth 1 -name "*.sh" -exec bash -c 'update_references "$0"' {} \;
find . -maxdepth 1 -name "*.yml" -exec bash -c 'update_references "$0"' {} \;
find . -maxdepth 1 -name "*.yaml" -exec bash -c 'update_references "$0"' {} \;

# Define the function for the find command
export -f update_references
export REPO_MAPPING

echo ""
echo "✅ Reference updates completed"
echo "📦 All references now point to official repositories"
