#!/bin/bash

# Tiation New Project Creation Script
# Usage: ./create-new-project.sh [project-name]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${CYAN}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Welcome message
echo -e "${CYAN}"
echo "🔮 Tiation New Project Creator"
echo "=============================="
echo -e "${NC}"

# Get project name
if [[ -n "$1" ]]; then
    NEW_PROJECT_NAME="$1"
else
    read -p "Enter new project name (e.g., 'tiation-analytics-platform'): " NEW_PROJECT_NAME
fi

# Validate naming convention
if [[ ! $NEW_PROJECT_NAME =~ ^tiation-[a-z]+-[a-z-]+$ ]]; then
    print_error "Project name must follow the pattern: tiation-[category]-[type]-[name]"
    print_error "Example: tiation-ai-platform, tiation-svelte-dashboard-tool"
    exit 1
fi

TIATION_ROOT="/Users/tiaastor/tiation-github"

# Check for existing projects
print_status "Checking for existing projects..."

# Search for similar project names
similar_projects=$(find "$TIATION_ROOT" -maxdepth 1 -name "*$(echo "$NEW_PROJECT_NAME" | cut -d'-' -f2-)*" -type d 2>/dev/null | grep -v "tiation-svelte-enterprise-template" || true)

if [[ -n "$similar_projects" ]]; then
    print_warning "Found similar existing projects:"
    echo "$similar_projects"
    echo
    read -p "Continue anyway? (y/N): " continue_anyway
    if [[ ! $continue_anyway =~ ^[Yy]$ ]]; then
        print_warning "Project creation cancelled."
        exit 0
    fi
fi

# Check if project already exists
if [[ -d "$TIATION_ROOT/$NEW_PROJECT_NAME" ]]; then
    print_error "Project '$NEW_PROJECT_NAME' already exists!"
    exit 1
fi

# Create new project directory
print_status "Creating new project: $NEW_PROJECT_NAME"
cd "$TIATION_ROOT"
cp -r tiation-svelte-enterprise-template "$NEW_PROJECT_NAME"

# Navigate to new project
cd "$NEW_PROJECT_NAME"

print_status "Project created at: $TIATION_ROOT/$NEW_PROJECT_NAME"
print_status "Next steps:"
echo "  1. cd $TIATION_ROOT/$NEW_PROJECT_NAME"
echo "  2. Run: ./scripts/customize-template.sh"
echo "  3. Follow the customization prompts"
echo "  4. Initialize git and push to GitHub"

print_success "🎉 Ready to customize your new Tiation project!"

# Ask if user wants to run customization now
echo
read -p "Run customization script now? (Y/n): " run_customize
if [[ $run_customize =~ ^[Nn]$ ]]; then
    print_status "Customization skipped. Run './scripts/customize-template.sh' when ready."
else
    print_status "Starting customization..."
    ./scripts/customize-template.sh
fi
