#!/bin/bash

# Tiation Template Customization Script
# Usage: ./customize-template.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
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
echo -e "${PURPLE}"
echo "🔮 Tiation Enterprise Template Customizer"
echo "========================================="
echo -e "${NC}"

# Check if we're in the template directory
if [[ ! -f "PROJECT-NAMING-SYSTEM.md" ]]; then
    print_error "This script must be run from the template directory"
    exit 1
fi

# Collect project information
echo -e "${CYAN}Please provide the following information:${NC}"
echo

read -p "Project Name (e.g., 'Tiation Analytics Platform'): " PROJECT_NAME
read -p "Project Slug (e.g., 'Analytics_Platform'): " PROJECT_SLUG
read -p "GitHub Repository Name (e.g., 'tiation-analytics-platform'): " GITHUB_REPO_NAME
read -p "Project Description: " PROJECT_DESCRIPTION
read -p "Detailed Project Description: " PROJECT_DESCRIPTION_DETAILED

echo
echo -e "${YELLOW}Feature Information:${NC}"
read -p "Feature 1 Title: " FEATURE_1_TITLE
read -p "Feature 1 Description: " FEATURE_1_DESCRIPTION
read -p "Feature 2 Title: " FEATURE_2_TITLE  
read -p "Feature 2 Description: " FEATURE_2_DESCRIPTION
read -p "Feature 3 Title: " FEATURE_3_TITLE
read -p "Feature 3 Description: " FEATURE_3_DESCRIPTION

echo
echo -e "${YELLOW}Technical Information:${NC}"
read -p "Domain Name (e.g., 'Analytics'): " DOMAIN_NAME
read -p "API Name (e.g., 'Analytics API'): " API_NAME
read -p "Backend Service (e.g., 'Analytics Engine'): " BACKEND_SERVICE
read -p "Backend Technology (e.g., 'Node.js with Express'): " BACKEND_TECHNOLOGY
read -p "Database Technology (e.g., 'PostgreSQL'): " DATABASE_TECHNOLOGY
read -p "Data Layer (e.g., 'PostgreSQL Database'): " DATA_LAYER
read -p "Business Logic (e.g., 'Analytics Engine'): " BUSINESS_LOGIC

echo
echo -e "${YELLOW}Core Features:${NC}"
read -p "Core Feature 1: " CORE_FEATURE_1
read -p "Core Feature 1 Description: " CORE_FEATURE_1_DESCRIPTION
read -p "Core Feature 2: " CORE_FEATURE_2
read -p "Core Feature 2 Description: " CORE_FEATURE_2_DESCRIPTION
read -p "Core Feature 3: " CORE_FEATURE_3
read -p "Core Feature 3 Description: " CORE_FEATURE_3_DESCRIPTION
read -p "Core Feature 4: " CORE_FEATURE_4
read -p "Core Feature 4 Description: " CORE_FEATURE_4_DESCRIPTION

echo
echo -e "${YELLOW}Additional Requirements:${NC}"
read -p "Additional Requirements (e.g., 'Redis for caching'): " ADDITIONAL_REQUIREMENTS
read -p "System Requirements: " SYSTEM_REQUIREMENTS

echo
echo -e "${YELLOW}Usage Instructions:${NC}"
read -p "Basic Usage Instructions: " BASIC_USAGE_INSTRUCTIONS
read -p "Advanced Usage Instructions: " ADVANCED_USAGE_INSTRUCTIONS
read -p "Usage Examples: " USAGE_EXAMPLES

echo
echo -e "${YELLOW}Project Keywords (comma-separated): " PROJECT_KEYWORDS

# Generate replacements array
declare -A replacements=(
    ["{{PROJECT_NAME}}"]="$PROJECT_NAME"
    ["{{PROJECT_SLUG}}"]="$PROJECT_SLUG"
    ["{{GITHUB_REPO_NAME}}"]="$GITHUB_REPO_NAME"
    ["{{PROJECT_DESCRIPTION}}"]="$PROJECT_DESCRIPTION"
    ["{{PROJECT_DESCRIPTION_DETAILED}}"]="$PROJECT_DESCRIPTION_DETAILED"
    ["{{FEATURE_1_TITLE}}"]="$FEATURE_1_TITLE"
    ["{{FEATURE_1_DESCRIPTION}}"]="$FEATURE_1_DESCRIPTION"
    ["{{FEATURE_2_TITLE}}"]="$FEATURE_2_TITLE"
    ["{{FEATURE_2_DESCRIPTION}}"]="$FEATURE_2_DESCRIPTION"
    ["{{FEATURE_3_TITLE}}"]="$FEATURE_3_TITLE"
    ["{{FEATURE_3_DESCRIPTION}}"]="$FEATURE_3_DESCRIPTION"
    ["{{DOMAIN_NAME}}"]="$DOMAIN_NAME"
    ["{{API_NAME}}"]="$API_NAME"
    ["{{BACKEND_SERVICE}}"]="$BACKEND_SERVICE"
    ["{{BACKEND_TECHNOLOGY}}"]="$BACKEND_TECHNOLOGY"
    ["{{DATABASE_TECHNOLOGY}}"]="$DATABASE_TECHNOLOGY"
    ["{{DATA_LAYER}}"]="$DATA_LAYER"
    ["{{BUSINESS_LOGIC}}"]="$BUSINESS_LOGIC"
    ["{{CORE_FEATURE_1}}"]="$CORE_FEATURE_1"
    ["{{CORE_FEATURE_1_DESCRIPTION}}"]="$CORE_FEATURE_1_DESCRIPTION"
    ["{{CORE_FEATURE_2}}"]="$CORE_FEATURE_2"
    ["{{CORE_FEATURE_2_DESCRIPTION}}"]="$CORE_FEATURE_2_DESCRIPTION"
    ["{{CORE_FEATURE_3}}"]="$CORE_FEATURE_3"
    ["{{CORE_FEATURE_3_DESCRIPTION}}"]="$CORE_FEATURE_3_DESCRIPTION"
    ["{{CORE_FEATURE_4}}"]="$CORE_FEATURE_4"
    ["{{CORE_FEATURE_4_DESCRIPTION}}"]="$CORE_FEATURE_4_DESCRIPTION"
    ["{{ADDITIONAL_REQUIREMENTS}}"]="$ADDITIONAL_REQUIREMENTS"
    ["{{SYSTEM_REQUIREMENTS}}"]="$SYSTEM_REQUIREMENTS"
    ["{{BASIC_USAGE_INSTRUCTIONS}}"]="$BASIC_USAGE_INSTRUCTIONS"
    ["{{ADVANCED_USAGE_INSTRUCTIONS}}"]="$ADVANCED_USAGE_INSTRUCTIONS"
    ["{{USAGE_EXAMPLES}}"]="$USAGE_EXAMPLES"
    ["{{PROJECT_KEYWORDS}}"]="$PROJECT_KEYWORDS"
)

# Confirmation
echo
echo -e "${CYAN}Project Summary:${NC}"
echo "=================="
echo "Project Name: $PROJECT_NAME"
echo "Repository: $GITHUB_REPO_NAME"
echo "Description: $PROJECT_DESCRIPTION"
echo

read -p "Continue with customization? (y/N): " confirm
if [[ ! $confirm =~ ^[Yy]$ ]]; then
    print_warning "Customization cancelled."
    exit 0
fi

print_status "Starting template customization..."

# Find all files to customize
file_types=("*.md" "*.json" "*.ts" "*.js" "*.svelte" "*.html")
files_to_process=()

for type in "${file_types[@]}"; do
    while IFS= read -r -d '' file; do
        files_to_process+=("$file")
    done < <(find . -name "$type" -type f -print0)
done

print_status "Found ${#files_to_process[@]} files to process"

# Process each file
for file in "${files_to_process[@]}"; do
    print_status "Processing: $file"
    
    # Create temporary file
    temp_file=$(mktemp)
    cp "$file" "$temp_file"
    
    # Apply all replacements
    for placeholder in "${!replacements[@]}"; do
        replacement="${replacements[$placeholder]}"
        # Escape special characters for sed
        escaped_placeholder=$(printf '%s\n' "$placeholder" | sed 's/[[\.*^$()+?{|]/\\&/g')
        escaped_replacement=$(printf '%s\n' "$replacement" | sed 's/[[\.*^$(){}?+|/]/\\&/g')
        
        sed -i '' "s/$escaped_placeholder/$escaped_replacement/g" "$temp_file"
    done
    
    # Replace original file
    mv "$temp_file" "$file"
done

# Update package.json name field specifically
if [[ -f "package.json" ]]; then
    print_status "Updating package.json name field..."
    sed -i '' "s/\"name\": \"tiation-svelte-enterprise-template\"/\"name\": \"$GITHUB_REPO_NAME\"/g" package.json
fi

# Clean up template-specific files
print_status "Cleaning up template files..."
rm -f "PROJECT-NAMING-SYSTEM.md"
rm -f "scripts/customize-template.sh"

print_success "Template customization completed!"
print_status "Next steps:"
echo "  1. Review and verify all files"
echo "  2. Initialize git repository: git init"
echo "  3. Add files: git add ."
echo "  4. Commit: git commit -m 'feat: initial project setup'"
echo "  5. Add remote: git remote add origin https://github.com/tiation/$GITHUB_REPO_NAME.git"
echo "  6. Push: git push -u origin main"

echo
print_success "🎉 Your Tiation project is ready!"
