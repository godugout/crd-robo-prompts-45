
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { MediaManager, type UploadOptions } from '@/lib/storage/MediaManager';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Image, X, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface MediaUploadZoneProps extends UploadOptions {
  onUploadComplete?: (files: any[]) => void;
  onUploadError?: (error: string) => void;
  className?: string;
  children?: React.ReactNode;
  maxFiles?: number;
  accept?: Record<string, string[]>;
  disabled?: boolean;
}

export const MediaUploadZone: React.FC<MediaUploadZoneProps> = ({
  onUploadComplete,
  onUploadError,
  className,
  children,
  maxFiles = 10,
  accept = {
    'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif']
  },
  disabled = false,
  ...uploadOptions
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (disabled || uploading) return;

    setUploading(true);
    const newProgress: Record<string, number> = {};
    
    try {
      const uploadPromises = acceptedFiles.map(async (file) => {
        const fileId = `${file.name}-${Date.now()}`;
        newProgress[fileId] = 0;
        setUploadProgress({ ...newProgress });

        try {
          const result = await MediaManager.uploadFile(file, {
            ...uploadOptions,
            onProgress: (progress) => {
              setUploadProgress(prev => ({
                ...prev,
                [fileId]: progress
              }));
            }
          });

          if (result) {
            setUploadedFiles(prev => [...prev, result]);
            return result;
          }
          return null;
        } catch (error) {
          console.error(`Failed to upload ${file.name}:`, error);
          onUploadError?.(error instanceof Error ? error.message : 'Upload failed');
          return null;
        }
      });

      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(Boolean);
      
      if (successfulUploads.length > 0) {
        onUploadComplete?.(successfulUploads);
        toast.success(`Successfully uploaded ${successfulUploads.length} file(s)`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed');
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  }, [disabled, uploading, uploadOptions, onUploadComplete, onUploadError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    disabled: disabled || uploading
  });

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const isUploading = Object.keys(uploadProgress).length > 0;
  const averageProgress = isUploading 
    ? Object.values(uploadProgress).reduce((a, b) => a + b, 0) / Object.values(uploadProgress).length
    : 0;

  return (
    <div className={cn('space-y-4', className)}>
      <Card
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-gray-400',
          isDragActive && 'border-crd-green bg-crd-green/5',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input {...getInputProps()} />
        
        {children ? (
          children
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-gray-400" />
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {isDragActive ? 'Drop files here' : 'Upload Media Files'}
              </h3>
              <p className="text-gray-500">
                Drag & drop files here or click to browse
              </p>
            </div>
            
            <div className="text-sm text-gray-400">
              Supports images up to 50MB • Max {maxFiles} files
            </div>
          </div>
        )}
      </Card>

      {/* Upload Progress */}
      {isUploading && (
        <Card className="p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Uploading files...</span>
              <span className="text-sm text-gray-500">{Math.round(averageProgress)}%</span>
            </div>
            <Progress value={averageProgress} className="w-full" />
          </div>
        </Card>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <Card className="p-4">
          <h4 className="text-sm font-medium mb-3">Uploaded Files</h4>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                <div className="w-8 h-8 bg-crd-green/20 rounded flex items-center justify-center">
                  {file.metadata.type.startsWith('image/') ? (
                    <Image className="w-4 h-4 text-crd-green" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-crd-green" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(file.metadata.size / 1024).toFixed(1)} KB
                    {file.metadata.width && file.metadata.height && 
                      ` • ${file.metadata.width}×${file.metadata.height}`
                    }
                  </p>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
