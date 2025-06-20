
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  Image, 
  Loader2, 
  CheckCircle2, 
  X,
  Download,
  Layers
} from 'lucide-react';
import { toast } from 'sonner';
import { advancedImageProcessor, type ProcessingOptions } from '@/services/imageProcessing/AdvancedImageProcessor';

interface BatchProcessingItem {
  id: string;
  file: File;
  preview: string;
  status: 'pending' | 'processing' | 'complete' | 'error';
  processedUrl?: string;
  error?: string;
}

interface BatchImageProcessorProps {
  onBatchComplete: (processedImages: { original: File; processed: string }[]) => void;
  className?: string;
}

export const BatchImageProcessor: React.FC<BatchImageProcessorProps> = ({
  onBatchComplete,
  className = ""
}) => {
  const [items, setItems] = useState<BatchProcessingItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processingOptions] = useState<ProcessingOptions>({
    removeBackground: false,
    enhanceQuality: true,
    smartCrop: true,
    targetAspectRatio: 2.5 / 3.5,
    outputFormat: 'png',
    quality: 90,
    maxDimension: 1024
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newItems: BatchProcessingItem[] = acceptedFiles.map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
      status: 'pending'
    }));

    setItems(prev => [...prev, ...newItems]);
    toast.success(`Added ${acceptedFiles.length} images to batch`);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    multiple: true
  });

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const processImage = async (item: BatchProcessingItem): Promise<string> => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = item.preview;
    });

    const result = await advancedImageProcessor.processImage(img, processingOptions);
    return URL.createObjectURL(result.processedBlob);
  };

  const processBatch = async () => {
    if (items.length === 0) {
      toast.error('No images to process');
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    const processedResults: { original: File; processed: string }[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      // Update status to processing
      setItems(prev => prev.map(it => 
        it.id === item.id ? { ...it, status: 'processing' as const } : it
      ));

      try {
        const processedUrl = await processImage(item);
        
        // Update status to complete
        setItems(prev => prev.map(it => 
          it.id === item.id ? { 
            ...it, 
            status: 'complete' as const, 
            processedUrl 
          } : it
        ));

        processedResults.push({
          original: item.file,
          processed: processedUrl
        });
      } catch (error) {
        console.error(`Failed to process ${item.file.name}:`, error);
        
        // Update status to error
        setItems(prev => prev.map(it => 
          it.id === item.id ? { 
            ...it, 
            status: 'error' as const, 
            error: 'Processing failed' 
          } : it
        ));
      }

      // Update progress
      setProgress(((i + 1) / items.length) * 100);
    }

    setIsProcessing(false);
    
    if (processedResults.length > 0) {
      onBatchComplete(processedResults);
      toast.success(`Processed ${processedResults.length}/${items.length} images successfully`);
    }
  };

  const clearAll = () => {
    setItems([]);
    setProgress(0);
  };

  const getStatusIcon = (status: BatchProcessingItem['status']) => {
    switch (status) {
      case 'pending':
        return <Image className="w-4 h-4 text-crd-lightGray" />;
      case 'processing':
        return <Loader2 className="w-4 h-4 text-crd-green animate-spin" />;
      case 'complete':
        return <CheckCircle2 className="w-4 h-4 text-crd-green" />;
      case 'error':
        return <X className="w-4 h-4 text-red-400" />;
    }
  };

  return (
    <Card className={`p-4 bg-editor-tool border-editor-border ${className}`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-medium flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Batch Processor
          </h3>
          <div className="flex gap-2">
            {items.length > 0 && (
              <Button
                onClick={clearAll}
                variant="outline"
                size="sm"
                disabled={isProcessing}
              >
                Clear All
              </Button>
            )}
            <Button
              onClick={processBatch}
              disabled={isProcessing || items.length === 0}
              className="bg-crd-green text-black hover:bg-crd-green/90"
              size="sm"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  Processing
                </>
              ) : (
                `Process ${items.length} Images`
              )}
            </Button>
          </div>
        </div>

        {/* Drop Zone */}
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${isDragActive 
              ? 'border-crd-green bg-crd-green/10' 
              : 'border-editor-border hover:border-crd-green/50'
            }
          `}
        >
          <input {...getInputProps()} />
          <Upload className="w-8 h-8 text-crd-lightGray mx-auto mb-2" />
          <p className="text-white font-medium">
            {isDragActive ? 'Drop images here...' : 'Drop images or click to select'}
          </p>
          <p className="text-crd-lightGray text-sm">
            Support PNG, JPG, JPEG, WebP files
          </p>
        </div>

        {/* Processing Progress */}
        {isProcessing && (
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-crd-lightGray text-xs text-center">
              Processing batch... {Math.round(progress)}% complete
            </p>
          </div>
        )}

        {/* Items List */}
        {items.length > 0 && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {items.map(item => (
              <div 
                key={item.id}
                className="flex items-center gap-3 p-2 bg-editor-dark rounded border border-editor-border"
              >
                <img 
                  src={item.preview}
                  alt={item.file.name}
                  className="w-8 h-8 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate">{item.file.name}</p>
                  <p className="text-crd-lightGray text-xs">
                    {(item.file.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(item.status)}
                  {item.status === 'pending' && !isProcessing && (
                    <Button
                      onClick={() => removeItem(item.id)}
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pt-2 border-t border-editor-border">
          <p className="text-crd-lightGray text-xs">
            Process multiple images simultaneously with advanced AI pipeline.
          </p>
        </div>
      </div>
    </Card>
  );
};
