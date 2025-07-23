# 🗺️ Rigger Ecosystem Directory Mapping Table

## 📋 Complete Directory-to-Repository Mapping

This document provides a comprehensive mapping of all Rigger-related directories within the `tiation-ecosystem` to their designated target repositories, following enterprise-grade standards and ChaseWhiteRabbit NGO best practices.

---

## 🎯 Target Repository Structure

Based on the rules, all Rigger repositories must be created under:
```
/Users/tiaastor/Github/tiation-repos/
```

### Target Repositories:
1. **RiggerConnect-web** - Consumer-facing web application
2. **RiggerConnect-android** - Consumer-facing Android application  
3. **RiggerConnect-ios** - Consumer-facing iOS application
4. **RiggerHub-web** - Business-focused web application
5. **RiggerHub-android** - Business-focused Android application
6. **RiggerHub-ios** - Business-focused iOS application
7. **RiggerShared** - Shared libraries and common components
8. **RiggerBackend** - All backend services and APIs

---

## 📊 Comprehensive Directory Mapping

### 🌐 **Web Applications → Target Repositories**

| Source Directory | Target Repository | Classification | Priority |
|------------------|------------------|----------------|----------|
| `RiggerHireApp/web/` | **RiggerConnect-web** | Consumer Web Interface | High |
| `RiggerHireApp/B2B-web/` | **RiggerHub-web** | Business Web Interface | High |
| `RiggerHireApp/Staff-web/` | **RiggerHub-web** | Staff Management Portal | High |
| `tiation-rigger-platform/frontend/` | **RiggerHub-web** | Platform Web Interface | Medium |
| `tiation-rigger-workspace-external/apps/marketing-web/` | **RiggerConnect-web** | Marketing Components | Medium |

### 📱 **Android Applications → Target Repositories**

| Source Directory | Target Repository | Classification | Priority |
|------------------|------------------|----------------|----------|
| `RiggerHireApp-Android/` | **RiggerConnect-android** | Main Consumer Android App | High |
| `RiggerHireApp/android/` | **RiggerConnect-android** | Enhanced Android Features | High |
| `tiation-rigger-workspace-external/apps/mobile-android/` | **RiggerConnect-android** | Additional Android Features | Medium |
| `tiation-rigger-platform/frontend/` (RN components) | **RiggerHub-android** | Business Android Components | Medium |

### 🍎 **iOS Applications → Target Repositories**

| Source Directory | Target Repository | Classification | Priority |
|------------------|------------------|----------------|----------|
| `RiggerHireApp/ios/` | **RiggerConnect-ios** | Main Consumer iOS App | High |
| `RiggerJobs/` | **RiggerHub-ios** | Job Management iOS App | High |
| `tiation-rigger-workspace-external/apps/mobile-ios/` | **RiggerConnect-ios** | Enhanced iOS Features | Medium |
| `tiation-rigger-platform/frontend/` (RN components) | **RiggerHub-ios** | Business iOS Components | Medium |

### 🖥️ **Backend Services → Target Repository**

| Source Directory | Target Repository | Classification | Priority |
|------------------|------------------|----------------|----------|
| `RiggerHireApp-Backend/` | **RiggerBackend** | Primary Backend Service | Critical |
| `RiggerHireApp/backend/` | **RiggerBackend** | Enhanced Backend Features | High |
| `tiation-rigger-platform/backend/` | **RiggerBackend** | Platform Backend Services | High |
| `tiation-rigger-workspace-external/AutomationServer/` | **RiggerBackend** | Automation Module | Medium |
| `tiation-rigger-workspace-external/BackendServices/` | **RiggerBackend** | Microservices Suite | Medium |
| `tiation-rigger-automation-server/` | **RiggerBackend** | Automation Components | Medium |
| `tiation-rigger-connect-api/` | **RiggerBackend** | API Services | Medium |

### 📚 **Shared Libraries & Components → Target Repository**

| Source Directory | Target Repository | Classification | Priority |
|------------------|------------------|----------------|----------|
| `tiation-rigger-shared-libraries/` | **RiggerShared** | Core Shared Libraries | Critical |
| `rigger-ecosystem/` | **RiggerShared** | Ecosystem Components | High |
| `tiation-rigger-workspace-external/SharedLibraries/` | **RiggerShared** | External Shared Code | High |
| `legacy-riggerhireapp/` | **RiggerShared** | Legacy Reference Code | Low |
| `tiation-rigger-workspace/` | **RiggerShared** | Workspace Components | Medium |
| `tiation-rigger-workspace-external/` (shared components) | **RiggerShared** | External Workspace Shared | Medium |

### 🔧 **Infrastructure & DevOps → Target Repository**

| Source Directory | Target Repository | Classification | Priority |
|------------------|------------------|----------------|----------|
| `tiation-rigger-infrastructure/` | **RiggerBackend** | Infrastructure Code | Medium |
| `tiation-rigger-infrastructure-external/` | **RiggerBackend** | External Infrastructure | Medium |
| `tiation-rigger-metrics-dashboard/` | **RiggerBackend** | Metrics & Monitoring | Medium |

### 📱 **Cross-Platform Mobile → Target Repositories**

| Source Directory | Target Repository | Classification | Priority |
|------------------|------------------|----------------|----------|
| `tiation-rigger-workspace-external/apps/mobile-react-native/` | **RiggerConnect-android** + **RiggerConnect-ios** | Split React Native Components | Medium |
| `tiation-rigger-mobile-app/` | **RiggerConnect-android** + **RiggerConnect-ios** | Mobile App Components | Medium |

### 🎯 **Specialized Applications → Target Repositories**

| Source Directory | Target Repository | Classification | Priority |
|------------------|------------------|----------------|----------|
| `tiation-rigger-connect-app/` | **RiggerConnect-web** | Connect App Components | Medium |
| `tiation-rigger-jobs-app/` | **RiggerHub-web** | Jobs App Components | Medium |
| `tiation-rigger-workspace-docs/` | **RiggerShared** | Documentation | Low |

---

## 📈 **Migration Priority Matrix**

### **Critical Priority (Immediate Migration)**
- `RiggerHireApp-Backend/` → **RiggerBackend**
- `tiation-rigger-shared-libraries/` → **RiggerShared**

### **High Priority (Next Phase)**
- `RiggerHireApp/web/` → **RiggerConnect-web**
- `RiggerHireApp/B2B-web/` → **RiggerHub-web** 
- `RiggerHireApp/Staff-web/` → **RiggerHub-web**
- `RiggerHireApp-Android/` → **RiggerConnect-android**
- `RiggerHireApp/ios/` → **RiggerConnect-ios**
- `RiggerJobs/` → **RiggerHub-ios**

### **Medium Priority (Subsequent Phases)**
- All `tiation-rigger-platform/` components
- All `tiation-rigger-workspace-external/` components
- Infrastructure and automation components

### **Low Priority (Final Phase)**
- `legacy-riggerhireapp/` → **RiggerShared** (archive)
- Documentation and workspace docs

---

## 🔄 **Migration Strategy**

### Phase 1: Core Infrastructure
1. Set up target repositories with standard structure
2. Migrate critical backend services
3. Migrate shared libraries and components

### Phase 2: Primary Applications  
1. Migrate main web applications
2. Migrate primary mobile applications
3. Establish CI/CD pipelines

### Phase 3: Enhanced Features
1. Migrate platform components
2. Migrate external workspace components
3. Integrate automation services

### Phase 4: Finalization
1. Archive legacy components
2. Complete documentation migration
3. Final testing and validation

---

## ✅ **Validation Checklist**

- [ ] All directories mapped to appropriate repositories
- [ ] Enterprise-grade repository structure implemented
- [ ] CI/CD pipelines configured for each repository
- [ ] Documentation standards applied
- [ ] ChaseWhiteRabbit NGO guidelines followed
- [ ] SSH Git operations configured
- [ ] VPS deployment strategies defined

---

## 📝 **Notes**

- All repositories follow the standardized path: `/Users/tiaastor/Github/tiation-repos/`
- Enterprise-grade structure with modular, CI/CD-ready practices
- ChaseWhiteRabbit NGO standards maintained throughout
- SSH protocol used for all Git operations
- Each repository includes standard documentation subfolders

---

*Generated following enterprise best practices with striking design and comprehensive documentation standards.*

---

**Document Status**: ✅ Complete - Step 2 of Rigger Migration Plan  
**Last Updated**: 2025-07-23T12:22:00Z  
**Next Step**: Step 3 - Repository Creation and Initial Setup
