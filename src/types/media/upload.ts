
import type { MediaMetadata } from './metadata';

export interface ProgressCallback {
  (progress: number): void;
}

export interface MediaUploadParams {
  file: File;
  memoryId: string;
  userId: string;
  isPrivate?: boolean;
  metadata?: MediaMetadata;
  progressCallback?: ProgressCallback;
}
