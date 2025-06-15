
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Maximize2, Minimize2, Share2, Download, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EnhancedCard3D } from './components/EnhancedCard3D';
import { ComboStudioPanel } from './components/ComboStudioPanel';
import { EnhancedMobileStudioPanel } from './components/EnhancedMobileStudioPanel';
import { useMobileControl } from './context/MobileControlContext';
import { useViewerEffects } from './hooks/useViewerEffects';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import type { UserCard } from '@/hooks/useUserCards';

interface ImmersiveCardViewerProps {
  card: UserCard;
  isOpen: boolean;
  onClose: () => void;
  onShare?: () => void;  
  onDownload?: () => void;
  allowRotation?: boolean;
  showStats?: boolean;
  ambient?: boolean;
}

export const ImmersiveCardViewer: React.FC<ImmersiveCardViewerProps> = ({
  card,
  isOpen,
  onClose,
  onShare,
  onDownload,
  allowRotation = true,
  showStats = false,
  ambient = false
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showStudioPanel, setShowStudioPanel] = useState(true);
  const viewerRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useDeviceDetection();
  const { togglePanel } = useMobileControl();

  const {
    effectValues,
    handleEffectChange,
    resetEffect,
    resetAllEffects,
    presetState,
    selectedScene,
    selectedLighting,
    overallBrightness,
    interactiveLighting,
    materialSettings,
    handleSceneChange,
    handleLightingChange,
    handleMaterialSettingsChange,
    handleApplyCombo,
    setOverallBrightness,
    setInteractiveLighting
  } = useViewerEffects();

  const toggleFullscreen = useCallback(() => {
    if (!viewerRef.current) return;

    if (!document.fullscreenElement) {
      viewerRef.current.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  }, []);

  const toggleStudioPanel = useCallback(() => {
    setShowStudioPanel(prev => !prev);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !document.fullscreenElement) {
        onClose();
      }
      if (e.key === 'h' || e.key === 'H') {
        toggleStudioPanel();
      }
      if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [onClose, toggleFullscreen, toggleStudioPanel]);

  if (!isOpen) return null;

  return (
    <div 
      ref={viewerRef}
      className={`fixed inset-0 z-50 bg-black ${isFullscreen ? 'p-0' : ''}`}
    >
      {/* Header Controls */}
      <div className={`absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/50 to-transparent ${isFullscreen ? 'opacity-0 hover:opacity-100' : ''} transition-opacity duration-300`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-white text-lg font-medium">{card.title}</h2>
            {showStats && (
              <div className="text-crd-lightGray text-sm">
                {card.rarity} • Created {new Date(card.created_at).toLocaleDateString()}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* Studio Panel Toggle */}
            <Button
              onClick={toggleStudioPanel}
              variant="ghost"
              size="sm"
              className="bg-black/20 hover:bg-black/40 text-white border border-white/20"
              title={showStudioPanel ? "Hide Studio Panel (H)" : "Show Studio Panel (H)"}
            >
              {showStudioPanel ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>

            {/* Fullscreen Toggle */}
            <Button
              onClick={toggleFullscreen}
              variant="ghost"
              size="sm"
              className="bg-black/20 hover:bg-black/40 text-white border border-white/20"
              title={isFullscreen ? "Exit Fullscreen (F)" : "Fullscreen (F)"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>

            {/* Share Button */}
            {onShare && (
              <Button
                onClick={onShare}
                variant="ghost"
                size="sm"
                className="bg-black/20 hover:bg-black/40 text-white border border-white/20"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            )}

            {/* Download Button */}
            {onDownload && (
              <Button
                onClick={onDownload}
                variant="ghost"
                size="sm"
                className="bg-black/20 hover:bg-black/40 text-white border border-white/20"
              >
                <Download className="w-4 h-4" />
              </Button>
            )}

            {/* Close Button */}
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="bg-black/20 hover:bg-black/40 text-white border border-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* 3D Card Display */}
      <div className="absolute inset-0">
        <EnhancedCard3D
          card={card}
          effectValues={effectValues}
          selectedScene={selectedScene}
          selectedLighting={selectedLighting}
          overallBrightness={overallBrightness}
          interactiveLighting={interactiveLighting}
          materialSettings={materialSettings}
          allowRotation={allowRotation}
          ambient={ambient}
          isFullscreen={isFullscreen}
        />
      </div>

      {/* Desktop Studio Panel */}
      {!isMobile && showStudioPanel && (
        <ComboStudioPanel
          selectedScene={selectedScene}
          selectedLighting={selectedLighting}
          effectValues={effectValues}
          overallBrightness={overallBrightness}
          interactiveLighting={interactiveLighting}
          materialSettings={materialSettings}
          isFullscreen={isFullscreen}
          onSceneChange={handleSceneChange}
          onLightingChange={handleLightingChange}
          onEffectChange={handleEffectChange}
          onResetEffect={resetEffect}
          onResetAllEffects={resetAllEffects}
          onBrightnessChange={setOverallBrightness}
          onInteractiveLightingToggle={setInteractiveLighting}
          onMaterialSettingsChange={handleMaterialSettingsChange}
          onToggleFullscreen={toggleFullscreen}
          onDownload={onDownload}
          onShare={onShare}
          onClose={toggleStudioPanel}
          card={card}
        />
      )}

      {/* Mobile Studio Panel */}
      {isMobile && showStudioPanel && (
        <EnhancedMobileStudioPanel
          selectedScene={selectedScene}
          selectedLighting={selectedLighting}
          effectValues={effectValues}
          overallBrightness={overallBrightness}
          interactiveLighting={interactiveLighting}
          materialSettings={materialSettings}
          isFullscreen={isFullscreen}
          onSceneChange={handleSceneChange}
          onLightingChange={handleLightingChange}
          onEffectChange={handleEffectChange}
          onResetAllEffects={resetAllEffects}
          onBrightnessChange={setOverallBrightness}
          onInteractiveLightingToggle={setInteractiveLighting}
          onMaterialSettingsChange={handleMaterialSettingsChange}
          onToggleFullscreen={toggleFullscreen}
          onDownload={onDownload}
          onShare={onShare}
          card={card}
          selectedPresetId={presetState.selectedPresetId}
          onPresetSelect={presetState.setSelectedPresetId}
          onApplyCombo={handleApplyCombo}
          isApplyingPreset={presetState.isApplying}
          cardDetails={{
            id: card.id,
            title: card.title,
            description: card.description,
            rarity: card.rarity,
            creator_name: card.creator_name,
            creator_verified: card.creator_verified,
            created_at: card.created_at,
            tags: card.tags
          }}
        />
      )}

      {/* Keyboard Shortcuts Hint */}
      {!isFullscreen && (
        <div className="absolute bottom-4 left-4 text-crd-lightGray text-xs opacity-50 hover:opacity-100 transition-opacity">
          Press H to toggle studio panel • F for fullscreen • ESC to close
        </div>
      )}
    </div>
  );
};
