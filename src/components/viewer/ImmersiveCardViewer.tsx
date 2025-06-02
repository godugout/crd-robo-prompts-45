
import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Share2, 
  Download,
  Settings
} from 'lucide-react';
import { CustomizePanel } from './components/CustomizePanel';
import { Enhanced3DEnvironment } from './Enhanced3DEnvironment';
import { ENVIRONMENT_SCENES, LIGHTING_PRESETS, VISUAL_EFFECTS } from './constants';
import type { CardData } from '@/types/card';
import type { EnvironmentScene, LightingPreset, VisualEffect, MaterialSettings } from './types';

interface ImmersiveCardViewerProps {
  card: CardData;
  cards?: CardData[];
  currentCardIndex?: number;
  onCardChange?: (index: number) => void;
  isOpen?: boolean;
  onClose?: () => void;
  onShare?: (cards: CardData[]) => void;
  onDownload?: (cards: CardData[]) => void;
  allowRotation?: boolean;
  showStats?: boolean;
  ambient?: boolean;
}

export const ImmersiveCardViewer: React.FC<ImmersiveCardViewerProps> = ({
  card,
  cards = [],
  currentCardIndex = 0,
  onCardChange,
  isOpen = false,
  onClose,
  onShare,
  onDownload,
  allowRotation = true,
  showStats = true,
  ambient = true
}) => {
  const [selectedScene, setSelectedScene] = useState<EnvironmentScene>(ENVIRONMENT_SCENES[0]);
  const [selectedLighting, setSelectedLighting] = useState<LightingPreset>(LIGHTING_PRESETS[0]);
  const [selectedEffect, setSelectedEffect] = useState<VisualEffect>(VISUAL_EFFECTS[0]);
  const [effectIntensity, setEffectIntensity] = useState<number[]>([50]);
  const [overallBrightness, setOverallBrightness] = useState<number[]>([100]);
  const [interactiveLighting, setInteractiveLighting] = useState(true);
  const [materialSettings, setMaterialSettings] = useState<MaterialSettings>({
    roughness: 0.1,
    metalness: 0.1,
    clearcoat: 0.8,
    reflectivity: 0.9
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCustomizePanel, setShowCustomizePanel] = useState(false);

  const handlePreviousCard = useCallback(() => {
    if (cards.length > 1 && onCardChange) {
      const newIndex = currentCardIndex > 0 ? currentCardIndex - 1 : cards.length - 1;
      onCardChange(newIndex);
    }
  }, [currentCardIndex, cards.length, onCardChange]);

  const handleNextCard = useCallback(() => {
    if (cards.length > 1 && onCardChange) {
      const newIndex = currentCardIndex < cards.length - 1 ? currentCardIndex + 1 : 0;
      onCardChange(newIndex);
    }
  }, [currentCardIndex, cards.length, onCardChange]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (!isOpen) return;
    
    switch (event.key) {
      case 'Escape':
        onClose?.();
        break;
      case 'ArrowLeft':
        handlePreviousCard();
        break;
      case 'ArrowRight':
        handleNextCard();
        break;
    }
  }, [isOpen, onClose, handlePreviousCard, handleNextCard]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose?.()}>
      <DialogContent 
        className={`max-w-none h-screen w-screen p-0 bg-black ${
          isFullscreen ? 'border-none' : ''
        }`}
      >
        <div className="relative w-full h-full flex">
          {/* Main 3D Environment Area */}
          <div className="flex-1 relative">
            <Enhanced3DEnvironment 
              scene={selectedScene}
              allowRotation={allowRotation}
            />
            
            {/* Top Controls */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white border border-white/20"
                >
                  <X className="w-5 h-5" />
                </Button>
                {cards.length > 1 && (
                  <div className="bg-black bg-opacity-50 px-3 py-1 rounded-full text-white text-sm border border-white/20">
                    {currentCardIndex + 1} of {cards.length}
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCustomizePanel(!showCustomizePanel)}
                  className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white border border-white/20"
                >
                  <Settings className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Navigation Controls */}
            {cards.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={handlePreviousCard}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white border border-white/20"
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={handleNextCard}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white border border-white/20"
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </>
            )}

            {/* Card Info Overlay */}
            {showStats && (
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 backdrop-blur-lg p-4 rounded-lg text-white max-w-sm border border-white/20">
                <h3 className="font-bold text-lg mb-2">{card.title}</h3>
                {card.description && (
                  <p className="text-sm text-gray-300 mb-2">{card.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-blue-600 px-2 py-1 rounded">
                    {card.rarity}
                  </span>
                  <span className="text-xs text-gray-400">
                    Scene: {selectedScene.name}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Customize Panel */}
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
              onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
              onDownload={onDownload}
              onShare={onShare}
              onClose={() => setShowCustomizePanel(false)}
              card={card}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
