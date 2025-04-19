
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../supabase-client';
import { extractImageMetadata, extractVideoMetadata, getMediaType } from './metadataExtractor';
import { generateThumbnail } from './thumbnailGenerator';
import { detectFaces } from './faceDetector';
import type { MediaItem, MediaUploadParams } from '@/types/media';

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
    const ext = file.name.slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2);
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
