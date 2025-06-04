
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
      
      // Check for any active effects and apply base enhancement
      const hasActiveEffects = Object.values(effectValues).some(effect => 
        effect.intensity && typeof effect.intensity === 'number' && effect.intensity > 0
      );
      
      if (hasActiveEffects) {
        // Subtle base enhancement that works with all effects
        styles.filter = `contrast(1.05) saturate(1.1)`;
        styles.transition = 'all 0.3s ease';
      }
      
      return styles;
    };
  }, [showEffects, effectValues]);

  const getEnvironmentStyle = useMemo(() => {
    return () => ({
      background: selectedScene.backgroundImage || selectedScene.gradient,
      filter: `brightness(${selectedLighting.brightness}%)`
    });
  }, [selectedScene, selectedLighting]);

  const SurfaceTexture = useMemo(() => {
    return <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-white/5 to-transparent" />;
  }, []);

  return {
    getFrameStyles,
    getEnhancedEffectStyles,
    getEnvironmentStyle,
    SurfaceTexture
  };
};
