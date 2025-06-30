
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface FrameData {
  id: string;
  name: string;
  category: string;
  rarity: string;
  effects: string[];
}

interface EffectData {
  id: string;
  type: string;
  intensity: number;
  parameters: Record<string, any>;
}

interface ShowcaseData {
  id: string;
  name: string;
  environment: string;
  lighting: string;
}

export const useEnhancedCardCreation = () => {
  const [selectedFrame, setSelectedFrame] = useState<FrameData | null>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [selectedEffects, setSelectedEffects] = useState<EffectData[]>([]);
  const [selectedShowcase, setSelectedShowcase] = useState<ShowcaseData | null>(null);

  const cardData = {
    frame: selectedFrame,
    image: uploadedImage,
    effects: selectedEffects,
    showcase: selectedShowcase,
    createdAt: new Date().toISOString()
  };

  const selectFrame = useCallback((frame: FrameData) => {
    setSelectedFrame(frame);
    // Auto-apply frame's built-in effects
    const frameEffects: EffectData[] = frame.effects.map(effectType => ({
      id: `${effectType}-${Date.now()}`,
      type: effectType,
      intensity: 50,
      parameters: {}
    }));
    setSelectedEffects(frameEffects);
    toast.success(`${frame.name} frame selected`);
  }, []);

  const uploadImage = useCallback((file: File) => {
    setUploadedImage(file);
    toast.success('Image uploaded successfully');
  }, []);

  const updateEffects = useCallback((effects: EffectData[]) => {
    setSelectedEffects(effects);
    toast.success('Effects updated');
  }, []);

  const selectShowcase = useCallback((showcase: ShowcaseData) => {
    setSelectedShowcase(showcase);
    toast.success(`${showcase.name} showcase selected`);
  }, []);

  const exportCard = useCallback((format: string) => {
    toast.success(`Card exported as ${format.toUpperCase()}`);
  }, []);

  return {
    selectedFrame,
    uploadedImage,
    selectedEffects,
    selectedShowcase,
    cardData,
    selectFrame,
    uploadImage,
    updateEffects,
    selectShowcase,
    exportCard
  };
};
