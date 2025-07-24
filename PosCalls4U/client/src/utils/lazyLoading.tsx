import React, { lazy, Suspense, ComponentType } from 'react';
import { LoadingSkeleton } from '@components/UI/LoadingSkeleton';
import { LoadingSpinner } from '@components/UI/LoadingSpinner';

// Loading component types
type LoadingComponent = ComponentType<any>;
type LoadingFallback = ComponentType<any> | JSX.Element;

// Retry utility for failed imports
const retryImport = (fn: () => Promise<any>, retriesLeft = 5, interval = 1000): Promise<any> => {
  return new Promise((resolve, reject) => {
    fn()
      .then(resolve)
      .catch((error) => {
        setTimeout(() => {
          if (retriesLeft === 1) {
            reject(error);
            return;
          }
          
          // Retry with exponential backoff
          retryImport(fn, retriesLeft - 1, interval * 2).then(resolve, reject);
        }, interval);
      });
  });
};

// Enhanced lazy loading with retry mechanism
export const lazyRetry = (componentImport: () => Promise<any>) => {
  return lazy(() => retryImport(componentImport));
};

// Pre-configured loading fallbacks
export const LoadingFallbacks = {
  // Simple spinner for small components
  spinner: <LoadingSpinner />,
  
  // Skeleton for content areas
  skeleton: <LoadingSkeleton />,
  
  // Page-level loading
  page: (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Loading page...</p>
      </div>
    </div>
  ),
  
  // Dashboard loading
  dashboard: (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-lg shadow p-4">
            <LoadingSkeleton height="120px" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <LoadingSkeleton height="300px" />
      </div>
    </div>
  ),
  
  // Table loading
  table: (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <LoadingSkeleton height="20px" width="200px" />
      </div>
      <div className="p-4 space-y-3">
        {[1, 2, 3, 4, 5].map(i => (
          <LoadingSkeleton key={i} height="40px" />
        ))}
      </div>
    </div>
  ),
  
  // Form loading
  form: (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i}>
            <LoadingSkeleton height="20px" width="100px" className="mb-2" />
            <LoadingSkeleton height="40px" />
          </div>
        ))}
        <LoadingSkeleton height="40px" width="120px" />
      </div>
    </div>
  ),
  
  // Modal loading
  modal: (
    <div className="p-6">
      <LoadingSkeleton height="24px" width="200px" className="mb-4" />
      <div className="space-y-3">
        <LoadingSkeleton height="40px" />
        <LoadingSkeleton height="40px" />
        <LoadingSkeleton height="40px" />
      </div>
    </div>
  ),
};

// Lazy loading wrapper with custom fallback
interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: LoadingFallback;
  error?: ComponentType<{ error: Error; retry: () => void }>;
  minLoadTime?: number; // Minimum loading time to prevent flashing
}

export const LazyWrapper: React.FC<LazyWrapperProps> = ({
  children,
  fallback = LoadingFallbacks.spinner,
  error: ErrorComponent,
  minLoadTime = 0,
}) => {
  const [minTimeElapsed, setMinTimeElapsed] = React.useState(minLoadTime === 0);

  React.useEffect(() => {
    if (minLoadTime > 0) {
      const timer = setTimeout(() => setMinTimeElapsed(true), minLoadTime);
      return () => clearTimeout(timer);
    }
  }, [minLoadTime]);

  if (ErrorComponent) {
    return (
      <ErrorBoundary fallback={ErrorComponent}>
        <Suspense fallback={minTimeElapsed ? fallback : LoadingFallbacks.spinner}>
          {children}
        </Suspense>
      </ErrorBoundary>
    );
  }

  return (
    <Suspense fallback={minTimeElapsed ? fallback : LoadingFallbacks.spinner}>
      {children}
    </Suspense>
  );
};

// Error boundary for lazy loaded components
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback: ComponentType<{ error: Error; retry: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Lazy loading error:', error, errorInfo);
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback;
      return <FallbackComponent error={this.state.error!} retry={this.retry} />;
    }

    return this.props.children;
  }
}

// Pre-configured lazy components for common patterns
export const createLazyComponent = (
  importFn: () => Promise<any>,
  fallback: LoadingFallback = LoadingFallbacks.spinner,
  minLoadTime = 200
) => {
  const LazyComponent = lazyRetry(importFn);
  
  const WrappedComponent: React.FC<any> = (props) => (
    <LazyWrapper fallback={fallback} minLoadTime={minLoadTime}>
      <LazyComponent {...props} />
    </LazyWrapper>
  );

  WrappedComponent.displayName = `Lazy(${LazyComponent.displayName || 'Component'})`;
  
  return WrappedComponent;
};

// Pre-configured lazy components for different sections
export const LazyComponents = {
  // Authentication pages
  LoginPage: createLazyComponent(
    () => import('../pages/auth/LoginPage'),
    LoadingFallbacks.page
  ),
  
  RegisterPage: createLazyComponent(
    () => import('../pages/auth/RegisterPage'),
    LoadingFallbacks.page
  ),
  
  // Dashboard pages
  Dashboard: createLazyComponent(
    () => import('../pages/dashboard/Dashboard'),
    LoadingFallbacks.dashboard
  ),
  
  // DVP Statistics
  DVPStatsPage: createLazyComponent(
    () => import('../pages/dvp/DVPStatsPage'),
    LoadingFallbacks.dashboard
  ),
  
  // Teams
  TeamsPage: createLazyComponent(
    () => import('../pages/teams/TeamsPage'),
    LoadingFallbacks.table
  ),
  
  TeamDetails: createLazyComponent(
    () => import('../pages/teams/TeamDetails'),
    LoadingFallbacks.page
  ),
  
  // Calls
  CallsPage: createLazyComponent(
    () => import('../pages/calls/CallsPage'),
    LoadingFallbacks.table
  ),
  
  ActiveCalls: createLazyComponent(
    () => import('../pages/calls/ActiveCalls'),
    LoadingFallbacks.table
  ),
  
  // Analytics
  AnalyticsPage: createLazyComponent(
    () => import('../pages/analytics/AnalyticsPage'),
    LoadingFallbacks.dashboard
  ),
  
  // Settings
  SettingsPage: createLazyComponent(
    () => import('../pages/settings/SettingsPage'),
    LoadingFallbacks.form
  ),
  
  // Fixtures
  FixturesPage: createLazyComponent(
    () => import('../pages/fixtures/FixturesPage'),
    LoadingFallbacks.table
  ),
  
  FixtureDetails: createLazyComponent(
    () => import('../pages/fixtures/FixtureDetails'),
    LoadingFallbacks.page
  ),
};

// Preloading utilities
export const PreloadUtils = {
  /**
   * Preload a component when user hovers over a link
   */
  preloadOnHover: (importFn: () => Promise<any>) => ({
    onMouseEnter: () => {
      // Preload component on hover
      importFn().catch(error => {
        console.warn('Preload failed:', error);
      });
    },
  }),

  /**
   * Preload components when browser is idle
   */
  preloadOnIdle: (importFns: (() => Promise<any>)[]) => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        importFns.forEach(importFn => {
          importFn().catch(error => {
            console.warn('Idle preload failed:', error);
          });
        });
      });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        importFns.forEach(importFn => {
          importFn().catch(error => {
            console.warn('Timeout preload failed:', error);
          });
        });
      }, 1000);
    }
  },

  /**
   * Preload components based on route predictions
   */
  preloadByRoute: (routeMap: Record<string, () => Promise<any>>) => {
    const currentPath = window.location.pathname;
    
    // Simple route prediction logic - you can enhance this
    const likelyRoutes = Object.keys(routeMap).filter(route => {
      // Preload child routes of current route
      return route.startsWith(currentPath) && route !== currentPath;
    });

    likelyRoutes.forEach(route => {
      routeMap[route]().catch(error => {
        console.warn(`Route preload failed for ${route}:`, error);
      });
    });
  },
};

// Performance monitoring for lazy loading
export const LazyLoadingMetrics = {
  loadTimes: new Map<string, number>(),
  
  startLoading: (componentName: string) => {
    LazyLoadingMetrics.loadTimes.set(componentName, performance.now());
  },
  
  endLoading: (componentName: string) => {
    const startTime = LazyLoadingMetrics.loadTimes.get(componentName);
    if (startTime) {
      const loadTime = performance.now() - startTime;
      console.log(`Component ${componentName} loaded in ${loadTime.toFixed(2)}ms`);
      
      // Report to analytics service if available
      if (window.gtag) {
        window.gtag('event', 'lazy_component_load', {
          component_name: componentName,
          load_time: Math.round(loadTime),
        });
      }
      
      LazyLoadingMetrics.loadTimes.delete(componentName);
    }
  },
  
  getStats: () => ({
    pendingLoads: LazyLoadingMetrics.loadTimes.size,
    pendingComponents: Array.from(LazyLoadingMetrics.loadTimes.keys()),
  }),
};
