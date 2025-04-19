
import { supabase } from '../supabase-client';

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
