
import React from 'react';
import type { MaterialSettings } from '../types';

interface CardEffectsLayerProps {
  showEffects: boolean;
  isHovering: boolean;
  effectIntensity: number[];
  mousePosition: { x: number; y: number };
  physicalEffectStyles: React.CSSProperties;
  materialSettings?: MaterialSettings;
  interactiveLighting?: boolean;
  effectValues?: any; // Add effect values to check for specific effects
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
  
  // Check if gold luxury effect is active
  const goldIntensity = effectValues?.brushedmetal?.intensity || 0;
  const isGoldActive = goldIntensity > 0;
  
  // Calculate interactive lighting effects
  const getInteractiveLightingData = () => {
    if (!interactiveLighting) return null;
    
    const lightX = (0.5 - mousePosition.x) * 2; // -1 to 1
    const lightY = (0.5 - mousePosition.y) * 2; // -1 to 1
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
    
    // Combine reflectivity with clearcoat for more pronounced effect
    const reflectionBase = materialSettings.reflectivity * 0.7;
    const clearcoatBoost = materialSettings.clearcoat * 0.3;
    let strength = (reflectionBase + clearcoatBoost) * intensity;
    
    // Interactive lighting dramatically increases reflection strength
    if (interactiveData) {
      strength *= (1 + interactiveData.lightIntensity * 1.5);
    }
    
    return Math.min(strength, 0.95); // Cap at 95%
  };
  
  // Material-aware texture with interactive response
  const getTextureIntensity = () => {
    if (!materialSettings) return intensity * 0.1;
    
    // Rougher surfaces get more texture
    let textureStrength = materialSettings.roughness * intensity * 0.3;
    
    // Interactive lighting affects texture visibility
    if (interactiveData) {
      textureStrength *= (1 + interactiveData.lightIntensity * 0.5);
    }
    
    return textureStrength;
  };
  
  const reflectionStrength = getReflectionStrength();
  const textureIntensity = getTextureIntensity();
  
  return (
    <>
      {/* Gold Luxury Effect - Enhanced golden yellow shine */}
      {isGoldActive && (
        <>
          {/* Primary gold shine layer */}
          <div
            className="absolute inset-0 z-20"
            style={{
              background: `
                radial-gradient(
                  circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                  rgba(255, 215, 0, ${(goldIntensity / 100) * 0.8}) 0%,
                  rgba(255, 193, 7, ${(goldIntensity / 100) * 0.6}) 20%,
                  rgba(255, 235, 59, ${(goldIntensity / 100) * 0.4}) 40%,
                  transparent 70%
                )
              `,
              mixBlendMode: 'screen',
              opacity: 0.9
            }}
          />
          
          {/* Secondary golden metallic layer */}
          <div
            className="absolute inset-0 z-19"
            style={{
              background: `
                linear-gradient(
                  ${45 + mousePosition.x * 90}deg,
                  rgba(255, 215, 0, ${(goldIntensity / 100) * 0.3}) 0%,
                  rgba(255, 193, 7, ${(goldIntensity / 100) * 0.5}) 25%,
                  rgba(255, 235, 59, ${(goldIntensity / 100) * 0.4}) 50%,
                  rgba(255, 215, 0, ${(goldIntensity / 100) * 0.3}) 75%,
                  rgba(255, 193, 7, ${(goldIntensity / 100) * 0.2}) 100%
                )
              `,
              mixBlendMode: 'overlay',
              opacity: 0.8
            }}
          />
          
          {/* Gold shimmer highlights */}
          <div
            className="absolute inset-0 z-21"
            style={{
              background: `
                conic-gradient(
                  from ${mousePosition.x * 180}deg at 50% 50%,
                  transparent 0deg,
                  rgba(255, 215, 0, ${(goldIntensity / 100) * 0.6}) 30deg,
                  rgba(255, 235, 59, ${(goldIntensity / 100) * 0.8}) 60deg,
                  transparent 90deg,
                  rgba(255, 193, 7, ${(goldIntensity / 100) * 0.4}) 180deg,
                  transparent 210deg,
                  rgba(255, 215, 0, ${(goldIntensity / 100) * 0.5}) 270deg,
                  transparent 360deg
                )
              `,
              mixBlendMode: 'screen',
              opacity: isHovering ? 0.9 : 0.6
            }}
          />
        </>
      )}

      {/* Base holographic effect with interactive enhancement */}
      {!isGoldActive && (
        <div
          className="absolute inset-0 z-10"
          style={{
            background: `conic-gradient(
              from ${mousePosition.x * 180 + (interactiveData ? interactiveData.lightX * 90 : 0)}deg at 50% 60%,
              rgba(240, 60, 80, ${intensity * (interactiveData ? 0.8 + interactiveData.lightIntensity * 0.4 : 0.6)}) 0deg,
              rgba(80, 60, 240, ${intensity * (interactiveData ? 0.6 + interactiveData.lightIntensity * 0.3 : 0.4)}) 120deg,
              rgba(60, 240, 180, ${intensity * (interactiveData ? 0.6 + interactiveData.lightIntensity * 0.3 : 0.4)}) 240deg,
              rgba(240, 60, 80, ${intensity * (interactiveData ? 0.8 + interactiveData.lightIntensity * 0.4 : 0.6)}) 360deg
            )`,
            opacity: showEffects ? (interactiveData ? 0.7 + interactiveData.lightIntensity * 0.3 : 0.5) : 0,
            mixBlendMode: 'soft-light',
            ...physicalEffectStyles
          }}
        />
      )}

      {/* Interactive high-frequency reflective/foil pattern */}
      {isHovering && (
        <div
          className="absolute inset-0 z-22 overflow-hidden"
          style={{
            opacity: reflectionStrength,
            background: `
              radial-gradient(
                circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                rgba(255, 255, 255, ${interactiveData ? 0.9 + interactiveData.lightIntensity * 0.1 : 0.9}) 0%,
                rgba(255, 255, 255, ${interactiveData ? 0.7 + interactiveData.lightIntensity * 0.2 : 0.7}) 15%,
                rgba(160, 190, 255, ${interactiveData ? 0.3 + interactiveData.lightIntensity * 0.4 : 0.3}) 30%,
                transparent 60%
              )
            `,
            mixBlendMode: isGoldActive ? 'overlay' : 'screen',
          }}
        />
      )}

      {/* Interactive dynamic light source */}
      {interactiveLighting && interactiveData && isHovering && (
        <div
          className="absolute inset-0 z-23 overflow-hidden"
          style={{
            background: `
              radial-gradient(
                ellipse 60% 80% at ${(mousePosition.x * 0.8 + 0.1) * 100}% ${(mousePosition.y * 0.8 + 0.1) * 100}%,
                rgba(255, 255, 255, ${interactiveData.lightIntensity * 0.4}) 0%,
                rgba(255, 255, 255, ${interactiveData.lightIntensity * 0.2}) 30%,
                transparent 60%
              )
            `,
            mixBlendMode: 'overlay',
            transform: `translateX(${interactiveData.shadowX * -0.5}px) translateY(${interactiveData.shadowY * -0.5}px)`,
          }}
        />
      )}

      {/* Surface texture with interactive enhancement */}
      <div
        className="absolute inset-0 z-15"
        style={{
          opacity: textureIntensity,
          backgroundImage: `
            repeating-linear-gradient(
              ${45 + mousePosition.x * 30 + (interactiveData ? interactiveData.lightX * 15 : 0)}deg,
              transparent,
              rgba(255, 255, 255, ${interactiveData ? 0.05 + interactiveData.lightIntensity * 0.03 : 0.05}) 1px,
              transparent 2px
            )
          `,
          backgroundSize: '4px 4px',
          mixBlendMode: 'overlay',
        }}
      />

      {/* Edge highlight for depth with interactive response */}
      <div
        className="absolute inset-0 z-25 rounded-xl"
        style={{
          boxShadow: `
            inset 0 0 20px rgba(255, 255, 255, ${intensity * (interactiveData ? 0.2 + interactiveData.lightIntensity * 0.3 : 0.2)}),
            inset 0 0 8px rgba(255, 255, 255, ${intensity * (interactiveData ? 0.3 + interactiveData.lightIntensity * 0.4 : 0.3)})
          `,
          opacity: interactiveData ? 0.7 + interactiveData.lightIntensity * 0.3 : 0.7
        }}
      />

      {/* Interactive lighting indicator (subtle visual feedback) */}
      {interactiveLighting && (
        <div
          className="absolute top-2 right-2 z-30"
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: `rgba(0, 255, 150, ${interactiveData ? 0.6 + interactiveData.lightIntensity * 0.4 : 0.3})`,
            boxShadow: `0 0 8px rgba(0, 255, 150, ${interactiveData ? 0.4 + interactiveData.lightIntensity * 0.3 : 0.2})`,
            transition: 'all 0.1s ease'
          }}
        />
      )}
    </>
  );
};
