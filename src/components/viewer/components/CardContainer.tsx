
import React from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import { CardFront } from './CardFront';
import { CardBack } from './CardBack';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { MaterialSettings } from '../types';

interface CardContainerProps {
  card: CardData;
  isFlipped: boolean;
  isHovering: boolean;
  showEffects: boolean;
  effectIntensity: number[];
  mousePosition: { x: number; y: number };
  cardEffects: any;
  effectValues?: EffectValues;
  materialSettings?: MaterialSettings;
  interactiveLighting?: boolean;
}

export const CardContainer: React.FC<CardContainerProps> = ({
  card,
  isFlipped,
  isHovering,
  showEffects,
  effectIntensity,
  mousePosition,
  cardEffects,
  effectValues,
  materialSettings,
  interactiveLighting = false
}) => {
  return (
    <div className="relative w-full h-full">
      {/* Card Front */}
      <CardFront
        card={card}
        isFlipped={isFlipped}
        isHovering={isHovering}
        showEffects={showEffects}
        effectIntensity={effectIntensity}
        mousePosition={mousePosition}
        frameStyles={cardEffects.getFrameStyles()}
        physicalEffectStyles={cardEffects.getEnhancedEffectStyles()}
        SurfaceTexture={cardEffects.SurfaceTexture}
        effectValues={effectValues}
        materialSettings={materialSettings}
        interactiveLighting={interactiveLighting}
        materialEffects={cardEffects.getMaterialEffects()}
        MaterialSurfaceTexture={cardEffects.MaterialSurfaceTexture}
      />
      
      {/* Card Back */}
      <CardBack
        card={card}
        isFlipped={isFlipped}
        frameStyles={cardEffects.getFrameStyles()}
      />
    </div>
  );
};
