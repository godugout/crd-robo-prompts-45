
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { NinePresetEffectsPhase } from './NinePresetEffectsPhase';
import { AdvancedEffectsPanel } from './effects/AdvancedEffectsPanel';
import { useStudioEffects } from '@/components/studio/hooks/useStudioEffects';
import { toast } from 'sonner';
import { Settings, Layers, Palette } from 'lucide-react';

interface EffectsPhaseProps {
  selectedFrame?: string;
  onEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void;
  effectValues?: Record<string, Record<string, any>>;
}

export const EffectsPhase: React.FC<EffectsPhaseProps> = ({
  selectedFrame,
  onEffectChange,
  effectValues = {}
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Advanced effects management
  const {
    effectLayers,
    selectedLayerId,
    advanced3DEffects,
    setAdvanced3DEffects,
    addEffectLayer,
    updateEffectLayer,
    removeEffectLayer,
    toggleLayerVisibility
  } = useStudioEffects();

  const handleEffectChange = (effectId: string, parameterId: string, value: number | boolean | string) => {
    onEffectChange(effectId, parameterId, value);
    // Clear preset selection when manual changes are made
    if (selectedPresetId) {
      setSelectedPresetId('');
    }
  };

  const handlePresetSelect = (presetId: string) => {
    setSelectedPresetId(presetId);
  };

  const handleAdvanced3DChange = (key: string, value: any) => {
    setAdvanced3DEffects(prev => ({ ...prev, [key]: value }));
    toast.success(`Updated ${key} setting`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-300">
          Choose from 9 AI-optimized effect presets or create custom combinations.
        </div>
        <div className="flex gap-2">
          <Button
            variant={showAdvanced ? "default" : "outline"}
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={showAdvanced 
              ? "bg-crd-green text-black" 
              : "border-white/20 text-white hover:bg-white/10"
            }
          >
            <Settings className="w-3 h-3 mr-1" />
            Advanced
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
          >
            <Layers className="w-3 h-3 mr-1" />
            Layers: {effectLayers.filter(l => l.visible).length}
          </Button>
        </div>
      </div>

      {showAdvanced && (
        <AdvancedEffectsPanel
          advanced3DEffects={advanced3DEffects}
          onAdvanced3DChange={handleAdvanced3DChange}
          effectLayers={effectLayers}
          selectedLayerId={selectedLayerId}
          onAddEffectLayer={addEffectLayer}
          onUpdateEffectLayer={updateEffectLayer}
          onRemoveEffectLayer={removeEffectLayer}
          onToggleLayerVisibility={toggleLayerVisibility}
        />
      )}

      {/* Main 9-Preset Interface */}
      <NinePresetEffectsPhase
        selectedPresetId={selectedPresetId}
        onPresetSelect={handlePresetSelect}
        onEffectChange={handleEffectChange}
        effectValues={effectValues}
      />
    </div>
  );
};
