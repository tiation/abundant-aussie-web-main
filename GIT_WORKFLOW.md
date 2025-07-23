# Git Workflow and Versioning Strategy

## Rigger Ecosystem Git Standards

This document outlines the standardized Git workflow, branching model, and versioning strategy used across all Rigger ecosystem repositories.

## Branching Model

### Main Branches
- **`main`**: Production-ready code. All releases are tagged here.
- **`develop`**: Integration branch for features. Always contains the latest development changes.

### Supporting Branches
- **`feature/*`**: Feature development branches
- **`hotfix/*`**: Critical bug fixes for production
- **`release/*`**: Release preparation branches

### Branch Naming Conventions

#### Feature Branches
```
feature/user-authentication
feature/job-search-filters
feature/mobile-responsive-ui
```

#### Hotfix Branches
```
hotfix/security-vulnerability-fix
hotfix/payment-gateway-issue
hotfix/database-connection-timeout
```

#### Release Branches
```
release/v1.1.0
release/v2.0.0-beta
release/v1.2.1
```

## Versioning Strategy

### Semantic Versioning (SemVer)
We follow Semantic Versioning 2.0.0: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes or significant architectural updates
- **MINOR**: New features, backwards-compatible functionality
- **PATCH**: Bug fixes, security patches, minor improvements

### Version Examples
- `v1.0.0` - Initial release
- `v1.1.0` - New features added
- `v1.1.1` - Bug fixes
- `v2.0.0` - Breaking changes

### Pre-release Versions
- `v1.2.0-alpha.1` - Alpha releases for early testing
- `v1.2.0-beta.2` - Beta releases for broader testing
- `v1.2.0-rc.1` - Release candidates

## Workflow Process

### Feature Development
1. **Create Feature Branch**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/new-feature-name
   ```

2. **Develop and Commit**
   ```bash
   git add .
   git commit -m "feat: add user authentication system"
   ```

3. **Push and Create Pull Request**
   ```bash
   git push origin feature/new-feature-name
   # Create PR from feature branch to develop
   ```

4. **Code Review and Merge**
   - Ensure all tests pass
   - Obtain code review approval
   - Merge to develop branch

### Release Process
1. **Create Release Branch**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b release/v1.1.0
   ```

2. **Prepare Release**
   - Update version numbers
   - Update CHANGELOG.md
   - Run final tests

3. **Merge to Main**
   ```bash
   git checkout main
   git merge release/v1.1.0
   git tag -a v1.1.0 -m "Release version 1.1.0"
   git push origin main --tags
   ```

4. **Merge Back to Develop**
   ```bash
   git checkout develop
   git merge main
   git push origin develop
   ```

### Hotfix Process
1. **Create Hotfix Branch**
   ```bash
   git checkout main
   git checkout -b hotfix/critical-security-fix
   ```

2. **Apply Fix and Test**
   ```bash
   git add .
   git commit -m "fix: resolve critical security vulnerability"
   ```

3. **Merge to Main and Develop**
   ```bash
   # Merge to main
   git checkout main
   git merge hotfix/critical-security-fix
   git tag -a v1.1.1 -m "Hotfix version 1.1.1"
   
   # Merge to develop
   git checkout develop
   git merge main
   
   # Push changes
   git push origin main --tags
   git push origin develop
   ```

## Commit Message Standards

### Conventional Commits Format
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Commit Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks, build changes
- **perf**: Performance improvements
- **ci**: CI/CD pipeline changes
- **build**: Build system changes

### Examples
```bash
feat(auth): add JWT token refresh mechanism
fix(api): resolve timeout issues in job search
docs(readme): update installation instructions
style(ui): improve mobile responsive design
refactor(database): optimize query performance
test(auth): add unit tests for login functionality
chore(deps): update dependencies to latest versions
```

## Tag Management

### Creating Tags
```bash
# Annotated tag (recommended)
git tag -a v1.0.0 -m "Initial release with core features"

# Lightweight tag
git tag v1.0.0
```

### Pushing Tags
```bash
# Push specific tag
git push origin v1.0.0

# Push all tags
git push origin --tags
```

### Deleting Tags
```bash
# Delete local tag
git tag -d v1.0.0

# Delete remote tag
git push origin --delete v1.0.0
```

## Branch Protection Rules

### Main Branch Protection
- Require pull request reviews
- Require status checks to pass
- Require branches to be up to date
- Restrict pushes to main branch
- Require signed commits (recommended)

### Develop Branch Protection
- Require pull request reviews
- Require status checks to pass
- Allow force pushes (with restrictions)

## Release Notes and Changelog

### CHANGELOG.md Format
```markdown
# Changelog

## [1.1.0] - 2025-01-15

### Added
- User authentication system
- Job search filters
- Mobile responsive design

### Changed
- Improved API response times
- Updated user interface design

### Fixed
- Database connection timeout issues
- Email notification bugs

### Security
- Fixed authentication vulnerability
- Updated dependencies with security patches
```

## CI/CD Integration

### Automated Workflows
- **Feature branches**: Run tests, code quality checks
- **Develop branch**: Run tests, build staging deployment
- **Main branch**: Run tests, build production deployment, create release
- **Tags**: Trigger production deployment, generate release notes

### Required Checks
- Unit tests pass
- Integration tests pass
- Code coverage above 80%
- Security scan passes
- Documentation updated

## Repository Standards

### Required Files
- `README.md` - Project overview and setup instructions
- `CHANGELOG.md` - Version history and changes
- `CONTRIBUTING.md` - Contribution guidelines
- `CODE_OF_CONDUCT.md` - Community standards
- `LICENSE.md` - License information
- `.gitignore` - Git ignore patterns
- `.env.example` - Environment variables template

### Documentation Structure
```
docs/
├── architecture/     # System architecture documentation
├── api/             # API documentation and specifications
├── deployment/      # Deployment guides and procedures
├── development/     # Development setup and guidelines
├── user-guide/      # End-user documentation
└── security/        # Security policies and procedures
```

## Best Practices

### Commit Best Practices
- Make atomic commits (one logical change per commit)
- Write clear, descriptive commit messages
- Reference issues in commits when applicable
- Keep commits focused and related

### Branch Best Practices
- Keep feature branches small and focused
- Regularly sync with develop branch
- Delete merged branches to keep repository clean
- Use descriptive branch names

### Review Best Practices
- Review code for functionality, security, and performance
- Ensure tests are included and passing
- Verify documentation is updated
- Check for compliance with coding standards

## Troubleshooting

### Common Issues
1. **Merge Conflicts**: Resolve conflicts manually, test thoroughly
2. **Failed CI/CD**: Check logs, fix issues, push updates
3. **Tag Issues**: Verify tag format, ensure proper permissions
4. **Branch Sync**: Regularly pull from develop to avoid conflicts

### Emergency Procedures
- **Rollback**: Use `git revert` for safe rollbacks
- **Hotfix**: Follow hotfix workflow for critical issues
- **Force Push**: Only use when absolutely necessary and with team coordination

## Contact and Support

For Git workflow questions and support:
- **Primary**: tiatheone@protonmail.com
- **Technical**: garrett@sxc.codes
- **Documentation**: garrett.dillman@gmail.com

---

**Document Version**: 1.0
**Last Updated**: January 2025
**Applies To**: All Rigger Ecosystem repositories
**Review Cycle**: Quarterly
