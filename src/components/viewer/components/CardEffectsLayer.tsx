
import React from 'react';
import type { MaterialSettings } from '../types';
import { VintageEffect } from './effects/VintageEffect';
import { BrushedSteelEffect } from './effects/BrushedSteelEffect';
import { ChromeEffect } from './effects/ChromeEffect';
import { GoldEffect } from './effects/GoldEffect';
import { HolographicEffect } from './effects/HolographicEffect';
import { InteractiveLighting } from './effects/InteractiveLighting';

interface CardEffectsLayerProps {
  showEffects: boolean;
  isHovering: boolean;
  effectIntensity: number[];
  mousePosition: { x: number; y: number };
  physicalEffectStyles: React.CSSProperties;
  materialSettings?: MaterialSettings;
  interactiveLighting?: boolean;
  effectValues?: any;
}

export const CardEffectsLayer: React.FC<CardEffectsLayerProps> = ({
  showEffects,
  isHovering,
  effectIntensity,
  mousePosition,
  physicalEffectStyles,
  materialSettings,
  interactiveLighting = false,
  effectValues
}) => {
  if (!showEffects) return null;
  
  const intensity = effectIntensity[0] / 100;
  
  // Check effect intensities
  const goldIntensity = effectValues?.brushedmetal?.intensity || 0;
  const isGoldActive = goldIntensity > 0;
  
  const chromeIntensity = effectValues?.chrome?.intensity || 0;
  const isChromeActive = chromeIntensity > 0;
  
  const brushedSteelIntensity = effectValues?.brushedsteel?.intensity || 0;
  const isBrushedSteelActive = brushedSteelIntensity > 0;
  
  const vintageIntensity = effectValues?.vintage?.intensity || 0;
  const isVintageActive = vintageIntensity > 0;
  
  // Calculate interactive lighting effects
  const getInteractiveLightingData = () => {
    if (!interactiveLighting) return null;
    
    const lightX = (0.5 - mousePosition.x) * 2;
    const lightY = (0.5 - mousePosition.y) * 2;
    const lightDistance = Math.sqrt(lightX * lightX + lightY * lightY);
    const lightIntensity = Math.max(0.3, 1 - lightDistance * 0.5);
    
    return {
      lightX,
      lightY,
      lightIntensity,
      shadowX: lightX * -20,
      shadowY: lightY * -20
    };
  };
  
  const interactiveData = getInteractiveLightingData();
  
  // Material-aware reflection with interactive lighting boost
  const getReflectionStrength = () => {
    if (!materialSettings) return intensity * 0.5;
    
    const reflectionBase = materialSettings.reflectivity * 0.7;
    const clearcoatBoost = materialSettings.clearcoat * 0.3;
    let strength = (reflectionBase + clearcoatBoost) * intensity;
    
    if (interactiveData) {
      strength *= (1 + interactiveData.lightIntensity * 1.5);
    }
    
    return Math.min(strength, 0.95);
  };
  
  // Material-aware texture with interactive response
  const getTextureIntensity = () => {
    if (!materialSettings) return intensity * 0.1;
    
    let textureStrength = materialSettings.roughness * intensity * 0.3;
    
    if (interactiveData) {
      textureStrength *= (1 + interactiveData.lightIntensity * 0.5);
    }
    
    return textureStrength;
  };
  
  const reflectionStrength = getReflectionStrength();
  const textureIntensity = getTextureIntensity();
  
  return (
    <>
      <VintageEffect
        isActive={isVintageActive}
        intensity={vintageIntensity}
        mousePosition={mousePosition}
        isHovering={isHovering}
      />

      <BrushedSteelEffect
        isActive={isBrushedSteelActive && !isVintageActive}
        intensity={brushedSteelIntensity}
        mousePosition={mousePosition}
        isHovering={isHovering}
      />

      <ChromeEffect
        isActive={isChromeActive && !isBrushedSteelActive && !isVintageActive}
        intensity={chromeIntensity}
        mousePosition={mousePosition}
        isHovering={isHovering}
      />

      <GoldEffect
        isActive={isGoldActive && !isChromeActive && !isBrushedSteelActive && !isVintageActive}
        intensity={goldIntensity}
        mousePosition={mousePosition}
        isHovering={isHovering}
      />

      <HolographicEffect
        isActive={!isGoldActive && !isChromeActive && !isBrushedSteelActive && !isVintageActive}
        intensity={intensity}
        mousePosition={mousePosition}
        physicalEffectStyles={physicalEffectStyles}
        showEffects={showEffects}
        interactiveData={interactiveData}
      />

      <InteractiveLighting
        enabled={interactiveLighting}
        isHovering={isHovering}
        mousePosition={mousePosition}
        reflectionStrength={reflectionStrength}
        textureIntensity={textureIntensity}
        intensity={intensity}
        interactiveData={interactiveData}
        isGoldActive={isGoldActive}
        isChromeActive={isChromeActive}
        isBrushedSteelActive={isBrushedSteelActive}
        isVintageActive={isVintageActive}
      />
    </>
  );
};
