# Tiation Documentation Hub

> **Enterprise-grade documentation for all Tiation repositories and services** 📚

This directory serves as the central documentation hub for the Tiation ecosystem, including RiggerConnect, RiggerHub, and supporting infrastructure.

## 📂 Documentation Structure

### 🏗️ **[Environment Setup Guides](../environment-setup-guides/README.md)**
Complete guides for setting up development, staging, and production environments:
- **[Local Development Setup](../environment-setup-guides/local/README.md)** - Docker-based development environment
- **[Staging Environment Setup](../environment-setup-guides/staging/README.md)** - Pre-production testing environment  
- **[Production Environment Setup](../environment-setup-guides/production/README.md)** - Live deployment environment
- **[VPS Provisioning Guide](../environment-setup-guides/docs/vps-provisioning.md)** - Hostinger VPS setup
- **[Database Setup Guide](../environment-setup-guides/docs/database-setup.md)** - PostgreSQL, MongoDB, Redis
- **[SSL Certificate Guide](../environment-setup-guides/docs/ssl-certificates.md)** - Let's Encrypt automation

### 📖 **Core Documentation**
- **[API.md](./API.md)** - API documentation and endpoints
- **[SETUP.md](./SETUP.md)** - Quick setup instructions
- **[USAGE.md](./USAGE.md)** - Usage guidelines and examples

### 🏛️ **Architecture & Design**
- **[architecture/overview.md](./architecture/overview.md)** - System architecture overview
- **[assets/data-flow-diagram.svg](./assets/data-flow-diagram.svg)** - Visual data flow diagrams

### 🚀 **Deployment Guides**
- **[deployment/docker-setup-troubleshooting.md](./deployment/docker-setup-troubleshooting.md)** - Docker troubleshooting
- **[deployment/kubernetes-deployment.md](./deployment/kubernetes-deployment.md)** - Kubernetes deployment guide

### 📝 **Standards & Guidelines**
- **[standards/Documentation_Templates.md](./standards/Documentation_Templates.md)** - Documentation templates
- **[style-guides/](./style-guides/)** - Code and documentation style guides
  - [DOCUMENTATION_STANDARDS.md](./style-guides/DOCUMENTATION_STANDARDS.md)
  - [INLINE_COMMENTING_STANDARDS.md](./style-guides/INLINE_COMMENTING_STANDARDS.md)  
  - [COMMENTING_QUICK_REFERENCE.md](./style-guides/COMMENTING_QUICK_REFERENCE.md)

### 📋 **Project Tasks**
- **[tasks/RiggerBackend_Documentation_Tasks.md](./tasks/RiggerBackend_Documentation_Tasks.md)** - Backend documentation tasks

## 🌐 Related Repositories

This documentation references the following interconnected repositories:

### Business-Facing Frontend
- **[RiggerConnect-android](../RiggerConnect-android/)** - Android client application
- **[RiggerConnect-ios](../RiggerConnect-ios/)** - iOS client application  
- **[RiggerConnect-web](../RiggerConnect-web/)** - Web client application

### Worker-Facing & Backend
- **[RiggerHub-android](../RiggerHub-android/)** - Android worker application
- **[RiggerHub-ios](../RiggerHub-ios/)** - iOS worker application
- **[RiggerHub-web](../RiggerHub-web/)** - Web worker portal

### Shared Components
- **[RiggerConnect-capacitor](../RiggerConnect-capacitor/)** - Shared mobile components
- **[RiggerBackend](../RiggerBackend/)** - Backend API services
- **[RiggerShared](../RiggerShared/)** - Shared utilities and components

## 🏗️ Infrastructure Overview

### VPS Servers
| Server | IP | Role | Documentation |
|--------|----|----- |---------------|
| docker.sxc.codes | 145.223.22.7 | Primary CI/CD runner | [Production Setup](../environment-setup-guides/production/README.md) |
| docker.tiation.net | 145.223.22.9 | Staging environment | [Staging Setup](../environment-setup-guides/staging/README.md) |
| gitlab.sxc.codes | 145.223.22.10 | CI/CD orchestration | [VPS Provisioning](../environment-setup-guides/docs/vps-provisioning.md) |
| grafana.sxc.codes | 153.92.214.1 | Monitoring & dashboards | [Monitoring Setup](../environment-setup-guides/docs/monitoring-setup.md) |
| elastic.sxc.codes | 145.223.22.14 | Log aggregation (ELK) | [Database Setup](../environment-setup-guides/docs/database-setup.md) |
| supabase.sxc.codes | 93.127.167.157 | Backend as a service | [Database Setup](../environment-setup-guides/docs/database-setup.md) |

## 🚦 Quick Start

### For Developers
1. Start with [Local Development Setup](../environment-setup-guides/local/README.md)
2. Review [API Documentation](./API.md) 
3. Follow [Style Guidelines](./style-guides/README.md)

### For DevOps
1. Review [VPS Provisioning Guide](../environment-setup-guides/docs/vps-provisioning.md)
2. Set up [Database Infrastructure](../environment-setup-guides/docs/database-setup.md)
3. Configure [SSL Certificates](../environment-setup-guides/docs/ssl-certificates.md)
4. Deploy to [Staging](../environment-setup-guides/staging/README.md) then [Production](../environment-setup-guides/production/README.md)

### For Project Managers
1. Review [Architecture Overview](./architecture/overview.md)
2. Check [Project Tasks](./tasks/RiggerBackend_Documentation_Tasks.md)
3. Monitor via [Grafana Dashboard](http://grafana.sxc.codes)

## 🔧 Documentation Maintenance

### Adding New Documentation
1. Follow the [Documentation Standards](./style-guides/DOCUMENTATION_STANDARDS.md)
2. Use appropriate [Templates](./standards/Documentation_Templates.md)
3. Update this README to include new documents
4. Ensure proper cross-referencing

### Style Guidelines
- Use clear, accessible language per [user preferences](../README.md#user-preferences)
- Include copy-paste commands where applicable
- Add troubleshooting sections for complex procedures
- Use emoji markers for visual organization

## 📞 Support & Contact

### Team Contacts
- **Jack Jonas** (WA Rigger) - jackjonas95@gmail.com
- **Tia** (Developer, ChaseWhiteRabbit NGO) - tiatheone@protonmail.com

### Monitoring & Alerts
- **System Health**: [grafana.sxc.codes](http://grafana.sxc.codes)
- **Log Analysis**: [elastic.sxc.codes](http://elastic.sxc.codes)
- **Email Alerts**: tiatheone@protonmail.com, garrett@sxc.codes, garrett.dillman@gmail.com

## 🎯 Documentation Status

| Section | Status | Last Updated |
|---------|--------|--------------|
| Environment Setup | ✅ Complete | 2025-01-25 |
| API Documentation | 📝 In Progress | 2024-07-24 |
| Architecture | ✅ Complete | 2024-07-24 |
| Deployment | 📝 In Progress | 2024-07-24 |
| Style Guides | ✅ Complete | 2024-07-24 |

---

> **ChaseWhiteRabbit NGO** - Following modular, CI/CD-ready development practices with enterprise-grade, ethical approaches
