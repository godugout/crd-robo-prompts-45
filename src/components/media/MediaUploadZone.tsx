
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image, Video, File, X, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MediaManager, type UploadOptions } from '@/lib/storage/MediaManager';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface MediaUploadZoneProps {
  bucket: 'static-assets' | 'user-content' | 'card-assets';
  folder?: string;
  maxFiles?: number;
  generateThumbnail?: boolean;
  optimize?: boolean;
  tags?: string[];
  metadata?: Record<string, any>;
  onUploadComplete?: (files: any[]) => void;
  onUploadProgress?: (progress: number) => void;
  className?: string;
  children?: React.ReactNode;
}

interface UploadingFile {
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
  result?: any;
}

export const MediaUploadZone: React.FC<MediaUploadZoneProps> = ({
  bucket,
  folder,
  maxFiles = 10,
  generateThumbnail = true,
  optimize = true,
  tags = [],
  metadata = {},
  onUploadComplete,
  onUploadProgress,
  className,
  children
}) => {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setIsUploading(true);
    const filesToUpload = acceptedFiles.slice(0, maxFiles);
    
    // Initialize uploading files state
    const initialFiles = filesToUpload.map(file => ({
      file,
      progress: 0,
      status: 'uploading' as const
    }));
    
    setUploadingFiles(initialFiles);

    const uploadOptions: UploadOptions = {
      bucket,
      folder,
      generateThumbnail,
      optimize,
      tags,
      metadata
    };

    const results = [];

    // Upload files one by one for better progress tracking
    for (let i = 0; i < filesToUpload.length; i++) {
      const file = filesToUpload[i];
      
      try {
        const result = await MediaManager.uploadFile(file, {
          ...uploadOptions,
          onProgress: (progress) => {
            setUploadingFiles(prev => prev.map((item, index) => 
              index === i ? { ...item, progress } : item
            ));
            
            // Calculate overall progress
            const overallProgress = ((i * 100) + progress) / filesToUpload.length;
            onUploadProgress?.(overallProgress);
          }
        });

        if (result) {
          setUploadingFiles(prev => prev.map((item, index) => 
            index === i ? { ...item, status: 'success', progress: 100, result } : item
          ));
          results.push(result);
        } else {
          setUploadingFiles(prev => prev.map((item, index) => 
            index === i ? { ...item, status: 'error', error: 'Upload failed' } : item
          ));
        }
      } catch (error) {
        console.error('Upload error:', error);
        setUploadingFiles(prev => prev.map((item, index) => 
          index === i ? { 
            ...item, 
            status: 'error', 
            error: error instanceof Error ? error.message : 'Upload failed' 
          } : item
        ));
      }
    }

    setIsUploading(false);
    onUploadComplete?.(results);
    
    // Clear completed uploads after a delay
    setTimeout(() => {
      setUploadingFiles([]);
    }, 3000);

  }, [bucket, folder, maxFiles, generateThumbnail, optimize, tags, metadata, onUploadComplete, onUploadProgress]);

  // Create proper accept object based on bucket type
  const getAcceptTypes = () => {
    const acceptTypes: Record<string, string[]> = {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif']
    };
    
    if (bucket === 'user-content') {
      acceptTypes['video/*'] = ['.mp4', '.webm'];
    }
    
    return acceptTypes;
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    disabled: isUploading,
    maxFiles,
    accept: getAcceptTypes()
  });

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (file.type.startsWith('video/')) return <Video className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  const getStatusIcon = (status: UploadingFile['status']) => {
    switch (status) {
      case 'success':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer',
          isDragActive && !isDragReject && 'border-crd-green bg-crd-green/10 scale-105',
          isDragActive && isDragReject && 'border-red-500 bg-red-50',
          !isDragActive && 'border-crd-mediumGray hover:border-crd-green/50 hover:bg-crd-darkGray/50',
          isUploading && 'pointer-events-none opacity-50'
        )}
      >
        <input {...getInputProps()} />
        
        {children || (
          <div className="space-y-4">
            <Upload className={cn(
              'w-12 h-12 mx-auto transition-colors',
              isDragActive && !isDragReject ? 'text-crd-green' : 'text-crd-lightGray'
            )} />
            
            <div>
              <h3 className="text-white text-lg font-medium mb-2">
                {isDragActive && !isDragReject 
                  ? 'Drop files here!' 
                  : isDragActive && isDragReject
                  ? 'File type not supported'
                  : 'Drag & drop files here'
                }
              </h3>
              <p className="text-crd-lightGray">
                or click to browse your files
              </p>
            </div>
            
            <div className="text-sm text-crd-lightGray">
              {bucket === 'static-assets' && 'PNG, JPG, WebP, SVG up to 50MB'}
              {bucket === 'user-content' && 'Images & Videos up to 100MB'}
              {bucket === 'card-assets' && 'PNG, JPG, WebP up to 50MB'}
              {maxFiles > 1 && ` • Up to ${maxFiles} files`}
            </div>
          </div>
        )}
      </div>

      {/* Upload Progress */}
      {uploadingFiles.length > 0 && (
        <Card className="p-4 bg-editor-dark border-editor-border">
          <h4 className="text-white font-medium mb-3">
            Uploading {uploadingFiles.length} file{uploadingFiles.length !== 1 ? 's' : ''}
          </h4>
          
          <div className="space-y-3">
            {uploadingFiles.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-3">
                  {getFileIcon(item.file)}
                  <span className="text-sm text-crd-lightGray flex-1 truncate">
                    {item.file.name}
                  </span>
                  {getStatusIcon(item.status)}
                </div>
                
                {item.status === 'uploading' && (
                  <Progress value={item.progress} className="h-1" />
                )}
                
                {item.status === 'error' && item.error && (
                  <p className="text-xs text-red-400">{item.error}</p>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
