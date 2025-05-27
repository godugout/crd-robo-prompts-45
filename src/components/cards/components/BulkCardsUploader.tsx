
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, X, Play, Square } from 'lucide-react';
import { useBulkCardProcessing } from '@/hooks/useBulkCardProcessing';
import { useDropzone } from 'react-dropzone';
import type { CardDetectionResult } from '@/services/cardDetection';

interface BulkCardsUploaderProps {
  onResultsReady: (results: CardDetectionResult[]) => void;
}

export const BulkCardsUploader: React.FC<BulkCardsUploaderProps> = ({
  onResultsReady
}) => {
  const {
    queue,
    batches,
    isProcessing,
    canCancel,
    addToQueue,
    removeFromQueue,
    clearQueue,
    processBatches,
    cancelProcessing,
    getCompletedResults,
    getQueueStats
  } = useBulkCardProcessing();

  const stats = getQueueStats();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    multiple: true,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        addToQueue(acceptedFiles);
      }
    }
  });

  const handleStartProcessing = async () => {
    await processBatches();
    
    // Once processing completes, get results and pass them up
    const results = getCompletedResults();
    if (results.length > 0) {
      onResultsReady(results);
    }
  };

  const currentBatch = batches.find(b => b.status === 'processing');
  const batchProgress = currentBatch ? (currentBatch.current / currentBatch.total) * 100 : 0;

  return (
    <Card className="p-6 bg-editor-dark border-crd-mediumGray/20">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-crd-green bg-crd-green/10'
            : 'border-crd-mediumGray hover:border-crd-green/50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 mx-auto mb-4 text-crd-lightGray" />
        <h3 className="text-white text-lg font-medium mb-2">Bulk Card Upload</h3>
        <p className="text-crd-lightGray mb-4">
          Upload up to 50+ card images at once. Drag folders, select multiple files, or drop them here.
        </p>
        <div className="flex justify-center gap-3">
          <Button variant="outline" className="text-crd-lightGray">
            Select Images
          </Button>
          <Button variant="outline" className="text-crd-lightGray">
            Upload Folder
          </Button>
        </div>
        <p className="text-crd-lightGray text-sm mt-2">
          Supports JPG, PNG, WebP • Max 10 images
        </p>
      </div>

      {/* Processing Queue */}
      {stats.total > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-white font-medium">Processing Queue ({stats.total} files)</h4>
            <div className="flex gap-2">
              {!isProcessing && stats.pending > 0 && (
                <Button
                  onClick={handleStartProcessing}
                  className="bg-crd-green hover:bg-crd-green/90 text-black"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Processing
                </Button>
              )}
              
              {isProcessing && canCancel && (
                <Button
                  onClick={cancelProcessing}
                  variant="outline"
                  className="text-orange-400 border-orange-400"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              )}
              
              {!isProcessing && (
                <Button
                  onClick={clearQueue}
                  variant="outline"
                  className="text-red-400 border-red-400"
                >
                  Clear Queue
                </Button>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="bg-yellow-600/20 p-3 rounded text-center">
              <div className="text-2xl font-bold text-yellow-400">{stats.pending}</div>
              <div className="text-yellow-300 text-sm">Pending</div>
            </div>
            <div className="bg-blue-600/20 p-3 rounded text-center">
              <div className="text-2xl font-bold text-blue-400">{stats.processing}</div>
              <div className="text-blue-300 text-sm">Processing</div>
            </div>
            <div className="bg-green-600/20 p-3 rounded text-center">
              <div className="text-2xl font-bold text-green-400">{stats.completed}</div>
              <div className="text-green-300 text-sm">Completed</div>
            </div>
            <div className="bg-red-600/20 p-3 rounded text-center">
              <div className="text-2xl font-bold text-red-400">{stats.error}</div>
              <div className="text-red-300 text-sm">Failed</div>
            </div>
          </div>

          {/* Batch Progress */}
          {currentBatch && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white text-sm">
                  Batch {currentBatch.id.split('_').pop()} ({currentBatch.current}/{currentBatch.total} files)
                </span>
                <span className="text-crd-lightGray text-sm">{Math.round(batchProgress)}%</span>
              </div>
              <Progress value={batchProgress} className="h-2" />
              {currentBatch.currentFileName && (
                <p className="text-crd-lightGray text-xs mt-1">
                  Processing: {currentBatch.currentFileName}
                </p>
              )}
            </div>
          )}

          {/* Queue Items */}
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {queue.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-crd-mediumGray/10 rounded"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      item.status === 'pending'
                        ? 'bg-yellow-400'
                        : item.status === 'processing'
                        ? 'bg-blue-400 animate-pulse'
                        : item.status === 'completed'
                        ? 'bg-green-400'
                        : 'bg-red-400'
                    }`}
                  />
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
                      onClick={() => removeFromQueue(item.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
