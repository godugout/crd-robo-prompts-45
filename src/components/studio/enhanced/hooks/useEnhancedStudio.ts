import { useState, useRef, useCallback } from 'react';
import { ENHANCED_FRAMES } from '@/components/studio/data/enhancedFrames';
import { Card } from '@/types/card';
import { toast } from 'sonner';

interface Layer {
  id: string;
  name: string;
  type: 'image' | 'text' | 'shape' | 'effect' | 'frame';
  visible: boolean;
  locked: boolean;
  opacity: number;
  transform: any;
  data: any;
}

interface Effect {
  id: string;
  type: 'holographic' | 'chrome' | 'glow' | 'particle' | 'distortion';
  enabled: boolean;
  intensity: number;
  parameters: Record<string, any>;
}

export const useEnhancedStudio = () => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [completedPhases, setCompletedPhases] = useState<Set<number>>(new Set());
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [selectedFrame, setSelectedFrame] = useState<string | null>(null);
  const [effects, setEffects] = useState<Effect[]>([]);
  const [layers, setLayers] = useState<Layer[]>([
    {
      id: 'background',
      name: 'Background',
      type: 'shape',
      visible: true,
      locked: false,
      opacity: 1,
      transform: {},
      data: { color: '#1a1a2e' }
    }
  ]);
  const [selectedLayerId, setSelectedLayerId] = useState('background');
  const [isPlaying, setIsPlaying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const frameData = selectedFrame ? ENHANCED_FRAMES.find(f => f.id === selectedFrame) || null : null;

  // Create a complete Card object that matches the interface
  const cardData: Card = {
    id: 'preview-card',
    title: 'My Card',
    description: 'Created with Enhanced Studio',
    rarity: 'common',
    image_url: uploadedImages.length > 0 ? URL.createObjectURL(uploadedImages[0]) : undefined,
    tags: ['preview'],
    creator_id: 'current-user',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    edition_size: 1,
    creator_attribution: {
      collaboration_type: 'solo'
    },
    publishing_options: {
      marketplace_listing: false,
      crd_catalog_inclusion: true,
      print_available: false
    },
    design_metadata: {
      effects: effects.reduce((acc, effect) => {
        if (effect.enabled) {
          acc[effect.type] = effect.intensity;
        }
        return acc;
      }, {} as Record<string, number>),
      frame_id: selectedFrame,
      layers: layers.length
    },
    visibility: 'private'
  };

  // Convert effects to the format expected by the 3D viewer
  const effectValues = effects.reduce((acc, effect) => {
    if (effect.enabled) {
      acc[effect.type] = { intensity: effect.intensity, ...effect.parameters };
    } else {
      acc[effect.type] = { intensity: 0 };
    }
    return acc;
  }, {} as Record<string, any>);

  const handleImageUpload = useCallback((files: File[]) => {
    setUploadedImages(files);
    toast.success(`Uploaded ${files.length} image${files.length > 1 ? 's' : ''}`);
  }, []);

  const selectFrame = useCallback((frameId: string) => {
    setSelectedFrame(frameId);
    toast.success('Frame selected');
  }, []);

  const completePhase = useCallback((phase: number) => {
    setCompletedPhases(prev => new Set([...prev, phase]));
    if (phase < 3) {
      setCurrentPhase(phase + 1);
    }
  }, []);

  const addEffect = useCallback((type: Effect['type']) => {
    const newEffect: Effect = {
      id: `effect-${Date.now()}`,
      type,
      enabled: true,
      intensity: 50,
      parameters: type === 'glow' ? { color: '#ffd700' } : {}
    };
    setEffects(prev => [...prev, newEffect]);
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} effect added`);
  }, []);

  const updateEffect = useCallback((effectId: string, updates: Partial<Effect>) => {
    setEffects(prev => prev.map(effect => 
      effect.id === effectId ? { ...effect, ...updates } : effect
    ));
  }, []);

  const removeEffect = useCallback((effectId: string) => {
    setEffects(prev => prev.filter(effect => effect.id !== effectId));
    toast.success('Effect removed');
  }, []);

  const selectLayer = useCallback((layerId: string) => {
    setSelectedLayerId(layerId);
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
    if (selectedLayerId === layerId) {
      setSelectedLayerId('background');
    }
    toast.success('Layer removed');
  }, [selectedLayerId]);

  const addLayer = useCallback((type: Layer['type']) => {
    const newLayer: Layer = {
      id: `layer-${Date.now()}`,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Layer`,
      type,
      visible: true,
      locked: false,
      opacity: 1,
      transform: {},
      data: {}
    };
    setLayers(prev => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
    toast.success(`${type} layer added`);
  }, []);

  const toggleAnimation = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const handleImageAdjust = useCallback((adjustments: any) => {
    console.log('Image adjustments:', adjustments);
  }, []);

  const exportCard = useCallback((format: string) => {
    toast.success(`Exporting card as ${format.toUpperCase()}`);
  }, []);

  const saveCard = useCallback(() => {
    toast.success('Card saved successfully');
  }, []);

  return {
    currentPhase,
    setCurrentPhase,
    completedPhases,
    uploadedImages,
    selectedFrame,
    frameData,
    effects,
    effectValues,
    layers,
    selectedLayerId,
    cardData,
    isPlaying,
    fileInputRef,
    handleImageUpload,
    selectFrame,
    completePhase,
    addEffect,
    updateEffect,
    removeEffect,
    selectLayer,
    updateLayer,
    removeLayer,
    addLayer,
    toggleAnimation,
    handleImageAdjust,
    exportCard,
    saveCard
  };
};
