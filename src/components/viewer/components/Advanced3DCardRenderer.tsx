
import React, { useMemo } from 'react';
import type { CardData } from '@/types/card';
import { useCardDimensions } from '../hooks/useCardDimensions';
import { useCardRotation } from '../hooks/useCardRotation';
import { useEffectMaterials } from '../hooks/useEffectMaterials';
import { CardGeometry } from './CardGeometry';
import { EffectLayers } from './EffectLayers';
import { EnhancedFrameSystem } from './EnhancedFrameSystem';
import { MultiLayerEffectSystem } from './MultiLayerEffectSystem';
import { CARD_BACK_TEXTURE_URL, FALLBACK_FRONT_TEXTURE_URL } from '../constants/cardRenderer';
import { detectWebGLCapabilities } from '../../3d/utils/webglDetection';
import * as THREE from 'three';

interface Advanced3DCardRendererProps {
  card: CardData;
  rotation: { x: number; y: number };
  zoom: number;
  materialSettings: {
    metalness: number;
    roughness: number;
    clearcoat: number;
    transmission: number;
    reflectivity: number;
  };
  effectValues?: Record<string, Record<string, any>>;
  selectedFrame?: string;
  frameConfig?: any;
  quality?: 'low' | 'medium' | 'high' | 'ultra';
  mousePosition?: { x: number; y: number };
}

export const Advanced3DCardRenderer: React.FC<Advanced3DCardRendererProps> = ({
  card,
  rotation,
  zoom,
  materialSettings,
  effectValues = {},
  selectedFrame,
  frameConfig,
  quality = 'high',
  mousePosition = { x: 0, y: 0 }
}) => {
  // Use custom hooks for optimized calculations
  const cardDimensions = useCardDimensions();
  const groupRef = useCardRotation(rotation);
  const effectMaterials = useEffectMaterials(effectValues);
  
  // Detect device capabilities for performance optimization
  const deviceCapabilities = useMemo(() => {
    const caps = detectWebGLCapabilities();
    return {
      supportsWebGL2: caps.version >= 2,
      maxTextureSize: caps.maxTextureSize,
      fragmentShaderPrecision: caps.performanceScore > 70 ? 'highp' as const : 
                              caps.performanceScore > 40 ? 'mediump' as const : 'lowp' as const
    };
  }, []);
  
  // Memoize image URLs
  const frontImageUrl = useMemo(() => {
    if (!card?.image_url || typeof card.image_url !== 'string') {
      return FALLBACK_FRONT_TEXTURE_URL;
    }
    return card.image_url;
  }, [card?.image_url]);
  
  // Create texture from card image
  const cardTexture = useMemo(() => {
    if (!frontImageUrl) return null;
    const loader = new THREE.TextureLoader();
    const texture = loader.load(frontImageUrl);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.generateMipmaps = quality === 'ultra';
    return texture;
  }, [frontImageUrl, quality]);

  return (
    <group ref={groupRef} scale={zoom} position={[0, 0, 0]}>
      <CardGeometry
        frontImageUrl={frontImageUrl}
        backImageUrl={CARD_BACK_TEXTURE_URL}
        dimensions={cardDimensions}
        materialSettings={materialSettings}
      />
      
      {/* Enhanced Multi-Layer Effect System */}
      <MultiLayerEffectSystem
        effectValues={effectValues}
        dimensions={cardDimensions}
        texture={cardTexture}
        quality={quality}
        mousePosition={mousePosition}
        deviceCapabilities={deviceCapabilities}
      />
      
      {/* Legacy Effect Layers for compatibility */}
      <EffectLayers
        effectMaterials={effectMaterials}
        dimensions={cardDimensions}
      />
      
      {/* Enhanced Frame System */}
      <EnhancedFrameSystem
        selectedFrame={selectedFrame}
        dimensions={cardDimensions}
        effectLayerCount={effectMaterials.length}
        quality={quality}
      />
    </group>
  );
};
