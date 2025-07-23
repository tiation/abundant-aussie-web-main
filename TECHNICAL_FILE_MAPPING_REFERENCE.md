# 🔧 Technical File-Level Mapping Reference

<div align="center">

### **ChaseWhiteRabbit NGO Initiative**
*Detailed Technical Migration Mapping*

[![File Mapping](https://img.shields.io/badge/file-mapping-brightgreen)](docs/migration/)
[![Technical Reference](https://img.shields.io/badge/technical-reference-blue)](docs/reference/)

```ascii
    📁 DETAILED FILE-LEVEL MIGRATION MAPPING 📁
    ╔═════════════════════════════════════════════╗
    ║  FILE • DIRECTORY • MODULE • ASSET MAPPING ║
    ╚═════════════════════════════════════════════╝
```

</div>

## 📋 File-Level Migration Mapping

This document provides granular, file-level mapping details for migrating legacy Rigger repositories to the official enterprise structure.

---

## 🚀 **Backend Services → RiggerBackend**

### API Routes & Controllers
```bash
# Source: tiation-rigger-automation-server
tiation-rigger-automation-server/API/Routes/riggerRoutes.js
→ RiggerBackend/api/v1/automation/routes/rigger.routes.js

tiation-rigger-automation-server/API/Controllers/
→ RiggerBackend/api/v1/automation/controllers/

# Source: tiation-rigger-connect-api  
tiation-rigger-connect-api/Components/API/Routes_API/riggerRoutes.js
→ RiggerBackend/api/v1/connect/routes/rigger.routes.js

tiation-rigger-connect-api/Components/API/Controllers/
→ RiggerBackend/api/v1/connect/controllers/
```

### Service Layer
```bash
# Automation Services
tiation-rigger-automation-server/Services/
→ RiggerBackend/services/automation/

# Connect Services
tiation-rigger-connect-api/Services/
→ RiggerBackend/services/connect/

# Metrics Services
tiation-rigger-metrics-dashboard/backend/
→ RiggerBackend/services/metrics/
```

### Database & Models
```bash
# Data Models
tiation-rigger-connect-api/Models/
→ RiggerBackend/src/models/

# Database Migrations
tiation-rigger-connect-api/Migrations/
→ RiggerBackend/database/migrations/

# Seeders
tiation-rigger-connect-api/Seeders/
→ RiggerBackend/database/seeders/
```

### Configuration
```bash
# Environment Files
tiation-rigger-*/config/
→ RiggerBackend/config/

# Docker Configuration
tiation-rigger-*/docker-compose.yml
→ RiggerBackend/docker-compose.yml (merge)

# Package Configuration
tiation-rigger-*/package.json
→ RiggerBackend/package.json (merge dependencies)
```

---

## 🌐 **Web Applications → RiggerConnect-web & RiggerHub-web**

### React Components
```bash
# Connect Components
tiation-rigger-connect-app/src/components/
→ RiggerConnect-web/src/components/

tiation-rigger-connect-app/src/pages/
→ RiggerConnect-web/src/pages/

# Jobs Components
tiation-rigger-jobs-app/src/components/JobList/
→ RiggerConnect-web/src/components/jobs/JobList/

tiation-rigger-jobs-app/src/components/JobDetail/
→ RiggerConnect-web/src/components/jobs/JobDetail/

# Hub Management Components
riggerhireapp/src/components/Dashboard/
→ RiggerHub-web/src/components/dashboard/

riggerhireapp/src/components/Management/
→ RiggerHub-web/src/components/management/
```

### Styles & Assets
```bash
# CSS/SCSS Files
tiation-rigger-connect-app/src/styles/
→ RiggerConnect-web/src/styles/

tiation-rigger-jobs-app/src/assets/styles/
→ RiggerConnect-web/src/styles/jobs/

# Images & Assets
tiation-rigger-connect-app/public/images/
→ RiggerConnect-web/public/images/

# Merge common assets to RiggerShared
*/assets/logos/riggerconnect-logo.svg
→ RiggerShared/assets/logos/riggerconnect-logo.svg
```

### Configuration Files
```bash
# Next.js Configuration
tiation-rigger-connect-app/next.config.js
→ RiggerConnect-web/next.config.js (merge)

# Package Dependencies
tiation-rigger-connect-app/package.json
→ RiggerConnect-web/package.json (merge)

# TypeScript Configuration
tiation-rigger-connect-app/tsconfig.json
→ RiggerConnect-web/tsconfig.json (standardize)
```

---

## 📱 **Mobile Applications**

### Cross-Platform to Native Split
```bash
# React Native → Android Native
tiation-rigger-mobile-app/src/components/
→ RiggerConnect-android/app/src/main/java/com/rigger/components/

tiation-rigger-mobile-app/src/screens/
→ RiggerConnect-android/app/src/main/java/com/rigger/activities/

# React Native → iOS Native  
tiation-rigger-mobile-app/src/components/
→ RiggerConnect-ios/RiggerConnect/Views/

tiation-rigger-mobile-app/src/screens/
→ RiggerConnect-ios/RiggerConnect/ViewControllers/
```

### Platform-Specific Resources
```bash
# Android Resources
tiation-rigger-mobile-app/android/app/src/main/res/
→ RiggerConnect-android/app/src/main/res/

# iOS Resources
tiation-rigger-mobile-app/ios/RiggerConnect/Images.xcassets/
→ RiggerConnect-ios/RiggerConnect/Assets.xcassets/
```

---

## 📚 **Shared Libraries → RiggerShared**

### Utility Functions
```bash
# Common Utilities
tiation-rigger-shared-libraries/src/utils/
→ RiggerShared/src/utils/

tiation-rigger-shared-libraries/src/helpers/
→ RiggerShared/src/helpers/

# API Clients
tiation-rigger-shared-libraries/src/api/
→ RiggerShared/src/api/
```

### Theme System
```bash
# Theme Files (Multiple Sources)
tiation-rigger-workspace/api/shared/themes/tiation-rigger-theme.json
tiation-rigger-automation-server/shared/themes/tiation-rigger-theme.json
RiggerBackend/api/shared/themes/tiation-rigger-theme.json
→ RiggerShared/themes/rigger-theme.json (unified)

# Component Themes
tiation-rigger-shared-libraries/src/themes/
→ RiggerShared/src/themes/
```

### Assets Consolidation
```bash
# Screenshots (Deduplicate from multiple repos)
*/assets/screenshots/riggerconnect-dashboard.svg
*/assets/screenshots/riggerconnect-worker-selection.svg
*/assets/screenshots/riggerjobs-job-feed.svg
*/assets/screenshots/riggerjobs-profile.svg
*/assets/screenshots/riggerjobs-earnings.svg
*/assets/screenshots/riggerconnect-job-posting.svg
→ RiggerShared/assets/screenshots/ (single source)

# Logos
*/assets/logos/riggerconnect-logo.svg
→ RiggerShared/assets/logos/ (single source)
```

### Configuration Templates
```bash
# Common Configuration
tiation-rigger-shared-libraries/configs/
→ RiggerShared/configs/

# Build Scripts
tiation-rigger-shared-libraries/scripts/
→ RiggerShared/scripts/
```

---

## 🔧 **Infrastructure & DevOps**

### Kubernetes Manifests
```bash
# Production K8s
tiation-rigger-infrastructure/k8s/production/
→ RiggerBackend/infrastructure/k8s/production/

# Staging K8s
tiation-rigger-infrastructure/k8s/staging/
→ RiggerBackend/infrastructure/k8s/staging/

# Platform Configuration
tiation-rigger-platform/k8s/
→ RiggerBackend/infrastructure/k8s/platform/

# Individual Service Configs
tiation-rigger-workspace/workspace-external/Infrastructure/k8s/rigger-platform.yaml
→ RiggerBackend/infrastructure/k8s/services/rigger-platform.yaml
```

### Docker Configuration
```bash
# Backend Docker
tiation-rigger-automation-server/Dockerfile
tiation-rigger-connect-api/Dockerfile
→ RiggerBackend/Dockerfile (unified)

# Web Docker
tiation-rigger-connect-app/Dockerfile
→ RiggerConnect-web/Dockerfile

# Docker Compose
*/docker-compose.yml
→ docker-compose.yml (root level, unified)
```

### CI/CD Pipeline
```bash
# GitHub Actions
tiation-rigger-*/.github/workflows/
→ Each target repo/.github/workflows/ (standardized)

# Build Scripts
tiation-rigger-*/scripts/build.sh
→ scripts/build/ (repository-specific)

# Deployment Scripts  
tiation-rigger-*/scripts/deploy.sh
→ scripts/deploy/ (repository-specific)
```

---

## 📖 **Documentation Migration**

### API Documentation
```bash
# OpenAPI Specs
tiation-rigger-connect-api/docs/api/
→ RiggerBackend/docs/api/

# Postman Collections
tiation-rigger-connect-api/docs/postman/
→ RiggerBackend/docs/postman/
```

### Architecture Documentation
```bash
# System Architecture
tiation-rigger-workspace-docs/architecture/
→ RiggerBackend/docs/architecture/

# Diagrams
*/assets/diagrams/tiation-rigger-workspace-architecture.png
→ RiggerShared/assets/diagrams/
```

### User Documentation
```bash
# Installation Guides
tiation-rigger-workspace-docs/installation/
→ RiggerBackend/docs/installation/

# User Guides
tiation-rigger-workspace-docs/user-guides/
→ Individual repository docs/ (distributed)
```

---

## 🔄 **Automated Migration Scripts**

### File Migration Script
```bash
#!/bin/bash
# migrate-files.sh - Automated file migration script

# Backend Services Migration
migrate_backend_files() {
    echo "Migrating backend services..."
    
    # API Routes
    cp -r tiation-rigger-automation-server/API/Routes/ RiggerBackend/api/v1/automation/routes/
    cp -r tiation-rigger-connect-api/Components/API/Routes_API/ RiggerBackend/api/v1/connect/routes/
    
    # Services
    cp -r tiation-rigger-automation-server/Services/ RiggerBackend/services/automation/
    cp -r tiation-rigger-connect-api/Services/ RiggerBackend/services/connect/
    
    echo "Backend migration complete ✅"
}

# Shared Libraries Migration
migrate_shared_files() {
    echo "Migrating shared libraries..."
    
    # Utilities
    cp -r tiation-rigger-shared-libraries/src/ RiggerShared/src/
    
    # Assets (deduplicate)
    rsync -av --ignore-existing */assets/screenshots/ RiggerShared/assets/screenshots/
    rsync -av --ignore-existing */assets/logos/ RiggerShared/assets/logos/
    
    # Themes (merge)
    merge_theme_files
    
    echo "Shared libraries migration complete ✅"
}

# Theme Files Merger
merge_theme_files() {
    echo "Merging theme files..."
    
    # Find all theme files
    find . -name "*tiation-rigger-theme.json" -exec cp {} RiggerShared/themes/source-{} \;
    
    # Create unified theme (manual process indicated)
    echo "Theme files collected - manual merge required"
}

# Execute migration
main() {
    echo "Starting file migration process..."
    
    # Create target directories
    mkdir -p RiggerBackend/{api/v1/{automation,connect}/routes,services/{automation,connect,metrics}}
    mkdir -p RiggerShared/{src,assets/{screenshots,logos,diagrams},themes,configs}
    
    # Run migrations
    migrate_backend_files
    migrate_shared_files
    
    echo "File migration process complete! 🎉"
    echo "Manual review and testing required before committing changes."
}

# Run if executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
```

### Validation Script
```bash
#!/bin/bash
# validate-migration.sh - Validate migration completeness

validate_migration() {
    echo "Validating migration..."
    
    # Check file counts
    echo "Checking file migration completeness..."
    
    # Backend validation
    backend_routes=$(find RiggerBackend/api -name "*.js" | wc -l)
    echo "Backend routes migrated: $backend_routes"
    
    # Shared assets validation
    shared_assets=$(find RiggerShared/assets -type f | wc -l)
    echo "Shared assets migrated: $shared_assets"
    
    # Duplicate detection
    echo "Checking for duplicates..."
    find RiggerShared/assets -name "*.svg" | sort | uniq -d
    
    echo "Migration validation complete ✅"
}

validate_migration
```

---

## ✅ **Migration Checklist**

### Pre-Migration
- [ ] Backup all legacy repositories
- [ ] Create feature branches in target repositories
- [ ] Review file dependencies and imports
- [ ] Plan database schema migrations
- [ ] Prepare rollback procedures

### During Migration
- [ ] Execute file migration scripts
- [ ] Update import paths and references
- [ ] Merge configuration files
- [ ] Deduplicate assets and code
- [ ] Standardize naming conventions

### Post-Migration
- [ ] Run validation scripts
- [ ] Execute comprehensive test suites
- [ ] Update documentation links
- [ ] Verify CI/CD pipeline functionality
- [ ] Conduct security audits

### Quality Assurance
- [ ] Code review all migrated files
- [ ] Test API endpoints
- [ ] Validate web application functionality
- [ ] Test mobile app builds
- [ ] Verify shared library integration

---

<div align="center">

## 🎯 **Technical Migration Success**

```ascii
LEGACY FILES → ENTERPRISE STRUCTURE
   ╭───────────────────────────────╮
   │  📁 FILE ORGANIZATION        │
   │  🔗 DEPENDENCY MANAGEMENT    │
   │  🏗️ STRUCTURE STANDARDIZATION │
   │  🔍 DUPLICATE ELIMINATION    │
   │  ✅ QUALITY ASSURANCE        │
   ╰───────────────────────────────╯
```

**ChaseWhiteRabbit NGO** | *Technical Excellence in Migration*

[![File Mapping Complete](https://img.shields.io/badge/File%20Mapping-Complete-brightgreen)](#)
[![Technical Reference](https://img.shields.io/badge/Technical-Reference-blue)](#)

</div>

---

**Last Updated**: July 23, 2025  
**Migration Phase**: File-Level Planning Complete ✅  
**Next Step**: Execute Automated Migration Scripts
