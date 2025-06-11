import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import type { ImmersiveCardViewerProps, EnvironmentScene, LightingPreset, MaterialSettings } from './types';
import { convertToViewerCardData } from './types';
import { ENVIRONMENT_SCENES, LIGHTING_PRESETS } from './constants';
import { 
  useEnhancedCardEffects, 
  ENHANCED_VISUAL_EFFECTS,
  type EffectValues 
} from './hooks/useEnhancedCardEffects';
import { useCardEffects } from './hooks/useCardEffects';
import { useDynamicCardBackMaterials } from './hooks/useDynamicCardBackMaterials';
import { ViewerControls } from './components/ViewerControls';
import { MobileViewerControls } from './components/MobileViewerControls';
import { ProgressiveCustomizePanel } from './components/ProgressiveCustomizePanel';
import { MobileStudioDrawer } from './components/MobileStudioDrawer';
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
import { useMobileControl } from './context/MobileControlContext';
import { EffectProvider } from './contexts/EffectContext';

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
  
  // State
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isFlipped, setIsFlipped] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [showEffects, setShowEffects] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showCustomizePanel, setShowCustomizePanel] = useState(!isMobile); // Default closed on mobile
  const [isHovering, setIsHovering] = useState(false);
  const [isHoveringControls, setIsHoveringControls] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showGestureHelp, setShowGestureHelp] = useState(false);
  const [showMobileInfo, setShowMobileInfo] = useState(false);
  
  // New mobile-specific state
  const [showStudioPanel, setShowStudioPanel] = useState(false);
  const [showCreateCardPanel, setShowCreateCardPanel] = useState(false);
  const [showFramesPanel, setShowFramesPanel] = useState(false);
  const [showShowcasePanel, setShowShowcasePanel] = useState(false);
  const [rotateMode, setRotateMode] = useState(false);
  const [selectedFrameId, setSelectedFrameId] = useState<string>();
  const [selectedShowcaseLayoutId, setSelectedShowcaseLayoutId] = useState<string>();

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
  const [selectedScene, setSelectedScene] = useState<EnvironmentScene>(ENVIRONMENT_SCENES[0]); // Studio instead of Twilight
  const [selectedLighting, setSelectedLighting] = useState<LightingPreset>(LIGHTING_PRESETS[0]);
  const [overallBrightness, setOverallBrightness] = useState([100]); // Reduced from 120
  const [interactiveLighting, setInteractiveLighting] = useState(true);
  
  // Material properties - More balanced defaults
  const [materialSettings, setMaterialSettings] = useState<MaterialSettings>({
    roughness: 0.40, // Increased from 0.30
    metalness: 0.45, // Reduced from 0.60
    clearcoat: 0.60, // Reduced from 0.75
    reflectivity: 0.40 // Reduced from 0.50
  });

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

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
  }, [canGoPrev, currentCardIndex, onCardChange]);

  const handleNextCard = useCallback(() => {
    if (canGoNext && onCardChange) {
      onCardChange(currentCardIndex + 1);
      setIsFlipped(false); // Reset flip state when changing cards
    }
  }, [canGoNext, currentCardIndex, onCardChange]);

  // Enhanced mobile gesture handlers
  const handleMobileZoom = useCallback((delta: number) => {
    setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
  }, []);

  const handleRotationChange = useCallback((newRotation: { x: number; y: number }) => {
    setRotation(newRotation);
  }, []);

  const handleMobileDoubleTap = useCallback(() => {
    // Toggle between fit and fill zoom
    if (zoom <= 1) {
      setZoom(1.5);
    } else {
      setZoom(1);
    }
    setRotation({ x: 0, y: 0 });
  }, [zoom]);

  const handleMobileLongPress = useCallback(() => {
    setIsFlipped(!isFlipped);
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }, [isFlipped]);

  const handleMobileSwipeLeft = useCallback(() => {
    handleNextCard();
  }, [handleNextCard]);

  const handleMobileSwipeRight = useCallback(() => {
    handlePreviousCard();
  }, [handlePreviousCard]);

  const handleMobileReset = useCallback(() => {
    setRotation({ x: 0, y: 0 });
    setZoom(1);
    setIsFlipped(false);
    setAutoRotate(false);
    // Haptic feedback for reset
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
  }, []);

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

  // Update the download handler to open export dialog
  const handleDownloadClick = useCallback(() => {
    setShowExportDialog(true);
  }, []);

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

  // Create a proper component from the SurfaceTexture element
  const SurfaceTextureComponent = React.useMemo(() => {
    return React.memo(() => {
      return SurfaceTexture;
    });
  }, [SurfaceTexture]);

  // Auto-rotation effect
  useEffect(() => {
    if (autoRotate && !isDragging) {
      const animate = () => {
        setRotation(prev => ({
          x: Math.sin(Date.now() * 0.0005) * 10,
          y: prev.y + 0.5
        }));
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [autoRotate, isDragging]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomDelta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom(prev => Math.max(0.5, Math.min(3, prev + zoomDelta)));
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isMobile && !isDragging && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePosition({ x, y });
      
      const isInControlsArea = e.clientX - rect.left < 300 && e.clientY - rect.top > rect.height - 100;
      setIsHoveringControls(isInControlsArea);
      
      if (allowRotation && !autoRotate) {
        setRotation({
          x: (y - 0.5) * 20,
          y: (x - 0.5) * -20
        });
      }
    }
  }, [isDragging, allowRotation, autoRotate, isMobile]);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (allowRotation) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - rotation.y, y: e.clientY - rotation.x });
      setAutoRotate(false);
    }
  }, [rotation, allowRotation]);

  const handleDrag = useCallback((e: React.MouseEvent) => {
    if (isDragging && allowRotation) {
      setRotation({
        x: e.clientY - dragStart.y,
        y: e.clientX - dragStart.x
      });
    }
  }, [isDragging, dragStart, allowRotation]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleReset = useCallback(() => {
    setRotation({ x: 0, y: 0 });
    setZoom(1);
    setIsFlipped(false);
    setAutoRotate(false);
  }, []);

  const handleZoom = useCallback((delta: number) => {
    setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Add state for preset selection tracking
  const [selectedPresetId, setSelectedPresetId] = useState<string>();

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

  const handleMobileStudioOpen = useCallback(() => {
    setShowStudioPanel(true);
    setShowCreateCardPanel(false);
    setShowFramesPanel(false);
    setShowShowcasePanel(false);
  }, []);

  const handleMobileFlipRotate = useCallback(() => {
    if (rotateMode) {
      // In rotate mode, apply rotation step
      setRotation(prev => ({
        x: prev.x,
        y: prev.y + 45
      }));
    } else {
      // Normal flip
      setIsFlipped(!isFlipped);
    }
  }, [rotateMode, isFlipped]);

  const handleMobileLongPressRotate = useCallback(() => {
    setRotateMode(!rotateMode);
    if ('vibrate' in navigator) {
      navigator.vibrate(100);
    }
  }, [rotateMode]);

  const handleMobileCreateCard = useCallback(() => {
    setShowCreateCardPanel(true);
    setShowStudioPanel(false);
    setShowFramesPanel(false);
    setShowShowcasePanel(false);
  }, []);

  const handleMobileFrames = useCallback(() => {
    setShowFramesPanel(true);
    setShowStudioPanel(false);
    setShowCreateCardPanel(false);
    setShowShowcasePanel(false);
  }, []);

  const handleMobileShowcase = useCallback(() => {
    setShowShowcasePanel(true);
    setShowStudioPanel(false);
    setShowCreateCardPanel(false);
    setShowFramesPanel(false);
  }, []);

  const handleCreateCardVariation = useCallback(async (variationType: string) => {
    // Implementation for creating card variations
    console.log('Creating card variation:', variationType, 'for card:', card);
    // TODO: Implement actual card variation creation logic
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate async operation
  }, [card]);

  const handleApplyFrame = useCallback((frameId: string) => {
    setSelectedFrameId(frameId);
    setShowFramesPanel(false);
    console.log('Applying frame:', frameId);
    // TODO: Implement actual frame application logic
  }, []);

  const handleSelectShowcaseLayout = useCallback((layoutId: string) => {
    setSelectedShowcaseLayoutId(layoutId);
    setShowShowcasePanel(false);
    console.log('Selecting showcase layout:', layoutId);
    // TODO: Implement actual showcase layout logic
  }, []);

  if (!isOpen) return null;

  // Calculate effect intensity for context
  const effectIntensity = Object.values(effectValues).map(effect => 
    typeof effect.intensity === 'number' ? effect.intensity : 0
  );

  // Create effect context value
  const effectContextValue = {
    effectValues,
    mousePosition,
    isHovering,
    showEffects,
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
          ref={containerRef}
          className="fixed inset-0 z-50"
          style={{
            ...getEnvironmentStyle(),
          }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
        >
          {/* Enhanced Dark Overlay */}
          <div className="absolute inset-0 bg-black/60" />

          {/* Subtle Ambient Background Effect */}
          {ambient && selectedScene && (
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
                  ${selectedScene.lighting.color} 0%, transparent 40%)`,
                mixBlendMode: 'screen'
              }}
            />
          )}

          <MobileCardLayout
            bottomControls={
              <EnhancedMobileMainControlBar
                onCreateCardVariation={handleCreateCardVariation}
                onApplyFrame={handleApplyFrame}
                onSelectShowcaseLayout={handleSelectShowcaseLayout}
              />
            }
            floatingControls={
              hasMultipleCards && (
                <div className="flex items-center space-x-2 bg-black bg-opacity-80 backdrop-blur-lg rounded-lg p-2 border border-white/10">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePreviousCard}
                    disabled={!canGoPrev}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white disabled:opacity-50 h-8 w-8 p-0"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  
                  <div className="text-white text-xs px-2">
                    {currentCardIndex + 1}/{cards.length}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleNextCard}
                    disabled={!canGoNext}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white disabled:opacity-50 h-8 w-8 p-0"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )
            }
            infoPanel={
              showStats && (
                <MobileInfoPanel
                  selectedMaterial={selectedMaterial}
                  hasMultipleCards={hasMultipleCards}
                />
              )
            }
            showInfoPanel={showMobileInfo}
            studioPanel={
              <EnhancedMobileStudioPanel
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
                onToggleFullscreen={toggleFullscreen}
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
                isVisible={showCreateCardPanel}
                onClose={() => setShowCreateCardPanel(false)}
                card={card}
                onCreateVariation={handleCreateCardVariation}
              />
            }
            framesPanel={
              <MobileFramesPanel
                isVisible={showFramesPanel}
                onClose={() => setShowFramesPanel(false)}
                onApplyFrame={handleApplyFrame}
                selectedFrameId={selectedFrameId}
              />
            }
            showcasePanel={
              <MobileShowcasePanel
                isVisible={showShowcasePanel}
                onClose={() => setShowShowcasePanel(false)}
                onSelectLayout={handleSelectShowcaseLayout}
                selectedLayoutId={selectedShowcaseLayoutId}
              />
            }
          >
            {/* Enhanced Card Container with Full Gesture Support */}
            <div ref={cardContainerRef}>
              <EnhancedCardContainer
                card={viewerCard}
                isFlipped={isFlipped}
                rotation={rotation}
                zoom={zoom}
                isDragging={isDragging}
                frameStyles={getFrameStyles()}
                enhancedEffectStyles={getEnhancedEffectStyles()}
                SurfaceTexture={SurfaceTextureComponent}
                onMouseDown={handleDragStart}
                onMouseMove={handleDrag}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onClick={() => setIsFlipped(!isFlipped)}
                onZoom={handleMobileZoom}
                onRotationChange={handleRotationChange}
                onDoubleTap={handleMobileDoubleTap}
                onLongPress={handleMobileLongPress}
                onSwipeLeft={handleMobileSwipeLeft}
                onSwipeRight={handleMobileSwipeRight}
                onReset={handleMobileReset}
              />
            </div>
          </MobileCardLayout>
        </div>

        {/* Export Options Dialog */}
        <ExportOptionsDialog
          isOpen={showExportDialog}
          onClose={() => setShowExportDialog(false)}
          cardTitle={card.title}
          cardElementRef={cardContainerRef}
        />

        {/* Gesture Help Overlay */}
        <GestureHelpOverlay
          isVisible={showGestureHelp}
          onClose={() => setShowGestureHelp(false)}
        />
      </EffectProvider>
    );
  }

  // Desktop Layout - Fixed for full background and centered card
  return (
    <EffectProvider value={effectContextValue}>
      <div 
        ref={containerRef}
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{
          ...getEnvironmentStyle(),
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      >
        {/* Enhanced Dark Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Subtle Ambient Background Effect */}
        {ambient && selectedScene && (
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
                ${selectedScene.lighting.color} 0%, transparent 40%)`,
              mixBlendMode: 'screen'
            }}
          />
        )}

        {/* Settings Panel Toggle Button - Fixed positioning */}
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

        {/* Desktop Controls - Fixed positioning */}
        <div className={`absolute bottom-4 left-4 z-20 transition-opacity duration-200 ${isHoveringControls ? 'opacity-100' : 'opacity-100'}`}>
          <ViewerControls
            showEffects={showEffects}
            autoRotate={autoRotate}
            onToggleEffects={() => setShowEffects(!showEffects)}
            onToggleAutoRotate={() => setAutoRotate(!autoRotate)}
            onReset={handleReset}
            onZoomIn={() => handleZoom(0.1)}
            onZoomOut={() => handleZoom(-0.1)}
          />
        </div>

        {/* Card Navigation Controls - Fixed positioning */}
        {hasMultipleCards && (
          <div className="absolute bottom-4 right-4 z-10">
            <div className="flex items-center space-x-2 bg-black bg-opacity-80 backdrop-blur-lg rounded-lg p-3 border border-white/10">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePreviousCard}
                disabled={!canGoPrev}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur border border-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <div className="text-white text-sm px-3">
                {currentCardIndex + 1} / {cards.length}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNextCard}
                disabled={!canGoNext}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur border border-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Desktop Customize Panel - Absolute positioning */}
        {showCustomizePanel && (
          <div className="absolute top-0 right-0 h-full w-80 z-30">
            <ProgressiveCustomizePanel
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
              onToggleFullscreen={toggleFullscreen}
              onDownload={handleDownloadClick}
              onShare={handleShareClick}
              onClose={() => {
                if (onClose) {
                  onClose();
                } else {
                  setShowCustomizePanel(false);
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
            isFlipped={isFlipped}
            rotation={rotation}
            zoom={zoom}
            isDragging={isDragging}
            frameStyles={getFrameStyles()}
            enhancedEffectStyles={getEnhancedEffectStyles()}
            SurfaceTexture={SurfaceTextureComponent}
            onMouseDown={handleDragStart}
            onMouseMove={handleDrag}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={() => setIsFlipped(!isFlipped)}
            onZoom={handleMobileZoom}
            onRotationChange={handleRotationChange}
            onDoubleTap={handleMobileDoubleTap}
            onLongPress={handleMobileLongPress}
            onSwipeLeft={handleMobileSwipeLeft}
            onSwipeRight={handleMobileSwipeRight}
            onReset={handleMobileReset}
          />
        </div>

        {/* Configuration Details Panel - Fixed positioning */}
        {!showCustomizePanel && (
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

        {/* Info Panel - Fixed positioning */}
        {showStats && !isFlipped && !showCustomizePanel && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 max-w-2xl">
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
      </div>

      {/* Export Options Dialog */}
      <ExportOptionsDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        cardTitle={card.title}
        cardElementRef={cardContainerRef}
      />

      {/* Gesture Help Overlay */}
      <GestureHelpOverlay
        isVisible={showGestureHelp}
        onClose={() => setShowGestureHelp(false)}
      />
    </EffectProvider>
  );
};

const presets = [
  {
    name: 'Crystal Prism',
    description: 'Translucent crystalline finish',
    effects: {
      crystal: { intensity: 85, facets: 12, dispersion: 75, clarity: 80, sparkle: true }
    }
  },
  {
    name: 'Chrome Mirror',
    description: 'Polished metallic chrome',
    effects: {
      chrome: { intensity: 75, sharpness: 85, distortion: 5, highlightSize: 45, polish: 90 }
    }
  },
  {
    name: 'Brushed Steel',
    description: 'Industrial brushed metal',
    effects: {
      brushedmetal: { intensity: 70, direction: 45, grainDensity: 12, metallic: 85, roughness: 25 }
    }
  },
  {
    name: 'Vintage Classic',
    description: 'Aged cardboard patina',
    effects: {
      vintage: { intensity: 55, aging: 65, patina: '#8b7355', wear: 45, scratches: true }
    }
  },
  {
    name: 'Holographic Premium',
    description: 'Rainbow holographic effect',
    effects: {
      holographic: { intensity: 70, shiftSpeed: 100, rainbowSpread: 180, prismaticDepth: 50, animated: true }
    }
  },
  {
    name: 'Gold Luxury',
    description: 'Luxurious gold plating',
    effects: {
      gold: { intensity: 85, shimmerSpeed: 120, platingThickness: 7, goldTone: 'rich', reflectivity: 90, colorEnhancement: true }
    }
  }
];
