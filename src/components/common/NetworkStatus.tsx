
import React from 'react';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Wifi, WifiOff, Upload } from 'lucide-react';

export const NetworkStatus = () => {
  const { sync, isSyncing, pendingCount, progress } = useOfflineSync();

  if (!isSyncing && pendingCount === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 flex items-center gap-2 rounded-lg bg-background/95 p-2 shadow-lg border">
      {navigator.onLine ? (
        <Wifi className="h-5 w-5 text-green-500" />
      ) : (
        <WifiOff className="h-5 w-5 text-destructive" />
      )}

      {pendingCount > 0 && !isSyncing && (
        <>
          <span className="text-sm">{pendingCount} items pending</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={sync}
            className="h-8 w-8 p-0"
          >
            <Upload className="h-5 w-5" />
          </Button>
        </>
      )}

      {isSyncing && progress && (
        <div className="flex items-center gap-2">
          <Progress 
            value={(progress.completed / progress.total) * 100} 
            className="w-24" 
          />
          <span className="text-sm min-w-[4rem]">
            {Math.round((progress.completed / progress.total) * 100)}%
          </span>
        </div>
      )}
    </div>
  );
};
