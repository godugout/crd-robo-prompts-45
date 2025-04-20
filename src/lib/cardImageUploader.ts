
import { supabase } from '@/lib/supabase-client';
import { toast } from 'sonner';

interface UploadCardImageOptions {
  file: File;
  cardId?: string;
  userId: string;
  onProgress?: (progress: number) => void;
}

interface UploadCardImageResult {
  url: string;
  thumbnailUrl: string;
}

export const uploadCardImage = async (options: UploadCardImageOptions): Promise<UploadCardImageResult | null> => {
  const { file, cardId, userId, onProgress } = options;

  try {
    // Create a unique file name
    const ext = file.name.split('.').pop();
    const fileName = `${cardId || 'new'}_${userId}_${Date.now()}.${ext}`;
    const filePath = `card_images/${fileName}`;
    
    // Upload file to Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('cards')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get public URL for the uploaded file
    const { data: publicUrlData } = supabase.storage
      .from('cards')
      .getPublicUrl(filePath);

    if (!publicUrlData || !publicUrlData.publicUrl) {
      throw new Error('Failed to get public URL for uploaded file');
    }

    // Also generate a thumbnail (this would normally involve a server-side function)
    // For now, we'll just use the same image as both the full image and thumbnail
    const thumbnailUrl = publicUrlData.publicUrl;

    return {
      url: publicUrlData.publicUrl,
      thumbnailUrl
    };
  } catch (error) {
    console.error('Error uploading card image:', error);
    toast.error('Failed to upload image');
    return null;
  }
};

export const deleteCardImage = async (url: string): Promise<boolean> => {
  try {
    // Extract the file path from the URL
    const filePathMatch = url.match(/\/cards\/([^?]+)/);
    if (!filePathMatch || !filePathMatch[1]) {
      throw new Error('Invalid file URL');
    }
    
    const filePath = filePathMatch[1];
    
    // Delete the file from storage
    const { error } = await supabase.storage
      .from('cards')
      .remove([filePath]);
      
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting card image:', error);
    toast.error('Failed to delete image');
    return false;
  }
};
