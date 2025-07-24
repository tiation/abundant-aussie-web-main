import { Request, Response, NextFunction } from 'express';
import { cacheService, CacheKeys, CacheTTL } from '../services/cacheService';
import crypto from 'crypto';

interface CacheOptions {
  ttl?: number;
  keyGenerator?: (req: Request) => string;
  skipCache?: (req: Request, res: Response) => boolean;
  onlySuccess?: boolean;
}

/**
 * Generate cache key from request URL and query parameters
 */
const generateCacheKey = (req: Request, prefix: string = 'api'): string => {
  const url = req.originalUrl || req.url;
  const method = req.method;
  const userId = req.user?.id || 'anonymous';
  
  // Include relevant headers that might affect response
  const relevantHeaders = {
    'user-agent': req.get('User-Agent'),
    'accept-language': req.get('Accept-Language'),
  };
  
  const keyData = {
    method,
    url,
    userId,
    headers: relevantHeaders,
  };
  
  const hash = crypto
    .createHash('md5')
    .update(JSON.stringify(keyData))
    .digest('hex');
    
  return `${prefix}:${hash}`;
};

/**
 * Cache middleware factory
 */
export const cache = (options: CacheOptions = {}) => {
  const {
    ttl = CacheTTL.MEDIUM,
    keyGenerator,
    skipCache,
    onlySuccess = true
  } = options;

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Skip caching for non-GET requests by default
    if (req.method !== 'GET') {
      return next();
    }

    // Check if we should skip caching
    if (skipCache && skipCache(req, res)) {
      return next();
    }

    // Generate cache key
    const cacheKey = keyGenerator ? keyGenerator(req) : generateCacheKey(req);

    try {
      // Try to get cached response
      const cachedResponse = await cacheService.get<{
        data: any;
        statusCode: number;
        headers: Record<string, string>;
        timestamp: number;
      }>(cacheKey);

      if (cachedResponse) {
        // Set cached headers
        Object.entries(cachedResponse.headers).forEach(([key, value]) => {
          res.set(key, value);
        });

        // Add cache headers
        res.set('X-Cache', 'HIT');
        res.set('X-Cache-Time', new Date(cachedResponse.timestamp).toISOString());

        return res.status(cachedResponse.statusCode).json(cachedResponse.data);
      }

      // Cache miss - continue to route handler
      res.set('X-Cache', 'MISS');

      // Override res.json to cache the response
      const originalJson = res.json.bind(res);
      res.json = function(data: any) {
        // Only cache successful responses if onlySuccess is true
        if (!onlySuccess || (res.statusCode >= 200 && res.statusCode < 300)) {
          const responseToCache = {
            data,
            statusCode: res.statusCode,
            headers: {
              'content-type': res.get('Content-Type') || 'application/json',
            },
            timestamp: Date.now(),
          };

          // Cache asynchronously to avoid blocking the response
          setImmediate(async () => {
            await cacheService.set(cacheKey, responseToCache, ttl);
          });
        }

        return originalJson(data);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

/**
 * Cache invalidation middleware
 */
export const invalidateCache = (patterns: string[] | ((req: Request) => string[])) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const patternsToInvalidate = typeof patterns === 'function' 
        ? patterns(req) 
        : patterns;

      // Override res.json to invalidate cache after successful response
      const originalJson = res.json.bind(res);
      res.json = function(data: any) {
        // Only invalidate cache for successful responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // Invalidate cache asynchronously
          setImmediate(async () => {
            for (const pattern of patternsToInvalidate) {
              await cacheService.delPattern(pattern);
            }
          });
        }

        return originalJson(data);
      };

      next();
    } catch (error) {
      console.error('Cache invalidation middleware error:', error);
      next();
    }
  };
};

/**
 * Pre-configured cache middleware for different use cases
 */
export const cacheMiddleware = {
  /**
   * Short-term cache for frequently changing data
   */
  short: cache({ ttl: CacheTTL.SHORT }),

  /**
   * Medium-term cache for moderately changing data
   */
  medium: cache({ ttl: CacheTTL.MEDIUM }),

  /**
   * Long-term cache for rarely changing data
   */
  long: cache({ ttl: CacheTTL.LONG }),

  /**
   * Cache for DVP statistics
   */
  dvpStats: cache({
    ttl: CacheTTL.MEDIUM,
    keyGenerator: (req) => {
      const userId = req.user?.id || 'anonymous';
      const timeRange = req.query.timeRange as string || 'daily';
      return CacheKeys.DVP_STATS(userId, timeRange);
    }
  }),

  /**
   * Cache for fixture data
   */
  fixtures: cache({
    ttl: CacheTTL.LONG,
    keyGenerator: (req) => {
      const league = req.params.league || req.query.league as string;
      const season = req.params.season || req.query.season as string;
      return CacheKeys.FIXTURES_LIST(league, season);
    }
  }),

  /**
   * Cache for user profile data
   */
  userProfile: cache({
    ttl: CacheTTL.MEDIUM,
    keyGenerator: (req) => {
      const userId = req.params.userId || req.user?.id || 'anonymous';
      return CacheKeys.USER_PROFILE(userId);
    }
  }),

  /**
   * Cache for team data
   */
  teamData: cache({
    ttl: CacheTTL.MEDIUM,
    keyGenerator: (req) => {
      const teamId = req.params.teamId as string;
      return CacheKeys.TEAM_MEMBERS(teamId);
    }
  }),

  /**
   * Cache for analytics dashboard
   */
  analytics: cache({
    ttl: CacheTTL.SHORT,
    keyGenerator: (req) => {
      const userId = req.user?.id || 'anonymous';
      const timeframe = req.query.timeframe as string || 'daily';
      return CacheKeys.ANALYTICS_DASHBOARD(userId, timeframe);
    }
  }),

  /**
   * Skip cache for authenticated users or specific conditions
   */
  skipAuthenticated: cache({
    ttl: CacheTTL.MEDIUM,
    skipCache: (req) => !!req.user
  }),
};

/**
 * Cache warm-up utility
 */
export class CacheWarmup {
  /**
   * Warm up frequently accessed data
   */
  static async warmupFrequentData(): Promise<void> {
    try {
      // This could be expanded to pre-populate cache with commonly requested data
      console.log('Starting cache warmup...');
      
      // Example: Pre-cache system configuration
      await cacheService.set(CacheKeys.SYSTEM_CONFIG, {
        version: process.env.APP_VERSION || '1.0.0',
        features: ['dvp_stats', 'fixtures', 'analytics'],
        lastUpdated: new Date().toISOString()
      }, CacheTTL.DAILY);

      console.log('Cache warmup completed');
    } catch (error) {
      console.error('Cache warmup failed:', error);
    }
  }

  /**
   * Schedule periodic cache warmup
   */
  static scheduleWarmup(): void {
    // Run warmup every 6 hours
    setInterval(async () => {
      await CacheWarmup.warmupFrequentData();
    }, 6 * 60 * 60 * 1000);
  }
}

/**
 * Cache monitoring and metrics
 */
export class CacheMetrics {
  private static hits = 0;
  private static misses = 0;

  static recordHit(): void {
    this.hits++;
  }

  static recordMiss(): void {
    this.misses++;
  }

  static getStats(): { hits: number; misses: number; hitRate: number } {
    const total = this.hits + this.misses;
    const hitRate = total > 0 ? (this.hits / total) * 100 : 0;
    
    return {
      hits: this.hits,
      misses: this.misses,
      hitRate: parseFloat(hitRate.toFixed(2))
    };
  }

  static reset(): void {
    this.hits = 0;
    this.misses = 0;
  }
}
