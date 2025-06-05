
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

  // Debug logging for visibility state
  console.log('🎯 InstantPreview Debug:', {
    activeComboId,
    isFlipped,
    effectValues,
    totalCombos: POPULAR_COMBOS.length,
    visibleComboData: POPULAR_COMBOS.find(c => c.id === activeComboId)
  });

  // Log which elements should be visible/hidden
  React.useEffect(() => {
    const visibleCount = POPULAR_COMBOS.filter(combo => activeComboId === combo.id).length;
    const hiddenCount = POPULAR_COMBOS.filter(combo => activeComboId !== combo.id).length;
    
    console.log('👁️ Visibility Check:', {
      activeComboId,
      visibleCount,
      hiddenCount,
      totalRendered: POPULAR_COMBOS.length
    });

    // Verify DOM state after render
    setTimeout(() => {
      const visibleElements = document.querySelectorAll('[data-combo][style*="opacity: 1"]');
      const hiddenElements = document.querySelectorAll('[data-combo][style*="opacity: 0"]');
      
      console.log('🔍 DOM Visibility State:', {
        visibleElements: Array.from(visibleElements).map(el => el.getAttribute('data-combo')),
        hiddenElements: Array.from(hiddenElements).map(el => el.getAttribute('data-combo')),
        expectedVisible: activeComboId
      });
    }, 100);
  }, [activeComboId, POPULAR_COMBOS]);

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
      data-debug-container="instant-preview-back"
      data-active-combo={activeComboId}
    >
      {/* Debug overlay in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 left-2 z-50 bg-black/80 text-white text-xs p-2 rounded pointer-events-none">
          <div>Active: {activeComboId}</div>
          <div>Flipped: {isFlipped ? 'YES' : 'NO'}</div>
          <div>Combos: {POPULAR_COMBOS.length}</div>
        </div>
      )}

      {/* Pre-render all popular material combinations */}
      {POPULAR_COMBOS.map((combo) => {
        const isActive = activeComboId === combo.id;
        
        // Log each combo's visibility decision
        if (process.env.NODE_ENV === 'development') {
          console.log(`🎭 Combo ${combo.id}:`, {
            isActive,
            willBeVisible: isActive,
            effectsMatch: JSON.stringify(combo.effects) === JSON.stringify(effectValues)
          });
        }

        return (
          <PreRenderedCardBack
            key={combo.id}
            comboId={combo.id}
            material={combo.material}
            effects={combo.effects}
            isActive={isActive}
            isHovering={isHovering}
            mousePosition={mousePosition}
            frameStyles={frameStyles}
            enhancedEffectStyles={enhancedEffectStyles}
            SurfaceTexture={SurfaceTexture}
            interactiveLighting={interactiveLighting}
          />
        );
      })}
    </div>
  );
};
