import React, { useMemo } from 'react';
import { PhotorealisticEffectSystem } from '../effects/PhotorealisticEffectSystem';
import { Advanced2DEffects } from '../effects/Advanced2DEffects';
import { PerformanceOptimizedEffects } from '../effects/PerformanceOptimizedEffects';
import { CARD_CONSTANTS } from '../constants/cardRenderer';
import * as THREE from 'three';

interface EffectLayer {
  id: string;
  type: 'holographic' | 'metallic' | 'prismatic' | 'galaxy' | 'crystal' | 'special';
  intensity: number;
  zOrder: number;
  blendMode: 'normal' | 'multiply' | 'screen' | 'overlay' | 'color-dodge' | 'additive';
  opacity: number;
  enabled: boolean;
}

interface MultiLayerEffectSystemProps {
  effectValues: Record<string, any>;
  dimensions: { width: number; height: number; depth: number };
  texture: THREE.Texture | null;
  quality: 'low' | 'medium' | 'high' | 'ultra';
  mousePosition: { x: number; y: number };
  deviceCapabilities: {
    supportsWebGL2: boolean;
    maxTextureSize: number;
    fragmentShaderPrecision: 'lowp' | 'mediump' | 'highp';
  };
}

export const MultiLayerEffectSystem: React.FC<MultiLayerEffectSystemProps> = ({
  effectValues,
  dimensions,
  texture,
  quality,
  mousePosition,
  deviceCapabilities
}) => {
  // Convert effect values to structured layers
  const effectLayers = useMemo((): EffectLayer[] => {
    const layers: EffectLayer[] = [];
    
    // Holographic effects
    if (effectValues?.holographic?.intensity > 0) {
      layers.push({
        id: 'holographic',
        type: 'holographic',
        intensity: effectValues.holographic.intensity / 100,
        zOrder: CARD_CONSTANTS.LAYER_ORDER.HOLOGRAPHIC,
        blendMode: 'color-dodge',
        opacity: Math.min(0.9, effectValues.holographic.intensity / 100 * 0.8),
        enabled: true
      });
    }
    
    // Metallic effects (Chrome, Gold, etc.)
    ['chrome', 'gold'].forEach(metalType => {
      if (effectValues?.[metalType]?.intensity > 0) {
        layers.push({
          id: metalType,
          type: 'metallic',
          intensity: effectValues[metalType].intensity / 100,
          zOrder: CARD_CONSTANTS.LAYER_ORDER.METALLIC,
          blendMode: metalType === 'gold' ? 'multiply' : 'screen',
          opacity: Math.min(0.8, effectValues[metalType].intensity / 100 * 0.7),
          enabled: true
        });
      }
    });
    
    // Prismatic effects
    ['prizm', 'foilspray'].forEach(prismType => {
      if (effectValues?.[prismType]?.intensity > 0) {
        layers.push({
          id: prismType,
          type: 'prismatic',
          intensity: effectValues[prismType].intensity / 100,
          zOrder: CARD_CONSTANTS.LAYER_ORDER.PRISMATIC,
          blendMode: 'additive',
          opacity: Math.min(0.7, effectValues[prismType].intensity / 100 * 0.6),
          enabled: true
        });
      }
    });
    
    // Crystal effects
    if (effectValues?.crystal?.intensity > 0) {
      layers.push({
        id: 'crystal',
        type: 'crystal',
        intensity: effectValues.crystal.intensity / 100,
        zOrder: CARD_CONSTANTS.LAYER_ORDER.SPECIAL,
        blendMode: 'overlay',
        opacity: Math.min(0.6, effectValues.crystal.intensity / 100 * 0.5),
        enabled: true
      });
    }
    
    return layers.sort((a, b) => a.zOrder - b.zOrder);
  }, [effectValues]);

  // Calculate effect interaction modifiers
  const interactionModifiers = useMemo(() => {
    const modifiers: Record<string, number> = {};
    
    // Holographic + Metallic = Enhanced rainbow reflection
    const holoIntensity = effectLayers.find(l => l.type === 'holographic')?.intensity || 0;
    const metallicIntensity = effectLayers.find(l => l.type === 'metallic')?.intensity || 0;
    
    if (holoIntensity > 0 && metallicIntensity > 0) {
      modifiers.rainbowEnhancement = Math.min(1.5, 1 + (holoIntensity * metallicIntensity));
    }
    
    // Prismatic + Crystal = Light dispersion boost
    const prismaticIntensity = effectLayers.find(l => l.type === 'prismatic')?.intensity || 0;
    const crystalIntensity = effectLayers.find(l => l.type === 'crystal')?.intensity || 0;
    
    if (prismaticIntensity > 0 && crystalIntensity > 0) {
      modifiers.dispersionBoost = Math.min(2.0, 1 + (prismaticIntensity * crystalIntensity * 0.8));
    }
    
    return modifiers;
  }, [effectLayers]);

  // Render layers based on quality and device capabilities
  const renderEffectLayers = () => {
    const layers = [];
    
    // Performance-optimized effects for low-end devices
    if (quality === 'low' || !deviceCapabilities.supportsWebGL2) {
      layers.push(
        <PerformanceOptimizedEffects
          key="performance-optimized"
          effectValues={effectValues}
          quality={quality}
          deviceCapabilities={deviceCapabilities}
        />
      );
    } else {
      // High-quality 3D shader effects
      if (quality === 'ultra' || quality === 'high') {
        layers.push(
          <PhotorealisticEffectSystem
            key="photorealistic-3d"
            texture={texture}
            effectValues={effectValues}
            quality={quality}
            mousePosition={mousePosition}
          />
        );
      }
      
      // Enhanced 2D effects as overlay
      layers.push(
        <Advanced2DEffects
          key="advanced-2d"
          effectValues={effectValues}
          mousePosition={mousePosition}
          quality={quality}
        />
      );
    }
    
    return layers;
  };

  // Calculate total layer offset for proper z-ordering
  const totalEffectDepth = effectLayers.length * CARD_CONSTANTS.EFFECT_LAYER_OFFSET;

  return (
    <group name="multi-layer-effect-system" position={[0, 0, totalEffectDepth / 2]}>
      {effectLayers.map((layer, index) => {
        const zOffset = index * CARD_CONSTANTS.EFFECT_LAYER_OFFSET;
        
        return (
          <group 
            key={layer.id}
            position={[0, 0, zOffset]}
            userData={{ 
              layer: layer.zOrder,
              blendMode: layer.blendMode,
              opacity: layer.opacity,
              effectType: layer.type
            }}
          >
            {/* Individual effect layer positioning */}
            <mesh>
              <planeGeometry args={[dimensions.width, dimensions.height]} />
              <meshBasicMaterial
                transparent
                opacity={layer.opacity}
                blending={getBlendingMode(layer.blendMode)}
              />
            </mesh>
          </group>
        );
      })}
      
      {/* Render actual effect systems */}
      {renderEffectLayers()}
      
      {/* Add interaction enhancement effects */}
      {interactionModifiers.rainbowEnhancement && (
        <pointLight
          position={[0, 0, 0.1]}
          intensity={interactionModifiers.rainbowEnhancement * 0.3}
          color="#ffffff"
          distance={1}
        />
      )}
      
      {interactionModifiers.dispersionBoost && quality !== 'low' && (
        <spotLight
          position={[0, 0, 0.2]}
          angle={Math.PI / 6}
          penumbra={0.5}
          intensity={interactionModifiers.dispersionBoost * 0.2}
          color="#e6e6fa"
          distance={2}
        />
      )}
    </group>
  );
};

// Helper function to convert blend mode to Three.js blending
function getBlendingMode(blendMode: string): THREE.Blending {
  switch (blendMode) {
    case 'additive':
      return THREE.AdditiveBlending;
    case 'multiply':
      return THREE.MultiplyBlending;
    case 'screen':
    case 'color-dodge':
      return THREE.AdditiveBlending;
    default:
      return THREE.NormalBlending;
  }
}