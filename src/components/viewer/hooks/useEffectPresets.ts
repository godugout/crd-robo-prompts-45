
import { useState, useCallback, useRef, startTransition } from 'react';
import type { EffectValues } from '../types';

// Enhanced state interface for tracking preset application with locks
interface PresetApplicationState {
  isApplying: boolean;
  currentPresetId?: string;
  appliedAt: number;
  isLocked: boolean;
}

export const useEffectPresets = (
  defaultEffectValues: Record<string, Record<string, any>>,
  setEffectValues: (values: EffectValues | ((prev: EffectValues) => EffectValues)) => void
) => {
  // Enhanced preset application state with synchronization
  const [presetState, setPresetState] = useState<PresetApplicationState>({
    isApplying: false,
    appliedAt: 0,
    isLocked: false
  });

  // Refs for debouncing and cleanup
  const presetTimeoutRef = useRef<NodeJS.Timeout>();
  const lockTimeoutRef = useRef<NodeJS.Timeout>();

  // Enhanced atomic preset application with forced reset and sync locks
  const applyPreset = useCallback((preset: EffectValues, presetId?: string) => {
    console.log('🎨 Applying preset atomically with sync locks:', { presetId, preset });
    
    // Prevent overlapping applications
    if (presetState.isLocked) {
      console.log('⚠️ Preset application blocked - currently locked');
      return;
    }
    
    // Clear any existing timeouts
    if (presetTimeoutRef.current) {
      clearTimeout(presetTimeoutRef.current);
    }
    if (lockTimeoutRef.current) {
      clearTimeout(lockTimeoutRef.current);
    }
    
    // Set synchronization lock
    setPresetState({ 
      isApplying: true, 
      currentPresetId: presetId, 
      appliedAt: Date.now(),
      isLocked: true 
    });
    
    // Use startTransition for smooth updates with forced reset
    startTransition(() => {
      // Convert defaultEffectValues to proper EffectValues format
      const convertToEffectValues = (values: Record<string, Record<string, any>>): EffectValues => {
        const converted: EffectValues = {};
        Object.entries(values).forEach(([effectId, params]) => {
          converted[effectId] = {
            ...params,
            intensity: typeof params.intensity === 'number' ? params.intensity : 0
          };
        });
        return converted;
      };

      // Step 1: Force complete reset to defaults (prevents material sticking)
      const resetValues = convertToEffectValues(defaultEffectValues);
      setEffectValues(resetValues);
      
      // Step 2: Apply preset effects after a brief delay for reset to complete
      presetTimeoutRef.current = setTimeout(() => {
        const newEffectValues = convertToEffectValues(defaultEffectValues);
        
        // Apply preset effects with proper validation
        Object.entries(preset).forEach(([effectId, effectParams]) => {
          if (newEffectValues[effectId] && effectParams) {
            Object.entries(effectParams).forEach(([paramId, value]) => {
              if (newEffectValues[effectId][paramId] !== undefined) {
                newEffectValues[effectId][paramId] = value;
              }
            });
          }
        });
        
        // Apply all changes atomically
        setEffectValues(newEffectValues);
        
        // Mark application as complete and release lock after material calc time
        lockTimeoutRef.current = setTimeout(() => {
          setPresetState(prev => ({ 
            ...prev, 
            isApplying: false, 
            isLocked: false 
          }));
        }, 400); // Increased delay for material recalculation
        
      }, 100); // Brief delay for reset to complete
    });
  }, [defaultEffectValues, presetState.isLocked, setEffectValues]);

  const clearPresetState = useCallback(() => {
    setPresetState(prev => ({ ...prev, currentPresetId: undefined }));
  }, []);

  return {
    presetState,
    applyPreset,
    clearPresetState,
    isApplyingPreset: presetState.isApplying || presetState.isLocked
  };
};
