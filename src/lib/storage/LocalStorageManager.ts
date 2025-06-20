import { v4 as uuidv4 } from 'uuid';
import localforage from 'localforage';

export type StorageDataType = 'cards' | 'drafts' | 'uploads' | 'memories' | 'settings' | 'sessions' | 'cache' | 'studio-state' | 'recovery-data';
export type SyncPriority = 'critical' | 'high' | 'medium' | 'low';
export type SyncStatus = 'pending' | 'syncing' | 'synced' | 'failed' | 'local-only';

export interface StorageItemMetadata {
  key: string;
  dataType: StorageDataType;
  priority: SyncPriority;
  syncStatus: SyncStatus;
  lastModified: number;
  lastSyncAttempt?: number;
  syncRetries: number;
  size?: number;
  isTestData?: boolean;
}

export interface LocalStorageConfig {
  enableSync: boolean;
  testingMode: boolean;
  maxRetries: number;
  syncBatchSize: number;
  autoSyncInterval: number;
}

export class LocalStorageManager {
  private static instance: LocalStorageManager;
  private config: LocalStorageConfig;
  private metadata: Map<string, StorageItemMetadata> = new Map();
  private syncQueue: Set<string> = new Set();
  private listeners: Map<string, ((data: any) => void)[]> = new Map();

  private constructor() {
    this.config = this.loadConfig();
    this.loadMetadata();
    this.setupEventListeners();
  }

  public static getInstance(): LocalStorageManager {
    if (!LocalStorageManager.instance) {
      LocalStorageManager.instance = new LocalStorageManager();
    }
    return LocalStorageManager.instance;
  }

  private loadConfig(): LocalStorageConfig {
    const defaultConfig: LocalStorageConfig = {
      enableSync: true,
      testingMode: false,
      maxRetries: 3,
      syncBatchSize: 10,
      autoSyncInterval: 30000, // 30 seconds
    };

    try {
      const stored = localStorage.getItem('crd_storage_config');
      if (stored) {
        return { ...defaultConfig, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Failed to load storage config:', error);
    }

    return defaultConfig;
  }

  private saveConfig(): void {
    try {
      localStorage.setItem('crd_storage_config', JSON.stringify(this.config));
    } catch (error) {
      console.error('Failed to save storage config:', error);
    }
  }

  private loadMetadata(): void {
    try {
      const stored = localStorage.getItem('crd_storage_metadata');
      if (stored) {
        const data = JSON.parse(stored);
        this.metadata = new Map(Object.entries(data));
      }
    } catch (error) {
      console.error('Failed to load storage metadata:', error);
    }
  }

  private saveMetadata(): void {
    try {
      const data = Object.fromEntries(this.metadata);
      localStorage.setItem('crd_storage_metadata', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save storage metadata:', error);
    }
  }

  private setupEventListeners(): void {
    // Listen for storage events across tabs
    window.addEventListener('storage', (e) => {
      if (e.key && this.metadata.has(e.key)) {
        this.notifyListeners(e.key, e.newValue ? JSON.parse(e.newValue) : null);
      }
    });

    // Auto-sync interval
    if (this.config.enableSync && !this.config.testingMode) {
      setInterval(() => {
        this.processSyncQueue();
      }, this.config.autoSyncInterval);
    }
  }

  // Configuration methods
  public updateConfig(updates: Partial<LocalStorageConfig>): void {
    this.config = { ...this.config, ...updates };
    this.saveConfig();
    console.log('Storage config updated:', this.config);
  }

  public getConfig(): LocalStorageConfig {
    return { ...this.config };
  }

  public setTestingMode(enabled: boolean): void {
    this.updateConfig({ testingMode: enabled, enableSync: !enabled });
    console.log(`Testing mode ${enabled ? 'enabled' : 'disabled'}`);
  }

  // Data management methods
  public setItem<T>(
    key: string,
    value: T,
    dataType: StorageDataType,
    priority: SyncPriority = 'medium',
    isTestData: boolean = false
  ): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      
      const metadata: StorageItemMetadata = {
        key,
        dataType,
        priority,
        syncStatus: this.config.testingMode ? 'local-only' : 'pending',
        lastModified: Date.now(),
        syncRetries: 0,
        isTestData
      };

      this.metadata.set(key, metadata);
      this.saveMetadata();

      if (this.config.enableSync && !this.config.testingMode && !isTestData) {
        this.queueForSync(key);
      }

      this.notifyListeners(key, value);
    } catch (error) {
      console.error(`Failed to set item ${key}:`, error);
    }
  }

  public getItem<T>(key: string): T | null {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error(`Failed to get item ${key}:`, error);
      return null;
    }
  }

  public removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
      this.metadata.delete(key);
      this.syncQueue.delete(key);
      this.saveMetadata();
      this.notifyListeners(key, null);
    } catch (error) {
      console.error(`Failed to remove item ${key}:`, error);
    }
  }

  // Sync management
  public queueForSync(key: string): void {
    if (this.config.enableSync && !this.config.testingMode) {
      this.syncQueue.add(key);
    }
  }

  public async processSyncQueue(): Promise<void> {
    if (this.syncQueue.size === 0) return;

    const batch = Array.from(this.syncQueue).slice(0, this.config.syncBatchSize);
    console.log(`Processing sync batch: ${batch.length} items`);

    for (const key of batch) {
      await this.syncItem(key);
    }
  }

  private async syncItem(key: string): Promise<boolean> {
    const metadata = this.metadata.get(key);
    if (!metadata || metadata.syncStatus === 'synced') {
      this.syncQueue.delete(key);
      return true;
    }

    if (metadata.syncRetries >= this.config.maxRetries) {
      metadata.syncStatus = 'failed';
      this.metadata.set(key, metadata);
      this.syncQueue.delete(key);
      return false;
    }

    try {
      metadata.syncStatus = 'syncing';
      metadata.lastSyncAttempt = Date.now();
      this.metadata.set(key, metadata);

      const data = this.getItem(key);
      if (!data) {
        this.syncQueue.delete(key);
        return false;
      }

      // TODO: Implement actual sync logic based on data type
      const success = await this.syncToDatabase(metadata.dataType, key, data);

      if (success) {
        metadata.syncStatus = 'synced';
        metadata.syncRetries = 0;
        this.syncQueue.delete(key);
      } else {
        metadata.syncStatus = 'failed';
        metadata.syncRetries++;
      }

      this.metadata.set(key, metadata);
      this.saveMetadata();
      return success;
    } catch (error) {
      console.error(`Sync failed for ${key}:`, error);
      metadata.syncStatus = 'failed';
      metadata.syncRetries++;
      this.metadata.set(key, metadata);
      this.saveMetadata();
      return false;
    }
  }

  private async syncToDatabase(dataType: StorageDataType, key: string, data: any): Promise<boolean> {
    // This will be implemented based on data type
    console.log(`Syncing ${dataType} data for key ${key}`);
    
    switch (dataType) {
      case 'cards':
        // Use existing card sync logic
        return true; // Placeholder
      case 'drafts':
        // Implement draft sync
        return true; // Placeholder
      case 'settings':
        // Implement settings sync
        return true; // Placeholder
      default:
        console.log(`No sync implementation for data type: ${dataType}`);
        return false;
    }
  }

  // Utility methods
  public getMetadata(key: string): StorageItemMetadata | undefined {
    return this.metadata.get(key);
  }

  public getAllMetadata(): StorageItemMetadata[] {
    return Array.from(this.metadata.values());
  }

  public getItemsByType(dataType: StorageDataType): StorageItemMetadata[] {
    return Array.from(this.metadata.values()).filter(item => item.dataType === dataType);
  }

  public getPendingSyncCount(): number {
    return Array.from(this.metadata.values()).filter(
      item => item.syncStatus === 'pending' || item.syncStatus === 'failed'
    ).length;
  }

  public getSyncQueue(): string[] {
    return Array.from(this.syncQueue);
  }

  // Event listeners
  public addListener(key: string, callback: (data: any) => void): void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, []);
    }
    this.listeners.get(key)!.push(callback);
  }

  public removeListener(key: string, callback: (data: any) => void): void {
    const callbacks = this.listeners.get(key);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private notifyListeners(key: string, data: any): void {
    const callbacks = this.listeners.get(key);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Listener error for key ${key}:`, error);
        }
      });
    }
  }

  // Debug and testing methods
  public getDebugInfo(): {
    config: LocalStorageConfig;
    totalItems: number;
    pendingSync: number;
    syncQueue: number;
    itemsByType: Record<string, number>;
    syncStatusCounts: Record<string, number>;
  } {
    const items = Array.from(this.metadata.values());
    const itemsByType: Record<string, number> = {};
    const syncStatusCounts: Record<string, number> = {};

    items.forEach(item => {
      itemsByType[item.dataType] = (itemsByType[item.dataType] || 0) + 1;
      syncStatusCounts[item.syncStatus] = (syncStatusCounts[item.syncStatus] || 0) + 1;
    });

    return {
      config: this.config,
      totalItems: items.length,
      pendingSync: this.getPendingSyncCount(),
      syncQueue: this.syncQueue.size,
      itemsByType,
      syncStatusCounts
    };
  }

  public clearAllData(includeMetadata: boolean = false): void {
    const keys = Array.from(this.metadata.keys());
    keys.forEach(key => {
      localStorage.removeItem(key);
    });
    
    this.metadata.clear();
    this.syncQueue.clear();
    
    if (includeMetadata) {
      localStorage.removeItem('crd_storage_metadata');
      localStorage.removeItem('crd_storage_config');
    } else {
      this.saveMetadata();
    }
    
    console.log('All local storage data cleared');
  }
}

// Export singleton instance
export const localStorageManager = LocalStorageManager.getInstance();
