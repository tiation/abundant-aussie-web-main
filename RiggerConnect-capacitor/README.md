# RiggerConnect Capacitor Mobile App

[![ChaseWhiteRabbit NGO](https://img.shields.io/badge/ChaseWhiteRabbit-NGO-blue.svg)](https://chasewhiterabbit.org)
[![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-lightgrey.svg)](https://capacitorjs.com/)
[![Framework](https://img.shields.io/badge/framework-Capacitor-blueviolet.svg)](https://capacitorjs.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## Overview

RiggerConnect Capacitor is a cross-platform mobile application built with Ionic Capacitor, providing construction industry professionals with a powerful platform for networking, learning, and career development. This app serves as the mobile companion to the RiggerConnect web platform.

## 🚀 Features

### Core Functionality
- **Professional Networking**: Connect with industry professionals
- **Learning Hub**: Access courses, certifications, and training materials
- **Job Opportunities**: Browse and apply for construction jobs
- **Safety Compliance**: WorkSafe WA integration and compliance tracking
- **Real-time Messaging**: Chat with connections and employers
- **Profile Management**: Comprehensive professional profiles

### Mobile-Specific Features
- **Offline Support**: Key features available without internet connection
- **Push Notifications**: Real-time alerts for jobs, messages, and updates
- **Camera Integration**: Document upload and verification
- **GPS Integration**: Location-based job searches and check-ins
- **Biometric Authentication**: Secure login with fingerprint/face recognition

## 🏗️ Architecture

### Technology Stack
- **Framework**: Ionic Capacitor
- **Frontend**: React with TypeScript
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS with Rigger theme
- **Native Features**: Capacitor plugins
- **Backend**: RiggerBackend API integration

### Project Structure
```
RiggerConnect-capacitor/
├── android/                    # Android platform files
├── ios/                        # iOS platform files
├── src/
│   ├── components/            # Reusable UI components
│   ├── pages/                 # Application screens
│   ├── hooks/                 # Custom React hooks
│   ├── services/              # API and data services
│   ├── store/                 # Redux store configuration
│   ├── utils/                 # Utility functions
│   └── types/                 # TypeScript type definitions
├── public/                    # Static assets
├── tests/                     # Test files
└── docs/                      # Documentation
```

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ and npm
- iOS development requires Xcode (macOS only)
- Android development requires Android Studio
- Capacitor CLI: `npm install -g @capacitor/cli`

### Installation
```bash
# Clone the repository
git clone git@github.com:tiation/RiggerConnect-capacitor.git
cd RiggerConnect-capacitor

# Install dependencies
npm install

# Install iOS dependencies (macOS only)
cd ios/App && pod install && cd ../..

# Sync Capacitor
npx cap sync
```

### Development Commands
```bash
# Start development server
npm start

# Build for production
npm run build

# Run on iOS simulator
npx cap run ios

# Run on Android emulator
npx cap run android

# Open in Xcode
npx cap open ios

# Open in Android Studio
npx cap open android
```

## 📱 Platform Integration

### iOS Features
- **Native Navigation**: iOS-style navigation patterns
- **iOS Notifications**: APNs integration for push notifications
- **Apple Pay**: Payment processing integration
- **Health App**: Sync with iOS Health for safety tracking
- **Siri Shortcuts**: Voice command integration

### Android Features
- **Material Design**: Google Material Design patterns
- **Firebase**: Push notifications and analytics
- **Google Pay**: Payment processing integration
- **Android Auto**: Vehicle integration for safety
- **Work Profile**: Enterprise device management

## 🔧 Configuration

### Environment Variables
Create `.env` files for different environments:

```bash
# .env.development
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_ENVIRONMENT=development
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_key

# .env.production
REACT_APP_API_URL=https://api.riggerconnect.com/api
REACT_APP_ENVIRONMENT=production
```

### Capacitor Configuration
```typescript
// capacitor.config.ts
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'net.tiation.riggerconnect',
  appName: 'RiggerConnect',
  webDir: 'build',
  bundledWebRuntime: false,
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    },
    Camera: {
      quality: 90,
      allowEditing: true,
      resultType: 'uri'
    }
  }
};

export default config;
```

## 🔗 Related Repositories

### Core Platform Components

| Repository | Platform | Description | GitHub SSH URL |
|------------|----------|-------------|----------------|
| **RiggerConnect-web** | Web | Business-focused recruitment platform | `git@github.com:tiation/RiggerConnect-web.git` |
| **RiggerConnect-android** | Android | Mobile business management app | `git@github.com:tiation/RiggerConnect-android.git` |
| **RiggerConnect-ios** | iOS | Mobile business management app | `git@github.com:tiation/RiggerConnect-ios.git` |
| **RiggerConnect-capacitor** | Cross-platform | Cross-platform mobile framework | `git@github.com:tiation/RiggerConnect-capacitor.git` |
| **RiggerHub-web** | Web | Worker-focused job search platform | `git@github.com:tiation/RiggerHub-web.git` |
| **RiggerHub-android** | Android | Mobile worker app | `git@github.com:tiation/RiggerHub-android.git` |
| **RiggerHub-ios** | iOS | Mobile worker app | `git@github.com:tiation/RiggerHub-ios.git` |
| **RiggerBackend** | API/Backend | Core backend services and APIs | `git@github.com:tiation/RiggerBackend.git` |
| **RiggerShared** | Multi-platform | Shared libraries and components | `git@github.com:tiation/RiggerShared.git` |

## 🧪 Testing

### Test Stack
- **Unit Tests**: Jest and React Testing Library
- **Integration Tests**: Capacitor test suite
- **E2E Tests**: Detox for mobile testing
- **Device Testing**: Manual testing on physical devices

### Running Tests
```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# E2E tests (requires setup)
npm run test:e2e

# Coverage report
npm run test:coverage
```

## 📦 Deployment

### iOS Deployment
1. **Build for iOS**:
   ```bash
   npm run build
   npx cap copy ios
   npx cap open ios
   ```

2. **App Store Process**:
   - Archive in Xcode
   - Upload to App Store Connect
   - Submit for review

### Android Deployment
1. **Build for Android**:
   ```bash
   npm run build
   npx cap copy android
   npx cap open android
   ```

2. **Play Store Process**:
   - Generate signed APK/AAB
   - Upload to Google Play Console
   - Submit for review

### CI/CD Pipeline
The app uses GitHub Actions for automated builds and deployments:
- **Pull Requests**: Run tests and build checks
- **Main Branch**: Deploy to staging environment
- **Release Tags**: Deploy to production app stores

## 🔐 Security

### Authentication
- **JWT Tokens**: Secure API authentication
- **Biometric Auth**: Fingerprint and face recognition
- **OAuth Integration**: Google, LinkedIn, Microsoft login
- **Multi-Factor Auth**: TOTP and SMS verification

### Data Protection
- **Encryption**: Local data encryption using Capacitor
- **Secure Storage**: Keychain (iOS) and Keystore (Android)
- **Certificate Pinning**: API security measures
- **Privacy Controls**: GDPR compliance features

## 🌐 API Integration

The mobile app integrates with the RiggerBackend API for all data operations:

### Core Endpoints
- **Authentication**: `/api/auth/*`
- **User Profile**: `/api/users/*`
- **Jobs**: `/api/jobs/*`
- **Networking**: `/api/connections/*`
- **Learning**: `/api/courses/*`
- **Compliance**: `/api/compliance/*`

### Real-time Features
- **WebSocket**: Real-time messaging and notifications
- **Push Notifications**: Firebase (Android) and APNs (iOS)
- **Offline Sync**: Background synchronization when online

## 📈 Analytics & Monitoring

### Tracking
- **User Analytics**: App usage and feature adoption
- **Performance Monitoring**: Crash reporting and performance metrics
- **Business Metrics**: Job applications, connections, course completions

### Tools
- **Sentry**: Error tracking and performance monitoring
- **Firebase Analytics**: User behavior analytics
- **Custom Metrics**: Business-specific tracking

## 🤝 Contributing

We welcome contributions from the community! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Code Style
- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks
- **Conventional Commits**: Commit message standards

## 📚 Documentation

- [API Documentation](https://github.com/tiaastor/docs/api/)
- [Architecture Overview](https://github.com/tiaastor/docs/architecture/)
- [Deployment Guide](https://github.com/tiaastor/docs/deployment/)
- [User Guide](https://github.com/tiaastor/docs/user-guide/)
- [Troubleshooting](https://github.com/tiaastor/docs/troubleshooting/)

## 🔗 Related Repositories

### Core Platform Components

| Repository | Platform | Description | GitHub SSH URL |
|------------|----------|-------------|----------------|
| **RiggerBackend** | API/Backend | Core backend services and APIs for the Rigger ecosystem | `git@github.com:tiation/RiggerBackend.git` |
| **RiggerConnect-web** | Web | Professional networking platform for construction workers | `git@github.com:tiation/RiggerConnect-web.git` |
| **RiggerConnect-android** | Android | Native Android mobile networking application | `git@github.com:tiation/RiggerConnect-android.git` |
| **RiggerConnect-capacitor** | Cross-platform | Cross-platform mobile app built with Ionic Capacitor | `git@github.com:tiation/RiggerConnect-capacitor.git` |
| **RiggerConnect-ios** | iOS | Native iOS mobile networking application | `git@github.com:tiation/RiggerConnect-ios.git` |
| **RiggerHub-web** | Web | Operations management hub for business users | `git@github.com:tiation/RiggerHub-web.git` |
| **RiggerHub-android** | Android | Native Android operations management application | `git@github.com:tiation/RiggerHub-android.git` |
| **RiggerHub-ios** | iOS | Native iOS operations management application | `git@github.com:tiation/RiggerHub-ios.git` |
| **RiggerShared** | Multi-platform | Shared libraries, components, and utilities | `git@github.com:tiation/RiggerShared.git` |

## 👥 Contact & Team

### Project Leaders

**Jack Jonas** - Karratha Crane Operator & Industry Expert  
📧 [jackjonas95@gmail.com](mailto:jackjonas95@gmail.com)  
🏗️ **Industry Expertise**: Seasoned rigger, crane operator, and heavy vehicle mechanic based in Karratha, Western Australia. Jack's extensive field experience ensures this cross-platform mobile application addresses the real-world networking and career development needs of riggers who require reliable mobile tools that work seamlessly across different devices and platforms in challenging industrial environments.

**Tia** - ChaseWhiteRabbit NGO Technical Leadership  
📧 [tiatheone@protonmail.com](mailto:tiatheone@protonmail.com)  
🌟 **NGO Mission-Driven Leadership**: Swedish software developer and founder of ChaseWhiteRabbit NGO, dedicated to creating ethical technology solutions that empower blue-collar workers. Tia's mission-driven approach ensures this cross-platform app provides construction industry professionals with powerful networking tools while maintaining the organization's commitment to community impact and worker welfare.

## 🤝 Project Team & Purpose

This project is part of a broader suite of repositories aimed at supporting the **transient rigging and heavy lifting industry** in Western Australia and beyond.

🔗 **Related Repositories**:

* [`RiggerConnect-web`](https://github.com/ChaseWhiteRabbit/RiggerConnect-web) - Professional networking platform for construction workers
* [`RiggerConnect-android`](https://github.com/ChaseWhiteRabbit/RiggerConnect-android) - Native Android mobile networking application
* [`RiggerConnect-ios`](https://github.com/ChaseWhiteRabbit/RiggerConnect-ios) - Native iOS mobile networking application
* [`RiggerConnect-capacitor`](https://github.com/ChaseWhiteRabbit/RiggerConnect-capacitor) - Cross-platform mobile app built with Ionic Capacitor
* [`RiggerHub-web`](https://github.com/ChaseWhiteRabbit/RiggerHub-web) - Operations management hub for business users
* [`RiggerHub-android`](https://github.com/ChaseWhiteRabbit/RiggerHub-android) - Native Android operations management application
* [`RiggerHub-ios`](https://github.com/ChaseWhiteRabbit/RiggerHub-ios) - Native iOS operations management application
* [`RiggerShared`](https://github.com/ChaseWhiteRabbit/RiggerShared) - Shared libraries, components, and utilities
* [`RiggerBackend`](https://github.com/ChaseWhiteRabbit/RiggerBackend) - Core backend services and APIs for the Rigger ecosystem

📬 **Contact**:
For questions, ideas, or collaboration inquiries, please reach out to:

* **Jack Jonas** – [jackjonas95@gmail.com](mailto:jackjonas95@gmail.com)
* **Tia** – [tiatheone@protonmail.com](mailto:tiatheone@protonmail.com)

---

### 🙌 About the Founders

**Jack Jonas** is a seasoned rigger, crane operator, and heavy vehicle mechanic based in Karratha, Western Australia. His firsthand experience in the field shapes the practical backbone of this platform.

**Tia** is a Swedish software developer and founder of the NGO **ChaseWhiteRabbit**, which is dedicated to building inclusive, systemic solutions to complex challenges.

Together, they created this SaaS platform to:

* Help connect riggers, doggers, and crane operators to real work opportunities.
* Support better logistics, transparency, and compliance in the field.
* Fund and sustain the good work being done by **ChaseWhiteRabbit** in disadvantaged communities.

### ChaseWhiteRabbit NGO
This project is proudly developed under the ChaseWhiteRabbit NGO, dedicated to creating ethical, enterprise-grade solutions for the construction industry.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help
- **Documentation**: Check our comprehensive docs
- **Issues**: Report bugs on GitHub Issues
- **Discussions**: Join our GitHub Discussions
- **Email**: Contact us at support@riggerconnect.com

### Community
- **Discord**: Join our developer community
- **Twitter**: Follow [@RiggerConnect](https://twitter.com/riggerconnect)
- **LinkedIn**: Connect with us on LinkedIn

---

**Built with ❤️ by the ChaseWhiteRabbit NGO team**

*Connecting construction professionals, one app at a time.*

## 🌟 Project Vision: Empowering Industry Through Ethical Technology

### How This Platform Serves Jack Jonas and the Rigging Industry

RiggerConnect Capacitor delivers cross-platform mobile excellence specifically designed for Western Australia's construction and rigging professionals. For experienced riggers like Jack Jonas working across diverse mobile environments, this Capacitor application provides:

- **Universal Mobile Access**: Cross-platform application ensuring consistent functionality across iOS and Android devices, accommodating diverse technology preferences in the rigging workforce
- **Field-Optimized Performance**: Capacitor-based architecture delivering native performance for professional networking and career development tools in challenging industrial environments
- **Seamless Device Integration**: Advanced mobile features like camera integration, GPS services, and offline functionality supporting real-world rigging workflow requirements
- **Professional Networking Excellence**: Sophisticated cross-platform interface enabling riggers to connect with industry professionals, employers, and peers regardless of mobile platform
- **Career Development Tools**: Comprehensive mobile portfolio management and learning resources accessible across all devices and platforms

### Supporting ChaseWhiteRabbit NGO's Charitable Mission

Every successful connection made through RiggerConnect Capacitor generates sustainable funding for ChaseWhiteRabbit NGO's charitable initiatives:

- **Cross-Platform Impact**: Revenue from universal mobile access directly supports NGO programs focused on digital inclusion and technology equity across diverse communities
- **Professional Development Funding**: Platform success in facilitating networking and career development enables NGO investment in vocational training programs for disadvantaged youth
- **Mobile Technology Access**: Cross-platform app revenue helps establish mobile technology training centers in remote and underserved communities
- **Research and Innovation**: Platform growth supports NGO development of additional open-source cross-platform tools that benefit blue-collar workers globally
- **Industry Advocacy**: Revenue funds research and policy advocacy for improved worker networking opportunities and professional development support

### Ethical, Accessible, and Worker-First Technology

RiggerConnect Capacitor exemplifies ChaseWhiteRabbit NGO's commitment to creating ethical technology solutions that empower blue-collar workers:

**🔍 Ethical by Design**
- GPL v3 licensing ensures complete transparency and prevents proprietary exploitation of worker networking and professional data
- Algorithmic fairness in networking recommendations and career opportunity matching prevents discrimination and promotes equal access
- Privacy-first architecture with cross-platform data protection ensuring user information security across all devices
- Anti-bias safeguards in professional networking algorithms ensuring equal opportunity regardless of background or demographics

**♿ Accessibility as a Core Value**
- Capacitor accessibility features ensuring consistent usability across platforms for users with diverse abilities
- Multi-language support reflecting Australia's diverse workforce communities and international rigging professionals
- Offline-first design acknowledging connectivity challenges in remote construction and mining sites
- Cross-platform compatibility ensuring access regardless of device preferences or economic constraints

**👷 Worker-Focused Philosophy**
- User ownership of professional networking data and career profiles prevents vendor lock-in and ensures portability
- Transparent networking algorithms that workers can understand and influence
- Direct feedback mechanisms giving construction professionals genuine voice in platform development and feature prioritization
- Skills-based professional recognition that values practical experience, safety record, and industry expertise over academic credentials

This cross-platform mobile application demonstrates that cutting-edge Capacitor technology can simultaneously serve professional networking needs, empower individual workers across diverse mobile platforms, and generate sustainable funding for social good - proving that ethical technology practices and cross-platform accessibility create stronger, more inclusive business models.
