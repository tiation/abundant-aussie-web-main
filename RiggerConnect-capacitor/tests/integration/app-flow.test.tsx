import React from 'react';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import App from '../../src/App';
import { createMockUser, createMockJob, createMockProfile } from '../utils/test-utils';

// Mock Capacitor plugins for integration testing
jest.mock('@capacitor/core', () => ({
  Capacitor: {
    getPlatform: jest.fn(() => 'web'),
    isNativePlatform: jest.fn(() => false),
    isPluginAvailable: jest.fn(() => true),
  },
}));

jest.mock('@capacitor/device', () => ({
  Device: {
    getInfo: jest.fn(() => Promise.resolve({
      platform: 'web',
      model: 'Browser',
      operatingSystem: 'web',
      osVersion: '1.0',
      manufacturer: 'Unknown',
      isVirtual: true,
      webViewVersion: '1.0',
    })),
  },
}));

jest.mock('@capacitor/network', () => ({
  Network: {
    getStatus: jest.fn(() => Promise.resolve({
      connected: true,
      connectionType: 'wifi',
    })),
    addListener: jest.fn(() => Promise.resolve({ remove: jest.fn() })),
  },
}));

// Mock Supabase client
jest.mock('../../src/services/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(() => Promise.resolve({
        data: { session: null },
        error: null,
      })),
      getUser: jest.fn(() => Promise.resolve({
        data: { user: null },
        error: null,
      })),
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
    })),
  },
}));

describe('App Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the app and show authentication screen for unauthenticated users', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/sign in to riggerconnect/i)).toBeInTheDocument();
    });

    // Should show login form elements
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should handle complete authentication flow', async () => {
    const mockUser = createMockUser();
    const mockSupabase = require('../../src/services/supabase').supabase;

    // Mock successful login
    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: {
        user: mockUser,
        session: { access_token: 'token', user: mockUser },
      },
      error: null,
    });

    // Mock auth state change
    mockSupabase.auth.onAuthStateChange.mockImplementation((callback) => {
      setTimeout(() => callback('SIGNED_IN', { user: mockUser }), 100);
      return { data: { subscription: { unsubscribe: jest.fn() } } };
    });

    render(<App />);

    // Fill in login form
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    // Should eventually show dashboard after login
    await waitFor(() => {
      expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('should handle offline functionality', async () => {
    const { Network } = require('@capacitor/network');
    
    // Mock offline network status
    Network.getStatus.mockResolvedValue({
      connected: false,
      connectionType: 'none',
    });

    render(<App />);

    await waitFor(() => {
      // Should show offline indicator or cached content
      expect(screen.getByText(/offline/i) || screen.getByText(/cached/i)).toBeInTheDocument();
    });
  });

  it('should handle platform-specific features', async () => {
    const { Capacitor } = require('@capacitor/core');
    const { Device } = require('@capacitor/device');

    // Mock mobile platform
    Capacitor.getPlatform.mockReturnValue('ios');
    Capacitor.isNativePlatform.mockReturnValue(true);
    
    Device.getInfo.mockResolvedValue({
      platform: 'ios',
      model: 'iPhone13,2',
      operatingSystem: 'ios',
      osVersion: '15.0',
      manufacturer: 'Apple',
      isVirtual: false,
      webViewVersion: '15.0',
    });

    render(<App />);

    await waitFor(() => {
      // App should adapt to mobile platform
      const mobileElements = screen.queryAllByTestId(/mobile/i);
      expect(mobileElements.length).toBeGreaterThan(0);
    });
  });

  it('should handle navigation between screens', async () => {
    const mockUser = createMockUser();
    const mockSupabase = require('../../src/services/supabase').supabase;

    // Mock authenticated state
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: { user: mockUser, access_token: 'token' } },
      error: null,
    });

    mockSupabase.auth.onAuthStateChange.mockImplementation((callback) => {
      callback('SIGNED_IN', { user: mockUser });
      return { data: { subscription: { unsubscribe: jest.fn() } } };
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    });

    // Navigate to profile
    const profileLink = screen.getByText(/profile/i);
    fireEvent.click(profileLink);

    await waitFor(() => {
      expect(screen.getByText(/user profile/i)).toBeInTheDocument();
    });

    // Navigate to job search
    const jobSearchLink = screen.getByText(/jobs/i);
    fireEvent.click(jobSearchLink);

    await waitFor(() => {
      expect(screen.getByText(/job search/i)).toBeInTheDocument();
    });
  });

  it('should handle data persistence and caching', async () => {
    const mockJobs = [createMockJob(), createMockJob({ id: 'job-456', title: 'Junior Rigger' })];
    const mockSupabase = require('../../src/services/supabase').supabase;

    // Mock job data fetching
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({
        data: mockJobs,
        error: null,
      }),
    });

    render(<App />);

    // Navigate to job search
    const jobSearchLink = screen.getByText(/jobs/i);
    fireEvent.click(jobSearchLink);

    await waitFor(() => {
      expect(screen.getByText('Senior Rigger Position')).toBeInTheDocument();
      expect(screen.getByText('Junior Rigger')).toBeInTheDocument();
    });

    // Data should be cached for subsequent renders
    const cachedJobs = screen.getAllByTestId(/job-card/i);
    expect(cachedJobs).toHaveLength(2);
  });

  it('should handle error states gracefully', async () => {
    const mockSupabase = require('../../src/services/supabase').supabase;

    // Mock network error
    mockSupabase.auth.signInWithPassword.mockRejectedValue(
      new Error('Network error')
    );

    render(<App />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });

  it('should handle responsive design across different screen sizes', async () => {
    // Mock different viewport sizes
    const originalInnerWidth = window.innerWidth;
    const originalInnerHeight = window.innerHeight;

    // Test mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 667,
    });

    render(<App />);

    // Trigger resize event
    fireEvent(window, new Event('resize'));

    await waitFor(() => {
      const mobileLayout = screen.queryByTestId('mobile-layout');
      expect(mobileLayout).toBeInTheDocument();
    });

    // Test desktop viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1920,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 1080,
    });

    fireEvent(window, new Event('resize'));

    await waitFor(() => {
      const desktopLayout = screen.queryByTestId('desktop-layout');
      expect(desktopLayout).toBeInTheDocument();
    });

    // Restore original values
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: originalInnerHeight,
    });
  });

  it('should handle push notifications on native platforms', async () => {
    const { Capacitor } = require('@capacitor/core');
    
    // Mock native platform
    Capacitor.isNativePlatform.mockReturnValue(true);
    Capacitor.isPluginAvailable.mockReturnValue(true);

    const mockPushNotifications = {
      requestPermissions: jest.fn(() => Promise.resolve({ receive: 'granted' })),
      register: jest.fn(() => Promise.resolve()),
      addListener: jest.fn(() => Promise.resolve({ remove: jest.fn() })),
    };

    jest.doMock('@capacitor/push-notifications', () => ({
      PushNotifications: mockPushNotifications,
    }));

    render(<App />);

    await waitFor(() => {
      expect(mockPushNotifications.requestPermissions).toHaveBeenCalled();
    });
  });

  it('should maintain state across app lifecycle events', async () => {
    const { App: CapacitorApp } = require('@capacitor/app');
    
    const mockAppListener = jest.fn();
    CapacitorApp.addListener = jest.fn(() => Promise.resolve({ remove: jest.fn() }));

    render(<App />);

    // Simulate app going to background
    const appStateListener = CapacitorApp.addListener.mock.calls.find(
      call => call[0] === 'appStateChange'
    );

    if (appStateListener) {
      const callback = appStateListener[1];
      callback({ isActive: false });

      // App should handle background state
      await waitFor(() => {
        expect(screen.getByTestId('app-background-state')).toBeInTheDocument();
      });

      // Simulate app coming back to foreground
      callback({ isActive: true });

      await waitFor(() => {
        expect(screen.getByTestId('app-active-state')).toBeInTheDocument();
      });
    }
  });
});
