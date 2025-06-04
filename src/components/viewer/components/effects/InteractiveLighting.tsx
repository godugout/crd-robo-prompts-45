
import React from 'react';

interface InteractiveLightingProps {
  enabled: boolean;
  isHovering: boolean;
  mousePosition: { x: number; y: number };
  reflectionStrength: number;
  textureIntensity: number;
  intensity: number;
  interactiveData?: {
    lightX: number;
    lightY: number;
    lightIntensity: number;
    shadowX: number;
    shadowY: number;
  } | null;
  isGoldActive: boolean;
  isChromeActive: boolean;
  isBrushedSteelActive: boolean;
  isVintageActive: boolean;
}

export const InteractiveLighting: React.FC<InteractiveLightingProps> = ({
  enabled,
  isHovering,
  mousePosition,
  reflectionStrength,
  textureIntensity,
  intensity,
  interactiveData,
  isGoldActive,
  isChromeActive,
  isBrushedSteelActive,
  isVintageActive
}) => {
  return (
    <>
      {/* Interactive high-frequency reflective/foil pattern */}
      {isHovering && !isChromeActive && !isBrushedSteelActive && !isVintageActive && (
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
      {enabled && interactiveData && isHovering && (
        <div
          className="absolute inset-0 z-25 overflow-hidden"
          style={{
            background: `
              radial-gradient(
                ellipse 60% 80% at ${(mousePosition.x * 0.8 + 0.1) * 100}% ${(mousePosition.y * 0.8 + 0.1) * 100}%,
                rgba(255, 255, 255, ${interactiveData.lightIntensity * (isChromeActive || isBrushedSteelActive ? 0.6 : isVintageActive ? 0.2 : 0.4)}) 0%,
                rgba(255, 255, 255, ${interactiveData.lightIntensity * (isChromeActive || isBrushedSteelActive ? 0.4 : isVintageActive ? 0.1 : 0.2)}) 30%,
                transparent 60%
              )
            `,
            mixBlendMode: 'overlay',
            transform: `translateX(${interactiveData.shadowX * -0.5}px) translateY(${interactiveData.shadowY * -0.5}px)`,
          }}
        />
      )}

      {/* Surface texture with interactive enhancement */}
      {!isChromeActive && !isBrushedSteelActive && !isVintageActive && (
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
      {enabled && (
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
