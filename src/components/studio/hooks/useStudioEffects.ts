
import { useState } from 'react';

export interface EffectLayerData {
  id: string;
  name: string;
  type: 'holographic' | 'metallic' | 'prismatic' | 'vintage' | 'crystal' | 'foil';
  opacity: number;
  blendMode: 'normal' | 'multiply' | 'screen' | 'overlay' | 'soft-light' | 'hard-light' | 'color-dodge' | 'color-burn';
  visible: boolean;
  parameters: Record<string, number>;
}

export const useStudioEffects = () => {
  const [effectLayers, setEffectLayers] = useState<EffectLayerData[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string>('');
  const [advanced3DEffects, setAdvanced3DEffects] = useState({
    holographic: false,
    metalness: 0.1,
    roughness: 0.4,
    particles: false,
    glow: false,
    glowColor: '#00ffff',
    bloom: false,
    bloomStrength: 1.5,
    bloomRadius: 0.4,
    bloomThreshold: 0.85
  });

  const addEffectLayer = (type: EffectLayerData['type']) => {
    const newLayer: EffectLayerData = {
      id: `layer-${Date.now()}`,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Effect`,
      type,
      opacity: 100,
      blendMode: 'normal',
      visible: true,
      parameters: {
        intensity: 50,
        spread: 30,
        shimmer: 40,
        depth: 25
      }
    };
    setEffectLayers(prev => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
  };

  const updateEffectLayer = (updatedLayer: EffectLayerData) => {
    setEffectLayers(prev => prev.map(layer => 
      layer.id === updatedLayer.id ? updatedLayer : layer
    ));
  };

  const removeEffectLayer = (layerId: string) => {
    setEffectLayers(prev => prev.filter(layer => layer.id !== layerId));
    if (selectedLayerId === layerId) {
      setSelectedLayerId('');
    }
  };

  const toggleLayerVisibility = (layerId: string) => {
    setEffectLayers(prev => prev.map(layer =>
      layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
    ));
  };

  return {
    effectLayers,
    selectedLayerId,
    advanced3DEffects,
    setSelectedLayerId,
    setAdvanced3DEffects,
    addEffectLayer,
    updateEffectLayer,
    removeEffectLayer,
    toggleLayerVisibility
  };
};
