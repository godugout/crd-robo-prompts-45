import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ImmersiveCardViewerProps, EnvironmentScene, LightingPreset, MaterialSettings } from './types';
import { ENVIRONMENT_SCENES, LIGHTING_PRESETS } from './constants';
import { useFreemiumEffects } from './hooks/useFreemiumEffects';
import { useCardEffects } from './hooks/useCardEffects';
import { useDynamicCardBackMaterials } from './hooks/useDynamicCardBackMaterials';
import { ViewerControls } from './components/ViewerControls';
import { FreemiumCustomizePanel } from './components/FreemiumCustomizePanel';
import { EnhancedCardContainer } from './components/EnhancedCardContainer';
import { useCardExport } from './hooks/useCardExport';
import { ExportOptionsDialog } from './components/ExportOptionsDialog';
import { ConfigurationDetailsPanel } from './components/ConfigurationDetailsPanel';
import { Badge, X } from '@/components/ui/badge';

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
    
    // If upgraded to Pro or Baller, show enhanced panel
    if (newTier === 'pro' || newTier === 'baller') {
      setShowEnhancedPanel(true);
      setShowCustomizePanel(false);
    }
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

  if (!isOpen) return null;

  return (
    <>
      <div 
        ref={containerRef}
        className={`fixed inset-0 z-50 flex items-center justify-center ${
          isFullscreen ? 'p-0' : 'p-8'
        } ${(showCustomizePanel || showEnhancedPanel) ? 'pr-80' : ''}`}
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

        {/* Settings Panel Toggle Button */}
        {!showCustomizePanel && !showEnhancedPanel && (
          <div className="absolute top-4 right-4 z-10">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => userTier === 'rookie' ? setShowCustomizePanel(true) : setShowEnhancedPanel(true)}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur border border-white/20"
            >
              <Sparkles className="w-4 h-4 text-white mr-2" />
              <span className="text-white text-sm">
                {userTier === 'rookie' ? 'Open Styles' : 'Open Studio'}
              </span>
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

        {/* Conditional Panel Rendering */}
        {showCustomizePanel && userTier === 'rookie' && (
          <FreemiumCustomizePanel
            availablePresets={availablePresets}
            selectedPresetId={selectedPresetId}
            onPresetSelect={selectPreset}
            userTier={userTier}
            canAccessPreset={canAccessPreset}
            onClose={() => setShowCustomizePanel(false)}
            onTierChange={handleTierUpgrade}
          />
        )}

        {/* Enhanced Studio Panel for Pro/Baller Users */}
        {showEnhancedPanel && (userTier === 'pro' || userTier === 'baller') && (
          <div className="fixed top-0 right-0 h-full w-80 bg-black bg-opacity-95 backdrop-blur-lg border-l border-white/10 overflow-hidden z-50">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-semibold text-white">Enhanced Studio</h2>
                <Badge 
                  className="text-xs"
                  style={{ backgroundColor: userTier === 'pro' ? '#3B82F6' : '#F59E0B' }}
                >
                  {userTier === 'pro' ? '⚡ Pro' : '👑 Baller'}
                </Badge>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowEnhancedPanel(false)}>
                <X className="h-5 w-5 text-white" />
              </Button>
            </div>
            <div className="p-4 text-white">
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🎉</div>
                <h3 className="text-xl font-bold mb-2">Studio Unlocked!</h3>
                <p className="text-gray-300 text-sm mb-4">
                  You now have access to advanced controls, unlimited exports, and premium effects.
                </p>
                <div className="space-y-2 text-sm text-gray-300">
                  <div>✨ All premium presets</div>
                  <div>🎛️ Advanced sliders</div>
                  <div>🌅 Environment controls</div>
                  <div>💎 Unlimited exports</div>
                  {userTier === 'baller' && <div>🏆 4K quality</div>}
                </div>
              </div>
            </div>
          </div>
        )}

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

        {/* Configuration Details Panel */}
        {!showCustomizePanel && (
          <ConfigurationDetailsPanel
            effectValues={currentEffects}
            selectedScene={selectedScene}
            selectedLighting={selectedLighting}
            materialSettings={materialSettings}
            overallBrightness={overallBrightness}
          />
        )}

        {/* Info Panel */}
        {showStats && !isFlipped && !showCustomizePanel && !showEnhancedPanel && (
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
                    {userTier === 'rookie' ? '🌟 Rookie' : userTier === 'pro' ? '⚡ Pro' : '👑 Baller'} | {selectedMaterial?.name || 'Default'}
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
