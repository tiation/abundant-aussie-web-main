#!/bin/bash

# Find all projects in git-workspace that contain lovable references
echo "Processing git-workspace projects..."

BASE_DIR="/Users/tiaastor/Github/tiation-repos"

# Find all directories with lovable references in git-workspace
find "$BASE_DIR/git-workspace" -type f \( -name "*.html" -o -name "*.md" -o -name "*.json" -o -name "*.ts" \) -exec grep -l "lovable" {} \; | while read file; do
    
    PROJECT_DIR=$(dirname "$file")
    
    echo "Processing file: $file"
    
    # Update HTML files
    if [[ "$file" == *.html ]]; then
        sed -i '' 's/Lovable Generated Project/Tiation Generated Project/g' "$file"
        sed -i '' 's/content="Lovable"/content="Tiation"/g' "$file"
        sed -i '' 's/@lovable_dev/@tiation_dev/g' "$file"
        sed -i '' 's/https:\/\/lovable.dev\/opengraph-image-p98pqg.png/https:\/\/tiation.net\/opengraph-image.png/g' "$file"
    fi
    
    # Update README files
    if [[ "$file" == *.md ]]; then
        PROJECT_NAME=$(basename "$PROJECT_DIR")
        sed -i '' 's/# Welcome to your Lovable project/# Welcome to your Tiation project/g' "$file"
        sed -i '' 's/https:\/\/lovable.dev\/projects\/[^)]*/https:\/\/tiation.net\/projects\/'$PROJECT_NAME'/g' "$file"
        sed -i '' 's/\[Lovable Project\](https:\/\/lovable.dev\/projects\/[^)]*/[Tiation Project](https:\/\/tiation.net\/projects\/'$PROJECT_NAME'/g' "$file"
        sed -i '' 's/Changes made via Lovable/Changes made via Tiation/g' "$file"
        sed -i '' 's/Use Lovable/Use Tiation Development Environment/g' "$file"
        sed -i '' 's/reflected in Lovable/reflected in Tiation/g' "$file"
        sed -i '' 's/\[Lovable\](https:\/\/lovable.dev\/projects\/[^)]*/[Tiation](https:\/\/tiation.net\/projects\/'$PROJECT_NAME'/g' "$file"
        sed -i '' 's/my Lovable project/my Tiation project/g' "$file"
        sed -i '' 's/https:\/\/docs.lovable.dev/https:\/\/docs.tiation.net/g' "$file"
    fi
    
    # Update vite.config.ts files if they exist in the same directory
    VITE_CONFIG="$PROJECT_DIR/vite.config.ts"
    if [ -f "$VITE_CONFIG" ]; then
        echo "  Updating vite.config.ts in $PROJECT_DIR"
        sed -i '' 's/import { componentTagger } from "lovable-tagger";//g' "$VITE_CONFIG"
        sed -i '' 's/@vitejs\/plugin-react-swc/@vitejs\/plugin-react/g' "$VITE_CONFIG"
        sed -i '' 's/({ mode }) =>/() =>/g' "$VITE_CONFIG"
        sed -i '' '/componentTagger(),/d' "$VITE_CONFIG"
        sed -i '' '/mode === .development. &&/d' "$VITE_CONFIG"
        sed -i '' '/].filter(Boolean)/s/].filter(Boolean)/]/g' "$VITE_CONFIG"
    fi
    
    # Update package.json files if they exist in the same directory
    PACKAGE_JSON="$PROJECT_DIR/package.json"
    if [ -f "$PACKAGE_JSON" ] && grep -q "lovable-tagger" "$PACKAGE_JSON"; then
        echo "  Updating npm dependencies in $PROJECT_DIR"
        cd "$PROJECT_DIR"
        npm uninstall lovable-tagger @vitejs/plugin-react-swc 2>/dev/null || true
        npm install @vitejs/plugin-react@latest esbuild@latest 2>/dev/null || true
    fi
    
done

echo "Git-workspace projects processed!"
