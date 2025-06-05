
import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { ImmersiveCardViewerProps, EnvironmentScene, LightingPreset, MaterialSettings } from './types';
import { ENVIRONMENT_SCENES, LIGHTING_PRESETS } from './constants';
import { useFreemiumEffects } from './hooks/useFreemiumEffects';
import { useCardEffects } from './hooks/useCardEffects';
import { useDynamicCardBackMaterials } from './hooks/useDynamicCardBackMaterials';
import { FreemiumCustomizePanel } from './components/FreemiumCustomizePanel';
import { EnhancedStudioPanel } from './components/EnhancedStudioPanel';
import { EnhancedCardContainer } from './components/EnhancedCardContainer';
import { WelcomeToast } from './components/WelcomeToast';
import { useCardExport } from './hooks/useCardExport';
import { ExportOptionsDialog } from './components/ExportOptionsDialog';
import { ViewerLayout } from './components/ViewerLayout';
import { ViewerBackground } from './components/ViewerBackground';
import { ViewerHeader } from './components/ViewerHeader';
import { ViewerBottomControls } from './components/ViewerBottomControls';
import { ViewerInfoPanel } from './components/ViewerInfoPanel';

// Update the interface to support card navigation
interface ExtendedImmersiveCardViewerProps extends ImmersiveCardViewerProps {
  cards?: any[];
  currentCardIndex?: number;
  onCardChange?: (index: number) => void;
  isPremiumUser?: boolean;
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
  ambient = true,
  isPremiumUser = false
}) => {
  // Add tier state management
  const [userTier, setUserTier] = useState<'rookie' | 'pro' | 'baller'>('rookie');
  const [showEnhancedPanel, setShowEnhancedPanel] = useState(false);
  const [showWelcomeToast, setShowWelcomeToast] = useState(false);

  // Update freemium hook to use tier system
  const freemiumHook = useFreemiumEffects(userTier !== 'rookie');
  const {
    selectedPresetId,
    currentEffects,
    availablePresets,
    canAccessPreset,
    selectPreset
  } = freemiumHook;

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
  const [showCustomizePanel, setShowCustomizePanel] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [isHoveringControls, setIsHoveringControls] = useState(false);
  
  // Get dynamic material based on current effects
  const { selectedMaterial } = useDynamicCardBackMaterials(currentEffects);
  
  // Simplified settings for freemium mode
  const [selectedScene, setSelectedScene] = useState<EnvironmentScene>(ENVIRONMENT_SCENES[0]);
  const [selectedLighting, setSelectedLighting] = useState<LightingPreset>(LIGHTING_PRESETS[0]);
  const [overallBrightness, setOverallBrightness] = useState([100]);
  
  const [materialSettings, setMaterialSettings] = useState<MaterialSettings>({
    roughness: 0.40,
    metalness: 0.45,
    clearcoat: 0.60,
    reflectivity: 0.40
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
      setIsFlipped(false);
    }
  }, [canGoPrev, currentCardIndex, onCardChange]);

  const handleNextCard = useCallback(() => {
    if (canGoNext && onCardChange) {
      onCardChange(currentCardIndex + 1);
      setIsFlipped(false);
    }
  }, [canGoNext, currentCardIndex, onCardChange]);

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

  // Add new state for export dialog
  const [showExportDialog, setShowExportDialog] = useState(false);

  // Add export functionality
  const { exportCard, isExporting, exportProgress } = useCardExport({
    cardRef: cardContainerRef,
    card,
    onRotationChange: setRotation,
    onEffectChange: () => {}, // Disabled for freemium mode
    effectValues: currentEffects
  });

  const handleDownloadClick = useCallback(() => {
    setShowExportDialog(true);
  }, []);

  const handleShareClick = useCallback(() => {
    if (onShare) {
      onShare(card);
    }
  }, [onShare, card]);

  const handleUpgrade = useCallback(() => {
    console.log('🚀 Upgrade flow triggered');
    // TODO: Implement upgrade modal/flow
  }, []);

  const handleTierUpgrade = useCallback((newTier: 'rookie' | 'pro' | 'baller') => {
    setUserTier(newTier);
    console.log(`🚀 User upgraded to ${newTier}!`);
    
    // Immediately show enhanced panel and welcome toast
    if (newTier === 'pro' || newTier === 'baller') {
      setShowEnhancedPanel(true);
      setShowCustomizePanel(false);
      setShowWelcomeToast(true);
    }
  }, []);

  // Enhanced panel handlers for advanced controls
  const handleEffectChange = useCallback((effectId: string, parameterId: string, value: number | boolean | string) => {
    console.log(`🎛️ Effect change: ${effectId}.${parameterId} = ${value}`);
    // TODO: Implement actual effect changes when enhanced effects hook is available
  }, []);

  const handleSceneChange = useCallback((scene: EnvironmentScene) => {
    setSelectedScene(scene);
  }, []);

  const handleLightingChange = useCallback((lighting: LightingPreset) => {
    setSelectedLighting(lighting);
  }, []);

  const handleMaterialChange = useCallback((settings: MaterialSettings) => {
    setMaterialSettings(settings);
  }, []);

  // Style generation hook with static effects
  const { getFrameStyles, getEnhancedEffectStyles, getEnvironmentStyle, SurfaceTexture } = useCardEffects({
    card,
    effectValues: currentEffects, // Use static freemium effects
    mousePosition,
    showEffects,
    overallBrightness,
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
    if (!isDragging && containerRef.current) {
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
  }, [isDragging, allowRotation, autoRotate]);

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

  // Calculate dynamic margin based on panel state
  const panelWidth = (showCustomizePanel || showEnhancedPanel) ? 420 : 0;

  const handleOpenPanel = () => {
    if (userTier === 'rookie') {
      setShowCustomizePanel(true);
    } else {
      setShowEnhancedPanel(true);
    }
  };

  return (
    <>
      <ViewerLayout
        isOpen={isOpen}
        isFullscreen={isFullscreen}
        panelWidth={panelWidth}
        getEnvironmentStyle={getEnvironmentStyle}
        onMouseMove={handleMouseMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      >
        <div ref={containerRef}>
          <ViewerBackground
            selectedScene={selectedScene}
            mousePosition={mousePosition}
            ambient={ambient}
            getEnvironmentStyle={getEnvironmentStyle}
          />

          <ViewerHeader
            showCustomizePanel={showCustomizePanel}
            showEnhancedPanel={showEnhancedPanel}
            userTier={userTier}
            onOpenPanel={handleOpenPanel}
          />

          <ViewerBottomControls
            panelWidth={panelWidth}
            showEffects={showEffects}
            autoRotate={autoRotate}
            hasMultipleCards={hasMultipleCards}
            currentCardIndex={currentCardIndex}
            totalCards={cards.length}
            canGoPrev={canGoPrev}
            canGoNext={canGoNext}
            effectValues={currentEffects}
            selectedScene={selectedScene}
            selectedLighting={selectedLighting}
            materialSettings={materialSettings}
            overallBrightness={overallBrightness}
            onToggleEffects={() => setShowEffects(!showEffects)}
            onToggleAutoRotate={() => setAutoRotate(!autoRotate)}
            onReset={handleReset}
            onZoomIn={() => handleZoom(0.1)}
            onZoomOut={() => handleZoom(-0.1)}
            onPreviousCard={handlePreviousCard}
            onNextCard={handleNextCard}
          />

          {/* Enhanced Card Container */}
          <div ref={cardContainerRef}>
            <EnhancedCardContainer
              card={card}
              isFlipped={isFlipped}
              isHovering={isHovering}
              showEffects={showEffects}
              effectValues={currentEffects}
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

          <ViewerInfoPanel
            showStats={showStats}
            isFlipped={isFlipped}
            showCustomizePanel={showCustomizePanel}
            showEnhancedPanel={showEnhancedPanel}
            panelWidth={panelWidth}
            hasMultipleCards={hasMultipleCards}
            userTier={userTier}
            selectedMaterialName={selectedMaterial?.name}
          />
        </div>
      </ViewerLayout>

      {/* Freemium Customize Panel */}
      {showCustomizePanel && userTier === 'rookie' && (
        <FreemiumCustomizePanel
          selectedPresetId={selectedPresetId}
          availablePresets={availablePresets}
          onPresetSelect={selectPreset}
          canAccessPreset={canAccessPreset}
          userTier={userTier}
          onClose={() => setShowCustomizePanel(false)}
          onTierChange={handleTierUpgrade}
        />
      )}

      {/* Enhanced Studio Panel */}
      {showEnhancedPanel && userTier !== 'rookie' && (
        <EnhancedStudioPanel
          userTier={userTier}
          effectValues={currentEffects}
          selectedScene={selectedScene}
          selectedLighting={selectedLighting}
          materialSettings={materialSettings}
          overallBrightness={overallBrightness}
          onClose={() => setShowEnhancedPanel(false)}
          onEffectChange={handleEffectChange}
          onSceneChange={handleSceneChange}
          onLightingChange={handleLightingChange}
          onMaterialSettingsChange={handleMaterialChange}
          onBrightnessChange={setOverallBrightness}
          onDownload={handleDownloadClick}
          onShare={handleShareClick}
        />
      )}

      {/* Welcome Toast for New Premium Users */}
      <WelcomeToast
        isVisible={showWelcomeToast}
        userTier={userTier}
        onDismiss={() => setShowWelcomeToast(false)}
      />

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
