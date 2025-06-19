
import React, { useMemo } from 'react';
import type { CardData } from '@/types/card';
import { useCardDimensions } from '../hooks/useCardDimensions';
import { useCardRotation } from '../hooks/useCardRotation';
import { useEffectMaterials } from '../hooks/useEffectMaterials';
import { CardGeometry } from './CardGeometry';
import { EffectLayers } from './EffectLayers';
import { CardFrame } from './CardFrame';
import { CARD_BACK_TEXTURE_URL, FALLBACK_FRONT_TEXTURE_URL } from '../constants/cardRenderer';

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
}

export const Advanced3DCardRenderer: React.FC<Advanced3DCardRendererProps> = ({
  card,
  rotation,
  zoom,
  materialSettings,
  effectValues = {},
  selectedFrame,
  frameConfig
}) => {
  // Use custom hooks for optimized calculations
  const cardDimensions = useCardDimensions();
  const groupRef = useCardRotation(rotation);
  const effectMaterials = useEffectMaterials(effectValues);

  // Memoize image URLs
  const frontImageUrl = useMemo(() => {
    if (!card?.image_url || typeof card.image_url !== 'string') {
      return FALLBACK_FRONT_TEXTURE_URL;
    }
    return card.image_url;
  }, [card?.image_url]);

  return (
    <group ref={groupRef} scale={zoom} position={[0, 0, 0]}>
      <CardGeometry
        frontImageUrl={frontImageUrl}
        backImageUrl={CARD_BACK_TEXTURE_URL}
        dimensions={cardDimensions}
        materialSettings={materialSettings}
      />
      
      <EffectLayers
        effectMaterials={effectMaterials}
        dimensions={cardDimensions}
      />
      
      <CardFrame
        selectedFrame={selectedFrame}
        dimensions={cardDimensions}
        effectLayerCount={effectMaterials.length}
      />
    </group>
  );
};
