import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { toast } from 'sonner';

export interface EnvironmentState {
  preset: 'studio' | 'nature' | 'sunset' | 'neon';
  backgroundBlur: number;
  backgroundBrightness: number;
  hdriIntensity: number;
}

export interface MaterialState {
  preset: 'standard' | 'metallic' | 'chrome' | 'crystal' | 'holographic';
  metalness: number;
  roughness: number;
  transparency: number;
  emission: number;
}

export interface LightingState {
  preset: 'studio' | 'dramatic' | 'soft' | 'neon';
  intensity: number;
  colorTemperature: number;
  shadowIntensity: number;
  ambientLight: number;
}

export interface AnimationState {
  preset: 'none' | 'rotate' | 'float' | 'pulse' | 'reveal';
  speed: number;
  amplitude: number;
  isPlaying: boolean;
}

// Updated to match the expected Effect interface
export interface EffectLayer {
  id: string;
  type: 'chrome' | 'holographic' | 'glow' | 'particle' | 'distortion';
  enabled: boolean;
  intensity: number;
  opacity: number;
  blendMode: 'normal' | 'multiply' | 'screen' | 'overlay';
  parameters: Record<string, any>;
}

export interface StudioState {
  environment: EnvironmentState;
  material: MaterialState;
  lighting: LightingState;
  animation: AnimationState;
  effectLayers: EffectLayer[];
  selectedCard: any;
  viewMode: '2d' | '3d';
  renderQuality: 'low' | 'medium' | 'high' | 'ultra';
  history: any[];
  historyIndex: number;
}

type StudioAction =
  | { type: 'UPDATE_ENVIRONMENT'; payload: Partial<EnvironmentState> }
  | { type: 'UPDATE_MATERIAL'; payload: Partial<MaterialState> }
  | { type: 'UPDATE_LIGHTING'; payload: Partial<LightingState> }
  | { type: 'UPDATE_ANIMATION'; payload: Partial<AnimationState> }
  | { type: 'ADD_EFFECT_LAYER'; payload: EffectLayer }
  | { type: 'UPDATE_EFFECT_LAYER'; payload: { id: string; updates: Partial<EffectLayer> } }
  | { type: 'REMOVE_EFFECT_LAYER'; payload: string }
  | { type: 'SET_SELECTED_CARD'; payload: any }
  | { type: 'SET_VIEW_MODE'; payload: '2d' | '3d' }
  | { type: 'SET_RENDER_QUALITY'; payload: 'low' | 'medium' | 'high' | 'ultra' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SAVE_STATE' };

const initialState: StudioState = {
  environment: {
    preset: 'studio',
    backgroundBlur: 50,
    backgroundBrightness: 75,
    hdriIntensity: 1.0
  },
  material: {
    preset: 'standard',
    metalness: 30,
    roughness: 60,
    transparency: 0,
    emission: 0
  },
  lighting: {
    preset: 'studio',
    intensity: 80,
    colorTemperature: 5500,
    shadowIntensity: 40,
    ambientLight: 30
  },
  animation: {
    preset: 'none',
    speed: 50,
    amplitude: 75,
    isPlaying: false
  },
  effectLayers: [],
  selectedCard: null,
  viewMode: '3d',
  renderQuality: 'high',
  history: [],
  historyIndex: -1
};

function studioReducer(state: StudioState, action: StudioAction): StudioState {
  switch (action.type) {
    case 'UPDATE_ENVIRONMENT':
      return {
        ...state,
        environment: { ...state.environment, ...action.payload }
      };
    case 'UPDATE_MATERIAL':
      return {
        ...state,
        material: { ...state.material, ...action.payload }
      };
    case 'UPDATE_LIGHTING':
      return {
        ...state,
        lighting: { ...state.lighting, ...action.payload }
      };
    case 'UPDATE_ANIMATION':
      return {
        ...state,
        animation: { ...state.animation, ...action.payload }
      };
    case 'ADD_EFFECT_LAYER':
      return {
        ...state,
        effectLayers: [...state.effectLayers, action.payload]
      };
    case 'UPDATE_EFFECT_LAYER':
      return {
        ...state,
        effectLayers: state.effectLayers.map(layer =>
          layer.id === action.payload.id
            ? { ...layer, ...action.payload.updates }
            : layer
        )
      };
    case 'REMOVE_EFFECT_LAYER':
      return {
        ...state,
        effectLayers: state.effectLayers.filter(layer => layer.id !== action.payload)
      };
    case 'SET_SELECTED_CARD':
      return {
        ...state,
        selectedCard: action.payload
      };
    case 'SET_VIEW_MODE':
      return {
        ...state,
        viewMode: action.payload
      };
    case 'SET_RENDER_QUALITY':
      return {
        ...state,
        renderQuality: action.payload
      };
    default:
      return state;
  }
}

interface StudioContextValue {
  state: StudioState;
  updateEnvironment: (updates: Partial<EnvironmentState>) => void;
  updateMaterial: (updates: Partial<MaterialState>) => void;
  updateLighting: (updates: Partial<LightingState>) => void;
  updateAnimation: (updates: Partial<AnimationState>) => void;
  addEffectLayer: (layer: Omit<EffectLayer, 'id'>) => void;
  updateEffectLayer: (id: string, updates: Partial<EffectLayer>) => void;
  removeEffectLayer: (id: string) => void;
  setSelectedCard: (card: any) => void;
  setViewMode: (mode: '2d' | '3d') => void;
  setRenderQuality: (quality: 'low' | 'medium' | 'high' | 'ultra') => void;
  applyPreset: (category: string, preset: string) => void;
}

const AdvancedStudioContext = createContext<StudioContextValue | null>(null);

export const AdvancedStudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(studioReducer, initialState);

  const updateEnvironment = useCallback((updates: Partial<EnvironmentState>) => {
    dispatch({ type: 'UPDATE_ENVIRONMENT', payload: updates });
  }, []);

  const updateMaterial = useCallback((updates: Partial<MaterialState>) => {
    dispatch({ type: 'UPDATE_MATERIAL', payload: updates });
  }, []);

  const updateLighting = useCallback((updates: Partial<LightingState>) => {
    dispatch({ type: 'UPDATE_LIGHTING', payload: updates });
  }, []);

  const updateAnimation = useCallback((updates: Partial<AnimationState>) => {
    dispatch({ type: 'UPDATE_ANIMATION', payload: updates });
  }, []);

  const addEffectLayer = useCallback((layer: Omit<EffectLayer, 'id'>) => {
    const newLayer: EffectLayer = {
      ...layer,
      id: `effect-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    dispatch({ type: 'ADD_EFFECT_LAYER', payload: newLayer });
    toast.success(`${layer.type} effect added`);
  }, []);

  const updateEffectLayer = useCallback((id: string, updates: Partial<EffectLayer>) => {
    dispatch({ type: 'UPDATE_EFFECT_LAYER', payload: { id, updates } });
  }, []);

  const removeEffectLayer = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_EFFECT_LAYER', payload: id });
    toast.success('Effect removed');
  }, []);

  const setSelectedCard = useCallback((card: any) => {
    dispatch({ type: 'SET_SELECTED_CARD', payload: card });
  }, []);

  const setViewMode = useCallback((mode: '2d' | '3d') => {
    dispatch({ type: 'SET_VIEW_MODE', payload: mode });
  }, []);

  const setRenderQuality = useCallback((quality: 'low' | 'medium' | 'high' | 'ultra') => {
    dispatch({ type: 'SET_RENDER_QUALITY', payload: quality });
  }, []);

  const applyPreset = useCallback((category: string, preset: string) => {
    switch (category) {
      case 'environment':
        const envPresets = {
          studio: { backgroundBlur: 20, backgroundBrightness: 85, hdriIntensity: 1.2 },
          nature: { backgroundBlur: 60, backgroundBrightness: 90, hdriIntensity: 1.5 },
          sunset: { backgroundBlur: 40, backgroundBrightness: 70, hdriIntensity: 1.8 },
          neon: { backgroundBlur: 30, backgroundBrightness: 60, hdriIntensity: 2.0 }
        };
        updateEnvironment({ preset: preset as any, ...envPresets[preset as keyof typeof envPresets] });
        break;
      case 'material':
        const matPresets = {
          standard: { metalness: 10, roughness: 80, transparency: 0 },
          metallic: { metalness: 90, roughness: 20, transparency: 0 },
          chrome: { metalness: 100, roughness: 5, transparency: 0 },
          crystal: { metalness: 0, roughness: 0, transparency: 20 },
          holographic: { metalness: 50, roughness: 10, transparency: 5 }
        };
        updateMaterial({ preset: preset as any, ...matPresets[preset as keyof typeof matPresets] });
        break;
      case 'lighting':
        const lightPresets = {
          studio: { intensity: 80, colorTemperature: 5500, shadowIntensity: 40 },
          dramatic: { intensity: 95, colorTemperature: 3200, shadowIntensity: 80 },
          soft: { intensity: 60, colorTemperature: 6500, shadowIntensity: 20 },
          neon: { intensity: 70, colorTemperature: 8000, shadowIntensity: 60 }
        };
        updateLighting({ preset: preset as any, ...lightPresets[preset as keyof typeof lightPresets] });
        break;
    }
    toast.success(`Applied ${preset} preset`);
  }, [updateEnvironment, updateMaterial, updateLighting]);

  const value: StudioContextValue = {
    state,
    updateEnvironment,
    updateMaterial,
    updateLighting,
    updateAnimation,
    addEffectLayer,
    updateEffectLayer,
    removeEffectLayer,
    setSelectedCard,
    setViewMode,
    setRenderQuality,
    applyPreset
  };

  return (
    <AdvancedStudioContext.Provider value={value}>
      {children}
    </AdvancedStudioContext.Provider>
  );
};

export const useAdvancedStudio = () => {
  const context = useContext(AdvancedStudioContext);
  if (!context) {
    throw new Error('useAdvancedStudio must be used within AdvancedStudioProvider');
  }
  return context;
};
