
import React, { useState, useCallback } from 'react';
import { 
  X, 
  Maximize2, 
  Minimize2, 
  Share2, 
  Download, 
  Settings 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CardData } from '@/hooks/useCardEditor';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { ProgressIndicator } from './ProgressIndicator';
import { PresetSelectionStep } from './PresetSelectionStep';
import { EnvironmentTuningStep } from './EnvironmentTuningStep';
import { ExportSaveStep } from './ExportSaveStep';

interface ProgressiveCustomizePanelProps {
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  effectValues: EffectValues;
  overallBrightness: number[];
  interactiveLighting: boolean;
  materialSettings: MaterialSettings;
  isFullscreen: boolean;
  onSceneChange: (scene: EnvironmentScene) => void;
  onLightingChange: (lighting: LightingPreset) => void;
  onEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void;
  onResetAllEffects: () => void;
  onBrightnessChange: (value: number[]) => void;
  onInteractiveLightingToggle: () => void;
  onMaterialSettingsChange: (settings: MaterialSettings) => void;
  onToggleFullscreen: () => void;
  onDownload?: (card: CardData) => void;
  onShare?: (card: CardData) => void;
  onClose?: () => void;
  card: CardData;
}

const STEP_LABELS = ['Choose Style', 'Environment', 'Save & Export'];

export const ProgressiveCustomizePanel: React.FC<ProgressiveCustomizePanelProps> = ({
  selectedScene,
  selectedLighting,
  effectValues,
  overallBrightness,
  interactiveLighting,
  materialSettings,
  isFullscreen,
  onSceneChange,
  onLightingChange,
  onEffectChange,
  onResetAllEffects,
  onBrightnessChange,
  onInteractiveLightingToggle,
  onMaterialSettingsChange,
  onToggleFullscreen,
  onDownload,
  onShare,
  onClose,
  card
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPreset, setSelectedPreset] = useState<any>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(true);
  const [previewEffects, setPreviewEffects] = useState<EffectValues | null>(null);

  // Calculate active effects count
  const getActiveEffectsCount = useCallback(() => {
    return Object.values(effectValues).filter(effect => {
      const intensity = effect.intensity;
      return typeof intensity === 'number' && intensity > 0;
    }).length;
  }, [effectValues]);

  // Handle preset selection
  const handlePresetSelect = useCallback((preset: any) => {
    setSelectedPreset(preset);
    // Apply preset effects
    Object.entries(preset.effects).forEach(([effectId, parameters]: [string, any]) => {
      Object.entries(parameters).forEach(([parameterId, value]) => {
        onEffectChange(effectId, parameterId, value);
      });
    });
  }, [onEffectChange]);

  // Handle preset preview
  const handlePresetPreview = useCallback((preset: any | null) => {
    if (preset && isPreviewMode) {
      setPreviewEffects(preset.effects);
      // Apply preview effects temporarily
      Object.entries(preset.effects).forEach(([effectId, parameters]: [string, any]) => {
        Object.entries(parameters).forEach(([parameterId, value]) => {
          onEffectChange(effectId, parameterId, value);
        });
      });
    } else if (!preset && previewEffects) {
      // Reset to original effects when no longer previewing
      setPreviewEffects(null);
    }
  }, [isPreviewMode, previewEffects, onEffectChange]);

  // Toggle preview mode
  const handleTogglePreviewMode = useCallback(() => {
    setIsPreviewMode(!isPreviewMode);
    if (!isPreviewMode) {
      setPreviewEffects(null);
    }
  }, [isPreviewMode]);

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const handleStepClick = useCallback((step: number) => {
    if (step <= currentStep || (step === 2 && selectedPreset)) {
      setCurrentStep(step);
    }
  }, [currentStep, selectedPreset]);

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PresetSelectionStep
            selectedPreset={selectedPreset}
            onPresetSelect={handlePresetSelect}
            onPresetPreview={handlePresetPreview}
            isPreviewMode={isPreviewMode}
            onTogglePreviewMode={handleTogglePreviewMode}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <EnvironmentTuningStep
            selectedScene={selectedScene}
            selectedLighting={selectedLighting}
            overallBrightness={overallBrightness}
            interactiveLighting={interactiveLighting}
            materialSettings={materialSettings}
            onSceneChange={onSceneChange}
            onLightingChange={onLightingChange}
            onBrightnessChange={onBrightnessChange}
            onInteractiveLightingToggle={onInteractiveLightingToggle}
            onMaterialSettingsChange={onMaterialSettingsChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <ExportSaveStep
            card={card}
            selectedScene={selectedScene}
            selectedLighting={selectedLighting}
            selectedPresetName={selectedPreset?.name}
            activeEffectsCount={getActiveEffectsCount()}
            onDownload={onDownload || (() => {})}
            onShare={onShare || (() => {})}
            onResetAll={onResetAllEffects}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed top-0 right-0 w-80 h-full bg-black bg-opacity-95 backdrop-blur-lg overflow-hidden border-l border-white/10 z-10 flex flex-col">
      {/* Header with toolbar buttons */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-white" />
          <h3 className="text-white font-medium">Enhanced Studio</h3>
        </div>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleFullscreen}
            className="bg-white bg-opacity-10 hover:bg-opacity-20 border border-white/10"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-white" /> : <Maximize2 className="w-4 h-4 text-white" />}
          </Button>
          {onShare && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onShare(card)}
              className="bg-white bg-opacity-10 hover:bg-opacity-20 border border-white/10"
            >
              <Share2 className="w-4 h-4 text-white" />
            </Button>
          )}
          {onDownload && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDownload(card)}
              className="bg-white bg-opacity-10 hover:bg-opacity-20 border border-white/10"
            >
              <Download className="w-4 h-4 text-white" />
            </Button>
          )}
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="bg-white bg-opacity-10 hover:bg-opacity-20 border border-white/10"
            >
              <X className="w-4 h-4 text-white" />
            </Button>
          )}
        </div>
      </div>

      {/* Progress Indicator */}
      <ProgressIndicator
        currentStep={currentStep}
        totalSteps={3}
        stepLabels={STEP_LABELS}
        onStepClick={handleStepClick}
      />

      {/* Main content area */}
      <div className="flex-1 overflow-y-auto">
        {renderStepContent()}
      </div>
    </div>
  );
};
