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
  
  // Enhanced Interactive Lighting System with Glare Reduction
  const getInteractiveLightingEffects = () => {
    if (!interactiveLighting) {
      // Return static lighting data when interactive lighting is off
      return {
        lightPosition: { x: 0, y: 0 },
        lightIntensity: 0.3, // Reduced static intensity
        colorTemperature: 5500, // Neutral color temperature
        isWarm: false,
        shadowOffset: { x: 0, y: 0 },
        shadowBlur: 20,
        shadowOpacity: 0.1, // Reduced static shadow
        proximityDamping: 1.0
      };
    }
    
    // Calculate light position relative to mouse (inverted for realistic lighting)
    const lightX = (0.5 - mousePosition.x) * 2; // -1 to 1
    const lightY = (0.5 - mousePosition.y) * 2; // -1 to 1
    const lightDistance = Math.sqrt(lightX * lightX + lightY * lightY);
    
    // Smart proximity damping - reduce intensity when too close to center
    const proximityThreshold = 0.3; // Distance from center where damping starts
    let proximityDamping = 1.0;
    
    if (lightDistance < proximityThreshold) {
      // Strong damping when very close to center to prevent glare
      proximityDamping = 0.2 + (lightDistance / proximityThreshold) * 0.6; // 0.2 to 0.8
    } else if (lightDistance < 0.6) {
      // Moderate damping in mid-range
      proximityDamping = 0.6 + ((lightDistance - proximityThreshold) / (0.6 - proximityThreshold)) * 0.3; // 0.6 to 0.9
    }
    
    // Calculate base light intensity with distance falloff and proximity damping
    const baseIntensity = Math.max(0.2, 1 - lightDistance * 0.4);
    const lightIntensity = Math.min(baseIntensity * proximityDamping, 0.7); // Cap at 70%
    
    // Dynamic color temperature based on position (reduced range)
    const colorTemp = 5000 + (mousePosition.x - 0.5) * 1000; // 4500K to 5500K (reduced range)
    const isWarm = colorTemp < 5000;
    
    // Create dynamic shadow opposite to light (reduced intensity)
    const shadowX = lightX * -20 * lightIntensity * 0.8; // Reduced shadow intensity
    const shadowY = lightY * -20 * lightIntensity * 0.8;
    const shadowBlur = 15 + lightDistance * 15; // Reduced blur range
    
    return {
      lightPosition: { x: lightX, y: lightY },
      lightIntensity,
      colorTemperature: colorTemp,
      isWarm,
      shadowOffset: { x: shadowX, y: shadowY },
      shadowBlur,
      shadowOpacity: Math.min(0.2 * lightIntensity, 0.15), // Capped shadow opacity
      proximityDamping
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
    
    // Apply interactive lighting modifications only when enabled (with reduced intensity)
    if (interactiveLighting && interactive.lightIntensity) {
      // More conservative brightness adjustment
      brightnessValue *= (0.9 + interactive.lightIntensity * 0.2); // Reduced from 0.4
      
      // More conservative contrast for less dramatic effect
      contrastValue *= (0.95 + interactive.lightIntensity * 0.15); // Reduced from 0.3
      
      // Subtle color temperature effects
      if (interactive.isWarm) {
        saturationValue = 1.05; // Reduced from 1.1
        hueRotation = -3; // Reduced from -5
      } else {
        saturationValue = 0.98; // Reduced from 0.95
        hueRotation = 3; // Reduced from 5
      }
    }
    
    // Create dynamic shadow based on rotation and interactive lighting
    let shadowX = Math.sin(rotation.y * 0.017) * 10; // Reduced from 15
    let shadowY = Math.sin(rotation.x * 0.017) * 10; // Reduced from 15
    let shadowBlur = selectedLighting.shadowSoftness;
    let shadowOpacity = selectedLighting.shadows / 400; // Reduced from 300
    
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
  
  // Enhanced reflective highlights with glare reduction
  const getReflectionStyles = (): React.CSSProperties => {
    if (!materialSettings || !isHovering) return {};
    
    const { reflectivity, clearcoat, metalness } = materialSettings;
    const interactive = getInteractiveLightingEffects();
    
    // Calculate reflection position based on effective mouse position (static when interactive lighting off)
    const reflectionX = (effectiveMousePosition.x - 0.5) * -100; // Inverted for realistic effect
    const reflectionY = (effectiveMousePosition.y - 0.5) * -100;
    
    // Base reflection values with reduced intensity
    let highlightOpacity = reflectivity * 0.5; // Reduced from 0.7
    let highlightSize = 50 + reflectivity * 20; // Increased size, reduced intensity
    let clearcoatOpacity = clearcoat * 0.25; // Reduced from 0.4
    let clearcoatSize = 20 + clearcoat * 15; // Increased size
    
    if (interactiveLighting && interactive.lightIntensity && interactive.proximityDamping) {
      // Conservative increase with proximity damping
      const lightingBoost = interactive.lightIntensity * interactive.proximityDamping * 1.2; // Reduced from 2
      highlightOpacity *= (1 + lightingBoost);
      clearcoatOpacity *= (1 + lightingBoost);
      
      // Metallic surfaces get extra highlights but capped
      if (metalness > 0.5) {
        highlightOpacity *= (1 + metalness * 0.4); // Reduced from 1
        highlightSize += metalness * 10; // Reduced from 20
      }
    }
    
    // Cap maximum opacity to prevent glare
    highlightOpacity = Math.min(highlightOpacity, 0.6); // Reduced cap from 0.9
    clearcoatOpacity = Math.min(clearcoatOpacity, 0.4); // Reduced cap from 0.6
    
    return {
      background: `
        radial-gradient(
          circle at ${50 + reflectionX / 4}% ${50 + reflectionY / 4}%,
          rgba(255, 255, 255, ${highlightOpacity}) 0%,
          rgba(255, 255, 255, ${highlightOpacity * 0.6}) 30%,
          transparent ${highlightSize}%
        ),
        radial-gradient(
          circle at ${50 + reflectionX / 2}% ${50 + reflectionY / 2}%,
          rgba(255, 255, 255, ${clearcoatOpacity}) 0%,
          rgba(255, 255, 255, ${clearcoatOpacity * 0.4}) 20%,
          transparent ${clearcoatSize}%
        )
      `,
      mixBlendMode: 'soft-light', // Changed from hard-light to reduce intensity
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

      // Base intensity with proximity damping
      let intensity = ((values.intensity as number) / 100) * 1.2; // Reduced from 1.5
      
      // Interactive lighting boosts effect intensity only when enabled (with damping)
      if (interactiveLighting && interactive.lightIntensity && interactive.proximityDamping) {
        intensity *= (1 + interactive.lightIntensity * interactive.proximityDamping * 0.5); // Reduced from 0.8
      }
      
      // Cap maximum intensity to prevent overwhelming effects
      intensity = Math.min(intensity, 1.8); // Added cap
      
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
            // Reduced hue animation intensity
            hueShift = mouseX * 180 * (shiftSpeed / 100) * interactive.lightIntensity * interactive.proximityDamping; // Reduced from 360
          } else if (animated) {
            hueShift = 20; // Reduced from 30
          }
          
          if (hueShift !== 0) {
            filters.push(`hue-rotate(${hueShift}deg)`);
          }
          
          // Reduced holographic intensity
          const holoIntensity = intensity * 0.6; // Reduced multiplier
          backgroundLayers.push(`
            conic-gradient(from ${interactiveLighting ? mouseX * rainbowSpread : rainbowSpread / 2}deg,
              rgba(255,0,100,${holoIntensity * 0.5 * prismaticDepth}),
              rgba(0,255,200,${holoIntensity * 0.45 * prismaticDepth}),
              rgba(255,200,0,${holoIntensity * 0.5 * prismaticDepth}),
              rgba(100,0,255,${holoIntensity * 0.45 * prismaticDepth}),
              rgba(255,0,100,${holoIntensity * 0.5 * prismaticDepth}))
          `);
          break;

        case 'foilspray':
          const density = (values.density as number || 50) / 100;
          const direction = values.direction as number || 45;
          const pattern = values.pattern as string || 'radial';
          
          // Reduced foil intensity with proximity damping
          const foilIntensity = interactiveLighting ? 
            intensity * (1 + interactive.lightIntensity * interactive.proximityDamping * 0.6) : // Reduced from 1
            intensity;
          
          if (pattern === 'radial') {
            backgroundLayers.push(`
              radial-gradient(circle at ${mouseX * 100}% ${mouseY * 100}%,
                rgba(255, 255, 255, ${Math.min(foilIntensity * 0.5 * density, 0.4)}) 0%,
                rgba(230, 230, 255, ${Math.min(foilIntensity * 0.4 * density, 0.3)}) 40%,
                transparent 70%)
            `);
          } else if (pattern === 'linear') {
            backgroundLayers.push(`
              linear-gradient(${direction}deg,
                rgba(255, 255, 255, ${Math.min(foilIntensity * 0.5 * density, 0.4)}) 0%,
                rgba(230, 230, 255, ${Math.min(foilIntensity * 0.4 * density, 0.3)}) 50%,
                rgba(255, 255, 255, ${Math.min(foilIntensity * 0.5 * density, 0.4)}) 100%)
            `);
          }
          break;

        case 'chrome':
          const sharpness = (values.sharpness as number || 70) / 100;
          const highlightSize = values.highlightSize as number || 40;
          
          // Chrome effect with proximity damping
          const chromeIntensity = interactiveLighting ? 
            intensity * (1 + interactive.lightIntensity * interactive.proximityDamping * 0.3) : // Reduced from 0.5
            intensity;
          
          backgroundLayers.push(`
            linear-gradient(${(mouseX - 0.5) * (interactiveLighting ? 60 : 0) + 90}deg,
              rgba(240, 240, 240, ${Math.min(chromeIntensity * 0.6 * sharpness, 0.5)}) 0%,
              rgba(255, 255, 255, ${Math.min(chromeIntensity * 0.7 * sharpness, 0.6)}) ${50 - highlightSize/2}%,
              rgba(255, 255, 255, ${Math.min(chromeIntensity * 0.7 * sharpness, 0.6)}) ${50 + highlightSize/2}%,
              rgba(180, 180, 180, ${Math.min(chromeIntensity * 0.5 * sharpness, 0.4)}) 100%)
          `);
          
          // Reduced interactive highlight intensity
          if (materialSettings && materialSettings.metalness > 0.3 && interactiveLighting) {
            backgroundLayers.push(`
              radial-gradient(circle at ${mouseX * 100}% ${mouseY * 100}%,
                rgba(255, 255, 255, ${Math.min(chromeIntensity * 0.4 * materialSettings.metalness * interactive.lightIntensity * interactive.proximityDamping, 0.3)}) 0%,
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

    // Apply more conservative blend modes
    if (materialSettings) {
      if (interactiveLighting && interactive.lightIntensity > 0.5) {
        // Less aggressive blend modes when interactive lighting is active
        if (materialSettings.metalness > 0.7) {
          combinedStyles.mixBlendMode = 'overlay'; // Reduced from hard-light
        } else if (materialSettings.clearcoat > 0.7) {
          combinedStyles.mixBlendMode = 'soft-light';
        } else {
          combinedStyles.mixBlendMode = 'soft-light';
        }
      } else {
        // Standard blend modes
        if (materialSettings.metalness > 0.7) {
          combinedStyles.mixBlendMode = 'soft-light'; // Reduced from overlay
        } else if (materialSettings.clearcoat > 0.7) {
          combinedStyles.mixBlendMode = 'soft-light';
        } else if (materialSettings.roughness < 0.3) {
          combinedStyles.mixBlendMode = 'overlay'; // Reduced from hard-light
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
    let grainOpacity = 0.02 + roughnessValue * 0.08; // Reduced base opacity
    const grainSize = 1 + Math.floor(roughnessValue * 2);
    
    // Reduced interactive lighting texture response
    const interactive = getInteractiveLightingEffects();
    if (interactiveLighting && interactive.lightIntensity && interactive.proximityDamping) {
      grainOpacity *= (1 + interactive.lightIntensity * interactive.proximityDamping * 0.3); // Reduced from 0.5
    }
    
    // Generate reflections based on material settings
    const reflectionStyles = getReflectionStyles();

    return (
      <>
        {/* Enhanced surface grain texture with reduced opacity */}
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
                rgba(0, 0, 0, ${grainOpacity * 0.6}) 1px,
                transparent ${grainSize}px)
            `,
            mixBlendMode: 'overlay',
            opacity: 0.4 + roughnessValue * 0.3, // Reduced opacity
            zIndex: 15
          }}
        />
        
        {/* Reduced interactive lighting highlight */}
        {interactiveLighting && interactive.lightIntensity > 0.4 && interactive.proximityDamping > 0.3 && (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                  rgba(255, 255, 255, ${Math.min(interactive.lightIntensity * interactive.proximityDamping * 0.15, 0.2)}) 0%,
                  rgba(255, 255, 255, ${Math.min(interactive.lightIntensity * interactive.proximityDamping * 0.05, 0.1)}) 40%,
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
