#!/bin/bash

# Documentation Audit Script for ChaseWhiteRabbit NGO Repositories
# This script evaluates documentation completeness and quality across all repositories

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"

# Initialize counters
total_repos=0
compliant_repos=0
non_compliant_repos=0

# Log functions
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

info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

# Function to check if a file exists and is not empty
check_file() {
    local file="$1"
    if [[ -f "$file" && -s "$file" ]]; then
        return 0
    else
        return 1
    fi
}

# Function to analyze README quality
analyze_readme() {
    local readme_file="$1"
    local score=0
    local max_score=10
    local issues=()
    
    if check_file "$readme_file"; then
        local content=$(cat "$readme_file")
        
        # Check for required sections
        if echo "$content" | grep -q "## .*Project Overview\|# Project Overview\|## .*Overview"; then
            ((score++))
        else
            issues+=("Missing project overview section")
        fi
        
        if echo "$content" | grep -q "## .*Quick Start\|## .*Getting Started\|## .*Installation"; then
            ((score++))
        else
            issues+=("Missing quick start/installation section")
        fi
        
        if echo "$content" | grep -q "## .*Technology Stack\|## .*Tech Stack\|## .*Technologies"; then
            ((score++))
        else
            issues+=("Missing technology stack section")
        fi
        
        if echo "$content" | grep -q "## .*Contributing\|## .*Contribution"; then
            ((score++))
        else
            issues+=("Missing contributing section")
        fi
        
        if echo "$content" | grep -q "## .*License"; then
            ((score++))
        else
            issues+=("Missing license section")
        fi
        
        if echo "$content" | grep -q "ChaseWhiteRabbit NGO"; then
            ((score++))
        else
            issues+=("Missing ChaseWhiteRabbit NGO branding")
        fi
        
        if echo "$content" | grep -q "badge\|shields.io"; then
            ((score++))
        else
            issues+=("Missing badges")
        fi
        
        if echo "$content" | grep -q "## .*Documentation\|## .*Docs"; then
            ((score++))
        else
            issues+=("Missing documentation links section")
        fi
        
        if echo "$content" | grep -q "## .*Support\|## .*Contact"; then
            ((score++))
        else
            issues+=("Missing support/contact section")
        fi
        
        # Check content quality
        local word_count=$(echo "$content" | wc -w)
        if [[ $word_count -gt 200 ]]; then
            ((score++))
        else
            issues+=("README content too brief (< 200 words)")
        fi
    else
        issues+=("README.md file missing or empty")
    fi
    
    echo "$score|$max_score|$(IFS='|'; echo "${issues[*]}")"
}

# Function to check documentation structure
check_docs_structure() {
    local repo_dir="$1"
    local score=0
    local max_score=8
    local issues=()
    
    # Check for docs directory
    if [[ -d "$repo_dir/docs" ]]; then
        ((score++))
        
        # Check for standard subdirectories
        local subdirs=("setup" "architecture" "deployment" "troubleshooting")
        for subdir in "${subdirs[@]}"; do
            if [[ -d "$repo_dir/docs/$subdir" ]]; then
                ((score++))
            else
                issues+=("Missing docs/$subdir directory")
            fi
        done
        
        # Check for docs README
        if check_file "$repo_dir/docs/README.md"; then
            ((score++))
        else
            issues+=("Missing docs/README.md")
        fi
        
        # Check for API documentation
        if [[ -d "$repo_dir/docs/api" || -f "$repo_dir/docs/API.md" ]]; then
            ((score++))
        else
            issues+=("Missing API documentation")
        fi
        
        # Check for changelog
        if check_file "$repo_dir/CHANGELOG.md" || check_file "$repo_dir/docs/CHANGELOG.md"; then
            ((score++))
        else
            issues+=("Missing CHANGELOG.md")
        fi
    else
        issues+=("Missing docs directory")
    fi
    
    echo "$score|$max_score|$(IFS='|'; echo "${issues[*]}")"
}

# Function to check required files
check_required_files() {
    local repo_dir="$1"
    local score=0
    local max_score=6
    local issues=()
    
    # Check for CONTRIBUTING.md
    if check_file "$repo_dir/CONTRIBUTING.md"; then
        ((score++))
    else
        issues+=("Missing CONTRIBUTING.md")
    fi
    
    # Check for LICENSE
    if check_file "$repo_dir/LICENSE" || check_file "$repo_dir/LICENSE.md"; then
        ((score++))
    else
        issues+=("Missing LICENSE file")
    fi
    
    # Check for CODE_OF_CONDUCT
    if check_file "$repo_dir/CODE_OF_CONDUCT.md" || check_file "$repo_dir/docs/CODE_OF_CONDUCT.md"; then
        ((score++))
    else
        issues+=("Missing CODE_OF_CONDUCT.md")
    fi
    
    # Check for .env.example (for applicable projects)
    if [[ -f "$repo_dir/package.json" ]]; then
        if check_file "$repo_dir/.env.example" || check_file "$repo_dir/.env.template"; then
            ((score++))
        else
            issues+=("Missing .env.example for Node.js project")
        fi
    else
        ((score++)) # Skip for non-Node.js projects
    fi
    
    # Check for .gitignore
    if check_file "$repo_dir/.gitignore"; then
        ((score++))
    else
        issues+=("Missing .gitignore")
    fi
    
    # Check for security policy
    if check_file "$repo_dir/SECURITY.md" || check_file "$repo_dir/.github/SECURITY.md"; then
        ((score++))
    else
        issues+=("Missing SECURITY.md")
    fi
    
    echo "$score|$max_score|$(IFS='|'; echo "${issues[*]}")"
}

# Function to check CI/CD documentation
check_cicd_docs() {
    local repo_dir="$1"
    local score=0
    local max_score=4
    local issues=()
    
    # Check for CI/CD configuration files
    if [[ -d "$repo_dir/.github/workflows" || -f "$repo_dir/.gitlab-ci.yml" ]]; then
        ((score++))
    else
        issues+=("Missing CI/CD configuration")
    fi
    
    # Check for Dockerfile
    if [[ -f "$repo_dir/Dockerfile" ]]; then
        ((score++))
    else
        issues+=("Missing Dockerfile")
    fi
    
    # Check for docker-compose
    if [[ -f "$repo_dir/docker-compose.yml" || -f "$repo_dir/docker-compose.yaml" ]]; then
        ((score++))
    else
        issues+=("Missing docker-compose configuration")
    fi
    
    # Check for deployment documentation
    if [[ -f "$repo_dir/docs/deployment/README.md" || -f "$repo_dir/DEPLOYMENT.md" ]]; then
        ((score++))
    else
        issues+=("Missing deployment documentation")
    fi
    
    echo "$score|$max_score|$(IFS='|'; echo "${issues[*]}")"
}

# Function to assess inline code documentation
assess_code_docs() {
    local repo_dir="$1"
    local score=0
    local max_score=3
    local issues=()
    
    # Count code files with comments
    local code_files=0
    local commented_files=0
    
    # Check JavaScript/TypeScript files
    if [[ -d "$repo_dir/src" || -f "$repo_dir/package.json" ]]; then
        while IFS= read -r -d '' file; do
            if [[ -f "$file" ]]; then
                ((code_files++))
                if grep -q "^\s*//\|^\s*/\*\|^\s*\*" "$file" 2>/dev/null; then
                    ((commented_files++))
                fi
            fi
        done < <(find "$repo_dir" -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" -not -path "*/node_modules/*" -not -path "*/.git/*" -print0 2>/dev/null)
    fi
    
    # Check for JSDoc/TSDoc comments
    local jsdoc_files=0
    if [[ $code_files -gt 0 ]]; then
        while IFS= read -r -d '' file; do
            if grep -q "@param\|@returns\|@description\|/\*\*" "$file" 2>/dev/null; then
                ((jsdoc_files++))
            fi
        done < <(find "$repo_dir" -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" -not -path "*/node_modules/*" -not -path "*/.git/*" -print0 2>/dev/null)
    fi
    
    # Calculate scores
    if [[ $code_files -gt 0 ]]; then
        local comment_ratio=$((commented_files * 100 / code_files))
        if [[ $comment_ratio -gt 50 ]]; then
            ((score++))
        else
            issues+=("Low inline comment coverage ($comment_ratio%)")
        fi
        
        local jsdoc_ratio=$((jsdoc_files * 100 / code_files))
        if [[ $jsdoc_ratio -gt 25 ]]; then
            ((score++))
        else
            issues+=("Low JSDoc/TSDoc coverage ($jsdoc_ratio%)")
        fi
        
        # Check for README files in subdirectories
        local subdir_readmes=$(find "$repo_dir" -name "README.md" -not -path "$repo_dir/README.md" | wc -l)
        if [[ $subdir_readmes -gt 0 ]]; then
            ((score++))
        else
            issues+=("No subdirectory README files")
        fi
    else
        score=3 # Skip for non-code repositories
    fi
    
    echo "$score|$max_score|$(IFS='|'; echo "${issues[*]}")"
}

# Function to generate compliance report for a repository
audit_repository() {
    local repo_dir="$1"
    local repo_name=$(basename "$repo_dir")
    
    # Skip if not a directory or excluded directories
    if [[ ! -d "$repo_dir" || "$repo_name" == ".git" || "$repo_name" == ".github" || "$repo_name" == "node_modules" || "$repo_name" == "scripts" ]]; then
        return 0
    fi
    
    # Skip archived repositories
    if [[ "$repo_dir" == *".archive"* ]]; then
        return 0
    fi
    
    ((total_repos++))
    
    echo -e "\n${PURPLE}📋 Auditing: $repo_name${NC}"
    echo "================================"
    
    # Analyze README
    local readme_result=$(analyze_readme "$repo_dir/README.md")
    IFS='|' read -r readme_score readme_max readme_issues <<< "$readme_result"
    
    # Check documentation structure
    local docs_result=$(check_docs_structure "$repo_dir")
    IFS='|' read -r docs_score docs_max docs_issues <<< "$docs_result"
    
    # Check required files
    local files_result=$(check_required_files "$repo_dir")
    IFS='|' read -r files_score files_max files_issues <<< "$files_result"
    
    # Check CI/CD documentation
    local cicd_result=$(check_cicd_docs "$repo_dir")
    IFS='|' read -r cicd_score cicd_max cicd_issues <<< "$cicd_result"
    
    # Assess code documentation
    local code_result=$(assess_code_docs "$repo_dir")
    IFS='|' read -r code_score code_max code_issues <<< "$code_result"
    
    # Calculate total score
    local total_score=$((readme_score + docs_score + files_score + cicd_score + code_score))
    local total_max=$((readme_max + docs_max + files_max + cicd_max + code_max))
    local percentage=$((total_score * 100 / total_max))
    
    # Display results
    echo -e "📄 README Quality: ${GREEN}$readme_score/$readme_max${NC} ($(($readme_score * 100 / $readme_max))%)"
    echo -e "📁 Documentation Structure: ${GREEN}$docs_score/$docs_max${NC} ($(($docs_score * 100 / $docs_max))%)"
    echo -e "📋 Required Files: ${GREEN}$files_score/$files_max${NC} ($(($files_score * 100 / $files_max))%)"
    echo -e "🔄 CI/CD Documentation: ${GREEN}$cicd_score/$cicd_max${NC} ($(($cicd_score * 100 / $cicd_max))%)"
    echo -e "💻 Code Documentation: ${GREEN}$code_score/$code_max${NC} ($(($code_score * 100 / $code_max))%)"
    echo -e "📊 Overall Score: ${CYAN}$total_score/$total_max${NC} (${CYAN}$percentage%${NC})"
    
    # Determine compliance status
    if [[ $percentage -ge 80 ]]; then
        success "COMPLIANT - Well documented repository"
        ((compliant_repos++))
    elif [[ $percentage -ge 60 ]]; then
        warning "PARTIALLY COMPLIANT - Needs improvement"
        ((non_compliant_repos++))
    else
        error "NON-COMPLIANT - Requires significant documentation updates"
        ((non_compliant_repos++))
    fi
    
    # Show issues if any
    local all_issues=""
    [[ -n "$readme_issues" ]] && all_issues+="README: $readme_issues; "
    [[ -n "$docs_issues" ]] && all_issues+="Docs: $docs_issues; "
    [[ -n "$files_issues" ]] && all_issues+="Files: $files_issues; "
    [[ -n "$cicd_issues" ]] && all_issues+="CI/CD: $cicd_issues; "
    [[ -n "$code_issues" ]] && all_issues+="Code: $code_issues; "
    
    if [[ -n "$all_issues" ]]; then
        echo -e "${YELLOW}Issues found:${NC}"
        echo "$all_issues" | tr ';' '\n' | sed 's/^/  - /'
    fi
    
    # Store results for report
    echo "$repo_name,$percentage,$total_score,$total_max,$readme_score,$docs_score,$files_score,$cicd_score,$code_score,\"$all_issues\"" >> "$REPO_ROOT/documentation_audit_results.csv"
}

# Main function
main() {
    log "Starting documentation audit across all repositories..."
    
    # Create CSV header
    echo "Repository,Compliance%,Total Score,Max Score,README Score,Docs Score,Files Score,CI/CD Score,Code Score,Issues" > "$REPO_ROOT/documentation_audit_results.csv"
    
    # Process all directories
    for dir in "$REPO_ROOT"/*/; do
        if [[ -d "$dir" ]]; then
            audit_repository "$dir"
        fi
    done
    
    # Generate summary report
    echo -e "\n${CYAN}📊 AUDIT SUMMARY${NC}"
    echo "================================"
    echo -e "Total repositories audited: ${BLUE}$total_repos${NC}"
    echo -e "Compliant repositories (≥80%): ${GREEN}$compliant_repos${NC}"
    echo -e "Non-compliant repositories (<80%): ${RED}$non_compliant_repos${NC}"
    
    local compliance_rate=$((compliant_repos * 100 / total_repos))
    echo -e "Overall compliance rate: ${CYAN}$compliance_rate%${NC}"
    
    # Generate detailed report
    cat > "$REPO_ROOT/DOCUMENTATION_AUDIT_REPORT.md" << EOF
# Documentation Audit Report

Generated on: $(date)

## Executive Summary

- **Total Repositories Audited**: $total_repos
- **Compliant Repositories (≥80%)**: $compliant_repos
- **Non-Compliant Repositories (<80%)**: $non_compliant_repos  
- **Overall Compliance Rate**: $compliance_rate%

## Audit Criteria

### README Quality (10 points)
- Project overview section
- Quick start/installation instructions
- Technology stack documentation
- Contributing guidelines
- License information
- ChaseWhiteRabbit NGO branding
- Status badges
- Documentation links
- Support/contact information
- Adequate content length (>200 words)

### Documentation Structure (8 points)
- Presence of docs/ directory
- Standard subdirectories (setup, architecture, deployment, troubleshooting)
- Documentation index (docs/README.md)
- API documentation
- Changelog

### Required Files (6 points)
- CONTRIBUTING.md
- LICENSE file
- CODE_OF_CONDUCT.md
- Environment configuration template
- .gitignore
- SECURITY.md

### CI/CD Documentation (4 points)
- CI/CD configuration files
- Dockerfile
- Docker Compose configuration
- Deployment documentation

### Code Documentation (3 points)
- Inline comment coverage
- JSDoc/TSDoc coverage
- Subdirectory README files

## Recommendations

### High Priority (for non-compliant repositories)
1. Create comprehensive README files using the standardized template
2. Establish standard documentation folder structure
3. Add required files (CONTRIBUTING.md, LICENSE, etc.)
4. Document deployment and setup procedures

### Medium Priority
1. Improve inline code documentation
2. Add API documentation
3. Create troubleshooting guides
4. Implement changelog practices

### Low Priority
1. Add security policies
2. Enhance code comments with JSDoc/TSDoc
3. Create subdirectory documentation

## Next Steps

1. Run the README standardization script on non-compliant repositories
2. Create missing documentation files using templates
3. Establish documentation review process for pull requests
4. Schedule regular documentation audits (quarterly)

EOF
    
    success "Documentation audit completed!"
    success "Results saved to: documentation_audit_results.csv"
    success "Detailed report generated: DOCUMENTATION_AUDIT_REPORT.md"
}

# Run main function
main "$@"
