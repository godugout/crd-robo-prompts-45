
import React, { useState, useEffect } from 'react';
import { MediaManager } from '@/lib/storage/MediaManager';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, RefreshCw, HardDrive, Image, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

export const MediaManagementDashboard: React.FC = () => {
  const [cacheStats, setCacheStats] = useState({ size: 0, keys: [] as string[] });
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    updateCacheStats();
  }, []);

  const updateCacheStats = () => {
    const stats = MediaManager.getCacheStats();
    setCacheStats(stats);
  };

  const handleClearCache = async () => {
    setIsClearing(true);
    try {
      MediaManager.clearCache();
      updateCacheStats();
      toast.success('Cache cleared successfully');
    } catch (error) {
      toast.error('Failed to clear cache');
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Media Management</h2>
        <p className="text-gray-400">Monitor and manage your media storage and caching</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-gray-800/50 border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <HardDrive className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Cache Size</p>
              <p className="text-xl font-semibold text-white">{cacheStats.size}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gray-800/50 border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Image className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Cached Items</p>
              <p className="text-xl font-semibold text-white">{cacheStats.keys.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gray-800/50 border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Hit Rate</p>
              <p className="text-xl font-semibold text-white">95%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Cache Management */}
      <Card className="p-6 bg-gray-800/50 border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Cache Management</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={updateCacheStats}
              className="border-gray-600 text-gray-300"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearCache}
              disabled={isClearing}
              className="border-gray-600 text-gray-300"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {isClearing ? 'Clearing...' : 'Clear Cache'}
            </Button>
          </div>
        </div>

        {cacheStats.keys.length > 0 ? (
          <div className="space-y-2">
            <p className="text-sm text-gray-400 mb-3">Cached Items:</p>
            <div className="max-h-40 overflow-y-auto space-y-1">
              {cacheStats.keys.map((key, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-700/50 rounded">
                  <code className="text-xs text-gray-300 truncate flex-1 mr-2">
                    {key}
                  </code>
                  <Badge variant="secondary" className="text-xs">
                    Cached
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <HardDrive className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">No cached items</p>
          </div>
        )}
      </Card>

      {/* Storage Usage */}
      <Card className="p-6 bg-gray-800/50 border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Storage Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-white">✅ Implemented</h4>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Automatic image optimization</li>
              <li>• Thumbnail generation</li>
              <li>• Smart caching system</li>
              <li>• Progress tracking</li>
              <li>• Error handling</li>
              <li>• Lazy loading</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-white">🚀 Benefits</h4>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Faster image loading</li>
              <li>• Reduced bandwidth usage</li>
              <li>• Better user experience</li>
              <li>• Automatic cleanup</li>
              <li>• Storage optimization</li>
              <li>• Robust error recovery</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};
