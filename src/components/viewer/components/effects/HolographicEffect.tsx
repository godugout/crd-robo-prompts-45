
import React from 'react';

interface HolographicEffectProps {
  isActive: boolean;
  intensity: number;
  mousePosition: { x: number; y: number };
  physicalEffectStyles: React.CSSProperties;
  showEffects: boolean;
  interactiveData?: {
    lightX: number;
    lightY: number;
    lightIntensity: number;
    shadowX: number;
    shadowY: number;
  } | null;
}

export const HolographicEffect: React.FC<HolographicEffectProps> = ({
  isActive,
  intensity,
  mousePosition,
  physicalEffectStyles,
  showEffects,
  interactiveData
}) => {
  if (isActive) return null;

  return (
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
  );
};
