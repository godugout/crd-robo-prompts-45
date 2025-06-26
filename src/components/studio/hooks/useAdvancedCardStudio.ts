import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface Layer {
  id: string;
  name: string;
  type: 'image' | 'text' | 'shape' | 'effect' | 'frame';
  visible: boolean;
  locked: boolean;
  opacity: number;
  transform: {
    x: number;
    y: number;
    z: number;
    rotation: { x: number; y: number; z: number };
    scale: { x: number; y: number; z: number };
  };
  data: any;
}

export interface Effect {
  id: string;
  name: string;
  type: 'holographic' | 'chrome' | 'glow' | 'particle' | 'distortion';
  enabled: boolean;
  intensity: number;
  parameters: Record<string, any>;
}

export interface Material {
  id: string;
  name: string;
  type: 'metallic' | 'glass' | 'emissive' | 'standard';
  properties: {
    metalness: number;
    roughness: number;
    transparency: number;
    emission: string;
    normal: string;
  };
}

interface CardData {
  title: string;
  description: string;
  rarity: string;
  design_metadata: any;
}

export const useAdvancedCardStudio = () => {
  const [cardData, setCardData] = useState<CardData>({
    title: 'My Card',
    description: 'Card Description',
    rarity: 'common',
    design_metadata: {}
  });

  const [layers, setLayers] = useState<Layer[]>([
    {
      id: 'background',
      name: 'Background',
      type: 'shape',
      visible: true,
      locked: false,
      opacity: 1,
      transform: {
        x: 0, y: 0, z: 0,
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      data: { color: '#1a1a2e' }
    }
  ]);

  const [effects, setEffects] = useState<Effect[]>([]);
  
  const [materials, setMaterials] = useState<Material[]>([
    {
      id: 'default',
      name: 'Default Material',
      type: 'standard',
      properties: {
        metalness: 0.2,
        roughness: 0.8,
        transparency: 0,
        emission: '#000000',
        normal: ''
      }
    }
  ]);

  const [selectedLayer, setSelectedLayer] = useState<string>('background');
  const [selectedFrame, setSelectedFrame] = useState<string>('');
  const [history, setHistory] = useState<any[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const updateCardData = useCallback((updates: Partial<CardData>) => {
    setCardData(prev => ({ ...prev, ...updates }));
  }, []);

  const addLayer = useCallback((type: Layer['type']) => {
    const newLayer: Layer = {
      id: `layer-${Date.now()}`,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Layer`,
      type,
      visible: true,
      locked: false,
      opacity: 1,
      transform: {
        x: 0, y: 0, z: 0,
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      data: {}
    };
    setLayers(prev => [...prev, newLayer]);
    setSelectedLayer(newLayer.id);
    toast.success(`Added ${type} layer`);
  }, []);

  const updateLayer = useCallback((layerId: string, updates: Partial<Layer>) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, ...updates } : layer
    ));
  }, []);

  const removeLayer = useCallback((layerId: string) => {
    if (layerId === 'background') {
      toast.error('Cannot remove background layer');
      return;
    }
    setLayers(prev => prev.filter(layer => layer.id !== layerId));
    if (selectedLayer === layerId) {
      setSelectedLayer('background');
    }
    toast.success('Layer removed');
  }, [selectedLayer]);

  const selectLayer = useCallback((layerId: string) => {
    setSelectedLayer(layerId);
  }, []);

  const selectFrame = useCallback((frameId: string) => {
    setSelectedFrame(frameId);
    toast.success('Frame selected');
  }, []);

  const applyEffect = useCallback((effect: Omit<Effect, 'id'>) => {
    const newEffect: Effect = {
      id: `effect-${Date.now()}`,
      ...effect
    };
    setEffects(prev => [...prev, newEffect]);
    toast.success(`Applied ${effect.name} effect`);
  }, []);

  const updateMaterial = useCallback((materialId: string, updates: Partial<Material>) => {
    setMaterials(prev => prev.map(material => 
      material.id === materialId ? { ...material, ...updates } : material
    ));
  }, []);

  const undo = useCallback(() => {
    // Implement undo functionality
    toast.info('Undo');
  }, []);

  const redo = useCallback(() => {
    // Implement redo functionality
    toast.info('Redo');
  }, []);

  const save = useCallback(() => {
    // Implement save functionality
    toast.success('Saved');
  }, []);

  const toggleAnimation = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  return {
    cardData,
    layers,
    effects,
    materials,
    selectedLayer,
    selectedFrame,
    history,
    isPlaying,
    updateCardData,
    addLayer,
    updateLayer,
    removeLayer,
    selectLayer,
    selectFrame,
    applyEffect,
    updateMaterial,
    undo,
    redo,
    save,
    toggleAnimation
  };
};
