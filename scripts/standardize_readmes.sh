#!/bin/bash

# README Standardization Script for ChaseWhiteRabbit NGO Repositories
# This script ensures all repositories follow consistent documentation standards

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
TEMPLATE_FILE="$REPO_ROOT/README_TEMPLATE.md"

# Log function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to detect project type and technology stack
detect_project_info() {
    local project_dir="$1"
    local project_name=$(basename "$project_dir")
    
    # Initialize project info
    local tech_stack=""
    local project_type=""
    local main_port="3000"
    
    # Check for different project types
    if [[ -f "$project_dir/package.json" ]]; then
        # Node.js/JavaScript project
        if grep -q "next" "$project_dir/package.json" 2>/dev/null; then
            tech_stack="Next.js, React, TypeScript"
            project_type="web"
            main_port="3000"
        elif grep -q "react" "$project_dir/package.json" 2>/dev/null; then
            tech_stack="React, TypeScript"
            project_type="web"
            main_port="3000"
        elif grep -q "express" "$project_dir/package.json" 2>/dev/null; then
            tech_stack="Node.js, Express, TypeScript"
            project_type="api"
            main_port="5000"
        elif grep -q "fastify" "$project_dir/package.json" 2>/dev/null; then
            tech_stack="Node.js, Fastify, TypeScript"
            project_type="api"
            main_port="5000"
        else
            tech_stack="Node.js, TypeScript"
            project_type="library"
        fi
    elif [[ -f "$project_dir/Cargo.toml" ]]; then
        tech_stack="Rust"
        project_type="api"
        main_port="8000"
    elif [[ -f "$project_dir/go.mod" ]]; then
        tech_stack="Go"
        project_type="api"
        main_port="8080"
    elif [[ -f "$project_dir/pubspec.yaml" ]]; then
        tech_stack="Flutter, Dart"
        project_type="mobile"
        main_port="N/A"
    elif [[ -f "$project_dir/build.gradle" || -f "$project_dir/app/build.gradle" ]]; then
        tech_stack="Android, Kotlin/Java"
        project_type="mobile"
        main_port="N/A"
    elif [[ -f "$project_dir/ios/Podfile" || -f "$project_dir/*.xcodeproj" ]]; then
        tech_stack="iOS, Swift"
        project_type="mobile"
        main_port="N/A"
    else
        tech_stack="Documentation/Assets"
        project_type="documentation"
        main_port="N/A"
    fi
    
    echo "$project_name|$tech_stack|$project_type|$main_port"
}

# Function to generate project-specific README
generate_readme() {
    local project_dir="$1"
    local project_info=$(detect_project_info "$project_dir")
    
    IFS='|' read -r project_name tech_stack project_type main_port <<< "$project_info"
    
    # Create project-specific variables
    local repo_name="$project_name"
    local project_tagline=""
    local project_description=""
    local ascii_banner=""
    local project_values=""
    local feature_icons=""
    
    # Set project-specific content based on project name
    case "$project_name" in
        "RiggerConnect-web")
            project_tagline="Ethical Web Platform for Professional Networking"
            project_description="RiggerConnect Web Platform serves as the professional networking hub for the construction and rigging industry. Built with ChaseWhiteRabbit NGO's commitment to ethical technology, our platform empowers workers through meaningful connections, continuous learning, and career advancement opportunities."
            ascii_banner="🌐 CONNECTING PROFESSIONALS ETHICALLY 🌐"
            project_values="NETWORKING • LEARNING • CAREER GROWTH"
            feature_icons="🤝 CONNECT • 📚 LEARN • 🎯 GROW • 🛡️ SAFE • 🌟 ETHICAL"
            ;;
        "RiggerBackend")
            project_tagline="Ethical Backend Architecture for Blue-Collar Excellence"
            project_description="RiggerBackend serves as the robust, scalable, and ethical foundation for all RiggerConnect and RiggerHub applications. Built with ChaseWhiteRabbit NGO's commitment to worker empowerment, our backend prioritizes data sovereignty, algorithmic fairness, and industrial-grade reliability."
            ascii_banner="⚙️ POWERING THE DIGITAL RIGGING PLATFORM ⚙️"
            project_values="MICROSERVICES • SECURITY • SCALABILITY"
            feature_icons="🔐 AUTH • 📊 DATA • 🌐 API • 🔍 SEARCH • 📱 SYNC"
            ;;
        "RiggerShared")
            project_tagline="Shared Libraries and Components for Rigger Ecosystem"
            project_description="RiggerShared houses pivotal shared libraries and components forming the backbone of Rigger's entire ecosystem. These standardized modules optimize resource utilization and simplify consistent functionality across RiggerConnect, RiggerHub, and related platforms."
            ascii_banner="🔧 SHARED FOUNDATION FOR ENTERPRISE GRADE 🔧"
            project_values="CONSISTENCY • EFFICIENCY • MODULARITY"
            feature_icons="📦 COMPONENTS • 🔄 REUSABLE • 🏗️ MODULAR • ⚡ EFFICIENT"
            ;;
        "PosCalls4U")
            project_tagline="Enterprise Call Center Platform"
            project_description="PosCalls4U is a modern, enterprise-grade call center platform designed for scalability, security, and exceptional user experience. Built with cutting-edge technologies and comprehensive team management capabilities."
            ascii_banner="📞 ENTERPRISE CALL CENTER EXCELLENCE 📞"
            project_values="SCALABILITY • SECURITY • PERFORMANCE"
            feature_icons="📞 CALLS • 👥 TEAMS • 📊 ANALYTICS • 🔐 SECURE"
            ;;
        *)
            project_tagline="Enterprise-Grade Technology Solution"
            project_description="A cutting-edge platform designed with enterprise-grade architecture and ethical development practices, serving as part of the ChaseWhiteRabbit NGO's digital transformation initiatives."
            ascii_banner="🏗️ ENTERPRISE • ETHICAL • INNOVATIVE 🏗️"
            project_values="ENTERPRISE • ETHICAL • INNOVATIVE"
            feature_icons="🚀 MODERN • 🔒 SECURE • 🌟 ETHICAL • ⚡ FAST"
            ;;
    esac
    
    # Copy template and replace placeholders
    local readme_content=$(cat "$TEMPLATE_FILE")
    
    # Replace all placeholders
    readme_content="${readme_content//\[PROJECT_NAME\]/$project_name}"
    readme_content="${readme_content//\[REPO_NAME\]/$repo_name}"
    readme_content="${readme_content//\[PROJECT_TAGLINE\]/$project_tagline}"
    readme_content="${readme_content//\[PROJECT_DESCRIPTION\]/$project_description}"
    readme_content="${readme_content//\[ASCII_ART_BANNER\]/$ascii_banner}"
    readme_content="${readme_content//\[PROJECT_VALUES\]/$project_values}"
    readme_content="${readme_content//\[FEATURE_ICONS\]/$feature_icons}"
    readme_content="${readme_content//\[PORT\]/$main_port}"
    
    # Set default features
    readme_content="${readme_content//\[FEATURE_1\]/🚀 **Modern Architecture** - Built with latest technologies and best practices}"
    readme_content="${readme_content//\[FEATURE_2\]/🔒 **Enterprise Security** - Multi-layer security with encryption and access control}"
    readme_content="${readme_content//\[FEATURE_3\]/⚡ **High Performance** - Optimized for speed and scalability}"
    readme_content="${readme_content//\[FEATURE_4\]/🌟 **Ethical Design** - Privacy-first, bias-free, worker-empowering technology}"
    
    # Set technology-specific content
    if [[ "$tech_stack" == *"Next.js"* ]]; then
        readme_content="${readme_content//\[TECH_1\]/Next.js}"
        readme_content="${readme_content//\[VERSION\]/Latest}"
        readme_content="${readme_content//\[PURPOSE\]/React framework with App Router}"
        readme_content="${readme_content//\[PREREQUISITE_1\]/Node.js 18+ LTS}"
        readme_content="${readme_content//\[PREREQUISITE_2\]/npm or yarn package manager}"
        readme_content="${readme_content//\[PREREQUISITE_3\]/Git for version control}"
    else
        readme_content="${readme_content//\[TECH_1\]/$tech_stack}"
        readme_content="${readme_content//\[VERSION\]/Latest}"
        readme_content="${readme_content//\[PURPOSE\]/Core technology stack}"
        readme_content="${readme_content//\[PREREQUISITE_1\]/System requirements as per documentation}"
        readme_content="${readme_content//\[PREREQUISITE_2\]/Development tools and dependencies}"
        readme_content="${readme_content//\[PREREQUISITE_3\]/Configuration and setup requirements}"
    fi
    
    # Clean up remaining placeholders
    readme_content="${readme_content//\[TECH_2\]/TypeScript}"
    readme_content="${readme_content//\[TECH_3\]/ESLint}"
    readme_content="${readme_content//\[TECH_4\]/Prettier}"
    readme_content="${readme_content//\[COMPONENT_1\]/Core application logic}"
    readme_content="${readme_content//\[COMPONENT_2\]/User interface components}"
    readme_content="${readme_content//\[COMPONENT_3\]/Data management layer}"
    readme_content="${readme_content//\[INTEGRATION_1\]/Database integration}"
    readme_content="${readme_content//\[INTEGRATION_2\]/Authentication system}"
    readme_content="${readme_content//\[INTEGRATION_3\]/API endpoints}"
    readme_content="${readme_content//\[PROJECT_EMAIL\]/support@chasewhiterabbit.org}"
    readme_content="${readme_content//\[VERSION\]/1.0.0}"
    readme_content="${readme_content//\[STATUS\]/Active Development}"
    readme_content="${readme_content//\[DATE\]/$(date '+%Y-%m-%d')}"
    readme_content="${readme_content//\[MILESTONE\]/Feature completion and testing}"
    readme_content="${readme_content//\[TARGET_AUDIENCE\]/construction industry professionals}"
    readme_content="${readme_content//\[PROJECT_BADGE\]/$project_name}"
    readme_content="${readme_content//\[PROJECT_QUOTE\]/Technology should lift up workers, not replace them.}"
    readme_content="${readme_content//\[ARCHITECTURE_DESCRIPTION\]/Modern, scalable architecture following enterprise best practices}"
    readme_content="${readme_content//\[AUTH_METHOD\]/JWT-based authentication with multi-factor support}"
    readme_content="${readme_content//\[DATA_PROTECTION\]/End-to-end encryption and GDPR compliance}"
    readme_content="${readme_content//\[ACCESS_CONTROL\]/Role-based access control (RBAC)}"
    readme_content="${readme_content//\[ENCRYPTION_METHODS\]/AES-256 encryption for data at rest and in transit}"
    readme_content="${readme_content//\[PERFORMANCE_METRICS\]/< 200ms response time, 99.9% uptime}"
    readme_content="${readme_content//\[SECURITY_STANDARDS\]/OWASP Top 10 compliance, regular security audits}"
    readme_content="${readme_content//\[IMPACT_1\]/Professional development through ethical technology}"
    readme_content="${readme_content//\[IMPACT_2\]/Worker empowerment and career advancement}"
    readme_content="${readme_content//\[IMPACT_3\]/Community building and knowledge sharing}"
    readme_content="${readme_content//\[IMPACT_4\]/Ethical AI and bias prevention}"
    
    # Write the README file
    echo "$readme_content" > "$project_dir/README.md"
}

# Function to ensure required files exist
ensure_required_files() {
    local project_dir="$1"
    local project_name=$(basename "$project_dir")
    
    # Create CONTRIBUTING.md if it doesn't exist
    if [[ ! -f "$project_dir/CONTRIBUTING.md" ]]; then
        cat > "$project_dir/CONTRIBUTING.md" << 'EOF'
# Contributing to ChaseWhiteRabbit NGO Project

Thank you for your interest in contributing to our project! This document provides guidelines for contributing to this ChaseWhiteRabbit NGO initiative.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](docs/CODE_OF_CONDUCT.md).

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Create a new branch for your feature or bug fix
4. Make your changes
5. Test your changes thoroughly
6. Submit a pull request

## Development Guidelines

- Follow the existing code style and conventions
- Write clear, readable code with appropriate comments
- Include tests for new features
- Update documentation as needed
- Ensure your code passes all existing tests

## Pull Request Process

1. Update the README.md with details of changes if applicable
2. Update version numbers following semantic versioning
3. The PR will be merged once you have the sign-off of at least one maintainer

## Ethical Guidelines

As a ChaseWhiteRabbit NGO project, we prioritize:
- Worker empowerment over corporate profits
- Transparency and open source principles  
- Ethical AI and bias prevention
- Privacy-first design
- Accessibility and inclusion

## Questions?

Feel free to open an issue or contact us at info@chasewhiterabbit.org

EOF
        success "Created CONTRIBUTING.md for $project_name"
    fi
    
    # Create LICENSE file if it doesn't exist
    if [[ ! -f "$project_dir/LICENSE" && ! -f "$project_dir/LICENSE.md" ]]; then
        cat > "$project_dir/LICENSE" << 'EOF'
GNU GENERAL PUBLIC LICENSE
Version 3, 29 June 2007

Copyright (C) 2024 ChaseWhiteRabbit NGO

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.

---

ChaseWhiteRabbit NGO is committed to ethical technology development
and worker empowerment through open source software.

Contact: info@chasewhiterabbit.org
Website: https://chasewhiterabbit.org
EOF
        success "Created LICENSE for $project_name"
    fi
    
    # Create basic docs structure if it doesn't exist
    if [[ ! -d "$project_dir/docs" ]]; then
        mkdir -p "$project_dir/docs/"{setup,architecture,deployment,troubleshooting,ethics}
        
        # Create basic docs index
        cat > "$project_dir/docs/README.md" << EOF
# $project_name Documentation

Welcome to the documentation for $project_name, a ChaseWhiteRabbit NGO initiative.

## Documentation Structure

- [Setup Guide](setup/) - Development environment setup and installation
- [Architecture](architecture/) - System design and technical specifications  
- [Deployment](deployment/) - Production deployment and infrastructure
- [Troubleshooting](troubleshooting/) - Common issues and solutions
- [Ethics Framework](ethics/) - Ethical guidelines and responsible AI practices

## Getting Started

Start with the [Setup Guide](setup/) to get your development environment configured.

## Contributing to Documentation

Documentation improvements are always welcome! Please follow our [contributing guidelines](../CONTRIBUTING.md).

## Support

For documentation questions, contact: docs@chasewhiterabbit.org
EOF
        success "Created docs structure for $project_name"
    fi
}

# Function to update a single repository
update_repository() {
    local repo_dir="$1"
    local repo_name=$(basename "$repo_dir")
    
    log "Updating README for: $repo_name"
    
    # Skip if not a directory or if it's the .git directory
    if [[ ! -d "$repo_dir" || "$repo_name" == ".git" || "$repo_name" == ".github" || "$repo_name" == "node_modules" ]]; then
        return 0
    fi
    
    # Skip archived repositories
    if [[ "$repo_dir" == *".archive"* ]]; then
        warning "Skipping archived repository: $repo_name"
        return 0
    fi
    
    # Backup existing README if it exists
    if [[ -f "$repo_dir/README.md" ]]; then
        cp "$repo_dir/README.md" "$repo_dir/README.md.backup.$(date +%Y%m%d-%H%M%S)"
        log "Backed up existing README for $repo_name"
    fi
    
    # Generate new README
    generate_readme "$repo_dir"
    success "Generated new README for $repo_name"
    
    # Ensure required files exist
    ensure_required_files "$repo_dir"
    
    # Create .env.example if package.json exists and .env.example doesn't
    if [[ -f "$repo_dir/package.json" && ! -f "$repo_dir/.env.example" ]]; then
        cat > "$repo_dir/.env.example" << 'EOF'
# Environment Configuration Template
# Copy this file to .env.local and update with your values

# Application Configuration
NODE_ENV=development
PORT=3000

# Database Configuration
DATABASE_URL=your-database-url-here

# Authentication
JWT_SECRET=your-jwt-secret-here
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:3000

# External Services
# Add your service configurations here

# Feature Flags
# FEATURE_FLAG_NAME=true
EOF
        success "Created .env.example for $repo_name"
    fi
}

# Main function
main() {
    log "Starting README standardization process..."
    
    # Check if template exists
    if [[ ! -f "$TEMPLATE_FILE" ]]; then
        error "Template file not found: $TEMPLATE_FILE"
        exit 1
    fi
    
    # Create scripts directory if it doesn't exist
    mkdir -p "$REPO_ROOT/scripts"
    
    # Get all directories to process
    local directories=()
    
    if [[ $# -eq 0 ]]; then
        # Process all directories if no arguments provided
        while IFS= read -r -d '' dir; do
            directories+=("$dir")
        done < <(find "$REPO_ROOT" -maxdepth 1 -type d -not -path "$REPO_ROOT" -print0)
    else
        # Process specified directories
        for arg in "$@"; do
            if [[ -d "$REPO_ROOT/$arg" ]]; then
                directories+=("$REPO_ROOT/$arg")
            else
                warning "Directory not found: $arg"
            fi
        done
    fi
    
    # Process each directory
    local updated_count=0
    for dir in "${directories[@]}"; do
        update_repository "$dir"
        ((updated_count++))
    done
    
    success "README standardization completed!"
    log "Updated $updated_count repositories"
    log "Backup files created with timestamp suffix"
    
    # Create summary report
    cat > "$REPO_ROOT/README_STANDARDIZATION_REPORT.md" << EOF
# README Standardization Report

Generated on: $(date)

## Summary

- **Repositories processed**: $updated_count
- **Template used**: README_TEMPLATE.md
- **Backup files created**: Yes (with timestamp suffix)

## Changes Made

1. ✅ Standardized README structure across all repositories
2. ✅ Added consistent ChaseWhiteRabbit NGO branding
3. ✅ Included enterprise-grade documentation sections
4. ✅ Added contributing guidelines and licensing information
5. ✅ Created standard documentation folder structure
6. ✅ Generated environment configuration templates

## Next Steps

1. Review generated README files for project-specific accuracy
2. Update technology stack information where needed
3. Add project-specific screenshots and documentation
4. Verify all links and references are correct
5. Commit changes to version control

## Notes

- All original README files were backed up with timestamp suffix
- Generated content follows ChaseWhiteRabbit NGO standards
- Documentation structure follows enterprise best practices

EOF
    
    success "Generated standardization report: README_STANDARDIZATION_REPORT.md"
}

# Run main function with all arguments
main "$@"
