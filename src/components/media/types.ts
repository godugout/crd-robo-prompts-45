
import { MediaItem } from '@/types/media';

export interface MediaUploaderProps {
  onUploadComplete: (mediaItem: MediaItem) => void;
  onError?: (error: Error) => void;
  memoryId: string;
  userId: string;
}

export interface BatchMediaUploaderProps extends Omit<MediaUploaderProps, 'onUploadComplete'> {
  onUploadComplete: (mediaItems: MediaItem[]) => void;
  maxFiles?: number;
}

export interface MediaGalleryProps {
  mediaItems: MediaItem[];
  onDelete?: (mediaId: string) => Promise<void>;
}
