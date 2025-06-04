
import { useState, useEffect, useCallback } from 'react';
import type { EnvironmentScene } from '../types';

interface HDREnvironmentState {
  isLoading: boolean;
  error: string | null;
  environmentMap: string | null;
}

export const useHDREnvironment = (selectedScene: EnvironmentScene) => {
  const [state, setState] = useState<HDREnvironmentState>({
    isLoading: false,
    error: null,
    environmentMap: null
  });

  const loadHDREnvironment = useCallback(async (scene: EnvironmentScene) => {
    if (scene.environmentType !== 'hdr' || !scene.hdrImage) {
      setState({
        isLoading: false,
        error: null,
        environmentMap: null
      });
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // For now, we'll use the HDR image URL directly
      // In a full implementation, you'd load and process the HDR data
      setState({
        isLoading: false,
        error: null,
        environmentMap: scene.hdrImage
      });
    } catch (error) {
      setState({
        isLoading: false,
        error: 'Failed to load HDR environment',
        environmentMap: null
      });
    }
  }, []);

  useEffect(() => {
    loadHDREnvironment(selectedScene);
  }, [selectedScene, loadHDREnvironment]);

  const getEnvironmentStyle = useCallback(() => {
    if (state.environmentMap && selectedScene.environmentType === 'hdr') {
      return {
        background: `
          radial-gradient(circle at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%),
          ${selectedScene.backgroundImage}
        `,
        filter: `brightness(${selectedScene.hdrIntensity || 1.0}) contrast(1.1)`,
      };
    }
    
    // Fallback to gradient
    return {
      background: selectedScene.backgroundImage,
    };
  }, [state.environmentMap, selectedScene]);

  const getEnvironmentLighting = useCallback(() => {
    if (state.environmentMap && selectedScene.environmentType === 'hdr') {
      return {
        ...selectedScene.lighting,
        intensity: selectedScene.lighting.intensity * (selectedScene.hdrIntensity || 1.0),
        environmentMap: state.environmentMap,
        isHDR: true
      };
    }

    return {
      ...selectedScene.lighting,
      isHDR: false
    };
  }, [state.environmentMap, selectedScene]);

  return {
    ...state,
    getEnvironmentStyle,
    getEnvironmentLighting,
    retryLoad: () => loadHDREnvironment(selectedScene)
  };
};
