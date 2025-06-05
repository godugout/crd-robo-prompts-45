
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
    effectValues,
    isHovering
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
      
      // Check for any active effects and apply subtle base enhancement
      const activeEffects = Object.entries(effectValues).filter(([_, effect]) => 
        effect.intensity && typeof effect.intensity === 'number' && effect.intensity > 0
      );
      
      if (activeEffects.length > 0) {
        // Calculate average intensity for subtle base enhancement
        const avgIntensity = activeEffects.reduce((sum, [_, effect]) => 
          sum + (effect.intensity as number), 0) / activeEffects.length;
        
        // Very subtle base enhancement that works with all effects
        const enhancementFactor = Math.min(avgIntensity / 100 * 0.3, 0.3); // Max 30% enhancement
        styles.filter = `contrast(${1 + enhancementFactor * 0.1}) saturate(${1 + enhancementFactor * 0.2})`;
        styles.transition = 'all 0.3s ease';
        
        // Add subtle hover enhancement
        if (isHovering) {
          const lightBoost = (mousePosition.x * 0.1 + mousePosition.y * 0.1) * enhancementFactor;
          styles.filter += ` brightness(${1 + lightBoost})`;
        }
      }
      
      return styles;
    };
  }, [showEffects, effectValues, isHovering, mousePosition]);

  const getEnvironmentStyle = useMemo(() => {
    return () => ({
      background: selectedScene.backgroundImage || selectedScene.gradient,
      filter: `brightness(${selectedLighting.brightness}%)`,
      transition: 'all 0.5s ease'
    });
  }, [selectedScene, selectedLighting]);

  const SurfaceTexture = useMemo(() => {
    // Enhanced surface texture that works better with effects
    const textureOpacity = showEffects ? 0.05 : 0.1;
    return (
      <div 
        className="absolute inset-0 opacity-10 bg-gradient-to-br from-white/5 to-transparent"
        style={{
          opacity: textureOpacity,
          mixBlendMode: 'overlay',
          background: `
            radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 50%),
            linear-gradient(45deg, rgba(255,255,255,0.05) 0%, transparent 100%)
          `
        }}
      />
    );
  }, [showEffects]);

  // New helper for getting effect-specific blend modes
  const getEffectBlendMode = useMemo(() => {
    return (effectId: string) => {
      const blendModes: Record<string, string> = {
        crystal: 'multiply',
        vintage: 'multiply',
        chrome: 'overlay',
        brushedmetal: 'multiply',
        holographic: 'overlay',
        interference: 'screen',
        prizm: 'overlay',
        foilspray: 'screen'
      };
      return blendModes[effectId] || 'overlay';
    };
  }, []);

  return {
    getFrameStyles,
    getEnhancedEffectStyles,
    getEnvironmentStyle,
    getEffectBlendMode,
    SurfaceTexture
  };
};
