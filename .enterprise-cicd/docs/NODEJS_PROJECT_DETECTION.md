# Node.js Project Detection System
## ChaseWhiteRabbit NGO - Enterprise CI/CD

### 🎯 Overview

The Node.js Project Detection System extends the existing `.enterprise-cicd` infrastructure with intelligent project type identification and conditional CI/CD pipeline execution. This system automatically detects project characteristics and configures appropriate build, test, and deployment strategies.

## 🔍 Detection Capabilities

### Supported Project Types

| Project Type | Detection Criteria | Build Strategy | Test Strategy |
|--------------|-------------------|----------------|---------------|
| **Next.js** | `next.config.js`, `next` dependency, `/pages` or `/app` dirs | Static/SSR build | Component tests |
| **Vite** | `vite.config.js`, `vite` dependency, Vite plugins | SPA build | Component tests |
| **Nuxt** | `nuxt.config.js`, `nuxt` dependency | Static/SSR build | Component tests |
| **Express** | `express` dependency, server files | API build | Integration tests |
| **Fastify** | `fastify` dependency | API build | Integration tests |
| **React Native** | `react-native` dependency, platform dirs | Bundle build | Mobile tests |
| **Electron** | `electron` dependency | Package build | E2E tests |
| **Shared Library** | Scoped package name, library configs | Package build | Unit tests |
| **Generic Node.js** | Fallback for other Node.js projects | Generic build | Generic tests |

### Detection Features

- **Framework Detection**: Identifies specific frameworks and their versions
- **TypeScript Support**: Detects TypeScript configuration and enables type checking
- **Testing Framework**: Identifies Jest, Vitest, Mocha, and other test runners
- **Build Tools**: Detects bundlers, compilers, and build configurations
- **Docker Support**: Determines if project should be containerized
- **Deployment Strategy**: Chooses appropriate deployment method

## 🚀 Usage

### 1. Automatic Detection

The detection runs automatically in CI/CD pipelines:

```bash
# Detection runs automatically on first pipeline stage
.enterprise-cicd/scripts/detect-nodejs-project.sh detect
```

### 2. Manual Detection

Run detection manually in any Node.js project:

```bash
# Basic detection
.enterprise-cicd/scripts/detect-nodejs-project.sh detect

# View results as JSON
.enterprise-cicd/scripts/detect-nodejs-project.sh results

# View as environment variables
.enterprise-cicd/scripts/detect-nodejs-project.sh env

# Clean detection results
.enterprise-cicd/scripts/detect-nodejs-project.sh clean
```

### 3. Apply Detection to Pipeline

Apply detection results to configure CI/CD pipeline:

```bash
# Apply detection results
.enterprise-cicd/scripts/apply-project-detection.sh apply

# View generated configuration
.enterprise-cicd/scripts/apply-project-detection.sh config

# View configuration summary
.enterprise-cicd/scripts/apply-project-detection.sh summary
```

## 📄 Generated Files

### Detection Results (`.enterprise-cicd/project-detection.json`)

```json
{
  "projectType": "nextjs",
  "capabilities": {
    "frontendBuild": true,
    "serverTests": false,
    "dockerBuild": true,
    "libraryBuild": false,
    "hasTypeScript": true,
    "hasTests": true
  },
  "commands": {
    "build": "next build",
    "start": "next start",
    "test": "jest"
  },
  "dependencies": ["next", "react", "typescript", "..."],
  "detectedAt": "2024-01-15T10:30:00Z",
  "detectionVersion": "1.0.0"
}
```

### Environment Variables (`.enterprise-cicd/project-detection.env`)

```bash
export PROJECT_TYPE="nextjs"
export FRONTEND_BUILD=true
export SERVER_TESTS=false
export DOCKER_BUILD=true
export LIBRARY_BUILD=false
export HAS_TYPESCRIPT=true
export HAS_TESTS=true
export BUILD_COMMAND="next build"
export START_COMMAND="next start"
export TEST_COMMAND="jest"
```

### Pipeline Configuration (`.enterprise-cicd/pipeline-config.env`)

```bash
# Project Detection Results
export PROJECT_TYPE="nextjs"
export FRONTEND_BUILD=true
export SERVER_TESTS=false
export DOCKER_BUILD=true

# Pipeline Configuration
export NODE_VERSION="20"
export BUILD_STRATEGY="nextjs-static-build"
export TEST_STRATEGY="frontend-component-tests"
export DEPLOYMENT_STRATEGY="nextjs-docker-deployment"
export DOCKER_BASE_IMAGE="node:20-alpine"

# Quality Gates
export LINT_ENABLED=true
export TYPE_CHECK_ENABLED=true
export SECURITY_SCAN_ENABLED=true
export PERFORMANCE_TEST_ENABLED=true

# Feature Flags
export ENABLE_FRONTEND_BUILD=true
export ENABLE_DOCKER_BUILD=true
export ENABLE_TYPESCRIPT_CHECK=true
```

## ⚙️ CI/CD Integration

### GitLab CI Configuration

The detection system integrates with GitLab CI through conditional job execution:

```yaml
# Include the detection template
include:
  - local: '.enterprise-cicd/templates/nodejs-detection-template.yml'

# Jobs run conditionally based on detection results
build:frontend:nextjs:
  rules:
    - if: $PROJECT_TYPE == "nextjs"

test:server:integration:
  rules:
    - if: $SERVER_TESTS == "true"

build:docker:
  rules:
    - if: $DOCKER_BUILD == "true"
```

### Pipeline Stages

1. **Validate**: Project detection and environment validation
2. **Quality**: Linting, type checking (conditional)
3. **Test**: Component tests, integration tests, unit tests (conditional)
4. **Build**: Frontend build, server build, library build (conditional)
5. **Deploy**: Static deployment, Docker deployment, npm publishing (conditional)
6. **Monitor**: Application monitoring setup (conditional)
7. **Cleanup**: Clean up detection artifacts

### Conditional Execution

Jobs execute based on detection results:

- **Frontend jobs** run only for frontend projects
- **Server tests** run only for API servers
- **Docker builds** run only for containerized projects
- **Library publishing** runs only for shared libraries
- **TypeScript checks** run only for TypeScript projects

## 🎨 Project-Specific Configurations

### Next.js Projects

```yaml
Variables:
  NODE_VERSION: "20"
  BUILD_STRATEGY: "nextjs-static-build"
  DOCKER_BASE_IMAGE: "node:20-alpine"

Features:
  - Frontend build with static export
  - Component testing with Jest
  - Performance testing with Lighthouse
  - Docker containerization
  - Static site deployment
```

### Express API Projects

```yaml
Variables:
  NODE_VERSION: "20"
  BUILD_STRATEGY: "api-server-build"
  DOCKER_BASE_IMAGE: "node:20-alpine"

Features:
  - TypeScript compilation (if applicable)
  - Integration testing
  - API documentation generation
  - Docker containerization
  - Server deployment
```

### Shared Libraries

```yaml
Variables:
  NODE_VERSION: "18"  # Wider compatibility
  BUILD_STRATEGY: "library-package-build"
  
Features:
  - Library bundling with Rollup
  - Unit testing
  - Type declaration generation
  - npm registry publishing
  - Semantic versioning
```

## 🔧 Customization

### Custom Detection Rules

Extend detection by modifying the detection script:

```bash
# Add custom detection function
detect_custom_framework() {
    if [[ -f "custom.config.js" ]]; then
        PROJECT_TYPE="custom-framework"
        return 0
    fi
    return 1
}

# Add to main detection logic
if detect_custom_framework; then
    # Configure custom framework settings
fi
```

### Pipeline Customization

Override default behaviors:

```yaml
# Custom build for special cases
build:custom:
  script:
    - source .enterprise-cicd/pipeline-config.env
    - |
      if [[ "$PROJECT_TYPE" == "nextjs" && -f "custom-build.sh" ]]; then
        ./custom-build.sh
      else
        npm run build
      fi
```

### Environment-Specific Overrides

```bash
# Override detection in specific environments
if [[ "$CI_ENVIRONMENT_NAME" == "production" ]]; then
    export DOCKER_BUILD=true
    export ENABLE_PERFORMANCE_MONITORING=true
fi
```

## 📊 Monitoring and Analytics

### Detection Metrics

Track detection accuracy and pipeline efficiency:

- **Detection Success Rate**: Percentage of projects correctly identified
- **Pipeline Optimization**: Time saved by conditional execution
- **Resource Utilization**: Compute resources saved by skipping unnecessary jobs

### Performance Benefits

- **Faster Pipelines**: Skip irrelevant jobs (30-50% time reduction)
- **Resource Efficiency**: Use appropriate Node.js versions and tools
- **Selective Testing**: Run only relevant test suites
- **Optimized Deployment**: Choose best deployment strategy

## 🚨 Troubleshooting

### Common Issues

#### Detection Fails
```bash
# Check package.json validity
jq empty package.json

# Run detection with verbose output
DEBUG=1 .enterprise-cicd/scripts/detect-nodejs-project.sh detect
```

#### Wrong Project Type Detected
```bash
# Manually override detection
export PROJECT_TYPE="express"
export FRONTEND_BUILD=false
export SERVER_TESTS=true
```

#### Missing Dependencies
```bash
# Ensure jq is installed
apt-get install jq  # Ubuntu/Debian
yum install jq      # RHEL/CentOS
brew install jq     # macOS
```

### Debug Mode

Enable debug logging:

```bash
export DEBUG=1
.enterprise-cicd/scripts/detect-nodejs-project.sh detect
```

## 🔄 Integration with Existing Infrastructure

### VPS Integration

The detection system integrates with the existing 8-VPS infrastructure:

- **docker.sxc.codes**: Builds Docker images for detected containerized projects
- **helm.sxc.codes**: Deploys Kubernetes manifests for scalable applications
- **gitlab.sxc.codes**: Orchestrates GitLab CI pipelines with detection
- **grafana.sxc.codes**: Monitors deployed applications
- **elastic.sxc.codes**: Aggregates logs from all project types

### Security Integration

Maintains existing security standards:

- **Trivy scanning**: Runs for all Docker builds
- **Secret detection**: Applies to all project types
- **Dependency auditing**: Adapts to project-specific package managers
- **SAST/DAST**: Configures appropriate security tests

## 🎯 Future Enhancements

### Planned Features

- **AI-Powered Detection**: Machine learning for complex project structures
- **Multi-Language Support**: Extend to Python, Go, Java projects
- **Framework Version Detection**: Optimize for specific framework versions
- **Dependency Analysis**: Deep dependency tree analysis
- **Performance Profiling**: Automatic performance optimization suggestions

### Integration Roadmap

- **IDE Plugins**: Real-time detection in development environments
- **GitHub Actions**: Native GitHub Actions support
- **Jenkins Integration**: Plugin for Jenkins pipelines
- **Azure DevOps**: Extension for Azure Pipelines

---

## 📚 References

- [Enterprise CI/CD Documentation](./../README.md)
- [Node.js Standardization Templates](./../../node-standardization/README.md)
- [Security Guidelines](./../templates/security-template.yml)
- [Quality Standards](./../templates/quality-template.yml)

## 🏆 ChaseWhiteRabbit NGO Standards

This system adheres to ethical development principles:

- **Transparency**: Full visibility into detection logic
- **Efficiency**: Optimized resource usage
- **Security**: Multiple layers of validation
- **Accessibility**: Clear documentation and error messages
- **Sustainability**: Reduced computational overhead

---

**Status**: ✅ **Active and Operational**  
**Last Updated**: 2024-01-15  
**Version**: 1.0.0  
**Maintained By**: ChaseWhiteRabbit NGO Development Team
