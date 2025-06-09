
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface LightingState {
  preset: string;
  ambientIntensity: number;
  directionalIntensity: number;
  colorTemperature: number;
  shadowIntensity: number;
  colorFilter: 'warm' | 'cool' | 'neutral';
}

export interface DesignState {
  selectedTool: string;
  fontSize: number;
  borderRadius: number;
  opacity: number;
  backgroundColor: string;
  primaryColor: string;
  textColor: string;
  fontFamily: string;
  textAlign: 'left' | 'center' | 'right';
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  textDecoration: 'none' | 'underline';
}

export interface LayerState {
  id: string;
  name: string;
  type: 'text' | 'shape' | 'image' | 'background';
  visible: boolean;
  locked: boolean;
  opacity: number;
  blendMode: string;
  zIndex: number;
}

export interface StudioState {
  lighting: LightingState;
  design: DesignState;
  layers: LayerState[];
  selectedLayerId: string | null;
}

const initialLightingState: LightingState = {
  preset: 'studio',
  ambientIntensity: 70,
  directionalIntensity: 80,
  colorTemperature: 5500,
  shadowIntensity: 40,
  colorFilter: 'neutral'
};

const initialDesignState: DesignState = {
  selectedTool: 'text',
  fontSize: 24,
  borderRadius: 8,
  opacity: 100,
  backgroundColor: '#ffffff',
  primaryColor: '#2563eb',
  textColor: '#000000',
  fontFamily: 'Arial',
  textAlign: 'left',
  fontWeight: 'normal',
  fontStyle: 'normal',
  textDecoration: 'none'
};

const initialLayers: LayerState[] = [
  {
    id: 'background',
    name: 'Background',
    type: 'background',
    visible: true,
    locked: false,
    opacity: 100,
    blendMode: 'normal',
    zIndex: 0
  },
  {
    id: 'image',
    name: 'Card Image',
    type: 'image',
    visible: true,
    locked: false,
    opacity: 100,
    blendMode: 'normal',
    zIndex: 1
  },
  {
    id: 'title',
    name: 'Title Text',
    type: 'text',
    visible: true,
    locked: false,
    opacity: 100,
    blendMode: 'normal',
    zIndex: 2
  }
];

export const useStudioState = () => {
  const [studioState, setStudioState] = useState<StudioState>({
    lighting: initialLightingState,
    design: initialDesignState,
    layers: initialLayers,
    selectedLayerId: 'image'
  });

  const updateLighting = useCallback((updates: Partial<LightingState>) => {
    setStudioState(prev => ({
      ...prev,
      lighting: { ...prev.lighting, ...updates }
    }));
  }, []);

  const updateDesign = useCallback((updates: Partial<DesignState>) => {
    setStudioState(prev => ({
      ...prev,
      design: { ...prev.design, ...updates }
    }));
  }, []);

  const updateLayer = useCallback((layerId: string, updates: Partial<LayerState>) => {
    setStudioState(prev => ({
      ...prev,
      layers: prev.layers.map(layer =>
        layer.id === layerId ? { ...layer, ...updates } : layer
      )
    }));
  }, []);

  const addLayer = useCallback((layer: Omit<LayerState, 'zIndex'>) => {
    setStudioState(prev => ({
      ...prev,
      layers: [...prev.layers, { ...layer, zIndex: prev.layers.length }]
    }));
  }, []);

  const removeLayer = useCallback((layerId: string) => {
    setStudioState(prev => ({
      ...prev,
      layers: prev.layers.filter(layer => layer.id !== layerId),
      selectedLayerId: prev.selectedLayerId === layerId ? null : prev.selectedLayerId
    }));
  }, []);

  const reorderLayers = useCallback((fromIndex: number, toIndex: number) => {
    setStudioState(prev => {
      const newLayers = [...prev.layers];
      const [movedLayer] = newLayers.splice(fromIndex, 1);
      newLayers.splice(toIndex, 0, movedLayer);
      
      // Update z-indices
      const updatedLayers = newLayers.map((layer, index) => ({
        ...layer,
        zIndex: index
      }));
      
      return { ...prev, layers: updatedLayers };
    });
  }, []);

  const selectLayer = useCallback((layerId: string | null) => {
    setStudioState(prev => ({ ...prev, selectedLayerId: layerId }));
  }, []);

  const applyLightingPreset = useCallback((preset: string) => {
    const presets = {
      studio: { ambientIntensity: 70, directionalIntensity: 80, colorTemperature: 5500, shadowIntensity: 40 },
      dramatic: { ambientIntensity: 20, directionalIntensity: 90, colorTemperature: 3200, shadowIntensity: 80 },
      soft: { ambientIntensity: 85, directionalIntensity: 60, colorTemperature: 6500, shadowIntensity: 20 },
      neon: { ambientIntensity: 50, directionalIntensity: 70, colorTemperature: 8000, shadowIntensity: 60 }
    };

    const presetConfig = presets[preset as keyof typeof presets];
    if (presetConfig) {
      updateLighting({ preset, ...presetConfig });
      toast.success(`Applied ${preset} lighting preset`);
    }
  }, [updateLighting]);

  return {
    studioState,
    updateLighting,
    updateDesign,
    updateLayer,
    addLayer,
    removeLayer,
    reorderLayers,
    selectLayer,
    applyLightingPreset
  };
};
