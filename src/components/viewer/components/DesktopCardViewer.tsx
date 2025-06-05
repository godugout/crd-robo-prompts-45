
import React from 'react';
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ViewerControls } from './ViewerControls';
import { ProgressiveCustomizePanel } from './ProgressiveCustomizePanel';
import { EnhancedCardContainer } from './EnhancedCardContainer';
import { ConfigurationDetailsPanel } from './ConfigurationDetailsPanel';
import { ExportOptionsDialog } from './ExportOptionsDialog';
import type { CardData } from '@/hooks/useCardEditor';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';

interface DesktopCardViewerProps {
  // Card and navigation
  card: CardData;
  hasMultipleCards: boolean;
  canGoPrev: boolean;
  canGoNext: boolean;
  currentCardIndex: number;
  totalCards: number;
  onPreviousCard: () => void;
  onNextCard: () => void;

  // State
  showCustomizePanel: boolean;
  setShowCustomizePanel: (show: boolean) => void;
  showStats: boolean;
  isFlipped: boolean;
  setIsFlipped: (flipped: boolean) => void;
  isHovering: boolean;
  setIsHovering: (hovering: boolean) => void;
  isHoveringControls: boolean;
  showExportDialog: boolean;
  setShowExportDialog: (show: boolean) => void;

  // Gesture handlers
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  onDragStart: (e: React.MouseEvent) => void;
  onDrag: (e: React.MouseEvent) => void;
  onReset: () => void;
  onZoom: (delta: number) => void;

  // Effects and settings
  showEffects: boolean;
  setShowEffects: (show: boolean) => void;
  autoRotate: boolean;
  setAutoRotate: (rotate: boolean) => void;
  effectValues: EffectValues;
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  materialSettings: MaterialSettings;
  overallBrightness: number[];
  interactiveLighting: boolean;
  selectedPresetId?: string;
  isApplyingPreset?: boolean;
  
  // Handlers
  onEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void;
  onResetAllEffects: () => void;
  onSceneChange: (scene: EnvironmentScene) => void;
  onLightingChange: (lighting: LightingPreset) => void;
  onBrightnessChange: (value: number[]) => void;
  onInteractiveLightingToggle: () => void;
  onMaterialSettingsChange: (settings: MaterialSettings) => void;
  onToggleFullscreen: () => void;
  onDownload: () => void;
  onShare?: () => void;
  onClose?: () => void;
  onPresetSelect: (presetId: string) => void;
  onApplyCombo: (combo: any) => void;

  // Styling
  containerRef: React.RefObject<HTMLDivElement>;
  cardContainerRef: React.RefObject<HTMLDivElement>;
  environmentStyle: React.CSSProperties;
  ambientOverlay: React.ReactNode;
  frameStyles: React.CSSProperties;
  enhancedEffectStyles: React.CSSProperties;
  SurfaceTexture: React.ReactNode;
  selectedMaterial?: { name: string };

  // Card properties
  mousePosition: { x: number; y: number };
  rotation: { x: number; y: number };
  zoom: number;
  isDragging: boolean;
  isFullscreen: boolean;
}

export const DesktopCardViewer: React.FC<DesktopCardViewerProps> = ({
  card, hasMultipleCards, canGoPrev, canGoNext, currentCardIndex, totalCards,
  onPreviousCard, onNextCard, showCustomizePanel, setShowCustomizePanel,
  showStats, isFlipped, setIsFlipped, isHovering, setIsHovering, isHoveringControls,
  showExportDialog, setShowExportDialog, onMouseMove, onMouseUp, onMouseLeave,
  onDragStart, onDrag, onReset, onZoom, showEffects, setShowEffects, autoRotate,
  setAutoRotate, effectValues, selectedScene, selectedLighting, materialSettings,
  overallBrightness, interactiveLighting, selectedPresetId, isApplyingPreset,
  onEffectChange, onResetAllEffects, onSceneChange, onLightingChange,
  onBrightnessChange, onInteractiveLightingToggle, onMaterialSettingsChange,
  onToggleFullscreen, onDownload, onShare, onClose, onPresetSelect, onApplyCombo,
  containerRef, cardContainerRef, environmentStyle, ambientOverlay, frameStyles,
  enhancedEffectStyles, SurfaceTexture, selectedMaterial, mousePosition,
  rotation, zoom, isDragging, isFullscreen
}) => {
  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        isFullscreen ? 'p-0' : 'p-8'
      } ${showCustomizePanel ? 'pr-80' : ''}`}
      style={environmentStyle}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      {/* Enhanced Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Ambient Background Effect */}
      {ambientOverlay}

      {/* Settings Panel Toggle Button */}
      {!showCustomizePanel && (
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCustomizePanel(true)}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur border border-white/20"
          >
            <Sparkles className="w-4 h-4 text-white mr-2" />
            <span className="text-white text-sm">Open Studio</span>
          </Button>
        </div>
      )}

      {/* Desktop Controls */}
      <div className={`transition-opacity duration-200 ${isHoveringControls ? 'opacity-100 z-20' : 'opacity-100 z-10'}`}>
        <ViewerControls
          showEffects={showEffects}
          autoRotate={autoRotate}
          onToggleEffects={() => setShowEffects(!showEffects)}
          onToggleAutoRotate={() => setAutoRotate(!autoRotate)}
          onReset={onReset}
          onZoomIn={() => onZoom(0.1)}
          onZoomOut={() => onZoom(-0.1)}
        />
      </div>

      {/* Card Navigation Controls */}
      {hasMultipleCards && (
        <div className="absolute bottom-4 right-4 z-10">
          <div className="flex items-center space-x-2 bg-black bg-opacity-80 backdrop-blur-lg rounded-lg p-3 border border-white/10">
            <Button
              variant="ghost"
              size="sm"
              onClick={onPreviousCard}
              disabled={!canGoPrev}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur border border-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="text-white text-sm px-3">
              {currentCardIndex + 1} / {totalCards}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onNextCard}
              disabled={!canGoNext}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur border border-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Desktop Customize Panel */}
      {showCustomizePanel && (
        <ProgressiveCustomizePanel
          selectedScene={selectedScene}
          selectedLighting={selectedLighting}
          effectValues={effectValues}
          overallBrightness={overallBrightness}
          interactiveLighting={interactiveLighting}
          materialSettings={materialSettings}
          isFullscreen={isFullscreen}
          onSceneChange={onSceneChange}
          onLightingChange={onLightingChange}
          onEffectChange={onEffectChange}
          onResetAllEffects={onResetAllEffects}
          onBrightnessChange={onBrightnessChange}
          onInteractiveLightingToggle={onInteractiveLightingToggle}
          onMaterialSettingsChange={onMaterialSettingsChange}
          onToggleFullscreen={onToggleFullscreen}
          onDownload={onDownload}
          onShare={onShare}
          onClose={() => {
            if (onClose) {
              onClose();
            } else {
              setShowCustomizePanel(false);
            }
          }}
          card={card}
          selectedPresetId={selectedPresetId}
          onPresetSelect={onPresetSelect}
          onApplyCombo={onApplyCombo}
          isApplyingPreset={isApplyingPreset}
        />
      )}

      {/* Enhanced Card Container */}
      <div ref={cardContainerRef}>
        <EnhancedCardContainer
          card={card}
          isFlipped={isFlipped}
          isHovering={isHovering}
          showEffects={showEffects}
          effectValues={effectValues}
          mousePosition={mousePosition}
          rotation={rotation}
          zoom={zoom}
          isDragging={isDragging}
          frameStyles={frameStyles}
          enhancedEffectStyles={enhancedEffectStyles}
          SurfaceTexture={SurfaceTexture}
          interactiveLighting={interactiveLighting}
          onMouseDown={onDragStart}
          onMouseMove={onDrag}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={() => setIsFlipped(!isFlipped)}
        />
      </div>

      {/* Configuration Details Panel */}
      {!showCustomizePanel && (
        <ConfigurationDetailsPanel
          effectValues={effectValues}
          selectedScene={selectedScene}
          selectedLighting={selectedLighting}
          materialSettings={materialSettings}
          overallBrightness={overallBrightness}
          interactiveLighting={interactiveLighting}
        />
      )}

      {/* Info Panel */}
      {showStats && !isFlipped && !showCustomizePanel && (
        <div className="absolute bottom-4 left-4 right-4 max-w-2xl mx-auto z-10" style={{ marginRight: hasMultipleCards ? '180px' : '100px' }}>
          <div className="bg-black bg-opacity-80 backdrop-blur-lg rounded-lg p-4 border border-white/10">
            <div className="flex items-center justify-between text-white">
              <div className="flex space-x-4 text-sm">
                <span>Click card to flip</span>
                <span>•</span>
                <span>Drag to rotate manually</span>
                <span>•</span>
                <span>Scroll to zoom</span>
                <span>•</span>
                <span>Move mouse for effects</span>
                {hasMultipleCards && (
                  <>
                    <span>•</span>
                    <span>Use ← → keys to navigate</span>
                  </>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">
                  Enhanced Studio | Material: {selectedMaterial?.name || 'Default'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Options Dialog */}
      <ExportOptionsDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        cardTitle={card.title}
        cardElementRef={cardContainerRef}
      />
    </div>
  );
};
