#!/bin/bash

# 🚀 Tiation Project Creation Script
# Creates new projects from enterprise templates

set -e

echo "🏢 Tiation Enterprise Project Creator"
echo "====================================="

# Check if template type is provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 <template-type> <project-name>"
    echo ""
    echo "Available templates:"
    echo "  react     - React + TypeScript + Shadcn/ui"
    echo "  svelte    - SvelteKit + TypeScript + Tailwind"
    echo "  intranet  - Vue 3 + TypeScript + Enterprise UI"
    echo ""
    exit 1
fi

TEMPLATE_TYPE=$1
PROJECT_NAME=$2

if [ -z "$PROJECT_NAME" ]; then
    echo "❌ Please provide a project name"
    echo "Example: $0 react my-awesome-project"
    exit 1
fi

# Validate template type
if [ ! -d "enterprise-core/templates/$TEMPLATE_TYPE" ]; then
    echo "❌ Template type '$TEMPLATE_TYPE' not found"
    echo "Available: react, svelte, intranet"
    exit 1
fi

# Check if target directory exists
if [ -d "../$PROJECT_NAME" ]; then
    echo "❌ Directory '../$PROJECT_NAME' already exists"
    exit 1
fi

echo "📁 Creating project: $PROJECT_NAME"
echo "📋 Using template: $TEMPLATE_TYPE"
echo ""

# Copy template
echo "🔄 Copying template files..."
cp -r "enterprise-core/templates/$TEMPLATE_TYPE" "../$PROJECT_NAME"

# Update package.json if it exists
if [ -f "../$PROJECT_NAME/package.json" ]; then
    echo "📦 Updating package.json..."
    sed -i '' "s/\"name\": \".*\"/\"name\": \"$PROJECT_NAME\"/" "../$PROJECT_NAME/package.json" 2>/dev/null || true
fi

# Update README if it exists
if [ -f "../$PROJECT_NAME/README.md" ]; then
    echo "📝 Updating README..."
    sed -i '' "1s/.*/# $PROJECT_NAME/" "../$PROJECT_NAME/README.md" 2>/dev/null || true
fi

echo ""
echo "✅ Project created successfully!"
echo ""
echo "🚀 Next steps:"
echo "   cd ../$PROJECT_NAME"
echo "   npm install"
echo "   npm run dev"
echo ""
echo "📚 Documentation: enterprise-core/templates/README.md"
