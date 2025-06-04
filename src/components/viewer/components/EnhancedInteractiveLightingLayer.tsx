
import React from 'react';
import type { EnhancedLightingData } from '../hooks/useEnhancedInteractiveLighting';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';

interface EnhancedInteractiveLightingLayerProps {
  lightingData: EnhancedLightingData | null;
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
}

export const EnhancedInteractiveLightingLayer: React.FC<EnhancedInteractiveLightingLayerProps> = ({
  lightingData,
  effectValues,
  mousePosition
}) => {
  if (!lightingData) return null;
  
  // Get active effects for tailored lighting response
  const goldIntensity = (effectValues?.gold?.intensity as number) || 0;
  const chromeIntensity = (effectValues?.chrome?.intensity as number) || 0;
  const crystalIntensity = (effectValues?.crystal?.intensity as number) || 0;
  const holographicIntensity = (effectValues?.holographic?.intensity as number) || 0;
  
  // Determine dominant effect for specialized lighting
  const dominantEffect = Math.max(goldIntensity, chromeIntensity, crystalIntensity, holographicIntensity);
  const effectType = goldIntensity === dominantEffect ? 'gold' : 
                    chromeIntensity === dominantEffect ? 'chrome' :
                    crystalIntensity === dominantEffect ? 'crystal' : 'holographic';
  
  return (
    <>
      {/* Phase 1: Real-Time Shadow Casting */}
      <div
        className="absolute inset-0 z-30 pointer-events-none"
        style={{
          background: `
            radial-gradient(
              ellipse ${lightingData.shadowBlur * 2}px ${lightingData.shadowBlur * 3}px at 
              ${50 + lightingData.shadowX}% ${50 + lightingData.shadowY}%,
              rgba(0, 0, 0, ${lightingData.shadowOpacity * 0.6}) 0%,
              rgba(0, 0, 0, ${lightingData.shadowOpacity * 0.3}) 40%,
              transparent 70%
            )
          `,
          transform: `translateX(${lightingData.shadowX * 0.5}px) translateY(${lightingData.shadowY * 0.5}px)`,
          transition: 'transform 0.1s ease-out'
        }}
      />
      
      {/* Multi-layer shadows for depth */}
      <div
        className="absolute inset-0 z-31 pointer-events-none"
        style={{
          boxShadow: `
            inset ${lightingData.shadowX * 0.3}px ${lightingData.shadowY * 0.3}px ${lightingData.shadowBlur}px rgba(0, 0, 0, ${lightingData.shadowOpacity * 0.4}),
            inset ${lightingData.shadowX * 0.6}px ${lightingData.shadowY * 0.6}px ${lightingData.shadowBlur * 2}px rgba(0, 0, 0, ${lightingData.shadowOpacity * 0.2})
          `,
          transition: 'box-shadow 0.1s ease-out'
        }}
      />

      {/* Phase 2: Dynamic Reflections */}
      {dominantEffect > 0 && (
        <>
          {/* Metallic streak reflections */}
          <div
            className="absolute inset-0 z-32 pointer-events-none"
            style={{
              background: `
                linear-gradient(
                  ${lightingData.reflectionAngle + 90}deg,
                  transparent 0%,
                  ${effectType === 'gold' ? 'rgba(255, 215, 0, 0.8)' : 
                    effectType === 'chrome' ? 'rgba(255, 255, 255, 0.9)' :
                    effectType === 'crystal' ? 'rgba(200, 220, 255, 0.7)' :
                    'rgba(255, 100, 255, 0.6)'} ${50 - lightingData.reflectionSpread/2}%,
                  ${effectType === 'gold' ? 'rgba(255, 215, 0, 0.4)' : 
                    effectType === 'chrome' ? 'rgba(255, 255, 255, 0.5)' :
                    effectType === 'crystal' ? 'rgba(200, 220, 255, 0.4)' :
                    'rgba(255, 100, 255, 0.3)'} 50%,
                  transparent ${50 + lightingData.reflectionSpread/2}%
                )
              `,
              opacity: lightingData.reflectionIntensity * (dominantEffect / 100),
              mixBlendMode: 'screen',
              transform: `translateX(${lightingData.lightX * 10}px) translateY(${lightingData.lightY * 10}px)`,
              transition: 'transform 0.1s ease-out, opacity 0.1s ease-out'
            }}
          />
          
          {/* Surface-specific reflections */}
          <div
            className="absolute inset-0 z-33 pointer-events-none"
            style={{
              background: `
                radial-gradient(
                  ellipse 60% 30% at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                  ${effectType === 'gold' ? 'rgba(255, 223, 0, 0.6)' : 
                    effectType === 'chrome' ? 'rgba(240, 248, 255, 0.8)' :
                    effectType === 'crystal' ? 'rgba(173, 216, 230, 0.5)' :
                    'rgba(238, 130, 238, 0.4)'} 0%,
                  transparent 60%
                )
              `,
              opacity: lightingData.lightIntensity * (dominantEffect / 100) * 0.8,
              mixBlendMode: effectType === 'gold' ? 'overlay' : 'screen',
              transition: 'opacity 0.1s ease-out'
            }}
          />
        </>
      )}

      {/* Phase 3: 3D Lighting Simulation */}
      {/* Ambient occlusion in corners */}
      <div
        className="absolute inset-0 z-34 pointer-events-none rounded-xl"
        style={{
          background: `
            radial-gradient(circle at 0% 0%, rgba(0, 0, 0, ${lightingData.ambientOcclusion * 0.3}) 0%, transparent 30%),
            radial-gradient(circle at 100% 0%, rgba(0, 0, 0, ${lightingData.ambientOcclusion * 0.3}) 0%, transparent 30%),
            radial-gradient(circle at 0% 100%, rgba(0, 0, 0, ${lightingData.ambientOcclusion * 0.3}) 0%, transparent 30%),
            radial-gradient(circle at 100% 100%, rgba(0, 0, 0, ${lightingData.ambientOcclusion * 0.3}) 0%, transparent 30%)
          `,
          opacity: 1 - lightingData.lightIntensity * 0.5,
          transition: 'opacity 0.2s ease-out'
        }}
      />
      
      {/* Depth-based lighting */}
      <div
        className="absolute inset-0 z-35 pointer-events-none"
        style={{
          background: `
            linear-gradient(
              ${lightingData.reflectionAngle}deg,
              rgba(255, 255, 255, ${lightingData.lightIntensity * 0.1}) 0%,
              rgba(255, 255, 255, ${lightingData.lightIntensity * 0.05}) 50%,
              rgba(0, 0, 0, ${lightingData.ambientOcclusion * 0.1}) 100%
            )
          `,
          mixBlendMode: 'overlay',
          transition: 'background 0.15s ease-out'
        }}
      />

      {/* Phase 4: Environmental Response */}
      {/* Color temperature shifts */}
      <div
        className="absolute inset-0 z-36 pointer-events-none"
        style={{
          background: `
            radial-gradient(
              circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
              ${lightingData.colorTemperature > 0.5 ? 
                `rgba(255, 180, 120, ${lightingData.atmosphericScatter * 0.15})` : 
                `rgba(120, 180, 255, ${lightingData.atmosphericScatter * 0.15})`} 0%,
              transparent 70%
            )
          `,
          mixBlendMode: 'overlay',
          opacity: lightingData.directionalBias * 0.6,
          transition: 'opacity 0.2s ease-out'
        }}
      />
      
      {/* Atmospheric scattering */}
      <div
        className="absolute inset-0 z-37 pointer-events-none"
        style={{
          background: `
            conic-gradient(
              from ${lightingData.reflectionAngle}deg at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
              rgba(255, 255, 255, ${lightingData.atmosphericScatter * 0.08}) 0deg,
              rgba(255, 255, 255, ${lightingData.atmosphericScatter * 0.12}) 90deg,
              rgba(255, 255, 255, ${lightingData.atmosphericScatter * 0.06}) 180deg,
              rgba(255, 255, 255, ${lightingData.atmosphericScatter * 0.10}) 270deg,
              rgba(255, 255, 255, ${lightingData.atmosphericScatter * 0.08}) 360deg
            )
          `,
          mixBlendMode: 'screen',
          opacity: lightingData.lightIntensity * 0.7,
          transition: 'opacity 0.15s ease-out'
        }}
      />
      
      {/* Directional lighting indicator */}
      <div
        className="absolute top-2 left-2 z-40 pointer-events-none"
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: `radial-gradient(circle, 
            rgba(0, 255, 150, ${lightingData.lightIntensity}) 0%, 
            rgba(0, 255, 150, ${lightingData.lightIntensity * 0.3}) 70%, 
            transparent 100%)`,
          boxShadow: `0 0 12px rgba(0, 255, 150, ${lightingData.lightIntensity * 0.8})`,
          animation: `pulse ${2000 / lightingData.lightIntensity}ms ease-in-out infinite`,
          transform: `translate(${lightingData.lightX * 4}px, ${lightingData.lightY * 4}px)`,
          transition: 'transform 0.1s ease-out'
        }}
      />
    </>
  );
};
