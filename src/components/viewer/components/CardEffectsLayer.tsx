
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
  
  // Check if chrome effect is active
  const chromeIntensity = effectValues?.chrome?.intensity || 0;
  const isChromeActive = chromeIntensity > 0;
  
  // Check if brushed steel effect is active (industrial gray metal)
  const brushedSteelIntensity = effectValues?.brushedsteel?.intensity || 0;
  const isBrushedSteelActive = brushedSteelIntensity > 0;
  
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
      {/* Brushed Steel Effect - Industrial gray metal with texture */}
      {isBrushedSteelActive && (
        <>
          {/* Base steel metallic layer */}
          <div
            className="absolute inset-0 z-20"
            style={{
              background: `
                linear-gradient(
                  ${45 + mousePosition.x * 90}deg,
                  rgba(169, 169, 169, ${(brushedSteelIntensity / 100) * 0.8}) 0%,
                  rgba(192, 192, 192, ${(brushedSteelIntensity / 100) * 0.9}) 20%,
                  rgba(128, 128, 128, ${(brushedSteelIntensity / 100) * 0.7}) 40%,
                  rgba(211, 211, 211, ${(brushedSteelIntensity / 100) * 0.85}) 60%,
                  rgba(105, 105, 105, ${(brushedSteelIntensity / 100) * 0.6}) 80%,
                  rgba(169, 169, 169, ${(brushedSteelIntensity / 100) * 0.75}) 100%
                )
              `,
              mixBlendMode: 'multiply',
              opacity: 0.9
            }}
          />
          
          {/* Brushed texture pattern */}
          <div
            className="absolute inset-0 z-21"
            style={{
              background: `
                repeating-linear-gradient(
                  ${mousePosition.x * 180}deg,
                  transparent 0px,
                  rgba(200, 200, 200, ${(brushedSteelIntensity / 100) * 0.3}) 1px,
                  rgba(160, 160, 160, ${(brushedSteelIntensity / 100) * 0.2}) 2px,
                  transparent 3px,
                  transparent 6px
                )
              `,
              mixBlendMode: 'overlay',
              opacity: 0.8
            }}
          />
          
          {/* Industrial shine highlights */}
          <div
            className="absolute inset-0 z-22"
            style={{
              background: `
                radial-gradient(
                  ellipse at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                  rgba(240, 240, 240, ${(brushedSteelIntensity / 100) * 0.6}) 0%,
                  rgba(220, 220, 220, ${(brushedSteelIntensity / 100) * 0.4}) 25%,
                  rgba(180, 180, 180, ${(brushedSteelIntensity / 100) * 0.3}) 50%,
                  transparent 70%
                )
              `,
              mixBlendMode: 'screen',
              opacity: isHovering ? 0.9 : 0.7
            }}
          />
          
          {/* Surface texture overlay for industrial look */}
          <div
            className="absolute inset-0 z-23"
            style={{
              background: `
                conic-gradient(
                  from ${mousePosition.x * 120}deg at 50% 50%,
                  transparent 0deg,
                  rgba(190, 190, 190, ${(brushedSteelIntensity / 100) * 0.4}) 30deg,
                  rgba(150, 150, 150, ${(brushedSteelIntensity / 100) * 0.5}) 60deg,
                  transparent 90deg,
                  rgba(170, 170, 170, ${(brushedSteelIntensity / 100) * 0.3}) 180deg,
                  transparent 210deg,
                  rgba(200, 200, 200, ${(brushedSteelIntensity / 100) * 0.4}) 300deg,
                  transparent 360deg
                )
              `,
              mixBlendMode: 'hard-light',
              opacity: 0.6
            }}
          />
        </>
      )}

      {/* Chrome Mirror Effect - Enhanced silver chrome shine */}
      {isChromeActive && !isBrushedSteelActive && (
        <>
          {/* Primary chrome base layer */}
          <div
            className="absolute inset-0 z-20"
            style={{
              background: `
                linear-gradient(
                  ${45 + mousePosition.x * 90}deg,
                  rgba(230, 230, 235, ${(chromeIntensity / 100) * 0.9}) 0%,
                  rgba(255, 255, 255, ${(chromeIntensity / 100) * 1.0}) 20%,
                  rgba(200, 205, 210, ${(chromeIntensity / 100) * 0.8}) 40%,
                  rgba(255, 255, 255, ${(chromeIntensity / 100) * 0.95}) 60%,
                  rgba(180, 185, 190, ${(chromeIntensity / 100) * 0.7}) 80%,
                  rgba(240, 240, 245, ${(chromeIntensity / 100) * 0.85}) 100%
                )
              `,
              mixBlendMode: 'screen',
              opacity: 0.9
            }}
          />
          
          {/* Sharp chrome reflection highlights */}
          <div
            className="absolute inset-0 z-21"
            style={{
              background: `
                radial-gradient(
                  ellipse at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                  rgba(255, 255, 255, ${(chromeIntensity / 100) * 0.95}) 0%,
                  rgba(235, 240, 245, ${(chromeIntensity / 100) * 0.8}) 15%,
                  rgba(220, 225, 230, ${(chromeIntensity / 100) * 0.6}) 30%,
                  transparent 50%
                )
              `,
              mixBlendMode: 'overlay',
              opacity: 0.95
            }}
          />
          
          {/* Chrome surface reflections */}
          <div
            className="absolute inset-0 z-22"
            style={{
              background: `
                conic-gradient(
                  from ${mousePosition.x * 120}deg at 50% 50%,
                  transparent 0deg,
                  rgba(255, 255, 255, ${(chromeIntensity / 100) * 0.8}) 20deg,
                  rgba(240, 245, 250, ${(chromeIntensity / 100) * 0.9}) 40deg,
                  transparent 60deg,
                  rgba(200, 210, 220, ${(chromeIntensity / 100) * 0.7}) 120deg,
                  transparent 140deg,
                  rgba(255, 255, 255, ${(chromeIntensity / 100) * 0.85}) 200deg,
                  transparent 220deg,
                  rgba(220, 230, 240, ${(chromeIntensity / 100) * 0.75}) 300deg,
                  transparent 360deg
                )
              `,
              mixBlendMode: 'hard-light',
              opacity: isHovering ? 1.0 : 0.8
            }}
          />
          
          {/* Sharp directional highlights for chrome finish */}
          <div
            className="absolute inset-0 z-23"
            style={{
              background: `
                repeating-linear-gradient(
                  ${mousePosition.x * 180}deg,
                  transparent 0px,
                  rgba(255, 255, 255, ${(chromeIntensity / 100) * 0.4}) 1px,
                  rgba(240, 245, 250, ${(chromeIntensity / 100) * 0.6}) 2px,
                  transparent 4px,
                  transparent 8px
                )
              `,
              mixBlendMode: 'overlay',
              opacity: 0.7
            }}
          />
        </>
      )}

      {/* Gold Luxury Effect - Enhanced golden yellow shine */}
      {isGoldActive && !isChromeActive && !isBrushedSteelActive && (
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
      {!isGoldActive && !isChromeActive && !isBrushedSteelActive && (
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
      {isHovering && !isChromeActive && !isBrushedSteelActive && (
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
          className="absolute inset-0 z-25 overflow-hidden"
          style={{
            background: `
              radial-gradient(
                ellipse 60% 80% at ${(mousePosition.x * 0.8 + 0.1) * 100}% ${(mousePosition.y * 0.8 + 0.1) * 100}%,
                rgba(255, 255, 255, ${interactiveData.lightIntensity * (isChromeActive || isBrushedSteelActive ? 0.6 : 0.4)}) 0%,
                rgba(255, 255, 255, ${interactiveData.lightIntensity * (isChromeActive || isBrushedSteelActive ? 0.4 : 0.2)}) 30%,
                transparent 60%
              )
            `,
            mixBlendMode: 'overlay',
            transform: `translateX(${interactiveData.shadowX * -0.5}px) translateY(${interactiveData.shadowY * -0.5}px)`,
          }}
        />
      )}

      {/* Surface texture with interactive enhancement */}
      {!isChromeActive && !isBrushedSteelActive && (
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
      )}

      {/* Edge highlight for depth with interactive response */}
      <div
        className="absolute inset-0 z-26 rounded-xl"
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
