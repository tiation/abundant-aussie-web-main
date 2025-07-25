# Rigger Ecosystem README Update Plan

## Current Repositories that need README updates:

1. **RiggerHub-web** ✅ DONE - Updated to remove archived status and add ecosystem
2. **RiggerBackend** ⏸️ - Add RiggerConnect-capacitor to ecosystem table
3. **RiggerConnect-android** ⏸️ - Add RiggerConnect-capacitor to ecosystem table
4. **RiggerConnect-capacitor** ✅ - Already has good ecosystem docs
5. **RiggerConnect-ios** ⏸️ - Add RiggerConnect-capacitor to ecosystem table
6. **RiggerConnect-web** ✅ - Already has comprehensive ecosystem docs
7. **RiggerHub-android** ⏸️ - Add RiggerConnect-capacitor to ecosystem table
8. **RiggerHub-ios** ⏸️ - Add RiggerConnect-capacitor to ecosystem table
9. **RiggerShared** ⏸️ - Add RiggerConnect-capacitor to ecosystem table

## Standard Ecosystem Table to Add to All:

```markdown
### Core Platform Components

| Repository | Platform | Description | GitHub SSH URL |
|------------|----------|-------------|----------------|
| **RiggerBackend** | API | Core backend services and APIs | `git@github.com:tiation/RiggerBackend.git` |
| **RiggerConnect-web** | Web | Professional networking platform | `git@github.com:tiation/RiggerConnect-web.git` |
| **RiggerConnect-android** | Android | Mobile networking app | `git@github.com:tiation/RiggerConnect-android.git` |
| **RiggerConnect-ios** | iOS | Mobile networking app | `git@github.com:tiation/RiggerConnect-ios.git` |
| **RiggerConnect-capacitor** | Cross-platform | Mobile networking app (iOS/Android) | `git@github.com:tiation/RiggerConnect-capacitor.git` |
| **RiggerHub-web** | Web | Operations management hub | `git@github.com:tiation/RiggerHub-web.git` |
| **RiggerHub-android** | Android | Mobile operations hub | `git@github.com:tiation/RiggerHub-android.git` |
| **RiggerHub-ios** | iOS | Mobile operations hub | `git@github.com:tiation/RiggerHub-ios.git` |
| **RiggerShared** | Multi-platform | Shared libraries and components | `git@github.com:tiation/RiggerShared.git` |
```

## Standard Architecture Diagram to Update:

```mermaid
graph TB
    RB[RiggerBackend<br/>Core API Services] --> RCW[RiggerConnect-web]
    RB --> RCA[RiggerConnect-android]
    RB --> RCI[RiggerConnect-ios]
    RB --> RCC[RiggerConnect-capacitor]
    RB --> RHW[RiggerHub-web]
    RB --> RHA[RiggerHub-android]
    RB --> RHI[RiggerHub-ios]
    RS[RiggerShared<br/>Common Libraries] --> RCW
    RS --> RCA
    RS --> RCI
    RS --> RCC
    RS --> RHW
    RS --> RHA
    RS --> RHI
    
    style RB fill:#FF00FF,color:#000
    style RS fill:#00FF00,color:#000
    style [CURRENT_REPO] fill:#00FFFF,color:#000
```

## Next Steps:
1. Update each repository's README to include RiggerConnect-capacitor
2. Ensure all repos have consistent ecosystem references
3. Update architecture diagrams to include capacitor
4. Make sure all repos are properly cross-referenced
