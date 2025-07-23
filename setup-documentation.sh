#!/bin/bash
# Setup standardized documentation structure for all Rigger repositories
# ChaseWhiteRabbit NGO - Ethical Technology Standards

set -euo pipefail

REPOS=(
    "RiggerBackend"
    "RiggerConnect-android"
    "RiggerConnect-ios"
    "RiggerHub-android" 
    "RiggerHub-ios"
    "RiggerHub-web"
    "RiggerShared"
)

BASE_DIR="/Users/tiaastor/Github/tiation-repos"

echo "🏗️ Setting up ChaseWhiteRabbit NGO documentation standards..."

for repo in "${REPOS[@]}"; do
    echo "📁 Processing $repo..."
    
    # Create standard directory structure
    mkdir -p "$BASE_DIR/$repo/docs"/{api,architecture,deployment,development,security,testing,ethics}
    mkdir -p "$BASE_DIR/$repo/tests"/{unit,integration,e2e}
    mkdir -p "$BASE_DIR/$repo/scripts"/{build,deploy,maintenance,security}
    
    echo "✅ Created directories for $repo"
done

echo "🎉 Documentation structure setup complete!"
echo "📚 Next steps:"
echo "   1. Populate README.md files for each repository"
echo "   2. Add security guidelines and ethical frameworks"
echo "   3. Configure CI/CD integration"
echo "   4. Set up monitoring and observability"
