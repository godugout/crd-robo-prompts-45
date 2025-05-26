
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
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Please select a valid image file');
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error('File size must be less than 10MB');
    }

    // Create a unique file name
    const ext = file.name.split('.').pop() || 'jpg';
    const timestamp = Date.now();
    const fileName = `${cardId || 'new'}_${userId}_${timestamp}.${ext}`;
    const filePath = `card_images/${fileName}`;
    
    // Simulate progress updates
    if (onProgress) {
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 15;
        if (progress <= 90) {
          onProgress(progress);
        }
        if (progress >= 90) {
          clearInterval(progressInterval);
        }
      }, 200);
      
      // Complete progress when done
      setTimeout(() => {
        clearInterval(progressInterval);
        if (onProgress) onProgress(100);
      }, 2000);
    }
    
    // For development/testing without storage setup, create a local URL
    // In production, you would uncomment the actual upload code below
    const mockPublicUrl = URL.createObjectURL(file);
    
    // Store file reference in localStorage for persistence during session
    const fileData = {
      url: mockPublicUrl,
      name: fileName,
      size: file.size,
      type: file.type,
      timestamp
    };
    
    localStorage.setItem(`card_image_${fileName}`, JSON.stringify(fileData));
    
    /* 
    // Actual Supabase Storage upload (uncomment when storage is configured)
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('card-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('card-images')
      .getPublicUrl(filePath);
    
    const publicUrl = urlData.publicUrl;
    */
    
    return {
      url: mockPublicUrl,
      thumbnailUrl: mockPublicUrl // Using same URL for thumbnail in development
    };
  } catch (error) {
    console.error('Error uploading card image:', error);
    
    if (error instanceof Error) {
      toast.error(`Upload failed: ${error.message}`);
    } else {
      toast.error('Failed to upload image');
    }
    
    return null;
  }
};

export const deleteCardImage = async (url: string): Promise<boolean> => {
  try {
    // For development with local URLs, just revoke the object URL
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
      return true;
    }
    
    /* 
    // Actual Supabase Storage deletion (uncomment when storage is configured)
    const filePathMatch = url.match(/\/card-images\/([^?]+)/);
    if (!filePathMatch || !filePathMatch[1]) {
      throw new Error('Invalid file URL');
    }
    
    const filePath = filePathMatch[1];
    
    const { error } = await supabase.storage
      .from('card-images')
      .remove([filePath]);
      
    if (error) {
      throw error;
    }
    */
    
    return true;
  } catch (error) {
    console.error('Error deleting card image:', error);
    toast.error('Failed to delete image');
    return false;
  }
};
