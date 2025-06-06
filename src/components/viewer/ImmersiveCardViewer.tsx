
import React, { useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import type { ImmersiveCardViewerProps } from './types';
import { 
  useEnhancedCardEffects,
  type EffectValues 
} from './hooks/useEnhancedCardEffects';
import { useCardEffects } from './hooks/useCardEffects';
import { useDynamicCardBackMaterials } from './hooks/useDynamicCardBackMaterials';
import { useEnhancedMobileGestures } from './hooks/gestures/useEnhancedMobileGestures';
import { useViewerState } from './hooks/useViewerState';
import { useCardNavigation } from './hooks/useCardNavigation';
import { useViewerGestures } from './hooks/useViewerGestures';
import { MobileStudioDrawer } from './components/MobileStudioDrawer';
import { EnhancedCardContainer } from './components/EnhancedCardContainer';
import { ExportOptionsDialog } from './components/ExportOptionsDialog';
import { GestureHelpOverlay } from './components/GestureHelpOverlay';
import { MobileCardViewer } from './components/MobileCardViewer';
import { DesktopCardViewer } from './components/DesktopCardViewer';

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
  const isMobile = useIsMobile();
  
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);

  // Custom hooks for state management
  const viewerState = useViewerState();
  const {
    isFullscreen, setIsFullscreen, rotation, setRotation, isDragging, setIsDragging,
    dragStart, setDragStart, zoom, setZoom, isFlipped, setIsFlipped, autoRotate, setAutoRotate,
    showEffects, setShowEffects, mousePosition, setMousePosition, showCustomizePanel, setShowCustomizePanel,
    isHovering, setIsHovering, isHoveringControls, setIsHoveringControls, showExportDialog, setShowExportDialog,
    showGestureHelp, setShowGestureHelp, showMobileInfo, setShowMobileInfo, selectedPresetId, setSelectedPresetId,
    selectedScene, setSelectedScene, selectedLighting, setSelectedLighting, overallBrightness, setOverallBrightness,
    interactiveLighting, setInteractiveLighting, materialSettings, setMaterialSettings
  } = viewerState;

  // Card navigation
  const {
    hasMultipleCards, canGoNext, canGoPrev, handlePreviousCard, handleNextCard
  } = useCardNavigation({
    cards,
    currentCardIndex,
    onCardChange,
    setIsFlipped
  });

  // Enhanced effects state with atomic preset application
  const enhancedEffectsHook = useEnhancedCardEffects();
  const {
    effectValues,
    handleEffectChange,
    resetEffect,
    resetAllEffects,
    applyPreset,
    isApplyingPreset
  } = enhancedEffectsHook;
  
  // Get dynamic material based on current effects
  const { selectedMaterial } = useDynamicCardBackMaterials(effectValues);

  // Gesture handling
  const gestureHandlers = useViewerGestures({
    zoom, rotation, isFlipped, autoRotate, allowRotation, isDragging, dragStart,
    setZoom, setRotation, setIsFlipped, setAutoRotate, setIsDragging, setDragStart,
    setMousePosition, setIsHoveringControls, handleNextCard, handlePreviousCard,
    containerRef, isMobile
  });

  // Update the download handler to open export dialog
  const handleDownloadClick = () => {
    setShowExportDialog(true);
  };

  // Fix the share handler to pass the current card
  const handleShareClick = () => {
    if (onShare) {
      onShare(card);
    }
  };

  // Style generation hook
  const { getFrameStyles, getEnhancedEffectStyles, getEnvironmentStyle, SurfaceTexture } = useCardEffects({
    card,
    effectValues,
    mousePosition,
    showEffects,
    overallBrightness,
    interactiveLighting,
    selectedScene,
    selectedLighting,
    materialSettings,
    zoom,
    rotation,
    isHovering
  });

  // Enhanced combo application with atomic updates
  const handleComboApplication = (combo: any) => {
    console.log('🚀 Applying combo with atomic updates:', combo.id);
    applyPreset(combo.effects, combo.id);
    setSelectedPresetId(combo.id);
    
    if (combo.scene) {
      setSelectedScene(combo.scene);
    }
    if (combo.lighting) {
      setSelectedLighting(combo.lighting);
    }
  };

  // Clear preset selection when manual effect changes are made
  const handleManualEffectChange = (effectId: string, parameterId: string, value: number | boolean | string) => {
    if (!isApplyingPreset) {
      setSelectedPresetId(undefined);
    }
    handleEffectChange(effectId, parameterId, value);
  };

  // Enhanced mobile gesture handlers - Always call the hook, but only use results on mobile
  const { touchHandlers, isActive } = useEnhancedMobileGestures({
    onPinchZoom: (scale: number, center: { x: number; y: number }) => {
      if (isMobile) {
        setZoom(prev => Math.max(0.5, Math.min(3, prev * scale)));
      }
    },
    onPan: (delta: { x: number; y: number }, velocity: { x: number; y: number }) => {
      if (isMobile && allowRotation) {
        const sensitivity = 0.5;
        setRotation(prev => ({
          x: Math.max(-45, Math.min(45, prev.x + delta.y * sensitivity)),
          y: prev.y - delta.x * sensitivity
        }));
      }
    },
    onRotate: (angle: number) => {
      if (isMobile && allowRotation) {
        setRotation(prev => ({
          x: prev.x,
          y: prev.y + angle * 0.5
        }));
      }
    },
    onTap: () => isMobile && setIsFlipped(!isFlipped),
    onDoubleTap: () => {
      if (isMobile) {
        if (zoom <= 1) {
          setZoom(1.8);
        } else {
          setZoom(1);
          setRotation({ x: 0, y: 0 });
        }
      }
    },
    onLongPress: () => {
      if (isMobile) {
        setAutoRotate(!autoRotate);
        if ('vibrate' in navigator) {
          navigator.vibrate(100);
        }
      }
    },
    onSwipeLeft: () => isMobile && handleNextCard(),
    onSwipeRight: () => isMobile && handlePreviousCard(),
    onThreeFingerTap: () => {
      if (isMobile) {
        gestureHandlers.handleMobileReset();
        if ('vibrate' in navigator) {
          navigator.vibrate([100, 50, 100]);
        }
      }
    },
  });

  if (!isOpen) return null;

  // Mobile Layout - Using new mobile components
  if (isMobile) {
    return (
      <>
        <MobileCardViewer
          onOpenStudio={() => setShowCustomizePanel(true)}
          onClose={onClose}
          isStudioOpen={showCustomizePanel}
          showEffects={showEffects}
          onToggleEffects={() => setShowEffects(!showEffects)}
          onReset={gestureHandlers.handleMobileReset}
          onZoomIn={() => gestureHandlers.handleMobileZoom(0.2)}
          onZoomOut={() => gestureHandlers.handleMobileZoom(-0.2)}
          onToggleInfo={() => setShowMobileInfo(!showMobileInfo)}
          showInfo={showMobileInfo}
          hasMultipleCards={hasMultipleCards}
          canGoPrev={canGoPrev}
          canGoNext={canGoNext}
          currentCardIndex={currentCardIndex}
          totalCards={cards.length}
          onPreviousCard={handlePreviousCard}
          onNextCard={handleNextCard}
          selectedMaterial={selectedMaterial}
          environmentStyle={getEnvironmentStyle()}
          ambientOverlay={
            ambient && selectedScene && (
              <div 
                className="absolute inset-0 opacity-30"
                style={{
                  background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
                    ${selectedScene.lighting.color} 0%, transparent 40%)`,
                  mixBlendMode: 'screen'
                }}
              />
            )
          }
        >
          {/* Enhanced Card Container with new gesture support */}
          <div 
            ref={cardContainerRef}
            className="relative z-20 cursor-grab active:cursor-grabbing"
            style={{
              transform: `scale(${zoom})`,
              transition: isDragging || isActive ? 'none' : 'transform 0.3s ease',
              filter: `brightness(${interactiveLighting && (isHovering || isActive) ? 1.3 : 1.2}) contrast(1.1)`,
              ...(isActive ? {
                filter: `brightness(1.3) contrast(1.1) drop-shadow(0 0 20px rgba(16, 185, 129, 0.3))`
              } : {})
            }}
            {...touchHandlers}
          >
            <EnhancedCardContainer
              card={card}
              isFlipped={isFlipped}
              isHovering={isHovering || isActive}
              showEffects={showEffects}
              effectValues={effectValues}
              mousePosition={mousePosition}
              rotation={rotation}
              zoom={zoom}
              isDragging={isDragging || isActive}
              frameStyles={getFrameStyles()}
              enhancedEffectStyles={getEnhancedEffectStyles()}
              SurfaceTexture={SurfaceTexture}
              interactiveLighting={interactiveLighting}
              onMouseDown={() => {}}
              onMouseMove={() => {}}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onClick={() => {}}
            />
          </div>
        </MobileCardViewer>

        {/* Mobile Studio Drawer */}
        <MobileStudioDrawer
          selectedScene={selectedScene}
          selectedLighting={selectedLighting}
          effectValues={effectValues}
          overallBrightness={overallBrightness}
          interactiveLighting={interactiveLighting}
          materialSettings={materialSettings}
          isFullscreen={isFullscreen}
          onSceneChange={setSelectedScene}
          onLightingChange={setSelectedLighting}
          onEffectChange={handleManualEffectChange}
          onResetAllEffects={resetAllEffects}
          onBrightnessChange={setOverallBrightness}
          onInteractiveLightingToggle={() => setInteractiveLighting(!interactiveLighting)}
          onMaterialSettingsChange={setMaterialSettings}
          onToggleFullscreen={gestureHandlers.toggleFullscreen}
          onDownload={handleDownloadClick}
          onShare={handleShareClick}
          card={card}
          selectedPresetId={selectedPresetId}
          onPresetSelect={setSelectedPresetId}
          onApplyCombo={handleComboApplication}
          isApplyingPreset={isApplyingPreset}
          isOpen={showCustomizePanel}
          onOpenChange={setShowCustomizePanel}
        />

        {/* Export Options Dialog */}
        <ExportOptionsDialog
          isOpen={showExportDialog}
          onClose={() => setShowExportDialog(false)}
          cardTitle={card.title}
          cardElementRef={cardContainerRef}
        />
      </>
    );
  }

  // Desktop Layout
  return (
    <>
      <DesktopCardViewer
        card={card}
        hasMultipleCards={hasMultipleCards}
        canGoPrev={canGoPrev}
        canGoNext={canGoNext}
        currentCardIndex={currentCardIndex}
        totalCards={cards.length}
        onPreviousCard={handlePreviousCard}
        onNextCard={handleNextCard}
        showCustomizePanel={showCustomizePanel}
        setShowCustomizePanel={setShowCustomizePanel}
        showStats={showStats}
        isFlipped={isFlipped}
        setIsFlipped={setIsFlipped}
        isHovering={isHovering}
        setIsHovering={setIsHovering}
        isHoveringControls={isHoveringControls}
        showExportDialog={showExportDialog}
        setShowExportDialog={setShowExportDialog}
        onMouseMove={gestureHandlers.handleMouseMove}
        onMouseUp={gestureHandlers.handleDragEnd}
        onMouseLeave={gestureHandlers.handleDragEnd}
        onDragStart={gestureHandlers.handleDragStart}
        onDrag={gestureHandlers.handleDrag}
        onReset={gestureHandlers.handleReset}
        onZoom={gestureHandlers.handleZoom}
        showEffects={showEffects}
        setShowEffects={setShowEffects}
        autoRotate={autoRotate}
        setAutoRotate={setAutoRotate}
        effectValues={effectValues}
        selectedScene={selectedScene}
        selectedLighting={selectedLighting}
        materialSettings={materialSettings}
        overallBrightness={overallBrightness}
        interactiveLighting={interactiveLighting}
        selectedPresetId={selectedPresetId}
        isApplyingPreset={isApplyingPreset}
        onEffectChange={handleManualEffectChange}
        onResetAllEffects={resetAllEffects}
        onSceneChange={setSelectedScene}
        onLightingChange={setSelectedLighting}
        onBrightnessChange={setOverallBrightness}
        onInteractiveLightingToggle={() => setInteractiveLighting(!interactiveLighting)}
        onMaterialSettingsChange={setMaterialSettings}
        onToggleFullscreen={gestureHandlers.toggleFullscreen}
        onDownload={handleDownloadClick}
        onShare={handleShareClick}
        onClose={onClose}
        onPresetSelect={setSelectedPresetId}
        onApplyCombo={handleComboApplication}
        containerRef={containerRef}
        cardContainerRef={cardContainerRef}
        environmentStyle={getEnvironmentStyle()}
        ambientOverlay={
          ambient && selectedScene && (
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
                  ${selectedScene.lighting.color} 0%, transparent 40%)`,
                mixBlendMode: 'screen'
              }}
            />
          )
        }
        frameStyles={getFrameStyles()}
        enhancedEffectStyles={getEnhancedEffectStyles()}
        SurfaceTexture={SurfaceTexture}
        selectedMaterial={selectedMaterial}
        mousePosition={mousePosition}
        rotation={rotation}
        zoom={zoom}
        isDragging={isDragging}
        isFullscreen={isFullscreen}
      />

      {/* Gesture Help Overlay */}
      <GestureHelpOverlay
        isVisible={showGestureHelp}
        onClose={() => setShowGestureHelp(false)}
      />
    </>
  );
};
