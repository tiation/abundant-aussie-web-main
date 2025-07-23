import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="text-center max-w-md mx-auto">
            <div className="mb-6">
              <AlertTriangle className="w-16 h-16 text-warning mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Oops! Something went wrong
              </h1>
              <p className="text-muted-foreground mb-6">
                We're sorry for the inconvenience. Please try refreshing the page or contact support if the problem persists.
              </p>
            </div>
            
            <div className="space-y-4">
              <Button onClick={this.handleRefresh} className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Page
              </Button>
              
              <div className="text-sm text-muted-foreground">
                <p>If you continue to experience issues:</p>
                <a 
                  href="mailto:support@riggerhub.com.au" 
                  className="text-primary hover:underline"
                >
                  support@riggerhub.com.au
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;