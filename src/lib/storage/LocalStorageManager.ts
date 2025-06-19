
export interface StorageItem<T = any> {
  data: T;
  timestamp: number;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export type StorageDataType = 'cards' | 'drafts' | 'settings' | 'uploads' | 'memories' | 'sessions' | 'cache';
export type SyncPriority = 'low' | 'medium' | 'high' | 'critical';

export interface StorageItemMetadata {
  key: string;
  dataType: StorageDataType;
  priority: SyncPriority;
  lastModified: number;
  syncStatus: 'synced' | 'pending' | 'syncing' | 'failed' | 'local-only';
  syncRetries: number;
}

export interface StorageConfig {
  enableSync: boolean;
  testingMode: boolean;
  autoSyncInterval: number;
  maxRetries: number;
}

export interface DebugInfo {
  totalItems: number;
  pendingSync: number;
  syncQueue: number;
  itemsByType: Record<string, number>;
  config: StorageConfig;
}

export class LocalStorageManager {
  private static instance: LocalStorageManager;
  private maxSize = 5 * 1024 * 1024; // 5MB limit for localStorage
  private config: StorageConfig = {
    enableSync: true,
    testingMode: false,
    autoSyncInterval: 30000,
    maxRetries: 3
  };

  private constructor() {
    this.loadConfig();
  }

  public static getInstance(): LocalStorageManager {
    if (!LocalStorageManager.instance) {
      LocalStorageManager.instance = new LocalStorageManager();
    }
    return LocalStorageManager.instance;
  }

  private loadConfig(): void {
    try {
      const stored = localStorage.getItem('storage-config');
      if (stored) {
        this.config = { ...this.config, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.warn('Failed to load storage config:', error);
    }
  }

  private saveConfig(): void {
    try {
      localStorage.setItem('storage-config', JSON.stringify(this.config));
    } catch (error) {
      console.warn('Failed to save storage config:', error);
    }
  }

  public getConfig(): StorageConfig {
    return { ...this.config };
  }

  public updateConfig(updates: Partial<StorageConfig>): void {
    this.config = { ...this.config, ...updates };
    this.saveConfig();
  }

  public setTestingMode(enabled: boolean): void {
    this.updateConfig({ testingMode: enabled });
  }

  public setItem<T>(
    key: string, 
    data: T, 
    category: string = 'general', 
    priority: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ): void {
    try {
      const item: StorageItem<T> = {
        data,
        timestamp: Date.now(),
        category,
        priority
      };

      const serialized = JSON.stringify(item);
      
      // Check if we're approaching storage limits
      if (this.getStorageSize() + serialized.length > this.maxSize) {
        this.cleanup();
      }

      localStorage.setItem(key, serialized);
      
      // Store metadata for sync tracking
      this.setMetadata(key, {
        key,
        dataType: this.inferDataType(key),
        priority,
        lastModified: Date.now(),
        syncStatus: 'pending',
        syncRetries: 0
      });
    } catch (error) {
      console.error('Failed to store item:', error);
      
      // If storage is full, try cleanup and retry once
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        this.cleanup();
        try {
          localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now(), category, priority }));
        } catch (retryError) {
          console.error('Failed to store item after cleanup:', retryError);
        }
      }
    }
  }

  public getItem<T>(key: string): T | null {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return null;

      const item: StorageItem<T> = JSON.parse(stored);
      return item.data;
    } catch (error) {
      console.error('Failed to retrieve item:', error);
      return null;
    }
  }

  public removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
      this.removeMetadata(key);
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  }

  public getAllMetadata(): StorageItemMetadata[] {
    const metadata: StorageItemMetadata[] = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('_meta_')) {
          const metaData = this.getItem<StorageItemMetadata>(key);
          if (metaData) {
            metadata.push(metaData);
          }
        }
      }
    } catch (error) {
      console.error('Failed to retrieve metadata:', error);
    }
    return metadata;
  }

  public getMetadata(key: string): StorageItemMetadata | null {
    return this.getItem<StorageItemMetadata>(`_meta_${key}`);
  }

  private setMetadata(key: string, metadata: StorageItemMetadata): void {
    try {
      localStorage.setItem(`_meta_${key}`, JSON.stringify({
        data: metadata,
        timestamp: Date.now(),
        category: 'metadata',
        priority: 'medium'
      }));
    } catch (error) {
      console.warn('Failed to set metadata:', error);
    }
  }

  private removeMetadata(key: string): void {
    try {
      localStorage.removeItem(`_meta_${key}`);
    } catch (error) {
      console.warn('Failed to remove metadata:', error);
    }
  }

  public getPendingSyncCount(): number {
    return this.getAllMetadata().filter(item => 
      item.syncStatus === 'pending' || item.syncStatus === 'failed'
    ).length;
  }

  public getDebugInfo(): DebugInfo {
    const metadata = this.getAllMetadata();
    const itemsByType: Record<string, number> = {};
    
    metadata.forEach(item => {
      itemsByType[item.dataType] = (itemsByType[item.dataType] || 0) + 1;
    });

    return {
      totalItems: metadata.length,
      pendingSync: this.getPendingSyncCount(),
      syncQueue: metadata.filter(item => item.syncStatus === 'syncing').length,
      itemsByType,
      config: this.getConfig()
    };
  }

  public clearAllData(): void {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && !key.startsWith('auth-')) { // Preserve auth data
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      console.log(`Cleared ${keysToRemove.length} items from localStorage`);
    } catch (error) {
      console.error('Failed to clear data:', error);
    }
  }

  private inferDataType(key: string): StorageDataType {
    if (key.startsWith('card-')) return 'cards';
    if (key.startsWith('draft-')) return 'drafts';
    if (key.startsWith('settings-')) return 'settings';
    if (key.startsWith('upload-')) return 'uploads';
    if (key.startsWith('memory-')) return 'memories';
    if (key.startsWith('session-')) return 'sessions';
    return 'cache';
  }

  private getStorageSize(): number {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length;
      }
    }
    return total;
  }

  private cleanup(): void {
    console.log('🧹 Cleaning up localStorage...');
    
    const items: Array<{ key: string; item: StorageItem; size: number }> = [];
    
    // Collect all items with metadata
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        try {
          const stored = localStorage.getItem(key);
          if (stored) {
            const item: StorageItem = JSON.parse(stored);
            items.push({
              key,
              item,
              size: stored.length
            });
          }
        } catch (error) {
          // Remove corrupted items
          localStorage.removeItem(key);
        }
      }
    }

    // Sort by priority (low priority items first) and age (oldest first)
    items.sort((a, b) => {
      const priorityOrder = { low: 0, medium: 1, high: 2, critical: 3 };
      const priorityDiff = priorityOrder[a.item.priority] - priorityOrder[b.item.priority];
      
      if (priorityDiff !== 0) return priorityDiff;
      return a.item.timestamp - b.item.timestamp;
    });

    // Remove items until we're under 70% capacity
    const targetSize = this.maxSize * 0.7;
    let currentSize = this.getStorageSize();
    
    for (const { key, size } of items) {
      if (currentSize <= targetSize) break;
      
      localStorage.removeItem(key);
      currentSize -= size;
      console.log(`🗑️ Removed ${key} (${size} bytes)`);
    }
  }
}

export const localStorageManager = LocalStorageManager.getInstance();
