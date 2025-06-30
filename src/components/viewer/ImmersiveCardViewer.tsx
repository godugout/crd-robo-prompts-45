import React, { useState, useCallback, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import type { ImmersiveCardViewerProps, EnvironmentScene, LightingPreset, MaterialSettings } from './types';
import { convertToViewerCardData } from './types';
import { 
  useEnhancedCardEffects, 
  type EffectValues 
} from './hooks/useEnhancedCardEffects';
import { useCardEffects } from './hooks/useCardEffects';
import { useDynamicCardBackMaterials } from './hooks/useDynamicCardBackMaterials';
import { ViewerControls } from './components/ViewerControls';
import { ProgressiveCustomizePanel } from './components/ProgressiveCustomizePanel';
import { EnhancedCardContainer } from './components/EnhancedCardContainer';
import { ExportOptionsDialog } from './components/ExportOptionsDialog';
import { ConfigurationDetailsPanel } from './components/ConfigurationDetailsPanel';
import { GestureHelpOverlay } from './components/GestureHelpOverlay';
import { MobileCardLayout } from './components/MobileCardLayout';
import { EnhancedMobileMainControlBar } from './components/EnhancedMobileMainControlBar';
import { EnhancedMobileStudioPanel } from './components/EnhancedMobileStudioPanel';
import { MobileInfoPanel } from './components/MobileInfoPanel';
import { MobileCreateCardPanel } from './components/MobileCreateCardPanel';
import { MobileFramesPanel } from './components/MobileFramesPanel';
import { MobileShowcasePanel } from './components/MobileShowcasePanel';
import { EffectProvider } from './contexts/EffectContext';

// New extracted components
import { CardNavigationControls } from './components/CardNavigationControls';
import { DesktopStudioToggle } from './components/DesktopStudioToggle';
import { ViewerInfoPanel } from './components/ViewerInfoPanel';
import { ViewerBackground } from './components/ViewerBackground';

// New extracted hooks
import { useCardNavigation } from './hooks/useCardNavigation';
import { useViewerInteraction } from './hooks/useViewerInteraction';
import { useViewerState } from './hooks/useViewerState';

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
  
  // Convert UniversalCardData to CardData for internal use
  const viewerCard = convertToViewerCardData(card);
  
  console.log('ImmersiveCardViewer: Converting card data:', {
    originalCard: {
      id: card.id,
      title: card.title,
      image_url: card.image_url,
      hasImage: !!card.image_url
    },
    convertedCard: {
      id: viewerCard.id,
      title: viewerCard.title,
      image_url: viewerCard.image_url,
      hasImage: !!viewerCard.image_url
    }
  });

  // Use extracted hooks
  const viewerState = useViewerState(isMobile);
  const viewerInteraction = useViewerInteraction(allowRotation);
  const cardNavigation = useCardNavigation({
    cards,
    currentCardIndex,
    onCardChange,
    setIsFlipped: viewerInteraction.setIsFlipped
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
  
  // Advanced settings - Updated for more professional defaults
  const [selectedScene, setSelectedScene] = useState<EnvironmentScene>('studio');
  const [selectedLighting, setSelectedLighting] = useState<LightingPreset>('studio');
  const [overallBrightness, setOverallBrightness] = useState([100]);
  const [interactiveLighting, setInteractiveLighting] = useState(true);
  
  // Material properties - More balanced defaults with transmission
  const [materialSettings, setMaterialSettings] = useState<MaterialSettings>({
    roughness: 0.40,
    metalness: 0.45,
    clearcoat: 0.60,
    transmission: 0.0,
    reflectivity: 0.40
  });

  // Add state for preset selection tracking
  const [selectedPresetId, setSelectedPresetId] = useState<string>();

  // Update the download handler to open export dialog
  const handleDownloadClick = useCallback(() => {
    viewerState.setShowExportDialog(true);
  }, [viewerState]);

  // Fix the share handler to pass the current card
  const handleShareClick = useCallback(() => {
    if (onShare) {
      onShare(card);
    }
  }, [onShare, card]);

  // Style generation hook - Create a component from SurfaceTexture element
  const { getFrameStyles, getEnhancedEffectStyles, getEnvironmentStyle, SurfaceTexture } = useCardEffects({
    card: viewerCard,
    effectValues,
    mousePosition: viewerInteraction.mousePosition,
    showEffects: viewerInteraction.showEffects,
    overallBrightness,
    interactiveLighting,
    selectedScene,
    selectedLighting,
    materialSettings,
    zoom: viewerInteraction.zoom,
    rotation: viewerInteraction.rotation,
    isHovering: viewerInteraction.isHovering
  });

  const cardContainerRef = useRef<HTMLDivElement>(null);

  // Create a proper component from the SurfaceTexture element
  const SurfaceTextureComponent = React.useMemo(() => {
    return React.memo(() => {
      return SurfaceTexture;
    });
  }, [SurfaceTexture]);

  // Enhanced combo application with atomic updates
  const handleComboApplication = useCallback((combo: any) => {
    console.log('🚀 Applying combo with atomic updates:', combo.id);
    
    // Apply preset atomically with all related state
    applyPreset(combo.effects, combo.id);
    
    // Update preset selection
    setSelectedPresetId(combo.id);
    
    // Apply any scene/lighting changes if specified
    if (combo.scene) {
      setSelectedScene(combo.scene);
    }
    if (combo.lighting) {
      setSelectedLighting(combo.lighting);
    }
  }, [applyPreset]);

  // Clear preset selection when manual effect changes are made
  const handleManualEffectChange = useCallback((effectId: string, parameterId: string, value: number | boolean | string) => {
    if (!isApplyingPreset) {
      setSelectedPresetId(undefined);
    }
    handleEffectChange(effectId, parameterId, value);
  }, [handleEffectChange, isApplyingPreset]);

  // Mobile handlers
  const handleCreateCardVariation = useCallback(async (variationType: string) => {
    console.log('Creating card variation:', variationType, 'for card:', card);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }, [card]);

  // Handle applying a frame
  const handleApplyFrame = useCallback((frameId: string) => {
    viewerState.setSelectedFrameId(frameId);
    viewerState.setShowFramesPanel(false);
    console.log('Applying frame:', frameId);
  }, [viewerState]);

  const handleSelectShowcaseLayout = useCallback((layoutId: string) => {
    viewerState.setSelectedShowcaseLayoutId(layoutId);
    viewerState.setShowShowcasePanel(false);
    console.log('Selecting showcase layout:', layoutId);
  }, [viewerState]);

  if (!isOpen) return null;

  // Calculate effect intensity for context
  const effectIntensity = Object.values(effectValues).map(effect => 
    typeof effect.intensity === 'number' ? effect.intensity : 0
  );

  // Create effect context value
  const effectContextValue = {
    effectValues,
    mousePosition: viewerInteraction.mousePosition,
    isHovering: viewerInteraction.isHovering,
    showEffects: viewerInteraction.showEffects,
    materialSettings,
    interactiveLighting,
    effectIntensity,
    handleEffectChange,
    resetEffect,
    resetAllEffects
  };

  // Mobile Layout with Enhanced Two-Level System
  if (isMobile) {
    return (
      <EffectProvider value={effectContextValue}>
        <div 
          ref={viewerInteraction.containerRef}
          className="fixed inset-0 z-50"
          style={{
            ...getEnvironmentStyle(),
          }}
          onMouseMove={viewerInteraction.handleMouseMove}
          onMouseUp={viewerInteraction.handleDragEnd}
          onMouseLeave={viewerInteraction.handleDragEnd}
        >
          <ViewerBackground
            selectedScene={selectedScene}
            mousePosition={viewerInteraction.mousePosition}
            ambient={ambient}
          />

          <MobileCardLayout
            bottomControls={
              <EnhancedMobileMainControlBar
                onCreateCardVariation={handleCreateCardVariation}
                onApplyFrame={handleApplyFrame}
                onSelectShowcaseLayout={handleSelectShowcaseLayout}
              />
            }
            floatingControls={
              <CardNavigationControls
                hasMultipleCards={cardNavigation.hasMultipleCards}
                currentCardIndex={currentCardIndex}
                totalCards={cards.length}
                canGoPrev={cardNavigation.canGoPrev}
                canGoNext={cardNavigation.canGoNext}
                onPreviousCard={cardNavigation.handlePreviousCard}
                onNextCard={cardNavigation.handleNextCard}
              />
            }
            infoPanel={
              showStats && (
                <MobileInfoPanel
                  selectedMaterial={selectedMaterial}
                  hasMultipleCards={cardNavigation.hasMultipleCards}
                />
              )
            }
            showInfoPanel={viewerState.showMobileInfo}
            studioPanel={
              <EnhancedMobileStudioPanel
                selectedScene={selectedScene}
                selectedLighting={selectedLighting}
                effectValues={effectValues}
                overallBrightness={overallBrightness}
                interactiveLighting={interactiveLighting}
                materialSettings={materialSettings}
                isFullscreen={viewerState.isFullscreen}
                onSceneChange={setSelectedScene}
                onLightingChange={setSelectedLighting}
                onEffectChange={handleManualEffectChange}
                onResetAllEffects={resetAllEffects}
                onBrightnessChange={setOverallBrightness}
                onInteractiveLightingToggle={() => setInteractiveLighting(!interactiveLighting)}
                onMaterialSettingsChange={setMaterialSettings}
                onToggleFullscreen={viewerState.toggleFullscreen}
                onDownload={handleDownloadClick}
                onShare={handleShareClick}
                card={card}
                selectedPresetId={selectedPresetId}
                onPresetSelect={setSelectedPresetId}
                onApplyCombo={handleComboApplication}
                isApplyingPreset={isApplyingPreset}
              />
            }
            createCardPanel={
              <MobileCreateCardPanel
                isVisible={viewerState.showCreateCardPanel}
                onClose={() => viewerState.setShowCreateCardPanel(false)}
                card={card}
                onCreateVariation={handleCreateCardVariation}
              />
            }
            framesPanel={
              <MobileFramesPanel
                isVisible={viewerState.showFramesPanel}
                onClose={() => viewerState.setShowFramesPanel(false)}
                onApplyFrame={handleApplyFrame}
                selectedFrameId={viewerState.selectedFrameId}
              />
            }
            showcasePanel={
              <MobileShowcasePanel
                isVisible={viewerState.showShowcasePanel}
                onClose={() => viewerState.setShowShowcasePanel(false)}
                onSelectLayout={handleSelectShowcaseLayout}
                selectedLayoutId={viewerState.selectedShowcaseLayoutId}
              />
            }
          >
            {/* Enhanced Card Container with Full Gesture Support */}
            <div ref={cardContainerRef}>
              <EnhancedCardContainer
                card={viewerCard}
                isFlipped={viewerInteraction.isFlipped}
                rotation={viewerInteraction.rotation}
                zoom={viewerInteraction.zoom}
                isDragging={viewerInteraction.isDragging}
                frameStyles={getFrameStyles()}
                enhancedEffectStyles={getEnhancedEffectStyles()}
                SurfaceTexture={SurfaceTextureComponent}
                onMouseDown={viewerInteraction.handleDragStart}
                onMouseMove={viewerInteraction.handleDrag}
                onMouseEnter={() => viewerInteraction.setIsHovering(true)}
                onMouseLeave={() => viewerInteraction.setIsHovering(false)}
                onClick={() => viewerInteraction.setIsFlipped(!viewerInteraction.isFlipped)}
                onZoom={(delta) => viewerInteraction.setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)))}
                onRotationChange={viewerInteraction.setRotation}
                onDoubleTap={() => {
                  if (viewerInteraction.zoom <= 1) {
                    viewerInteraction.setZoom(1.5);
                  } else {
                    viewerInteraction.setZoom(1);
                  }
                  viewerInteraction.setRotation({ x: 0, y: 0 });
                }}
                onLongPress={() => viewerInteraction.setIsFlipped(!viewerInteraction.isFlipped)}
                onSwipeLeft={cardNavigation.handleNextCard}
                onSwipeRight={cardNavigation.handlePreviousCard}
                onReset={viewerInteraction.handleReset}
              />
            </div>
          </MobileCardLayout>
        </div>

        {/* Export Options Dialog */}
        <ExportOptionsDialog
          isOpen={viewerState.showExportDialog}
          onClose={() => viewerState.setShowExportDialog(false)}
          cardTitle={card.title}
          cardElementRef={cardContainerRef}
        />

        {/* Gesture Help Overlay */}
        <GestureHelpOverlay
          isVisible={viewerState.showGestureHelp}
          onClose={() => viewerState.setShowGestureHelp(false)}
        />
      </EffectProvider>
    );
  }

  // Desktop Layout - Fixed for full background and centered card
  return (
    <EffectProvider value={effectContextValue}>
      <div 
        ref={viewerInteraction.containerRef}
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{
          ...getEnvironmentStyle(),
        }}
        onMouseMove={viewerInteraction.handleMouseMove}
        onMouseUp={viewerInteraction.handleDragEnd}
        onMouseLeave={viewerInteraction.handleDragEnd}
      >
        <ViewerBackground
          selectedScene={selectedScene}
          mousePosition={viewerInteraction.mousePosition}
          ambient={ambient}
        />

        {/* Settings Panel Toggle Button */}
        <DesktopStudioToggle
          showCustomizePanel={viewerState.showCustomizePanel}
          onToggle={() => viewerState.setShowCustomizePanel(true)}
        />

        {/* Desktop Controls */}
        <div className={`absolute bottom-4 left-4 z-20 transition-opacity duration-200 ${viewerInteraction.isHoveringControls ? 'opacity-100' : 'opacity-100'}`}>
          <ViewerControls
            showEffects={viewerInteraction.showEffects}
            autoRotate={viewerInteraction.autoRotate}
            onToggleEffects={() => viewerInteraction.setShowEffects(!viewerInteraction.showEffects)}
            onToggleAutoRotate={() => viewerInteraction.setAutoRotate(!viewerInteraction.autoRotate)}
            onReset={viewerInteraction.handleReset}
            onZoomIn={() => viewerInteraction.handleZoom(0.1)}
            onZoomOut={() => viewerInteraction.handleZoom(-0.1)}
          />
        </div>

        {/* Card Navigation Controls */}
        <CardNavigationControls
          hasMultipleCards={cardNavigation.hasMultipleCards}
          currentCardIndex={currentCardIndex}
          totalCards={cards.length}
          canGoPrev={cardNavigation.canGoPrev}
          canGoNext={cardNavigation.canGoNext}
          onPreviousCard={cardNavigation.handlePreviousCard}
          onNextCard={cardNavigation.handleNextCard}
        />

        {/* Desktop Customize Panel */}
        {viewerState.showCustomizePanel && (
          <div className="absolute top-0 right-0 h-full w-80 z-30">
            <ProgressiveCustomizePanel
              selectedScene={selectedScene}
              selectedLighting={selectedLighting}
              effectValues={effectValues}
              overallBrightness={overallBrightness}
              interactiveLighting={interactiveLighting}
              materialSettings={materialSettings}
              isFullscreen={viewerState.isFullscreen}
              onSceneChange={setSelectedScene}
              onLightingChange={setSelectedLighting}
              onEffectChange={handleManualEffectChange}
              onResetAllEffects={resetAllEffects}
              onBrightnessChange={setOverallBrightness}
              onInteractiveLightingToggle={() => setInteractiveLighting(!interactiveLighting)}
              onMaterialSettingsChange={setMaterialSettings}
              onToggleFullscreen={viewerState.toggleFullscreen}
              onDownload={handleDownloadClick}
              onShare={handleShareClick}
              onClose={() => {
                if (onClose) {
                  onClose();
                } else {
                  viewerState.setShowCustomizePanel(false);
                }
              }}
              card={card}
              selectedPresetId={selectedPresetId}
              onPresetSelect={setSelectedPresetId}
              onApplyCombo={handleComboApplication}
              isApplyingPreset={isApplyingPreset}
            />
          </div>
        )}

        {/* Enhanced Card Container - Centered regardless of panels */}
        <div ref={cardContainerRef} className="flex items-center justify-center w-full h-full">
          <EnhancedCardContainer
            card={viewerCard}
            isFlipped={viewerInteraction.isFlipped}
            rotation={viewerInteraction.rotation}
            zoom={viewerInteraction.zoom}
            isDragging={viewerInteraction.isDragging}
            frameStyles={getFrameStyles()}
            enhancedEffectStyles={getEnhancedEffectStyles()}
            SurfaceTexture={SurfaceTextureComponent}
            onMouseDown={viewerInteraction.handleDragStart}
            onMouseMove={viewerInteraction.handleDrag}
            onMouseEnter={() => viewerInteraction.setIsHovering(true)}
            onMouseLeave={() => viewerInteraction.setIsHovering(false)}
            onClick={() => viewerInteraction.setIsFlipped(!viewerInteraction.isFlipped)}
            onZoom={(delta) => viewerInteraction.setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)))}
            onRotationChange={viewerInteraction.setRotation}
            onDoubleTap={() => {
              if (viewerInteraction.zoom <= 1) {
                viewerInteraction.setZoom(1.5);
              } else {
                viewerInteraction.setZoom(1);
              }
              viewerInteraction.setRotation({ x: 0, y: 0 });
            }}
            onLongPress={() => viewerInteraction.setIsFlipped(!viewerInteraction.isFlipped)}
            onSwipeLeft={cardNavigation.handleNextCard}
            onSwipeRight={cardNavigation.handlePreviousCard}
            onReset={viewerInteraction.handleReset}
          />
        </div>

        {/* Configuration Details Panel */}
        {!viewerState.showCustomizePanel && (
          <div className="absolute top-4 left-4 z-10">
            <ConfigurationDetailsPanel
              effectValues={effectValues}
              selectedScene={selectedScene}
              selectedLighting={selectedLighting}
              materialSettings={materialSettings}
              overallBrightness={overallBrightness}
              interactiveLighting={interactiveLighting}
            />
          </div>
        )}

        {/* Info Panel */}
        <ViewerInfoPanel
          showStats={showStats}
          isFlipped={viewerInteraction.isFlipped}
          showCustomizePanel={viewerState.showCustomizePanel}
          hasMultipleCards={cardNavigation.hasMultipleCards}
          selectedMaterial={selectedMaterial}
        />
      </div>

      {/* Export Options Dialog */}
      <ExportOptionsDialog
        isOpen={viewerState.showExportDialog}
        onClose={() => viewerState.setShowExportDialog(false)}
        cardTitle={card.title}
        cardElementRef={cardContainerRef}
      />

      {/* Gesture Help Overlay */}
      <GestureHelpOverlay
        isVisible={viewerState.showGestureHelp}
        onClose={() => viewerState.setShowGestureHelp(false)}
      />
    </EffectProvider>
  );
};
