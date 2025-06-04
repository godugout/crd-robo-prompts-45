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
  
  // Apply lighting settings to create CSS filters
  const getLightingFilterStyle = () => {
    if (!selectedLighting) return '';
    
    // Base filters - apply from lighting preset with overall brightness adjustment
    const brightnessValue = (selectedLighting.brightness / 100) * (overallBrightness[0] / 100);
    const contrastValue = (selectedLighting.contrast / 100);
    
    // Create a dynamic shadow based on rotation
    const shadowX = Math.sin(rotation.y * 0.017) * 15; // Convert degrees to radians
    const shadowY = Math.sin(rotation.x * 0.017) * 15;
    const shadowBlur = selectedLighting.shadowSoftness;
    const shadowOpacity = selectedLighting.shadows / 300;
    const shadowColor = `rgba(0, 0, 0, ${shadowOpacity})`;
    
    return `
      brightness(${brightnessValue.toFixed(2)})
      contrast(${contrastValue.toFixed(2)})
      drop-shadow(${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowColor})
    `;
  };
  
  // Apply material properties to impact the visual effects
  const applyMaterialProperties = (styles: React.CSSProperties): React.CSSProperties => {
    if (!materialSettings) return styles;
    
    const { roughness, metalness, clearcoat, reflectivity } = materialSettings;
    
    // Roughness affects blur and texture clarity
    const blurAmount = roughness * 0.5; // px
    
    // Metalness affects reflective highlights
    const reflectionOpacity = metalness * reflectivity;
    
    // Clearcoat adds another reflective layer
    const clearcoatOpacity = clearcoat * 0.8;
    
    // Create adjusted styles
    const adjustedStyles: React.CSSProperties = {
      ...styles,
      filter: `blur(${blurAmount}px)`,
    };
    
    return adjustedStyles;
  };
  
  const getEnvironmentStyle = (): React.CSSProperties => {
    if (!selectedScene) return {};
    
    return {
      backgroundImage: selectedScene.backgroundImage,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    };
  };
  
  // Generate reflective highlights based on material settings and mouse position
  const getReflectionStyles = (): React.CSSProperties => {
    if (!materialSettings || !isHovering) return {};
    
    const { reflectivity, clearcoat } = materialSettings;
    
    // Calculate reflection position based on mouse
    const reflectionX = (mousePosition.x - 0.5) * -100; // Inverted for realistic effect
    const reflectionY = (mousePosition.y - 0.5) * -100;
    
    // More reflectivity means more intense highlight
    const highlightOpacity = reflectivity * 0.7;
    const highlightSize = 40 + reflectivity * 30; // 40-70% based on reflectivity
    
    // Clearcoat adds a second smaller, sharper highlight
    const clearcoatOpacity = clearcoat * 0.4;
    const clearcoatSize = 15 + clearcoat * 10; // 15-25% based on clearcoat
    
    return {
      background: `
        radial-gradient(
          circle at ${50 + reflectionX / 3}% ${50 + reflectionY / 3}%,
          rgba(255, 255, 255, ${highlightOpacity}) 0%,
          transparent ${highlightSize}%
        ),
        radial-gradient(
          circle at ${50 + reflectionX / 1.5}% ${50 + reflectionY / 1.5}%,
          rgba(255, 255, 255, ${clearcoatOpacity}) 0%,
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

    // Get active effects with their intensities increased for more dramatic visual impact
    ENHANCED_VISUAL_EFFECTS.forEach(effect => {
      const values = effectValues[effect.id];
      if (!values || !values.intensity || (values.intensity as number) === 0) return;

      // Increase intensity from max 0.6 to max 1.0 range for more dramatic effect
      const intensity = ((values.intensity as number) / 100) * 1.5;
      const mouseX = mousePosition.x;
      const mouseY = mousePosition.y;

      switch (effect.id) {
        case 'holographic':
          const shiftSpeed = values.shiftSpeed as number || 100;
          const rainbowSpread = values.rainbowSpread as number || 180;
          const prismaticDepth = (values.prismaticDepth as number || 50) / 100;
          const animated = values.animated as boolean;
          
          if (animated) {
            const hueShift = interactiveLighting ? mouseX * 360 : 0;
            filters.push(`hue-rotate(${hueShift * shiftSpeed / 100}deg)`);
          }
          
          backgroundLayers.push(`
            conic-gradient(from ${mouseX * rainbowSpread}deg,
              rgba(255,0,100,${intensity * 0.7 * prismaticDepth}),
              rgba(0,255,200,${intensity * 0.65 * prismaticDepth}),
              rgba(255,200,0,${intensity * 0.7 * prismaticDepth}),
              rgba(100,0,255,${intensity * 0.65 * prismaticDepth}),
              rgba(255,0,100,${intensity * 0.7 * prismaticDepth}))
          `);
          break;

        case 'foilspray':
          // Increase intensity and apply material properties for more metal shine
          const density = (values.density as number || 50) / 100;
          const direction = values.direction as number || 45;
          const pattern = values.pattern as string || 'radial';
          
          if (pattern === 'radial') {
            backgroundLayers.push(`
              radial-gradient(circle at ${mouseX * 100}% ${mouseY * 100}%,
                rgba(255, 255, 255, ${intensity * 0.8 * density}) 0%,
                rgba(230, 230, 255, ${intensity * 0.65 * density}) 40%,
                transparent 70%)
            `);
          } else if (pattern === 'linear') {
            backgroundLayers.push(`
              linear-gradient(${direction}deg,
                rgba(255, 255, 255, ${intensity * 0.8 * density}) 0%,
                rgba(230, 230, 255, ${intensity * 0.65 * density}) 50%,
                rgba(255, 255, 255, ${intensity * 0.75 * density}) 100%)
            `);
          }
          break;

        case 'prizm':
          // Enhance color separation and impact
          const complexity = values.complexity as number || 5;
          const colorSeparation = (values.colorSeparation as number || 60) / 100;
          const rotation = values.rotation as number || 0;
          
          backgroundLayers.push(`
            conic-gradient(from ${rotation + mouseX * 360}deg at 50% 50%,
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

        case 'chrome':
          // Increase chrome effect intensity and add metalness influence
          const sharpness = (values.sharpness as number || 70) / 100;
          const distortion = (values.distortion as number || 15) / 100;
          const highlightSize = values.highlightSize as number || 40;
          
          backgroundLayers.push(`
            linear-gradient(${(mouseX - 0.5) * 120 + 90}deg,
              rgba(240, 240, 240, ${intensity * 0.9 * sharpness}) 0%,
              rgba(255, 255, 255, ${intensity * 1.0 * sharpness}) ${50 - highlightSize/2}%,
              rgba(255, 255, 255, ${intensity * 1.0 * sharpness}) ${50 + highlightSize/2}%,
              rgba(180, 180, 180, ${intensity * 0.8 * sharpness}) 100%)
          `);
          
          // Add a reflective shine based on material
          if (materialSettings && materialSettings.metalness > 0.3) {
            backgroundLayers.push(`
              radial-gradient(circle at ${mouseX * 100}% ${mouseY * 100}%,
                rgba(255, 255, 255, ${intensity * 0.8 * materialSettings.metalness}) 0%,
                transparent 60%)
            `);
          }
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
            conic-gradient(from ${mouseX * 360}deg at ${mouseX * 100}% ${mouseY * 100}%,
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

    // Apply proper blend mode based on material settings
    if (materialSettings) {
      // Different blend modes based on material properties
      if (materialSettings.metalness > 0.7) {
        combinedStyles.mixBlendMode = 'overlay';
      } else if (materialSettings.clearcoat > 0.7) {
        combinedStyles.mixBlendMode = 'soft-light';
      } else if (materialSettings.roughness < 0.3) {
        combinedStyles.mixBlendMode = 'hard-light';
      } else {
        combinedStyles.mixBlendMode = 'normal';
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
    const grainOpacity = 0.03 + roughnessValue * 0.1; // 0.03-0.13
    const grainSize = 1 + Math.floor(roughnessValue * 2); // 1-3px
    
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
  }, [showEffects, effectValues, materialSettings, isHovering, mousePosition]);

  return {
    getFrameStyles,
    getEnhancedEffectStyles,
    getEnvironmentStyle,
    SurfaceTexture
  };
};
