
import React, { useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import type { ImmersiveCardViewerProps, EnvironmentScene, LightingPreset, MaterialSettings } from './types';
import { ENVIRONMENT_SCENES, LIGHTING_PRESETS } from './constants';
import { 
  useEnhancedCardEffects
} from './hooks/useEnhancedCardEffects';
import { ViewerControls } from './components/ViewerControls';
import { EnhancedCardContainer } from './components/EnhancedCardContainer';
import { useCardExport } from './hooks/useCardExport';
import { ExportOptionsDialog } from './components/ExportOptionsDialog';
import { CompactBottomDrawer } from './components/CompactBottomDrawer';
import { CardNavigationControls } from './components/CardNavigationControls';
import { ViewerContainer } from './components/ViewerContainer';
import { useViewerState } from './hooks/useViewerState';
import { useViewerInteractions } from './hooks/useViewerInteractions';

// Update the interface to support card navigation
interface ExtendedImmersiveCardViewerProps extends ImmersiveCardViewerProps {
  cards?: any[];
  currentCardIndex?: number;
  onCardChange?: (index: number) => void;
}

export const ImmersiveCardViewer: React.FC<ExtendedImmersiveCardViewerProps> = ({
  card,
  cards = [],
  currentCardIndex = 0,
  onCardChange,
  isOpen = true,
  onClose,
  onShare,
  onDownload,
  allowRotation = true,
  showStats = true,
  ambient = true
}) => {
  // Use the new state management hook
  const {
    isFullscreen,
    rotation,
    isDragging,
    dragStart,
    zoom,
    isFlipped,
    autoRotate,
    showEffects,
    mousePosition,
    isHovering,
    showExportDialog,
    effectValues,
    containerRef,
    cardContainerRef,
    animationRef,
    setRotation,
    setIsDragging,
    setDragStart,
    setZoom,
    setIsFlipped,
    setAutoRotate,
    setShowEffects,
    setMousePosition,
    setIsHovering,
    setShowExportDialog,
    setEffectValues,
    handleEffectChange,
    handleResetAllEffects,
    handleReset,
    handleZoom,
    toggleFullscreen
  } = useViewerState();

  // Advanced settings state
  const [selectedScene, setSelectedScene] = React.useState<EnvironmentScene>(ENVIRONMENT_SCENES[3]); // Twilight
  const [selectedLighting, setSelectedLighting] = React.useState<LightingPreset>(LIGHTING_PRESETS[0]);
  const [overallBrightness, setOverallBrightness] = React.useState([120]);
  const [interactiveLighting, setInteractiveLighting] = React.useState(true);
  
  // Material properties
  const [materialSettings, setMaterialSettings] = React.useState<MaterialSettings>({
    roughness: 0.30,
    metalness: 0.60,
    clearcoat: 0.75,
    reflectivity: 0.50
  });

  // Use the new interactions hook
  const {
    handleMouseMove,
    handleDragStart,
    handleDrag,
    handleDragEnd
  } = useViewerInteractions({
    containerRef,
    rotation,
    isDragging,
    dragStart,
    allowRotation,
    autoRotate,
    animationRef,
    setRotation,
    setIsDragging,
    setDragStart,
    setZoom,
    setMousePosition,
    setAutoRotate
  });

  // Determine if we have multiple cards to navigate
  const hasMultipleCards = cards.length > 1;
  const canGoNext = hasMultipleCards && currentCardIndex < cards.length - 1;
  const canGoPrev = hasMultipleCards && currentCardIndex > 0;

  // Navigation handlers
  const handlePreviousCard = useCallback(() => {
    if (canGoPrev && onCardChange) {
      onCardChange(currentCardIndex - 1);
      setIsFlipped(false); // Reset flip state when changing cards
    }
  }, [canGoPrev, currentCardIndex, onCardChange, setIsFlipped]);

  const handleNextCard = useCallback(() => {
    if (canGoNext && onCardChange) {
      onCardChange(currentCardIndex + 1);
      setIsFlipped(false); // Reset flip state when changing cards
    }
  }, [canGoNext, currentCardIndex, onCardChange, setIsFlipped]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePreviousCard();
      } else if (e.key === 'ArrowRight') {
        handleNextCard();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handlePreviousCard, handleNextCard]);

  // Add export functionality
  const { exportCard, isExporting, exportProgress } = useCardExport({
    cardRef: cardContainerRef,
    card,
    onRotationChange: setRotation,
    onEffectChange: handleEffectChange,
    effectValues
  });

  const handleRotationChange = useCallback((newRotation: { x: number; y: number }) => {
    setRotation(newRotation);
  }, [setRotation]);

  // Update the existing download handler to open export dialog
  const handleDownloadClick = useCallback(() => {
    setShowExportDialog(true);
  }, [setShowExportDialog]);

  // Custom hooks
  const { getFrameStyles, getEnhancedEffectStyles, SurfaceTexture } = useEnhancedCardEffects({
    card,
    effectValues,
    mousePosition,
    showEffects,
    overallBrightness,
    interactiveLighting
  });

  if (!isOpen) return null;

  return (
    <>
      <ViewerContainer
        containerRef={containerRef}
        isFullscreen={isFullscreen}
        ambient={ambient}
        mousePosition={mousePosition}
        selectedScene={selectedScene}
        onMouseMove={handleMouseMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      >
        {/* Top Controls Section */}
        <div className="absolute top-4 left-4 right-4 z-10 flex items-start justify-between">
          {/* Basic Controls - Top Left */}
          <ViewerControls
            showEffects={showEffects}
            autoRotate={autoRotate}
            onToggleEffects={() => setShowEffects(!showEffects)}
            onToggleAutoRotate={() => setAutoRotate(!autoRotate)}
            onReset={handleReset}
            onZoomIn={() => handleZoom(0.1)}
            onZoomOut={() => handleZoom(-0.1)}
          />

          {/* Card Navigation Controls - Top Right */}
          <CardNavigationControls
            currentCardIndex={currentCardIndex}
            totalCards={cards.length}
            onPreviousCard={handlePreviousCard}
            onNextCard={handleNextCard}
            canGoPrev={canGoPrev}
            canGoNext={canGoNext}
          />
        </div>

        {/* Compact Bottom Drawer */}
        <CompactBottomDrawer
          selectedScene={selectedScene}
          selectedLighting={selectedLighting}
          effectValues={effectValues}
          overallBrightness={overallBrightness}
          interactiveLighting={interactiveLighting}
          materialSettings={materialSettings}
          isFullscreen={isFullscreen}
          onSceneChange={setSelectedScene}
          onLightingChange={setSelectedLighting}
          onEffectChange={handleEffectChange}
          onResetAllEffects={handleResetAllEffects}
          onBrightnessChange={setOverallBrightness}
          onInteractiveLightingToggle={() => setInteractiveLighting(!interactiveLighting)}
          onMaterialSettingsChange={setMaterialSettings}
          onToggleFullscreen={toggleFullscreen}
          onDownload={handleDownloadClick}
          onShare={onShare}
          card={card}
        />

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
            frameStyles={getFrameStyles()}
            enhancedEffectStyles={getEnhancedEffectStyles()}
            SurfaceTexture={SurfaceTexture}
            onMouseDown={handleDragStart}
            onMouseMove={handleDrag}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={() => setIsFlipped(!isFlipped)}
          />
        </div>
      </ViewerContainer>

      {/* Export Options Dialog */}
      <ExportOptionsDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        onExport={exportCard}
        isExporting={isExporting}
        exportProgress={exportProgress}
        cardTitle={card.title}
      />
    </>
  );
};
