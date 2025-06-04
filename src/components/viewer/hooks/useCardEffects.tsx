
import { useMemo } from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import type { EffectValues } from './useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';

interface UseCardEffectsParams {
  card: CardData;
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
  showEffects: boolean;
  overallBrightness: number[];
  interactiveLighting: boolean;
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  materialSettings: MaterialSettings;
  zoom: number;
  rotation: { x: number; y: number };
  isHovering: boolean;
}

export const useCardEffects = (params: UseCardEffectsParams) => {
  const {
    selectedScene,
    selectedLighting,
    overallBrightness,
    mousePosition,
    showEffects,
    effectValues
  } = params;

  const getFrameStyles = useMemo(() => {
    return () => ({
      filter: `brightness(${overallBrightness[0]}%)`,
      transition: 'all 0.3s ease'
    });
  }, [overallBrightness]);

  const getEnhancedEffectStyles = useMemo(() => {
    return () => {
      if (!showEffects) return {};
      
      const styles: React.CSSProperties = {};
      
      // Apply holographic effect
      const holographic = effectValues.holographic;
      if (holographic && typeof holographic.intensity === 'number' && holographic.intensity > 0) {
        styles.background = `linear-gradient(${mousePosition.x * 360}deg, 
          hsl(${mousePosition.x * 360}, 70%, 50%) 0%, 
          hsl(${(mousePosition.x * 360 + 60) % 360}, 70%, 50%) 100%)`;
        styles.opacity = holographic.intensity / 100;
      }
      
      return styles;
    };
  }, [showEffects, effectValues, mousePosition]);

  const getEnvironmentStyle = useMemo(() => {
    return () => ({
      background: selectedScene.backgroundImage || selectedScene.gradient,
      filter: `brightness(${selectedLighting.brightness}%)`
    });
  }, [selectedScene, selectedLighting]);

  const SurfaceTexture = useMemo(() => {
    return <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-white/10 to-transparent" />;
  }, []);

  return {
    getFrameStyles,
    getEnhancedEffectStyles,
    getEnvironmentStyle,
    SurfaceTexture
  };
};
