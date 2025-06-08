
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { CRDButton } from '@/components/ui/design-system';
import { ArrowUp, ArrowDown, X, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { UploadedImage } from '../../hooks/useCardUploadSession';

interface QueueItem extends UploadedImage {
  priority: number;
  estimatedTime?: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
}

interface UploadQueueManagerProps {
  queueItems: QueueItem[];
  onMovePriority: (id: string, direction: 'up' | 'down') => void;
  onRemoveFromQueue: (id: string) => void;
  onCancelOperation: (id: string) => void;
  isProcessing: boolean;
}

export const UploadQueueManager: React.FC<UploadQueueManagerProps> = ({
  queueItems,
  onMovePriority,
  onRemoveFromQueue,
  onCancelOperation,
  isProcessing
}) => {
  const formatEstimatedTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    return `${Math.ceil(seconds / 60)}m`;
  };

  const getStatusIcon = (status: QueueItem['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-crd-lightGray" />;
      case 'processing':
        return <div className="w-4 h-4 border-2 border-crd-green border-t-transparent rounded-full animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: QueueItem['status']) => {
    switch (status) {
      case 'pending':
        return 'Waiting';
      case 'processing':
        return 'Processing';
      case 'completed':
        return 'Complete';
      case 'failed':
        return 'Failed';
      default:
        return 'Unknown';
    }
  };

  if (queueItems.length === 0) return null;

  return (
    <div className="bg-crd-darkGray border border-crd-mediumGray rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-crd-white font-medium">
          Processing Queue ({queueItems.length} items)
        </h4>
        <div className="text-sm text-crd-lightGray">
          Priority order • Estimated completion times
        </div>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {queueItems.map((item, index) => (
          <div
            key={item.id}
            className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
              item.status === 'processing' 
                ? 'bg-crd-green/10 border-crd-green/30'
                : item.status === 'failed'
                ? 'bg-red-500/10 border-red-500/30'
                : item.status === 'completed'
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-crd-mediumGray border-crd-mediumGray'
            }`}
          >
            {/* Priority badge */}
            <div className="flex-shrink-0 w-8 h-8 bg-crd-darkGray rounded-full flex items-center justify-center text-xs text-crd-lightGray font-medium">
              {index + 1}
            </div>

            {/* File preview */}
            <div className="w-12 h-12 rounded overflow-hidden bg-crd-darkGray flex-shrink-0">
              <img
                src={item.preview}
                alt={`Queue item ${item.file.name}`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* File info and progress */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {getStatusIcon(item.status)}
                <span className="text-sm text-crd-white font-medium truncate">
                  {item.file.name}
                </span>
                <span className="text-xs text-crd-lightGray">
                  {getStatusText(item.status)}
                </span>
              </div>
              
              {item.status === 'processing' && item.progress !== undefined && (
                <Progress value={item.progress} className="h-1 mb-1" />
              )}
              
              <div className="flex items-center gap-4 text-xs text-crd-lightGray">
                <span>{(item.file.size / 1024 / 1024).toFixed(2)} MB</span>
                {item.estimatedTime && item.status === 'pending' && (
                  <span>~{formatEstimatedTime(item.estimatedTime)}</span>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1">
              {/* Priority controls */}
              {item.status === 'pending' && !isProcessing && (
                <>
                  <CRDButton
                    onClick={() => onMovePriority(item.id, 'up')}
                    disabled={index === 0}
                    variant="ghost"
                    size="sm"
                    className="text-crd-lightGray hover:text-crd-white h-8 w-8 p-0"
                    aria-label="Move up in queue"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </CRDButton>
                  
                  <CRDButton
                    onClick={() => onMovePriority(item.id, 'down')}
                    disabled={index === queueItems.length - 1}
                    variant="ghost"
                    size="sm"
                    className="text-crd-lightGray hover:text-crd-white h-8 w-8 p-0"
                    aria-label="Move down in queue"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </CRDButton>
                </>
              )}

              {/* Cancel/Remove */}
              <CRDButton
                onClick={() => {
                  if (item.status === 'processing') {
                    onCancelOperation(item.id);
                  } else {
                    onRemoveFromQueue(item.id);
                  }
                }}
                variant="ghost"
                size="sm"
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8 p-0"
                aria-label={item.status === 'processing' ? 'Cancel operation' : 'Remove from queue'}
              >
                <X className="w-3 h-3" />
              </CRDButton>
            </div>
          </div>
        ))}
      </div>

      {/* Queue summary */}
      <div className="mt-4 pt-3 border-t border-crd-mediumGray">
        <div className="grid grid-cols-4 gap-4 text-center text-xs">
          <div>
            <div className="text-crd-lightGray">Pending</div>
            <div className="text-crd-white font-medium">
              {queueItems.filter(item => item.status === 'pending').length}
            </div>
          </div>
          <div>
            <div className="text-crd-lightGray">Processing</div>
            <div className="text-crd-white font-medium">
              {queueItems.filter(item => item.status === 'processing').length}
            </div>
          </div>
          <div>
            <div className="text-crd-lightGray">Completed</div>
            <div className="text-green-500 font-medium">
              {queueItems.filter(item => item.status === 'completed').length}
            </div>
          </div>
          <div>
            <div className="text-crd-lightGray">Failed</div>
            <div className="text-red-500 font-medium">
              {queueItems.filter(item => item.status === 'failed').length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
