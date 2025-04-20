
import { useState, useEffect } from 'react';
import { syncOfflineData, initializeAutoSync } from '@/lib/syncService';
import { getPendingUploads, getPendingMemories } from '@/lib/offlineStorage';
import { toast } from '@/hooks/use-toast';

export interface SyncProgress {
  total: number;
  completed: number;
  current?: string;
  success: number;
  failed: number;
}

export const useOfflineSync = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [progress, setProgress] = useState<SyncProgress | null>(null);

  const checkPendingItems = async () => {
    const [uploads, memories] = await Promise.all([
      getPendingUploads(),
      getPendingMemories()
    ]);
    setPendingCount(uploads.length + memories.length);
  };

  const sync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);

    try {
      const result = await syncOfflineData((progress) => {
        setProgress(progress);
      });

      if (result.success) {
        toast({
          title: "Sync complete",
          description: `Successfully synced ${result.syncedItems} items`
        });
      } else {
        toast({
          title: "Sync incomplete",
          description: `${result.failedItems} items failed to sync`,
          variant: "destructive"
        });
      }

      await checkPendingItems();
    } catch (error) {
      toast({
        title: "Sync failed",
        description: "Failed to sync offline data",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
      setProgress(null);
    }
  };

  useEffect(() => {
    checkPendingItems();
    const cleanup = initializeAutoSync((progress) => {
      setProgress(progress);
    });

    const interval = setInterval(checkPendingItems, 60000);

    return () => {
      cleanup();
      clearInterval(interval);
    };
  }, []);

  return {
    sync,
    isSyncing,
    pendingCount,
    progress,
    checkPendingItems
  };
};
