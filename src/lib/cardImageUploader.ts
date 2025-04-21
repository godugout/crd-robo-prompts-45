
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
    
    // Simulate progress updates
    if (onProgress) {
      const simulateProgress = () => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          onProgress(progress);
          if (progress >= 90) {
            clearInterval(interval);
          }
        }, 200);
        return interval;
      };
      
      const progressInterval = simulateProgress();
      
      // Clear interval when done
      setTimeout(() => {
        clearInterval(progressInterval);
        onProgress(100);
      }, 2500);
    }
    
    // Upload file to Storage (for testing without auth, we'll skip the actual upload)
    // In a real environment, we would use the following code:
    /*
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('cards')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }
    */
    
    // Instead, we'll simulate a successful upload by generating a fake URL
    // This is only for testing without authentication
    const mockPublicUrl = URL.createObjectURL(file);
    
    return {
      url: mockPublicUrl,
      thumbnailUrl: mockPublicUrl
    };
  } catch (error) {
    console.error('Error uploading card image:', error);
    toast.error('Failed to upload image');
    return null;
  }
};

export const deleteCardImage = async (url: string): Promise<boolean> => {
  // For testing without auth, we'll just return true
  return true;
  
  /* Real implementation would be:
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
  */
};
