
import { v4 as uuidv4 } from 'uuid';
import { supabase } from './supabase-client';
import { extractImageMetadata, extractVideoMetadata, getMediaType } from './media/metadataExtractor';
import { generateThumbnail } from './media/thumbnailGenerator';
import { detectFaces } from './media/faceDetector';
import type { MediaItem, MediaUploadParams, MediaMetadata } from '@/types/media';

const getFileExtension = (filename: string): string => {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
};

export const uploadMedia = async ({
  file,
  memoryId,
  userId,
  isPrivate = false,
  metadata = {},
  progressCallback
}: MediaUploadParams): Promise<MediaItem> => {
  try {
    const uniqueId = uuidv4();
    const ext = getFileExtension(file.name);
    const uniqueFilename = `${uniqueId}.${ext}`;
    const mimeType = file.type;
    const mediaType = getMediaType(mimeType);
    
    const bucket = isPrivate ? 'private' : 'public';
    const storagePath = `${userId}/${memoryId}/${uniqueFilename}`;
    
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
    
    let thumbnailUrl: string | null = null;
    if (mediaType === 'image' || mediaType === 'video') {
      const thumbnail = await generateThumbnail(file, mediaType);
      const thumbnailFilename = `${uniqueId}_thumb.jpg`;
      const thumbnailPath = `${userId}/${memoryId}/${thumbnailFilename}`;
      
      const { error: thumbnailError } = await supabase.storage
        .from(bucket)
        .upload(thumbnailPath, thumbnail, {
          contentType: 'image/jpeg',
          upsert: true
        });
        
      if (thumbnailError) {
        throw new Error(`Error uploading thumbnail: ${thumbnailError.message}`);
      }
      
      const { data: thumbnailData } = supabase.storage
        .from(bucket)
        .getPublicUrl(thumbnailPath);
        
      thumbnailUrl = thumbnailData.publicUrl;
    }
    
    if (metadata.detectFaces && mediaType === 'image') {
      const faceDetectionResults = await detectFaces(file);
      metadata = {
        ...metadata,
        faceDetection: faceDetectionResults
      };
    }
    
    if (progressCallback) {
      const xhr = new XMLHttpRequest();
      let isProgressTracking = false;
      
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && progressCallback) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          progressCallback(percentComplete);
          isProgressTracking = true;
        }
      };
      
      setTimeout(() => {
        if (!isProgressTracking && progressCallback) {
          progressCallback(50);
        }
      }, 500);
    }
    
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(storagePath, file, {
        contentType: mimeType,
        upsert: true
      });
      
    if (uploadError) {
      throw new Error(`Error uploading file: ${uploadError.message}`);
    }
    
    if (progressCallback) {
      progressCallback(100);
    }
    
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(storagePath);
      
    const fileUrl = urlData.publicUrl;
    
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

export const deleteMedia = async (mediaId: string, userId: string): Promise<void> => {
  try {
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
    
    const url = new URL(mediaItem.url);
    const pathParts = url.pathname.split('/');
    const filename = pathParts[pathParts.length - 1];
    const memoryId = mediaItem.memoryId;
    
    const bucket = url.pathname.includes('/private/') ? 'private' : 'public';
    const filePath = `${userId}/${memoryId}/${filename}`;
    
    const { error: deleteFileError } = await supabase.storage
      .from(bucket)
      .remove([filePath]);
      
    if (deleteFileError) {
      console.error(`Warning: Failed to delete main file: ${deleteFileError.message}`);
    }
    
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
      }
    }
    
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
