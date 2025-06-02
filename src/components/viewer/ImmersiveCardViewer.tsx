
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ImmersiveCardViewerProps, EnvironmentScene, LightingPreset, VisualEffect, MaterialSettings } from './types';
import { ENVIRONMENT_SCENES, LIGHTING_PRESETS, VISUAL_EFFECTS } from './constants';
import { useCardEffects } from './hooks/useCardEffects';
import { ViewerControls } from './components/ViewerControls';
import { CustomizePanel } from './components/CustomizePanel';
import { CardContainer } from './components/CardContainer';

export const ImmersiveCardViewer: React.FC<ImmersiveCardViewerProps> = ({
  card,
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
  const [showCustomizePanel, setShowCustomizePanel] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  
  // Advanced settings
  const [selectedScene, setSelectedScene] = useState<EnvironmentScene>(ENVIRONMENT_SCENES[3]); // Twilight
  const [selectedLighting, setSelectedLighting] = useState<LightingPreset>(LIGHTING_PRESETS[0]);
  const [selectedEffect, setSelectedEffect] = useState<VisualEffect>(VISUAL_EFFECTS[0]);
  const [effectIntensity, setEffectIntensity] = useState([70]);
  const [overallBrightness, setOverallBrightness] = useState([120]);
  const [interactiveLighting, setInteractiveLighting] = useState(true);
  
  // Material properties
  const [materialSettings, setMaterialSettings] = useState<MaterialSettings>({
    roughness: 0.30,
    metalness: 0.60,
    clearcoat: 0.75,
    reflectivity: 0.50
  });
  
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  // Custom hooks
  const { getFrameStyles, getPhysicalEffectStyles, SurfaceTexture } = useCardEffects({
    card,
    selectedEffect,
    mousePosition,
    showEffects,
    effectIntensity,
    overallBrightness,
    interactiveLighting
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

  // Handle mouse movement for effects
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePosition({ x, y });
      
      if (allowRotation && !autoRotate) {
        setRotation({
          x: (y - 0.5) * 20,
          y: (x - 0.5) * -20
        });
      }
    }
  }, [isDragging, allowRotation, autoRotate]);

  // Handle drag start
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (allowRotation) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - rotation.y, y: e.clientY - rotation.x });
      setAutoRotate(false);
    }
  }, [rotation, allowRotation]);

  // Handle drag
  const handleDrag = useCallback((e: React.MouseEvent) => {
    if (isDragging && allowRotation) {
      setRotation({
        x: e.clientY - dragStart.y,
        y: e.clientX - dragStart.x
      });
    }
  }, [isDragging, dragStart, allowRotation]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Reset view
  const handleReset = useCallback(() => {
    setRotation({ x: 0, y: 0 });
    setZoom(1);
    setIsFlipped(false);
    setAutoRotate(false);
  }, []);

  // Handle zoom
  const handleZoom = useCallback((delta: number) => {
    setZoom(prev => Math.max(0.5, Math.min(2, prev + delta)));
  }, []);

  // Toggle fullscreen
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
    <div 
      ref={containerRef}
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        isFullscreen ? 'p-0' : 'p-8'
      } ${showCustomizePanel ? 'pr-80' : ''}`}
      style={{
        background: `linear-gradient(135deg, 
          rgba(0,0,0,0.95) 0%, 
          rgba(20,20,30,0.95) 25%, 
          rgba(10,10,20,0.95) 50%, 
          rgba(30,20,40,0.95) 75%, 
          rgba(0,0,0,0.95) 100%)`
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
    >
      {/* Enhanced Dark Overlay */}
      <div className="absolute inset-0 bg-black/80" />

      {/* Subtle Ambient Background Effect */}
      {ambient && (
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
              ${selectedScene.lighting.color} 0%, transparent 30%)`
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
            <span className="text-white text-sm">Customize</span>
          </Button>
        </div>
      )}

      {/* Basic Controls */}
      <ViewerControls
        showEffects={showEffects}
        autoRotate={autoRotate}
        onToggleEffects={() => setShowEffects(!showEffects)}
        onToggleAutoRotate={() => setAutoRotate(!autoRotate)}
        onReset={handleReset}
        onZoomIn={() => handleZoom(0.1)}
        onZoomOut={() => handleZoom(-0.1)}
      />

      {/* Full Height Customize Panel */}
      {showCustomizePanel && (
        <CustomizePanel
          selectedScene={selectedScene}
          selectedLighting={selectedLighting}
          selectedEffect={selectedEffect}
          effectIntensity={effectIntensity}
          overallBrightness={overallBrightness}
          interactiveLighting={interactiveLighting}
          materialSettings={materialSettings}
          isFullscreen={isFullscreen}
          onSceneChange={setSelectedScene}
          onLightingChange={setSelectedLighting}
          onEffectChange={setSelectedEffect}
          onEffectIntensityChange={setEffectIntensity}
          onBrightnessChange={setOverallBrightness}
          onInteractiveLightingToggle={() => setInteractiveLighting(!interactiveLighting)}
          onMaterialSettingsChange={setMaterialSettings}
          onToggleFullscreen={toggleFullscreen}
          onDownload={onDownload}
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
      <CardContainer
        card={card}
        isFlipped={isFlipped}
        isHovering={isHovering}
        showEffects={showEffects}
        effectIntensity={effectIntensity}
        mousePosition={mousePosition}
        rotation={rotation}
        zoom={zoom}
        isDragging={isDragging}
        frameStyles={getFrameStyles()}
        physicalEffectStyles={getPhysicalEffectStyles()}
        SurfaceTexture={SurfaceTexture}
        onMouseDown={handleDragStart}
        onMouseMove={handleDrag}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={() => setIsFlipped(!isFlipped)}
      />

      {/* Info Panel - Enhanced visibility */}
      {showStats && !isFlipped && !showCustomizePanel && (
        <div className="absolute bottom-4 left-4 right-4 max-w-2xl mx-auto z-10">
          <div className="bg-black bg-opacity-80 backdrop-blur-lg rounded-lg p-4 border border-white/10">
            <div className="flex items-center justify-between text-white">
              <div className="flex space-x-4 text-sm">
                <span>Click card to flip</span>
                <span>•</span>
                <span>Drag to rotate manually</span>
                <span>•</span>
                <span>Move mouse for effects</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">
                  Scene: {selectedScene.name} | Effect: {selectedEffect.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
