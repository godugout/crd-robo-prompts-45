
import { useCallback } from 'react';
import { toast } from 'sonner';

interface UseUploadQueueProps {
  uploadQueue: File[];
  setUploadQueue: (files: File[]) => void;
}

export const useUploadQueue = ({ uploadQueue, setUploadQueue }: UseUploadQueueProps) => {
  const addToQueue = useCallback((files: File[]) => {
    setUploadQueue([...uploadQueue, ...files]);
    toast.success(`Added ${files.length} files to queue`);
  }, [uploadQueue, setUploadQueue]);

  const clearQueue = useCallback(() => {
    setUploadQueue([]);
  }, [setUploadQueue]);

  const removeFromQueue = useCallback((index: number) => {
    setUploadQueue(uploadQueue.filter((_, i) => i !== index));
  }, [uploadQueue, setUploadQueue]);

  return {
    addToQueue,
    clearQueue,
    removeFromQueue
  };
};
