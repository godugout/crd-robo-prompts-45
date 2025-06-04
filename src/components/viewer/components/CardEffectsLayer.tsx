
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

  // Helper function to safely get effect parameter values
  const getEffectParam = (effectId: string, paramId: string, defaultValue: any = 0) => {
    return effectValues?.[effectId]?.[paramId] ?? defaultValue;
  };
  
  // Get individual effect intensities from effectValues
  const holographicIntensity = getEffectParam('holographic', 'intensity', 0);
  const chromeIntensity = getEffectParam('chrome', 'intensity', 0);
  const brushedmetalIntensity = getEffectParam('brushedmetal', 'intensity', 0);
  const crystalIntensity = getEffectParam('crystal', 'intensity', 0);
  const vintageIntensity = getEffectParam('vintage', 'intensity', 0);
  const interferenceIntensity = getEffectParam('interference', 'intensity', 0);
  const prizemIntensity = getEffectParam('prizm', 'intensity', 0);
  const foilsprayIntensity = getEffectParam('foilspray', 'intensity', 0);
  const goldIntensity = getEffectParam('gold', 'intensity', 0);
  
  return (
    <>
      {/* Enhanced Interactive Lighting Layer */}
      {interactiveLighting && (
        <EnhancedInteractiveLightingLayer
          lightingData={enhancedLightingData}
          effectValues={effectValues}
          mousePosition={mousePosition}
        />
      )}

      {/* Gold Effect - Only render if intensity > 0 */}
      {goldIntensity > 0 && (
        <>
          {/* Base gold layer */}
          <div
            className="absolute inset-0 z-20"
            style={{
              background: `
                radial-gradient(
                  ellipse at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                  rgba(255, 215, 0, ${(goldIntensity / 100) * 0.25}) 0%,
                  rgba(255, 165, 0, ${(goldIntensity / 100) * 0.15}) 40%,
                  rgba(184, 134, 11, ${(goldIntensity / 100) * 0.1}) 70%,
                  transparent 100%
                )
              `,
              mixBlendMode: 'screen',
              opacity: 0.6
            }}
          />
          
          {/* Gold shimmer */}
          <div
            className="absolute inset-0 z-21"
            style={{
              background: `
                linear-gradient(
                  ${45 + mousePosition.x * 90}deg,
                  transparent 0%,
                  rgba(255, 255, 153, ${(goldIntensity / 100) * 0.3}) 20%,
                  rgba(255, 215, 0, ${(goldIntensity / 100) * 0.2}) 50%,
                  rgba(255, 255, 153, ${(goldIntensity / 100) * 0.3}) 80%,
                  transparent 100%
                )
              `,
              mixBlendMode: 'overlay',
              opacity: 0.4
            }}
          />
        </>
      )}

      {/* Crystal Effect - Enhanced with Geometric Reflective Patterns */}
      {crystalIntensity > 0 && (
        <>
          {/* Base crystal translucency */}
          <div
            className="absolute inset-0 z-20"
            style={{
              background: `
                radial-gradient(
                  circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                  rgba(200, 220, 255, ${(crystalIntensity / 100) * 0.12}) 0%,
                  rgba(255, 200, 220, ${(crystalIntensity / 100) * 0.08}) 33%,
                  rgba(220, 255, 200, ${(crystalIntensity / 100) * 0.08}) 66%,
                  rgba(200, 220, 255, ${(crystalIntensity / 100) * 0.04}) 100%
                )
              `,
              mixBlendMode: 'multiply',
              opacity: 0.5
            }}
          />
          
          {/* Dynamic Geometric Facet Patterns */}
          <div
            className="absolute inset-0 z-21"
            style={{
              clipPath: `polygon(
                ${20 + mousePosition.x * 10}% ${10 + mousePosition.y * 5}%,
                ${50 + mousePosition.x * 15}% ${5 + mousePosition.y * 8}%,
                ${80 - mousePosition.x * 12}% ${15 + mousePosition.y * 10}%,
                ${85 - mousePosition.x * 8}% ${45 + mousePosition.y * 15}%,
                ${70 - mousePosition.x * 10}% ${75 - mousePosition.y * 12}%,
                ${40 + mousePosition.x * 8}% ${85 - mousePosition.y * 10}%,
                ${15 + mousePosition.x * 5}% ${60 - mousePosition.y * 15}%,
                ${10 + mousePosition.x * 8}% ${30 + mousePosition.y * 8}%
              )`,
              background: `
                linear-gradient(
                  ${45 + mousePosition.x * 180}deg,
                  rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.3}) 0%,
                  rgba(200, 220, 255, ${(crystalIntensity / 100) * 0.2}) 30%,
                  rgba(255, 200, 255, ${(crystalIntensity / 100) * 0.25}) 60%,
                  transparent 100%
                )
              `,
              mixBlendMode: 'overlay',
              opacity: 0.4
            }}
          />
          
          {/* Prismatic Geometric Reflections */}
          <div
            className="absolute inset-0 z-22"
            style={{
              background: `
                conic-gradient(
                  from ${mousePosition.x * 360}deg at ${30 + mousePosition.x * 40}% ${30 + mousePosition.y * 40}%,
                  rgba(255, 0, 127, ${(crystalIntensity / 100) * 0.15}) 0deg,
                  transparent 60deg,
                  rgba(127, 255, 0, ${(crystalIntensity / 100) * 0.15}) 120deg,
                  transparent 180deg,
                  rgba(0, 127, 255, ${(crystalIntensity / 100) * 0.15}) 240deg,
                  transparent 300deg,
                  rgba(255, 0, 127, ${(crystalIntensity / 100) * 0.15}) 360deg
                )
              `,
              clipPath: 'polygon(25% 25%, 75% 25%, 90% 50%, 75% 75%, 25% 75%, 10% 50%)',
              mixBlendMode: 'screen',
              opacity: 0.3
            }}
          />
          
          {/* Triangular Facet Highlights */}
          <div
            className="absolute inset-0 z-23"
            style={{
              background: `
                linear-gradient(
                  ${120 + mousePosition.y * 120}deg,
                  transparent 0%,
                  rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.4}) 40%,
                  transparent 60%
                )
              `,
              clipPath: `polygon(
                ${40 + mousePosition.x * 20}% ${20 + mousePosition.y * 10}%,
                ${60 - mousePosition.x * 20}% ${20 + mousePosition.y * 10}%,
                ${50}% ${50 + mousePosition.y * 20}%
              )`,
              mixBlendMode: 'overlay',
              opacity: 0.5
            }}
          />
        </>
      )}

      {/* Vintage Effect - Realistic Cardstock Paper */}
      {vintageIntensity > 0 && (
        <>
          {/* Cardstock base texture with paper fibers */}
          <div
            className="absolute inset-0 z-20"
            style={{
              background: `
                linear-gradient(
                  0deg,
                  rgba(245, 240, 230, ${(vintageIntensity / 100) * 0.4}) 0%,
                  rgba(250, 245, 235, ${(vintageIntensity / 100) * 0.3}) 50%,
                  rgba(248, 243, 233, ${(vintageIntensity / 100) * 0.35}) 100%
                )
              `,
              mixBlendMode: 'multiply',
              opacity: 0.8
            }}
          />
          
          {/* Paper fiber grain texture */}
          <div
            className="absolute inset-0 z-21"
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  ${getEffectParam('vintage', 'aging', 40) > 50 ? 88 : 92}deg,
                  transparent 0px,
                  rgba(220, 210, 190, ${(vintageIntensity / 100) * 0.15}) 0.5px,
                  transparent 1px,
                  transparent 2px,
                  rgba(235, 225, 205, ${(vintageIntensity / 100) * 0.1}) 2.5px,
                  transparent 3px
                ),
                repeating-linear-gradient(
                  ${getEffectParam('vintage', 'aging', 40) > 50 ? 2 : -2}deg,
                  transparent 0px,
                  rgba(210, 200, 180, ${(vintageIntensity / 100) * 0.08}) 1px,
                  transparent 3px
                )
              `,
              mixBlendMode: 'multiply',
              opacity: 0.6
            }}
          />
          
          {/* Aging spots and discoloration */}
          <div
            className="absolute inset-0 z-22"
            style={{
              backgroundImage: `
                radial-gradient(
                  ellipse at 20% 30%, 
                  rgba(200, 180, 140, ${(vintageIntensity / 100) * 0.2}) 0%, 
                  transparent 3%
                ),
                radial-gradient(
                  ellipse at 70% 80%, 
                  rgba(190, 170, 130, ${(vintageIntensity / 100) * 0.15}) 0%, 
                  transparent 4%
                ),
                radial-gradient(
                  ellipse at 85% 15%, 
                  rgba(210, 190, 150, ${(vintageIntensity / 100) * 0.18}) 0%, 
                  transparent 2%
                ),
                radial-gradient(
                  ellipse at 15% 85%, 
                  rgba(180, 160, 120, ${(vintageIntensity / 100) * 0.12}) 0%, 
                  transparent 3%
                )
              `,
              mixBlendMode: 'multiply',
              opacity: Math.min(getEffectParam('vintage', 'aging', 40) / 100, 0.7)
            }}
          />
          
          {/* Edge wear and patina */}
          <div
            className="absolute inset-0 z-23"
            style={{
              background: `
                radial-gradient(
                  ellipse at center,
                  transparent 60%,
                  rgba(160, 140, 100, ${(vintageIntensity / 100) * 0.25}) 85%,
                  rgba(140, 120, 80, ${(vintageIntensity / 100) * 0.15}) 100%
                )
              `,
              mixBlendMode: 'multiply',
              opacity: Math.min(getEffectParam('vintage', 'aging', 40) / 150, 0.5)
            }}
          />
          
          {/* Paper texture noise */}
          <div
            className="absolute inset-0 z-24"
            style={{
              backgroundImage: `
                radial-gradient(circle at 30% 30%, rgba(230, 220, 200, ${(vintageIntensity / 100) * 0.08}) 1px, transparent 1px),
                radial-gradient(circle at 70% 70%, rgba(240, 230, 210, ${(vintageIntensity / 100) * 0.06}) 1px, transparent 1px),
                radial-gradient(circle at 20% 80%, rgba(225, 215, 195, ${(vintageIntensity / 100) * 0.07}) 1px, transparent 1px)
              `,
              backgroundSize: '15px 15px, 20px 20px, 18px 18px',
              backgroundPosition: '0 0, 10px 10px, 5px 15px',
              mixBlendMode: 'overlay',
              opacity: 0.4
            }}
          />
        </>
      )}

      {/* Chrome Mirror Effect - Smooth, Bright, Highly Reflective */}
      {chromeIntensity > 0 && (
        <>
          {/* Base chrome reflection - bright white/silver */}
          <div
            className="absolute inset-0 z-20"
            style={{
              background: `
                linear-gradient(
                  ${45 + mousePosition.x * 90}deg,
                  rgba(245, 248, 252, ${(chromeIntensity / 100) * 0.4}) 0%,
                  rgba(255, 255, 255, ${(chromeIntensity / 100) * 0.5}) 25%,
                  rgba(240, 244, 248, ${(chromeIntensity / 100) * 0.3}) 50%,
                  rgba(252, 254, 255, ${(chromeIntensity / 100) * 0.6}) 75%,
                  rgba(248, 250, 252, ${(chromeIntensity / 100) * 0.35}) 100%
                )
              `,
              mixBlendMode: 'screen',
              opacity: 0.8
            }}
          />
          
          {/* Mirror-like highlights - no lines, pure reflection */}
          <div
            className="absolute inset-0 z-21"
            style={{
              background: `
                radial-gradient(
                  ellipse at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                  rgba(255, 255, 255, ${(chromeIntensity / 100) * 0.7}) 0%,
                  rgba(248, 252, 255, ${(chromeIntensity / 100) * 0.4}) 30%,
                  transparent 60%
                )
              `,
              mixBlendMode: 'overlay',
              opacity: 0.9
            }}
          />
          
          {/* Chrome depth reflection */}
          <div
            className="absolute inset-0 z-22"
            style={{
              background: `
                linear-gradient(
                  ${90 + mousePosition.y * 90}deg,
                  transparent 0%,
                  rgba(255, 255, 255, ${(chromeIntensity / 100) * 0.8}) 40%,
                  rgba(250, 250, 250, ${(chromeIntensity / 100) * 0.6}) 60%,
                  transparent 100%
                )
              `,
              mixBlendMode: 'screen',
              opacity: 0.5
            }}
          />
        </>
      )}

      {/* Brushed Steel Effect - Dull, Textured, Matte Gray */}
      {brushedmetalIntensity > 0 && (
        <>
          {/* Base steel - dull gray */}
          <div
            className="absolute inset-0 z-20"
            style={{
              background: `
                linear-gradient(
                  ${getEffectParam('brushedmetal', 'direction', 45)}deg,
                  rgba(120, 125, 130, ${(brushedmetalIntensity / 100) * 0.3}) 0%,
                  rgba(135, 140, 145, ${(brushedmetalIntensity / 100) * 0.25}) 50%,
                  rgba(110, 115, 120, ${(brushedmetalIntensity / 100) * 0.3}) 100%
                )
              `,
              mixBlendMode: 'multiply',
              opacity: 0.7
            }}
          />
          
          {/* Prominent brush texture lines */}
          <div
            className="absolute inset-0 z-21"
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  ${getEffectParam('brushedmetal', 'direction', 45)}deg,
                  transparent 0px,
                  rgba(100, 105, 110, ${(brushedmetalIntensity / 100) * 0.25}) 1px,
                  transparent 2px,
                  transparent 3px,
                  rgba(130, 135, 140, ${(brushedmetalIntensity / 100) * 0.2}) 4px,
                  transparent 5px
                )
              `,
              mixBlendMode: 'overlay',
              opacity: 0.6
            }}
          />
          
          {/* Additional texture for roughness */}
          <div
            className="absolute inset-0 z-22"
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  ${getEffectParam('brushedmetal', 'direction', 45) + 2}deg,
                  transparent 0px,
                  rgba(90, 95, 100, ${(brushedmetalIntensity / 100) * 0.15}) 0.5px,
                  transparent 1.5px
                )
              `,
              mixBlendMode: 'multiply',
              opacity: 0.4
            }}
          />
          
          {/* Matte finish overlay */}
          <div
            className="absolute inset-0 z-23"
            style={{
              background: `rgba(105, 110, 115, ${(brushedmetalIntensity / 100) * 0.1})`,
              mixBlendMode: 'darken',
              opacity: 0.5
            }}
          />
        </>
      )}

      {/* Holographic Effect - Only render if intensity > 0 */}
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

      {/* Interference Effect - Only render if intensity > 0 */}
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

      {/* Prizm Effect - Only render if intensity > 0 */}
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

      {/* Foil Spray Effect - Only render if intensity > 0 */}
      {foilsprayIntensity > 0 && (
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
      )}

      {/* Calculate overall intensity for edge enhancement */}
      {(() => {
        const totalIntensity = holographicIntensity + chromeIntensity + brushedmetalIntensity + 
                              crystalIntensity + vintageIntensity + interferenceIntensity + 
                              prizemIntensity + foilsprayIntensity + goldIntensity;
        const normalizedIntensity = Math.min(totalIntensity / 100, 1);
        
        return totalIntensity > 0 ? (
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
        ) : null;
      })()}
    </>
  );
};
