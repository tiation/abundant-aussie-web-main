import { Suspense, ComponentType, ReactNode } from 'react';
import { trackUserInteraction } from '@/utils/monitoring';

interface LazyLoaderProps {
  fallback?: ReactNode;
  componentName?: string;
}

const DefaultFallback = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

export const withLazyLoading = <P extends object>(
  LazyComponent: ComponentType<P>,
  options: LazyLoaderProps = {}
) => {
  const { fallback = <DefaultFallback />, componentName = 'UnknownComponent' } = options;

  return (props: P) => {
    // Track lazy component loads for monitoring
    trackUserInteraction(`lazy_load_${componentName}`);

    return (
      <Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
};

// Error boundary for lazy loaded components
import { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export class LazyErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Lazy component error:', error, errorInfo);
    
    // Track error for monitoring
    trackUserInteraction('lazy_component_error', { 
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex items-center justify-center min-h-[200px] text-red-500">
          <p>Something went wrong loading this component.</p>
        </div>
      );
    }

    return this.props.children;
  }
}
