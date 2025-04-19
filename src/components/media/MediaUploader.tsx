
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Camera, Image, Upload, X, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { uploadMedia } from '@/lib/mediaManager';
import { toast } from '@/hooks/use-toast';
import type { MediaUploaderProps } from './types';

export const MediaUploader = ({ onUploadComplete, onError, memoryId, userId }: MediaUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleProgressCallback = useCallback((progress: number) => {
    setProgress(progress);
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      'image/*': [],
      'video/*': [],
      'audio/*': []
    }
  });

  const handleCapture = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      await video.play();

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d')?.drawImage(video, 0, 0);

      canvas.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
          setFile(file);
          setPreview(URL.createObjectURL(file));
        }
        stream.getTracks().forEach(track => track.stop());
      }, 'image/jpeg');
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Could not access camera",
        variant: "destructive"
      });
    }
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    try {
      const mediaItem = await uploadMedia({
        file,
        memoryId,
        userId,
        progressCallback: handleProgressCallback
      });
      onUploadComplete(mediaItem);
      setFile(null);
      setPreview(null);
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
      setProgress(0);
    }
  };

  const handleRemove = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    setProgress(0);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {!file ? (
        <div className="space-y-4">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              Drag & drop a file here, or click to select
            </p>
          </div>
          <div className="flex justify-center gap-2">
            <Button onClick={() => document.querySelector('input')?.click()} variant="outline">
              <Image className="mr-2 h-4 w-4" />
              Browse
            </Button>
            <Button onClick={handleCapture} variant="outline">
              <Camera className="mr-2 h-4 w-4" />
              Capture
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative aspect-video rounded-lg overflow-hidden bg-secondary">
            {preview && (
              file.type.startsWith('image/') ? (
                <img
                  src={preview}
                  alt="Upload preview"
                  className="w-full h-full object-contain"
                />
              ) : file.type.startsWith('video/') ? (
                <video
                  src={preview}
                  controls
                  className="w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Audio file selected</p>
                </div>
              )
            )}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {isUploading ? (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-center text-muted-foreground">
                Uploading... {progress.toFixed(0)}%
              </p>
            </div>
          ) : (
            <Button onClick={handleUpload} className="w-full">
              {isUploading ? (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              Upload
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
