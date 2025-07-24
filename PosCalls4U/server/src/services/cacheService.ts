import { createClient, RedisClientType } from 'redis';
import winston from 'winston';

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

class CacheService {
  private client: RedisClientType;
  private isConnected: boolean = false;

  constructor() {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    
    this.client = createClient({
      url: redisUrl,
      retry_unfulfilled_commands: true,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 3) {
            logger.error('Max Redis reconnection attempts reached');
            return false;
          }
          return Math.min(retries * 50, 500);
        }
      }
    });

    this.setupEventHandlers();
    this.connect();
  }

  private setupEventHandlers(): void {
    this.client.on('connect', () => {
      logger.info('Redis client connected');
      this.isConnected = true;
    });

    this.client.on('error', (error) => {
      logger.error('Redis client error:', error);
      this.isConnected = false;
    });

    this.client.on('end', () => {
      logger.info('Redis client disconnected');
      this.isConnected = false;
    });

    this.client.on('reconnecting', () => {
      logger.info('Redis client reconnecting...');
    });
  }

  private async connect(): Promise<void> {
    try {
      await this.client.connect();
    } catch (error) {
      logger.error('Failed to connect to Redis:', error);
    }
  }

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    if (!this.isConnected) return null;

    try {
      const value = await this.client.get(key);
      if (!value) return null;
      
      return JSON.parse(value) as T;
    } catch (error) {
      logger.error(`Error getting cache key ${key}:`, error);
      return null;
    }
  }

  /**
   * Set value in cache with optional TTL (in seconds)
   */
  async set(key: string, value: any, ttl?: number): Promise<boolean> {
    if (!this.isConnected) return false;

    try {
      const serializedValue = JSON.stringify(value);
      
      if (ttl) {
        await this.client.setEx(key, ttl, serializedValue);
      } else {
        await this.client.set(key, serializedValue);
      }
      
      return true;
    } catch (error) {
      logger.error(`Error setting cache key ${key}:`, error);
      return false;
    }
  }

  /**
   * Delete key from cache
   */
  async del(key: string): Promise<boolean> {
    if (!this.isConnected) return false;

    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      logger.error(`Error deleting cache key ${key}:`, error);
      return false;
    }
  }

  /**
   * Delete keys matching pattern
   */
  async delPattern(pattern: string): Promise<boolean> {
    if (!this.isConnected) return false;

    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(keys);
      }
      return true;
    } catch (error) {
      logger.error(`Error deleting cache pattern ${pattern}:`, error);
      return false;
    }
  }

  /**
   * Check if key exists in cache
   */
  async exists(key: string): Promise<boolean> {
    if (!this.isConnected) return false;

    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      logger.error(`Error checking cache key ${key}:`, error);
      return false;
    }
  }

  /**
   * Set expiration for existing key
   */
  async expire(key: string, ttl: number): Promise<boolean> {
    if (!this.isConnected) return false;

    try {
      await this.client.expire(key, ttl);
      return true;
    } catch (error) {
      logger.error(`Error setting expiration for cache key ${key}:`, error);
      return false;
    }
  }

  /**
   * Get multiple keys at once
   */
  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    if (!this.isConnected || keys.length === 0) return [];

    try {
      const values = await this.client.mGet(keys);
      return values.map(value => {
        if (!value) return null;
        try {
          return JSON.parse(value) as T;
        } catch {
          return null;
        }
      });
    } catch (error) {
      logger.error(`Error getting multiple cache keys:`, error);
      return keys.map(() => null);
    }
  }

  /**
   * Set multiple key-value pairs
   */
  async mset(keyValuePairs: Record<string, any>): Promise<boolean> {
    if (!this.isConnected) return false;

    try {
      const serializedPairs: string[] = [];
      
      Object.entries(keyValuePairs).forEach(([key, value]) => {
        serializedPairs.push(key, JSON.stringify(value));
      });
      
      await this.client.mSet(serializedPairs);
      return true;
    } catch (error) {
      logger.error(`Error setting multiple cache keys:`, error);
      return false;
    }
  }

  /**
   * Increment numeric value
   */
  async incr(key: string): Promise<number | null> {
    if (!this.isConnected) return null;

    try {
      return await this.client.incr(key);
    } catch (error) {
      logger.error(`Error incrementing cache key ${key}:`, error);
      return null;
    }
  }

  /**
   * Get remaining TTL for key
   */
  async ttl(key: string): Promise<number | null> {
    if (!this.isConnected) return null;

    try {
      return await this.client.ttl(key);
    } catch (error) {
      logger.error(`Error getting TTL for cache key ${key}:`, error);
      return null;
    }
  }

  /**
   * Flush all cache data (use with caution)
   */
  async flushAll(): Promise<boolean> {
    if (!this.isConnected) return false;

    try {
      await this.client.flushAll();
      return true;
    } catch (error) {
      logger.error('Error flushing cache:', error);
      return false;
    }
  }

  /**
   * Close Redis connection
   */
  async disconnect(): Promise<void> {
    try {
      await this.client.disconnect();
      this.isConnected = false;
      logger.info('Redis client disconnected gracefully');
    } catch (error) {
      logger.error('Error disconnecting Redis client:', error);
    }
  }

  /**
   * Get connection status
   */
  isReady(): boolean {
    return this.isConnected;
  }
}

// Create singleton instance
export const cacheService = new CacheService();

// Cache key generators for consistent naming
export const CacheKeys = {
  // DVP Statistics
  DVP_STATS: (userId: string, timeRange: string) => `dvp:stats:${userId}:${timeRange}`,
  DVP_DAILY_STATS: (userId: string, date: string) => `dvp:daily:${userId}:${date}`,
  DVP_MONTHLY_STATS: (userId: string, month: string) => `dvp:monthly:${userId}:${month}`,
  
  // Fixture Data
  FIXTURES_LIST: (league: string, season: string) => `fixtures:${league}:${season}`,
  FIXTURE_DETAILS: (fixtureId: string) => `fixture:${fixtureId}`,
  FIXTURE_ODDS: (fixtureId: string) => `fixture:odds:${fixtureId}`,
  
  // User Data
  USER_PROFILE: (userId: string) => `user:profile:${userId}`,
  USER_PERMISSIONS: (userId: string) => `user:permissions:${userId}`,
  USER_SESSIONS: (userId: string) => `user:sessions:${userId}`,
  
  // Team Data
  TEAM_MEMBERS: (teamId: string) => `team:members:${teamId}`,
  TEAM_STATS: (teamId: string, period: string) => `team:stats:${teamId}:${period}`,
  
  // Call Data
  CALL_STATS: (userId: string, date: string) => `calls:stats:${userId}:${date}`,
  ACTIVE_CALLS: (userId: string) => `calls:active:${userId}`,
  
  // System Data
  SYSTEM_CONFIG: 'system:config',
  API_RATE_LIMIT: (ip: string) => `rate_limit:${ip}`,
  
  // Analytics
  ANALYTICS_DASHBOARD: (userId: string, timeframe: string) => `analytics:dashboard:${userId}:${timeframe}`,
  PERFORMANCE_METRICS: (period: string) => `performance:metrics:${period}`,
};

// Cache TTL constants (in seconds)
export const CacheTTL = {
  VERY_SHORT: 60,        // 1 minute
  SHORT: 300,            // 5 minutes
  MEDIUM: 900,           // 15 minutes
  LONG: 3600,            // 1 hour
  VERY_LONG: 21600,      // 6 hours
  DAILY: 86400,          // 24 hours
  WEEKLY: 604800,        // 7 days
};
