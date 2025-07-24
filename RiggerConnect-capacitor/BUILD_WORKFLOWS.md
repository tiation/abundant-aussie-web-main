# RiggerConnect Build Workflows

This document outlines the build processes and native workflow alignment for the RiggerConnect Capacitor application.

## Project Structure

```
RiggerConnect-capacitor/
├── src/                     # Web application source
├── dist/                    # Built web assets
├── android/                 # Android native project
│   ├── app/
│   │   └── src/main/assets/public/  # Web assets copied here
│   ├── build.gradle         # Android build configuration
│   └── gradlew             # Gradle wrapper
├── ios/                     # iOS native project
│   ├── App/
│   │   └── App/public/     # Web assets copied here
│   └── App.xcworkspace     # Xcode workspace
├── package.json            # npm scripts and dependencies
└── capacitor.config.ts     # Capacitor configuration
```

## Build Scripts

### Development Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build web assets for development
- `npm run build:prod` - Build web assets for production
- `npm run preview` - Preview built application

### Capacitor Sync Scripts
- `npm run cap:sync` - Sync web assets to all platforms
- `npm run cap:sync:android` - Sync web assets to Android only
- `npm run cap:sync:ios` - Sync web assets to iOS only

### Platform Build Scripts
- `npm run cap:build:android` - Build web assets, copy to Android, and open Android Studio
- `npm run cap:build:ios` - Build web assets, copy to iOS, and open Xcode
- `npm run cap:build:android:prod` - Production build for Android
- `npm run cap:build:ios:prod` - Production build for iOS
- `npm run cap:build:all` - Build and sync to all platforms
- `npm run cap:build:all:prod` - Production build and sync to all platforms

### Native Build Scripts
- `npm run android:build` - Build Android APK (debug)
- `npm run android:build:release` - Build Android APK (release)
- `npm run android:clean` - Clean Android build artifacts
- `npm run android:studio` - Open Android Studio
- `npm run ios:build` - Build iOS app (debug)
- `npm run ios:build:release` - Build iOS app (release)
- `npm run ios:xcode` - Open Xcode

### Testing Scripts
- `npm run test:android` - Build and test Android
- `npm run test:ios` - Build and test iOS

### Utility Scripts
- `npm run clean` - Clean all build artifacts
- `npm run lint` - Type checking with TypeScript
- `npm run cap:doctor` - Diagnose Capacitor setup
- `npm run cap:clean` - Clean Capacitor cache
- `npm run deploy:prepare` - Prepare for deployment

## Native Development Workflow

### Android Studio Integration

The Android project is located in the `android/` directory and contains:
- Standard Android Gradle build files
- Capacitor plugins configuration
- App configuration in `android/app/build.gradle`

To work with Android Studio:
1. Run `npm run cap:build:android` to build and open Android Studio
2. Or manually open `android/` directory in Android Studio
3. The web assets are automatically copied to `android/app/src/main/assets/public/`
4. Use Android Studio's build system normally for native development

### Xcode Integration

The iOS project is located in the `ios/` directory and contains:
- Xcode workspace and project files
- CocoaPods configuration
- App configuration in Xcode project settings

To work with Xcode:
1. Run `npm run cap:build:ios` to build and open Xcode
2. Or manually open `ios/App/App.xcworkspace` in Xcode
3. The web assets are automatically copied to `ios/App/App/public/`
4. Use Xcode's build system normally for native development

## Build Process Flow

### Development Flow
1. Develop web application in `src/`
2. Run `npm run dev` for hot reload development
3. Test on platforms using `npm run cap:run:android` or `npm run cap:run:ios`

### Production Build Flow
1. `npm run build:prod` - Build optimized web assets
2. `npm run cap:sync` - Copy assets to native platforms
3. `npm run android:build:release` or `npm run ios:build:release` - Build native apps
4. Deploy using platform-specific distribution methods

### Continuous Integration Flow
1. `npm run clean` - Clean previous builds
2. `npm run build:prod` - Build production web assets
3. `npm run cap:sync` - Sync to platforms
4. `npm run android:build:release` - Build Android release
5. `npm run ios:build:release` - Build iOS release

## Platform-Specific Configuration

### Android Configuration
- Package ID: `net.tiation.riggerconnect`
- Min SDK: 24 (Android 7.0)
- Target SDK: 34 (Android 14)
- Gradle version: 8.2.1

### iOS Configuration
- Bundle ID: `net.tiation.riggerconnect`
- Deployment target: iOS 13.0
- CocoaPods for dependency management
- Swift 5.0+

## Important Notes

1. **Asset Synchronization**: Always run `npm run cap:sync` after building web assets to ensure native platforms have the latest code.

2. **Native Dependencies**: When adding Capacitor plugins, run `npm run cap:sync` to update native projects.

3. **Build Artifacts**: The `dist/` directory contains built web assets that are copied to native platforms.

4. **IDE Compatibility**: Both Android Studio and Xcode can be used independently after initial Capacitor setup.

5. **Hot Reload**: Development server supports live reload for web development, but native builds require full rebuild.

6. **Testing**: Use device/simulator testing with `npm run cap:run:*` commands for best results.
