
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Upload, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { uploadMedia } from '@/lib/mediaManager';
import { toast } from '@/hooks/use-toast';
import type { BatchMediaUploaderProps } from './types';
import type { MediaItem } from '@/types/media';

interface UploadingFile {
  file: File;
  preview: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
}

export const BatchMediaUploader = ({
  onUploadComplete,
  onError,
  memoryId,
  userId,
  maxFiles = 10
}: BatchMediaUploaderProps) => {
  const [files, setFiles] = useState<UploadingFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.slice(0, maxFiles - files.length).map(file => ({
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      status: 'pending' as const
    }));
    setFiles(prev => [...prev, ...newFiles].slice(0, maxFiles));
  }, [files.length, maxFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: {
      'image/*': [],
      'video/*': [],
      'audio/*': []
    },
    maxFiles: maxFiles - files.length
  });

  const uploadFile = async (uploadingFile: UploadingFile): Promise<MediaItem> => {
    return new Promise((resolve, reject) => {
      const progressCallback = (progress: number) => {
        setFiles(prev => prev.map(f => 
          f.file === uploadingFile.file 
            ? { ...f, progress, status: 'uploading' }
            : f
        ));
      };

      uploadMedia({
        file: uploadingFile.file,
        memoryId,
        userId,
        progressCallback
      })
        .then(mediaItem => {
          setFiles(prev => prev.map(f =>
            f.file === uploadingFile.file
              ? { ...f, progress: 100, status: 'completed' }
              : f
          ));
          resolve(mediaItem);
        })
        .catch(error => {
          setFiles(prev => prev.map(f =>
            f.file === uploadingFile.file
              ? { ...f, status: 'error' }
              : f
          ));
          reject(error);
        });
    });
  };

  const uploadInBatches = async () => {
    const pendingFiles = files.filter(f => f.status === 'pending');
    const results: MediaItem[] = [];
    const batchSize = 3;

    for (let i = 0; i < pendingFiles.length; i += batchSize) {
      const batch = pendingFiles.slice(i, i + batchSize);
      try {
        const batchResults = await Promise.all(batch.map(uploadFile));
        results.push(...batchResults);
      } catch (error) {
        if (error instanceof Error) onError?.(error);
      }
    }

    return results;
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    try {
      const mediaItems = await uploadInBatches();
      if (mediaItems.length > 0) {
        onUploadComplete(mediaItems);
        setFiles([]);
      }
    } catch (error) {
      if (error instanceof Error) {
        onError?.(error);
        toast({
          title: "Upload Error",
          description: error.message,
          variant: "destructive"
        });
      }
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (fileToRemove: UploadingFile) => {
    URL.revokeObjectURL(fileToRemove.preview);
    setFiles(files => files.filter(f => f.file !== fileToRemove.file));
  };

  const totalProgress = files.length > 0
    ? files.reduce((acc, file) => acc + file.progress, 0) / files.length
    : 0;

  return (
    <div className="w-full space-y-4">
      {files.length < maxFiles && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            Drag & drop files here, or click to select
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {maxFiles - files.length} files remaining
          </p>
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {files.map((file, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-secondary">
                {file.file.type.startsWith('image/') ? (
                  <img
                    src={file.preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : file.file.type.startsWith('video/') ? (
                  <video
                    src={file.preview}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground text-sm">Audio file</p>
                  </div>
                )}
                
                {file.status === 'uploading' && (
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                    <Progress value={file.progress} className="w-2/3" />
                  </div>
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => removeFile(file)}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            {isUploading && (
              <div className="space-y-2">
                <Progress value={totalProgress} className="w-full" />
                <p className="text-sm text-center text-muted-foreground">
                  Uploading... {totalProgress.toFixed(0)}%
                </p>
              </div>
            )}

            <Button
              onClick={handleUpload}
              className="w-full"
              disabled={isUploading || files.length === 0}
            >
              {isUploading ? (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              Upload {files.length} file{files.length !== 1 ? 's' : ''}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
