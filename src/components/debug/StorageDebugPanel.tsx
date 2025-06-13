
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { RefreshCw, Database, Trash2, Settings, AlertCircle, CheckCircle, Clock, X } from 'lucide-react';
import { localStorageManager, StorageItemMetadata } from '@/lib/storage/LocalStorageManager';
import { unifiedSyncService, SyncProgress } from '@/lib/storage/UnifiedSyncService';
import { toast } from 'sonner';

export const StorageDebugPanel = () => {
  const [debugInfo, setDebugInfo] = useState(localStorageManager.getDebugInfo());
  const [items, setItems] = useState<StorageItemMetadata[]>([]);
  const [syncProgress, setSyncProgress] = useState<SyncProgress | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const refreshData = () => {
    setDebugInfo(localStorageManager.getDebugInfo());
    setItems(localStorageManager.getAllMetadata());
  };

  const handleToggleTestingMode = (enabled: boolean) => {
    localStorageManager.setTestingMode(enabled);
    refreshData();
    toast.success(`Testing mode ${enabled ? 'enabled' : 'disabled'}`);
  };

  const handleToggleSync = (enabled: boolean) => {
    localStorageManager.updateConfig({ enableSync: enabled });
    refreshData();
    toast.success(`Sync ${enabled ? 'enabled' : 'disabled'}`);
  };

  const handleSyncAll = async () => {
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
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all local storage data?')) {
      localStorageManager.clearAllData();
      refreshData();
      toast.success('All local storage data cleared');
    }
  };

  const handleRemoveItem = (key: string) => {
    localStorageManager.removeItem(key);
    refreshData();
    toast.success(`Removed ${key}`);
  };

  const getSyncStatusColor = (status: string) => {
    switch (status) {
      case 'synced': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'syncing': return 'bg-blue-500';
      case 'failed': return 'bg-red-500';
      case 'local-only': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  const getSyncStatusIcon = (status: string) => {
    switch (status) {
      case 'synced': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'syncing': return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'failed': return <AlertCircle className="w-4 h-4" />;
      case 'local-only': return <Database className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const filteredItems = selectedType === 'all' 
    ? items 
    : items.filter(item => item.dataType === selectedType);

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Storage Debug Panel</h2>
        <Button onClick={refreshData} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Configuration Controls */}
      <Card className="p-4 bg-editor-dark border-editor-border">
        <h3 className="text-lg font-semibold text-white mb-4">Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between">
            <span className="text-crd-lightGray">Testing Mode</span>
            <Switch
              checked={debugInfo.config.testingMode}
              onCheckedChange={handleToggleTestingMode}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-crd-lightGray">Sync Enabled</span>
            <Switch
              checked={debugInfo.config.enableSync}
              onCheckedChange={handleToggleSync}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-crd-lightGray">Auto-sync Interval</span>
            <span className="text-white">{debugInfo.config.autoSyncInterval / 1000}s</span>
          </div>
        </div>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-editor-dark border-editor-border">
          <div className="text-center">
            <div className="text-2xl font-bold text-crd-green">{debugInfo.totalItems}</div>
            <div className="text-sm text-crd-lightGray">Total Items</div>
          </div>
        </Card>
        <Card className="p-4 bg-editor-dark border-editor-border">
          <div className="text-center">
            <div className="text-2xl font-bold text-crd-orange">{debugInfo.pendingSync}</div>
            <div className="text-sm text-crd-lightGray">Pending Sync</div>
          </div>
        </Card>
        <Card className="p-4 bg-editor-dark border-editor-border">
          <div className="text-center">
            <div className="text-2xl font-bold text-crd-blue">{debugInfo.syncQueue}</div>
            <div className="text-sm text-crd-lightGray">In Queue</div>
          </div>
        </Card>
        <Card className="p-4 bg-editor-dark border-editor-border">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{Object.keys(debugInfo.itemsByType).length}</div>
            <div className="text-sm text-crd-lightGray">Data Types</div>
          </div>
        </Card>
      </div>

      {/* Data Type Distribution */}
      <Card className="p-4 bg-editor-dark border-editor-border">
        <h3 className="text-lg font-semibold text-white mb-4">Data Types</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(debugInfo.itemsByType).map(([type, count]) => (
            <Badge key={type} variant="secondary" className="bg-crd-mediumGray text-white">
              {type}: {count}
            </Badge>
          ))}
        </div>
      </Card>

      {/* Sync Progress */}
      {syncProgress && (
        <Card className="p-4 bg-editor-dark border-editor-border">
          <h3 className="text-lg font-semibold text-white mb-4">Sync Progress</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-crd-lightGray">
              <span>Progress: {syncProgress.completed}/{syncProgress.total}</span>
              <span>Success: {syncProgress.success} | Failed: {syncProgress.failed}</span>
            </div>
            <Progress value={(syncProgress.completed / syncProgress.total) * 100} className="h-2" />
            {syncProgress.current && (
              <div className="text-sm text-crd-lightGray">Currently syncing: {syncProgress.current}</div>
            )}
          </div>
        </Card>
      )}

      {/* Sync Controls */}
      <Card className="p-4 bg-editor-dark border-editor-border">
        <h3 className="text-lg font-semibold text-white mb-4">Sync Controls</h3>
        <div className="flex gap-2">
          <Button 
            onClick={handleSyncAll}
            disabled={isSyncing || debugInfo.config.testingMode}
            className="bg-crd-green hover:bg-crd-green/90 text-black"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync All'}
          </Button>
          <Button 
            onClick={handleClearAll}
            variant="destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>
      </Card>

      {/* Items List */}
      <Card className="p-4 bg-editor-dark border-editor-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Storage Items</h3>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-crd-mediumGray text-white border border-editor-border rounded px-2 py-1"
          >
            <option value="all">All Types</option>
            {Object.keys(debugInfo.itemsByType).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredItems.map((item) => (
            <div key={item.key} className="flex items-center justify-between p-3 bg-crd-mediumGray rounded">
              <div className="flex items-center space-x-3">
                <div className={`p-1 rounded ${getSyncStatusColor(item.syncStatus)}`}>
                  {getSyncStatusIcon(item.syncStatus)}
                </div>
                <div>
                  <div className="text-white font-medium">{item.key}</div>
                  <div className="text-sm text-crd-lightGray">
                    {item.dataType} • {item.priority} priority
                    {item.lastModified && (
                      <span> • Modified: {new Date(item.lastModified).toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  {item.syncStatus}
                </Badge>
                {item.syncRetries > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {item.syncRetries} retries
                  </Badge>
                )}
                <Button
                  onClick={() => handleRemoveItem(item.key)}
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
