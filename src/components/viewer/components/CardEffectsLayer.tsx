
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
}

export const CardEffectsLayer: React.FC<CardEffectsLayerProps> = ({
  showEffects,
  isHovering,
  effectIntensity,
  mousePosition,
  physicalEffectStyles,
  materialSettings,
  interactiveLighting = false
}) => {
  if (!showEffects) return null;
  
  const intensity = effectIntensity[0] / 100;
  
  // Get effective mouse position - static center when interactive lighting is off
  const effectiveMousePosition = interactiveLighting ? mousePosition : { x: 0.5, y: 0.5 };
  
  // Calculate interactive lighting effects with glare reduction
  const getInteractiveLightingData = () => {
    if (!interactiveLighting) {
      // Return static lighting data when interactive lighting is off
      return {
        lightX: 0,
        lightY: 0,
        lightIntensity: 0.3, // Reduced static intensity
        shadowX: 0,
        shadowY: 0,
        proximityDamping: 1.0
      };
    }
    
    const lightX = (0.5 - mousePosition.x) * 2; // -1 to 1
    const lightY = (0.5 - mousePosition.y) * 2; // -1 to 1
    const lightDistance = Math.sqrt(lightX * lightX + lightY * lightY);
    
    // Smart proximity damping to prevent glare
    const proximityThreshold = 0.25;
    let proximityDamping = 1.0;
    
    if (lightDistance < proximityThreshold) {
      // Strong damping when very close to center
      proximityDamping = 0.15 + (lightDistance / proximityThreshold) * 0.55; // 0.15 to 0.7
    } else if (lightDistance < 0.6) {
      // Moderate damping in mid-range
      proximityDamping = 0.6 + ((lightDistance - proximityThreshold) / (0.6 - proximityThreshold)) * 0.3; // 0.6 to 0.9
    }
    
    const baseLightIntensity = Math.max(0.2, 1 - lightDistance * 0.5);
    const lightIntensity = Math.min(baseLightIntensity * proximityDamping, 0.6); // Capped at 60%
    
    return {
      lightX,
      lightY,
      lightIntensity,
      shadowX: lightX * -15 * proximityDamping, // Reduced shadow intensity
      shadowY: lightY * -15 * proximityDamping,
      proximityDamping
    };
  };
  
  const interactiveData = getInteractiveLightingData();
  
  // Material-aware reflection with reduced intensity
  const getReflectionStrength = () => {
    if (!materialSettings) return intensity * 0.4; // Reduced from 0.5
    
    const reflectionBase = materialSettings.reflectivity * 0.5; // Reduced from 0.7
    const clearcoatBoost = materialSettings.clearcoat * 0.2; // Reduced from 0.3
    let strength = (reflectionBase + clearcoatBoost) * intensity;
    
    // Interactive lighting increases reflection strength with damping
    if (interactiveData && interactiveLighting && interactiveData.proximityDamping) {
      strength *= (1 + interactiveData.lightIntensity * interactiveData.proximityDamping * 0.8); // Reduced from 1.5
    }
    
    return Math.min(strength, 0.7); // Reduced cap from 95%
  };
  
  // Material-aware texture with reduced interactive response
  const getTextureIntensity = () => {
    if (!materialSettings) return intensity * 0.08; // Reduced from 0.1
    
    let textureStrength = materialSettings.roughness * intensity * 0.2; // Reduced from 0.3
    
    // Interactive lighting affects texture visibility with damping
    if (interactiveData && interactiveLighting && interactiveData.proximityDamping) {
      textureStrength *= (1 + interactiveData.lightIntensity * interactiveData.proximityDamping * 0.3); // Reduced from 0.5
    }
    
    return textureStrength;
  };
  
  const reflectionStrength = getReflectionStrength();
  const textureIntensity = getTextureIntensity();
  
  return (
    <>
      {/* Base holographic effect with reduced intensity */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background: `conic-gradient(
            from ${effectiveMousePosition.x * 180 + (interactiveLighting && interactiveData ? interactiveData.lightX * 60 : 0)}deg at 50% 60%,
            rgba(240, 60, 80, ${intensity * (interactiveLighting && interactiveData ? 0.5 + interactiveData.lightIntensity * interactiveData.proximityDamping * 0.25 : 0.4)}) 0deg,
            rgba(80, 60, 240, ${intensity * (interactiveLighting && interactiveData ? 0.4 + interactiveData.lightIntensity * interactiveData.proximityDamping * 0.2 : 0.3)}) 120deg,
            rgba(60, 240, 180, ${intensity * (interactiveLighting && interactiveData ? 0.4 + interactiveData.lightIntensity * interactiveData.proximityDamping * 0.2 : 0.3)}) 240deg,
            rgba(240, 60, 80, ${intensity * (interactiveLighting && interactiveData ? 0.5 + interactiveData.lightIntensity * interactiveData.proximityDamping * 0.25 : 0.4)}) 360deg
          )`,
          opacity: showEffects ? (interactiveLighting && interactiveData ? 0.5 + interactiveData.lightIntensity * interactiveData.proximityDamping * 0.2 : 0.4) : 0,
          mixBlendMode: 'soft-light',
          ...physicalEffectStyles
        }}
      />

      {/* Interactive reflective pattern with reduced intensity */}
      {isHovering && (
        <div
          className="absolute inset-0 z-20 overflow-hidden"
          style={{
            opacity: reflectionStrength,
            background: `
              radial-gradient(
                circle at ${effectiveMousePosition.x * 100}% ${effectiveMousePosition.y * 100}%,
                rgba(255, 255, 255, ${interactiveLighting && interactiveData ? Math.min(0.6 + interactiveData.lightIntensity * interactiveData.proximityDamping * 0.15, 0.7) : 0.6}) 0%,
                rgba(255, 255, 255, ${interactiveLighting && interactiveData ? Math.min(0.4 + interactiveData.lightIntensity * interactiveData.proximityDamping * 0.2, 0.5) : 0.4}) 25%,
                rgba(160, 190, 255, ${interactiveLighting && interactiveData ? Math.min(0.2 + interactiveData.lightIntensity * interactiveData.proximityDamping * 0.25, 0.3) : 0.2}) 40%,
                transparent 70%
              )
            `,
            mixBlendMode: 'soft-light', // Changed from screen to reduce glare
          }}
        />
      )}

      {/* Interactive dynamic light source with proximity damping */}
      {interactiveLighting && interactiveData && isHovering && interactiveData.proximityDamping > 0.3 && (
        <div
          className="absolute inset-0 z-22 overflow-hidden"
          style={{
            background: `
              radial-gradient(
                ellipse 70% 90% at ${(mousePosition.x * 0.8 + 0.1) * 100}% ${(mousePosition.y * 0.8 + 0.1) * 100}%,
                rgba(255, 255, 255, ${Math.min(interactiveData.lightIntensity * interactiveData.proximityDamping * 0.2, 0.25)}) 0%,
                rgba(255, 255, 255, ${Math.min(interactiveData.lightIntensity * interactiveData.proximityDamping * 0.1, 0.15)}) 40%,
                transparent 70%
              )
            `,
            mixBlendMode: 'soft-light', // Changed from overlay
            transform: `translateX(${interactiveData.shadowX * -0.3}px) translateY(${interactiveData.shadowY * -0.3}px)`,
          }}
        />
      )}

      {/* Surface texture with reduced interactive enhancement */}
      <div
        className="absolute inset-0 z-15"
        style={{
          opacity: textureIntensity,
          backgroundImage: `
            repeating-linear-gradient(
              ${45 + effectiveMousePosition.x * 20 + (interactiveLighting && interactiveData ? interactiveData.lightX * 8 : 0)}deg,
              transparent,
              rgba(255, 255, 255, ${interactiveLighting && interactiveData ? 0.03 + interactiveData.lightIntensity * interactiveData.proximityDamping * 0.02 : 0.03}) 1px,
              transparent 2px
            )
          `,
          backgroundSize: '4px 4px',
          mixBlendMode: 'overlay',
        }}
      />

      {/* Edge highlight with reduced intensity */}
      <div
        className="absolute inset-0 z-25 rounded-xl"
        style={{
          boxShadow: `
            inset 0 0 20px rgba(255, 255, 255, ${intensity * (interactiveLighting && interactiveData ? 0.15 + interactiveData.lightIntensity * interactiveData.proximityDamping * 0.2 : 0.15)}),
            inset 0 0 8px rgba(255, 255, 255, ${intensity * (interactiveLighting && interactiveData ? 0.2 + interactiveData.lightIntensity * interactiveData.proximityDamping * 0.25 : 0.2)})
          `,
          opacity: interactiveLighting && interactiveData ? 0.6 + interactiveData.lightIntensity * interactiveData.proximityDamping * 0.2 : 0.6
        }}
      />

      {/* Interactive lighting indicator with damped brightness */}
      {interactiveLighting && (
        <div
          className="absolute top-2 right-2 z-30"
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: `rgba(0, 255, 150, ${interactiveData ? Math.min(0.4 + interactiveData.lightIntensity * interactiveData.proximityDamping * 0.3, 0.7) : 0.3})`,
            boxShadow: `0 0 8px rgba(0, 255, 150, ${interactiveData ? Math.min(0.2 + interactiveData.lightIntensity * interactiveData.proximityDamping * 0.2, 0.4) : 0.2})`,
            transition: 'all 0.1s ease'
          }}
        />
      )}
    </>
  );
};
