
import React from 'react';
import { CARD_CONSTANTS } from '../constants/cardRenderer';

interface CardFrameProps {
  selectedFrame?: string;
  dimensions: { width: number; height: number; depth: number };
  effectLayerCount: number;
}

export const CardFrame: React.FC<CardFrameProps> = ({
  selectedFrame,
  dimensions,
  effectLayerCount
}) => {
  if (!selectedFrame) return null;

  const frameOffset = dimensions.depth / 2 + (effectLayerCount + 1) * CARD_CONSTANTS.EFFECT_LAYER_OFFSET;

  return (
    <mesh position={[0, 0, frameOffset]}>
      <planeGeometry args={[
        dimensions.width * CARD_CONSTANTS.FRAME_LAYER_OFFSET_MULTIPLIER, 
        dimensions.height * CARD_CONSTANTS.FRAME_LAYER_OFFSET_MULTIPLIER
      ]} />
      <meshStandardMaterial
        color="#ffd700"
        transparent
        opacity={0.8}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
};
