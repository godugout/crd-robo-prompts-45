
import React from 'react';
import { ViewerControls } from './ViewerControls';
import { ViewerNavigationControls } from './ViewerNavigationControls';
import { ConfigurationDetailsPanel } from './ConfigurationDetailsPanel';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';

interface ViewerBottomControlsProps {
  panelWidth: number;
  showEffects: boolean;
  autoRotate: boolean;
  hasMultipleCards: boolean;
  currentCardIndex: number;
  totalCards: number;
  canGoPrev: boolean;
  canGoNext: boolean;
  effectValues: EffectValues;
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  materialSettings: MaterialSettings;
  overallBrightness: number[];
  onToggleEffects: () => void;
  onToggleAutoRotate: () => void;
  onReset: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onPreviousCard: () => void;
  onNextCard: () => void;
}

export const ViewerBottomControls: React.FC<ViewerBottomControlsProps> = ({
  panelWidth,
  showEffects,
  autoRotate,
  hasMultipleCards,
  currentCardIndex,
  totalCards,
  canGoPrev,
  canGoNext,
  effectValues,
  selectedScene,
  selectedLighting,
  materialSettings,
  overallBrightness,
  onToggleEffects,
  onToggleAutoRotate,
  onReset,
  onZoomIn,
  onZoomOut,
  onPreviousCard,
  onNextCard
}) => {
  return (
    <div className="fixed bottom-4 left-4 right-4 z-10">
      <div 
        className="flex items-end justify-between max-w-7xl mx-auto"
        style={{ marginRight: `${panelWidth}px` }}
      >
        {/* Left Side - Basic Controls */}
        <div className="flex items-end space-x-4">
          <ViewerControls
            showEffects={showEffects}
            autoRotate={autoRotate}
            onToggleEffects={onToggleEffects}
            onToggleAutoRotate={onToggleAutoRotate}
            onReset={onReset}
            onZoomIn={onZoomIn}
            onZoomOut={onZoomOut}
          />
        </div>

        {/* Right Side - Always Visible Navigation and Config */}
        <div className="flex items-end space-x-3">
          <ViewerNavigationControls
            hasMultipleCards={hasMultipleCards}
            currentCardIndex={currentCardIndex}
            totalCards={totalCards}
            canGoPrev={canGoPrev}
            canGoNext={canGoNext}
            onPreviousCard={onPreviousCard}
            onNextCard={onNextCard}
          />

          {/* Configuration Details Panel - Always Visible */}
          <ConfigurationDetailsPanel
            effectValues={effectValues}
            selectedScene={selectedScene}
            selectedLighting={selectedLighting}
            materialSettings={materialSettings}
            overallBrightness={overallBrightness}
          />
        </div>
      </div>
    </div>
  );
};
