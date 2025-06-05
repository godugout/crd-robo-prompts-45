
import React, { useEffect, useRef } from 'react';
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
  const { POPULAR_COMBOS, activeComboId, setComboCached, isComboCached } = usePreRenderedMaterials(effectValues);
  const switchingRef = useRef(false);
  const lastActiveRef = useRef(activeComboId);

  // State management for combo switching
  useEffect(() => {
    if (lastActiveRef.current !== activeComboId) {
      console.log(`🎯 InstantPreview: Combo Switch ${lastActiveRef.current} → ${activeComboId}`);
      
      // Mark as switching to prevent race conditions
      switchingRef.current = true;
      
      // Force immediate DOM update
      setTimeout(() => {
        switchingRef.current = false;
        setComboCached(activeComboId);
        lastActiveRef.current = activeComboId;
      }, 50);
    }
  }, [activeComboId, setComboCached]);

  // Debug logging for visibility state
  console.log('🎯 InstantPreview State:', {
    activeComboId,
    isFlipped,
    switching: switchingRef.current,
    cached: isComboCached(activeComboId),
    totalCombos: POPULAR_COMBOS.length
  });

  return (
    <div
      className={`absolute inset-0 rounded-xl overflow-hidden transition-all duration-300 ${
        isFlipped ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(-180deg)',
        backfaceVisibility: 'hidden'
      }}
      data-debug-container="instant-preview-back"
      data-active-combo={activeComboId}
      data-switching={switchingRef.current}
    >
      {/* Debug overlay in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 left-2 z-50 bg-black/90 text-white text-xs p-2 rounded pointer-events-none border border-gray-600">
          <div className="space-y-1">
            <div className="text-green-400 font-bold">Active: {activeComboId}</div>
            <div>Flipped: {isFlipped ? 'YES' : 'NO'}</div>
            <div>Switching: {switchingRef.current ? 'YES' : 'NO'}</div>
            <div>Cached: {isComboCached(activeComboId) ? 'YES' : 'NO'}</div>
            <div>Total: {POPULAR_COMBOS.length}</div>
          </div>
        </div>
      )}

      {/* Pre-render all popular material combinations with enhanced state control */}
      {POPULAR_COMBOS.map((combo) => {
        const isActive = activeComboId === combo.id;
        const shouldRender = isActive || isComboCached(combo.id);
        
        // Enhanced logging for each combo
        if (process.env.NODE_ENV === 'development' && isActive) {
          console.log(`🎭 Rendering Active Combo ${combo.id}:`, {
            isActive,
            shouldRender,
            effectsCount: Object.keys(combo.effects).length,
            materialType: combo.material.id
          });
        }

        if (!shouldRender) return null;

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

      {/* Switching State Indicator */}
      {switchingRef.current && process.env.NODE_ENV === 'development' && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-yellow-500/80 text-black text-sm px-3 py-1 rounded pointer-events-none">
          Switching...
        </div>
      )}
    </div>
  );
};
