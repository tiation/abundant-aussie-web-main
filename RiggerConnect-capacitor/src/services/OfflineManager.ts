import { Storage } from '@capacitor/storage';
import { Network } from '@capacitor/network';
import { supabase } from './supabase';

interface QueuedRequest {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  table: string;
  data: any;
  timestamp: number;
}

interface CachedData {
  key: string;
  data: any;
  timestamp: number;
  expiry?: number;
}

export class OfflineManager {
  private static instance: OfflineManager;
  private syncQueue: QueuedRequest[] = [];
  private isInitialized = false;

  static getInstance(): OfflineManager {
    if (!OfflineManager.instance) {
      OfflineManager.instance = new OfflineManager();
    }
    return OfflineManager.instance;
  }

  static async initialize(): Promise<void> {
    const manager = OfflineManager.getInstance();
    if (manager.isInitialized) return;

    try {
      // Load existing sync queue from storage
      const queueData = await Storage.get({ key: 'sync_queue' });
      if (queueData.value) {
        manager.syncQueue = JSON.parse(queueData.value);
      }

      manager.isInitialized = true;
      console.log('OfflineManager initialized');
    } catch (error) {
      console.error('Failed to initialize OfflineManager:', error);
    }
  }

  /**
   * Cache data locally with optional expiry
   */
  static async cacheData(key: string, data: any, expiryMinutes?: number): Promise<void> {
    try {
      const cachedData: CachedData = {
        key,
        data,
        timestamp: Date.now(),
        expiry: expiryMinutes ? Date.now() + (expiryMinutes * 60 * 1000) : undefined
      };

      await Storage.set({
        key: `cache_${key}`,
        value: JSON.stringify(cachedData)
      });
    } catch (error) {
      console.error('Failed to cache data:', error);
    }
  }

  /**
   * Retrieve cached data
   */
  static async getCachedData(key: string): Promise<any | null> {
    try {
      const result = await Storage.get({ key: `cache_${key}` });
      if (!result.value) return null;

      const cachedData: CachedData = JSON.parse(result.value);
      
      // Check if data has expired
      if (cachedData.expiry && Date.now() > cachedData.expiry) {
        await Storage.remove({ key: `cache_${key}` });
        return null;
      }

      return cachedData.data;
    } catch (error) {
      console.error('Failed to retrieve cached data:', error);
      return null;
    }
  }

  /**
   * Queue a request for later synchronization
   */
  static async queueRequest(type: QueuedRequest['type'], table: string, data: any): Promise<void> {
    const manager = OfflineManager.getInstance();
    
    const request: QueuedRequest = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      table,
      data,
      timestamp: Date.now()
    };

    manager.syncQueue.push(request);
    
    // Save updated queue to storage
    await Storage.set({
      key: 'sync_queue',
      value: JSON.stringify(manager.syncQueue)
    });

    console.log(`Queued ${type} request for ${table}:`, request.id);
  }

  /**
   * Sync all pending requests when network is available
   */
  static async syncPendingData(): Promise<void> {
    const manager = OfflineManager.getInstance();
    const networkStatus = await Network.getStatus();
    
    if (!networkStatus.connected || manager.syncQueue.length === 0) {
      return;
    }

    console.log(`Syncing ${manager.syncQueue.length} pending requests`);

    const failedRequests: QueuedRequest[] = [];

    for (const request of manager.syncQueue) {
      try {
        await OfflineManager.executeRequest(request);
        console.log(`Successfully synced request: ${request.id}`);
      } catch (error) {
        console.error(`Failed to sync request ${request.id}:`, error);
        failedRequests.push(request);
      }
    }

    // Update queue with only failed requests
    manager.syncQueue = failedRequests;
    await Storage.set({
      key: 'sync_queue',
      value: JSON.stringify(manager.syncQueue)
    });

    console.log(`Sync completed. ${failedRequests.length} requests remain in queue`);
  }

  /**
   * Execute a queued request
   */
  private static async executeRequest(request: QueuedRequest): Promise<void> {
    const { type, table, data } = request;

    switch (type) {
      case 'CREATE':
        await supabase.from(table).insert(data);
        break;
      case 'UPDATE':
        await supabase.from(table).update(data).eq('id', data.id);
        break;
      case 'DELETE':
        await supabase.from(table).delete().eq('id', data.id);
        break;
      default:
        throw new Error(`Unknown request type: ${type}`);
    }
  }

  /**
   * Smart data fetching - try network first, fallback to cache
   */
  static async fetchWithCache(
    key: string,
    networkFetch: () => Promise<any>,
    cacheExpiryMinutes: number = 30
  ): Promise<any> {
    try {
      const networkStatus = await Network.getStatus();
      
      if (networkStatus.connected) {
        // Try network first
        const data = await networkFetch();
        await OfflineManager.cacheData(key, data, cacheExpiryMinutes);
        return data;
      } else {
        // Fallback to cache
        const cachedData = await OfflineManager.getCachedData(key);
        if (cachedData) {
          console.log(`Using cached data for: ${key}`);
          return cachedData;
        }
        throw new Error('No network connection and no cached data available');
      }
    } catch (error) {
      // If network fails, try cache as fallback
      const cachedData = await OfflineManager.getCachedData(key);
      if (cachedData) {
        console.log(`Network failed, using cached data for: ${key}`);
        return cachedData;
      }
      throw error;
    }
  }

  /**
   * Clear all cached data
   */
  static async clearCache(): Promise<void> {
    try {
      const keys = await Storage.keys();
      const cacheKeys = keys.keys.filter(key => key.startsWith('cache_'));
      
      for (const key of cacheKeys) {
        await Storage.remove({ key });
      }
      
      console.log(`Cleared ${cacheKeys.length} cached items`);
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }

  /**
   * Get sync queue status
   */
  static async getSyncStatus(): Promise<{ pendingRequests: number; lastSync: number | null }> {
    const manager = OfflineManager.getInstance();
    const lastSyncData = await Storage.get({ key: 'last_sync' });
    
    return {
      pendingRequests: manager.syncQueue.length,
      lastSync: lastSyncData.value ? parseInt(lastSyncData.value) : null
    };
  }
}

export default OfflineManager;
