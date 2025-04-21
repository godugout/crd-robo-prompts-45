
import { useState } from 'react';
import { uploadMedia } from '@/lib/mediaManager';
import { saveForOfflineUpload } from '@/lib/offlineStorage';
import { toast } from '@/hooks/use-toast';
import type { MediaItem } from '@/types/media';

interface UseMediaUploadOptions {
  memoryId: string;
  userId: string;
  isPrivate?: boolean;
  detectFaces?: boolean;
}

export const useMediaUpload = ({ memoryId, userId, isPrivate, detectFaces }: UseMediaUploadOptions) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const upload = async (file: File): Promise<MediaItem | null> => {
    setIsUploading(true);
    setProgress(0);

    try {
      if (!navigator.onLine) {
        const uploadId = await saveForOfflineUpload(file, memoryId, userId, { detectFaces }, isPrivate);
        toast({
          title: "Saved for offline upload",
          description: "Your file will be uploaded when you're back online"
        });
        return null;
      }

      // For testing without authentication, we'll generate a mock media item
      if (process.env.NODE_ENV === 'development') {
        // Simulate progress
        const interval = setInterval(() => {
          setProgress(prev => {
            if (prev >= 95) {
              clearInterval(interval);
              return 95;
            }
            return prev + 5;
          });
        }, 100);

        // Simulate upload completion
        await new Promise(resolve => setTimeout(resolve, 1500));
        clearInterval(interval);
        setProgress(100);

        // Create mock media item
        const mockMediaItem: MediaItem = {
          id: 'mock-' + Date.now(),
          memoryId,
          type: file.type.startsWith('image/') ? 'image' : 'video',
          url: URL.createObjectURL(file),
          thumbnailUrl: URL.createObjectURL(file),
          originalFilename: file.name,
          size: file.size,
          mimeType: file.type,
          width: 800,
          height: 600,
          duration: file.type.startsWith('video/') ? 0 : null, // Add duration property (0 for videos, null otherwise)
          metadata: null, // Add metadata property (null is valid according to the interface)
          createdAt: new Date().toISOString()
        };

        toast({
          title: "Upload complete",
          description: "Your file has been uploaded successfully"
        });

        return mockMediaItem;
      }

      const mediaItem = await uploadMedia({
        file,
        memoryId,
        userId,
        isPrivate,
        metadata: { detectFaces },
        progressCallback: (progress) => setProgress(progress)
      });

      toast({
        title: "Upload complete",
        description: "Your file has been uploaded successfully"
      });

      return mediaItem;
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload file",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  return {
    upload,
    isUploading,
    progress
  };
};
