
import React, { useMemo } from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';

export interface EffectParameter {
  id: string;
  name: string;
  type: 'slider' | 'toggle' | 'color' | 'select';
  min?: number;
  max?: number;
  step?: number;
  defaultValue: number | boolean | string;
  options?: { value: string; label: string }[];
}

export interface VisualEffectConfig {
  id: string;
  name: string;
  description: string;
  category: 'metallic' | 'prismatic' | 'surface' | 'vintage';
  parameters: EffectParameter[];
}

export interface EffectValues {
  [effectId: string]: {
    [parameterId: string]: number | boolean | string;
  };
}

// Define all visual effects with their unique parameters
export const ENHANCED_VISUAL_EFFECTS: VisualEffectConfig[] = [
  {
    id: 'holographic',
    name: 'Holographic',
    description: 'Dynamic rainbow shifting with prismatic effects',
    category: 'prismatic',
    parameters: [
      { id: 'intensity', name: 'Intensity', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 70 },
      { id: 'shiftSpeed', name: 'Color Shift Speed', type: 'slider', min: 0, max: 200, step: 5, defaultValue: 100 },
      { id: 'rainbowSpread', name: 'Rainbow Spread', type: 'slider', min: 0, max: 360, step: 10, defaultValue: 180 },
      { id: 'prismaticDepth', name: 'Prismatic Depth', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 50 },
      { id: 'animated', name: 'Animated', type: 'toggle', defaultValue: true }
    ]
  },
  {
    id: 'foilspray',
    name: 'Foil Spray',
    description: 'Metallic spray pattern with directional flow',
    category: 'metallic',
    parameters: [
      { id: 'intensity', name: 'Intensity', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 60 },
      { id: 'density', name: 'Metallic Density', type: 'slider', min: 10, max: 100, step: 5, defaultValue: 50 },
      { id: 'pattern', name: 'Spray Pattern', type: 'select', defaultValue: 'radial', 
        options: [
          { value: 'radial', label: 'Radial' },
          { value: 'linear', label: 'Linear' },
          { value: 'scattered', label: 'Scattered' }
        ]
      },
      { id: 'direction', name: 'Flow Direction', type: 'slider', min: 0, max: 360, step: 15, defaultValue: 45 },
      { id: 'shimmer', name: 'Shimmer Effect', type: 'toggle', defaultValue: true }
    ]
  },
  {
    id: 'prizm',
    name: 'Prizm',
    description: 'Geometric prismatic patterns with color separation',
    category: 'prismatic',
    parameters: [
      { id: 'intensity', name: 'Intensity', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 80 },
      { id: 'complexity', name: 'Pattern Complexity', type: 'slider', min: 1, max: 10, step: 1, defaultValue: 5 },
      { id: 'colorSeparation', name: 'Color Separation', type: 'slider', min: 0, max: 100, step: 5, defaultValue: 60 },
      { id: 'geometricScale', name: 'Geometric Scale', type: 'slider', min: 50, max: 200, step: 10, defaultValue: 100 },
      { id: 'rotation', name: 'Pattern Rotation', type: 'slider', min: 0, max: 360, step: 15, defaultValue: 0 }
    ]
  },
  {
    id: 'chrome',
    name: 'Chrome',
    description: 'Metallic chrome finish with mirror-like reflections',
    category: 'metallic',
    parameters: [
      { id: 'intensity', name: 'Intensity', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 75 },
      { id: 'sharpness', name: 'Reflection Sharpness', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 70 },
      { id: 'distortion', name: 'Mirror Distortion', type: 'slider', min: 0, max: 50, step: 1, defaultValue: 15 },
      { id: 'highlightSize', name: 'Highlight Size', type: 'slider', min: 10, max: 90, step: 5, defaultValue: 40 },
      { id: 'polish', name: 'Surface Polish', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 80 }
    ]
  },
  {
    id: 'interference',
    name: 'Interference',
    description: 'Soap bubble interference patterns',
    category: 'surface',
    parameters: [
      { id: 'intensity', name: 'Intensity', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 65 },
      { id: 'frequency', name: 'Wave Frequency', type: 'slider', min: 1, max: 20, step: 1, defaultValue: 8 },
      { id: 'thickness', name: 'Bubble Thickness', type: 'slider', min: 1, max: 10, step: 0.5, defaultValue: 3 },
      { id: 'colorShift', name: 'Color Shift Speed', type: 'slider', min: 0, max: 100, step: 5, defaultValue: 30 },
      { id: 'ripples', name: 'Ripple Effect', type: 'toggle', defaultValue: true }
    ]
  },
  {
    id: 'brushedmetal',
    name: 'Brushed Metal',
    description: 'Brushed metallic surface with directional grain',
    category: 'metallic',
    parameters: [
      { id: 'intensity', name: 'Intensity', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 70 },
      { id: 'direction', name: 'Brush Direction', type: 'slider', min: 0, max: 180, step: 15, defaultValue: 45 },
      { id: 'grainDensity', name: 'Grain Density', type: 'slider', min: 1, max: 20, step: 1, defaultValue: 8 },
      { id: 'metallic', name: 'Metallic Finish', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 85 },
      { id: 'roughness', name: 'Surface Roughness', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 25 }
    ]
  },
  {
    id: 'crystal',
    name: 'Crystal',
    description: 'Crystalline faceted surface with light dispersion',
    category: 'prismatic',
    parameters: [
      { id: 'intensity', name: 'Intensity', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 85 },
      { id: 'facets', name: 'Facet Count', type: 'slider', min: 3, max: 20, step: 1, defaultValue: 8 },
      { id: 'dispersion', name: 'Light Dispersion', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 60 },
      { id: 'clarity', name: 'Crystal Clarity', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 75 },
      { id: 'sparkle', name: 'Sparkle Effect', type: 'toggle', defaultValue: true }
    ]
  },
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Aged patina with wear patterns',
    category: 'vintage',
    parameters: [
      { id: 'intensity', name: 'Intensity', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 55 },
      { id: 'aging', name: 'Aging Level', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 40 },
      { id: 'patina', name: 'Patina Color', type: 'color', defaultValue: '#8b7355' },
      { id: 'wear', name: 'Wear Patterns', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 30 },
      { id: 'scratches', name: 'Surface Scratches', type: 'toggle', defaultValue: true }
    ]
  }
];

interface UseEnhancedCardEffectsProps {
  card: CardData;
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
  showEffects: boolean;
  overallBrightness: number[];
  interactiveLighting: boolean;
  selectedScene?: EnvironmentScene;
  selectedLighting?: LightingPreset;
  materialSettings?: MaterialSettings;
  zoom?: number;
  rotation?: { x: number; y: number };
  isHovering?: boolean;
}

export const useEnhancedCardEffects = ({
  card,
  effectValues,
  mousePosition,
  showEffects,
  overallBrightness,
  interactiveLighting,
  selectedScene,
  selectedLighting,
  materialSettings = { roughness: 0.3, metalness: 0.6, clearcoat: 0.75, reflectivity: 0.5 },
  zoom = 1,
  rotation = { x: 0, y: 0 },
  isHovering = false
}: UseEnhancedCardEffectsProps) => {
  
  // Get effective mouse position - static center when interactive lighting is off
  const effectiveMousePosition = useMemo(() => {
    if (interactiveLighting) {
      return mousePosition;
    }
    // When interactive lighting is off, use center position for static effects
    return { x: 0.5, y: 0.5 };
  }, [interactiveLighting, mousePosition]);
  
  // Enhanced Interactive Lighting System
  const getInteractiveLightingEffects = () => {
    if (!interactiveLighting) {
      // Return static lighting data when interactive lighting is off
      return {
        lightPosition: { x: 0, y: 0 },
        lightIntensity: 0.5, // Static moderate intensity
        colorTemperature: 5500, // Neutral color temperature
        isWarm: false,
        shadowOffset: { x: 0, y: 0 },
        shadowBlur: 20,
        shadowOpacity: 0.15 // Reduced static shadow
      };
    }
    
    // Calculate light position relative to mouse (inverted for realistic lighting)
    const lightX = (0.5 - mousePosition.x) * 2; // -1 to 1
    const lightY = (0.5 - mousePosition.y) * 2; // -1 to 1
    const lightDistance = Math.sqrt(lightX * lightX + lightY * lightY);
    const lightIntensity = Math.max(0.3, 1 - lightDistance * 0.5);
    
    // Dynamic color temperature based on position
    const colorTemp = 5000 + (mousePosition.x - 0.5) * 2000; // 4000K to 6000K
    const isWarm = colorTemp < 5000;
    
    // Create dynamic shadow opposite to light
    const shadowX = lightX * -30 * lightIntensity;
    const shadowY = lightY * -30 * lightIntensity;
    const shadowBlur = 20 + lightDistance * 20;
    
    return {
      lightPosition: { x: lightX, y: lightY },
      lightIntensity,
      colorTemperature: colorTemp,
      isWarm,
      shadowOffset: { x: shadowX, y: shadowY },
      shadowBlur,
      shadowOpacity: 0.3 * lightIntensity
    };
  };

  // Apply lighting settings to create CSS filters
  const getLightingFilterStyle = () => {
    if (!selectedLighting) return '';
    
    const interactive = getInteractiveLightingEffects();
    
    // Base filters from lighting preset
    let brightnessValue = (selectedLighting.brightness / 100) * (overallBrightness[0] / 100);
    let contrastValue = selectedLighting.contrast / 100;
    let saturationValue = 1;
    let hueRotation = 0;
    
    // Apply interactive lighting modifications only when enabled
    if (interactiveLighting && interactive.lightIntensity) {
      // Dynamic brightness based on light intensity
      brightnessValue *= (0.8 + interactive.lightIntensity * 0.4);
      
      // Dynamic contrast for more dramatic effect
      contrastValue *= (0.9 + interactive.lightIntensity * 0.3);
      
      // Color temperature effects
      if (interactive.isWarm) {
        saturationValue = 1.1;
        hueRotation = -5; // Slightly warmer
      } else {
        saturationValue = 0.95;
        hueRotation = 5; // Slightly cooler
      }
    }
    
    // Create dynamic shadow based on rotation and interactive lighting
    let shadowX = Math.sin(rotation.y * 0.017) * 15;
    let shadowY = Math.sin(rotation.x * 0.017) * 15;
    let shadowBlur = selectedLighting.shadowSoftness;
    let shadowOpacity = selectedLighting.shadows / 300;
    
    if (interactiveLighting && interactive.shadowOffset) {
      shadowX += interactive.shadowOffset.x;
      shadowY += interactive.shadowOffset.y;
      shadowBlur = Math.max(shadowBlur, interactive.shadowBlur);
      shadowOpacity = Math.max(shadowOpacity, interactive.shadowOpacity);
    }
    
    const shadowColor = `rgba(0, 0, 0, ${shadowOpacity})`;
    
    return `
      brightness(${brightnessValue.toFixed(2)})
      contrast(${contrastValue.toFixed(2)})
      saturate(${saturationValue.toFixed(2)})
      hue-rotate(${hueRotation}deg)
      drop-shadow(${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowColor})
    `;
  };
  
  // Apply material properties to impact the visual effects
  const applyMaterialProperties = (styles: React.CSSProperties): React.CSSProperties => {
    if (!materialSettings) return styles;
    
    const { roughness, metalness, clearcoat, reflectivity } = materialSettings;
    
    // Roughness affects blur and texture clarity
    const blurAmount = roughness * 0.5; // px
    
    // Interactive lighting affects material response only when enabled
    const interactive = getInteractiveLightingEffects();
    let materialMultiplier = 1;
    
    if (interactiveLighting && interactive.lightIntensity) {
      // Metallic surfaces respond more dramatically to lighting changes
      materialMultiplier = 1 + (metalness * interactive.lightIntensity * 0.5);
    }
    
    // Create adjusted styles
    const adjustedStyles: React.CSSProperties = {
      ...styles,
      filter: `blur(${blurAmount}px)`,
      opacity: (styles.opacity as number || 1) * materialMultiplier
    };
    
    return adjustedStyles;
  };
  
  const getEnvironmentStyle = (): React.CSSProperties => {
    if (!selectedScene) return {};
    
    const baseStyle = {
      backgroundImage: selectedScene.backgroundImage,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    };
    
    // Add interactive lighting to environment only when enabled
    if (interactiveLighting) {
      const interactive = getInteractiveLightingEffects();
      return {
        ...baseStyle,
        filter: `brightness(${0.8 + interactive.lightIntensity * 0.4})`
      };
    }
    
    return baseStyle;
  };
  
  // Enhanced reflective highlights based on material settings and effective mouse position
  const getReflectionStyles = (): React.CSSProperties => {
    if (!materialSettings || !isHovering) return {};
    
    const { reflectivity, clearcoat, metalness } = materialSettings;
    const interactive = getInteractiveLightingEffects();
    
    // Calculate reflection position based on effective mouse position (static when interactive lighting off)
    const reflectionX = (effectiveMousePosition.x - 0.5) * -100; // Inverted for realistic effect
    const reflectionY = (effectiveMousePosition.y - 0.5) * -100;
    
    // Interactive lighting dramatically affects reflections only when enabled
    let highlightOpacity = reflectivity * 0.7;
    let highlightSize = 40 + reflectivity * 30;
    let clearcoatOpacity = clearcoat * 0.4;
    let clearcoatSize = 15 + clearcoat * 10;
    
    if (interactiveLighting && interactive.lightIntensity) {
      // Dramatic increase in reflection intensity with interactive lighting
      const lightingBoost = interactive.lightIntensity * 2;
      highlightOpacity *= (1 + lightingBoost);
      clearcoatOpacity *= (1 + lightingBoost);
      
      // Metallic surfaces get extra dramatic highlights
      if (metalness > 0.5) {
        highlightOpacity *= (1 + metalness);
        highlightSize += metalness * 20;
      }
    }
    
    return {
      background: `
        radial-gradient(
          circle at ${50 + reflectionX / 3}% ${50 + reflectionY / 3}%,
          rgba(255, 255, 255, ${Math.min(highlightOpacity, 0.9)}) 0%,
          transparent ${highlightSize}%
        ),
        radial-gradient(
          circle at ${50 + reflectionX / 1.5}% ${50 + reflectionY / 1.5}%,
          rgba(255, 255, 255, ${Math.min(clearcoatOpacity, 0.6)}) 0%,
          transparent ${clearcoatSize}%
        )
      `,
      mixBlendMode: 'soft-light',
    };
  };
  
  const getFrameStyles = (): React.CSSProperties => {
    const baseTemplate = card.template_id || 'classic';
    
    const templates: Record<string, React.CSSProperties> = {
      classic: {
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        border: '1px solid #dee2e6',
      },
      neon: {
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        border: '1px solid #00d4ff',
        boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)',
      },
      vintage: {
        background: 'linear-gradient(135deg, #8b7355 0%, #6d5d42 100%)',
        border: '2px solid #5a4a35',
      },
      holographic: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: '1px solid #9f7aea',
      }
    };

    const baseStyles = { ...templates[baseTemplate] };
    
    // Apply lighting filter effects
    const lightingFilter = getLightingFilterStyle();
    if (lightingFilter) {
      baseStyles.filter = lightingFilter;
    }
    
    return baseStyles;
  };

  const getEnhancedEffectStyles = (): React.CSSProperties => {
    if (!showEffects) return {};

    const combinedStyles: React.CSSProperties = {};
    const backgroundLayers: string[] = [];
    const filters: string[] = [];
    let boxShadow = '';
    
    // Get interactive lighting effects
    const interactive = getInteractiveLightingEffects();

    // Get active effects with their intensities
    ENHANCED_VISUAL_EFFECTS.forEach(effect => {
      const values = effectValues[effect.id];
      if (!values || !values.intensity || (values.intensity as number) === 0) return;

      // Base intensity
      let intensity = ((values.intensity as number) / 100) * 1.5;
      
      // Interactive lighting boosts effect intensity only when enabled
      if (interactiveLighting && interactive.lightIntensity) {
        intensity *= (1 + interactive.lightIntensity * 0.8);
      }
      
      // Use effective mouse position (static when interactive lighting is off)
      const mouseX = effectiveMousePosition.x;
      const mouseY = effectiveMousePosition.y;

      switch (effect.id) {
        case 'holographic':
          const shiftSpeed = values.shiftSpeed as number || 100;
          const rainbowSpread = values.rainbowSpread as number || 180;
          const prismaticDepth = (values.prismaticDepth as number || 50) / 100;
          const animated = values.animated as boolean;
          
          let hueShift = 0;
          if (animated && interactiveLighting) {
            // Only animate hue when interactive lighting is enabled
            hueShift = mouseX * 360 * (shiftSpeed / 100) * interactive.lightIntensity;
          } else if (animated) {
            // Static subtle hue shift when interactive lighting is off
            hueShift = 30; // Fixed subtle shift
          }
          
          if (hueShift !== 0) {
            filters.push(`hue-rotate(${hueShift}deg)`);
          }
          
          backgroundLayers.push(`
            conic-gradient(from ${interactiveLighting ? mouseX * rainbowSpread : rainbowSpread / 2}deg,
              rgba(255,0,100,${intensity * 0.7 * prismaticDepth}),
              rgba(0,255,200,${intensity * 0.65 * prismaticDepth}),
              rgba(255,200,0,${intensity * 0.7 * prismaticDepth}),
              rgba(100,0,255,${intensity * 0.65 * prismaticDepth}),
              rgba(255,0,100,${intensity * 0.7 * prismaticDepth}))
          `);
          break;

        case 'foilspray':
          const density = (values.density as number || 50) / 100;
          const direction = values.direction as number || 45;
          const pattern = values.pattern as string || 'radial';
          
          // Interactive lighting makes foil more responsive only when enabled
          const foilIntensity = interactiveLighting ? intensity * (1 + interactive.lightIntensity) : intensity;
          
          if (pattern === 'radial') {
            backgroundLayers.push(`
              radial-gradient(circle at ${mouseX * 100}% ${mouseY * 100}%,
                rgba(255, 255, 255, ${foilIntensity * 0.8 * density}) 0%,
                rgba(230, 230, 255, ${foilIntensity * 0.65 * density}) 40%,
                transparent 70%)
            `);
          } else if (pattern === 'linear') {
            backgroundLayers.push(`
              linear-gradient(${direction}deg,
                rgba(255, 255, 255, ${foilIntensity * 0.8 * density}) 0%,
                rgba(230, 230, 255, ${foilIntensity * 0.65 * density}) 50%,
                rgba(255, 255, 255, ${foilIntensity * 0.75 * density}) 100%)
            `);
          }
          break;

        case 'chrome':
          const sharpness = (values.sharpness as number || 70) / 100;
          const highlightSize = values.highlightSize as number || 40;
          
          // Chrome effect enhanced by interactive lighting only when enabled
          const chromeIntensity = interactiveLighting ? intensity * (1 + interactive.lightIntensity * 0.5) : intensity;
          
          backgroundLayers.push(`
            linear-gradient(${(mouseX - 0.5) * (interactiveLighting ? 120 : 0) + 90}deg,
              rgba(240, 240, 240, ${chromeIntensity * 0.9 * sharpness}) 0%,
              rgba(255, 255, 255, ${chromeIntensity * 1.0 * sharpness}) ${50 - highlightSize/2}%,
              rgba(255, 255, 255, ${chromeIntensity * 1.0 * sharpness}) ${50 + highlightSize/2}%,
              rgba(180, 180, 180, ${chromeIntensity * 0.8 * sharpness}) 100%)
          `);
          
          // Add interactive highlight for metallic surfaces only when interactive lighting is enabled
          if (materialSettings && materialSettings.metalness > 0.3 && interactiveLighting) {
            backgroundLayers.push(`
              radial-gradient(circle at ${mouseX * 100}% ${mouseY * 100}%,
                rgba(255, 255, 255, ${chromeIntensity * 0.8 * materialSettings.metalness * interactive.lightIntensity}) 0%,
                transparent 60%)
            `);
          }
          break;

        case 'prizm':
          const complexity = values.complexity as number || 5;
          const colorSeparation = (values.colorSeparation as number || 60) / 100;
          const rotation = values.rotation as number || 0;
          
          backgroundLayers.push(`
            conic-gradient(from ${rotation + (interactiveLighting ? mouseX * 360 : 180)}deg at 50% 50%,
              rgba(255, 0, 0, ${intensity * 0.6 * colorSeparation}),
              rgba(255, 165, 0, ${intensity * 0.6 * colorSeparation}),
              rgba(255, 255, 0, ${intensity * 0.6 * colorSeparation}),
              rgba(0, 255, 0, ${intensity * 0.6 * colorSeparation}),
              rgba(0, 255, 255, ${intensity * 0.6 * colorSeparation}),
              rgba(0, 0, 255, ${intensity * 0.6 * colorSeparation}),
              rgba(138, 43, 226, ${intensity * 0.6 * colorSeparation}),
              rgba(255, 0, 0, ${intensity * 0.6 * colorSeparation}))
          `);
          break;

        case 'interference':
          const frequency = values.frequency as number || 8;
          const thickness = values.thickness as number || 3;
          
          backgroundLayers.push(`
            repeating-radial-gradient(circle at ${mouseX * 100}% ${mouseY * 100}%,
              transparent 0px,
              rgba(255, 255, 255, ${intensity * 0.06}) ${thickness}px,
              rgba(200, 200, 255, ${intensity * 0.08}) ${thickness * 2}px,
              transparent ${frequency}px)
          `);
          break;

        case 'brushedmetal':
          const brushDirection = values.direction as number || 45;
          const grainDensity = values.grainDensity as number || 8;
          const roughness = (values.roughness as number || 25) / 100;
          
          backgroundLayers.push(`
            repeating-linear-gradient(${brushDirection}deg,
              rgba(220, 220, 220, ${intensity * 0.4 * (1 - roughness)}) 0px,
              rgba(255, 255, 255, ${intensity * 0.6 * (1 - roughness)}) 1px,
              rgba(180, 180, 180, ${intensity * 0.3 * (1 - roughness)}) ${grainDensity/2}px,
              rgba(240, 240, 240, ${intensity * 0.4 * (1 - roughness)}) ${grainDensity}px)
          `);
          break;

        case 'crystal':
          const facets = values.facets as number || 8;
          const dispersion = (values.dispersion as number || 60) / 100;
          const clarity = (values.clarity as number || 75) / 100;
          
          const facetAngle = 360 / facets;
          backgroundLayers.push(`
            conic-gradient(from ${interactiveLighting ? mouseX * 360 : 180}deg at ${mouseX * 100}% ${mouseY * 100}%,
              rgba(255, 255, 255, ${intensity * 0.35 * clarity}) 0deg,
              rgba(200, 200, 255, ${intensity * 0.25 * dispersion}) ${facetAngle/2}deg,
              rgba(255, 255, 255, ${intensity * 0.4 * clarity}) ${facetAngle}deg,
              rgba(255, 200, 255, ${intensity * 0.25 * dispersion}) ${facetAngle * 1.5}deg,
              rgba(255, 255, 255, ${intensity * 0.35 * clarity}) ${facetAngle * 2}deg)
          `);
          break;

        case 'vintage':
          const aging = (values.aging as number || 40) / 100;
          const patina = values.patina as string || '#8b7355';
          const wear = (values.wear as number || 30) / 100;
          
          // Convert hex to rgba
          const hex = patina.replace('#', '');
          const r = parseInt(hex.substr(0, 2), 16);
          const g = parseInt(hex.substr(2, 2), 16);
          const b = parseInt(hex.substr(4, 2), 16);
          
          backgroundLayers.push(`
            radial-gradient(circle at ${mouseX * 100}% ${mouseY * 100}%,
              rgba(${r}, ${g}, ${b}, ${intensity * 0.2 * aging}) 0%,
              rgba(${r + 20}, ${g + 15}, ${b + 13}, ${intensity * 0.15 * aging}) 50%,
              transparent 100%)
          `);
          
          if (wear > 0.3) {
            filters.push(`sepia(${wear * 100}%)`);
          }
          break;
      }
    });

    if (backgroundLayers.length > 0) {
      combinedStyles.background = backgroundLayers.join(', ');
    }

    if (filters.length > 0) {
      combinedStyles.filter = filters.join(' ');
    }

    if (boxShadow) {
      combinedStyles.boxShadow = boxShadow;
    }

    // Apply proper blend mode based on material settings and interactive lighting
    if (materialSettings) {
      if (interactiveLighting && interactive.lightIntensity > 0.5) {
        // More dramatic blend mode when interactive lighting is active
        if (materialSettings.metalness > 0.7) {
          combinedStyles.mixBlendMode = 'hard-light';
        } else if (materialSettings.clearcoat > 0.7) {
          combinedStyles.mixBlendMode = 'overlay';
        } else {
          combinedStyles.mixBlendMode = 'soft-light';
        }
      } else {
        // Standard blend modes
        if (materialSettings.metalness > 0.7) {
          combinedStyles.mixBlendMode = 'overlay';
        } else if (materialSettings.clearcoat > 0.7) {
          combinedStyles.mixBlendMode = 'soft-light';
        } else if (materialSettings.roughness < 0.3) {
          combinedStyles.mixBlendMode = 'hard-light';
        } else {
          combinedStyles.mixBlendMode = 'normal';
        }
      }
      
      // Apply material-specific adjustments
      return applyMaterialProperties(combinedStyles);
    }

    return combinedStyles;
  };

  const SurfaceTexture = useMemo(() => {
    if (!showEffects) return null;

    // Generate texture based on active effects and material properties
    const activeEffects = ENHANCED_VISUAL_EFFECTS.filter(effect => 
      effectValues[effect.id]?.intensity && (effectValues[effect.id].intensity as number) > 0
    );
    
    // If no active effects and no material settings, don't render texture
    if (activeEffects.length === 0 && (!materialSettings || materialSettings.roughness < 0.1)) {
      return null;
    }
    
    // Apply material-specific textures
    const roughnessValue = materialSettings ? materialSettings.roughness : 0.3;
    let grainOpacity = 0.03 + roughnessValue * 0.1; // 0.03-0.13
    const grainSize = 1 + Math.floor(roughnessValue * 2); // 1-3px
    
    // Interactive lighting affects texture visibility only when enabled
    const interactive = getInteractiveLightingEffects();
    if (interactiveLighting && interactive.lightIntensity) {
      grainOpacity *= (1 + interactive.lightIntensity * 0.5);
    }
    
    // Generate reflections based on material settings
    const reflectionStyles = getReflectionStyles();

    return (
      <>
        {/* Enhanced surface grain texture */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              repeating-linear-gradient(0deg,
                transparent 0px,
                rgba(255, 255, 255, ${grainOpacity}) 1px,
                transparent ${grainSize}px),
              repeating-linear-gradient(90deg,
                transparent 0px,
                rgba(0, 0, 0, ${grainOpacity * 0.7}) 1px,
                transparent ${grainSize}px)
            `,
            mixBlendMode: 'overlay',
            opacity: 0.5 + roughnessValue * 0.5,
            zIndex: 15
          }}
        />
        
        {/* Interactive lighting highlight - only when enabled */}
        {interactiveLighting && interactive.lightIntensity > 0.3 && (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                  rgba(255, 255, 255, ${interactive.lightIntensity * 0.3}) 0%,
                  rgba(255, 255, 255, ${interactive.lightIntensity * 0.1}) 40%,
                  transparent 70%)
              `,
              mixBlendMode: 'soft-light',
              zIndex: 20
            }}
          />
        )}
        
        {/* Material reflections layer */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            ...reflectionStyles,
            zIndex: 25
          }}
        />
      </>
    );
  }, [showEffects, effectValues, materialSettings, isHovering, effectiveMousePosition, interactiveLighting, mousePosition]);

  return {
    getFrameStyles,
    getEnhancedEffectStyles,
    getEnvironmentStyle,
    SurfaceTexture
  };
};
