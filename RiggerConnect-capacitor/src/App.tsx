import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Keyboard } from '@capacitor/keyboard';
import { Network } from '@capacitor/network';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Device } from '@capacitor/device';

// Import your existing components
import Dashboard from './components/Dashboard';
import JobSearch from './components/JobSearch';
import Profile from './components/Profile';
import Notifications from './components/Notifications';
import Auth from './components/Auth';
import OfflineManager from './services/OfflineManager';
import { SupabaseProvider } from './contexts/SupabaseContext';

const App: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<any>(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Initialize Capacitor app
      await initializeCapacitor();
      
      // Get device information
      const info = await Device.getInfo();
      setDeviceInfo(info);
      
      // Initialize offline manager
      await OfflineManager.initialize();
      
      // Setup network monitoring
      setupNetworkMonitoring();
      
      // Setup keyboard handling
      setupKeyboardHandling();
      
      setIsReady(true);
    } catch (error) {
      console.error('Failed to initialize app:', error);
      setIsReady(true); // Still allow app to load
    }
  };

  const initializeCapacitor = async () => {
    try {
      // Set status bar style
      await StatusBar.setStyle({ style: Style.Dark });
      
      // Handle app state changes
      CapacitorApp.addListener('appStateChange', ({ isActive }) => {
        console.log('App state changed. Active:', isActive);
        if (isActive) {
          // Sync data when app becomes active
          OfflineManager.syncPendingData();
        }
      });

      // Handle app URL opening (deep links)
      CapacitorApp.addListener('appUrlOpen', (event) => {
        console.log('App opened via URL:', event.url);
        // Handle deep linking logic here
      });

      // Handle back button (Android)
      CapacitorApp.addListener('backButton', ({ canGoBack }) => {
        if (!canGoBack) {
          CapacitorApp.exitApp();
        } else {
          window.history.back();
        }
      });

    } catch (error) {
      console.error('Error initializing Capacitor:', error);
    }
  };

  const setupNetworkMonitoring = async () => {
    try {
      // Check initial network status
      const status = await Network.getStatus();
      setIsOnline(status.connected);

      // Listen for network changes
      Network.addListener('networkStatusChange', (status) => {
        setIsOnline(status.connected);
        
        if (status.connected) {
          console.log('Network restored - syncing offline data');
          OfflineManager.syncPendingData();
          // Provide haptic feedback for network restoration
          Haptics.impact({ style: ImpactStyle.Light });
        } else {
          console.log('Network lost - enabling offline mode');
          // Provide haptic feedback for network loss
          Haptics.impact({ style: ImpactStyle.Heavy });
        }
      });
    } catch (error) {
      console.error('Error setting up network monitoring:', error);
    }
  };

  const setupKeyboardHandling = () => {
    try {
      // Handle keyboard show/hide for better UX
      Keyboard.addListener('keyboardWillShow', (info) => {
        document.body.style.paddingBottom = `${info.keyboardHeight}px`;
      });

      Keyboard.addListener('keyboardWillHide', () => {
        document.body.style.paddingBottom = '0px';
      });
    } catch (error) {
      console.error('Error setting up keyboard handling:', error);
    }
  };

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading RiggerConnect...</p>
        </div>
      </div>
    );
  }

  return (
    <SupabaseProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          {/* Network Status Indicator */}
          {!isOnline && (
            <div className="bg-red-500 text-white text-center py-2 px-4">
              <p className="text-sm">You're offline. Some features may be limited.</p>
            </div>
          )}

          {/* Routes */}
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/jobs" element={<JobSearch />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>

          {/* Debug Info (only in development) */}
          {process.env.NODE_ENV === 'development' && deviceInfo && (
            <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white text-xs p-2 rounded">
              <p>Platform: {deviceInfo.platform}</p>
              <p>Online: {isOnline ? 'Yes' : 'No'}</p>
            </div>
          )}
        </div>
      </Router>
    </SupabaseProvider>
  );
};

export default App;
