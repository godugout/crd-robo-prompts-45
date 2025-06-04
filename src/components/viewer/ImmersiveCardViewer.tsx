import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCw, Download, Settings, Camera, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import type { CardData } from '@/hooks/useCardEditor';
import { CardContainer } from './components/CardContainer';
import { CustomizePanel } from './components/CustomizePanel';
import { ViewerControls } from './components/ViewerControls';
import { ExportOptionsDialog } from './components/ExportOptionsDialog';
import { useCardEffects } from './hooks/useCardEffects';
import { useEnhancedCardEffects } from './hooks/useEnhancedCardEffects';
import { useEnhancedCardInteraction } from './hooks/useEnhancedCardInteraction';
import { useCardExport } from './hooks/useCardExport';
import { ENVIRONMENT_SCENES, LIGHTING_PRESETS, DEFAULT_MATERIAL_SETTINGS } from './constants';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from './types';
import { CardFront } from './components/CardFront';

interface ImmersiveCardViewerProps {
  card: CardData;
  onClose?: () => void;
  onEdit?: () => void;
}

export const ImmersiveCardViewer: React.FC<ImmersiveCardViewerProps> = ({
  card,
  onClose,
  onEdit
}) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isFlipped, setIsFlipped] = useState(false);
  const [showCustomizePanel, setShowCustomizePanel] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [selectedScene, setSelectedScene] = useState<EnvironmentScene>(ENVIRONMENT_SCENES[0]);
  const [selectedLighting, setSelectedLighting] = useState<LightingPreset>(LIGHTING_PRESETS[0]);
  const [materialSettings, setMaterialSettings] = useState<MaterialSettings>(DEFAULT_MATERIAL_SETTINGS);
  const [overallBrightness, setOverallBrightness] = useState([100]);
  const [interactiveLighting, setInteractiveLighting] = useState(false);
  const [showEffects, setShowEffects] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);

  // Enhanced hooks
  const { effectValues, handleEffectChange, resetAllEffects } = useEnhancedCardEffects();
  const { 
    mousePosition, 
    isHovering, 
    handleMouseMove, 
    handleMouseEnter, 
    handleMouseLeave 
  } = useEnhancedCardInteraction();
  
  const cardEffects = useCardEffects({
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

  const { exportCard, isExporting } = useCardExport(cardRef);

  // Event handlers
  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  }, []);

  const handleRotate = useCallback(() => {
    setRotation(prev => ({ ...prev, y: prev.y + 90 }));
  }, []);

  const handleFlip = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  const handleMaterialChange = useCallback((property: keyof MaterialSettings, value: number) => {
    setMaterialSettings(prev => ({
      ...prev,
      [property]: value
    }));
  }, []);

  const handleExport = useCallback(async (format: 'png' | 'jpg', quality: number = 0.9) => {
    try {
      await exportCard(format, quality);
      setShowExportDialog(false);
      toast.success(`Card exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export card');
    }
  }, [exportCard]);

  const handleTakePhoto = useCallback(() => {
    handleExport('png', 1.0);
  }, [handleExport]);

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex">
      {/* Main Viewer Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-white">{card.title}</h1>
            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-sm">
              {card.rarity || 'Common'}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleTakePhoto}
              disabled={isExporting}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Camera className="w-4 h-4 mr-2" />
              {isExporting ? 'Exporting...' : 'Capture'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExportDialog(true)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCustomizePanel(!showCustomizePanel)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Settings className="w-4 h-4 mr-2" />
              Customize
            </Button>
            
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
            
            {onClose && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="border-white/20 text-white hover:bg-white/10"
              >
                ✕
              </Button>
            )}
          </div>
        </div>

        {/* Card Display Area */}
        <div 
          className="flex-1 flex items-center justify-center p-8"
          style={cardEffects.getEnvironmentStyle()}
        >
          <div
            ref={cardRef}
            className="relative w-72 h-96 transition-transform duration-300"
            style={{
              transform: `scale(${zoom}) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
              transformStyle: 'preserve-3d'
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <CardContainer 
              card={card}
              isFlipped={isFlipped}
              isHovering={isHovering}
              showEffects={showEffects}
              effectIntensity={[]}
              mousePosition={mousePosition}
              cardEffects={cardEffects}
              effectValues={effectValues}
              materialSettings={materialSettings}
              interactiveLighting={interactiveLighting}
            />
            
            {/* Enhanced CardFront with Material Effects */}
            <CardFront
              card={card}
              isFlipped={isFlipped}
              isHovering={isHovering}
              showEffects={showEffects}
              effectIntensity={[]}
              mousePosition={mousePosition}
              frameStyles={cardEffects.getFrameStyles()}
              physicalEffectStyles={cardEffects.getEnhancedEffectStyles()}
              SurfaceTexture={cardEffects.SurfaceTexture}
              effectValues={effectValues}
              materialSettings={materialSettings}
              interactiveLighting={interactiveLighting}
              materialEffects={cardEffects.getMaterialEffects()}
              MaterialSurfaceTexture={cardEffects.MaterialSurfaceTexture}
            />
          </div>
        </div>

        {/* Controls */}
        <ViewerControls
          zoom={zoom}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onRotate={handleRotate}
          onFlip={handleFlip}
          onReset={() => {
            setZoom(1);
            setRotation({ x: 0, y: 0 });
            setIsFlipped(false);
          }}
        />
      </div>

      {/* Customize Panel */}
      {showCustomizePanel && (
        <CustomizePanel
          effectValues={effectValues}
          onEffectChange={handleEffectChange}
          selectedScene={selectedScene}
          onSceneChange={setSelectedScene}
          selectedLighting={selectedLighting}
          onLightingChange={setSelectedLighting}
          materialSettings={materialSettings}
          onMaterialChange={handleMaterialChange}
          overallBrightness={overallBrightness}
          onBrightnessChange={setOverallBrightness}
          interactiveLighting={interactiveLighting}
          onInteractiveLightingChange={setInteractiveLighting}
          showEffects={showEffects}
          onShowEffectsChange={setShowEffects}
          onResetAll={resetAllEffects}
          onClose={() => setShowCustomizePanel(false)}
        />
      )}

      {/* Export Dialog */}
      <ExportOptionsDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        onExport={handleExport}
        isExporting={isExporting}
      />
    </div>
  );
};
