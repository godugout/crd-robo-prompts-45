
import React from 'react';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';
import type { EnhancedLightingData } from '../../hooks/useEnhancedInteractiveLighting';

interface GoldEffectProps {
  intensity: number;
  goldTone: string;
  shimmerSpeed: number;
  platingThickness: number;
  reflectivity: number;
  colorEnhancement: boolean;
  mousePosition: { x: number; y: number };
  enhancedLightingData?: EnhancedLightingData | null;
}

export const GoldEffect: React.FC<GoldEffectProps> = ({
  intensity,
  goldTone,
  shimmerSpeed,
  platingThickness,
  reflectivity,
  colorEnhancement,
  mousePosition,
  enhancedLightingData
}) => {
  if (intensity <= 0) return null;

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
      {/* Base gold layer for whitespace areas */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background: `
            radial-gradient(
              ellipse at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
              ${goldColors.primary}${Math.round((intensity / 100) * 0.4 * 255).toString(16).padStart(2, '0')} 0%,
              ${goldColors.secondary}${Math.round((intensity / 100) * 0.3 * 255).toString(16).padStart(2, '0')} 40%,
              ${goldColors.accent}${Math.round((intensity / 100) * 0.2 * 255).toString(16).padStart(2, '0')} 70%,
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
              ${goldColors.highlight}${Math.round((intensity / 100) * 0.6 * 255).toString(16).padStart(2, '0')} 20%,
              ${goldColors.primary}${Math.round((intensity / 100) * 0.4 * 255).toString(16).padStart(2, '0')} 50%,
              ${goldColors.highlight}${Math.round((intensity / 100) * 0.6 * 255).toString(16).padStart(2, '0')} 80%,
              transparent 100%
            )
          `,
          mixBlendMode: 'overlay',
          opacity: 0.7,
          animation: `pulse ${3000 / (shimmerSpeed / 50)}ms ease-in-out infinite`,
          transform: `translateX(${Math.sin(Date.now() / (2000 / (shimmerSpeed / 50))) * 10}px)`
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
              ${goldColors.accent}${Math.round((intensity / 100) * 0.15 * 255).toString(16).padStart(2, '0')} ${platingThickness * 0.5}px,
              transparent ${platingThickness}px
            )
          `,
          mixBlendMode: 'screen',
          opacity: 0.4
        }}
      />
      
      {/* Interactive gold reflectivity */}
      {enhancedLightingData && (
        <div
          className="absolute inset-0 z-23"
          style={{
            background: `
              radial-gradient(
                circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                ${goldColors.highlight}${Math.round((reflectivity / 100) * enhancedLightingData.lightIntensity * 0.9 * 255).toString(16).padStart(2, '0')} 0%,
                ${goldColors.primary}${Math.round((reflectivity / 100) * enhancedLightingData.lightIntensity * 0.5 * 255).toString(16).padStart(2, '0')} 30%,
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
      {colorEnhancement && (
        <div
          className="absolute inset-0 z-24"
          style={{
            background: `
              linear-gradient(
                135deg,
                ${goldColors.primary}${Math.round((intensity / 100) * 0.3 * 255).toString(16).padStart(2, '0')} 0%,
                transparent 50%,
                ${goldColors.secondary}${Math.round((intensity / 100) * 0.25 * 255).toString(16).padStart(2, '0')} 100%
              )
            `,
            mixBlendMode: 'color-burn',
            opacity: 0.3,
            filter: 'hue-rotate(15deg) saturate(1.2)'
          }}
        />
      )}
    </>
  );
};
