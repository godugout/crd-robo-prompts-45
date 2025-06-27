
import { useState, useCallback } from 'react';
import type { UnifiedCardData } from '@/types/cardCreation';

export type CreationStep = 'upload' | 'frame' | 'customize' | 'preview' | 'export';
export type CardRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

interface CreationState {
  step: CreationStep;
  uploadedImage: string | null;
  cardData: UnifiedCardData;
  processing: boolean;
  error: string | null;
}

const initialCardData: UnifiedCardData = {
  title: '',
  description: '',
  frame: 'classic-sports', // Default frame
  rarity: 'common',
  effects: {
    holographic: 0,
    metallic: 0,
    chrome: 0,
    particles: false
  }
};

export const useCardCreation = () => {
  const [state, setState] = useState<CreationState>({
    step: 'upload',
    uploadedImage: null,
    cardData: initialCardData,
    processing: false,
    error: null
  });

  const uploadImage = useCallback(async (file: File) => {
    setState(prev => ({ ...prev, processing: true, error: null }));

    try {
      // Create object URL for immediate preview
      const imageUrl = URL.createObjectURL(file);
      
      setState(prev => ({
        ...prev,
        uploadedImage: imageUrl,
        processing: false,
        step: 'frame'
      }));
    } catch (error) {
      console.error('Upload error:', error);
      setState(prev => ({
        ...prev,
        processing: false,
        error: 'Failed to upload image. Please try again.'
      }));
    }
  }, []);

  const updateCardData = useCallback((updates: Partial<UnifiedCardData>) => {
    setState(prev => ({
      ...prev,
      cardData: { ...prev.cardData, ...updates }
    }));
  }, []);

  const nextStep = useCallback(() => {
    setState(prev => {
      const steps: CreationStep[] = ['upload', 'frame', 'customize', 'preview', 'export'];
      const currentIndex = steps.indexOf(prev.step);
      const nextIndex = Math.min(currentIndex + 1, steps.length - 1);
      return { ...prev, step: steps[nextIndex] };
    });
  }, []);

  const previousStep = useCallback(() => {
    setState(prev => {
      const steps: CreationStep[] = ['upload', 'frame', 'customize', 'preview', 'export'];
      const currentIndex = steps.indexOf(prev.step);
      const prevIndex = Math.max(currentIndex - 1, 0);
      return { ...prev, step: steps[prevIndex] };
    });
  }, []);

  const reset = useCallback(() => {
    setState({
      step: 'upload',
      uploadedImage: null,
      cardData: initialCardData,
      processing: false,
      error: null
    });
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
