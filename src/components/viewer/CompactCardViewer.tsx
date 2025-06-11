
import React, { useState, useCallback } from 'react';
import { useEnhancedCardEffects } from './hooks/useEnhancedCardEffects';
import { useEnhancedCardInteraction } from './hooks/useEnhancedCardInteraction';
import { EnhancedCardCanvas } from './components/EnhancedCardCanvas';
import type { CardData } from '@/hooks/useCardEditor';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from './types';
import { ENVIRONMENT_SCENES, LIGHTING_PRESETS } from './constants';
import { Button } from '@/components/ui/button';
import { Maximize2, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';

interface CompactCardViewerProps {
  card: CardData;
  onFullscreen?: () => void;
  width?: number;
  height?: number;
}

export const CompactCardViewer: React.FC<CompactCardViewerProps> = ({
  card,
  onFullscreen,
  width = 400,
  height = 560
}) => {
  // Use simple default settings for compact view
  const [selectedScene] = useState<EnvironmentScene>(ENVIRONMENT_SCENES[0]); // Studio
  const [selectedLighting] = useState<LightingPreset>(LIGHTING_PRESETS[0]); // Natural
  const [overallBrightness] = useState<number[]>([100]);
  const [interactiveLighting] = useState(true);
  const [zoom, setZoom] = useState(1);

  // Material properties - Fixed to include transmission
  const [materialSettings] = useState<MaterialSettings>({
    metalness: 0.5,
    roughness: 0.5,
    reflectivity: 0.5,
    clearcoat: 0.3,
    transmission: 0.0
  });

  // Enhanced effects system - using defaults
  const {
    effectValues,
    resetAllEffects
  } = useEnhancedCardEffects();

  // Interactive card behavior
  const {
    mousePosition,
    isHovering,
    rotation,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
    resetRotation
  } = useEnhancedCardInteraction();

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 0.2, 2));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  }, []);

  const handleReset = useCallback(() => {
    resetRotation();
    setZoom(1);
    resetAllEffects();
  }, [resetRotation, resetAllEffects]);

  return (
    <div className="relative w-full h-full bg-editor-dark rounded-lg overflow-hidden">
      {/* 3D Card Canvas */}
      <div className="absolute inset-0">
        <EnhancedCardCanvas
          card={card}
          effectValues={effectValues}
          mousePosition={mousePosition}
          isHovering={isHovering}
          rotation={rotation}
          selectedScene={selectedScene}
          selectedLighting={selectedLighting}
          overallBrightness={overallBrightness[0]}
          interactiveLighting={interactiveLighting}
          materialSettings={materialSettings}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          width={width}
          height={height}
        />
      </div>

      {/* Compact Controls Overlay */}
      <div className="absolute top-4 right-4 z-40">
        <div className="flex flex-col gap-2 bg-black/60 backdrop-blur-sm rounded-lg p-2">
          {onFullscreen && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onFullscreen}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
              title="Fullscreen View"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            className="text-white hover:bg-white/20 h-8 w-8 p-0"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            className="text-white hover:bg-white/20 h-8 w-8 p-0"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-white hover:bg-white/20 h-8 w-8 p-0"
            title="Reset View"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Quick interaction hint */}
      <div className="absolute bottom-4 left-4 z-40">
        <div className="bg-black/60 backdrop-blur-sm rounded px-3 py-1">
          <p className="text-white/80 text-xs">Click and drag to rotate • Scroll to zoom</p>
        </div>
      </div>
    </div>
  );
};
