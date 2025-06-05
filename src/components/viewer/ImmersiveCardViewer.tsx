import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ImmersiveCardViewerProps, EnvironmentScene, LightingPreset, MaterialSettings } from './types';
import { ENVIRONMENT_SCENES, LIGHTING_PRESETS } from './constants';
import { 
  useEnhancedCardEffects, 
  ENHANCED_VISUAL_EFFECTS,
  type EffectValues 
} from './hooks/useEnhancedCardEffects';
import { useCardEffects } from './hooks/useCardEffects';
import { ViewerControls } from './components/ViewerControls';
import { ProgressiveCustomizePanel } from './components/ProgressiveCustomizePanel';
import { EnhancedCardContainer } from './components/EnhancedCardContainer';
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
  
  // Enhanced effects state
  const enhancedEffectsHook = useEnhancedCardEffects();
  const {
    effectValues,
    handleEffectChange,
    resetEffect,
    resetAllEffects
  } = enhancedEffectsHook;
  
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
    onEffectChange: handleEffectChange,
    effectValues
  });

  const handleRotationChange = useCallback((newRotation: { x: number; y: number }) => {
    setRotation(newRotation);
  }, []);

  // Update the existing download handler to open export dialog
  const handleDownloadClick = useCallback(() => {
    setShowExportDialog(true);
  }, []);

  // Add state for progressive panel
  const [useProgressivePanel, setUseProgressivePanel] = useState(true);

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

        {/* Settings Panel Toggle Button - Updated text */}
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

        {/* Basic Controls with hover visibility */}
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

        {/* Enhanced Card Container - Add ref */}
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

        {/* Info Panel - Enhanced visibility */}
        {showStats && !isFlipped && !showCustomizePanel && (
          <div className="absolute bottom-4 left-4 right-4 max-w-2xl mx-auto z-10" style={{ marginRight: hasMultipleCards ? '180px' : '20px' }}>
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
                    Enhanced Studio | Scene: {selectedScene.name}
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
        onExport={exportCard}
        isExporting={isExporting}
        exportProgress={exportProgress}
        cardTitle={card.title}
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
