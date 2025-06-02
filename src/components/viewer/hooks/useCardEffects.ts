
import { useCallback, useMemo } from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import type { VisualEffect } from '../types';

interface UseCardEffectsProps {
  card: CardData;
  selectedEffect: VisualEffect;
  mousePosition: { x: number; y: number };
  showEffects: boolean;
  effectIntensity: number[];
  overallBrightness: number[];
  interactiveLighting: boolean;
}

export const useCardEffects = ({
  card,
  selectedEffect,
  mousePosition,
  showEffects,
  effectIntensity,
  overallBrightness,
  interactiveLighting
}: UseCardEffectsProps) => {
  // Get frame-specific styles based on template
  const getFrameStyles = useCallback(() => {
    const baseStyles: React.CSSProperties = {
      backgroundColor: '#ffffff',
      borderColor: '#e5e7eb'
    };

    switch (card.template_id) {
      case 'neon':
        return {
          ...baseStyles,
          boxShadow: `0 0 40px #ffa500`,
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          border: `2px solid #ffa500`
        };
      case 'vintage':
        return {
          ...baseStyles,
          boxShadow: '0 10px 20px rgba(139,69,19,0.3)',
          background: 'linear-gradient(135deg, #f5e6d3 0%, #e6d7c3 100%)',
          border: '3px solid #8b4513'
        };
      case 'classic':
        return {
          ...baseStyles,
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          background: '#ffffff',
          border: '2px solid #d1d5db'
        };
      case 'modern':
        return {
          ...baseStyles,
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          border: '1px solid #cbd5e1'
        };
      default:
        return baseStyles;
    }
  }, [card.template_id]);

  // Enhanced physical effects calculation
  const getPhysicalEffectStyles = useCallback(() => {
    const styles: React.CSSProperties = {};
    
    if (showEffects) {
      const intensity = effectIntensity[0] / 100;
      const brightness = overallBrightness[0] / 100;
      
      // Calculate light angle and position for realistic effects
      const lightAngle = Math.atan2(mousePosition.y - 0.5, mousePosition.x - 0.5) * (180 / Math.PI);
      const lightDistance = Math.sqrt(Math.pow(mousePosition.x - 0.5, 2) + Math.pow(mousePosition.y - 0.5, 2));
      const highlightX = mousePosition.x * 100;
      const highlightY = mousePosition.y * 100;
      
      // Apply selected physical effect
      switch (selectedEffect.id) {
        case 'holographic':
          // Multi-layer holographic film effect
          styles.background = `
            radial-gradient(circle at ${highlightX}% ${highlightY}%, 
              rgba(255,0,150,${intensity * 0.4}) 0%, 
              rgba(0,255,150,${intensity * 0.3}) 25%, 
              rgba(150,0,255,${intensity * 0.4}) 50%, 
              rgba(255,100,0,${intensity * 0.3}) 75%, 
              transparent 100%),
            conic-gradient(from ${lightAngle}deg at ${highlightX}% ${highlightY}%, 
              #ff006e ${intensity * 30}%, 
              #8338ec ${intensity * 40}%, 
              #3a86ff ${intensity * 30}%, 
              #06ffa5 ${intensity * 40}%, 
              #ffbe0b ${intensity * 30}%, 
              #ff006e ${intensity * 30}%),
            repeating-linear-gradient(${lightAngle + 45}deg, 
              transparent, 
              transparent 2px, 
              rgba(255,255,255,${intensity * 0.1}) 2px, 
              rgba(255,255,255,${intensity * 0.1}) 4px)
          `;
          styles.backgroundBlendMode = 'screen, color-dodge, overlay';
          break;
          
        case 'foilspray':
          // Metallic spray treatment
          styles.background = `
            radial-gradient(ellipse ${150 + lightDistance * 100}% ${80 + lightDistance * 50}% at ${highlightX}% ${highlightY}%, 
              rgba(255,215,0,${intensity * 0.8}) 0%, 
              rgba(255,223,0,${intensity * 0.6}) 30%, 
              rgba(218,165,32,${intensity * 0.4}) 60%, 
              transparent 100%),
            linear-gradient(${lightAngle}deg, 
              rgba(255,215,0,${intensity * 0.3}), 
              rgba(255,223,0,${intensity * 0.5}), 
              rgba(218,165,32,${intensity * 0.3})),
            radial-gradient(circle at ${highlightX + 10}% ${highlightY - 10}%, 
              rgba(255,255,255,${intensity * 0.6}) 0%, 
              transparent 20%)
          `;
          styles.backgroundBlendMode = 'multiply, screen, color-dodge';
          break;
          
        case 'prizm':
          // Geometric prismatic patterns
          styles.background = `
            conic-gradient(from ${lightAngle}deg at ${highlightX}% ${highlightY}%, 
              #ff0080 0deg, 
              #ff8000 ${60 * intensity}deg, 
              #80ff00 ${120 * intensity}deg, 
              #00ff80 ${180 * intensity}deg, 
              #0080ff ${240 * intensity}deg, 
              #8000ff ${300 * intensity}deg, 
              #ff0080 360deg),
            repeating-conic-gradient(from ${lightAngle + 30}deg at ${highlightX}% ${highlightY}%, 
              transparent 0deg, 
              rgba(255,255,255,${intensity * 0.2}) ${15 * intensity}deg, 
              transparent ${30 * intensity}deg)
          `;
          styles.backgroundBlendMode = 'screen, overlay';
          styles.clipPath = `polygon(
            ${10 + lightDistance * 5}% ${10 + lightDistance * 5}%, 
            ${90 - lightDistance * 5}% ${10 + lightDistance * 5}%, 
            ${90 - lightDistance * 5}% ${90 - lightDistance * 5}%, 
            ${10 + lightDistance * 5}% ${90 - lightDistance * 5}%
          )`;
          break;
          
        case 'chrome':
          // Mirror-like chrome finish
          styles.background = `
            linear-gradient(${lightAngle}deg, 
              rgba(192,192,192,${intensity * 0.4}) 0%, 
              rgba(255,255,255,${intensity * 0.8}) 45%, 
              rgba(169,169,169,${intensity * 0.6}) 50%, 
              rgba(255,255,255,${intensity * 0.8}) 55%, 
              rgba(128,128,128,${intensity * 0.4}) 100%),
            radial-gradient(ellipse at ${highlightX}% ${highlightY}%, 
              rgba(255,255,255,${intensity * 0.9}) 0%, 
              rgba(255,255,255,${intensity * 0.3}) 30%, 
              transparent 60%)
          `;
          styles.backgroundBlendMode = 'screen, color-dodge';
          break;
          
        case 'interference':
          // Soap bubble interference patterns
          styles.background = `
            radial-gradient(circle at ${highlightX}% ${highlightY}%, 
              rgba(138,43,226,${intensity * 0.3}) 0%, 
              rgba(75,0,130,${intensity * 0.4}) 20%, 
              rgba(0,191,255,${intensity * 0.3}) 40%, 
              rgba(50,205,50,${intensity * 0.4}) 60%, 
              rgba(255,215,0,${intensity * 0.3}) 80%, 
              transparent 100%),
            repeating-radial-gradient(circle at ${highlightX}% ${highlightY}%, 
              transparent 0px, 
              rgba(255,255,255,${intensity * 0.1}) ${5 + lightDistance * 10}px, 
              transparent ${10 + lightDistance * 20}px)
          `;
          styles.backgroundBlendMode = 'multiply, screen';
          break;
          
        case 'brushedmetal':
          // Directional brushed metal
          styles.background = `
            repeating-linear-gradient(${lightAngle}deg, 
              rgba(192,192,192,${intensity * 0.2}) 0px, 
              rgba(255,255,255,${intensity * 0.4}) 1px, 
              rgba(169,169,169,${intensity * 0.3}) 2px, 
              rgba(192,192,192,${intensity * 0.2}) 3px),
            linear-gradient(${lightAngle + 90}deg, 
              rgba(255,255,255,${intensity * 0.6}) 0%, 
              transparent 50%, 
              rgba(255,255,255,${intensity * 0.6}) 100%)
          `;
          styles.backgroundBlendMode = 'multiply, screen';
          break;
          
        case 'crystal':
          // Faceted crystal patterns
          styles.background = `
            conic-gradient(from ${lightAngle}deg at ${highlightX}% ${highlightY}%, 
              transparent 0deg, 
              rgba(255,255,255,${intensity * 0.4}) ${30 * intensity}deg, 
              transparent ${60 * intensity}deg, 
              rgba(255,255,255,${intensity * 0.6}) ${90 * intensity}deg, 
              transparent ${120 * intensity}deg, 
              rgba(255,255,255,${intensity * 0.4}) ${150 * intensity}deg, 
              transparent 180deg),
            radial-gradient(circle at ${highlightX}% ${highlightY}%, 
              rgba(255,255,255,${intensity * 0.5}) 0%, 
              rgba(200,200,255,${intensity * 0.3}) 30%, 
              transparent 60%)
          `;
          styles.backgroundBlendMode = 'screen, color-dodge';
          break;
          
        case 'vintage':
          // Vintage film effect
          styles.background = `
            radial-gradient(circle at ${highlightX}% ${highlightY}%, 
              rgba(139,69,19,${intensity * 0.2}) 0%, 
              rgba(160,82,45,${intensity * 0.1}) 50%, 
              transparent 80%),
            repeating-linear-gradient(45deg, 
              transparent, 
              transparent 8px, 
              rgba(139,69,19,${intensity * 0.05}) 8px, 
              rgba(139,69,19,${intensity * 0.05}) 16px)
          `;
          styles.filter = `sepia(${intensity * 0.6}) contrast(${1 + intensity * 0.2})`;
          break;
      }
      
      // Add surface texture overlay
      styles.position = 'relative';
      styles.overflow = 'hidden';
    }
    
    return styles;
  }, [selectedEffect, mousePosition, showEffects, effectIntensity, overallBrightness, interactiveLighting]);

  // Enhanced surface texture component
  const SurfaceTexture = useMemo(() => {
    if (!showEffects || effectIntensity[0] === 0) return null;
    
    const intensity = effectIntensity[0] / 100;
    
    return (
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            repeating-linear-gradient(45deg, 
              transparent, 
              transparent 1px, 
              rgba(255,255,255,${intensity * 0.02}) 1px, 
              rgba(255,255,255,${intensity * 0.02}) 2px),
            repeating-linear-gradient(-45deg, 
              transparent, 
              transparent 1px, 
              rgba(0,0,0,${intensity * 0.01}) 1px, 
              rgba(0,0,0,${intensity * 0.01}) 2px)
          `,
          mixBlendMode: 'overlay',
          opacity: 0.3
        }}
      />
    );
  }, [showEffects, effectIntensity]);

  return {
    getFrameStyles,
    getPhysicalEffectStyles,
    SurfaceTexture
  };
};
