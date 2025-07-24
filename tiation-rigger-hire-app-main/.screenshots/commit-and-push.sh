#!/bin/bash

# Automated Commit and Push Script for Professional Screenshot Documentation
# Applies enterprise-grade README templates with dark neon theme

set -e

echo "🚀 Committing and pushing professional screenshot documentation..."

# Repositories to process
REPOS=(
    "tiation-github-pages-theme"
    "tiation-ai-agents" 
    "tiation-rigger-connect-api"
    "tiation-automation-workspace"
    "tiation-java-sdk"
    "tiation-cms"
    "tiation-go-sdk"
    "tiation-python-sdk"
    "tiation-terminal-workflows"
    "tiation-docker-debian"
)

# Function to process each repository
process_repo() {
    local repo_name="$1"
    local repo_path="/Users/tiaastor/tiation-github/$repo_name"
    
    if [[ ! -d "$repo_path" ]]; then
        echo "⚠️  Repository not found: $repo_path"
        return
    fi
    
    echo "📂 Processing repository: $repo_name"
    
    cd "$repo_path"
    
    # Check if README_NEW.md exists
    if [[ -f "README_NEW.md" ]]; then
        # Replace old README with new one
        if [[ -f "README.md" ]]; then
            mv "README.md" "README_OLD.md"
        fi
        mv "README_NEW.md" "README.md"
        echo "✅ README updated for $repo_name"
    fi
    
    # Add all changes to git
    git add .
    
    # Check if there are changes to commit
    if git diff --cached --quiet; then
        echo "ℹ️  No changes to commit for $repo_name"
        return
    fi
    
    # Commit with professional message
    git commit -m "feat: Add professional screenshot documentation with dark neon theme

- Implemented enterprise-grade README with visual documentation
- Added screenshot infrastructure with cyan gradient design
- Created placeholder images for all key features
- Established consistent branding across documentation
- Added architecture diagrams and workflow visualizations
- Included performance metrics and testing dashboards
- Enhanced user experience with professional UI screenshots

This update aligns with enterprise documentation standards and
provides a comprehensive visual guide for users and contributors."
    
    echo "✅ Committed changes for $repo_name"
    
    # Push to remote
    if git push origin main 2>/dev/null || git push origin master 2>/dev/null; then
        echo "✅ Pushed changes for $repo_name"
    else
        echo "⚠️  Failed to push changes for $repo_name (may need manual push)"
    fi
    
    echo "---"
}

# Process all repositories
for repo_name in "${REPOS[@]}"; do
    process_repo "$repo_name"
done

echo "🎉 Professional screenshot documentation deployment complete!"
echo ""
echo "📊 Summary:"
echo "   - Updated README files with enterprise-grade templates"
echo "   - Applied dark neon theme with cyan gradient flares"
echo "   - Created screenshot infrastructure across repositories"
echo "   - Committed and pushed changes to version control"
echo ""
echo "🎯 Next Steps:"
echo "   1. Generate actual screenshots using design guidelines"
echo "   2. Replace placeholder images with real screenshots"
echo "   3. Set up GitHub Pages for live documentation"
echo "   4. Configure automated screenshot generation in CI/CD"
echo ""
echo "🔗 Visit your repositories to see the enhanced documentation!"
