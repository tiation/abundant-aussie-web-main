import React, { ReactElement } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SupabaseProvider } from '../../src/contexts/SupabaseContext';

// Mock Supabase client for testing
const mockSupabaseClient = {
  auth: {
    signInWithPassword: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    resetPasswordForEmail: jest.fn(),
    getUser: jest.fn(),
    getSession: jest.fn(),
    onAuthStateChange: jest.fn(() => ({ data: { subscription: { unsubscribe: jest.fn() } } })),
  },
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    single: jest.fn(),
  })),
  storage: {
    from: jest.fn(() => ({
      upload: jest.fn(),
      download: jest.fn(),
      remove: jest.fn(),
      list: jest.fn(),
      getPublicUrl: jest.fn(),
    })),
  },
};

// Custom render function that includes providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[];
  withRouter?: boolean;
  withSupabase?: boolean;
}

const AllTheProviders: React.FC<{
  children: React.ReactNode;
  withRouter?: boolean;
  withSupabase?: boolean;
  initialEntries?: string[];
}> = ({ children, withRouter = true, withSupabase = true, initialEntries = ['/'] }) => {
  let component = <>{children}</>;

  if (withSupabase) {
    component = (
      <SupabaseProvider value={mockSupabaseClient}>
        {component}
      </SupabaseProvider>
    );
  }

  if (withRouter) {
    component = (
      <BrowserRouter>
        {component}
      </BrowserRouter>
    );
  }

  return component;
};

const customRender = (
  ui: ReactElement,
  {
    initialEntries = ['/'],
    withRouter = true,
    withSupabase = true,
    ...renderOptions
  }: CustomRenderOptions = {}
): RenderResult => {
  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders
        withRouter={withRouter}
        withSupabase={withSupabase}
        initialEntries={initialEntries}
      >
        {children}
      </AllTheProviders>
    ),
    ...renderOptions,
  });
};

// Test data factories
export const createMockUser = (overrides = {}) => ({
  id: 'user-123',
  email: 'test@riggerconnect.com',
  user_metadata: {
    full_name: 'John Doe',
    avatar_url: null,
  },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  ...overrides,
});

export const createMockJob = (overrides = {}) => ({
  id: 'job-123',
  title: 'Senior Rigger Position',
  company: 'Construction Co.',
  location: 'Sydney, NSW',
  description: 'Looking for an experienced rigger...',
  salary_range: '$80,000 - $100,000',
  requirements: ['Dogman license', '5+ years experience'],
  created_at: new Date().toISOString(),
  user_id: 'user-123',
  ...overrides,
});

export const createMockProfile = (overrides = {}) => ({
  id: 'profile-123',
  user_id: 'user-123',
  full_name: 'John Doe',
  location: 'Sydney, NSW',
  experience_level: 'senior',
  certifications: ['Dogman', 'Crane Operator'],
  bio: 'Experienced rigger with 10+ years...',
  contact_phone: '+61 400 123 456',
  availability: 'immediate',
  hourly_rate: 45,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

// Mock device capabilities for Capacitor testing
export const mockCapacitorPlugins = {
  Camera: {
    getPhoto: jest.fn(),
    requestPermissions: jest.fn(),
  },
  Geolocation: {
    getCurrentPosition: jest.fn(),
    requestPermissions: jest.fn(),
  },
  Device: {
    getInfo: jest.fn(() => Promise.resolve({
      platform: 'ios',
      model: 'iPhone',
      operatingSystem: 'ios',
      osVersion: '15.0',
      manufacturer: 'Apple',
      isVirtual: false,
      webViewVersion: '15.0',
    })),
  },
  Network: {
    getStatus: jest.fn(() => Promise.resolve({
      connected: true,
      connectionType: 'wifi',
    })),
  },
  Preferences: {
    get: jest.fn(),
    set: jest.fn(),
    remove: jest.fn(),
    clear: jest.fn(),
  },
  PushNotifications: {
    requestPermissions: jest.fn(),
    register: jest.fn(),
  },
  Haptics: {
    impact: jest.fn(),
    vibrate: jest.fn(),
  },
};

// Async testing utilities
export const waitForLoadingToFinish = () =>
  new Promise(resolve => setTimeout(resolve, 0));

export const mockIntersectionObserver = () => {
  const mockIntersectionObserver = jest.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.IntersectionObserver = mockIntersectionObserver;
};

// Error boundary for testing error states
export const ErrorBoundary: React.FC<{
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error }>;
}> = ({ children, fallback: Fallback }) => {
  const [hasError, setHasError] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      setHasError(true);
      setError(new Error(event.message));
    };

    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  if (hasError && error) {
    return Fallback ? <Fallback error={error} /> : <div>Something went wrong</div>;
  }

  return <>{children}</>;
};

// Re-export everything from React Testing Library
export * from '@testing-library/react';

// Override render method
export { customRender as render };
