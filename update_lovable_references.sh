#!/bin/bash

# Array of directories to process (excluding .archive and already processed ones)
PROJECTS=(
    "tiation-secure-vpn-web"
    "mark-photo-flare-site"
    "tiation-kindness-web"
    "unit-22-clean-guide"
    "shattered-realms-nexus"
    "orangery-ventures-harmony-759"
    "standing-strong-web"
    "rigg-connect-app"
    "tiation-rigger-hire-app-main/enterprise-core/templates/react"
)

BASE_DIR="/Users/tiaastor/Github/tiation-repos"

for PROJECT in "${PROJECTS[@]}"; do
    PROJECT_DIR="$BASE_DIR/$PROJECT"
    
    if [ -d "$PROJECT_DIR" ]; then
        echo "Processing $PROJECT..."
        
        # Check if package.json exists and has lovable-tagger
        if [ -f "$PROJECT_DIR/package.json" ] && grep -q "lovable-tagger" "$PROJECT_DIR/package.json"; then
            cd "$PROJECT_DIR"
            echo "  Updating npm dependencies..."
            npm uninstall lovable-tagger @vitejs/plugin-react-swc 2>/dev/null || true
            npm install @vitejs/plugin-react@latest esbuild@latest 2>/dev/null || true
        fi
        
        # Update vite.config.ts if it exists
        if [ -f "$PROJECT_DIR/vite.config.ts" ]; then
            echo "  Updating vite.config.ts..."
            sed -i '' 's/import { componentTagger } from "lovable-tagger";//g' "$PROJECT_DIR/vite.config.ts"
            sed -i '' 's/@vitejs\/plugin-react-swc/@vitejs\/plugin-react/g' "$PROJECT_DIR/vite.config.ts"
            sed -i '' 's/({ mode }) =>/() =>/g' "$PROJECT_DIR/vite.config.ts"
            sed -i '' '/componentTagger(),/d' "$PROJECT_DIR/vite.config.ts"
            sed -i '' '/mode === .development. &&/d' "$PROJECT_DIR/vite.config.ts"
            sed -i '' '/].filter(Boolean)/s/].filter(Boolean)/]/g' "$PROJECT_DIR/vite.config.ts"
        fi
        
        # Update index.html if it exists
        if [ -f "$PROJECT_DIR/index.html" ]; then
            echo "  Updating index.html..."
            sed -i '' 's/Lovable Generated Project/Tiation Generated Project/g' "$PROJECT_DIR/index.html"
            sed -i '' 's/content="Lovable"/content="Tiation"/g' "$PROJECT_DIR/index.html"
            sed -i '' 's/@lovable_dev/@tiation_dev/g' "$PROJECT_DIR/index.html"
            sed -i '' 's/https:\/\/lovable.dev\/opengraph-image-p98pqg.png/https:\/\/tiation.net\/opengraph-image.png/g' "$PROJECT_DIR/index.html"
        fi
        
        # Update README.md if it exists
        if [ -f "$PROJECT_DIR/README.md" ]; then
            echo "  Updating README.md..."
            # Create a generic project name from directory
            PROJECT_NAME=$(basename "$PROJECT")
            sed -i '' 's/# Welcome to your Lovable project/# Welcome to your Tiation project/g' "$PROJECT_DIR/README.md"
            sed -i '' 's/https:\/\/lovable.dev\/projects\/[^)]*/https:\/\/tiation.net\/projects\/'$PROJECT_NAME'/g' "$PROJECT_DIR/README.md"
            sed -i '' 's/\[Lovable Project\](https:\/\/lovable.dev\/projects\/[^)]*/[Tiation Project](https:\/\/tiation.net\/projects\/'$PROJECT_NAME'/g' "$PROJECT_DIR/README.md"
            sed -i '' 's/Changes made via Lovable/Changes made via Tiation/g' "$PROJECT_DIR/README.md"
            sed -i '' 's/Use Lovable/Use Tiation Development Environment/g' "$PROJECT_DIR/README.md"
            sed -i '' 's/reflected in Lovable/reflected in Tiation/g' "$PROJECT_DIR/README.md"
            sed -i '' 's/\[Lovable\](https:\/\/lovable.dev\/projects\/[^)]*/[Tiation](https:\/\/tiation.net\/projects\/'$PROJECT_NAME'/g' "$PROJECT_DIR/README.md"
            sed -i '' 's/my Lovable project/my Tiation project/g' "$PROJECT_DIR/README.md"
            sed -i '' 's/https:\/\/docs.lovable.dev/https:\/\/docs.tiation.net/g' "$PROJECT_DIR/README.md"
        fi
        
        echo "  Completed $PROJECT"
    else
        echo "Directory $PROJECT_DIR not found, skipping..."
    fi
done

echo "All projects processed!"
