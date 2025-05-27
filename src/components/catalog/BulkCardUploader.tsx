import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, Camera, FolderOpen, Trash2, Play, Pause, Clipboard } from 'lucide-react';
import { toast } from 'sonner';
import { useCardCatalog } from '@/hooks/useCardCatalog';

interface BulkCardUploaderProps {
  onUploadComplete?: (count: number) => void;
}

export const BulkCardUploader = ({ onUploadComplete }: BulkCardUploaderProps) => {
  const {
    uploadQueue,
    isProcessing,
    processingStatus,
    addToQueue,
    processQueue,
    clearQueue,
    removeFromQueue
  } = useCardCatalog();

  const [dragActive, setDragActive] = useState(false);

  // Handle clipboard paste
  const handlePaste = useCallback(async (e: ClipboardEvent) => {
    e.preventDefault();
    
    const items = e.clipboardData?.items;
    if (!items) return;

    const imageFiles: File[] = [];
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          // Create a proper File object with a name
          const namedFile = new File([file], `pasted-image-${Date.now()}-${i}.png`, {
            type: file.type
          });
          imageFiles.push(namedFile);
        }
      }
    }

    if (imageFiles.length > 0) {
      addToQueue(imageFiles);
      toast.success(`Pasted ${imageFiles.length} image${imageFiles.length > 1 ? 's' : ''} from clipboard`);
    } else {
      toast.warning('No images found in clipboard');
    }
  }, [addToQueue]);

  // Add paste event listener
  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [handlePaste]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length !== acceptedFiles.length) {
      toast.warning(`${acceptedFiles.length - imageFiles.length} non-image files were skipped`);
    }

    if (imageFiles.length > 0) {
      addToQueue(imageFiles);
    }
  }, [addToQueue]);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    multiple: true,
    noClick: true,
    noKeyboard: true,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    onDropAccepted: () => setDragActive(false),
    onDropRejected: () => setDragActive(false)
  });

  const handleFolderUpload = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.webkitdirectory = true;
    input.accept = 'image/*';
    
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      const imageFiles = files.filter(file => file.type.startsWith('image/'));
      
      if (imageFiles.length > 0) {
        addToQueue(imageFiles);
        toast.success(`Added ${imageFiles.length} images from folder`);
      }
    };
    
    input.click();
  }, [addToQueue]);

  const handleCameraCapture = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      if (files.length > 0) {
        addToQueue(files);
      }
    };
    
    input.click();
  }, [addToQueue]);

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

  return (
    <div className="space-y-6">
      {/* Main Upload Area */}
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
                    : 'Drag and drop multiple card images, paste from clipboard (Ctrl+V), or use the upload options below'
                  }
                </p>
              </div>

              {!dragActive && (
                <div className="flex flex-wrap justify-center gap-4">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      open();
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
                  
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCameraCapture();
                    }}
                    variant="secondary"
                    className="bg-white hover:bg-gray-100 text-black font-medium border-0"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Take Photo
                  </Button>

                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.info('Copy an image and paste it here with Ctrl+V (or Cmd+V on Mac)');
                    }}
                    variant="secondary"
                    className="bg-white hover:bg-gray-100 text-black font-medium border-0"
                  >
                    <Clipboard className="w-4 h-4 mr-2" />
                    Paste Images
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Queue */}
      {uploadQueue.length > 0 && (
        <Card className="bg-editor-dark border-editor-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white font-medium">
                Upload Queue ({uploadQueue.length} files)
              </h4>
              <div className="flex gap-2">
                <Button
                  onClick={processQueue}
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
                  onClick={clearQueue}
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
                      onClick={() => removeFromQueue(index)}
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
      )}

      {/* Processing Status */}
      {isProcessing && processingStatus.total > 0 && (
        <Card className="bg-editor-dark border-editor-border">
          <CardContent className="p-6">
            <h4 className="text-white font-medium mb-4">Processing Status</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-blue-600/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-400">{processingStatus.total}</div>
                <div className="text-xs text-blue-300">Total Files</div>
              </div>
              <div className="p-3 bg-green-600/20 rounded-lg">
                <div className="text-2xl font-bold text-green-400">{processingStatus.completed}</div>
                <div className="text-xs text-green-300">Completed</div>
              </div>
              <div className="p-3 bg-red-600/20 rounded-lg">
                <div className="text-2xl font-bold text-red-400">{processingStatus.failed}</div>
                <div className="text-xs text-red-300">Failed</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
