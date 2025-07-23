import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'net.tiation.riggerconnect',
  appName: 'RiggerConnect',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#1e40af",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#ffffff",
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: "launch_screen",
      useDialog: true,
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    },
    Haptics: {
      enabled: true
    },
    StatusBar: {
      style: "DARK"
    },
    Network: {
      enabled: true
    },
    Storage: {
      enabled: true
    },
    Camera: {
      enabled: true,
      permissions: ["camera", "photos"]
    },
    Geolocation: {
      enabled: true,
      permissions: ["location"]
    }
  },
  ios: {
    scheme: 'RiggerConnect'
  },
  android: {
    allowMixedContent: true,
    captureInput: true
  }
};

export default config;
