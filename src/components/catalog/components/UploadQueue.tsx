
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
    <Card className="bg-editor-dark border-editor-border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-white font-medium">
            Upload Queue ({uploadQueue.length} files)
          </h4>
          <div className="flex gap-2">
            <Button
              onClick={onProcessQueue}
              disabled={isProcessing}
              className="bg-crd-green hover:bg-crd-green/80 text-black font-medium"
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
            </Button>
            <Button
              onClick={onClearQueue}
              disabled={isProcessing}
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Queue
            </Button>
          </div>
        </div>

        {/* Processing Progress */}
        {isProcessing && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-crd-lightGray mb-2">
              <span>Processing images...</span>
              <span>{processingStatus.completed} / {processingStatus.total}</span>
            </div>
            <Progress value={processingProgress} className="h-2" />
          </div>
        )}

        {/* Queue Items */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {uploadQueue.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between p-3 bg-editor-tool rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center">
                  <Upload className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium truncate max-w-xs">
                    {file.name}
                  </p>
                  <p className="text-crd-lightGray text-xs">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              
              {!isProcessing && (
                <Button
                  onClick={() => onRemoveFromQueue(index)}
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
