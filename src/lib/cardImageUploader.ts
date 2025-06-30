
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface UploadCardImageOptions {
  file: File;
  cardId: string;
  userId: string;
  onProgress?: (progress: number) => void;
}

export interface UploadResult {
  url: string;
  thumbnailUrl?: string;
  publicUrl: string;
}

export const uploadCardImage = async ({
  file,
  cardId,
  userId,
  onProgress
}: UploadCardImageOptions): Promise<UploadResult | null> => {
  try {
    // Validate file
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return null;
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image must be smaller than 10MB');
      return null;
    }

    // Create unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${cardId}-${userId}-${Date.now()}.${fileExt}`;
    const filePath = `cards/${fileName}`;

    // Simulate progress if callback provided
    if (onProgress) {
      onProgress(10);
    }

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('card-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (onProgress) {
      onProgress(80);
    }

    if (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
      return null;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('card-images')
      .getPublicUrl(data.path);

    if (onProgress) {
      onProgress(100);
    }

    return {
      url: urlData.publicUrl,
      publicUrl: urlData.publicUrl
    };
  } catch (error) {
    console.error('Upload error:', error);
    toast.error('Failed to upload image');
    return null;
  }
};
