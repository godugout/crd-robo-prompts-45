import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface MediaFile {
  id: string;
  user_id?: string;
  bucket_id: string;
  file_path: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  width?: number;
  height?: number;
  duration?: number;
  thumbnail_path?: string;
  metadata: Record<string, any>;
  tags: string[];
  is_optimized: boolean;
  optimization_variants: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UploadOptions {
  bucket: 'static-assets' | 'user-content' | 'card-assets';
  folder?: string;
  generateThumbnail?: boolean;
  optimize?: boolean;
  tags?: string[];
  metadata?: Record<string, any>;
  onProgress?: (progress: number) => void;
}

export interface OptimizationOptions {
  formats: ('webp' | 'jpeg' | 'png')[];
  sizes: { width: number; height: number; suffix: string }[];
  quality: number;
}

// Helper function to convert Json to Record<string, any>
const parseJsonMetadata = (metadata: any): Record<string, any> => {
  if (typeof metadata === 'string') {
    try {
      return JSON.parse(metadata);
    } catch {
      return {};
    }
  }
  return metadata || {};
};

class MediaManagerClass {
  private readonly maxFileSize = {
    'static-assets': 50 * 1024 * 1024, // 50MB
    'user-content': 100 * 1024 * 1024, // 100MB
    'card-assets': 50 * 1024 * 1024, // 50MB
  };

  async uploadFile(file: File, options: UploadOptions): Promise<MediaFile | null> {
    try {
      // Validate file
      if (!this.validateFile(file, options.bucket)) {
        return null;
      }

      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId && options.bucket !== 'static-assets') {
        toast.error('Authentication required for this upload');
        return null;
      }

      // Generate file path
      const fileName = this.generateFileName(file.name);
      const filePath = this.generateFilePath(options.bucket, fileName, options.folder, userId);

      // Upload to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(options.bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast.error(`Upload failed: ${uploadError.message}`);
        return null;
      }

      // Get file dimensions if it's an image
      const dimensions = await this.getImageDimensions(file);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(options.bucket)
        .getPublicUrl(filePath);

      // Create media file record
      const mediaFileData = {
        user_id: userId,
        bucket_id: options.bucket,
        file_path: filePath,
        file_name: fileName,
        file_size: file.size,
        mime_type: file.type,
        width: dimensions?.width,
        height: dimensions?.height,
        metadata: {
          originalName: file.name,
          publicUrl: urlData.publicUrl,
          ...options.metadata
        },
        tags: options.tags || [],
        is_optimized: false,
        optimization_variants: {}
      };

      const { data: mediaFile, error: dbError } = await supabase
        .from('media_files')
        .insert(mediaFileData)
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        // Clean up uploaded file
        await supabase.storage.from(options.bucket).remove([filePath]);
        toast.error('Failed to save file information');
        return null;
      }

      // Convert the database result to our MediaFile type
      const result: MediaFile = {
        ...mediaFile,
        metadata: parseJsonMetadata(mediaFile.metadata),
        optimization_variants: parseJsonMetadata(mediaFile.optimization_variants)
      };

      // Generate thumbnail if requested
      if (options.generateThumbnail && file.type.startsWith('image/')) {
        await this.generateThumbnail(result, file);
      }

      // Optimize if requested
      if (options.optimize && file.type.startsWith('image/')) {
        this.optimizeImageInBackground(result, file);
      }

      toast.success('File uploaded successfully');
      return result;

    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed');
      return null;
    }
  }

  async getFile(fileId: string): Promise<MediaFile | null> {
    const { data, error } = await supabase
      .from('media_files')
      .select('*')
      .eq('id', fileId)
      .single();

    if (error) {
      console.error('Error fetching file:', error);
      return null;
    }

    return {
      ...data,
      metadata: parseJsonMetadata(data.metadata),
      optimization_variants: parseJsonMetadata(data.optimization_variants)
    };
  }

  async getFiles(options: {
    bucket?: string;
    userId?: string;
    tags?: string[];
    limit?: number;
    offset?: number;
  } = {}): Promise<MediaFile[]> {
    let query = supabase.from('media_files').select('*');

    if (options.bucket) {
      query = query.eq('bucket_id', options.bucket);
    }

    if (options.userId) {
      query = query.eq('user_id', options.userId);
    }

    if (options.tags && options.tags.length > 0) {
      query = query.overlaps('tags', options.tags);
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching files:', error);
      return [];
    }

    return (data || []).map(item => ({
      ...item,
      metadata: parseJsonMetadata(item.metadata),
      optimization_variants: parseJsonMetadata(item.optimization_variants)
    }));
  }

  async deleteFile(fileId: string): Promise<boolean> {
    try {
      const mediaFile = await this.getFile(fileId);
      if (!mediaFile) return false;

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from(mediaFile.bucket_id)
        .remove([mediaFile.file_path]);

      if (storageError) {
        console.error('Storage deletion error:', storageError);
      }

      // Delete thumbnail if exists
      if (mediaFile.thumbnail_path) {
        await supabase.storage
          .from(mediaFile.bucket_id)
          .remove([mediaFile.thumbnail_path]);
      }

      // Delete optimization variants
      const variants = Object.values(mediaFile.optimization_variants || {}) as string[];
      if (variants.length > 0) {
        await supabase.storage
          .from(mediaFile.bucket_id)
          .remove(variants);
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('media_files')
        .delete()
        .eq('id', fileId);

      if (dbError) {
        console.error('Database deletion error:', dbError);
        return false;
      }

      toast.success('File deleted successfully');
      return true;

    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete file');
      return false;
    }
  }

  async updateFileTags(fileId: string, tags: string[]): Promise<boolean> {
    const { error } = await supabase
      .from('media_files')
      .update({ tags })
      .eq('id', fileId);

    if (error) {
      console.error('Error updating tags:', error);
      return false;
    }

    return true;
  }

  getPublicUrl(bucket: string, path: string): string {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  async generateSignedUrl(bucket: string, path: string, expiresIn: number = 3600): Promise<string | null> {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) {
      console.error('Error generating signed URL:', error);
      return null;
    }

    return data.signedUrl;
  }

  private validateFile(file: File, bucket: string): boolean {
    // Check file size
    const maxSize = this.maxFileSize[bucket];
    if (file.size > maxSize) {
      toast.error(`File too large. Maximum size: ${maxSize / 1024 / 1024}MB`);
      return false;
    }

    // Check file type
    const allowedTypes = {
      'static-assets': ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'],
      'user-content': ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'video/mp4', 'video/webm'],
      'card-assets': ['image/png', 'image/jpeg', 'image/webp']
    };

    if (!allowedTypes[bucket].includes(file.type)) {
      toast.error(`File type not allowed for ${bucket} bucket`);
      return false;
    }

    return true;
  }

  private generateFileName(originalName: string): string {
    const extension = originalName.split('.').pop();
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${timestamp}_${random}.${extension}`;
  }

  private generateFilePath(bucket: string, fileName: string, folder?: string, userId?: string): string {
    const parts = [];
    
    if (bucket === 'user-content' && userId) {
      parts.push(userId);
    }
    
    if (folder) {
      parts.push(folder);
    }
    
    parts.push(fileName);
    
    return parts.join('/');
  }

  private async getImageDimensions(file: File): Promise<{ width: number; height: number } | null> {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) {
        resolve(null);
        return;
      }

      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = () => resolve(null);
      img.src = URL.createObjectURL(file);
    });
  }

  private async generateThumbnail(mediaFile: MediaFile, originalFile: File): Promise<void> {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = async () => {
        // Calculate thumbnail dimensions (max 300px)
        const maxSize = 300;
        const ratio = Math.min(maxSize / img.width, maxSize / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(async (blob) => {
          if (!blob) return;

          const thumbnailPath = mediaFile.file_path.replace(/\.[^/.]+$/, '_thumb.webp');
          
          const { error } = await supabase.storage
            .from(mediaFile.bucket_id)
            .upload(thumbnailPath, blob, {
              contentType: 'image/webp',
              cacheControl: '3600'
            });

          if (!error) {
            await supabase
              .from('media_files')
              .update({ thumbnail_path: thumbnailPath })
              .eq('id', mediaFile.id);
          }
        }, 'image/webp', 0.8);
      };

      img.src = URL.createObjectURL(originalFile);
    } catch (error) {
      console.error('Thumbnail generation error:', error);
    }
  }

  private async optimizeImageInBackground(mediaFile: MediaFile, originalFile: File): Promise<void> {
    // This would run in the background without blocking
    setTimeout(async () => {
      try {
        const variants: Record<string, string> = {};
        
        // Generate WebP version
        const webpBlob = await this.convertToWebP(originalFile);
        if (webpBlob) {
          const webpPath = mediaFile.file_path.replace(/\.[^/.]+$/, '.webp');
          const { error } = await supabase.storage
            .from(mediaFile.bucket_id)
            .upload(webpPath, webpBlob);
          
          if (!error) {
            variants.webp = webpPath;
          }
        }

        // Update database with optimization variants
        if (Object.keys(variants).length > 0) {
          await supabase
            .from('media_files')
            .update({ 
              is_optimized: true,
              optimization_variants: variants 
            })
            .eq('id', mediaFile.id);
        }
      } catch (error) {
        console.error('Optimization error:', error);
      }
    }, 1000);
  }

  private async convertToWebP(file: File): Promise<Blob | null> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/webp', 0.85);
      };

      img.onerror = () => resolve(null);
      img.src = URL.createObjectURL(file);
    });
  }
}

export const MediaManager = new MediaManagerClass();
