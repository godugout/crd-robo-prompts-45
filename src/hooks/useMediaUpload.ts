
import { useState } from 'react';
import { MediaManager, type UploadOptions } from '@/lib/storage/MediaManager';
import { toast } from 'sonner';

interface UseMediaUploadOptions extends UploadOptions {
  onComplete?: (result: any) => void;
  onError?: (error: string) => void;
}

export const useMediaUpload = (options: UseMediaUploadOptions) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<any>(null);

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setProgress(0);
    setUploadedFile(null);

    try {
      const result = await MediaManager.uploadFile(file, {
        ...options,
        onProgress: setProgress
      });

      if (result) {
        setUploadedFile(result);
        options.onComplete?.(result);
        toast.success('File uploaded successfully');
      } else {
        options.onError?.('Upload failed');
        toast.error('Upload failed');
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      options.onError?.(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  const reset = () => {
    setIsUploading(false);
    setProgress(0);
    setUploadedFile(null);
  };

  return {
    uploadFile,
    isUploading,
    progress,
    uploadedFile,
    reset
  };
};
