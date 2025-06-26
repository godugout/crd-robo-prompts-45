import React, { useState, useRef, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import type { CardData } from '@/types/card';
import { ENHANCED_FRAMES } from '../../data/enhancedFrames';

export interface StudioEffect {
  id: string;
  name: string;
  type: 'holographic' | 'chrome' | 'particle' | 'glow' | 'distortion';
  enabled: boolean;
  intensity: number;
  parameters?: Record<string, any>;
}

export interface StudioLayer {
  id: string;
  name: string;
  type: 'image' | 'text' | 'shape';
  visible: boolean;
  opacity: number;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
  data: any;
}

export interface StudioState {
  currentPhase: number;
  completedPhases: Set<number>;
  uploadedImages: string[];
  selectedFrame?: string;
  frameData?: any;
  effects: StudioEffect[];
  layers: StudioLayer[];
  selectedLayerId?: string;
  isPlaying: boolean;
  cardData: CardData;
  imageAdjustments: Record<string, any>;
}

export interface UseEnhancedStudio {
  // State
  currentPhase: number;
  completedPhases: Set<number>;
  uploadedImages: string[];
  selectedFrame?: string;
  frameData?: any;
  effects: StudioEffect[];
  layers: StudioLayer[];
  selectedLayerId?: string;
  isPlaying: boolean;
  cardData: CardData;
  imageAdjustments: Record<string, any>;

  // Actions
  setCurrentPhase: (phase: number) => void;
  completePhase: (phase: number) => void;
  handleImageUpload: (files: FileList | File[]) => void;
  selectFrame: (frameId: string) => void;
  addEffect: (type: StudioEffect['type'], parameters?: Record<string, any>) => void;
  updateEffect: (effectId: string, updates: Partial<StudioEffect>) => void;
  removeEffect: (effectId: string) => void;
  selectLayer: (layerId: string) => void;
  updateLayer: (layerId: string, updates: Partial<StudioLayer>) => void;
  removeLayer: (layerId: string) => void;
  addLayer: (type: StudioLayer['type'], data?: any) => void;
  toggleAnimation: () => void;
  saveCard: () => Promise<void>;
  exportCard: (format: 'png' | 'jpeg' | 'print') => Promise<void>;
  triggerImageUpload: () => void;
  handleImageAdjust: (imageUrl: string, adjustment: any) => void;

  // Refs
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export const useEnhancedStudio = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [state, setState] = useState<StudioState>({
    currentPhase: 0,
    completedPhases: new Set(),
    uploadedImages: [],
    selectedFrame: undefined,
    frameData: undefined,
    effects: [],
    layers: [],
    selectedLayerId: undefined,
    isPlaying: false,
    cardData: {
      id: uuidv4(),
      title: 'New Card',
      image_url: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      // Fix: Add all required Card properties
      rarity: 'common',
      tags: [],
      creator_id: uuidv4(),
      creator_attribution: {
        creator_name: 'Studio Creator',
        creator_id: uuidv4()
      },
      publishing_options: {
        marketplace_listing: false,
        crd_catalog_inclusion: true,
        print_available: false,
        pricing: { currency: 'USD' },
        distribution: { limited_edition: false }
      },
      design_metadata: {},
      visibility: 'private',
      is_public: false
    },
    imageAdjustments: {}
  });

  // Real-time card data computation with immediate updates
  const cardData = useMemo((): CardData => {
    const primaryImage = state.uploadedImages[0];
    const frameData = state.selectedFrame ? ENHANCED_FRAMES.find(f => f.id === state.selectedFrame) : null;
    
    return {
      ...state.cardData,
      image_url: primaryImage || state.cardData.image_url,
      // Fix: Use template_id instead of frame_id
      template_id: state.selectedFrame,
      design_metadata: {
        ...state.cardData.design_metadata,
        frame_data: frameData?.template_data,
        effects: state.effects.filter(e => e.enabled).map(e => ({
          type: e.type,
          intensity: e.intensity,
          parameters: e.parameters
        })),
        layers: state.layers,
        image_adjustments: state.imageAdjustments
      },
      // Ensure immediate updates trigger re-renders
      updated_at: new Date().toISOString()
    };
  }, [state.uploadedImages, state.selectedFrame, state.effects, state.layers, state.cardData.title, state.imageAdjustments]);

  const setCurrentPhase = useCallback((phase: number) => {
    setState(prev => ({ ...prev, currentPhase: phase }));
  }, []);

  const completePhase = useCallback((phase: number) => {
    setState(prev => ({
      ...prev,
      completedPhases: new Set([...prev.completedPhases, phase]),
      currentPhase: Math.min(phase + 1, 3)
    }));
  }, []);

  const handleImageUpload = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    
    fileArray.forEach(file => {
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        
        setState(prevState => {
          const currentImageCount = prevState.uploadedImages.length;
          
          const imageLayer: StudioLayer = {
            id: uuidv4(),
            name: `Image ${currentImageCount + 1}`,
            type: 'image',
            visible: true,
            opacity: 1,
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            data: { imageUrl: url }
          };

          return {
            ...prevState,
            uploadedImages: [...prevState.uploadedImages, url],
            layers: [...prevState.layers, imageLayer]
          };
        });
      }
    });
    
    toast.success(`${fileArray.length} image(s) uploaded successfully!`);
    
    // Auto-complete upload phase and trigger immediate preview update
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        completedPhases: new Set([...prev.completedPhases, 0]),
        cardData: {
          ...prev.cardData,
          updated_at: new Date().toISOString()
        }
      }));
    }, 100);
  }, []);

  const selectFrame = useCallback((frameId: string) => {
    const frameData = ENHANCED_FRAMES.find(f => f.id === frameId);
    setState(prev => ({
      ...prev,
      selectedFrame: frameId,
      frameData,
      // Trigger immediate preview update
      cardData: {
        ...prev.cardData,
        template_id: frameId,
        updated_at: new Date().toISOString()
      }
    }));
    
    toast.success(`Frame "${frameData?.name}" selected!`);
  }, []);

  const addEffect = useCallback((type: StudioEffect['type'], parameters: Record<string, any> = {}) => {
    const newEffect: StudioEffect = {
      id: uuidv4(),
      name: type.charAt(0).toUpperCase() + type.slice(1),
      type,
      enabled: true,
      intensity: parameters.intensity || 50,
      parameters
    };

    setState(prev => ({
      ...prev,
      effects: [...prev.effects, newEffect],
      // Trigger immediate preview update
      cardData: {
        ...prev.cardData,
        updated_at: new Date().toISOString()
      }
    }));

    toast.success(`${newEffect.name} effect added!`);
  }, []);

  const updateEffect = useCallback((effectId: string, updates: Partial<StudioEffect>) => {
    setState(prev => ({
      ...prev,
      effects: prev.effects.map(effect => 
        effect.id === effectId ? { ...effect, ...updates } : effect
      ),
      // Trigger immediate preview update
      cardData: {
        ...prev.cardData,
        updated_at: new Date().toISOString()
      }
    }));
  }, []);

  const removeEffect = useCallback((effectId: string) => {
    setState(prev => ({
      ...prev,
      effects: prev.effects.filter(effect => effect.id !== effectId),
      // Trigger immediate preview update
      cardData: {
        ...prev.cardData,
        updated_at: new Date().toISOString()
      }
    }));
    
    toast.success('Effect removed!');
  }, []);

  const handleImageAdjust = useCallback((imageUrl: string, adjustment: any) => {
    setState(prev => ({
      ...prev,
      imageAdjustments: {
        ...prev.imageAdjustments,
        [imageUrl]: adjustment
      },
      // Trigger immediate preview update
      cardData: {
        ...prev.cardData,
        updated_at: new Date().toISOString()
      }
    }));
  }, []);

  const selectLayer = useCallback((layerId: string) => {
    setState(prev => ({ ...prev, selectedLayerId: layerId }));
  }, []);

  const updateLayer = useCallback((layerId: string, updates: Partial<StudioLayer>) => {
    setState(prev => ({
      ...prev,
      layers: prev.layers.map(layer => 
        layer.id === layerId ? { ...layer, ...updates } : layer
      ),
      cardData: {
        ...prev.cardData,
        updated_at: new Date().toISOString()
      }
    }));
  }, []);

  const removeLayer = useCallback((layerId: string) => {
    setState(prev => ({
      ...prev,
      layers: prev.layers.filter(layer => layer.id !== layerId),
      selectedLayerId: prev.selectedLayerId === layerId ? undefined : prev.selectedLayerId,
      cardData: {
        ...prev.cardData,
        updated_at: new Date().toISOString()
      }
    }));
  }, []);

  const addLayer = useCallback((type: StudioLayer['type'], data?: any) => {
    const newLayer: StudioLayer = {
      id: uuidv4(),
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Layer`,
      type,
      visible: true,
      opacity: 1,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      data: data || {}
    };

    setState(prev => ({
      ...prev,
      layers: [...prev.layers, newLayer],
      selectedLayerId: newLayer.id,
      cardData: {
        ...prev.cardData,
        updated_at: new Date().toISOString()
      }
    }));

    toast.success(`${newLayer.name} added!`);
  }, []);

  const toggleAnimation = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, []);

  const saveCard = useCallback(async () => {
    // Simulate save
    toast.success('Card saved successfully!');
  }, []);

  const exportCard = useCallback(async (format: 'png' | 'jpeg' | 'print') => {
    // Simulate export
    toast.success(`Card exported as ${format.toUpperCase()}!`);
  }, []);

  const triggerImageUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return {
    // State
    currentPhase: state.currentPhase,
    completedPhases: state.completedPhases,
    uploadedImages: state.uploadedImages,
    selectedFrame: state.selectedFrame,
    frameData: state.frameData,
    effects: state.effects,
    layers: state.layers,
    selectedLayerId: state.selectedLayerId,
    isPlaying: state.isPlaying,
    cardData, // Use the computed real-time cardData
    imageAdjustments: state.imageAdjustments,

    // Actions
    setCurrentPhase,
    completePhase,
    handleImageUpload,
    selectFrame,
    addEffect,
    updateEffect,
    removeEffect,
    selectLayer,
    updateLayer,
    removeLayer,
    addLayer,
    toggleAnimation,
    saveCard,
    exportCard,
    triggerImageUpload,
    handleImageAdjust,

    // Refs
    fileInputRef
  };
};
