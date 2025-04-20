
import { useState, useCallback } from 'react';
import { uploadMedia } from '@/lib/mediaManager';
import type { MediaItem } from '@/types/media';
import type { UploadingFile, BatchUploaderState } from './types';

export const useBatchUpload = (
  memoryId: string,
  userId: string,
  onUploadComplete: (mediaItems: MediaItem[]) => void,
  onError?: (error: Error) => void
) => {
  const [{ files, isUploading }, setState] = useState<BatchUploaderState>({
    files: [],
    isUploading: false
  });

  const uploadFile = async (uploadingFile: UploadingFile): Promise<MediaItem> => {
    return new Promise((resolve, reject) => {
      const progressCallback = (progress: number) => {
        setState(prev => ({
          ...prev,
          files: prev.files.map(f => 
            f.file === uploadingFile.file 
              ? { ...f, progress, status: 'uploading' }
              : f
          )
        }));
      };

      uploadMedia({
        file: uploadingFile.file,
        memoryId,
        userId,
        progressCallback
      })
        .then(mediaItem => {
          setState(prev => ({
            ...prev,
            files: prev.files.map(f =>
              f.file === uploadingFile.file
                ? { ...f, progress: 100, status: 'completed' }
                : f
            )
          }));
          resolve(mediaItem);
        })
        .catch(error => {
          setState(prev => ({
            ...prev,
            files: prev.files.map(f =>
              f.file === uploadingFile.file
                ? { ...f, status: 'error' }
                : f
            )
          }));
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

  const addFiles = useCallback((newFiles: File[]) => {
    const filesToAdd = newFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      status: 'pending' as const
    }));
    setState(prev => ({
      ...prev,
      files: [...prev.files, ...filesToAdd]
    }));
  }, []);

  const removeFile = useCallback((fileToRemove: UploadingFile) => {
    URL.revokeObjectURL(fileToRemove.preview);
    setState(prev => ({
      ...prev,
      files: prev.files.filter(f => f.file !== fileToRemove.file)
    }));
  }, []);

  const startUpload = async () => {
    if (files.length === 0) return;
    
    setState(prev => ({ ...prev, isUploading: true }));
    try {
      const mediaItems = await uploadInBatches();
      if (mediaItems.length > 0) {
        onUploadComplete(mediaItems);
        setState({ files: [], isUploading: false });
      }
    } catch (error) {
      if (error instanceof Error) onError?.(error);
    } finally {
      setState(prev => ({ ...prev, isUploading: false }));
    }
  };

  return {
    files,
    isUploading,
    addFiles,
    removeFile,
    startUpload
  };
};
