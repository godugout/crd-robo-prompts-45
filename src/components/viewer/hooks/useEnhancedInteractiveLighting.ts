
import { useMemo } from 'react';

export interface EnhancedLightingData {
  // Basic lighting
  lightX: number;
  lightY: number;
  lightIntensity: number;
  lightDistance: number;
  
  // Shadow casting
  shadowX: number;
  shadowY: number;
  shadowBlur: number;
  shadowOpacity: number;
  
  // Dynamic reflections
  reflectionAngle: number;
  reflectionIntensity: number;
  reflectionSpread: number;
  
  // 3D simulation
  ambientOcclusion: number;
  surfaceNormal: { x: number; y: number; z: number };
  lightDirection: { x: number; y: number; z: number };
  
  // Environmental response
  colorTemperature: number;
  atmosphericScatter: number;
  directionalBias: number;
}

export const useEnhancedInteractiveLighting = (
  mousePosition: { x: number; y: number },
  isHovering: boolean,
  interactiveLighting: boolean
) => {
  const enhancedLightingData = useMemo((): EnhancedLightingData | null => {
    if (!interactiveLighting || !isHovering) return null;
    
    // Normalize mouse position to -1 to 1 range
    const normalizedX = (mousePosition.x - 0.5) * 2;
    const normalizedY = (mousePosition.y - 0.5) * 2;
    
    // Calculate light distance from center
    const lightDistance = Math.sqrt(normalizedX * normalizedX + normalizedY * normalizedY);
    const clampedDistance = Math.min(lightDistance, 1);
    
    // Enhanced light intensity with falloff
    const lightIntensity = Math.max(0.2, 1 - (clampedDistance * 0.6));
    
    // Advanced shadow calculations
    const shadowX = normalizedX * -30; // Opposite direction shadow
    const shadowY = normalizedY * -30;
    const shadowBlur = 5 + (clampedDistance * 15); // More distance = more blur
    const shadowOpacity = lightIntensity * 0.8;
    
    // Dynamic reflection calculations
    const reflectionAngle = Math.atan2(normalizedY, normalizedX) * (180 / Math.PI);
    const reflectionIntensity = lightIntensity * (1 - clampedDistance * 0.3);
    const reflectionSpread = 20 + (clampedDistance * 40);
    
    // 3D lighting simulation
    const lightDirection = {
      x: normalizedX,
      y: normalizedY,
      z: 0.5 + (lightIntensity * 0.5) // Height varies with intensity
    };
    
    const surfaceNormal = { x: 0, y: 0, z: 1 }; // Card surface normal
    
    // Ambient occlusion based on light position
    const ambientOcclusion = Math.max(0.1, 0.5 - (clampedDistance * 0.3));
    
    // Environmental response
    const colorTemperature = 0.5 + (normalizedX * 0.3); // Warmer on right, cooler on left
    const atmosphericScatter = lightIntensity * (1 - clampedDistance * 0.4);
    const directionalBias = Math.abs(normalizedX) + Math.abs(normalizedY);
    
    return {
      lightX: normalizedX,
      lightY: normalizedY,
      lightIntensity,
      lightDistance: clampedDistance,
      shadowX,
      shadowY,
      shadowBlur,
      shadowOpacity,
      reflectionAngle,
      reflectionIntensity,
      reflectionSpread,
      ambientOcclusion,
      surfaceNormal,
      lightDirection,
      colorTemperature,
      atmosphericScatter,
      directionalBias
    };
  }, [mousePosition, isHovering, interactiveLighting]);
  
  return enhancedLightingData;
};
