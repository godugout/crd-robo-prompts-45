
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ImageUploadResult {
  url: string;
  path: string;
  publicUrl: string;
}

export const uploadCardImage = async (
  file: File, 
  userId: string, 
  cardId?: string
): Promise<ImageUploadResult | null> => {
  try {
    // Validate file
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file');
      return null;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('Image size must be less than 10MB');
      return null;
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${cardId || Date.now()}.${fileExt}`;

    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from('card-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
      return null;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('card-images')
      .getPublicUrl(data.path);

    return {
      url: publicUrl,
      path: data.path,
      publicUrl
    };
  } catch (error) {
    console.error('Image upload error:', error);
    toast.error('Failed to upload image');
    return null;
  }
};

export const deleteCardImage = async (path: string): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from('card-images')
      .remove([path]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Image delete error:', error);
    return false;
  }
};
