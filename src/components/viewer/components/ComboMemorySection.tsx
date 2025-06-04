
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, Trash2, Download } from 'lucide-react';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';

interface SavedCombo {
  id: string;
  name: string;
  effects: EffectValues;
  scene?: EnvironmentScene;
  lighting?: LightingPreset;
  materials?: MaterialSettings;
  brightness?: number;
  createdAt: Date;
}

interface ComboMemorySectionProps {
  currentState: {
    effects: EffectValues;
    scene: EnvironmentScene;
    lighting: LightingPreset;
    materials: MaterialSettings;
    brightness: number;
  };
  onLoadCombo: (combo: SavedCombo) => void;
}

export const ComboMemorySection: React.FC<ComboMemorySectionProps> = ({
  currentState,
  onLoadCombo
}) => {
  const [savedCombos, setSavedCombos] = useState<SavedCombo[]>([]);
  const [newComboName, setNewComboName] = useState('');

  const handleSaveCombo = () => {
    if (!newComboName.trim()) return;

    const newCombo: SavedCombo = {
      id: Date.now().toString(),
      name: newComboName.trim(),
      effects: currentState.effects,
      scene: currentState.scene,
      lighting: currentState.lighting,
      materials: currentState.materials,
      brightness: currentState.brightness,
      createdAt: new Date()
    };

    setSavedCombos(prev => [newCombo, ...prev]);
    setNewComboName('');
  };

  const handleDeleteCombo = (id: string) => {
    setSavedCombos(prev => prev.filter(combo => combo.id !== id));
  };

  const getActiveEffectsCount = (effects: EffectValues) => {
    return Object.values(effects).filter(effect => {
      const intensity = effect.intensity;
      return typeof intensity === 'number' && intensity > 0;
    }).length;
  };

  return (
    <div className="space-y-4">
      {/* Save Current Combo */}
      <div className="space-y-2">
        <div className="flex space-x-2">
          <Input
            value={newComboName}
            onChange={(e) => setNewComboName(e.target.value)}
            placeholder="Combo name..."
            className="flex-1 bg-editor-dark border-editor-border text-white"
          />
          <Button
            onClick={handleSaveCombo}
            disabled={!newComboName.trim()}
            size="sm"
            className="bg-crd-green text-black hover:bg-crd-green/80"
          >
            <Save className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Saved Combos List */}
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {savedCombos.length === 0 ? (
          <p className="text-crd-lightGray text-sm text-center py-4">
            No saved combos yet
          </p>
        ) : (
          savedCombos.map((combo) => (
            <div key={combo.id} className="flex items-center justify-between p-2 bg-editor-border rounded border border-editor-border">
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-medium truncate">{combo.name}</div>
                <div className="text-crd-lightGray text-xs">
                  {getActiveEffectsCount(combo.effects)} effects • {combo.scene?.name} • {combo.lighting?.name}
                </div>
              </div>
              <div className="flex space-x-1 ml-2">
                <Button
                  onClick={() => onLoadCombo(combo)}
                  variant="ghost"
                  size="sm"
                  className="w-6 h-6 p-0 text-crd-green hover:bg-crd-green/20"
                >
                  <Download className="w-3 h-3" />
                </Button>
                <Button
                  onClick={() => handleDeleteCombo(combo.id)}
                  variant="ghost"
                  size="sm"
                  className="w-6 h-6 p-0 text-red-500 hover:bg-red-500/20"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
