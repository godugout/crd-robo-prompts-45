
import React, { useMemo, Suspense } from 'react';
import type { CardData } from '@/types/card';
import { Advanced3DCardRenderer } from './Advanced3DCardRenderer';
import { useEffectContext } from '../contexts/EffectContext';
import { detectWebGLCapabilities } from '../../3d/utils/webglDetection';

interface Enhanced3DCardMeshProps {
  card: CardData;
  rotation: { x: number; y: number };
  zoom: number;
  materialSettings?: {
    metalness: number;
    roughness: number;
    clearcoat: number;
    transmission: number;
    reflectivity: number;
  };
  selectedFrame?: string;
  frameConfig?: any;
  quality?: 'low' | 'medium' | 'high' | 'ultra';
  mousePosition?: { x: number; y: number };
}

// Simplified fallback component
const FallbackCard: React.FC<{ materialSettings: any }> = ({ materialSettings }) => {
  return (
    <group>
      <mesh position={[0, 0, 0.05]}>
        <planeGeometry args={[4, 5.6]} />
        <meshStandardMaterial 
          color="#1a1a1a"
          metalness={materialSettings.metalness}
          roughness={materialSettings.roughness}
        />
      </mesh>
    </group>
  );
};

export const Enhanced3DCardMesh: React.FC<Enhanced3DCardMeshProps> = ({
  card,
  rotation,
  zoom,
  materialSettings = {
    metalness: 0.5,
    roughness: 0.5,
    clearcoat: 0.0,
    transmission: 0.0,
    reflectivity: 50
  },
  selectedFrame,
  frameConfig,
  quality = 'high',
  mousePosition = { x: 0, y: 0 }
}) => {
  // Get effect values from context
  const effectContext = useEffectContext();
  const effectValues = effectContext?.effectValues || {};
  
  // Auto-detect quality based on device capabilities
  const deviceCapabilities = useMemo(() => {
    const caps = detectWebGLCapabilities();
    return {
      supportsWebGL2: caps.version >= 2,
      maxTextureSize: caps.maxTextureSize,
      fragmentShaderPrecision: caps.performanceScore > 70 ? 'highp' as const : 
                              caps.performanceScore > 40 ? 'mediump' as const : 'lowp' as const
    };
  }, []);
  
  const adaptiveQuality = useMemo(() => {
    if (!deviceCapabilities.supportsWebGL2) return 'low';
    if (deviceCapabilities.maxTextureSize < 2048) return 'medium';
    if (deviceCapabilities.fragmentShaderPrecision === 'lowp') return 'medium';
    return quality;
  }, [quality, deviceCapabilities]);

  // Validate and sanitize inputs once
  const safeInputs = useMemo(() => ({
    rotation: {
      x: typeof rotation?.x === 'number' && !isNaN(rotation.x) ? rotation.x : 0,
      y: typeof rotation?.y === 'number' && !isNaN(rotation.y) ? rotation.y : 0
    },
    zoom: Math.max(0.1, Math.min(5, typeof zoom === 'number' && !isNaN(zoom) && zoom > 0 ? zoom : 1)),
    card: card && typeof card === 'object' ? card : null
  }), [rotation, zoom, card]);

  // Enhanced material settings for metallic effects
  const enhancedMaterialSettings = useMemo(() => {
    const baseSettings = { ...materialSettings };
    
    // Enhance metallic effects with higher reflectivity
    if (effectValues.chrome?.intensity > 0 || effectValues.gold?.intensity > 0) {
      baseSettings.metalness = Math.min(1, baseSettings.metalness + 0.3);
      baseSettings.roughness = Math.max(0, baseSettings.roughness - 0.2);
      baseSettings.reflectivity = Math.min(100, baseSettings.reflectivity + 30);
    }
    
    return baseSettings;
  }, [materialSettings, effectValues]);

  if (!safeInputs.card) {
    return <FallbackCard materialSettings={materialSettings} />;
  }

  return (
    <Suspense fallback={<FallbackCard materialSettings={materialSettings} />}>
      <Advanced3DCardRenderer 
        card={safeInputs.card}
        rotation={safeInputs.rotation}
        zoom={safeInputs.zoom}
        materialSettings={enhancedMaterialSettings}
        effectValues={effectValues}
        selectedFrame={selectedFrame}
        frameConfig={frameConfig}
        quality={adaptiveQuality}
        mousePosition={mousePosition}
      />
    </Suspense>
  );
};
