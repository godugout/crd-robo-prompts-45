
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Type definitions
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

// Helper functions
const getFileExtension = (filename: string): string => {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
};

const getMediaType = (mimeType: string): 'image' | 'video' | 'audio' => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  return 'image'; // Default fallback
};

/**
 * Extract metadata from an image file
 */
const extractImageMetadata = async (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      });
    };
    img.onerror = () => {
      reject(new Error('Failed to extract image metadata'));
    };
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Extract metadata from a video file
 */
const extractVideoMetadata = async (file: File): Promise<{ width: number; height: number; duration: number }> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      resolve({
        width: video.videoWidth,
        height: video.videoHeight,
        duration: video.duration
      });
    };
    
    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      reject(new Error('Failed to extract video metadata'));
    };
    
    video.src = URL.createObjectURL(file);
  });
};

/**
 * Generate a thumbnail for images or videos
 */
const generateThumbnail = async (file: File, type: 'image' | 'video'): Promise<Blob> => {
  if (type === 'image') {
    // For images, we can just resize the original
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Target thumbnail size
          const maxSize = 300;
          let width = img.width;
          let height = img.height;
          
          // Calculate new dimensions maintaining aspect ratio
          if (width > height) {
            if (width > maxSize) {
              height = Math.round(height * maxSize / width);
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = Math.round(width * maxSize / height);
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          ctx?.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to generate thumbnail'));
            }
          }, 'image/jpeg', 0.7);
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image for thumbnail generation'));
      };
      
      img.src = URL.createObjectURL(file);
    });
  } else if (type === 'video') {
    // For videos, we extract a frame
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onseeked = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          canvas.toBlob((blob) => {
            URL.revokeObjectURL(video.src);
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to generate video thumbnail'));
            }
          }, 'image/jpeg', 0.7);
        } catch (error) {
          URL.revokeObjectURL(video.src);
          reject(error);
        }
      };
      
      video.onerror = () => {
        URL.revokeObjectURL(video.src);
        reject(new Error('Failed to load video for thumbnail generation'));
      };
      
      video.onloadedmetadata = () => {
        // Seek to 25% of the video duration to grab a representative frame
        video.currentTime = Math.min(video.duration * 0.25, 5.0);
      };
      
      video.src = URL.createObjectURL(file);
    });
  }
  
  throw new Error('Unsupported media type for thumbnail generation');
};

/**
 * Simulate face detection (in a real app, you would call a proper service)
 */
const detectFaces = async (file: File): Promise<{ count: number; locations: Array<{ x: number; y: number; width: number; height: number }> }> => {
  // This is a mock implementation
  // In a real app, you would use a service like AWS Rekognition or Google Vision
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock data
  return {
    count: Math.floor(Math.random() * 3),
    locations: [
      { x: 0.3, y: 0.4, width: 0.2, height: 0.2 }
    ]
  };
};

/**
 * Upload a media file to Supabase Storage
 */
export const uploadMedia = async ({
  file,
  memoryId,
  userId,
  isPrivate = false,
  metadata = {},
  progressCallback
}: MediaUploadParams): Promise<MediaItem> => {
  try {
    // Generate a unique filename
    const uniqueId = uuidv4();
    const ext = getFileExtension(file.name);
    const uniqueFilename = `${uniqueId}.${ext}`;
    const mimeType = file.type;
    const mediaType = getMediaType(mimeType);
    
    // Determine the storage bucket based on privacy setting
    const bucket = isPrivate ? 'private' : 'public';
    const storagePath = `${userId}/${memoryId}/${uniqueFilename}`;
    
    // Extract media metadata based on type
    let width: number | null = null;
    let height: number | null = null;
    let duration: number | null = null;
    
    if (mediaType === 'image') {
      const imgMeta = await extractImageMetadata(file);
      width = imgMeta.width;
      height = imgMeta.height;
    } else if (mediaType === 'video') {
      const videoMeta = await extractVideoMetadata(file);
      width = videoMeta.width;
      height = videoMeta.height;
      duration = videoMeta.duration;
    }
    
    // Generate thumbnail if it's an image or video
    let thumbnailUrl: string | null = null;
    if (mediaType === 'image' || mediaType === 'video') {
      const thumbnail = await generateThumbnail(file, mediaType);
      const thumbnailFilename = `${uniqueId}_thumb.jpg`;
      const thumbnailPath = `${userId}/${memoryId}/${thumbnailFilename}`;
      
      // Upload thumbnail
      const { error: thumbnailError } = await supabase.storage
        .from(bucket)
        .upload(thumbnailPath, thumbnail, {
          contentType: 'image/jpeg',
          upsert: true
        });
        
      if (thumbnailError) {
        throw new Error(`Error uploading thumbnail: ${thumbnailError.message}`);
      }
      
      // Get thumbnail URL
      const { data: thumbnailData } = supabase.storage
        .from(bucket)
        .getPublicUrl(thumbnailPath);
        
      thumbnailUrl = thumbnailData.publicUrl;
    }
    
    // Detect faces if requested in metadata
    if (metadata.detectFaces && mediaType === 'image') {
      const faceDetectionResults = await detectFaces(file);
      metadata = {
        ...metadata,
        faceDetection: faceDetectionResults
      };
    }
    
    // Create an upload controller to track progress
    const uploadController = new AbortController();
    
    // Set up progress tracking
    if (progressCallback) {
      // Set up progress tracking using XMLHttpRequest since Supabase doesn't directly support progress callbacks
      const xhr = new XMLHttpRequest();
      let isProgressTracking = false;
      
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && progressCallback) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          progressCallback(percentComplete);
          isProgressTracking = true;
        }
      };
      
      // If we're not getting progress events after a delay, simulate progress
      setTimeout(() => {
        if (!isProgressTracking && progressCallback) {
          // Simulate progress at 50% if real tracking isn't working
          progressCallback(50);
        }
      }, 500);
    }
    
    // Upload the main file
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(storagePath, file, {
        contentType: mimeType,
        upsert: true,
        signal: uploadController.signal
      });
      
    if (uploadError) {
      throw new Error(`Error uploading file: ${uploadError.message}`);
    }
    
    // Report 100% completion if we have a callback
    if (progressCallback) {
      progressCallback(100);
    }
    
    // Get the file URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(storagePath);
      
    const fileUrl = urlData.publicUrl;
    
    // Create the media record in the database
    const { data: mediaData, error: dbError } = await supabase
      .from('media')
      .insert({
        memoryId,
        type: mediaType,
        url: fileUrl,
        thumbnailUrl,
        originalFilename: file.name,
        size: file.size,
        mimeType,
        width,
        height,
        duration,
        metadata
      })
      .select()
      .single();
      
    if (dbError) {
      // Clean up the uploaded files if database insert fails
      await supabase.storage.from(bucket).remove([storagePath]);
      if (thumbnailUrl) {
        await supabase.storage.from(bucket).remove([`${userId}/${memoryId}/${uniqueId}_thumb.jpg`]);
      }
      throw new Error(`Error creating media record: ${dbError.message}`);
    }
    
    return mediaData as MediaItem;
    
  } catch (error) {
    console.error('Error in uploadMedia:', error);
    throw error;
  }
};

/**
 * Fetch all media associated with a memory
 */
export const getMediaByMemoryId = async (memoryId: string): Promise<MediaItem[]> => {
  try {
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .eq('memoryId', memoryId)
      .order('createdAt', { ascending: false });
      
    if (error) {
      throw new Error(`Error fetching media: ${error.message}`);
    }
    
    return data as MediaItem[];
    
  } catch (error) {
    console.error('Error in getMediaByMemoryId:', error);
    throw error;
  }
};

/**
 * Delete a media item and its associated files
 */
export const deleteMedia = async (mediaId: string, userId: string): Promise<void> => {
  try {
    // First, get the media item to know what to delete
    const { data: mediaItem, error: fetchError } = await supabase
      .from('media')
      .select('*')
      .eq('id', mediaId)
      .single();
      
    if (fetchError) {
      throw new Error(`Error fetching media to delete: ${fetchError.message}`);
    }
    
    if (!mediaItem) {
      throw new Error('Media item not found');
    }
    
    // Extract the path parts from the URL
    const url = new URL(mediaItem.url);
    const pathParts = url.pathname.split('/');
    const filename = pathParts[pathParts.length - 1];
    const memoryId = mediaItem.memoryId;
    
    // Determine the bucket from the URL
    const bucket = url.pathname.includes('/private/') ? 'private' : 'public';
    
    // Define the file paths
    const filePath = `${userId}/${memoryId}/${filename}`;
    
    // Delete the main file
    const { error: deleteFileError } = await supabase.storage
      .from(bucket)
      .remove([filePath]);
      
    if (deleteFileError) {
      console.error(`Warning: Failed to delete main file: ${deleteFileError.message}`);
      // Continue with deletion even if file removal fails
    }
    
    // Delete the thumbnail if it exists
    if (mediaItem.thumbnailUrl) {
      const thumbUrl = new URL(mediaItem.thumbnailUrl);
      const thumbPathParts = thumbUrl.pathname.split('/');
      const thumbFilename = thumbPathParts[thumbPathParts.length - 1];
      const thumbPath = `${userId}/${memoryId}/${thumbFilename}`;
      
      const { error: deleteThumbError } = await supabase.storage
        .from(bucket)
        .remove([thumbPath]);
        
      if (deleteThumbError) {
        console.error(`Warning: Failed to delete thumbnail: ${deleteThumbError.message}`);
        // Continue with deletion even if thumbnail removal fails
      }
    }
    
    // Delete the database record
    const { error: deleteRecordError } = await supabase
      .from('media')
      .delete()
      .eq('id', mediaId);
      
    if (deleteRecordError) {
      throw new Error(`Error deleting media record: ${deleteRecordError.message}`);
    }
    
  } catch (error) {
    console.error('Error in deleteMedia:', error);
    throw error;
  }
};
