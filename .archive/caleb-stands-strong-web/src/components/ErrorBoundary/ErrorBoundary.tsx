import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { trackUserInteraction } from '@/utils/monitoring';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  level?: 'page' | 'component' | 'app';
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError, level = 'component' } = this.props;
    
    // Update state with error details
    this.setState({
      error,
      errorInfo
    });

    // Log error to monitoring system
    this.logErrorToMonitoring(error, errorInfo, level);
    
    // Call custom error handler if provided
    if (onError) {
      onError(error, errorInfo);
    }
    
    // Track error interaction
    trackUserInteraction('error_boundary_triggered', {
      level,
      errorMessage: error.message,
      errorStack: error.stack,
      componentStack: errorInfo.componentStack
    });
    
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private logErrorToMonitoring = async (error: Error, errorInfo: ErrorInfo, level: string) => {
    try {
      // Send structured error data to monitoring
      const errorData = {
        timestamp: new Date().toISOString(),
        level,
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        errorId: this.state.errorId
      };

      // Send to Grafana/logging service
      await fetch('https://grafana.sxc.codes/api/v1/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.VITE_GRAFANA_API_KEY || ''}`
        },
        body: JSON.stringify(errorData)
      }).catch(console.error);

      // Also send to console for development
      if (process.env.NODE_ENV === 'development') {
        console.group(`🚨 Error Boundary [${level}]`);
        console.error('Error:', error);
        console.error('Error Info:', errorInfo);
        console.error('Error ID:', this.state.errorId);
        console.groupEnd();
      }
    } catch (monitoringError) {
      console.error('Failed to log error to monitoring:', monitoringError);
    }
  };

  private handleRetry = () => {
    trackUserInteraction('error_boundary_retry');
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    });
  };

  private handleGoHome = () => {
    trackUserInteraction('error_boundary_go_home');
    window.location.href = '/';
  };

  private handleReportError = () => {
    trackUserInteraction('error_boundary_report_error');
    const { error, errorInfo, errorId } = this.state;
    const errorReport = {
      errorId,
      message: error?.message,
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
      url: window.location.href,
      timestamp: new Date().toISOString()
    };
    
    // Copy error report to clipboard
    navigator.clipboard.writeText(JSON.stringify(errorReport, null, 2))
      .then(() => alert('Error report copied to clipboard'))
      .catch(() => console.error('Failed to copy error report'));
  };

  render() {
    const { hasError, error, errorId } = this.state;
    const { children, fallback, level = 'component' } = this.props;

    if (hasError) {
      // Custom fallback UI if provided
      if (fallback) {
        return fallback;
      }

      // Default error UI based on level
      return (
        <div className="flex items-center justify-center min-h-[400px] p-4">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle className="text-xl">
                {level === 'app' ? 'Application Error' : 
                 level === 'page' ? 'Page Error' : 
                 'Something went wrong'}
              </CardTitle>
              <CardDescription>
                {level === 'app' 
                  ? 'The application encountered an unexpected error and needs to recover.'
                  : level === 'page'
                  ? 'This page encountered an error. You can try refreshing or return to the home page.'
                  : 'This component encountered an error but the rest of the application should continue to work.'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {process.env.NODE_ENV === 'development' && error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm font-medium text-red-800 mb-1">Error Details:</p>
                  <p className="text-xs text-red-700 font-mono break-all">{error.message}</p>
                  <p className="text-xs text-gray-500 mt-1">Error ID: {errorId}</p>
                </div>
              )}
              
              <div className="flex flex-col gap-2">
                <Button 
                  onClick={this.handleRetry}
                  className="w-full"
                  variant="default"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                
                {level !== 'app' && (
                  <Button 
                    onClick={this.handleGoHome}
                    variant="outline"
                    className="w-full"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Go to Homepage
                  </Button>
                )}
                
                <Button 
                  onClick={this.handleReportError}
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs"
                >
                  Report this error
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
