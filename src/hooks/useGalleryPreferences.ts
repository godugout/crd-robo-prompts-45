
import { useState, useCallback } from 'react';
import type { LayoutType } from './useGalleryLayout';

interface GalleryPreferences {
  layout: LayoutType;
  autoRotate: boolean;
  quality: 'low' | 'medium' | 'high' | 'ultra';
  enableParticles: boolean;
  viewHistory: Array<{
    cardId: string;
    timestamp: number;
    duration: number;
  }>;
}

const defaultPreferences: GalleryPreferences = {
  layout: 'grid',
  autoRotate: false,
  quality: 'high',
  enableParticles: true,
  viewHistory: []
};

export const useGalleryPreferences = () => {
  const [preferences, setPreferences] = useState<GalleryPreferences>(() => {
    try {
      const saved = localStorage.getItem('galleryPreferences');
      return saved ? { ...defaultPreferences, ...JSON.parse(saved) } : defaultPreferences;
    } catch {
      return defaultPreferences;
    }
  });

  const updatePreferences = useCallback((newPreferences: Partial<GalleryPreferences>) => {
    setPreferences(prev => {
      const updated = { ...prev, ...newPreferences };
      try {
        localStorage.setItem('galleryPreferences', JSON.stringify(updated));
      } catch (error) {
        console.warn('Failed to save gallery preferences:', error);
      }
      return updated;
    });
  }, []);

  return {
    preferences,
    updatePreferences
  };
};
