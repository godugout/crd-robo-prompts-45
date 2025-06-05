
import React from 'react';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { usePreRenderedMaterials } from '../hooks/usePreRenderedMaterials';
import { PreRenderedCardBack } from './PreRenderedCardBack';

interface InstantPreviewCardBackProps {
  isFlipped: boolean;
  isHovering: boolean;
  showEffects: boolean;
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
  frameStyles: React.CSSProperties;
  enhancedEffectStyles: React.CSSProperties;
  SurfaceTexture: React.ReactNode;
  interactiveLighting?: boolean;
}

export const InstantPreviewCardBack: React.FC<InstantPreviewCardBackProps> = ({
  isFlipped,
  isHovering,
  showEffects,
  effectValues,
  mousePosition,
  frameStyles,
  enhancedEffectStyles,
  SurfaceTexture,
  interactiveLighting = false
}) => {
  const { POPULAR_COMBOS, activeComboId } = usePreRenderedMaterials(effectValues);

  console.log('🎯 InstantPreview: Active combo:', activeComboId);

  return (
    <div
      className={`absolute inset-0 rounded-xl overflow-hidden ${
        isFlipped ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(-180deg)',
        transition: 'transform 0.6s ease-in-out, opacity 0.3s ease',
        backfaceVisibility: 'hidden'
      }}
    >
      {/* Pre-render all popular material combinations */}
      {POPULAR_COMBOS.map((combo) => (
        <PreRenderedCardBack
          key={combo.id}
          comboId={combo.id}
          material={combo.material}
          effects={combo.effects}
          isActive={activeComboId === combo.id}
          isHovering={isHovering}
          mousePosition={mousePosition}
          frameStyles={frameStyles}
          enhancedEffectStyles={enhancedEffectStyles}
          SurfaceTexture={SurfaceTexture}
          interactiveLighting={interactiveLighting}
        />
      ))}
    </div>
  );
};
