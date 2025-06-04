
import React, { useMemo } from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';
import { useHDREnvironment } from './useHDREnvironment';

interface UseCardEffectsProps {
  card: CardData;
  effectValues: any;
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

export const useCardEffects = ({
  card,
  effectValues,
  mousePosition,
  showEffects,
  overallBrightness,
  interactiveLighting,
  selectedScene,
  selectedLighting,
  materialSettings,
  zoom,
  rotation,
  isHovering
}: UseCardEffectsProps) => {
  
  const {
    isLoading: hdrLoading,
    getEnvironmentStyle: getHDREnvironmentStyle,
    getEnvironmentLighting
  } = useHDREnvironment(selectedScene);

  const getFrameStyles = useMemo(() => {
    const brightness = overallBrightness[0] / 100;
    const environmentLighting = getEnvironmentLighting();
    
    return () => ({
      transform: `
        perspective(1000px)
        rotateX(${rotation.x}deg)
        rotateY(${rotation.y}deg)
        scale(${zoom})
      `,
      filter: `
        brightness(${brightness * (environmentLighting.isHDR ? environmentLighting.intensity : 1)})
        contrast(${selectedLighting.contrast / 100})
        saturate(${materialSettings.metalness > 0.5 ? 1.2 : 1.0})
      `,
      transition: 'transform 0.3s ease-out, filter 0.2s ease',
      boxShadow: environmentLighting.isHDR
        ? `0 20px 40px rgba(0,0,0,0.3), 0 0 20px ${environmentLighting.color}20`
        : `0 20px 40px rgba(0,0,0,0.2)`,
    });
  }, [rotation, zoom, overallBrightness, selectedLighting, materialSettings, getEnvironmentLighting]);

  const getEnhancedEffectStyles = useMemo(() => {
    const environmentLighting = getEnvironmentLighting();
    
    return () => ({
      filter: showEffects && environmentLighting.isHDR
        ? `brightness(1.1) contrast(1.05) hue-rotate(${mousePosition.x * 10}deg)`
        : 'none',
      opacity: showEffects ? 1 : 0,
      transition: 'opacity 0.3s ease, filter 0.2s ease'
    });
  }, [showEffects, mousePosition, getEnvironmentLighting]);

  const getEnvironmentStyle = useMemo(() => {
    return () => {
      const baseStyle = getHDREnvironmentStyle();
      
      if (interactiveLighting && selectedScene.environmentType === 'hdr') {
        return {
          ...baseStyle,
          background: `
            ${baseStyle.background},
            radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
              ${selectedScene.lighting.color}20 0%, transparent 50%)
          `,
        };
      }
      
      return baseStyle;
    };
  }, [getHDREnvironmentStyle, interactiveLighting, selectedScene, mousePosition]);

  const SurfaceTexture = useMemo(() => {
    if (!showEffects) return null;
    
    const environmentLighting = getEnvironmentLighting();
    
    return (
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: environmentLighting.isHDR
            ? `
              repeating-linear-gradient(
                ${mousePosition.x * 180}deg,
                transparent 0px,
                rgba(255, 255, 255, 0.03) 1px,
                transparent 2px,
                transparent 8px
              )
            `
            : 'none',
          mixBlendMode: 'soft-light',
          opacity: materialSettings.roughness * 0.6
        }}
      />
    );
  }, [showEffects, mousePosition, materialSettings, getEnvironmentLighting]);

  return {
    getFrameStyles,
    getEnhancedEffectStyles,
    getEnvironmentStyle,
    SurfaceTexture,
    hdrLoading
  };
};
