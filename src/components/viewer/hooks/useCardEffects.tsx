
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
    effectValues,
    isHovering,
    interactiveLighting,
    materialSettings
  } = params;

  // Material Properties Effects
  const getMaterialEffects = useMemo(() => {
    return () => {
      if (!materialSettings) return {};
      
      const { roughness, metalness, clearcoat, reflectivity } = materialSettings;
      
      // Base material filtering
      const roughnessFilter = roughness > 50 
        ? `blur(${(roughness - 50) * 0.02}px) contrast(${1 - (roughness - 50) * 0.002})`
        : `contrast(${1 + (50 - roughness) * 0.002}) saturate(${1 + (50 - roughness) * 0.004})`;
      
      const metalnessFilter = metalness > 0 
        ? `contrast(${1 + metalness * 0.01}) saturate(${0.8 + metalness * 0.004}) hue-rotate(${metalness * 0.3}deg)`
        : '';
      
      const clearcoatFilter = clearcoat > 0 
        ? `brightness(${1 + clearcoat * 0.005}) contrast(${1 + clearcoat * 0.008})`
        : '';
      
      const combinedFilter = [roughnessFilter, metalnessFilter, clearcoatFilter]
        .filter(Boolean)
        .join(' ');
      
      return {
        filter: combinedFilter || 'none',
        transition: 'filter 0.3s ease'
      };
    };
  }, [materialSettings]);

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
        
        // Add subtle interactive lighting enhancement
        if (interactiveLighting && isHovering) {
          const lightBoost = (mousePosition.x * 0.1 + mousePosition.y * 0.1) * enhancementFactor;
          styles.filter += ` brightness(${1 + lightBoost})`;
        }
      }
      
      return styles;
    };
  }, [showEffects, effectValues, interactiveLighting, isHovering, mousePosition]);

  const getEnvironmentStyle = useMemo(() => {
    return () => ({
      background: selectedScene.backgroundImage || selectedScene.gradient,
      filter: `brightness(${selectedLighting.brightness}%)`,
      transition: 'all 0.5s ease'
    });
  }, [selectedScene, selectedLighting]);

  // Material-based surface texture that responds to material properties
  const MaterialSurfaceTexture = useMemo(() => {
    if (!materialSettings) return null;
    
    const { roughness, metalness, clearcoat, reflectivity } = materialSettings;
    
    // Roughness texture - more noise patterns for higher roughness
    const roughnessOpacity = Math.min(roughness / 100 * 0.3, 0.3);
    const roughnessSize = 20 + (roughness / 100 * 30); // Larger patterns for rougher surfaces
    
    // Metalness creates directional reflection patterns
    const metalnessOpacity = Math.min(metalness / 100 * 0.4, 0.4);
    const metalnessAngle = mousePosition.x * 90 + metalness; // Mouse-responsive metallic streaks
    
    // Clearcoat adds glossy overlay
    const clearcoatOpacity = Math.min(clearcoat / 100 * 0.5, 0.5);
    
    return (
      <div className="absolute inset-0">
        {/* Roughness texture layer */}
        {roughness > 0 && (
          <div 
            className="absolute inset-0"
            style={{
              opacity: roughnessOpacity,
              background: `
                radial-gradient(circle at ${roughnessSize}% ${roughnessSize}%, rgba(0,0,0,0.1) 1px, transparent 2px),
                radial-gradient(circle at ${100-roughnessSize}% ${roughnessSize*1.5}%, rgba(255,255,255,0.05) 1px, transparent 2px),
                radial-gradient(circle at ${roughnessSize*1.3}% ${100-roughnessSize}%, rgba(0,0,0,0.08) 1px, transparent 2px)
              `,
              backgroundSize: `${roughnessSize}px ${roughnessSize}px, ${roughnessSize*1.2}px ${roughnessSize*1.2}px, ${roughnessSize*0.8}px ${roughnessSize*0.8}px`,
              mixBlendMode: 'overlay'
            }}
          />
        )}
        
        {/* Metalness directional streaks */}
        {metalness > 0 && (
          <div 
            className="absolute inset-0"
            style={{
              opacity: metalnessOpacity,
              background: `
                repeating-linear-gradient(
                  ${metalnessAngle}deg,
                  transparent 0px,
                  rgba(255,255,255,0.2) 1px,
                  transparent 3px,
                  rgba(200,200,200,0.1) 4px,
                  transparent 6px
                )
              `,
              mixBlendMode: 'screen',
              transition: 'background 0.1s ease'
            }}
          />
        )}
        
        {/* Clearcoat glossy layer */}
        {clearcoat > 0 && (
          <div 
            className="absolute inset-0"
            style={{
              opacity: clearcoatOpacity,
              background: `
                radial-gradient(
                  ellipse at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                  rgba(255,255,255,0.4) 0%,
                  rgba(255,255,255,0.2) 30%,
                  rgba(255,255,255,0.1) 60%,
                  transparent 100%
                )
              `,
              mixBlendMode: 'overlay',
              transition: 'background 0.2s ease'
            }}
          />
        )}
        
        {/* Reflectivity highlights */}
        {reflectivity > 0 && (
          <div 
            className="absolute inset-0"
            style={{
              opacity: Math.min(reflectivity / 100 * 0.6, 0.6),
              background: `
                linear-gradient(
                  ${45 + mousePosition.x * 45}deg,
                  transparent 0%,
                  rgba(255,255,255,0.3) 45%,
                  rgba(255,255,255,0.5) 50%,
                  rgba(255,255,255,0.3) 55%,
                  transparent 100%
                )
              `,
              mixBlendMode: 'screen',
              transform: `translateX(${mousePosition.x * 20 - 10}px) translateY(${mousePosition.y * 20 - 10}px)`,
              transition: 'transform 0.1s ease, background 0.1s ease'
            }}
          />
        )}
      </div>
    );
  }, [materialSettings, mousePosition, showEffects]);

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
        foilspray: 'screen',
        gold: 'overlay'
      };
      return blendModes[effectId] || 'overlay';
    };
  }, []);

  return {
    getFrameStyles,
    getEnhancedEffectStyles,
    getEnvironmentStyle,
    getEffectBlendMode,
    getMaterialEffects,
    MaterialSurfaceTexture,
    SurfaceTexture
  };
};
