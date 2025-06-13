
import { useState, useEffect, useCallback } from 'react';
import { localStorageManager, StorageDataType, SyncPriority } from '@/lib/storage/LocalStorageManager';
import { unifiedSyncService, SyncProgress } from '@/lib/storage/UnifiedSyncService';
import { toast } from 'sonner';

export interface UnifiedStorageHookReturn {
  // Storage operations
  setItem: <T>(key: string, value: T, dataType: StorageDataType, priority?: SyncPriority) => void;
  getItem: <T>(key: string) => T | null;
  removeItem: (key: string) => void;
  
  // Sync operations
  syncAll: () => Promise<void>;
  syncItem: (key: string) => Promise<void>;
  isSyncing: boolean;
  syncProgress: SyncProgress | null;
  
  // Configuration
  config: ReturnType<typeof localStorageManager.getConfig>;
  setTestingMode: (enabled: boolean) => void;
  enableSync: (enabled: boolean) => void;
  
  // Status
  pendingSyncCount: number;
  debugInfo: ReturnType<typeof localStorageManager.getDebugInfo>;
  
  // Utilities
  refreshData: () => void;
}

export const useUnifiedStorage = (): UnifiedStorageHookReturn => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState<SyncProgress | null>(null);
  const [config, setConfig] = useState(localStorageManager.getConfig());
  const [pendingSyncCount, setPendingSyncCount] = useState(localStorageManager.getPendingSyncCount());
  const [debugInfo, setDebugInfo] = useState(localStorageManager.getDebugInfo());

  const refreshData = useCallback(() => {
    setConfig(localStorageManager.getConfig());
    setPendingSyncCount(localStorageManager.getPendingSyncCount());
    setDebugInfo(localStorageManager.getDebugInfo());
  }, []);

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 5000);
    return () => clearInterval(interval);
  }, [refreshData]);

  const setItem = useCallback(<T>(
    key: string,
    value: T,
    dataType: StorageDataType,
    priority: SyncPriority = 'medium'
  ) => {
    localStorageManager.setItem(key, value, dataType, priority);
    refreshData();
  }, [refreshData]);

  const getItem = useCallback(<T>(key: string): T | null => {
    return localStorageManager.getItem<T>(key);
  }, []);

  const removeItem = useCallback((key: string) => {
    localStorageManager.removeItem(key);
    refreshData();
  }, [refreshData]);

  const syncAll = useCallback(async () => {
    if (isSyncing) return;
    
    setIsSyncing(true);
    setSyncProgress({ total: 0, completed: 0, success: 0, failed: 0 });

    try {
      const result = await unifiedSyncService.syncAllData((progress) => {
        setSyncProgress(progress);
      });

      if (result.success) {
        toast.success(`Sync completed: ${result.syncedItems} items synced`);
      } else {
        toast.error(`Sync completed with errors: ${result.failedItems} failed`);
      }
    } catch (error) {
      toast.error('Sync failed');
    } finally {
      setIsSyncing(false);
      setSyncProgress(null);
      refreshData();
    }
  }, [isSyncing, refreshData]);

  const syncItem = useCallback(async (key: string) => {
    try {
      const success = await unifiedSyncService.forceSyncItem(key);
      if (success) {
        toast.success(`Synced ${key}`);
      } else {
        toast.error(`Failed to sync ${key}`);
      }
    } catch (error) {
      toast.error(`Error syncing ${key}`);
    } finally {
      refreshData();
    }
  }, [refreshData]);

  const setTestingMode = useCallback((enabled: boolean) => {
    localStorageManager.setTestingMode(enabled);
    refreshData();
  }, [refreshData]);

  const enableSync = useCallback((enabled: boolean) => {
    localStorageManager.updateConfig({ enableSync: enabled });
    refreshData();
  }, [refreshData]);

  return {
    setItem,
    getItem,
    removeItem,
    syncAll,
    syncItem,
    isSyncing,
    syncProgress,
    config,
    setTestingMode,
    enableSync,
    pendingSyncCount,
    debugInfo,
    refreshData
  };
};
