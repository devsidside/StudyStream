import { ErrorBoundary } from './error-boundary';
import { useToast } from '@/hooks/use-toast';
import { useEffect, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { queryClient } from '@/services/api';

interface QueryErrorBoundaryProps {
  children: ReactNode;
  queryKeys?: string[];
  resetKeys?: string[];
  fallbackComponent?: ReactNode;
}

interface APIError extends Error {
  status?: number;
  details?: any;
}

function QueryErrorFallback({ 
  error, 
  resetErrorBoundary, 
  queryKeys = [] 
}: { 
  error: APIError; 
  resetErrorBoundary: () => void;
  queryKeys?: string[];
}) {
  const { toast } = useToast();

  const handleRetry = async () => {
    // Invalidate specific query keys if provided
    if (queryKeys.length > 0) {
      await Promise.all(
        queryKeys.map(key => 
          queryClient.invalidateQueries({ queryKey: [key] })
        )
      );
    }
    resetErrorBoundary();
  };

  const handleRefreshAll = async () => {
    await queryClient.invalidateQueries();
    resetErrorBoundary();
  };

  // Show toast notification for API errors
  useEffect(() => {
    const isNetworkError = !error.status;
    const isServerError = error.status && error.status >= 500;
    
    if (isNetworkError || isServerError) {
      toast({
        title: "Connection Error",
        description: isNetworkError 
          ? "Please check your internet connection" 
          : "Server error occurred. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const getErrorMessage = () => {
    if (!error.status) {
      return "Network connection failed. Please check your internet connection.";
    }
    
    switch (error.status) {
      case 401:
        return "You need to sign in to access this content.";
      case 403:
        return "You don't have permission to access this content.";
      case 404:
        return "The requested content was not found.";
      case 429:
        return "Too many requests. Please wait a moment and try again.";
      case 500:
      case 502:
      case 503:
        return "Server is currently unavailable. Please try again later.";
      default:
        return error.message || "An unexpected error occurred.";
    }
  };

  const getErrorIcon = () => {
    if (!error.status || error.status >= 500) {
      return <AlertCircle className="w-8 h-8 text-destructive" />;
    }
    return <AlertCircle className="w-8 h-8 text-warning" />;
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 bg-card border border-border rounded-lg">
      <div className="flex flex-col items-center space-y-3">
        {getErrorIcon()}
        <h3 className="text-lg font-semibold" data-testid="query-error-title">
          {error.status ? `Error ${error.status}` : 'Connection Error'}
        </h3>
        <p className="text-muted-foreground text-center max-w-md" data-testid="query-error-message">
          {getErrorMessage()}
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={handleRetry} variant="default" data-testid="button-retry-query">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
        {queryKeys.length > 0 && (
          <Button onClick={handleRefreshAll} variant="outline" data-testid="button-refresh-all">
            Refresh All Data
          </Button>
        )}
      </div>
      
      {import.meta.env.MODE === 'development' && error.details && (
        <details className="mt-4 w-full">
          <summary className="cursor-pointer text-sm text-muted-foreground">
            Error Details (Development)
          </summary>
          <pre className="mt-2 p-3 bg-muted rounded text-xs overflow-auto max-h-32" data-testid="error-details">
            {JSON.stringify(error.details, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}

export function QueryErrorBoundary({ 
  children, 
  queryKeys = [], 
  resetKeys = [],
  fallbackComponent 
}: QueryErrorBoundaryProps) {
  return (
    <ErrorBoundary
      level="component"
      onError={(error, errorInfo) => {
        // Enhanced logging for query errors
        console.error('Query Error Boundary:', {
          error: error.message,
          status: (error as APIError).status,
          queryKeys,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
        });
      }}
      fallback={fallbackComponent || (
        <QueryErrorFallback 
          error={new Error('Query failed') as APIError} 
          resetErrorBoundary={() => {}} 
          queryKeys={queryKeys}
        />
      )}
    >
      {children}
    </ErrorBoundary>
  );
}