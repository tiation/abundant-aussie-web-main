#!/bin/bash

# Professional Screenshot Setup Script for Tiation Repositories
# Dark Neon Theme with Cyan Gradient Flares

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCREENSHOTS_DIR="$SCRIPT_DIR"

echo "🎨 Setting up professional screenshots with dark neon theme..."

# Process first 10 repositories
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

# Setup screenshots for each repository
for repo_name in "${REPOS[@]}"; do
    repo_path="/Users/tiaastor/tiation-github/$repo_name"
    
    if [[ -d "$repo_path" ]]; then
        echo "📂 Processing repository: $repo_name"
        
        # Create screenshot directories
        mkdir -p "$repo_path/.screenshots"
        
        # Create README template customized for this repo
        sed "s/project-name/$repo_name/g" "$SCREENSHOTS_DIR/README_TEMPLATE.md" > "$repo_path/README_NEW.md"
        
        # Create placeholder image files
        touch "$repo_path/.screenshots/"{hero-banner,demo-overview,feature-{1..4},architecture-diagram,tech-stack,desktop-interface,mobile-interface,dark-theme,development-workflow,deployment-pipeline,contribution-workflow,performance-metrics,testing-dashboard,documentation-preview,configuration-setup,support-channels,roadmap,footer-banner}.png
        
        echo "✅ Setup complete for $repo_name"
    else
        echo "⚠️  Repository not found: $repo_path"
    fi
done

echo "✨ Screenshot documentation setup complete!"
echo "🎯 Next steps:"
echo "   1. Review README_NEW.md files in each repository"
echo "   2. Replace README.md with README_NEW.md when satisfied"
echo "   3. Generate actual screenshots using design guidelines"
echo "   4. Commit and push changes to repositories"
