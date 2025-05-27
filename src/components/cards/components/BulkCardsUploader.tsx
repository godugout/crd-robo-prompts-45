
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  FolderOpen, 
  Play, 
  Square, 
  Trash2, 
  AlertCircle,
  CheckCircle,
  Clock,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { useBulkCardProcessing } from '@/hooks/useBulkCardProcessing';

interface BulkCardsUploaderProps {
  onResultsReady: (results: any[]) => void;
}

export const BulkCardsUploader: React.FC<BulkCardsUploaderProps> = ({
  onResultsReady
}) => {
  const [dragActive, setDragActive] = useState(false);
  
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

  // Handle file drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const imageFiles = acceptedFiles.filter(file => 
      file.type.startsWith('image/') && file.size <= 15 * 1024 * 1024
    );
    
    if (imageFiles.length !== acceptedFiles.length) {
      const skipped = acceptedFiles.length - imageFiles.length;
      toast.warning(`${skipped} files skipped (not images or too large)`);
    }

    if (imageFiles.length > 0) {
      addToQueue(imageFiles);
    }
  }, [addToQueue]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: true,
    noClick: true,
    noKeyboard: true,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    onDropAccepted: () => setDragActive(false),
    onDropRejected: () => setDragActive(false)
  });

  // Handle folder upload
  const handleFolderUpload = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.webkitdirectory = true;
    input.accept = 'image/*';
    
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      onDrop(files);
    };
    
    input.click();
  }, [onDrop]);

  // Handle individual file upload
  const handleFileUpload = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/*';
    
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      onDrop(files);
    };
    
    input.click();
  }, [onDrop]);

  // Start processing and handle results
  const handleStartProcessing = useCallback(async () => {
    await processBatches();
    
    // Once processing is complete, send results to parent
    const results = getCompletedResults();
    if (results.length > 0) {
      onResultsReady(results);
    }
  }, [processBatches, getCompletedResults, onResultsReady]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'processing': return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const formatFileSize = (bytes: number) => {
    return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
  };

  return (
    <div className="space-y-6">
      {/* Upload Drop Zone */}
      <Card className="bg-editor-dark border-editor-border">
        <CardContent className="p-0">
          <div
            {...getRootProps()}
            className={`p-12 border-2 border-dashed rounded-lg transition-all cursor-pointer ${
              dragActive
                ? 'border-crd-green bg-crd-green/10'
                : 'border-editor-border hover:border-crd-green/50 hover:bg-gray-800/30'
            }`}
          >
            <input {...getInputProps()} />
            <div className="text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-editor-tool flex items-center justify-center mx-auto">
                <Upload className="w-10 h-10 text-crd-green" />
              </div>
              
              <div>
                <h3 className="text-white font-medium text-xl mb-2">
                  {dragActive ? 'Drop your images here!' : 'Bulk Card Upload'}
                </h3>
                <p className="text-crd-lightGray text-sm max-w-md mx-auto">
                  {dragActive 
                    ? 'Release to add these images to your processing queue'
                    : 'Upload up to 50+ card images at once. Drag folders, select multiple files, or drop them here.'
                  }
                </p>
              </div>

              {!dragActive && (
                <div className="flex flex-wrap justify-center gap-4">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFileUpload();
                    }}
                    className="bg-crd-green hover:bg-crd-green/80 text-black font-medium"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Select Images
                  </Button>
                  
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFolderUpload();
                    }}
                    variant="secondary"
                    className="bg-white hover:bg-gray-100 text-black font-medium border-0"
                  >
                    <FolderOpen className="w-4 h-4 mr-2" />
                    Upload Folder
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Queue Stats */}
      {stats.total > 0 && (
        <Card className="bg-editor-dark border-editor-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white font-medium">
                Processing Queue ({stats.total} files)
              </h4>
              <div className="flex gap-2">
                <Button
                  onClick={handleStartProcessing}
                  disabled={isProcessing || stats.pending === 0}
                  className="bg-crd-green hover:bg-crd-green/80 text-black font-medium"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Start Processing
                    </>
                  )}
                </Button>
                
                {isProcessing && canCancel && (
                  <Button
                    onClick={cancelProcessing}
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-500/10"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                )}
                
                <Button
                  onClick={clearQueue}
                  disabled={isProcessing}
                  variant="outline"
                  className="border-gray-500 text-gray-500 hover:bg-gray-500/10"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Queue
                </Button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="text-center p-3 bg-yellow-600/20 rounded-lg">
                <div className="text-2xl font-bold text-yellow-400">{stats.pending}</div>
                <div className="text-xs text-yellow-300">Pending</div>
              </div>
              <div className="text-center p-3 bg-blue-600/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-400">{stats.processing}</div>
                <div className="text-xs text-blue-300">Processing</div>
              </div>
              <div className="text-center p-3 bg-green-600/20 rounded-lg">
                <div className="text-2xl font-bold text-green-400">{stats.completed}</div>
                <div className="text-xs text-green-300">Completed</div>
              </div>
              <div className="text-center p-3 bg-red-600/20 rounded-lg">
                <div className="text-2xl font-bold text-red-400">{stats.error}</div>
                <div className="text-xs text-red-300">Failed</div>
              </div>
            </div>

            {/* Batch Progress */}
            {batches.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-white">Batch Progress</h5>
                {batches.map((batch) => (
                  <div key={batch.id} className="p-3 bg-editor-tool rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-white">
                        Batch {batch.id.split('_')[2]} ({batch.files.length} files)
                      </span>
                      <span className="text-xs text-crd-lightGray">
                        {batch.status === 'processing' && batch.currentFileName && 
                          `Processing: ${batch.currentFileName}`}
                      </span>
                    </div>
                    <Progress 
                      value={(batch.current / batch.total) * 100} 
                      className="h-2" 
                    />
                    <div className="text-xs text-crd-lightGray mt-1">
                      {batch.current} / {batch.total} completed
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Queue Items (scrollable) */}
      {queue.length > 0 && (
        <Card className="bg-editor-dark border-editor-border">
          <CardContent className="p-6">
            <h4 className="text-white font-medium mb-4">Queue Items</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {queue.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-editor-tool rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(item.status)}
                    <div className="min-w-0 flex-1">
                      <p className="text-white text-sm font-medium truncate max-w-xs">
                        {item.file.name}
                      </p>
                      <p className="text-crd-lightGray text-xs">
                        {formatFileSize(item.file.size)}
                        {item.error && ` • Error: ${item.error}`}
                      </p>
                    </div>
                  </div>
                  
                  {!isProcessing && item.status === 'pending' && (
                    <Button
                      onClick={() => removeFromQueue(item.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
