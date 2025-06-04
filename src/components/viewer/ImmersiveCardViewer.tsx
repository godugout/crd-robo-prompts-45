
import React, { useState, useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ImmersiveCardViewerProps, EnvironmentScene, LightingPreset, MaterialSettings } from './types';
import { ENVIRONMENT_SCENES, LIGHTING_PRESETS } from './constants';
import { 
  useEnhancedCardEffects, 
  type EffectValues 
} from './hooks/useEnhancedCardEffects';
import { useCardEffects } from './hooks/useCardEffects';
import { useViewerState } from './hooks/useViewerState';
import { useCardNavigation } from './hooks/useCardNavigation';
import { useMouseInteraction } from './hooks/useMouseInteraction';
import { ViewerControls } from './components/ViewerControls';
import { ProgressiveCustomizePanel } from './components/ProgressiveCustomizePanel';
import { EnhancedCardContainer } from './components/EnhancedCardContainer';
import { CardNavigationControls } from './components/CardNavigationControls';
import { InfoPanel } from './components/InfoPanel';
import { useCardExport } from './hooks/useCardExport';
import { ExportOptionsDialog } from './components/ExportOptionsDialog';

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
  // Use custom hooks for state management
  const viewerState = useViewerState();
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
    showCustomizePanel,
    isHovering,
    isHoveringControls,
    showExportDialog,
    containerRef,
    cardContainerRef,
    setRotation,
    setIsDragging,
    setDragStart,
    setZoom,
    setIsFlipped,
    setAutoRotate,
    setShowEffects,
    setMousePosition,
    setShowCustomizePanel,
    setIsHovering,
    setIsHoveringControls,
    setShowExportDialog,
    handleRotationChange,
    handleReset,
    handleZoom,
    toggleFullscreen
  } = viewerState;

  // Enhanced effects state
  const enhancedEffectsHook = useEnhancedCardEffects();
  const {
    effectValues,
    handleEffectChange,
    resetEffect,
    resetAllEffects
  } = enhancedEffectsHook;
  
  // Advanced settings - Updated for more professional defaults
  const [selectedScene, setSelectedScene] = useState<EnvironmentScene>(ENVIRONMENT_SCENES[0]);
  const [selectedLighting, setSelectedLighting] = useState<LightingPreset>(LIGHTING_PRESETS[0]);
  const [overallBrightness, setOverallBrightness] = useState([100]);
  const [interactiveLighting, setInteractiveLighting] = useState(true);
  
  // Material properties - More balanced defaults
  const [materialSettings, setMaterialSettings] = useState<MaterialSettings>({
    roughness: 0.40,
    metalness: 0.45,
    clearcoat: 0.60,
    reflectivity: 0.40
  });

  const animationRef = useRef<number>();

  // Card navigation hook
  const cardNavigation = useCardNavigation({
    cards,
    currentCardIndex,
    onCardChange,
    setIsFlipped
  });

  // Mouse interaction hook
  const mouseInteraction = useMouseInteraction({
    containerRef,
    isDragging,
    rotation,
    allowRotation,
    autoRotate,
    setMousePosition,
    setIsHoveringControls,
    setRotation,
    setIsDragging,
    setDragStart,
    setZoom
  });

  // Add export functionality
  const { exportCard, isExporting, exportProgress } = useCardExport({
    cardRef: cardContainerRef,
    card,
    onRotationChange: setRotation,
    onEffectChange: handleEffectChange,
    effectValues
  });

  // Update the existing download handler to open export dialog
  const handleDownloadClick = () => {
    setShowExportDialog(true);
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
  }, [autoRotate, isDragging, setRotation]);

  if (!isOpen) return null;

  return (
    <>
      <div 
        ref={containerRef}
        className={`fixed inset-0 z-50 flex items-center justify-center ${
          isFullscreen ? 'p-0' : 'p-8'
        } ${showCustomizePanel ? 'pr-80' : ''}`}
        style={{
          ...getEnvironmentStyle(),
        }}
        onMouseMove={mouseInteraction.handleMouseMove}
        onMouseUp={mouseInteraction.handleDragEnd}
        onMouseLeave={mouseInteraction.handleDragEnd}
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

        {/* Basic Controls */}
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
        <CardNavigationControls
          hasMultipleCards={cardNavigation.hasMultipleCards}
          canGoPrev={cardNavigation.canGoPrev}
          canGoNext={cardNavigation.canGoNext}
          currentCardIndex={currentCardIndex}
          totalCards={cards.length}
          onPreviousCard={cardNavigation.handlePreviousCard}
          onNextCard={cardNavigation.handleNextCard}
        />

        {/* Progressive Disclosure Customize Panel */}
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
            onEffectChange={handleEffectChange}
            onResetAllEffects={resetAllEffects}
            onBrightnessChange={setOverallBrightness}
            onInteractiveLightingToggle={() => setInteractiveLighting(!interactiveLighting)}
            onMaterialSettingsChange={setMaterialSettings}
            onToggleFullscreen={toggleFullscreen}
            onDownload={handleDownloadClick}
            onShare={onShare}
            onClose={() => {
              if (onClose) {
                onClose();
              } else {
                setShowCustomizePanel(false);
              }
            }}
            card={card}
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
            frameStyles={getFrameStyles()}
            enhancedEffectStyles={getEnhancedEffectStyles()}
            SurfaceTexture={SurfaceTexture}
            onMouseDown={mouseInteraction.handleDragStart}
            onMouseMove={mouseInteraction.handleDrag}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={() => setIsFlipped(!isFlipped)}
          />
        </div>

        {/* Info Panel */}
        <InfoPanel
          showStats={showStats}
          isFlipped={isFlipped}
          showCustomizePanel={showCustomizePanel}
          hasMultipleCards={cardNavigation.hasMultipleCards}
          selectedScene={selectedScene}
        />
      </div>

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
