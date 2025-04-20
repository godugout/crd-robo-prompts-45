
import React, { useState, useEffect, useCallback } from 'react';
import { Wifi, WifiOff, CloudSync } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { getPendingUploads, getPendingMemories } from '@/lib/offlineStorage';
import { syncOfflineData } from '@/lib/syncService';

export const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingItems, setPendingItems] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState({ current: 0, total: 0 });

  const checkPendingItems = useCallback(async () => {
    try {
      const [uploads, memories] = await Promise.all([
        getPendingUploads(),
        getPendingMemories()
      ]);
      setPendingItems(uploads.length + memories.length);
    } catch (error) {
      console.error('Error checking pending items:', error);
    }
  }, []);

  const handleSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);

    try {
      await syncOfflineData((current, total) => {
        setSyncProgress({ current, total });
      });
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
      setSyncProgress({ current: 0, total: 0 });
      checkPendingItems();
    }
  };

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check and setup interval
    checkPendingItems();
    const interval = setInterval(checkPendingItems, 60000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [checkPendingItems]);

  // Show nothing if online, no pending items, and not syncing
  if (isOnline && pendingItems === 0 && !isSyncing) {
    return null;
  }

  const getTooltipText = () => {
    if (!isOnline) return "You're offline";
    if (isSyncing) return `Syncing ${syncProgress.current}/${syncProgress.total} items`;
    if (pendingItems > 0) return `${pendingItems} items pending synchronization`;
    return "You're online";
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 rounded-full bg-card p-3 shadow-lg">
            {isOnline ? (
              <Wifi className="h-5 w-5 text-green-500" />
            ) : (
              <WifiOff className="h-5 w-5 text-destructive" />
            )}
            
            {pendingItems > 0 && !isSyncing && (
              <>
                <span className="text-sm">{pendingItems} items pending</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={handleSync}
                >
                  <CloudSync className="h-5 w-5" />
                </Button>
              </>
            )}

            {isSyncing && (
              <div className="flex items-center gap-2">
                <span className="text-sm">
                  Syncing {syncProgress.current}/{syncProgress.total}
                </span>
                <Progress 
                  value={(syncProgress.current / syncProgress.total) * 100} 
                  className="w-20 h-2"
                />
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>{getTooltipText()}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

