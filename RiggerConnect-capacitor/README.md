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

### Rigger Ecosystem
- **[RiggerBackend](https://github.com/tiaastor/RiggerBackend/)**: Node.js API and microservices
- **[RiggerConnect-web](https://github.com/tiaastor/RiggerConnect-web/)**: React web application
- **[RiggerConnect-ios](https://github.com/tiaastor/RiggerConnect-ios/)**: Native iOS application
- **[RiggerConnect-android](https://github.com/tiaastor/RiggerConnect-android/)**: Native Android application
- **[RiggerHub-web](https://github.com/tiaastor/RiggerHub-web/)**: Business portal web application
- **[RiggerShared](https://github.com/tiaastor/RiggerShared/)**: Shared libraries and utilities

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
