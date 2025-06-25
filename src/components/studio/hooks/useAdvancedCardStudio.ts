
import { useState, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { CardData } from '@/types/card';

export interface Layer {
  id: string;
  name: string;
  type: 'image' | 'text' | 'shape' | 'effect' | 'frame';
  visible: boolean;
  locked: boolean;
  opacity: number;
  blendMode: string;
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
  type: 'metallic' | 'dielectric' | 'emissive' | 'glass';
  properties: {
    metalness: number;
    roughness: number;
    transparency: number;
    emission: string;
    normal: string;
  };
}

interface HistoryState {
  canUndo: boolean;
  canRedo: boolean;
}

export const useAdvancedCardStudio = () => {
  const [cardData, setCardData] = useState<CardData>({
    id: uuidv4(),
    title: 'Untitled Card',
    description: '',
    rarity: 'common',
    tags: [],
    creator_id: '',
    created_at: new Date().toISOString(),
    design_metadata: {},
    visibility: 'public',
    creator_attribution: { collaboration_type: 'solo' },
    publishing_options: {
      marketplace_listing: false,
      crd_catalog_inclusion: true,
      print_available: false,
      pricing: { currency: 'USD' },
      distribution: { limited_edition: false }
    }
  });

  const [layers, setLayers] = useState<Layer[]>([
    {
      id: 'background',
      name: 'Background',
      type: 'shape',
      visible: true,
      locked: false,
      opacity: 1,
      blendMode: 'normal',
      transform: {
        x: 0, y: 0, z: 0,
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      data: { color: '#1a1a2e', gradient: true }
    }
  ]);

  const [effects, setEffects] = useState<Effect[]>([]);
  const [materials, setMaterials] = useState<Material[]>([
    {
      id: 'default',
      name: 'Card Base',
      type: 'dielectric',
      properties: {
        metalness: 0.1,
        roughness: 0.8,
        transparency: 0,
        emission: '#000000',
        normal: ''
      }
    }
  ]);

  const [selectedLayer, setSelectedLayer] = useState<string>('background');
  const [selectedFrame, setSelectedFrame] = useState<string>('');
  const [history, setHistory] = useState<HistoryState>({ canUndo: false, canRedo: false });
  const [isPlaying, setIsPlaying] = useState(false);

  const historyStack = useRef<any[]>([]);
  const historyIndex = useRef(0);

  const updateCardData = useCallback((updates: Partial<CardData>) => {
    setCardData(prev => ({ ...prev, ...updates }));
  }, []);

  const addLayer = useCallback((type: Layer['type']) => {
    const newLayer: Layer = {
      id: uuidv4(),
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Layer`,
      type,
      visible: true,
      locked: false,
      opacity: 1,
      blendMode: 'normal',
      transform: {
        x: 0, y: 0, z: 0,
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      data: {}
    };
    setLayers(prev => [...prev, newLayer]);
    setSelectedLayer(newLayer.id);
  }, []);

  const updateLayer = useCallback((layerId: string, updates: Partial<Layer>) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, ...updates } : layer
    ));
  }, []);

  const removeLayer = useCallback((layerId: string) => {
    setLayers(prev => prev.filter(layer => layer.id !== layerId));
    if (selectedLayer === layerId) {
      setSelectedLayer(layers[0]?.id || '');
    }
  }, [selectedLayer, layers]);

  const selectLayer = useCallback((layerId: string) => {
    setSelectedLayer(layerId);
  }, []);

  const selectFrame = useCallback((frameId: string) => {
    setSelectedFrame(frameId);
    
    // Add or update frame layer
    const frameLayer: Layer = {
      id: 'frame-layer',
      name: 'Card Frame',
      type: 'frame',
      visible: true,
      locked: false,
      opacity: 1,
      blendMode: 'normal',
      transform: {
        x: 0, y: 0, z: 0.01,
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      data: { frameId }
    };

    setLayers(prev => {
      const withoutFrame = prev.filter(layer => layer.id !== 'frame-layer');
      return [...withoutFrame, frameLayer];
    });
  }, []);

  const applyEffect = useCallback((effect: Omit<Effect, 'id'>) => {
    const newEffect: Effect = {
      ...effect,
      id: uuidv4()
    };
    setEffects(prev => [...prev, newEffect]);
  }, []);

  const updateMaterial = useCallback((materialId: string, updates: Partial<Material>) => {
    setMaterials(prev => prev.map(material =>
      material.id === materialId ? { ...material, ...updates } : material
    ));
  }, []);

  const undo = useCallback(() => {
    console.log('Undo');
  }, []);

  const redo = useCallback(() => {
    console.log('Redo');
  }, []);

  const save = useCallback(async () => {
    console.log('Saving card...');
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
