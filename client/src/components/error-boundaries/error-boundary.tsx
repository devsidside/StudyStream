import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
  level?: 'page' | 'component' | 'critical';
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log error for monitoring
    console.error('Error Boundary caught an error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      level: this.props.level || 'component'
    });

    // Here you could also send to error monitoring service
    // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleGoHome = (): void => {
    window.location.href = '/';
  };

  render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    // If custom fallback is provided, use it
    if (this.props.fallback) {
      return this.props.fallback;
    }

    // Default error UI based on error level
    const { level = 'component', showDetails = false } = this.props;
    const { error, errorInfo } = this.state;

    if (level === 'critical') {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Card className="w-full max-w-md border-destructive">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
              <CardTitle className="text-destructive" data-testid="error-title">Critical Error</CardTitle>
              <CardDescription>
                Something went seriously wrong. The application needs to be reloaded.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {showDetails && error && (
                <div className="bg-muted p-3 rounded-md text-sm font-mono">
                  <p className="text-destructive font-semibold mb-2">Error Details:</p>
                  <p className="break-words" data-testid="error-message">{error.message}</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button 
                onClick={this.handleRetry} 
                className="w-full" 
                data-testid="button-retry"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()} 
                className="w-full"
                data-testid="button-reload"
              >
                Reload Application
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    if (level === 'page') {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
          <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="w-10 h-10 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold mb-4" data-testid="error-title">Oops! Something went wrong</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            We're sorry, but there was an error loading this page. Please try again or go back to the home page.
          </p>
          {showDetails && error && (
            <div className="bg-muted p-4 rounded-lg text-sm font-mono mb-6 max-w-lg w-full">
              <p className="font-semibold mb-2">Error Details:</p>
              <p className="break-words text-destructive" data-testid="error-message">{error.message}</p>
            </div>
          )}
          <div className="flex gap-4">
            <Button onClick={this.handleRetry} data-testid="button-retry">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button variant="outline" onClick={this.handleGoHome} data-testid="button-home">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>
        </div>
      );
    }

    // Component level error boundary
    return (
      <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-destructive/30 rounded-lg bg-destructive/5">
        <AlertTriangle className="w-8 h-8 text-destructive mb-3" />
        <h3 className="font-semibold text-destructive mb-2" data-testid="error-title">Component Error</h3>
        <p className="text-sm text-muted-foreground text-center mb-4">
          This component failed to load. You can try to reload it.
        </p>
        {showDetails && error && (
          <div className="bg-muted p-2 rounded text-xs font-mono mb-3 max-w-full overflow-x-auto">
            <span className="text-destructive" data-testid="error-message">{error.message}</span>
          </div>
        )}
        <Button size="sm" onClick={this.handleRetry} data-testid="button-retry">
          <RefreshCw className="w-3 h-3 mr-2" />
          Retry
        </Button>
      </div>
    );
  }
}

// Hook for functional component error handling
export function useErrorHandler() {
  return (error: Error, errorInfo?: any) => {
    console.error('Manual error report:', {
      error: error.message,
      stack: error.stack,
      info: errorInfo,
    });
    
    // You can integrate with error reporting service here
    // Example: Sentry.captureException(error, { extra: errorInfo });
  };
}