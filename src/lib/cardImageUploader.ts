
import { supabase } from '@/integrations/supabase/client';

interface UploadCardImageParams {
  file: File;
  cardId: string;
  userId: string;
}

interface UploadResult {
  url: string;
  thumbnailUrl?: string;
}

export const uploadCardImage = async ({ 
  file, 
  cardId, 
  userId 
}: UploadCardImageParams): Promise<UploadResult | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${cardId}-${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('card-images')
      .upload(fileName, file);

    if (error) {
      console.error('Upload error:', error);
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('card-images')
      .getPublicUrl(fileName);

    return {
      url: publicUrl,
      thumbnailUrl: publicUrl // For now, use same URL for thumbnail
    };
  } catch (error) {
    console.error('Failed to upload card image:', error);
    return null;
  }
};
