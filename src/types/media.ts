
export interface MediaMetadata {
  detectFaces?: boolean;
  faceDetection?: {
    count: number;
    locations: Array<{ x: number; y: number; width: number; height: number }>;
  };
  alt?: string;
  caption?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  tags?: string[];
  customFields?: Record<string, any>;
}

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
