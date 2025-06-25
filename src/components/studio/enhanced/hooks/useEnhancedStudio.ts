
import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import type { CardData } from '@/types/card';
import { getFrameById, type EnhancedFrameData } from '../../data/enhancedFrames';

export interface StudioLayer {
  id: string;
  name: string;
  type: 'image' | 'text' | 'shape' | 'frame';
  visible: boolean;
  opacity: number;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
  data: any;
  // Add missing properties to match Layer interface
  locked: boolean;
  blendMode: 'normal' | 'multiply' | 'screen' | 'overlay';
  transform: {
    x: number;
    y: number;
    rotation: number;
    scaleX: number;
    scaleY: number;
  };
}

export interface StudioEffect {
  id: string;
  name: string;
  type: 'holographic' | 'chrome' | 'particle' | 'glow' | 'distortion'; // Fixed type to match Effect interface
  enabled: boolean;
  intensity: number;
  parameters: Record<string, any>;
}

export interface StudioState {
  currentPhase: number;
  completedPhases: Set<number>;
  uploadedImages: string[];
  selectedFrame?: string;
  frameData?: EnhancedFrameData;
  layers: StudioLayer[];
  effects: StudioEffect[];
  cardData: CardData;
  selectedLayerId?: string;
  history: any[];
  historyIndex: number;
  isPlaying: boolean;
}

const initialCardData: CardData = {
  id: uuidv4(),
  title: 'My Card',
  description: 'Custom card created in Enhanced Studio',
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
};

const initialLayers: StudioLayer[] = [
  {
    id: 'background',
    name: 'Background',
    type: 'shape',
    visible: true,
    opacity: 1,
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    data: { color: '#1a1a2e', gradient: true },
    locked: false,
    blendMode: 'normal',
    transform: { x: 0, y: 0, rotation: 0, scaleX: 1, scaleY: 1 }
  }
];

export const useEnhancedStudio = () => {
  const [state, setState] = useState<StudioState>({
    currentPhase: 0,
    completedPhases: new Set(),
    uploadedImages: [],
    layers: initialLayers,
    effects: [],
    cardData: initialCardData,
    history: [],
    historyIndex: -1,
    isPlaying: false
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Phase Navigation
  const setCurrentPhase = useCallback((phase: number) => {
    setState(prev => ({ ...prev, currentPhase: phase }));
  }, []);

  const completePhase = useCallback((phase: number) => {
    setState(prev => ({
      ...prev,
      completedPhases: new Set([...prev.completedPhases, phase]),
      currentPhase: Math.min(phase + 1, 3)
    }));
    toast.success(`Phase ${phase + 1} completed!`);
  }, []);

  // Image Upload
  const handleImageUpload = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    
    fileArray.forEach(file => {
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setState(prev => ({
          ...prev,
          uploadedImages: [...prev.uploadedImages, url]
        }));
        
        // Add as image layer
        const imageLayer: StudioLayer = {
          id: uuidv4(),
          name: `Image ${prev.uploadedImages.length + 1}`,
          type: 'image',
          visible: true,
          opacity: 1,
          position: { x: 0, y: 0, z: 0.01 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1, y: 1, z: 1 },
          data: { url, originalFile: file },
          locked: false,
          blendMode: 'normal',
          transform: { x: 0, y: 0, rotation: 0, scaleX: 1, scaleY: 1 }
        };
        
        setState(prevState => ({
          ...prevState,
          layers: [...prevState.layers, imageLayer],
          selectedLayerId: imageLayer.id
        }));
      }
    });
    
    toast.success(`${fileArray.length} image(s) uploaded successfully!`);
  }, []);

  const triggerImageUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Frame Selection
  const selectFrame = useCallback((frameId: string) => {
    const frameData = getFrameById(frameId);
    if (frameData) {
      setState(prev => ({
        ...prev,
        selectedFrame: frameId,
        frameData,
        cardData: {
          ...prev.cardData,
          design_metadata: {
            ...prev.cardData.design_metadata,
            frame: frameData
          }
        }
      }));
      toast.success(`Frame "${frameData.name}" selected!`);
    }
  }, []);

  // Layer Management
  const addLayer = useCallback((type: StudioLayer['type'], data: any = {}) => {
    const newLayer: StudioLayer = {
      id: uuidv4(),
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Layer`,
      type,
      visible: true,
      opacity: 1,
      position: { x: 0, y: 0, z: 0.01 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      data,
      locked: false,
      blendMode: 'normal',
      transform: { x: 0, y: 0, rotation: 0, scaleX: 1, scaleY: 1 }
    };
    
    setState(prev => ({
      ...prev,
      layers: [...prev.layers, newLayer],
      selectedLayerId: newLayer.id
    }));
  }, []);

  const updateLayer = useCallback((layerId: string, updates: Partial<StudioLayer>) => {
    setState(prev => ({
      ...prev,
      layers: prev.layers.map(layer =>
        layer.id === layerId ? { ...layer, ...updates } : layer
      )
    }));
  }, []);

  const removeLayer = useCallback((layerId: string) => {
    setState(prev => ({
      ...prev,
      layers: prev.layers.filter(layer => layer.id !== layerId),
      selectedLayerId: prev.selectedLayerId === layerId ? undefined : prev.selectedLayerId
    }));
  }, []);

  const selectLayer = useCallback((layerId: string) => {
    setState(prev => ({ ...prev, selectedLayerId: layerId }));
  }, []);

  // Effects Management
  const addEffect = useCallback((type: StudioEffect['type'], parameters: Record<string, any> = {}) => {
    const newEffect: StudioEffect = {
      id: uuidv4(),
      name: type.charAt(0).toUpperCase() + type.slice(1),
      type,
      enabled: true,
      intensity: 50,
      parameters
    };
    
    setState(prev => ({
      ...prev,
      effects: [...prev.effects, newEffect]
    }));
    
    toast.success(`${newEffect.name} effect added!`);
  }, []);

  const updateEffect = useCallback((effectId: string, updates: Partial<StudioEffect>) => {
    setState(prev => ({
      ...prev,
      effects: prev.effects.map(effect =>
        effect.id === effectId ? { ...effect, ...updates } : effect
      )
    }));
  }, []);

  const removeEffect = useCallback((effectId: string) => {
    setState(prev => ({
      ...prev,
      effects: prev.effects.filter(effect => effect.id !== effectId)
    }));
  }, []);

  // Animation Control
  const toggleAnimation = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, []);

  // Export Functions
  const exportCard = useCallback(async (format: 'png' | 'jpeg' | 'print') => {
    try {
      // Create a canvas element to render the card
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) throw new Error('Canvas context not available');
      
      // Set dimensions based on format
      const dimensions = format === 'print' 
        ? { width: 750, height: 1050 } // 2.5" x 3.5" at 300 DPI
        : { width: 400, height: 560 };   // Standard preview size
      
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
      
      // Draw background
      ctx.fillStyle = state.frameData?.template_data.colors.background || '#1a1a2e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw layers in order
      for (const layer of state.layers.filter(l => l.visible)) {
        ctx.globalAlpha = layer.opacity;
        
        if (layer.type === 'image' && layer.data.url) {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = layer.data.url;
          });
          
          const x = (canvas.width * layer.position.x) + (canvas.width - img.width * layer.scale.x) / 2;
          const y = (canvas.height * layer.position.y) + (canvas.height - img.height * layer.scale.y) / 2;
          
          ctx.drawImage(img, x, y, img.width * layer.scale.x, img.height * layer.scale.y);
        }
      }
      
      // Convert to blob and download
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), `image/${format}`, 0.95);
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${state.cardData.title || 'card'}.${format}`;
      a.click();
      
      URL.revokeObjectURL(url);
      toast.success(`Card exported as ${format.toUpperCase()}!`);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export failed. Please try again.');
    }
  }, [state]);

  const saveCard = useCallback(async () => {
    try {
      // Save to localStorage for now
      const saveData = {
        ...state,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem(`card_${state.cardData.id}`, JSON.stringify(saveData));
      toast.success('Card saved successfully!');
    } catch (error) {
      console.error('Save failed:', error);
      toast.error('Save failed. Please try again.');
    }
  }, [state]);

  return {
    // State
    ...state,
    fileInputRef,
    
    // Phase Management
    setCurrentPhase,
    completePhase,
    
    // Image Upload
    handleImageUpload,
    triggerImageUpload,
    
    // Frame Management
    selectFrame,
    
    // Layer Management
    addLayer,
    updateLayer,
    removeLayer,
    selectLayer,
    
    // Effects Management
    addEffect,
    updateEffect,
    removeEffect,
    
    // Animation
    toggleAnimation,
    
    // Export & Save
    exportCard,
    saveCard
  };
};
