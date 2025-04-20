
import type { MediaItem } from '@/types/media';

export interface UploadingFile {
  file: File;
  preview: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
}

export interface BatchUploaderState {
  files: UploadingFile[];
  isUploading: boolean;
}

export interface BatchUploaderProps {
  onUploadComplete: (mediaItems: MediaItem[]) => void;
  onError?: (error: Error) => void;
  memoryId: string;
  userId: string;
  maxFiles?: number;
}
