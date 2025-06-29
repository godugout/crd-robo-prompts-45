
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export interface UploadOptions {
  bucket?: string;
  folder?: string;
  optimize?: boolean;
  generateThumbnail?: boolean;
  tags?: string[];
  metadata?: Record<string, any>;
  onProgress?: (progress: number) => void;
}

export interface MediaFile {
  id: string;
  name: string;
  path: string;
  size: number;
  type: string;
  width?: number;
  height?: number;
  createdAt: string;
  metadata: {
    size: number;
    type: string;
    width?: number;
    height?: number;
    publicUrl: string;
    tags: string[];
    optimized: boolean;
  };
}

export interface CacheStats {
  size: number;
  keys: string[];
}

class MediaManagerClass {
  private cache = new Map<string, any>();
  private readonly DEFAULT_BUCKET = 'media';

  async uploadFile(file: File, options: UploadOptions = {}): Promise<MediaFile | null> {
    const {
      bucket = this.DEFAULT_BUCKET,
      folder = 'uploads',
      optimize = true,
      generateThumbnail = false,
      tags = [],
      metadata = {},
      onProgress
    } = options;

    try {
      // Simulate progress
      onProgress?.(25);
      
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;
      
      onProgress?.(50);
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (error) throw error;
      
      onProgress?.(75);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      onProgress?.(100);

      const mediaFile: MediaFile = {
        id: data.path,
        name: file.name,
        path: data.path,
        size: file.size,
        type: file.type,
        createdAt: new Date().toISOString(),
        metadata: {
          size: file.size,
          type: file.type,
          publicUrl,
          tags,
          optimized: optimize,
          ...metadata
        }
      };

      // Cache the file
      this.cache.set(data.path, mediaFile);

      return mediaFile;
    } catch (error) {
      console.error('Upload failed:', error);
      return null;
    }
  }

  async getFiles(bucket: string = this.DEFAULT_BUCKET): Promise<MediaFile[]> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list();

      if (error) throw error;

      return data?.map(file => ({
        id: file.name,
        name: file.name,
        path: file.name,
        size: file.metadata?.size || 0,
        type: file.metadata?.mimetype || 'unknown',
        createdAt: file.created_at,
        metadata: {
          size: file.metadata?.size || 0,
          type: file.metadata?.mimetype || 'unknown',
          publicUrl: this.getPublicUrl(bucket, file.name),
          tags: [],
          optimized: false
        }
      })) || [];
    } catch (error) {
      console.error('Failed to get files:', error);
      return [];
    }
  }

  async deleteFile(bucket: string, path: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) throw error;

      // Remove from cache
      this.cache.delete(path);
      return true;
    } catch (error) {
      console.error('Failed to delete file:', error);
      return false;
    }
  }

  getPublicUrl(bucket: string, path: string): string {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return data.publicUrl;
  }

  async getCachedImageUrl(src: string): Promise<string> {
    // For now, just return the src as-is
    // In a real implementation, this would check cache and optimize
    return src;
  }

  getCacheStats(): CacheStats {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  clearCache(): void {
    this.cache.clear();
  }

  async optimizeImage(file: File): Promise<File> {
    // Basic optimization - in production this would use image processing
    return file;
  }

  async generateThumbnail(file: File): Promise<File | null> {
    // Basic thumbnail generation - in production this would create actual thumbnails
    return file;
  }
}

export const MediaManager = new MediaManagerClass();
