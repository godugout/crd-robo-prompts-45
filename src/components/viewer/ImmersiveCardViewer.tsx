import React, { useCallback } from 'react';
import type { ImmersiveCardViewerProps } from './types';
import { ViewerContainer } from './components/ViewerContainer';
import { ViewerErrorBoundary } from './components/ViewerErrorBoundary';
import { ViewerTopControls } from './components/ViewerTopControls';
import { ViewerCardRenderer } from './components/ViewerCardRenderer';
import { CompactBottomDrawer } from './components/CompactBottomDrawer';
import { ExportOptionsDialog } from './components/ExportOptionsDialog';
import { useCardExport } from './hooks/useCardExport';
import { useViewerState } from './hooks/useViewerState';
import { useViewerInteractions } from './hooks/useViewerInteractions';
import { useViewerSettings } from './hooks/useViewerSettings';
import { useCardNavigation } from './hooks/useCardNavigation';
import { useEnhancedEffectsProvider } from './hooks/useEnhancedEffectsProvider';
import { useDrawerState } from './hooks/useDrawerState';

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
  console.log('ImmersiveCardViewer mounted:', { 
    isOpen, 
    hasCard: !!card, 
    cardTitle: card?.title,
    cardImageUrl: card?.image_url
  });

  // Check for basic card data
  if (!card) {
    console.error('ImmersiveCardViewer: No card data provided');
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-xl mb-2">Card Not Found</h2>
          <p className="text-gray-400">No card data available to display</p>
        </div>
      </div>
    );
  }

  // Use the new state management hooks
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

  console.log('Viewer state:', { isFullscreen, rotation, zoom, showEffects, mousePosition });

  // Use the new settings hook
  const {
    selectedScene,
    selectedLighting,
    overallBrightness,
    interactiveLighting,
    materialSettings,
    setSelectedScene,
    setSelectedLighting,
    setOverallBrightness,
    setInteractiveLighting,
    setMaterialSettings
  } = useViewerSettings();

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

  // Use the new card navigation hook
  const {
    hasMultipleCards,
    canGoNext,
    canGoPrev,
    handlePreviousCard,
    handleNextCard
  } = useCardNavigation({
    cards,
    currentCardIndex,
    onCardChange,
    setIsFlipped
  });

  // Add export functionality
  const { exportCard, isExporting, exportProgress } = useCardExport({
    cardRef: cardContainerRef,
    card,
    onRotationChange: setRotation,
    onEffectChange: handleEffectChange,
    effectValues
  });

  // Get drawer state for positioning
  const { isOpen: isDrawerOpen } = useDrawerState();

  // Update the existing download handler to open export dialog
  const handleDownloadClick = useCallback(() => {
    setShowExportDialog(true);
  }, [setShowExportDialog]);

  // Use the enhanced effects provider hook
  const {
    getFrameStyles,
    getEnhancedEffectStyles,
    SurfaceTexture
  } = useEnhancedEffectsProvider({
    card,
    effectValues,
    mousePosition,
    showEffects,
    overallBrightness,
    interactiveLighting
  });

  if (!isOpen) {
    console.log('Viewer not open, returning null');
    return null;
  }

  console.log('Rendering viewer components with TOP TRIGGER for testing');

  return (
    <ViewerErrorBoundary>
      <ViewerContainer
        containerRef={containerRef}
        isFullscreen={isFullscreen}
        ambient={ambient}
        mousePosition={mousePosition}
        selectedScene={selectedScene}
        isDrawerOpen={isDrawerOpen}
        onMouseMove={handleMouseMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      >
        {/* Top Controls Section */}
        <ViewerTopControls
          showEffects={showEffects}
          autoRotate={autoRotate}
          onToggleEffects={() => setShowEffects(!showEffects)}
          onToggleAutoRotate={() => setAutoRotate(!autoRotate)}
          onReset={handleReset}
          onZoomIn={() => handleZoom(0.1)}
          onZoomOut={() => handleZoom(-0.1)}
          currentCardIndex={currentCardIndex}
          totalCards={cards.length}
          onPreviousCard={handlePreviousCard}
          onNextCard={handleNextCard}
          canGoPrev={canGoPrev}
          canGoNext={canGoNext}
        />

        {/* Compact Drawer with TOP TRIGGER for testing */}
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
          useTopTrigger={true}
        />

        {/* Enhanced Card Container with Error Boundary */}
        <ViewerCardRenderer
          cardContainerRef={cardContainerRef}
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
    </ViewerErrorBoundary>
  );
};
