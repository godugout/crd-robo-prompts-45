
import { supabase } from '@/lib/supabase-client';

interface UploadCardImageParams {
  file: File;
  cardId: string;
  userId: string;
  onProgress?: (progress: number) => void;
}

interface UploadResult {
  url: string;
  thumbnailUrl?: string;
}

export const uploadCardImage = async ({ 
  file, 
  cardId, 
  userId, 
  onProgress 
}: UploadCardImageParams): Promise<UploadResult | null> => {
  try {
    // Create a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${cardId}-${Date.now()}.${fileExt}`;

    // Upload to a public bucket (you may need to create this bucket)
    const { data, error } = await supabase.storage
      .from('card-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('card-images')
      .getPublicUrl(fileName);

    return {
      url: urlData.publicUrl,
      thumbnailUrl: urlData.publicUrl // For now, use the same URL for thumbnail
    };
  } catch (error) {
    console.error('Upload error:', error);
    return null;
  }
};
