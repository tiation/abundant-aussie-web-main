#!/bin/bash

# Tiation Mobile Optimization Audit Script
# Usage: ./mobile-audit.sh [--project=name] [--all-projects] [--fix]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${PURPLE}"
    echo "📱 Tiation Mobile Optimization Audit"
    echo "===================================="
    echo -e "${NC}"
}

print_status() {
    echo -e "${CYAN}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[⚠]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_score() {
    local score=$1
    local label=$2
    if [[ $score -ge 90 ]]; then
        echo -e "${GREEN}[✓] $label: $score/100${NC}"
    elif [[ $score -ge 70 ]]; then
        echo -e "${YELLOW}[⚠] $label: $score/100${NC}"
    else
        echo -e "${RED}[✗] $label: $score/100${NC}"
    fi
}

# Mobile optimization checks
check_responsive_design() {
    local project_path=$1
    local score=0
    local max_score=100
    
    print_status "Checking responsive design..."
    
    # Check for viewport meta tag
    if grep -r "viewport" "$project_path/src" >/dev/null 2>&1; then
        score=$((score + 20))
        print_success "Viewport meta tag found"
    else
        print_error "Missing viewport meta tag"
    fi
    
    # Check for responsive CSS classes
    if grep -r "sm:|md:|lg:|xl:" "$project_path/src" >/dev/null 2>&1; then
        score=$((score + 30))
        print_success "Responsive CSS classes found"
    else
        print_warning "Limited responsive CSS classes"
    fi
    
    # Check for mobile-first approach
    if grep -r "mobile-first\|@media.*min-width" "$project_path/src" >/dev/null 2>&1; then
        score=$((score + 20))
        print_success "Mobile-first approach detected"
    else
        print_warning "Mobile-first approach not clearly implemented"
    fi
    
    # Check for touch-friendly elements
    if grep -r "touch\|tap\|swipe" "$project_path/src" >/dev/null 2>&1; then
        score=$((score + 15))
        print_success "Touch interactions implemented"
    else
        print_warning "Limited touch interaction support"
    fi
    
    # Check for proper button sizes
    if grep -r "min-h-\|py-\|px-" "$project_path/src" >/dev/null 2>&1; then
        score=$((score + 15))
        print_success "Proper button sizing found"
    else
        print_warning "Button sizing needs review"
    fi
    
    print_score $score "Responsive Design"
    return $score
}

check_performance() {
    local project_path=$1
    local score=0
    
    print_status "Checking mobile performance optimizations..."
    
    # Check for lazy loading
    if grep -r "lazy\|loading.*lazy" "$project_path/src" >/dev/null 2>&1; then
        score=$((score + 25))
        print_success "Lazy loading implemented"
    else
        print_warning "Consider implementing lazy loading"
    fi
    
    # Check for image optimization
    if [[ -f "$project_path/vite.config.ts" ]] && grep -q "imageOptimize\|@vite.*image" "$project_path/vite.config.ts"; then
        score=$((score + 25))
        print_success "Image optimization configured"
    else
        print_warning "Image optimization not configured"
    fi
    
    # Check for code splitting
    if grep -r "import.*async\|lazy.*import" "$project_path/src" >/dev/null 2>&1; then
        score=$((score + 25))
        print_success "Code splitting implemented"
    else
        print_warning "Code splitting could be improved"
    fi
    
    # Check for service worker
    if [[ -f "$project_path/src/service-worker.js" ]] || [[ -f "$project_path/static/sw.js" ]]; then
        score=$((score + 25))
        print_success "Service worker found"
    else
        print_warning "Service worker not implemented"
    fi
    
    print_score $score "Performance"
    return $score
}

check_accessibility() {
    local project_path=$1
    local score=0
    
    print_status "Checking accessibility features..."
    
    # Check for semantic HTML
    if grep -r "aria-\|role=\|alt=" "$project_path/src" >/dev/null 2>&1; then
        score=$((score + 30))
        print_success "Accessibility attributes found"
    else
        print_error "Missing accessibility attributes"
    fi
    
    # Check for keyboard navigation
    if grep -r "tabindex\|onKeyDown\|onKeyPress" "$project_path/src" >/dev/null 2>&1; then
        score=$((score + 25))
        print_success "Keyboard navigation support"
    else
        print_warning "Keyboard navigation needs improvement"
    fi
    
    # Check for focus management
    if grep -r "focus\|:focus" "$project_path/src" >/dev/null 2>&1; then
        score=$((score + 25))
        print_success "Focus management implemented"
    else
        print_warning "Focus management could be improved"
    fi
    
    # Check for color contrast (look for dark theme implementation)
    if grep -r "dark:\|contrast\|tiation-" "$project_path/src" >/dev/null 2>&1; then
        score=$((score + 20))
        print_success "Theme and contrast considerations"
    else
        print_warning "Color contrast needs review"
    fi
    
    print_score $score "Accessibility"
    return $score
}

check_tiation_standards() {
    local project_path=$1
    local score=0
    
    print_status "Checking Tiation brand standards..."
    
    # Check for Tiation branding
    if grep -r "tiation-\|Tiation" "$project_path/src" >/dev/null 2>&1; then
        score=$((score + 25))
        print_success "Tiation branding implemented"
    else
        print_error "Missing Tiation branding"
    fi
    
    # Check for dark neon theme
    if grep -r "00FFFF\|FF00FF\|neon-\|gradient" "$project_path/src" >/dev/null 2>&1; then
        score=$((score + 25))
        print_success "Dark neon theme implemented"
    else
        print_error "Missing dark neon theme"
    fi
    
    # Check for mobile-first classes
    if grep -r "mobile-\|sm:\|md:\|lg:" "$project_path/src" >/dev/null 2>&1; then
        score=$((score + 25))
        print_success "Mobile-first responsive classes"
    else
        print_warning "Limited mobile-first implementation"
    fi
    
    # Check for enterprise structure
    if [[ -f "$project_path/CONTRIBUTING.md" ]] && [[ -f "$project_path/.github/workflows/deploy.yml" ]]; then
        score=$((score + 25))
        print_success "Enterprise project structure"
    else
        print_warning "Missing enterprise structure elements"
    fi
    
    print_score $score "Tiation Standards"
    return $score
}

generate_fixes() {
    local project_path=$1
    local fix_script="$project_path/mobile-optimization-fixes.sh"
    
    print_status "Generating optimization fixes..."
    
    cat > "$fix_script" << 'EOF'
#!/bin/bash
# Auto-generated mobile optimization fixes

echo "🔧 Applying mobile optimization fixes..."

# Fix 1: Add viewport meta tag if missing
if ! grep -r "viewport" src/ >/dev/null 2>&1; then
    echo "Adding viewport meta tag..."
    sed -i '' 's|<meta name="description"|<meta name="viewport" content="width=device-width, initial-scale=1.0">\n\t\t<meta name="description"|' src/app.html
fi

# Fix 2: Add responsive image component
mkdir -p src/lib/components
cat > src/lib/components/ResponsiveImage.svelte << 'COMPONENT'
<script lang="ts">
    export let src: string;
    export let alt: string;
    export let className: string = '';
    export let lazy: boolean = true;
</script>

<img 
    {src} 
    {alt} 
    class="w-full h-auto {className}"
    loading={lazy ? 'lazy' : 'eager'}
    decoding="async"
/>
COMPONENT

# Fix 3: Add touch gesture support
cat > src/lib/utils/touch.ts << 'TOUCH'
export interface TouchGesture {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    deltaX: number;
    deltaY: number;
    direction: 'left' | 'right' | 'up' | 'down' | null;
}

export function handleTouch(element: HTMLElement, callback: (gesture: TouchGesture) => void) {
    let startX = 0, startY = 0;
    
    element.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });
    
    element.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        
        let direction: TouchGesture['direction'] = null;
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            direction = deltaX > 0 ? 'right' : 'left';
        } else {
            direction = deltaY > 0 ? 'down' : 'up';
        }
        
        callback({ startX, startY, endX, endY, deltaX, deltaY, direction });
    });
}
TOUCH

echo "✅ Mobile optimization fixes applied!"
echo "📋 Next steps:"
echo "  1. Review generated components"
echo "  2. Test on mobile devices"
echo "  3. Run audit again to verify improvements"
EOF

    chmod +x "$fix_script"
    print_success "Fix script generated: $fix_script"
}

audit_project() {
    local project_path=$1
    local project_name=$(basename "$project_path")
    local fix_mode=$2
    
    echo
    echo -e "${BLUE}📱 Auditing: $project_name${NC}"
    echo "=================================="
    
    if [[ ! -d "$project_path/src" ]]; then
        print_error "Not a valid project (missing src/ directory)"
        return 1
    fi
    
    local responsive_score mobile_perf_score a11y_score tiation_score
    
    responsive_score=$(check_responsive_design "$project_path"; echo $?)
    mobile_perf_score=$(check_performance "$project_path"; echo $?)
    a11y_score=$(check_accessibility "$project_path"; echo $?)
    tiation_score=$(check_tiation_standards "$project_path"; echo $?)
    
    # Calculate overall score
    local total_score=$(( (responsive_score + mobile_perf_score + a11y_score + tiation_score) / 4 ))
    
    echo
    echo -e "${PURPLE}📊 Overall Mobile Score: $total_score/100${NC}"
    
    if [[ $total_score -ge 90 ]]; then
        print_success "Excellent mobile optimization!"
    elif [[ $total_score -ge 70 ]]; then
        print_warning "Good mobile optimization, room for improvement"
    else
        print_error "Mobile optimization needs significant improvement"
    fi
    
    # Generate fixes if requested
    if [[ "$fix_mode" == "true" ]]; then
        generate_fixes "$project_path"
    fi
    
    echo
    return $total_score
}

# Main execution
main() {
    print_header
    
    local project=""
    local all_projects=false
    local fix_mode=false
    local tiation_root="/Users/tiaastor/tiation-github"
    
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --project=*)
                project="${1#*=}"
                shift
                ;;
            --all-projects)
                all_projects=true
                shift
                ;;
            --fix)
                fix_mode=true
                shift
                ;;
            --help)
                echo "Usage: $0 [--project=name] [--all-projects] [--fix]"
                echo "  --project=name    Audit specific project"
                echo "  --all-projects    Audit all Tiation projects"  
                echo "  --fix            Generate optimization fixes"
                exit 0
                ;;
            *)
                echo "Unknown option: $1"
                exit 1
                ;;
        esac
    done
    
    if [[ "$all_projects" == "true" ]]; then
        print_status "Auditing all Tiation projects..."
        local total_projects=0
        local total_score_sum=0
        
        for project_dir in "$tiation_root"/tiation-*; do
            if [[ -d "$project_dir" ]]; then
                audit_project "$project_dir" "$fix_mode"
                local project_score=$?
                total_score_sum=$((total_score_sum + project_score))
                total_projects=$((total_projects + 1))
            fi
        done
        
        if [[ $total_projects -gt 0 ]]; then
            local ecosystem_average=$((total_score_sum / total_projects))
            echo
            echo -e "${PURPLE}🌐 Ecosystem Average Mobile Score: $ecosystem_average/100${NC}"
        fi
        
    elif [[ -n "$project" ]]; then
        local project_path="$tiation_root/$project"
        if [[ -d "$project_path" ]]; then
            audit_project "$project_path" "$fix_mode"
        else
            print_error "Project '$project' not found"
            exit 1
        fi
    else
        # Audit current directory
        audit_project "." "$fix_mode"
    fi
    
    echo
    print_success "Mobile audit complete!"
}

main "$@"
