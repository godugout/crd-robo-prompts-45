
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/contexts/AuthContext';

interface QualitySettings {
  renderQuality: 'low' | 'medium' | 'high' | 'ultra';
  enableParticles: boolean;
  enableShaders: boolean;
  enableHaptics: boolean;
  autoAdjustQuality: boolean;
  batteryOptimization: boolean;
  accessibilityMode: boolean;
}

const DEFAULT_SETTINGS: QualitySettings = {
  renderQuality: 'high',
  enableParticles: true,
  enableShaders: true,
  enableHaptics: true,
  autoAdjustQuality: true,
  batteryOptimization: true,
  accessibilityMode: false
};

export const use3DQualitySettings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [localSettings, setLocalSettings] = useState<QualitySettings | null>(null);

  // Detect device capabilities and adjust default settings
  useEffect(() => {
    const detectOptimalSettings = () => {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      
      if (!gl) {
        return { ...DEFAULT_SETTINGS, renderQuality: 'low' as const };
      }
      
      const isMobile = /Mobile|Android|iPhone|iPad/.test(navigator.userAgent);
      const hasHighPerformance = gl.getParameter(gl.MAX_TEXTURE_SIZE) >= 4096;
      
      let quality: QualitySettings['renderQuality'] = 'medium';
      
      if (isMobile) {
        quality = hasHighPerformance ? 'medium' : 'low';
      } else {
        quality = hasHighPerformance ? 'high' : 'medium';
      }
      
      canvas.remove();
      
      return {
        ...DEFAULT_SETTINGS,
        renderQuality: quality,
        enableParticles: !isMobile || hasHighPerformance,
        enableShaders: quality !== 'low'
      };
    };
    
    if (!user?.id && !localSettings) {
      const optimal = detectOptimalSettings();
      setLocalSettings(optimal);
    }
  }, [user?.id, localSettings]);

  // Load settings from Supabase for authenticated users
  const { data: settings, isLoading } = useQuery({
    queryKey: ['3d-quality-settings', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('crd_profiles')
        .select('preferences_3d')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.warn('Failed to load 3D quality settings:', error);
        return null;
      }
      
      const prefs = data?.preferences_3d as any;
      return prefs?.qualitySettings || DEFAULT_SETTINGS;
    },
    enabled: !!user?.id
  });

  // Save settings to Supabase
  const saveSettingsMutation = useMutation({
    mutationFn: async (newSettings: QualitySettings) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data: currentData } = await supabase
        .from('crd_profiles')
        .select('preferences_3d')
        .eq('id', user.id)
        .single();
      
      const updatedPrefs = {
        ...currentData?.preferences_3d,
        qualitySettings: newSettings
      };
      
      const { error } = await supabase
        .from('crd_profiles')
        .update({ preferences_3d: updatedPrefs })
        .eq('id', user.id);
      
      if (error) throw error;
      return newSettings;
    },
    onSuccess: (newSettings) => {
      queryClient.setQueryData(['3d-quality-settings', user?.id], newSettings);
    }
  });

  const currentSettings = user?.id ? settings : localSettings;

  const updateSettings = async (updates: Partial<QualitySettings>) => {
    const newSettings = { ...currentSettings, ...updates } as QualitySettings;
    
    if (user?.id) {
      await saveSettingsMutation.mutateAsync(newSettings);
    } else {
      localStorage.setItem('crd-3d-quality-settings', JSON.stringify(newSettings));
      setLocalSettings(newSettings);
    }
  };

  // Auto-adjust quality based on performance
  const adjustQualityForPerformance = (fps: number) => {
    if (!currentSettings?.autoAdjustQuality) return;
    
    if (fps < 30 && currentSettings.renderQuality !== 'low') {
      const newQuality = currentSettings.renderQuality === 'ultra' ? 'high' :
                        currentSettings.renderQuality === 'high' ? 'medium' : 'low';
      updateSettings({ renderQuality: newQuality });
    } else if (fps > 55 && currentSettings.renderQuality !== 'ultra') {
      const newQuality = currentSettings.renderQuality === 'low' ? 'medium' :
                        currentSettings.renderQuality === 'medium' ? 'high' : 'ultra';
      updateSettings({ renderQuality: newQuality });
    }
  };

  return {
    settings: currentSettings || DEFAULT_SETTINGS,
    isLoading: user?.id ? isLoading : false,
    updateSettings,
    adjustQualityForPerformance,
    isUpdating: saveSettingsMutation.isPending
  };
};
