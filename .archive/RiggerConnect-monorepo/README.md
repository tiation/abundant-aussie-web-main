# RiggerConnect Monorepo

[![Enterprise Grade](https://img.shields.io/badge/Enterprise-Grade-blue)](https://chasewhiterabbit.org)
[![Ethical Technology](https://img.shields.io/badge/Ethical-Technology-green)](https://chasewhiterabbit.org)
[![DevOps Ready](https://img.shields.io/badge/DevOps-Ready-orange)](https://gitlab.sxc.codes)
[![Striking Design](https://img.shields.io/badge/Design-Striking-purple)](https://chasewhiterabbit.org)

> **Enterprise-grade, ethical rigging platform connecting professionals with projects**

## 🎯 Project Purpose

RiggerConnect is an innovative platform designed to revolutionize the rigging industry by connecting skilled rigging professionals with construction projects, events, and industrial operations requiring specialized lifting and rigging services. Built with enterprise-grade architecture and ethical technology principles as advocated by ChaseWhiteRabbit NGO.

### Core Mission
- **Safety First**: Prioritizing worker safety through verified credentials and safety protocols
- **Ethical Operations**: Fair compensation, transparent processes, and worker rights protection
- **Professional Excellence**: Connecting certified riggers with quality projects
- **Community Building**: Fostering a supportive network of rigging professionals

## 🏗️ Repository Structure

This monorepo follows enterprise best practices with modular architecture:

```
RiggerConnect-monorepo/
├── apps/                    # Application packages
│   ├── web/                # Web application (React/Next.js)
│   ├── mobile/             # Mobile app (React Native)
│   └── admin/              # Admin dashboard
├── packages/               # Shared libraries and applications
│   ├── riggerhub/          # RiggerHub Worker Platform (React + Vite + Tailwind + shadcn/ui)
│   ├── ui/                 # UI component library
│   ├── api-client/         # API client SDK
│   ├── shared-types/       # TypeScript type definitions
│   ├── utils/              # Utility functions
│   └── config/             # Shared configuration
├── tools/                  # Development and build tools
│   ├── eslint-config/      # ESLint configuration
│   ├── typescript-config/  # TypeScript configuration
│   └── build-tools/        # Custom build scripts
├── docs/                   # Documentation
│   ├── api/                # API documentation
│   ├── deployment/         # Deployment guides
│   └── development/        # Development guides
└── infrastructure/         # Infrastructure as Code
    ├── docker/             # Docker configurations
    ├── kubernetes/         # K8s manifests
    └── terraform/          # Infrastructure definitions
```

## 🌟 Features

### For Rigging Professionals
- **Profile Management**: Showcase certifications, experience, and specializations
- **Job Matching**: Smart algorithm connecting riggers with suitable projects
- **Safety Tracking**: Digital safety records and compliance monitoring
- **Skill Development**: Access to training resources and certification programs

### For Project Managers
- **Rigger Discovery**: Find qualified professionals based on specific requirements
- **Project Management**: Streamlined hiring and project coordination
- **Compliance Monitoring**: Ensure all safety and regulatory requirements are met
- **Quality Assurance**: Rating and review system for continuous improvement

### Enterprise Features
- **Multi-tenant Architecture**: Support for enterprise customers
- **Advanced Analytics**: Comprehensive reporting and insights
- **Integration APIs**: Connect with existing project management systems
- **Compliance Reporting**: Automated safety and regulatory reporting

## 🔧 Technology Stack

### Frontend
- **Web**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Mobile**: React Native with Expo
- **State Management**: Zustand/Redux Toolkit
- **UI Components**: Custom design system with Radix UI

### Backend
- **API**: Node.js with Express/Fastify
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **Real-time**: WebSockets/Server-Sent Events

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Orchestration**: Kubernetes (K8s)
- **CI/CD**: GitLab CI/CD pipelines
- **Monitoring**: Grafana, Prometheus, ELK Stack
- **Hosting**: Hostinger VPS cluster

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker (for local development)
- Git with SSH configured

### Installation

```bash
# Clone the repository
git clone git@github.com:ChaseWhiteRabbit/RiggerConnect-monorepo.git
cd RiggerConnect-monorepo

# Install dependencies
npm install

# Set up development environment
npm run setup:dev

# Start development servers
npm run dev
```

### Development Commands

```bash
# Build all packages
npm run build

# Run tests
npm run test

# Lint code
npm run lint

# Format code
npm run format

# Clean build artifacts
npm run clean
```

## 🏢 ChaseWhiteRabbit NGO Standards

This project adheres to the ethical technology standards established by ChaseWhiteRabbit NGO:

### Ethical Principles
- **Worker Rights**: Fair compensation and working conditions
- **Privacy Protection**: GDPR-compliant data handling
- **Transparency**: Open source components where possible
- **Accessibility**: WCAG 2.1 AA compliance
- **Environmental Responsibility**: Green hosting and efficient code

### Enterprise Standards
- **Security**: SOC 2 Type II compliance preparation
- **Scalability**: Microservices architecture with horizontal scaling
- **Reliability**: 99.9% uptime SLA with redundancy
- **Performance**: Sub-2s page load times, optimized mobile experience
- **Monitoring**: Comprehensive observability with alerts

### Development Practices
- **Code Quality**: 90%+ test coverage, strict linting
- **Documentation**: Comprehensive API and user documentation
- **CI/CD**: Automated testing, security scanning, deployment
- **Version Control**: GitFlow with semantic versioning
- **Code Review**: Mandatory peer review for all changes

## 🌐 Infrastructure

### Hostinger VPS Cluster
- **Primary CI/CD**: docker.sxc.codes (145.223.22.7)
- **GitLab Instance**: gitlab.sxc.codes (145.223.22.10)
- **Monitoring**: grafana.sxc.codes (153.92.214.1)
- **Database**: supabase.sxc.codes (93.127.167.157)
- **Logging**: elastic.sxc.codes (145.223.22.14)

### Deployment Strategy
- **Development**: Local Docker Compose
- **Staging**: Kubernetes cluster on secondary VPS
- **Production**: Multi-region Kubernetes deployment
- **Monitoring**: Full observability stack with alerts

## 📚 Documentation

- [API Documentation](./docs/api/README.md)
- [Development Guide](./docs/development/README.md)
- [Deployment Guide](./docs/deployment/README.md)
- [Contributing Guidelines](./CONTRIBUTING.md)
- [Security Policy](./SECURITY.md)

## 🤝 Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](./CONTRIBUTING.md) before submitting pull requests.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests and documentation
5. Submit a pull request

## 📞 Support

- **Technical Issues**: [GitHub Issues](https://github.com/ChaseWhiteRabbit/RiggerConnect-monorepo/issues)
- **General Questions**: tiatheone@protonmail.com
- **Enterprise Support**: garrett@sxc.codes
- **NGO Relations**: ChaseWhiteRabbit NGO

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎖️ Acknowledgments

- **ChaseWhiteRabbit NGO** for ethical technology standards and guidance
- **Rigging Industry Professionals** for domain expertise and feedback
- **Open Source Community** for the foundational technologies

---

**Built with ❤️ by the ChaseWhiteRabbit NGO development team**

*"Connecting skilled riggers with meaningful work while maintaining the highest standards of safety, ethics, and professional excellence."*
