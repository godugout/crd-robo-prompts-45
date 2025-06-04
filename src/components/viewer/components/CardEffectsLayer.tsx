
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
  
  // Fix effect mappings - each effect should read from its correct key
  const goldIntensity = effectValues?.gold?.intensity || 0;
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
  
  // Enhanced material-aware reflection for better visibility over images
  const getReflectionStrength = () => {
    if (!materialSettings) return intensity * 0.8; // Increased base strength
    
    const reflectionBase = materialSettings.reflectivity * 0.9; // Boosted
    const clearcoatBoost = materialSettings.clearcoat * 0.5; // Increased
    let strength = (reflectionBase + clearcoatBoost) * intensity * 1.2; // Overall boost
    
    if (interactiveData) {
      strength *= (1 + interactiveData.lightIntensity * 2); // Increased interactive boost
    }
    
    return Math.min(strength, 1.0); // Allow higher maximum
  };
  
  // Enhanced texture intensity for better material definition
  const getTextureIntensity = () => {
    if (!materialSettings) return intensity * 0.2; // Increased base
    
    let textureStrength = materialSettings.roughness * intensity * 0.5; // Boosted
    
    if (interactiveData) {
      textureStrength *= (1 + interactiveData.lightIntensity * 0.8); // Enhanced
    }
    
    return textureStrength;
  };
  
  const reflectionStrength = getReflectionStrength();
  const textureIntensity = getTextureIntensity();
  
  return (
    <div className="absolute inset-0">
      {/* Enhanced base overlay for better effect visibility */}
      <div 
        className="absolute inset-0 z-5"
        style={{
          background: 'rgba(0, 0, 0, 0.1)',
          mixBlendMode: 'multiply',
          opacity: isGoldActive || isChromeActive || isBrushedSteelActive || isVintageActive ? 0.3 : 0
        }}
      />

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
    </div>
  );
};
