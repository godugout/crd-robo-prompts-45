
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
  
  // Get individual effect intensities
  const holographicIntensity = effectValues?.holographic?.intensity || 0;
  const chromeIntensity = effectValues?.chrome?.intensity || 0;
  const brushedmetalIntensity = effectValues?.brushedmetal?.intensity || 0;
  const crystalIntensity = effectValues?.crystal?.intensity || 0;
  const vintageIntensity = effectValues?.vintage?.intensity || 0;
  const interferenceIntensity = effectValues?.interference?.intensity || 0;
  const prizemIntensity = effectValues?.prizm?.intensity || 0;
  const foilsprayIntensity = effectValues?.foilspray?.intensity || 0;
  
  // Interactive lighting calculations
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
  
  return (
    <>
      {/* Crystal Effect - Translucent Stained Glass */}
      {crystalIntensity > 0 && (
        <>
          {/* Base crystal translucency */}
          <div
            className="absolute inset-0 z-20"
            style={{
              background: `
                radial-gradient(
                  circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                  rgba(200, 220, 255, ${(crystalIntensity / 100) * 0.15}) 0%,
                  rgba(255, 200, 220, ${(crystalIntensity / 100) * 0.1}) 33%,
                  rgba(220, 255, 200, ${(crystalIntensity / 100) * 0.1}) 66%,
                  rgba(200, 220, 255, ${(crystalIntensity / 100) * 0.05}) 100%
                )
              `,
              mixBlendMode: 'multiply',
              opacity: 0.6
            }}
          />
          
          {/* Rainbow edge dispersions */}
          <div
            className="absolute inset-0 z-21"
            style={{
              background: `
                conic-gradient(
                  from ${mousePosition.x * 360}deg at 50% 50%,
                  rgba(255, 0, 127, ${(crystalIntensity / 100) * 0.2}) 0deg,
                  rgba(127, 255, 0, ${(crystalIntensity / 100) * 0.2}) 120deg,
                  rgba(0, 127, 255, ${(crystalIntensity / 100) * 0.2}) 240deg,
                  rgba(255, 0, 127, ${(crystalIntensity / 100) * 0.2}) 360deg
                )
              `,
              mixBlendMode: 'overlay',
              opacity: 0.3,
              maskImage: `linear-gradient(transparent, black 20%, black 80%, transparent)`,
              WebkitMaskImage: `linear-gradient(transparent, black 20%, black 80%, transparent)`
            }}
          />
        </>
      )}

      {/* Vintage Effect - Cardboard Texture with Aging */}
      {vintageIntensity > 0 && (
        <>
          {/* Cardboard base texture */}
          <div
            className="absolute inset-0 z-20"
            style={{
              background: `
                linear-gradient(
                  45deg,
                  rgba(245, 235, 220, ${(vintageIntensity / 100) * 0.2}) 0%,
                  rgba(235, 220, 200, ${(vintageIntensity / 100) * 0.15}) 50%,
                  rgba(225, 210, 185, ${(vintageIntensity / 100) * 0.2}) 100%
                )
              `,
              mixBlendMode: 'multiply',
              opacity: 0.7
            }}
          />
          
          {/* Aging patterns */}
          <div
            className="absolute inset-0 z-21"
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  ${mousePosition.x * 45}deg,
                  transparent 0px,
                  rgba(160, 130, 100, ${(vintageIntensity / 100) * 0.1}) 1px,
                  transparent 3px
                ),
                radial-gradient(
                  ellipse at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                  rgba(140, 110, 80, ${(vintageIntensity / 100) * 0.15}) 0%,
                  transparent 60%
                )
              `,
              mixBlendMode: 'multiply',
              opacity: 0.4
            }}
          />
        </>
      )}

      {/* Chrome Effect - Sharp Metallic Reflections */}
      {chromeIntensity > 0 && (
        <>
          {/* Main chrome reflection */}
          <div
            className="absolute inset-0 z-20"
            style={{
              background: `
                linear-gradient(
                  ${45 + mousePosition.x * 90}deg,
                  rgba(220, 225, 230, ${(chromeIntensity / 100) * 0.25}) 0%,
                  rgba(245, 248, 250, ${(chromeIntensity / 100) * 0.35}) 25%,
                  rgba(200, 210, 220, ${(chromeIntensity / 100) * 0.2}) 50%,
                  rgba(240, 245, 250, ${(chromeIntensity / 100) * 0.3}) 75%,
                  rgba(210, 220, 230, ${(chromeIntensity / 100) * 0.15}) 100%
                )
              `,
              mixBlendMode: 'overlay',
              opacity: 0.6
            }}
          />
          
          {/* Sharp directional highlights */}
          <div
            className="absolute inset-0 z-21"
            style={{
              background: `
                repeating-linear-gradient(
                  ${mousePosition.x * 180}deg,
                  transparent 0px,
                  rgba(255, 255, 255, ${(chromeIntensity / 100) * 0.3}) 1px,
                  transparent 4px
                )
              `,
              mixBlendMode: 'screen',
              opacity: 0.3
            }}
          />
        </>
      )}

      {/* Brushed Metal Effect - Anisotropic Grain */}
      {brushedmetalIntensity > 0 && (
        <>
          {/* Metal base */}
          <div
            className="absolute inset-0 z-20"
            style={{
              background: `
                linear-gradient(
                  ${45 + (effectValues?.brushedmetal?.direction || 45)}deg,
                  rgba(180, 180, 185, ${(brushedmetalIntensity / 100) * 0.2}) 0%,
                  rgba(200, 200, 205, ${(brushedmetalIntensity / 100) * 0.15}) 50%,
                  rgba(170, 170, 175, ${(brushedmetalIntensity / 100) * 0.2}) 100%
                )
              `,
              mixBlendMode: 'multiply',
              opacity: 0.5
            }}
          />
          
          {/* Directional brush grain */}
          <div
            className="absolute inset-0 z-21"
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  ${effectValues?.brushedmetal?.direction || 45}deg,
                  transparent 0px,
                  rgba(160, 160, 165, ${(brushedmetalIntensity / 100) * 0.15}) 0.5px,
                  transparent 1px,
                  transparent 2px
                )
              `,
              mixBlendMode: 'overlay',
              opacity: 0.4
            }}
          />
        </>
      )}

      {/* Holographic Effect - Enhanced Color Separation */}
      {holographicIntensity > 0 && (
        <div
          className="absolute inset-0 z-20"
          style={{
            background: `
              conic-gradient(
                from ${mousePosition.x * 180 + (interactiveData ? interactiveData.lightX * 90 : 0)}deg at 50% 60%,
                rgba(255, 0, 128, ${(holographicIntensity / 100) * 0.2}) 0deg,
                rgba(0, 255, 128, ${(holographicIntensity / 100) * 0.15}) 60deg,
                rgba(128, 0, 255, ${(holographicIntensity / 100) * 0.2}) 120deg,
                rgba(255, 128, 0, ${(holographicIntensity / 100) * 0.15}) 180deg,
                rgba(0, 128, 255, ${(holographicIntensity / 100) * 0.2}) 240deg,
                rgba(128, 255, 0, ${(holographicIntensity / 100) * 0.15}) 300deg,
                rgba(255, 0, 128, ${(holographicIntensity / 100) * 0.2}) 360deg
              )
            `,
            mixBlendMode: 'overlay',
            opacity: 0.4
          }}
        />
      )}

      {/* Interference Effect - Soap Bubble Patterns */}
      {interferenceIntensity > 0 && (
        <div
          className="absolute inset-0 z-20"
          style={{
            background: `
              radial-gradient(
                ellipse at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                rgba(255, 200, 255, ${(interferenceIntensity / 100) * 0.15}) 0%,
                rgba(200, 255, 200, ${(interferenceIntensity / 100) * 0.2}) 20%,
                rgba(200, 200, 255, ${(interferenceIntensity / 100) * 0.15}) 40%,
                rgba(255, 255, 200, ${(interferenceIntensity / 100) * 0.2}) 60%,
                rgba(255, 200, 200, ${(interferenceIntensity / 100) * 0.15}) 80%,
                transparent 100%
              )
            `,
            mixBlendMode: 'screen',
            opacity: 0.3,
            animation: 'pulse 3s ease-in-out infinite'
          }}
        />
      )}

      {/* Prizm Effect - Geometric Light Separation */}
      {prizemIntensity > 0 && (
        <div
          className="absolute inset-0 z-20"
          style={{
            background: `
              conic-gradient(
                from ${mousePosition.x * 120}deg at 50% 50%,
                transparent 0deg,
                rgba(255, 0, 0, ${(prizemIntensity / 100) * 0.2}) 30deg,
                transparent 60deg,
                rgba(0, 255, 0, ${(prizemIntensity / 100) * 0.2}) 90deg,
                transparent 120deg,
                rgba(0, 0, 255, ${(prizemIntensity / 100) * 0.2}) 150deg,
                transparent 180deg,
                rgba(255, 255, 0, ${(prizemIntensity / 100) * 0.2}) 210deg,
                transparent 240deg,
                rgba(255, 0, 255, ${(prizemIntensity / 100) * 0.2}) 270deg,
                transparent 300deg,
                rgba(0, 255, 255, ${(prizemIntensity / 100) * 0.2}) 330deg,
                transparent 360deg
              )
            `,
            mixBlendMode: 'overlay',
            opacity: 0.5,
            clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)'
          }}
        />
      )}

      {/* Foil Spray Effect - Scattered Metallic Particles */}
      {foilsprayIntensity > 0 && (
        <>
          {/* Main spray pattern */}
          <div
            className="absolute inset-0 z-20"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 30%, rgba(192, 192, 192, ${(foilsprayIntensity / 100) * 0.2}) 1px, transparent 2px),
                radial-gradient(circle at 60% 70%, rgba(255, 255, 255, ${(foilsprayIntensity / 100) * 0.15}) 1px, transparent 2px),
                radial-gradient(circle at 80% 20%, rgba(176, 176, 176, ${(foilsprayIntensity / 100) * 0.2}) 1px, transparent 2px),
                radial-gradient(circle at 30% 80%, rgba(208, 208, 208, ${(foilsprayIntensity / 100) * 0.15}) 1px, transparent 2px),
                radial-gradient(circle at 70% 40%, rgba(224, 224, 224, ${(foilsprayIntensity / 100) * 0.15}) 1px, transparent 2px)
              `,
              backgroundSize: '40px 40px, 35px 35px, 45px 45px, 38px 38px, 42px 42px',
              backgroundPosition: `${mousePosition.x * 10}px ${mousePosition.y * 10}px, 
                                 ${mousePosition.x * -8}px ${mousePosition.y * 12}px,
                                 ${mousePosition.x * 15}px ${mousePosition.y * -5}px,
                                 ${mousePosition.x * -12}px ${mousePosition.y * -8}px,
                                 ${mousePosition.x * 6}px ${mousePosition.y * 14}px`,
              mixBlendMode: 'screen',
              opacity: 0.4
            }}
          />
        </>
      )}

      {/* Interactive lighting enhancement for all effects */}
      {interactiveLighting && interactiveData && isHovering && (
        <div
          className="absolute inset-0 z-25"
          style={{
            background: `
              radial-gradient(
                ellipse 40% 60% at ${(mousePosition.x * 0.8 + 0.1) * 100}% ${(mousePosition.y * 0.8 + 0.1) * 100}%,
                rgba(255, 255, 255, ${interactiveData.lightIntensity * 0.1}) 0%,
                rgba(255, 255, 255, ${interactiveData.lightIntensity * 0.05}) 30%,
                transparent 60%
              )
            `,
            mixBlendMode: 'overlay',
            transform: `translateX(${interactiveData.shadowX * -0.3}px) translateY(${interactiveData.shadowY * -0.3}px)`,
          }}
        />
      )}

      {/* Subtle edge enhancement for depth */}
      <div
        className="absolute inset-0 z-26 rounded-xl"
        style={{
          boxShadow: `
            inset 0 0 15px rgba(255, 255, 255, ${intensity * (interactiveData ? 0.05 + interactiveData.lightIntensity * 0.1 : 0.05)}),
            inset 0 0 5px rgba(255, 255, 255, ${intensity * (interactiveData ? 0.1 + interactiveData.lightIntensity * 0.15 : 0.1)})
          `,
          opacity: interactiveData ? 0.3 + interactiveData.lightIntensity * 0.2 : 0.3
        }}
      />

      {/* Interactive lighting indicator */}
      {interactiveLighting && (
        <div
          className="absolute top-2 right-2 z-30"
          style={{
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            backgroundColor: `rgba(0, 255, 150, ${interactiveData ? 0.2 + interactiveData.lightIntensity * 0.2 : 0.1})`,
            boxShadow: `0 0 6px rgba(0, 255, 150, ${interactiveData ? 0.15 + interactiveData.lightIntensity * 0.15 : 0.05})`,
            transition: 'all 0.1s ease'
          }}
        />
      )}
    </>
  );
};
