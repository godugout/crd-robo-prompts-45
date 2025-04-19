
import { supabase } from '../supabase-client';
import type { MediaItem } from '@/types/media';

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
