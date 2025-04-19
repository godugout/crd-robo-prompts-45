
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
