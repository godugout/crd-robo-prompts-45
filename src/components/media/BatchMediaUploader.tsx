
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { FilePreview } from './uploaders/FilePreview';
import { useBatchUpload } from './uploaders/useBatchUpload';
import type { BatchUploaderProps } from './uploaders/types';

export const BatchMediaUploader = ({
  onUploadComplete,
  onError,
  memoryId,
  userId,
  maxFiles = 10
}: BatchUploaderProps) => {
  const {
    files,
    isUploading,
    addFiles,
    removeFile,
    startUpload
  } = useBatchUpload(memoryId, userId, onUploadComplete, onError);

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.slice(0, maxFiles - files.length);
    addFiles(newFiles);
  }, [files.length, maxFiles, addFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: {
      'image/*': [],
      'video/*': [],
      'audio/*': []
    },
    maxFiles: maxFiles - files.length
  });

  const handleUpload = async () => {
    try {
      await startUpload();
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Upload Error",
          description: error.message,
          variant: "destructive"
        });
      }
    }
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
              <FilePreview
                key={index}
                file={file}
                onRemove={() => removeFile(file)}
                disabled={isUploading}
              />
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
