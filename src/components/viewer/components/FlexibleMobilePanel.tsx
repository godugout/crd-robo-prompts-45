
import React, { useState } from 'react';
import { Settings, Sparkles, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EnhancedCustomizePanel } from './EnhancedCustomizePanel';
import { CardInfoSection } from './CardInfoSection';
import { QuickComboPresets } from './QuickComboPresets';
import { useMobileControl } from '../context/MobileControlContext';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { MaterialSettings } from '../types';

interface FlexibleMobilePanelProps {
  card: any;
  cardDetails?: any;
  effectValues: EffectValues;
  onEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void;
  onResetAllEffects: () => void;
  overallBrightness: number[];
  onBrightnessChange: (value: number[]) => void;
  interactiveLighting: boolean;
  onInteractiveLightingToggle: () => void;
  materialSettings: MaterialSettings;
  onMaterialSettingsChange: (settings: MaterialSettings) => void;
  onLike?: () => void;
  onBookmark?: () => void;
  onShare?: () => void;
  onDownload?: () => void;
  onCardImageUpdate?: (imageBlob: Blob) => void;
}

export const FlexibleMobilePanel: React.FC<FlexibleMobilePanelProps> = ({
  card,
  cardDetails,
  effectValues,
  onEffectChange,
  onResetAllEffects,
  overallBrightness,
  onBrightnessChange,
  interactiveLighting,
  onInteractiveLightingToggle,
  materialSettings,
  onMaterialSettingsChange,
  onLike,
  onBookmark,
  onShare,
  onDownload,
  onCardImageUpdate
}) => {
  const [showEnhancedPanel, setShowEnhancedPanel] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string | undefined>();
  const [isApplyingPreset, setIsApplyingPreset] = useState(false);

  const { selectedScene, selectedLighting } = useMobileControl();

  const handleApplyCombo = async (combo: any) => {
    setIsApplyingPreset(true);
    setSelectedPresetId(combo.id);
    
    // Apply each effect with a small delay for smooth animation
    for (const [effectId, parameters] of Object.entries(combo.effects)) {
      for (const [parameterId, value] of Object.entries(parameters as any)) {
        onEffectChange(effectId, parameterId, value);
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }
    
    setTimeout(() => {
      setIsApplyingPreset(false);
    }, 1000);
  };

  const handleOpenEnhancedStudio = () => {
    setShowEnhancedPanel(true);
  };

  const handleCloseEnhancedStudio = () => {
    setShowEnhancedPanel(false);
  };

  return (
    <div className="w-full h-full bg-black bg-opacity-90 backdrop-blur-sm border-l border-white/10 flex flex-col">
      {/* Card Info Section - Always visible at top */}
      <div className="flex-shrink-0 border-b border-white/10">
        <CardInfoSection
          card={card}
          cardDetails={cardDetails}
          onLike={onLike}
          onBookmark={onBookmark}
          onShare={onShare}
          onDownload={onDownload}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Quick Effects Section */}
          <div>
            <h3 className="text-white font-medium mb-3 flex items-center">
              <Sparkles className="w-4 h-4 text-crd-green mr-2" />
              Quick Effects
              {isApplyingPreset && (
                <div className="ml-2 w-2 h-2 bg-crd-green rounded-full animate-pulse" />
              )}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <QuickComboPresets
                onApplyCombo={handleApplyCombo}
                currentEffects={effectValues}
                selectedPresetId={selectedPresetId}
                onPresetSelect={setSelectedPresetId}
                isApplyingPreset={isApplyingPreset}
              />
            </div>
          </div>

          {/* Enhanced Studio Access */}
          <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Settings className="w-5 h-5 text-purple-400 mr-2" />
                  <div>
                    <h4 className="text-white font-medium">Enhanced Studio</h4>
                    <p className="text-gray-400 text-xs">Advanced customization tools</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={handleOpenEnhancedStudio}
                  className="bg-purple-600 hover:bg-purple-700 text-white text-xs py-2"
                >
                  <Settings className="w-3 h-3 mr-1" />
                  Open Studio
                </Button>
                <Button
                  onClick={() => setShowEnhancedPanel(true)}
                  variant="outline"
                  className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10 text-xs py-2"
                >
                  <Camera className="w-3 h-3 mr-1" />
                  Smart Detection
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Enhanced Studio Panel Overlay */}
      {showEnhancedPanel && (
        <EnhancedCustomizePanel
          selectedScene={selectedScene}
          selectedLighting={selectedLighting}
          effectValues={effectValues}
          overallBrightness={overallBrightness}
          interactiveLighting={interactiveLighting}
          materialSettings={materialSettings}
          isFullscreen={false}
          onSceneChange={() => {}}
          onLightingChange={() => {}}
          onEffectChange={onEffectChange}
          onResetEffect={() => {}}
          onResetAllEffects={onResetAllEffects}
          onBrightnessChange={onBrightnessChange}
          onInteractiveLightingToggle={onInteractiveLightingToggle}
          onMaterialSettingsChange={onMaterialSettingsChange}
          onToggleFullscreen={() => {}}
          onDownload={onDownload}
          onShare={onShare}
          onClose={handleCloseEnhancedStudio}
          onCardImageUpdate={onCardImageUpdate}
          card={card}
        />
      )}
    </div>
  );
};
