
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
      {/* Phase 1: Real-Time Shadow Casting - SOFTENED */}
      <div
        className="absolute inset-0 z-30 pointer-events-none"
        style={{
          background: `
            radial-gradient(
              ellipse 200% 150% at 
              ${50 + lightingData.shadowX}% ${50 + lightingData.shadowY}%,
              rgba(0, 0, 0, ${lightingData.shadowOpacity * 0.4}) 0%,
              rgba(0, 0, 0, ${lightingData.shadowOpacity * 0.2}) 60%,
              transparent 90%
            )
          `,
          transform: `translateX(${lightingData.shadowX * 0.3}px) translateY(${lightingData.shadowY * 0.3}px)`,
          transition: 'transform 0.1s ease-out'
        }}
      />
      
      {/* Multi-layer shadows for depth - SOFTENED */}
      <div
        className="absolute inset-0 z-31 pointer-events-none"
        style={{
          boxShadow: `
            inset ${lightingData.shadowX * 0.2}px ${lightingData.shadowY * 0.2}px ${lightingData.shadowBlur * 1.5}px rgba(0, 0, 0, ${lightingData.shadowOpacity * 0.25}),
            inset ${lightingData.shadowX * 0.4}px ${lightingData.shadowY * 0.4}px ${lightingData.shadowBlur * 3}px rgba(0, 0, 0, ${lightingData.shadowOpacity * 0.15})
          `,
          transition: 'box-shadow 0.1s ease-out'
        }}
      />

      {/* Phase 2: Dynamic Reflections - SOFTENED */}
      {dominantEffect > 0 && (
        <>
          {/* Metallic streak reflections - DIFFUSED */}
          <div
            className="absolute inset-0 z-32 pointer-events-none"
            style={{
              background: `
                linear-gradient(
                  ${lightingData.reflectionAngle + 90}deg,
                  transparent 0%,
                  ${effectType === 'gold' ? 'rgba(255, 215, 0, 0.4)' : 
                    effectType === 'chrome' ? 'rgba(255, 255, 255, 0.5)' :
                    effectType === 'crystal' ? 'rgba(200, 220, 255, 0.35)' :
                    'rgba(255, 100, 255, 0.3)'} ${40 - lightingData.reflectionSpread/3}%,
                  ${effectType === 'gold' ? 'rgba(255, 215, 0, 0.2)' : 
                    effectType === 'chrome' ? 'rgba(255, 255, 255, 0.25)' :
                    effectType === 'crystal' ? 'rgba(200, 220, 255, 0.2)' :
                    'rgba(255, 100, 255, 0.15)'} 50%,
                  transparent ${60 + lightingData.reflectionSpread/3}%
                )
              `,
              opacity: lightingData.reflectionIntensity * (dominantEffect / 100) * 0.7,
              mixBlendMode: 'screen',
              transform: `translateX(${lightingData.lightX * 6}px) translateY(${lightingData.lightY * 6}px)`,
              transition: 'transform 0.1s ease-out, opacity 0.1s ease-out'
            }}
          />
          
          {/* Surface-specific reflections - LARGER SPREAD */}
          <div
            className="absolute inset-0 z-33 pointer-events-none"
            style={{
              background: `
                radial-gradient(
                  ellipse 120% 80% at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                  ${effectType === 'gold' ? 'rgba(255, 223, 0, 0.3)' : 
                    effectType === 'chrome' ? 'rgba(240, 248, 255, 0.4)' :
                    effectType === 'crystal' ? 'rgba(173, 216, 230, 0.25)' :
                    'rgba(238, 130, 238, 0.2)'} 0%,
                  transparent 80%
                )
              `,
              opacity: lightingData.lightIntensity * (dominantEffect / 100) * 0.6,
              mixBlendMode: effectType === 'gold' ? 'overlay' : 'screen',
              transition: 'opacity 0.1s ease-out'
            }}
          />

          {/* Additional diffusion layer for smoother blending */}
          <div
            className="absolute inset-0 z-33 pointer-events-none"
            style={{
              background: `
                radial-gradient(
                  ellipse 160% 120% at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                  ${effectType === 'gold' ? 'rgba(255, 223, 0, 0.15)' : 
                    effectType === 'chrome' ? 'rgba(240, 248, 255, 0.2)' :
                    effectType === 'crystal' ? 'rgba(173, 216, 230, 0.15)' :
                    'rgba(238, 130, 238, 0.1)'} 0%,
                  transparent 90%
                )
              `,
              opacity: lightingData.lightIntensity * (dominantEffect / 100) * 0.4,
              mixBlendMode: 'soft-light',
              transition: 'opacity 0.15s ease-out'
            }}
          />
        </>
      )}

      {/* Phase 3: 3D Lighting Simulation - SOFTENED */}
      {/* Ambient occlusion in corners - GENTLER */}
      <div
        className="absolute inset-0 z-34 pointer-events-none rounded-xl"
        style={{
          background: `
            radial-gradient(ellipse 120% 120% at 0% 0%, rgba(0, 0, 0, ${lightingData.ambientOcclusion * 0.2}) 0%, transparent 50%),
            radial-gradient(ellipse 120% 120% at 100% 0%, rgba(0, 0, 0, ${lightingData.ambientOcclusion * 0.2}) 0%, transparent 50%),
            radial-gradient(ellipse 120% 120% at 0% 100%, rgba(0, 0, 0, ${lightingData.ambientOcclusion * 0.2}) 0%, transparent 50%),
            radial-gradient(ellipse 120% 120% at 100% 100%, rgba(0, 0, 0, ${lightingData.ambientOcclusion * 0.2}) 0%, transparent 50%)
          `,
          opacity: 1 - lightingData.lightIntensity * 0.3,
          transition: 'opacity 0.2s ease-out'
        }}
      />
      
      {/* Depth-based lighting - SOFTER TRANSITIONS */}
      <div
        className="absolute inset-0 z-35 pointer-events-none"
        style={{
          background: `
            linear-gradient(
              ${lightingData.reflectionAngle}deg,
              rgba(255, 255, 255, ${lightingData.lightIntensity * 0.06}) 0%,
              rgba(255, 255, 255, ${lightingData.lightIntensity * 0.03}) 60%,
              rgba(0, 0, 0, ${lightingData.ambientOcclusion * 0.06}) 100%
            )
          `,
          mixBlendMode: 'overlay',
          transition: 'background 0.15s ease-out'
        }}
      />

      {/* Phase 4: Environmental Response - DIFFUSED */}
      {/* Color temperature shifts - LARGER SPREAD */}
      <div
        className="absolute inset-0 z-36 pointer-events-none"
        style={{
          background: `
            radial-gradient(
              ellipse 200% 150% at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
              ${lightingData.colorTemperature > 0.5 ? 
                `rgba(255, 180, 120, ${lightingData.atmosphericScatter * 0.08})` : 
                `rgba(120, 180, 255, ${lightingData.atmosphericScatter * 0.08})`} 0%,
              transparent 85%
            )
          `,
          mixBlendMode: 'overlay',
          opacity: lightingData.directionalBias * 0.4,
          transition: 'opacity 0.2s ease-out'
        }}
      />
      
      {/* Atmospheric scattering - GENTLER CONIC */}
      <div
        className="absolute inset-0 z-37 pointer-events-none"
        style={{
          background: `
            conic-gradient(
              from ${lightingData.reflectionAngle}deg at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
              rgba(255, 255, 255, ${lightingData.atmosphericScatter * 0.04}) 0deg,
              rgba(255, 255, 255, ${lightingData.atmosphericScatter * 0.06}) 90deg,
              rgba(255, 255, 255, ${lightingData.atmosphericScatter * 0.03}) 180deg,
              rgba(255, 255, 255, ${lightingData.atmosphericScatter * 0.05}) 270deg,
              rgba(255, 255, 255, ${lightingData.atmosphericScatter * 0.04}) 360deg
            )
          `,
          mixBlendMode: 'screen',
          opacity: lightingData.lightIntensity * 0.5,
          transition: 'opacity 0.15s ease-out'
        }}
      />
      
      {/* Directional lighting indicator - SOFTER */}
      <div
        className="absolute top-2 left-2 z-40 pointer-events-none"
        style={{
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          background: `radial-gradient(circle, 
            rgba(0, 255, 150, ${lightingData.lightIntensity * 0.6}) 0%, 
            rgba(0, 255, 150, ${lightingData.lightIntensity * 0.2}) 70%, 
            transparent 100%)`,
          boxShadow: `0 0 8px rgba(0, 255, 150, ${lightingData.lightIntensity * 0.5})`,
          animation: `pulse ${3000 / lightingData.lightIntensity}ms ease-in-out infinite`,
          transform: `translate(${lightingData.lightX * 3}px, ${lightingData.lightY * 3}px)`,
          transition: 'transform 0.1s ease-out'
        }}
      />
    </>
  );
};
