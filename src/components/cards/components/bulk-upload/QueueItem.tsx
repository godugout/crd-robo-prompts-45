
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import type { QueueItem as QueueItemType } from '@/hooks/useBulkCardProcessing/queueManager';

interface QueueItemProps {
  item: QueueItemType;
  isProcessing: boolean;
  onRemove: (id: string) => void;
}

export const QueueItem: React.FC<QueueItemProps> = ({
  item,
  isProcessing,
  onRemove
}) => {
  const getStatusColor = () => {
    switch (item.status) {
      case 'pending': return 'bg-yellow-400';
      case 'processing': return 'bg-blue-400 animate-pulse';
      case 'completed': return 'bg-green-400';
      case 'error': return 'bg-red-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-crd-mediumGray/10 rounded">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
        <span className="text-white text-sm">{item.file.name}</span>
        <span className="text-crd-lightGray text-xs">
          {(item.file.size / 1024 / 1024).toFixed(1)} MB
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        {item.status === 'completed' && item.result && (
          <span className="text-green-400 text-xs">
            {item.result.detectedCards.length} cards detected
          </span>
        )}
        {item.status === 'error' && (
          <span className="text-red-400 text-xs">{item.error}</span>
        )}
        {item.status === 'pending' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(item.id)}
            className="text-red-400 hover:text-red-300"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
