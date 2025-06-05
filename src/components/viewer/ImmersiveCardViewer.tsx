
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import type { ImmersiveCardViewerProps, EnvironmentScene, LightingPreset, MaterialSettings } from './types';
import { ENVIRONMENT_SCENES, LIGHTING_PRESETS } from './constants';
import { 
  useEnhancedCardEffects, 
  ENHANCED_VISUAL_EFFECTS,
  type EffectValues 
} from './hooks/useEnhancedCardEffects';
import { useCardEffects } from './hooks/useCardEffects';
import { useDynamicCardBackMaterials } from './hooks/useDynamicCardBackMaterials';
import { useEnhancedMobileGestures } from './hooks/gestures/useEnhancedMobileGestures';
import { ViewerControls } from './components/ViewerControls';
import { MobileViewerControls } from './components/MobileViewerControls';
import { ProgressiveCustomizePanel } from './components/ProgressiveCustomizePanel';
import { MobileStudioDrawer } from './components/MobileStudioDrawer';
import { EnhancedCardContainer } from './components/EnhancedCardContainer';
import { ExportOptionsDialog } from './components/ExportOptionsDialog';
import { ConfigurationDetailsPanel } from './components/ConfigurationDetailsPanel';
import { GestureHelpOverlay } from './components/GestureHelpOverlay';
import { MobileCardLayout } from './components/MobileCardLayout';
import { MobileBottomControlBar } from './components/MobileBottomControlBar';
import { MobileInfoPanel } from './components/MobileInfoPanel';
import { MobileCardViewer } from './components/MobileCardViewer';

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

  // Enhanced mobile gesture handlers using the new hook
  const handleEnhancedPinchZoom = useCallback((scale: number, center: { x: number; y: number }) => {
    setZoom(prev => Math.max(0.5, Math.min(3, prev * scale)));
  }, []);

  const handleEnhancedPan = useCallback((delta: { x: number; y: number }, velocity: { x: number; y: number }) => {
    if (allowRotation) {
      const sensitivity = 0.5;
      setRotation(prev => ({
        x: Math.max(-45, Math.min(45, prev.x + delta.y * sensitivity)),
        y: prev.y - delta.x * sensitivity
      }));
    }
  }, [allowRotation]);

  const handleEnhancedRotate = useCallback((angle: number) => {
    if (allowRotation) {
      setRotation(prev => ({
        x: prev.x,
        y: prev.y + angle * 0.5
      }));
    }
  }, [allowRotation]);

  const handleEnhancedTap = useCallback(() => {
    setIsFlipped(!isFlipped);
  }, [isFlipped]);

  const handleEnhancedDoubleTap = useCallback(() => {
    if (zoom <= 1) {
      setZoom(1.8);
    } else {
      setZoom(1);
      setRotation({ x: 0, y: 0 });
    }
  }, [zoom]);

  const handleEnhancedLongPress = useCallback(() => {
    setAutoRotate(!autoRotate);
    if ('vibrate' in navigator) {
      navigator.vibrate(100);
    }
  }, [autoRotate]);

  const handleEnhancedSwipeLeft = useCallback(() => {
    handleNextCard();
  }, [handleNextCard]);

  const handleEnhancedSwipeRight = useCallback(() => {
    handlePreviousCard();
  }, [handlePreviousCard]);

  const handleEnhancedThreeFingerTap = useCallback(() => {
    handleMobileReset();
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
  }, [handleMobileReset]);

  // Use the enhanced gesture hook for mobile
  const { touchHandlers, isActive } = isMobile ? useEnhancedMobileGestures({
    onPinchZoom: handleEnhancedPinchZoom,
    onPan: handleEnhancedPan,
    onRotate: handleEnhancedRotate,
    onTap: handleEnhancedTap,
    onDoubleTap: handleEnhancedDoubleTap,
    onLongPress: handleEnhancedLongPress,
    onSwipeLeft: handleEnhancedSwipeLeft,
    onSwipeRight: handleEnhancedSwipeRight,
    onThreeFingerTap: handleEnhancedThreeFingerTap,
  }) : { touchHandlers: {}, isActive: false };

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
          onReset={handleMobileReset}
          onZoomIn={() => handleMobileZoom(0.2)}
          onZoomOut={() => handleMobileZoom(-0.2)}
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
          onToggleFullscreen={toggleFullscreen}
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

  // Desktop Layout (unchanged)
  return (
    <>
      <div 
        ref={containerRef}
        className={`fixed inset-0 z-50 flex items-center justify-center ${
          isFullscreen ? 'p-0' : 'p-8'
        } ${showCustomizePanel && !isMobile ? 'pr-80' : ''}`}
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

        {/* Settings Panel Toggle Button - Updated for mobile */}
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
            onReset={handleReset}
            onZoomIn={() => handleZoom(0.1)}
            onZoomOut={() => handleZoom(-0.1)}
          />
        </div>

        {/* Card Navigation Controls */}
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
        )}

        {/* Enhanced Card Container - Add mobile gesture support */}
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
            interactiveLighting={interactiveLighting}
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

        {/* Info Panel - Enhanced visibility */}
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
    </>
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
