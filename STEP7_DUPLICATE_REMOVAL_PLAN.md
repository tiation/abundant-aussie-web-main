# Step 7: Remove Duplicates and Archive - Planning Document

## 8 Official Rigger Repositories (KEEP)
These are the officially consolidated repositories that must be preserved:

1. **RiggerConnect-web** - Official web platform
2. **RiggerConnect-android** - Official Android app
3. **RiggerConnect-ios** - Official iOS app
4. **RiggerHub-web** - Official web hub
5. **RiggerHub-android** - Official Android hub
6. **RiggerHub-ios** - Official iOS hub
7. **RiggerShared** - Official shared components
8. **RiggerBackend** - Official backend services

## Duplicate/Legacy Repositories to Archive

### Rigger-Related Duplicates
- `rigg-connect-app` - Legacy RiggerConnect app (duplicate)
- `RiggerConnect-mobile` - Legacy mobile version (consolidated into platform-specific repos)
- `RiggerConnect-monorepo` - Legacy monorepo structure (split into official repos)

### General Legacy/Duplicate Repositories
- `abundant-aussie-web-main` - Renamed/migrated content
- `caleb-stands-strong-web` - Consolidated into official repos
- `standing-strong-web` - Consolidated into official repos
- `tabletop-adventures-crafted-main` - Non-Rigger project, should be archived separately
- `tiation-board-nexus-main` - Legacy/duplicate
- `lovable-clone` - Development clone that's no longer needed
- `tiation-ecosystem` - Superseded by official repositories

### Repositories to Keep (Non-Rigger Official Projects)
These should remain as they are separate active projects:
- `ChaseWhiteRabbit-Business-Overview`
- `dnd-character-sheets-saas`
- `tiation-ai-platform`
- Development tools and utilities
- Infrastructure repositories

## Archive Strategy

1. **Create backup archive** - Full compressed backup of duplicate repos
2. **Update references** - Update any documentation/config pointing to duplicates
3. **Create deprecation notices** - Add README.md files explaining the migration
4. **Move to archive folder** - Relocate duplicates to `.archive/` subdirectory
5. **Update repository index** - Update main documentation

## Implementation Steps

1. Create comprehensive backup
2. Identify and document all cross-references
3. Update references to point to official repositories
4. Create deprecation notices in duplicate repositories
5. Move duplicates to archive
6. Verify all systems point to official repositories
7. Update main documentation and indexes
