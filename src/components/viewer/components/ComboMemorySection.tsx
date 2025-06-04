
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, Trash2, Download } from 'lucide-react';
import { toast } from 'sonner';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';

interface SavedCombo {
  id: string;
  name: string;
  timestamp: number;
  effects: EffectValues;
  scene?: EnvironmentScene;
  lighting?: LightingPreset;
  materials?: MaterialSettings;
  brightness?: number;
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
  const [comboName, setComboName] = useState('');

  // Load saved combos from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('crd-saved-combos');
    if (saved) {
      try {
        setSavedCombos(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load saved combos:', error);
      }
    }
  }, []);

  // Save combos to localStorage
  const saveCombos = (combos: SavedCombo[]) => {
    localStorage.setItem('crd-saved-combos', JSON.stringify(combos));
    setSavedCombos(combos);
  };

  const saveCurrentCombo = () => {
    if (!comboName.trim()) {
      toast.error('Please enter a name for your combo');
      return;
    }

    const newCombo: SavedCombo = {
      id: Date.now().toString(),
      name: comboName.trim(),
      timestamp: Date.now(),
      effects: currentState.effects,
      scene: currentState.scene,
      lighting: currentState.lighting,
      materials: currentState.materials,
      brightness: currentState.brightness
    };

    const updatedCombos = [...savedCombos, newCombo];
    saveCombos(updatedCombos);
    setComboName('');
    toast.success(`Combo "${newCombo.name}" saved!`);
  };

  const deleteCombo = (id: string) => {
    const combo = savedCombos.find(c => c.id === id);
    const updatedCombos = savedCombos.filter(c => c.id !== id);
    saveCombos(updatedCombos);
    toast.success(`Combo "${combo?.name}" deleted`);
  };

  const getActiveEffectsCount = (effects: EffectValues) => {
    return Object.values(effects).filter(effect => {
      const intensity = effect.intensity;
      return typeof intensity === 'number' && intensity > 0;
    }).length;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      {/* Save Current Combo */}
      <div className="space-y-2">
        <h4 className="text-white text-sm font-medium">Save Current Combo</h4>
        <div className="flex space-x-2">
          <Input
            placeholder="Enter combo name..."
            value={comboName}
            onChange={(e) => setComboName(e.target.value)}
            className="flex-1 bg-editor-dark border-editor-border text-white text-sm"
            onKeyDown={(e) => e.key === 'Enter' && saveCurrentCombo()}
          />
          <Button
            onClick={saveCurrentCombo}
            size="sm"
            className="bg-crd-green text-black hover:bg-crd-green/90"
          >
            <Save className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Saved Combos List */}
      {savedCombos.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-white text-sm font-medium">Saved Combos</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {savedCombos.map((combo) => (
              <div key={combo.id} className="p-2 bg-editor-border rounded border border-editor-border">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white text-sm font-medium">{combo.name}</span>
                  <div className="flex items-center space-x-1">
                    <Button
                      onClick={() => onLoadCombo(combo)}
                      size="sm"
                      variant="outline"
                      className="h-6 px-2 text-xs border-crd-green text-crd-green hover:bg-crd-green hover:text-black"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Load
                    </Button>
                    <Button
                      onClick={() => deleteCombo(combo.id)}
                      size="sm"
                      variant="outline"
                      className="h-6 px-2 text-xs border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-crd-lightGray">
                  <span>{getActiveEffectsCount(combo.effects)} effects</span>
                  <span>{formatDate(combo.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {savedCombos.length === 0 && (
        <div className="text-center py-4">
          <p className="text-crd-lightGray text-sm">No saved combos yet</p>
          <p className="text-crd-lightGray text-xs">Save your first combo above!</p>
        </div>
      )}
    </div>
  );
};
