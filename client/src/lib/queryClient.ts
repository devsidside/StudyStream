import { QueryClient, QueryFunction, QueryCache, MutationCache } from "@tanstack/react-query";

interface APIError extends Error {
  status: number;
  code?: string;
  details?: any;
}

async function throwIfResNotOk(res: Response): Promise<void> {
  if (!res.ok) {
    let errorMessage = res.statusText;
    let errorDetails: any = undefined;
    
    try {
      const responseText = await res.text();
      if (responseText) {
        try {
          const jsonError = JSON.parse(responseText);
          errorMessage = jsonError.message || jsonError.error || responseText;
          errorDetails = jsonError;
        } catch {
          errorMessage = responseText;
        }
      }
    } catch {
      // Use default statusText if response reading fails
    }
    
    const apiError = new Error(`${res.status}: ${errorMessage}`) as APIError;
    apiError.status = res.status;
    apiError.details = errorDetails;
    
    throw apiError;
  }
}

function shouldRetry(failureCount: number, error: any): boolean {
  // Don't retry on client errors (4xx) except for 408 (timeout) and 429 (rate limit)
  if (error?.status >= 400 && error?.status < 500 && ![408, 429].includes(error?.status)) {
    return false;
  }
  
  // Retry up to 3 times for server errors and network errors
  return failureCount < 3;
}

function getRetryDelay(attemptIndex: number): number {
  // Exponential backoff with jitter: base delay * (2^attempt) + random jitter
  const baseDelay = 1000; // 1 second
  const exponentialDelay = baseDelay * Math.pow(2, attemptIndex);
  const jitter = Math.random() * 1000; // Up to 1 second jitter
  return Math.min(exponentialDelay + jitter, 30000); // Cap at 30 seconds
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Handle query keys with parameters: [url, params] format
    let url: string;
    if (queryKey.length === 2 && typeof queryKey[1] === 'string' && queryKey[1].startsWith('{')) {
      // If second element is JSON params, construct URL with search params
      const baseUrl = queryKey[0] as string;
      const params = JSON.parse(queryKey[1] as string);
      const searchParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      
      url = searchParams.toString() ? `${baseUrl}?${searchParams}` : baseUrl;
    } else {
      // Default behavior: join all segments with "/"
      url = queryKey.join("/") as string;
    }

    const res = await fetch(url, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

// Create optimized cache instances with error handling
const queryCache = new QueryCache({
  onError: (error, query) => {
    // Log errors for monitoring (replace with your logging service)
    console.error('Query error:', {
      queryKey: query.queryKey,
      error: error.message,
      status: (error as APIError).status
    });
  },
});

const mutationCache = new MutationCache({
  onError: (error, variables, context, mutation) => {
    // Log mutation errors for monitoring
    console.error('Mutation error:', {
      mutationKey: mutation.options.mutationKey,
      error: error.message,
      status: (error as APIError).status
    });
  },
});

export const queryClient = new QueryClient({
  queryCache,
  mutationCache,
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      // Smart caching strategy
      staleTime: 5 * 60 * 1000, // 5 minutes - data is fresh for 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes - cache garbage collection after 30 minutes
      
      // Background refetching
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
      
      // Retry configuration with exponential backoff
      retry: shouldRetry,
      retryDelay: getRetryDelay,
      
      // Network mode - fail fast when offline, retry when back online
      networkMode: 'online',
      
      // Refetch interval for real-time data (disabled by default)
      refetchInterval: false,
      
      // Enable error boundaries for API errors
      throwOnError: (error: any) => {
        // Throw to error boundary for server errors and network errors
        return !error?.status || error.status >= 500;
      },
    },
    mutations: {
      // Retry mutations with exponential backoff
      retry: shouldRetry,
      retryDelay: getRetryDelay,
      
      // Network mode for mutations
      networkMode: 'online',
      
      // Enable error boundaries for critical mutation errors
      throwOnError: (error: any) => {
        // Throw to error boundary for server errors and network errors
        return !error?.status || error.status >= 500;
      },
    },
  },
});

/**
 * Creates a properly formatted query key for TanStack Query.
 * 
 * @param base - The base URL path (e.g., "/api/notes")  
 * @param params - Optional query parameters to be converted to search params
 * @returns Array in format [url] or [url, jsonParams] for use with getQueryFn
 * 
 * @example
 * // Simple query key
 * createQueryKey("/api/notes") // ["/api/notes"]
 * 
 * // Query key with parameters 
 * createQueryKey("/api/notes", { subject: "math", limit: 10 }) 
 * // ["/api/notes", '{"limit":10,"subject":"math"}']
 * // This gets converted to "/api/notes?limit=10&subject=math" by getQueryFn
 */
export function createQueryKey(base: string, params?: Record<string, any>): string[] {
  const key = [base];
  if (params) {
    // Sort keys for consistent cache keys
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((result, key) => {
        if (params[key] !== undefined && params[key] !== null) {
          result[key] = params[key];
        }
        return result;
      }, {} as Record<string, any>);
    
    if (Object.keys(sortedParams).length > 0) {
      key.push(JSON.stringify(sortedParams));
    }
  }
  return key;
}

// Prefetch utilities for better UX
export function prefetchQuery(queryKey: string[], staleTime?: number) {
  return queryClient.prefetchQuery({
    queryKey,
    staleTime: staleTime || 5 * 60 * 1000, // Default 5 minutes
  });
}

// Invalidate related queries utility
export function invalidateQueries(pattern: string) {
  return queryClient.invalidateQueries({
    predicate: (query) => {
      const [baseKey] = query.queryKey;
      return typeof baseKey === 'string' && baseKey.includes(pattern);
    },
  });
}

// Clear all cached data (useful for logout)
export function clearAllCaches() {
  queryClient.clear();
}
