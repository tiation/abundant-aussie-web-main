#!/bin/bash

# Mass Git Push Script for Tiation GitHub Repositories
# This script pushes name changes to all repositories

echo "🚀 Starting mass git push for all Tiation repositories..."
echo "=================================================="

# Function to push changes for a single repository
push_repo() {
    local repo_dir="$1"
    local repo_name=$(basename "$repo_dir")
    
    echo -e "\n📁 Processing: $repo_name"
    echo "----------------------------------------"
    
    # Check if directory exists and is a git repo
    if [ ! -d "$repo_dir" ]; then
        echo "❌ Directory does not exist: $repo_dir"
        return 1
    fi
    
    if [ ! -d "$repo_dir/.git" ]; then
        echo "❌ Not a git repository: $repo_dir"
        return 1
    fi
    
    # Change to repository directory
    cd "$repo_dir" || return 1
    
    # Check if there are changes to commit
    if git diff --quiet && git diff --staged --quiet; then
        echo "✅ No changes to commit in $repo_name"
    else
        echo "📝 Adding and committing changes..."
        git add .
        git commit -m "Update repository name and branding changes"
    fi
    
    # Check if there are commits to push
    if git rev-parse --verify HEAD &>/dev/null; then
        local ahead=$(git rev-list --count HEAD @{u} 2>/dev/null || echo "0")
        if [ "$ahead" -gt 0 ] || [ "$(git status --porcelain)" != "" ]; then
            echo "⬆️ Pushing changes to GitHub..."
            if git push origin main 2>/dev/null || git push origin master 2>/dev/null; then
                echo "✅ Successfully pushed $repo_name"
            else
                echo "❌ Failed to push $repo_name"
            fi
        else
            echo "✅ Already up to date: $repo_name"
        fi
    else
        echo "⚠️ No commits found in $repo_name"
    fi
    
    cd "$ORIGINAL_DIR"
}

# Store original directory
ORIGINAL_DIR=$(pwd)

# List of all repository directories to process
REPOS=(
    "admin-archive"
    "admin-automation" 
    "admin-dotfiles"
    "admin-enterprise-core"
    "admin-infrastructure"
    "admin-infrastructure-temp"
    "admin-specialized-projects"
    "admin-templates"
    "admin-tools"
    "ai-services"
    "dnddiceroller-android"
    "dnddiceroller-enhanced"
    "dnddiceroller-ios"
    "dnddiceroller-linux-chrome"
    "dnddiceroller-marketing-site"
    "documentation"
    "guide-Parrot-Security-Guide"
    "ios-MinutesRecorder"
    "linnovative-ethical-iberation-system"
    "mac-zsh-completions"
    "mvp-development-tools"
    "mvp-dockerdeb"
    "network-headscale-admin"
    "network-mesh-network"
    "personal-grieftodesign"
    "personal-Law"
    "rigger-ecosystem"
    "shared-assets"
    "shared-templates-monetization-templates"
    "temp-github-pages"
    "tiation"
    "tiation-active-directory-setup"
    "tiation-afl-fantasy-manager-docs"
    "tiation-ai-agents"
    "tiation-ai-code-assistant"
    "tiation-ai-platform"
    "tiation-alma-street-project"
    "tiation-ansible-enterprise"
    "tiation-automation-workspace"
    "tiation-chase-white-rabbit-ngo"
    "tiation-claude-desktop-linux"
    "tiation-cms"
    "tiation-company-intranet-template"
    "tiation-docker-debian"
    "tiation-economic-reform-proposal"
    "tiation-fantasy-premier-league"
    "tiation-github-pages-theme"
    "tiation-go-sdk"
    "tiation-headless-cms"
    "tiation-infrastructure-charms"
    "tiation-invoice-generator"
    "tiation-java-sdk"
    "tiation-js-sdk"
    "tiation-knowledge-base-ai"
    "tiation-legal-case-studies"
    "tiation-m4-project"
    "tiation-macos-networking-guide"
    "tiation-parrot-security-guide-au"
    "tiation-private-ai-chat"
    "tiation-python-sdk"
    "tiation-react-template"
    "tiation-rigger-automation-server"
    "tiation-rigger-connect-api"
    "tiation-rigger-connect-app"
    "tiation-rigger-infrastructure"
    "tiation-rigger-jobs-app"
    "tiation-rigger-metrics-dashboard"
    "tiation-rigger-mobile-app"
    "tiation-rigger-platform"
    "tiation-rigger-shared-libraries"
    "tiation-rigger-workspace"
    "tiation-rigger-workspace-docs"
    "tiation-secure-vpn"
    "tiation-server-configs-gae"
    "tiation-terminal-workflows"
    "tiation-TiaAstor"
    "tiation-vpn-mesh-network"
    "tiation.github.io"
    "ubuntu-dev-setup"
    "windows-dev-setup"
    "www-dontbeacunt"
    "www-ProtectChildrenAustralia"
    "www-shattered-realms-nexus"
    "www-spring-up-markers-web"
    "www-tailwind-home-safety-matrix-ai"
    "www-tailwind-mark-photo-flare-site"
    "www-tailwind-mupan-leopard-wellness-hub"
    "www-tailwind-perth-white-glove-magic"
    "www-tiation-wellness-hub"
    "www-tough-talk-podcast-chaos"
)

# First, handle the main repository
echo -e "\n🏠 Processing main tiation-github repository..."
git add .
git commit -m "Update repository organization and enterprise structure"
git push origin main

# Process each repository
SUCCESS_COUNT=0
FAIL_COUNT=0

for repo in "${REPOS[@]}"; do
    if [ -d "$repo" ]; then
        push_repo "$repo"
        if [ $? -eq 0 ]; then
            ((SUCCESS_COUNT++))
        else
            ((FAIL_COUNT++))
        fi
    else
        echo "⚠️ Repository directory not found: $repo"
        ((FAIL_COUNT++))
    fi
done

echo -e "\n=================================================="
echo "🎉 Mass git push completed!"
echo "✅ Successfully processed: $SUCCESS_COUNT repositories"
echo "❌ Failed to process: $FAIL_COUNT repositories"
echo "=================================================="
