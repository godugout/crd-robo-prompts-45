
import { useState, useCallback, useMemo, startTransition, useRef } from 'react';
import { useEffectCache } from './useEffectCache';
import { usePerformanceMonitor } from './usePerformanceMonitor';
import { OPTIMIZED_PRESETS, detectDevicePerformance, getPresetsForPerformanceLevel } from '../config/optimizedPresets';

export interface EffectParameter {
  id: string;
  name: string;
  type: 'slider' | 'toggle' | 'color' | 'select';
  min?: number;
  max?: number;
  step?: number;
  defaultValue: number | boolean | string;
  options?: { value: string; label: string }[];
}

export interface VisualEffectConfig {
  id: string;
  name: string;
  description: string;
  category: 'metallic' | 'prismatic' | 'surface' | 'vintage';
  parameters: EffectParameter[];
}

export interface EffectValues {
  [effectId: string]: {
    [parameterId: string]: number | boolean | string;
  };
}

// Define all visual effects with their unique parameters
export const ENHANCED_VISUAL_EFFECTS: VisualEffectConfig[] = [
  {
    id: 'holographic',
    name: 'Holographic',
    description: 'Dynamic rainbow shifting with prismatic effects',
    category: 'prismatic',
    parameters: [
      { id: 'intensity', name: 'Intensity', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 0 },
      { id: 'shiftSpeed', name: 'Color Shift Speed', type: 'slider', min: 0, max: 200, step: 5, defaultValue: 100 },
      { id: 'rainbowSpread', name: 'Rainbow Spread', type: 'slider', min: 0, max: 360, step: 10, defaultValue: 180 },
      { id: 'animated', name: 'Animated', type: 'toggle', defaultValue: true }
    ]
  },
  {
    id: 'foilspray',
    name: 'Foil Spray',
    description: 'Metallic spray pattern with directional flow',
    category: 'metallic',
    parameters: [
      { id: 'intensity', name: 'Intensity', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 0 },
      { id: 'density', name: 'Metallic Density', type: 'slider', min: 10, max: 100, step: 5, defaultValue: 50 },
      { id: 'direction', name: 'Flow Direction', type: 'slider', min: 0, max: 360, step: 15, defaultValue: 45 }
    ]
  },
  {
    id: 'prizm',
    name: 'Prizm',
    description: 'Geometric prismatic patterns with color separation',
    category: 'prismatic',
    parameters: [
      { id: 'intensity', name: 'Intensity', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 0 },
      { id: 'complexity', name: 'Pattern Complexity', type: 'slider', min: 1, max: 10, step: 1, defaultValue: 5 },
      { id: 'colorSeparation', name: 'Color Separation', type: 'slider', min: 0, max: 100, step: 5, defaultValue: 60 }
    ]
  },
  {
    id: 'chrome',
    name: 'Chrome',
    description: 'Metallic chrome finish with mirror-like reflections',
    category: 'metallic',
    parameters: [
      { id: 'intensity', name: 'Intensity', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 0 },
      { id: 'sharpness', name: 'Reflection Sharpness', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 70 },
      { id: 'highlightSize', name: 'Highlight Size', type: 'slider', min: 10, max: 90, step: 5, defaultValue: 40 }
    ]
  },
  {
    id: 'interference',
    name: 'Interference',
    description: 'Soap bubble interference patterns',
    category: 'surface',
    parameters: [
      { id: 'intensity', name: 'Intensity', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 0 },
      { id: 'frequency', name: 'Wave Frequency', type: 'slider', min: 1, max: 20, step: 1, defaultValue: 8 },
      { id: 'thickness', name: 'Bubble Thickness', type: 'slider', min: 1, max: 10, step: 0.5, defaultValue: 3 }
    ]
  },
  {
    id: 'brushedmetal',
    name: 'Brushed Metal',
    description: 'Brushed metallic surface with directional grain',
    category: 'metallic',
    parameters: [
      { id: 'intensity', name: 'Intensity', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 0 },
      { id: 'direction', name: 'Brush Direction', type: 'slider', min: 0, max: 180, step: 15, defaultValue: 45 },
      { id: 'grainDensity', name: 'Grain Density', type: 'slider', min: 1, max: 20, step: 1, defaultValue: 8 }
    ]
  },
  {
    id: 'crystal',
    name: 'Crystal',
    description: 'Crystalline faceted surface with light dispersion',
    category: 'prismatic',
    parameters: [
      { id: 'intensity', name: 'Intensity', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 0 },
      { id: 'facets', name: 'Facet Count', type: 'slider', min: 3, max: 20, step: 1, defaultValue: 8 },
      { id: 'dispersion', name: 'Light Dispersion', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 60 },
      { id: 'clarity', name: 'Crystal Clarity', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 60 },
      { id: 'sparkle', name: 'Sparkle Effect', type: 'toggle', defaultValue: true }
    ]
  },
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Aged patina with wear patterns',
    category: 'vintage',
    parameters: [
      { id: 'intensity', name: 'Intensity', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 0 },
      { id: 'aging', name: 'Aging Level', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 40 },
      { id: 'patina', name: 'Patina Color', type: 'color', defaultValue: '#8b7355' }
    ]
  },
  {
    id: 'gold',
    name: 'Gold',
    description: 'Luxurious gold plating with authentic shimmer',
    category: 'metallic',
    parameters: [
      { id: 'intensity', name: 'Intensity', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 0 },
      { id: 'shimmerSpeed', name: 'Shimmer Speed', type: 'slider', min: 0, max: 200, step: 5, defaultValue: 80 },
      { id: 'platingThickness', name: 'Plating Thickness', type: 'slider', min: 1, max: 10, step: 0.5, defaultValue: 5 },
      { id: 'goldTone', name: 'Gold Tone', type: 'select', defaultValue: 'rich', 
        options: [
          { value: 'rich', label: 'Rich Gold' },
          { value: 'rose', label: 'Rose Gold' },
          { value: 'white', label: 'White Gold' },
          { value: 'antique', label: 'Antique Gold' }
        ]
      },
      { id: 'reflectivity', name: 'Reflectivity', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 85 },
      { id: 'colorEnhancement', name: 'Yellow Enhancement', type: 'toggle', defaultValue: true }
    ]
  }
];

// Enhanced state interface for tracking preset application with locks
interface PresetApplicationState {
  isApplying: boolean;
  currentPresetId?: string;
  appliedAt: number;
  isLocked: boolean;
}

export const useEnhancedCardEffects = () => {
  // Initialize caching and performance monitoring
  const effectCache = useEffectCache({ maxSize: 100, ttl: 600000 }); // 10 minutes TTL
  const performanceMonitor = usePerformanceMonitor();
  
  // Detect device performance level
  const devicePerformance = useMemo(() => detectDevicePerformance(), []);
  
  const [effectValues, setEffectValues] = useState<EffectValues>(() => {
    const initialValues: EffectValues = {};
    ENHANCED_VISUAL_EFFECTS.forEach(effect => {
      initialValues[effect.id] = {};
      effect.parameters.forEach(param => {
        initialValues[effect.id][param.id] = param.defaultValue;
      });
    });
    return initialValues;
  });

  // Enhanced preset application state with synchronization
  const [presetState, setPresetState] = useState<PresetApplicationState>({
    isApplying: false,
    appliedAt: 0,
    isLocked: false
  });

  // Refs for debouncing and cleanup
  const presetTimeoutRef = useRef<NodeJS.Timeout>();
  const lockTimeoutRef = useRef<NodeJS.Timeout>();

  // Memoize default values to prevent unnecessary recalculations
  const defaultEffectValues = useMemo(() => {
    const defaults: EffectValues = {};
    ENHANCED_VISUAL_EFFECTS.forEach(effect => {
      defaults[effect.id] = {};
      effect.parameters.forEach(param => {
        defaults[effect.id][param.id] = param.defaultValue;
      });
    });
    return defaults;
  }, []);

  // Memoized optimized presets for current device
  const availablePresets = useMemo(() => {
    const qualityLevel = performanceMonitor.getAdaptiveQualityLevel();
    return getPresetsForPerformanceLevel(qualityLevel);
  }, [performanceMonitor]);

  // Performance-aware effect change handler
  const handleEffectChange = useCallback((effectId: string, parameterId: string, value: number | boolean | string) => {
    console.log('🎛️ Effect Change:', { effectId, parameterId, value });
    
    performanceMonitor.startMeasurement();
    
    // Clear preset state when manual changes are made (unless currently applying a preset)
    if (!presetState.isApplying && !presetState.isLocked) {
      setPresetState(prev => ({ ...prev, currentPresetId: undefined }));
    }
    
    setEffectValues(prev => {
      const newValues = {
        ...prev,
        [effectId]: {
          ...prev[effectId],
          [parameterId]: value
        }
      };
      
      // Clear cache if significant change
      if (parameterId === 'intensity' && typeof value === 'number' && value === 0) {
        effectCache.clearCache();
      }
      
      return newValues;
    });
    
    performanceMonitor.endMeasurement();
  }, [presetState.isApplying, presetState.isLocked, performanceMonitor, effectCache]);

  const resetEffect = useCallback((effectId: string) => {
    console.log('🔄 Resetting effect:', effectId);
    const effect = ENHANCED_VISUAL_EFFECTS.find(e => e.id === effectId);
    if (effect) {
      const resetValues: Record<string, any> = {};
      effect.parameters.forEach(param => {
        resetValues[param.id] = param.defaultValue;
      });
      setEffectValues(prev => ({
        ...prev,
        [effectId]: resetValues
      }));
    }
  }, []);

  const resetAllEffects = useCallback(() => {
    console.log('🔄 Resetting all effects');
    
    // Clear any pending timeouts
    if (presetTimeoutRef.current) {
      clearTimeout(presetTimeoutRef.current);
    }
    if (lockTimeoutRef.current) {
      clearTimeout(lockTimeoutRef.current);
    }
    
    // Clear effect cache
    effectCache.clearCache();
    
    setPresetState({ isApplying: false, appliedAt: Date.now(), isLocked: false });
    setEffectValues(defaultEffectValues);
  }, [defaultEffectValues, effectCache]);

  // Enhanced atomic preset application with caching
  const applyPreset = useCallback((preset: EffectValues, presetId?: string) => {
    console.log('🎨 Applying optimized preset with caching:', { presetId, preset });
    
    // Prevent overlapping applications
    if (presetState.isLocked) {
      console.log('⚠️ Preset application blocked - currently locked');
      return;
    }
    
    // Check cache first
    const cachedStyles = effectCache.getCachedStyles(preset);
    if (cachedStyles) {
      console.log('🚀 Using cached preset styles for instant application');
    }
    
    // Clear any existing timeouts
    if (presetTimeoutRef.current) {
      clearTimeout(presetTimeoutRef.current);
    }
    if (lockTimeoutRef.current) {
      clearTimeout(lockTimeoutRef.current);
    }
    
    performanceMonitor.startMeasurement();
    
    // Set synchronization lock
    setPresetState({ 
      isApplying: true, 
      currentPresetId: presetId, 
      appliedAt: Date.now(),
      isLocked: true 
    });
    
    // Use startTransition for smooth updates with forced reset
    startTransition(() => {
      // Step 1: Force complete reset to defaults
      const resetValues = { ...defaultEffectValues };
      setEffectValues(resetValues);
      
      // Step 2: Apply preset effects after reset
      presetTimeoutRef.current = setTimeout(() => {
        const newEffectValues = { ...defaultEffectValues };
        
        // Apply preset effects with validation
        Object.entries(preset).forEach(([effectId, effectParams]) => {
          if (newEffectValues[effectId] && effectParams) {
            Object.entries(effectParams).forEach(([paramId, value]) => {
              if (newEffectValues[effectId][paramId] !== undefined) {
                newEffectValues[effectId][paramId] = value;
              }
            });
          }
        });
        
        // Apply changes atomically
        setEffectValues(newEffectValues);
        
        // Cache the applied preset for faster future access
        if (!cachedStyles) {
          effectCache.setCachedStyles(preset, newEffectValues);
        }
        
        performanceMonitor.endMeasurement();
        
        // Release lock after material calculation time
        lockTimeoutRef.current = setTimeout(() => {
          setPresetState(prev => ({ 
            ...prev, 
            isApplying: false, 
            isLocked: false 
          }));
        }, 200); // Reduced delay with caching
        
      }, 50); // Reduced delay for better responsiveness
    });
  }, [defaultEffectValues, presetState.isLocked, effectCache, performanceMonitor]);

  // Get performance metrics
  const getPerformanceMetrics = useCallback(() => ({
    ...performanceMonitor.metrics,
    cacheStats: effectCache.getCacheStats(),
    devicePerformance,
    availablePresetsCount: availablePresets.length
  }), [performanceMonitor.metrics, effectCache, devicePerformance, availablePresets]);

  return {
    effectValues,
    handleEffectChange,
    resetEffect,
    resetAllEffects,
    applyPreset,
    presetState,
    isApplyingPreset: presetState.isApplying || presetState.isLocked,
    availablePresets,
    getPerformanceMetrics,
    devicePerformance
  };
};
