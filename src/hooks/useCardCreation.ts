import { useState, useCallback } from 'react';
import type { CardCreationState, ImageProcessingOptions } from '@/types/cardCreation';
import { toast } from 'sonner';

const DEFAULT_STATE: CardCreationState = {
  step: 'upload',
  uploadedImage: null,
  imageFile: null,
  cardData: {
    title: 'My Awesome Card',
    description: 'A fantastic trading card created with CRD',
    rarity: 'common',
    effects: {
      holographic: 0,
      metallic: 0,
      chrome: 0,
      particles: false
    }
  },
  processing: false,
  error: null
};

export const useCardCreation = (initialStep?: CardCreationState['step']) => {
  const [state, setState] = useState<CardCreationState>({
    ...DEFAULT_STATE,
    step: initialStep || DEFAULT_STATE.step
  });

  const processImage = useCallback(async (
    file: File, 
    options: ImageProcessingOptions = {
      maxWidth: 1024,
      maxHeight: 1024,
      quality: 0.9,
      format: 'jpeg'
    }
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      if (!ctx) {
        reject(new Error('Canvas not supported'));
        return;
      }

      img.onload = () => {
        // Calculate dimensions maintaining aspect ratio
        let { width, height } = img;
        const aspectRatio = width / height;

        if (width > options.maxWidth) {
          width = options.maxWidth;
          height = width / aspectRatio;
        }
        if (height > options.maxHeight) {
          height = options.maxHeight;
          width = height * aspectRatio;
        }

        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(URL.createObjectURL(blob));
            } else {
              reject(new Error('Failed to process image'));
            }
          },
          `image/${options.format}`,
          options.quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }, []);

  const uploadImage = useCallback(async (file: File) => {
    setState(prev => ({ ...prev, processing: true, error: null }));
    
    try {
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select a valid image file');
      }
      
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('Image must be smaller than 10MB');
      }

      const processedImageUrl = await processImage(file);
      
      setState(prev => ({
        ...prev,
        uploadedImage: processedImageUrl,
        imageFile: file,
        step: 'frame', // Changed from 'customize' to 'frame'
        processing: false
      }));
      
      toast.success('Image uploaded successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setState(prev => ({ ...prev, error: errorMessage, processing: false }));
      toast.error(errorMessage);
    }
  }, [processImage]);

  const updateCardData = useCallback((updates: Partial<CardCreationState['cardData']>) => {
    setState(prev => ({
      ...prev,
      cardData: { ...prev.cardData, ...updates }
    }));
  }, []);

  const nextStep = useCallback(() => {
    setState(prev => {
      const steps: CardCreationState['step'][] = ['upload', 'frame', 'customize', 'preview', 'export'];
      const currentIndex = steps.indexOf(prev.step);
      const nextIndex = Math.min(currentIndex + 1, steps.length - 1);
      return { ...prev, step: steps[nextIndex] };
    });
  }, []);

  const previousStep = useCallback(() => {
    setState(prev => {
      const steps: CardCreationState['step'][] = ['upload', 'frame', 'customize', 'preview', 'export'];
      const currentIndex = steps.indexOf(prev.step);
      const prevIndex = Math.max(currentIndex - 1, 0);
      return { ...prev, step: steps[prevIndex] };
    });
  }, []);

  const reset = useCallback(() => {
    setState(DEFAULT_STATE);
  }, []);

  return {
    state,
    uploadImage,
    updateCardData,
    nextStep,
    previousStep,
    reset
  };
};
