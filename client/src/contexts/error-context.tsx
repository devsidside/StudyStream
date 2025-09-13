import { createContext, useContext, useCallback, ReactNode, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ErrorInfo {
  id: string;
  message: string;
  type: 'error' | 'warning' | 'info';
  timestamp: Date;
  source?: 'api' | 'client' | 'network';
  status?: number;
  details?: any;
}

interface ErrorContextType {
  errors: ErrorInfo[];
  reportError: (error: Error | string, options?: {
    type?: ErrorInfo['type'];
    source?: ErrorInfo['source'];
    status?: number;
    details?: any;
    showToast?: boolean;
  }) => string;
  dismissError: (id: string) => void;
  clearAllErrors: () => void;
  getErrorsBySource: (source: ErrorInfo['source']) => ErrorInfo[];
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export function ErrorProvider({ children }: { children: ReactNode }) {
  const [errors, setErrors] = useState<ErrorInfo[]>([]);
  const { toast } = useToast();

  const reportError = useCallback((
    error: Error | string,
    options: {
      type?: ErrorInfo['type'];
      source?: ErrorInfo['source'];
      status?: number;
      details?: any;
      showToast?: boolean;
    } = {}
  ): string => {
    const {
      type = 'error',
      source = 'client',
      status,
      details,
      showToast = true
    } = options;

    const errorMessage = typeof error === 'string' ? error : error.message;
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const errorInfo: ErrorInfo = {
      id: errorId,
      message: errorMessage,
      type,
      timestamp: new Date(),
      source,
      status,
      details: details || (typeof error === 'object' ? {
        name: error.name,
        stack: error.stack,
      } : undefined),
    };

    setErrors(prev => [...prev, errorInfo]);

    // Show toast notification if enabled
    if (showToast) {
      const toastVariant = type === 'error' ? 'destructive' : 'default';
      const toastTitle = type === 'error' ? 'Error' : 
                       type === 'warning' ? 'Warning' : 'Info';
      
      toast({
        title: toastTitle,
        description: errorMessage,
        variant: toastVariant,
      });
    }

    // Log to console for development
    if (import.meta.env.MODE === 'development') {
      const logMethod = type === 'error' ? console.error : 
                       type === 'warning' ? console.warn : console.info;
      logMethod('Error reported:', errorInfo);
    }

    return errorId;
  }, [toast]);

  const dismissError = useCallback((id: string) => {
    setErrors(prev => prev.filter(error => error.id !== id));
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const getErrorsBySource = useCallback((source: ErrorInfo['source']) => {
    return errors.filter(error => error.source === source);
  }, [errors]);

  // Auto-cleanup old errors (keep only last 50)
  useEffect(() => {
    const cleanup = () => {
      setErrors(prev => prev.slice(-50));
    };
    
    const interval = setInterval(cleanup, 60000); // Every minute
    return () => clearInterval(interval);
  }, []);

  const contextValue: ErrorContextType = {
    errors,
    reportError,
    dismissError,
    clearAllErrors,
    getErrorsBySource,
  };

  return (
    <ErrorContext.Provider value={contextValue}>
      {children}
    </ErrorContext.Provider>
  );
}

export function useErrorReporting() {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useErrorReporting must be used within an ErrorProvider');
  }
  return context;
}

// Hook for easy error reporting in components
export function useReportError() {
  const { reportError } = useErrorReporting();
  
  return useCallback((
    error: Error | string,
    options?: Parameters<typeof reportError>[1]
  ) => {
    return reportError(error, options);
  }, [reportError]);
}