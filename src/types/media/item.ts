
import type { MediaMetadata } from './metadata';

export interface MediaItem {
  id: string;
  memoryId: string;
  type: 'image' | 'video' | 'audio';
  url: string;
  thumbnailUrl: string | null;
  originalFilename: string | null;
  size: number | null;
  mimeType: string | null;
  width: number | null;
  height: number | null;
  duration: number | null;
  metadata: MediaMetadata | null;
  createdAt: string;
}
