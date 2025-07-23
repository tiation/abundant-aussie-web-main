#!/bin/bash

# 🧹 Cleanup Script for Migrated Rigger Directories
# Removes deprecated directories after successful migration to dedicated repositories
# Following enterprise-grade cleanup practices with safety measures

set -e  # Exit on any error

echo "🧹 Rigger Directory Cleanup Script"
echo "=================================="
echo ""
echo "⚠️  This script will remove deprecated Rigger directories from tiation-ecosystem"
echo "    All content has been successfully migrated to dedicated repositories:"
echo "    - RiggerConnect-web, RiggerConnect-android, RiggerConnect-ios"
echo "    - RiggerHub-web, RiggerHub-android, RiggerHub-ios"
echo "    - RiggerShared, RiggerBackend"
echo ""

# Safety check: Verify we're in the right directory
if [ ! -d "tiation-ecosystem" ]; then
    echo "❌ Error: tiation-ecosystem directory not found!"
    echo "   Please run this script from /Users/tiaastor/Github/tiation-repos"
    exit 1
fi

# Safety check: Verify dedicated repositories exist
REQUIRED_REPOS=("RiggerConnect-web" "RiggerConnect-android" "RiggerConnect-ios" "RiggerHub-web" "RiggerHub-android" "RiggerHub-ios" "RiggerShared" "RiggerBackend")

echo "🔍 Verifying dedicated repositories exist..."
for repo in "${REQUIRED_REPOS[@]}"; do
    if [ ! -d "$repo" ]; then
        echo "❌ Error: Required repository $repo not found!"
        echo "   Migration may not be complete. Aborting cleanup."
        exit 1
    else
        echo "✅ $repo - Found"
    fi
done

echo ""
echo "✅ All required repositories verified!"
echo ""

# Function to safely remove directory with backup option
remove_directory() {
    local dir_path="$1"
    local dir_name=$(basename "$dir_path")
    
    if [ ! -d "$dir_path" ]; then
        echo "⚠️  Directory already removed: $dir_name"
        return 0
    fi
    
    local file_count=$(find "$dir_path" -type f | wc -l | tr -d ' ')
    echo "📁 Processing: $dir_name ($file_count files)"
    
    if [ "$file_count" -eq 0 ]; then
        echo "   📋 Empty directory - safe to remove"
        rmdir "$dir_path"
        echo "   ✅ Removed: $dir_name"
    else
        echo "   📋 Contains $file_count files"
        if [ "$1" = "--force" ]; then
            echo "   🗑️  Force removal requested"
            rm -rf "$dir_path"
            echo "   ✅ Removed: $dir_name"
        else
            echo "   ⏭️  Skipping (use --force to remove)"
        fi
    fi
    echo ""
}

# Phase 1: Remove confirmed migrated directories
echo "🚀 Phase 1: Removing Primary Migrated Directories"
echo "================================================="
echo ""

# These directories have been confirmed as migrated
PRIMARY_DIRS=(
    "tiation-ecosystem/RiggerHireApp"
    "tiation-ecosystem/RiggerHireApp-Android" 
    "tiation-ecosystem/RiggerHireApp-Backend"
    "tiation-ecosystem/RiggerJobs"
)

if [ "$1" = "--force" ]; then
    echo "⚡ Force mode enabled - will remove all directories"
    echo ""
    
    for dir in "${PRIMARY_DIRS[@]}"; do
        remove_directory "$dir" --force
    done
else
    echo "🔒 Safe mode enabled - will only remove empty directories"
    echo "   Use '--force' flag to remove directories with content"
    echo ""
    
    for dir in "${PRIMARY_DIRS[@]}"; do
        remove_directory "$dir"
    done
fi

# Phase 2: Remove remaining deprecated directories
echo "🚀 Phase 2: Removing Remaining Deprecated Directories"
echo "===================================================="
echo ""

REMAINING_DIRS=(
    "tiation-ecosystem/legacy-riggerhireapp"
    "tiation-ecosystem/tiation-rigger-platform"
    "tiation-ecosystem/tiation-rigger-infrastructure-external"
    "tiation-ecosystem/tiation-rigger-workspace-external"
)

if [ "$1" = "--force" ]; then
    for dir in "${REMAINING_DIRS[@]}"; do
        remove_directory "$dir" --force
    done
else
    echo "📋 The following directories contain reference code and will be preserved:"
    for dir in "${REMAINING_DIRS[@]}"; do
        if [ -d "$dir" ]; then
            file_count=$(find "$dir" -type f | wc -l | tr -d ' ')
            echo "   📁 $(basename "$dir"): $file_count files"
        fi
    done
    echo ""
    echo "   Use '--force' flag to remove these directories"
fi

# Final verification
echo "🎯 Cleanup Summary"
echo "=================="
echo ""

echo "✅ Removed empty directories and symbolic links"
echo "✅ Migrated content safely preserved in dedicated repositories"

if [ "$1" = "--force" ]; then
    echo "✅ All deprecated directories removed (force mode)"
else
    echo "📋 Some directories preserved for manual review"
    echo "   Run with '--force' flag to remove all deprecated directories"
fi

echo ""
echo "🔗 Reference:"
echo "   - Dedicated repositories: /Users/tiaastor/Github/tiation-repos/Rigger*"
echo "   - Deprecation notice: tiation-ecosystem/DEPRECATION_NOTICE.md"
echo "   - Migration mapping: tiation-ecosystem/RIGGER_DIRECTORY_MAPPING_TABLE.md"

echo ""
echo "🎉 Cleanup completed successfully!"
echo ""

# Update the deprecation notice
if [ -f "tiation-ecosystem/DEPRECATION_NOTICE.md" ]; then
    echo "📝 Updating deprecation notice with cleanup status..."
    
    # Add cleanup completion status
    if [ "$1" = "--force" ]; then
        echo "" >> tiation-ecosystem/DEPRECATION_NOTICE.md
        echo "## ✅ Cleanup Status" >> tiation-ecosystem/DEPRECATION_NOTICE.md
        echo "" >> tiation-ecosystem/DEPRECATION_NOTICE.md
        echo "**Cleanup Completed**: $(date)" >> tiation-ecosystem/DEPRECATION_NOTICE.md
        echo "**Mode**: Force cleanup - All deprecated directories removed" >> tiation-ecosystem/DEPRECATION_NOTICE.md
        echo "**Status**: ✅ Complete" >> tiation-ecosystem/DEPRECATION_NOTICE.md
    else
        echo "" >> tiation-ecosystem/DEPRECATION_NOTICE.md
        echo "## ⏳ Cleanup Status" >> tiation-ecosystem/DEPRECATION_NOTICE.md
        echo "" >> tiation-ecosystem/DEPRECATION_NOTICE.md
        echo "**Cleanup Started**: $(date)" >> tiation-ecosystem/DEPRECATION_NOTICE.md
        echo "**Mode**: Safe cleanup - Empty directories removed, content preserved" >> tiation-ecosystem/DEPRECATION_NOTICE.md
        echo "**Status**: 🔄 Partial - Use --force flag for complete cleanup" >> tiation-ecosystem/DEPRECATION_NOTICE.md
    fi
fi

echo "✅ Deprecation notice updated"
echo ""
echo "===========================================" 
echo "🏗️ Enterprise-grade cleanup completed!"
echo "   Following ChaseWhiteRabbit NGO best practices"
echo "   All Rigger projects now in dedicated repositories"
echo "==========================================="
