import React from 'react';
import type { MaterialSettings } from '../types';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { useEnhancedInteractiveLighting } from '../hooks/useEnhancedInteractiveLighting';
import { EnhancedInteractiveLightingLayer } from './EnhancedInteractiveLightingLayer';

interface CardEffectsLayerProps {
  showEffects: boolean;
  isHovering: boolean;
  effectIntensity: number[];
  mousePosition: { x: number; y: number };
  physicalEffectStyles: React.CSSProperties;
  materialSettings?: MaterialSettings;
  interactiveLighting?: boolean;
  effectValues?: EffectValues;
}

export const CardEffectsLayer: React.FC<CardEffectsLayerProps> = ({
  showEffects,
  isHovering,
  mousePosition,
  physicalEffectStyles,
  materialSettings,
  interactiveLighting = false,
  effectValues
}) => {
  // Enhanced interactive lighting hook
  const enhancedLightingData = useEnhancedInteractiveLighting(
    mousePosition, 
    isHovering, 
    interactiveLighting
  );

  if (!showEffects || !effectValues) return null;
  
  // Get individual effect intensities from effectValues
  const holographicIntensity = (effectValues?.holographic?.intensity as number) || 0;
  const chromeIntensity = (effectValues?.chrome?.intensity as number) || 0;
  const brushedmetalIntensity = (effectValues?.brushedmetal?.intensity as number) || 0;
  const crystalIntensity = (effectValues?.crystal?.intensity as number) || 0;
  const vintageIntensity = (effectValues?.vintage?.intensity as number) || 0;
  const interferenceIntensity = (effectValues?.interference?.intensity as number) || 0;
  const prizemIntensity = (effectValues?.prizm?.intensity as number) || 0;
  const foilsprayIntensity = (effectValues?.foilspray?.intensity as number) || 0;
  const goldIntensity = (effectValues?.gold?.intensity as number) || 0;
  
  // Gold effect specific parameters
  const goldTone = (effectValues?.gold?.goldTone as string) || 'rich';
  const goldShimmerSpeed = (effectValues?.gold?.shimmerSpeed as number) || 80;
  const goldPlatingThickness = (effectValues?.gold?.platingThickness as number) || 5;
  const goldReflectivity = (effectValues?.gold?.reflectivity as number) || 85;
  const goldColorEnhancement = (effectValues?.gold?.colorEnhancement as boolean) ?? true;
  
  // Gold tone definitions
  const getGoldColors = (tone: string) => {
    switch (tone) {
      case 'rose':
        return {
          primary: '#E8B4B8',
          secondary: '#D4AF37',
          accent: '#B8860B',
          highlight: '#F5DEB3'
        };
      case 'white':
        return {
          primary: '#F8F8FF',
          secondary: '#E6E6FA',
          accent: '#D3D3D3',
          highlight: '#FFFFFF'
        };
      case 'antique':
        return {
          primary: '#B8860B',
          secondary: '#DAA520',
          accent: '#8B7355',
          highlight: '#F0E68C'
        };
      default: // rich
        return {
          primary: '#FFD700',
          secondary: '#FFA500',
          accent: '#B8860B',
          highlight: '#FFFF99'
        };
    }
  };
  
  const goldColors = getGoldColors(goldTone);
  
  return (
    <>
      {/* Enhanced Interactive Lighting Layer - NEW */}
      {interactiveLighting && (
        <EnhancedInteractiveLightingLayer
          lightingData={enhancedLightingData}
          effectValues={effectValues}
          mousePosition={mousePosition}
        />
      )}

      {/* Gold Effect - Luxurious Gold Plating */}
      {goldIntensity > 0 && (
        <>
          {/* Base gold layer for whitespace areas */}
          <div
            className="absolute inset-0 z-20"
            style={{
              background: `
                radial-gradient(
                  ellipse at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                  ${goldColors.primary}${Math.round((goldIntensity / 100) * 0.4 * 255).toString(16).padStart(2, '0')} 0%,
                  ${goldColors.secondary}${Math.round((goldIntensity / 100) * 0.3 * 255).toString(16).padStart(2, '0')} 40%,
                  ${goldColors.accent}${Math.round((goldIntensity / 100) * 0.2 * 255).toString(16).padStart(2, '0')} 70%,
                  transparent 100%
                )
              `,
              mixBlendMode: 'multiply',
              opacity: 0.8
            }}
          />
          
          {/* Gold shimmer layer with animation */}
          <div
            className="absolute inset-0 z-21"
            style={{
              background: `
                linear-gradient(
                  ${45 + mousePosition.x * 90}deg,
                  transparent 0%,
                  ${goldColors.highlight}${Math.round((goldIntensity / 100) * 0.6 * 255).toString(16).padStart(2, '0')} 20%,
                  ${goldColors.primary}${Math.round((goldIntensity / 100) * 0.4 * 255).toString(16).padStart(2, '0')} 50%,
                  ${goldColors.highlight}${Math.round((goldIntensity / 100) * 0.6 * 255).toString(16).padStart(2, '0')} 80%,
                  transparent 100%
                )
              `,
              mixBlendMode: 'overlay',
              opacity: 0.7,
              animation: `pulse ${3000 / (goldShimmerSpeed / 50)}ms ease-in-out infinite`,
              transform: `translateX(${Math.sin(Date.now() / (2000 / (goldShimmerSpeed / 50))) * 10}px)`
            }}
          />
          
          {/* Gold plating texture */}
          <div
            className="absolute inset-0 z-22"
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  ${mousePosition.x * 180}deg,
                  transparent 0px,
                  ${goldColors.accent}${Math.round((goldIntensity / 100) * 0.15 * 255).toString(16).padStart(2, '0')} ${goldPlatingThickness * 0.5}px,
                  transparent ${goldPlatingThickness}px
                )
              `,
              mixBlendMode: 'screen',
              opacity: 0.4
            }}
          />
          
          {/* Interactive gold reflectivity - Enhanced with lighting data */}
          {interactiveLighting && enhancedLightingData && (
            <div
              className="absolute inset-0 z-23"
              style={{
                background: `
                  radial-gradient(
                    circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                    ${goldColors.highlight}${Math.round((goldReflectivity / 100) * enhancedLightingData.lightIntensity * 0.9 * 255).toString(16).padStart(2, '0')} 0%,
                    ${goldColors.primary}${Math.round((goldReflectivity / 100) * enhancedLightingData.lightIntensity * 0.5 * 255).toString(16).padStart(2, '0')} 30%,
                    transparent 60%
                  )
                `,
                mixBlendMode: 'screen',
                opacity: 0.8,
                transform: `translateX(${enhancedLightingData.lightX * 5}px) translateY(${enhancedLightingData.lightY * 5}px)`,
                transition: 'transform 0.1s ease-out'
              }}
            />
          )}
          
          {/* Yellow color enhancement for gold plating effect */}
          {goldColorEnhancement && (
            <div
              className="absolute inset-0 z-24"
              style={{
                background: `
                  linear-gradient(
                    135deg,
                    ${goldColors.primary}${Math.round((goldIntensity / 100) * 0.3 * 255).toString(16).padStart(2, '0')} 0%,
                    transparent 50%,
                    ${goldColors.secondary}${Math.round((goldIntensity / 100) * 0.25 * 255).toString(16).padStart(2, '0')} 100%
                  )
                `,
                mixBlendMode: 'color-burn',
                opacity: 0.3,
                filter: 'hue-rotate(15deg) saturate(1.2)'
              }}
            />
          )}
        </>
      )}

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
                  ${45 + ((effectValues?.brushedmetal?.direction as number) || 45)}deg,
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
                  ${(effectValues?.brushedmetal?.direction as number) || 45}deg,
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
                from ${mousePosition.x * 180 + (enhancedLightingData ? enhancedLightingData.lightX * 90 : 0)}deg at 50% 60%,
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

      {/* Calculate overall intensity for edge enhancement */}
      {(() => {
        const totalIntensity = holographicIntensity + chromeIntensity + brushedmetalIntensity + 
                              crystalIntensity + vintageIntensity + interferenceIntensity + 
                              prizemIntensity + foilsprayIntensity + goldIntensity;
        const normalizedIntensity = Math.min(totalIntensity / 100, 1);
        
        return (
          <div
            className="absolute inset-0 z-26 rounded-xl"
            style={{
              boxShadow: `
                inset 0 0 15px rgba(255, 255, 255, ${normalizedIntensity * (enhancedLightingData ? 0.05 + enhancedLightingData.lightIntensity * 0.1 : 0.05)}),
                inset 0 0 5px rgba(255, 255, 255, ${normalizedIntensity * (enhancedLightingData ? 0.1 + enhancedLightingData.lightIntensity * 0.15 : 0.1)})
              `,
              opacity: enhancedLightingData ? 0.3 + enhancedLightingData.lightIntensity * 0.2 : 0.3
            }}
          />
        );
      })()}
    </>
  );
};
