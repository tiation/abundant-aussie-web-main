import { QueryClient, QueryClientConfig } from 'react-query';
import { toast } from 'react-toastify';

// Default stale times for different types of data
export const StaleTime = {
  NEVER: 0,
  VERY_SHORT: 30 * 1000,      // 30 seconds
  SHORT: 2 * 60 * 1000,       // 2 minutes
  MEDIUM: 5 * 60 * 1000,      // 5 minutes
  LONG: 15 * 60 * 1000,       // 15 minutes
  VERY_LONG: 30 * 60 * 1000,  // 30 minutes
  HOUR: 60 * 60 * 1000,       // 1 hour
} as const;

// Cache times for different types of data
export const CacheTime = {
  SHORT: 5 * 60 * 1000,       // 5 minutes
  MEDIUM: 10 * 60 * 1000,     // 10 minutes
  LONG: 30 * 60 * 1000,       // 30 minutes
  VERY_LONG: 60 * 60 * 1000,  // 1 hour
  PERSISTENT: 24 * 60 * 60 * 1000, // 24 hours
} as const;

// Query key factory for consistent key generation
export const QueryKeys = {
  // Authentication
  AUTH: ['auth'] as const,
  CURRENT_USER: ['auth', 'current-user'] as const,
  USER_PERMISSIONS: (userId: string) => ['auth', 'permissions', userId] as const,
  
  // DVP Statistics
  DVP_STATS: ['dvp', 'stats'] as const,
  DVP_DAILY_STATS: (userId: string, date: string) => ['dvp', 'stats', 'daily', userId, date] as const,
  DVP_MONTHLY_STATS: (userId: string, month: string) => ['dvp', 'stats', 'monthly', userId, month] as const,
  DVP_TRENDS: (userId: string, period: string) => ['dvp', 'trends', userId, period] as const,
  
  // Fixtures
  FIXTURES: ['fixtures'] as const,
  FIXTURES_LIST: (league?: string, season?: string) => ['fixtures', 'list', league, season] as const,
  FIXTURE_DETAILS: (fixtureId: string) => ['fixtures', 'details', fixtureId] as const,
  FIXTURE_ODDS: (fixtureId: string) => ['fixtures', 'odds', fixtureId] as const,
  LIVE_FIXTURES: ['fixtures', 'live'] as const,
  
  // Teams
  TEAMS: ['teams'] as const,
  TEAM_DETAILS: (teamId: string) => ['teams', 'details', teamId] as const,
  TEAM_MEMBERS: (teamId: string) => ['teams', 'members', teamId] as const,
  TEAM_STATS: (teamId: string, period: string) => ['teams', 'stats', teamId, period] as const,
  USER_TEAMS: (userId: string) => ['teams', 'user', userId] as const,
  
  // Calls
  CALLS: ['calls'] as const,
  CALL_HISTORY: (userId: string, filters?: Record<string, any>) => ['calls', 'history', userId, filters] as const,
  ACTIVE_CALLS: (userId: string) => ['calls', 'active', userId] as const,
  CALL_STATS: (userId: string, date: string) => ['calls', 'stats', userId, date] as const,
  
  // Analytics
  ANALYTICS: ['analytics'] as const,
  DASHBOARD_DATA: (userId: string, timeframe: string) => ['analytics', 'dashboard', userId, timeframe] as const,
  PERFORMANCE_METRICS: (period: string) => ['analytics', 'performance', period] as const,
  
  // System
  SYSTEM_CONFIG: ['system', 'config'] as const,
  SYSTEM_STATUS: ['system', 'status'] as const,
} as const;

// Error handling function
const handleQueryError = (error: any): void => {
  console.error('Query error:', error);
  
  if (error?.response?.status === 401) {
    toast.error('Session expired. Please log in again.');
    // Redirect to login or trigger auth refresh
    return;
  }
  
  if (error?.response?.status >= 500) {
    toast.error('Server error. Please try again later.');
    return;
  }
  
  if (error?.response?.data?.message) {
    toast.error(error.response.data.message);
    return;
  }
  
  toast.error('An unexpected error occurred.');
};

// React Query client configuration
const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      // Global defaults
      staleTime: StaleTime.SHORT,
      cacheTime: CacheTime.MEDIUM,
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors (client errors)
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,
      onError: handleQueryError,
      
      // Network mode - continue working offline with cached data
      networkMode: 'offlineFirst',
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
      onError: handleQueryError,
      networkMode: 'online',
    },
  },
};

// Create the query client
export const queryClient = new QueryClient(queryClientConfig);

// Utility functions for common query patterns
export const QueryUtils = {
  /**
   * Invalidate queries by pattern
   */
  invalidateQueries: (queryKey: readonly any[]) => {
    return queryClient.invalidateQueries(queryKey);
  },

  /**
   * Remove queries by pattern
   */
  removeQueries: (queryKey: readonly any[]) => {
    return queryClient.removeQueries(queryKey);
  },

  /**
   * Set query data
   */
  setQueryData: <T>(queryKey: readonly any[], data: T) => {
    return queryClient.setQueryData(queryKey, data);
  },

  /**
   * Get cached query data
   */
  getQueryData: <T>(queryKey: readonly any[]): T | undefined => {
    return queryClient.getQueryData<T>(queryKey);
  },

  /**
   * Prefetch query data
   */
  prefetchQuery: (queryKey: readonly any[], queryFn: () => Promise<any>, options?: any) => {
    return queryClient.prefetchQuery(queryKey, queryFn, {
      staleTime: StaleTime.MEDIUM,
      cacheTime: CacheTime.LONG,
      ...options,
    });
  },

  /**
   * Optimistic update helper
   */
  optimisticUpdate: <T>(
    queryKey: readonly any[],
    updateFn: (oldData: T | undefined) => T,
    rollbackFn?: (oldData: T | undefined) => T
  ) => {
    const previousData = queryClient.getQueryData<T>(queryKey);
    
    // Optimistically update
    queryClient.setQueryData<T>(queryKey, updateFn(previousData));
    
    return {
      rollback: () => {
        if (rollbackFn) {
          queryClient.setQueryData<T>(queryKey, rollbackFn(previousData));
        } else {
          queryClient.setQueryData<T>(queryKey, previousData);
        }
      },
      previousData,
    };
  },

  /**
   * Clear all cached data
   */
  clear: () => {
    queryClient.clear();
  },

  /**
   * Get cache stats
   */
  getCacheStats: () => {
    const cache = queryClient.getQueryCache();
    const queries = cache.getAll();
    
    const stats = {
      totalQueries: queries.length,
      staleQueries: queries.filter(q => q.isStale()).length,
      freshQueries: queries.filter(q => !q.isStale()).length,
      errorQueries: queries.filter(q => q.state.status === 'error').length,
      loadingQueries: queries.filter(q => q.state.status === 'loading').length,
      successQueries: queries.filter(q => q.state.status === 'success').length,
    };
    
    return stats;
  },
};

// Cache persistence setup (for offline support)
export const setupCachePersistence = () => {
  // Save cache to localStorage on app close
  window.addEventListener('beforeunload', () => {
    const cache = queryClient.getQueryCache();
    const persistableQueries = cache.getAll().filter(query => {
      // Only persist successful, non-sensitive queries
      return (
        query.state.status === 'success' &&
        !query.queryKey.includes('auth') &&
        !query.queryKey.includes('session')
      );
    });

    const cacheData = persistableQueries.map(query => ({
      queryKey: query.queryKey,
      data: query.state.data,
      dataUpdatedAt: query.state.dataUpdatedAt,
    }));

    try {
      localStorage.setItem('react-query-cache', JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to persist query cache:', error);
    }
  });

  // Restore cache on app start
  try {
    const cachedData = localStorage.getItem('react-query-cache');
    if (cachedData) {
      const parsedCache = JSON.parse(cachedData);
      const now = Date.now();
      
      parsedCache.forEach(({ queryKey, data, dataUpdatedAt }: any) => {
        // Only restore data that's less than 1 hour old
        if (now - dataUpdatedAt < CacheTime.VERY_LONG) {
          queryClient.setQueryData(queryKey, data);
        }
      });
    }
  } catch (error) {
    console.warn('Failed to restore query cache:', error);
    localStorage.removeItem('react-query-cache');
  }
};

// Cache debugging utilities (development only)
export const CacheDebug = {
  logAllQueries: () => {
    if (process.env.NODE_ENV === 'development') {
      const cache = queryClient.getQueryCache();
      console.table(
        cache.getAll().map(query => ({
          key: JSON.stringify(query.queryKey),
          status: query.state.status,
          dataUpdatedAt: new Date(query.state.dataUpdatedAt).toLocaleString(),
          stale: query.isStale(),
          error: query.state.error?.message || null,
        }))
      );
    }
  },

  logQueryDetails: (queryKey: readonly any[]) => {
    if (process.env.NODE_ENV === 'development') {
      const query = queryClient.getQueryCache().find({ queryKey });
      console.log('Query Details:', {
        key: queryKey,
        data: query?.state.data,
        status: query?.state.status,
        error: query?.state.error,
        dataUpdatedAt: query?.state.dataUpdatedAt,
        observers: query?.getObserversCount(),
      });
    }
  },
};
