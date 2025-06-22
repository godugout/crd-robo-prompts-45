
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/contexts/AuthContext';
import type { LayoutType } from './useGalleryLayout';

interface GalleryPreferences {
  layout: LayoutType;
  quality: 'low' | 'medium' | 'high' | 'ultra';
  autoRotate: boolean;
  enableParticles: boolean;
  enableAudio: boolean;
  viewHistory: Array<{
    cardId: string;
    timestamp: number;
    duration: number;
  }>;
}

const DEFAULT_PREFERENCES: GalleryPreferences = {
  layout: 'grid',
  quality: 'high',
  autoRotate: false,
  enableParticles: true,
  enableAudio: false,
  viewHistory: []
};

export const useGalleryPreferences = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [localPreferences, setLocalPreferences] = useState<GalleryPreferences | null>(null);

  // Load preferences from Supabase for authenticated users
  const { data: preferences, isLoading } = useQuery({
    queryKey: ['gallery-preferences', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('crd_profiles')
        .select('preferences_3d')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.warn('Failed to load gallery preferences:', error);
        return null;
      }
      
      const prefs = data?.preferences_3d as any;
      return prefs?.galleryPreferences || DEFAULT_PREFERENCES;
    },
    enabled: !!user?.id
  });

  // Save preferences to Supabase
  const savePreferencesMutation = useMutation({
    mutationFn: async (newPreferences: GalleryPreferences) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data: currentData } = await supabase
        .from('crd_profiles')
        .select('preferences_3d')
        .eq('id', user.id)
        .single();
      
      const updatedPrefs = {
        ...currentData?.preferences_3d,
        galleryPreferences: newPreferences
      };
      
      const { error } = await supabase
        .from('crd_profiles')
        .update({ preferences_3d: updatedPrefs })
        .eq('id', user.id);
      
      if (error) throw error;
      return newPreferences;
    },
    onSuccess: (newPreferences) => {
      queryClient.setQueryData(['gallery-preferences', user?.id], newPreferences);
    }
  });

  // Load local preferences for unauthenticated users
  useEffect(() => {
    if (!user?.id) {
      const saved = localStorage.getItem('crd-gallery-preferences');
      if (saved) {
        try {
          setLocalPreferences(JSON.parse(saved));
        } catch (error) {
          console.warn('Failed to parse local gallery preferences:', error);
          setLocalPreferences(DEFAULT_PREFERENCES);
        }
      } else {
        setLocalPreferences(DEFAULT_PREFERENCES);
      }
    }
  }, [user?.id]);

  const currentPreferences = user?.id ? preferences : localPreferences;

  const updatePreferences = async (updates: Partial<GalleryPreferences>) => {
    const newPreferences = { ...currentPreferences, ...updates } as GalleryPreferences;
    
    if (user?.id) {
      // Save to Supabase for authenticated users
      await savePreferencesMutation.mutateAsync(newPreferences);
    } else {
      // Save to localStorage for unauthenticated users
      localStorage.setItem('crd-gallery-preferences', JSON.stringify(newPreferences));
      setLocalPreferences(newPreferences);
    }
  };

  return {
    preferences: currentPreferences || DEFAULT_PREFERENCES,
    isLoading: user?.id ? isLoading : false,
    updatePreferences,
    isUpdating: savePreferencesMutation.isPending
  };
};
