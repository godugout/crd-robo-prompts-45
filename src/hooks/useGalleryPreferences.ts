
import { useState } from 'react';
import type { LayoutType } from '@/hooks/useGalleryLayout';

interface ViewHistoryItem {
  cardId: string;
  timestamp: number;
  duration: number;
}

interface GalleryPreferences {
  layout: LayoutType;
  autoRotate: boolean;
  quality: 'low' | 'medium' | 'high' | 'ultra';
  enableSounds: boolean;
  viewHistory: ViewHistoryItem[];
}

export const useGalleryPreferences = () => {
  const [preferences, setPreferences] = useState<GalleryPreferences>({
    layout: 'grid',
    autoRotate: false,
    quality: 'high',
    enableSounds: true,
    viewHistory: []
  });

  const updatePreferences = (newPreferences: Partial<GalleryPreferences>) => {
    setPreferences(prev => ({ ...prev, ...newPreferences }));
  };

  return {
    preferences,
    updatePreferences
  };
};
