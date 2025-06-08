
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CRDButton } from '@/components/ui/design-system';
import { Progress } from '@/components/ui/progress';
import { Upload, Trash2, Play, Pause } from 'lucide-react';

interface UploadQueueProps {
  uploadQueue: File[];
  isProcessing: boolean;
  processingStatus: {
    total: number;
    completed: number;
    failed: number;
    inProgress: string[];
  };
  onProcessQueue: () => void;
  onClearQueue: () => void;
  onRemoveFromQueue: (index: number) => void;
}

export const UploadQueue = ({
  uploadQueue,
  isProcessing,
  processingStatus,
  onProcessQueue,
  onClearQueue,
  onRemoveFromQueue
}: UploadQueueProps) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const processingProgress = processingStatus.total > 0 
    ? (processingStatus.completed / processingStatus.total) * 100 
    : 0;

  if (uploadQueue.length === 0) {
    return null;
  }

  return (
    <Card className="bg-crd-darkGray border-crd-mediumGray">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-crd-white font-medium">
            Upload Queue ({uploadQueue.length} files)
          </h4>
          <div className="flex gap-2">
            <CRDButton
              onClick={onProcessQueue}
              disabled={isProcessing}
              variant="primary"
              className="bg-crd-green hover:bg-crd-green/80 text-black font-medium"
              aria-label={isProcessing ? 'Processing files' : 'Start processing all files'}
            >
              {isProcessing ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Process All
                </>
              )}
            </CRDButton>
            <CRDButton
              onClick={onClearQueue}
              disabled={isProcessing}
              variant="outline"
              className="border-red-500 text-red-400 hover:bg-red-500/10 hover:text-red-300"
              aria-label="Clear entire upload queue"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Queue
            </CRDButton>
          </div>
        </div>

        {/* Processing Progress */}
        {isProcessing && (
          <div className="mb-4" role="region" aria-label="Processing progress">
            <div className="flex justify-between text-sm text-crd-lightGray mb-2">
              <span>Processing images...</span>
              <span>{processingStatus.completed} / {processingStatus.total}</span>
            </div>
            <Progress 
              value={processingProgress} 
              className="h-2"
              aria-label={`Processing progress: ${Math.round(processingProgress)}%`}
            />
          </div>
        )}

        {/* Queue Items */}
        <div className="space-y-2 max-h-64 overflow-y-auto" role="list" aria-label="Upload queue items">
          {uploadQueue.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between p-3 bg-crd-mediumGray rounded-lg"
              role="listitem"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-crd-darkGray rounded flex items-center justify-center">
                  <Upload className="w-4 h-4 text-crd-lightGray" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-crd-white text-sm font-medium truncate max-w-xs">
                    {file.name}
                  </p>
                  <p className="text-crd-lightGray text-xs">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              
              {!isProcessing && (
                <CRDButton
                  onClick={() => onRemoveFromQueue(index)}
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  aria-label={`Remove ${file.name} from queue`}
                >
                  <Trash2 className="w-4 h-4" />
                </CRDButton>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
