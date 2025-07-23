#!/bin/bash

# Step 7: Create Deprecation Notices for Duplicate Repositories
# This script creates deprecation README files for repositories being archived

set -e

echo "🗂️ Creating deprecation notices for duplicate repositories..."

# Define the duplicate repositories to be archived
DUPLICATE_REPOS=(
    "rigg-connect-app"
    "RiggerConnect-mobile"
    "RiggerConnect-monorepo"
    "abundant-aussie-web-main"
    "caleb-stands-strong-web"
    "standing-strong-web"
    "tabletop-adventures-crafted-main"
    "tiation-board-nexus-main"
    "lovable-clone"
    "tiation-ecosystem"
)

# Create deprecation notice template
create_deprecation_notice() {
    local repo_name="$1"
    local readme_path="/Users/tiaastor/Github/tiation-repos/${repo_name}/DEPRECATION_NOTICE.md"
    
    if [ -d "/Users/tiaastor/Github/tiation-repos/${repo_name}" ]; then
        cat > "$readme_path" << EOF
# 🚨 REPOSITORY DEPRECATED

## ⚠️ This repository has been DEPRECATED and ARCHIVED

**Date**: $(date +"%B %d, %Y")  
**Status**: ARCHIVED  
**Reason**: Content migrated to official ChaseWhiteRabbit NGO repositories

---

## 📦 Migration Information

This repository was part of the **Step 7: Remove Duplicates and Archive** process as part of the ChaseWhiteRabbit NGO enterprise repository consolidation.

### 🎯 Official Repositories

The content from this repository has been migrated to the following official repositories:

| Repository | Purpose | Location |
|------------|---------|----------|
| **RiggerConnect-web** | Web platform for job connections | \`/Users/tiaastor/Github/tiation-repos/RiggerConnect-web/\` |
| **RiggerConnect-android** | Android mobile application | \`/Users/tiaastor/Github/tiation-repos/RiggerConnect-android/\` |
| **RiggerConnect-ios** | iOS mobile application | \`/Users/tiaastor/Github/tiation-repos/RiggerConnect-ios/\` |
| **RiggerHub-web** | Web dashboard and management | \`/Users/tiaastor/Github/tiation-repos/RiggerHub-web/\` |
| **RiggerHub-android** | Android management app | \`/Users/tiaastor/Github/tiation-repos/RiggerHub-android/\` |
| **RiggerHub-ios** | iOS management app | \`/Users/tiaastor/Github/tiation-repos/RiggerHub-ios/\` |
| **RiggerShared** | Cross-platform shared libraries | \`/Users/tiaastor/Github/tiation-repos/RiggerShared/\` |
| **RiggerBackend** | Core API services | \`/Users/tiaastor/Github/tiation-repos/RiggerBackend/\` |

---

## 🔄 What Happened to This Repository?

This repository (\`${repo_name}\`) contained duplicate or legacy content that has been:

1. ✅ **Migrated**: Unique content moved to appropriate official repositories
2. ✅ **Consolidated**: Duplicate content merged and deduplicated
3. ✅ **Archived**: Repository moved to \`.archive/\` for historical reference
4. ✅ **Backed up**: Full backup created at \`.archive/step7-backup/\`

---

## 🗂️ Archive Location

This repository has been moved to:
\`\`\`
/Users/tiaastor/Github/tiation-repos/.archive/${repo_name}/
\`\`\`

## 📄 Documentation References

- **Migration Plan**: \`STEP7_DUPLICATE_REMOVAL_PLAN.md\`
- **Repository Index**: \`ENTERPRISE_REPOSITORY_INDEX.md\`
- **Migration Mapping**: \`LEGACY_TO_OFFICIAL_REPOSITORY_MAPPING.md\`

---

## 🏗️ ChaseWhiteRabbit NGO

This migration is part of the **ChaseWhiteRabbit NGO** enterprise technology initiative, focused on:

- ✅ **Enterprise-grade** repository structure
- ✅ **Ethical technology** practices
- ✅ **DevOps best practices** with CI/CD
- ✅ **Modular architecture** for scalability

### 📞 Support

For questions about this migration or to access archived content:

- **Technical Support**: tiatheone@protonmail.com
- **NGO Information**: [chasewhiterabbit.org](https://chasewhiterabbit.org)
- **Repository Issues**: Create an issue in the appropriate official repository

---

\`\`\`ascii
🏗️ MIGRATED TO OFFICIAL REPOSITORIES 🏗️
     ╭─────────────────────────────────╮
     │  ✅ ENTERPRISE-GRADE STRUCTURE  │
     │  ✅ ETHICAL TECHNOLOGY         │
     │  ✅ DEVOPS BEST PRACTICES      │
     │  ✅ MODULAR ARCHITECTURE       │
     ╰─────────────────────────────────╯
\`\`\`

**Thank you for using ChaseWhiteRabbit NGO technology!**
EOF

        echo "✅ Created deprecation notice: ${repo_name}/DEPRECATION_NOTICE.md"
    else
        echo "⚠️ Repository not found: ${repo_name}"
    fi
}

# Create deprecation notices for all duplicate repositories
for repo in "${DUPLICATE_REPOS[@]}"; do
    create_deprecation_notice "$repo"
done

echo ""
echo "🎯 Deprecation notices created for all duplicate repositories"
echo "📦 Repositories ready for archival process"
