
import { useState, useEffect } from 'react';

export interface GalleryPreferences {
  layout: 'grid' | 'circle' | 'spiral';
  autoRotate: boolean;
  quality: 'low' | 'medium' | 'high' | 'ultra';
  showConnections: boolean;
  particleEffects: boolean;
  viewHistory: Array<{
    cardId: string;
    timestamp: number;
    duration: number;
  }>;
}

export const useGalleryPreferences = () => {
  const [preferences, setPreferences] = useState<GalleryPreferences>({
    layout: 'grid',
    autoRotate: false,
    quality: 'high',
    showConnections: true,
    particleEffects: true,
    viewHistory: []
  });

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('gallery-preferences');
    if (saved) {
      try {
        setPreferences(JSON.parse(saved));
      } catch (error) {
        console.warn('Failed to load gallery preferences:', error);
      }
    }
  }, []);

  const updatePreferences = (newPreferences: Partial<GalleryPreferences>) => {
    const updated = { ...preferences, ...newPreferences };
    setPreferences(updated);
    localStorage.setItem('gallery-preferences', JSON.stringify(updated));
  };

  return {
    preferences,
    updatePreferences
  };
};
