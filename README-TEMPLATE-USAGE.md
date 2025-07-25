# README Template Usage Guide

## How to Use This Template

This standardized README template should be customized for each Rigger platform repository. Follow these steps:

## 1. Copy and Rename
```bash
# Copy template to your project directory
cp /Users/tiaastor/Github/tiation-repos/README-TEMPLATE.md /Users/tiaastor/Github/tiation-repos/[your-repo-name]/README.md
```

## 2. Customize Project-Specific Sections

### Replace Placeholders:
- `[Project Name]` → Actual project name (e.g., "RiggerConnect Web", "RiggerHub Android")
- `[repository-name]` → Actual GitHub repo name (e.g., "RiggerConnect-web")
- `[Platform]` → Specific platform type from the list
- `[ProjectName]` → iOS/Android project name for workspace files

### Update Platform Type:
Choose from:
- Web Application
- Android App 
- iOS App
- Backend Service
- Shared Library

### Customize Core Features:
Replace the placeholder features with actual project features:
```markdown
### Core Features
- Real-time worker-employer matching
- Integrated safety reporting system
- Fair wage calculation engine
```

## 3. Platform-Specific Installation Instructions

### Keep Only Relevant Section:
- **Web projects**: Keep Node.js/TypeScript section only
- **Android projects**: Keep Android Development section only  
- **iOS projects**: Keep iOS Development section only
- **Backend/Shared**: Keep Node.js/TypeScript or add relevant tech stack

### Update Prerequisites:
Adjust version requirements based on your project's needs.

## 4. DevOps & Enterprise Security Customization

### Update Server Usage:
Specify which Hostinger VPS servers your project actually uses for enterprise-grade deployment:
- Web apps typically use: docker.sxc.codes, gitlab.sxc.codes, helm.sxc.codes
- Backend services may also use: supabase.sxc.codes, elastic.sxc.codes
- All projects use: grafana.sxc.codes for monitoring and observability
- Security scanning and compliance via integrated OWASP tools

### Customize Enterprise CI/CD Pipeline:
Add or remove pipeline steps based on your project while maintaining enterprise security standards:
```yaml
# Example for Android:
- Code quality checks (Android Lint, Detekt)
- Security scanning (OWASP ZAP, dependency vulnerability checks)
- Unit tests (JUnit) with 80%+ coverage requirement
- UI tests (Espresso)
- Docker containerization with security hardening
- Build APK/AAB with signing verification
- Deploy to Play Store (internal testing)
- Monitoring via Grafana dashboards
```

## 5. Contact Information

### Update Team Roles:
Customize Jack Jonas's role if different for specific projects:
- "Lead Frontend Developer" for web projects
- "Mobile Development Lead" for mobile projects
- "Backend Architect" for backend services

### Add Project-Specific Contacts:
If other team members are involved in specific projects, add them.

## 6. License & NGO Mission Customization

### Keep Standard GPLv3:
The GPL v3 license section should remain consistent across all repositories to maintain the ethical framework and ChaseWhiteRabbit NGO's commitment to open source technology.

### Update Repository Links:
Ensure all GitHub links point to the correct repository.

## 7. Development Standards

### Customize Tech Stack Standards:
Update based on the specific technology:

**For React/TypeScript:**
```markdown
- **Code Quality**: ESLint, Prettier, TypeScript strict mode
- **Testing**: Jest, React Testing Library, 80%+ coverage
- **Build Tools**: Vite/Webpack, PostCSS, Tailwind CSS
```

**For Android:**
```markdown
- **Code Quality**: Android Lint, Detekt, Kotlin coding standards
- **Testing**: JUnit, Espresso, 80%+ coverage
- **Architecture**: MVVM, Room, Retrofit
```

**For iOS:**
```markdown
- **Code Quality**: SwiftLint, SwiftFormat
- **Testing**: XCTest, UI Tests, 80%+ coverage  
- **Architecture**: MVVM, Core Data, URLSession
```

## 8. Repository Table

The "Related Repositories" table should remain consistent across all projects to show the complete ecosystem, but you can emphasize the current repository by making it bold or adding an indicator.

## 9. Final Checklist

Before committing your customized README:

- [ ] All placeholders replaced with actual values
- [ ] Platform-specific sections updated
- [ ] Installation instructions tested
- [ ] Links verified (GitHub, documentation)
- [ ] Team contact information accurate
- [ ] Development standards match project tech stack
- [ ] CI/CD pipeline reflects actual setup
- [ ] Grammar and spelling checked

## 10. Maintenance

### Regular Updates:
- Update version requirements as project evolves
- Add new features to the features list
- Update deployment information as infrastructure changes
- Keep team information current

### Consistency:
When making significant changes to one README, consider if the same changes should be applied to other project READMEs to maintain consistency across the ecosystem.

---

This template ensures all Rigger platform repositories maintain:
- **Consistent branding** and ChaseWhiteRabbit NGO mission alignment
- **Professional presentation** for enterprise stakeholders
- **Clear technical guidance** for developers with enterprise security standards
- **Ethical framework** visibility and GPL v3 compliance
- **Complete ecosystem overview** showcasing Hostinger VPS infrastructure
- **Worker empowerment focus** in all documentation
