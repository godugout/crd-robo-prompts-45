
import { supabase } from '@/integrations/supabase/client';
import { thumbnailCache } from '@/lib/thumbnailCache';
import { toast } from 'sonner';

export interface UploadOptions {
  bucket?: string;
  folder?: string;
  generateThumbnail?: boolean;
  optimize?: boolean;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  tags?: string[];
  onProgress?: (progress: number) => void;
}

export interface MediaFile {
  id: string;
  path: string;
  url: string;
  thumbnailUrl?: string;
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

class MediaManagerClass {
  private cache = new Map<string, MediaFile>();
  private uploadQueue: Array<{ file: File; options: UploadOptions; resolve: Function; reject: Function }> = [];
  private isProcessingQueue = false;

  async uploadFile(file: File, options: UploadOptions = {}): Promise<MediaFile | null> {
    const {
      bucket = 'card-assets',
      folder = 'uploads',
      generateThumbnail = true,
      optimize = true,
      maxWidth = 2048,
      maxHeight = 2048,
      quality = 0.85,
      tags = [],
      onProgress
    } = options;

    try {
      onProgress?.(0);

      // Optimize image if requested
      let fileToUpload = file;
      if (optimize && file.type.startsWith('image/')) {
        fileToUpload = await this.optimizeImage(file, maxWidth, maxHeight, quality);
        onProgress?.(25);
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop() || 'bin';
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

      // Upload main file
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, fileToUpload, {
          contentType: file.type,
          upsert: false
        });

      if (uploadError) throw uploadError;
      onProgress?.(60);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(uploadData.path);

      let thumbnailUrl: string | undefined;

      // Generate thumbnail if requested
      if (generateThumbnail && file.type.startsWith('image/')) {
        thumbnailUrl = await this.generateAndUploadThumbnail(file, bucket, folder);
        onProgress?.(80);
      }

      // Get image dimensions
      const dimensions = await this.getImageDimensions(file);

      // Create media file record
      const mediaFile: MediaFile = {
        id: uploadData.path,
        path: uploadData.path,
        url: publicUrl,
        thumbnailUrl,
        metadata: {
          size: fileToUpload.size,
          type: file.type,
          width: dimensions.width,
          height: dimensions.height,
          publicUrl,
          tags,
          optimized: optimize
        }
      };

      // Save to database
      await this.saveMediaRecord(mediaFile);

      // Cache the result
      this.cache.set(mediaFile.id, mediaFile);
      onProgress?.(100);

      return mediaFile;
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  }

  private async optimizeImage(file: File, maxWidth: number, maxHeight: number, quality: number): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const optimizedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              });
              resolve(optimizedFile);
            } else {
              reject(new Error('Failed to optimize image'));
            }
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  private async generateAndUploadThumbnail(file: File, bucket: string, folder: string): Promise<string> {
    const thumbnail = await this.createThumbnail(file, 300, 300);
    const thumbFileName = `${folder}/thumbs/${Date.now()}-thumb.jpg`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(thumbFileName, thumbnail, {
        contentType: 'image/jpeg'
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return publicUrl;
  }

  private async createThumbnail(file: File, maxWidth: number, maxHeight: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => blob ? resolve(blob) : reject(new Error('Failed to create thumbnail')),
          'image/jpeg',
          0.8
        );
      };

      img.onerror = () => reject(new Error('Failed to load image for thumbnail'));
      img.src = URL.createObjectURL(file);
    });
  }

  private async getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.onerror = () => reject(new Error('Failed to get image dimensions'));
      img.src = URL.createObjectURL(file);
    });
  }

  private async saveMediaRecord(mediaFile: MediaFile): Promise<void> {
    const { error } = await supabase
      .from('media_files')
      .insert({
        file_path: mediaFile.path,
        file_name: mediaFile.path.split('/').pop() || 'unknown',
        file_size: mediaFile.metadata.size,
        mime_type: mediaFile.metadata.type,
        width: mediaFile.metadata.width,
        height: mediaFile.metadata.height,
        thumbnail_path: mediaFile.thumbnailUrl,
        metadata: mediaFile.metadata,
        tags: mediaFile.metadata.tags,
        is_optimized: mediaFile.metadata.optimized,
        bucket_id: 'card-assets'
      });

    if (error) {
      console.error('Failed to save media record:', error);
    }
  }

  async getMediaFile(id: string): Promise<MediaFile | null> {
    // Check cache first
    const cached = this.cache.get(id);
    if (cached) return cached;

    // Fetch from database
    try {
      const { data, error } = await supabase
        .from('media_files')
        .select('*')
        .eq('file_path', id)
        .single();

      if (error || !data) return null;

      const mediaFile: MediaFile = {
        id: data.file_path,
        path: data.file_path,
        url: data.metadata.publicUrl,
        thumbnailUrl: data.thumbnail_path || undefined,
        metadata: data.metadata
      };

      this.cache.set(id, mediaFile);
      return mediaFile;
    } catch (error) {
      console.error('Failed to fetch media file:', error);
      return null;
    }
  }

  async deleteMediaFile(id: string): Promise<boolean> {
    try {
      const mediaFile = await this.getMediaFile(id);
      if (!mediaFile) return false;

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('card-assets')
        .remove([mediaFile.path]);

      if (storageError) {
        console.error('Failed to delete from storage:', storageError);
      }

      // Delete thumbnail if exists
      if (mediaFile.thumbnailUrl) {
        const thumbPath = mediaFile.thumbnailUrl.split('/').slice(-2).join('/');
        await supabase.storage
          .from('card-assets')
          .remove([`thumbs/${thumbPath}`]);
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('media_files')
        .delete()
        .eq('file_path', id);

      if (dbError) {
        console.error('Failed to delete from database:', dbError);
        return false;
      }

      // Remove from cache
      this.cache.delete(id);
      return true;
    } catch (error) {
      console.error('Failed to delete media file:', error);
      return false;
    }
  }

  async getCachedImageUrl(url: string): Promise<string> {
    try {
      return await thumbnailCache.getThumbnail(url);
    } catch (error) {
      console.warn('Failed to get cached image:', error);
      return url;
    }
  }

  clearCache(): void {
    this.cache.clear();
    thumbnailCache.clearCache();
  }

  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

export const MediaManager = new MediaManagerClass();
