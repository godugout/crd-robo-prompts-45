
import { useState, useEffect, useRef, useCallback } from 'react';
import type { EffectValues } from './useEnhancedCardEffects';

export interface MaterialLoadingState {
  phase: 'idle' | 'preparing' | 'applying' | 'rendering' | 'complete';
  progress: number;
  message: string;
  isLoading: boolean;
  materialName?: string;
}

export const useMaterialLoadingState = (effectValues: EffectValues) => {
  const [loadingState, setLoadingState] = useState<MaterialLoadingState>({
    phase: 'idle',
    progress: 0,
    message: 'Ready',
    isLoading: false
  });

  const loadingTimeoutRef = useRef<NodeJS.Timeout>();
  const progressIntervalRef = useRef<NodeJS.Timeout>();
  const lastEffectsRef = useRef<string>('');

  // Create signature for effect values to detect changes
  const getEffectsSignature = useCallback((effects: EffectValues): string => {
    return Object.entries(effects)
      .filter(([_, params]) => (params.intensity as number) > 0)
      .map(([id, params]) => `${id}:${params.intensity}`)
      .sort()
      .join('|');
  }, []);

  // Detect when effects change and trigger loading
  useEffect(() => {
    const currentSignature = getEffectsSignature(effectValues);
    
    if (currentSignature !== lastEffectsRef.current && currentSignature !== '') {
      lastEffectsRef.current = currentSignature;
      
      // Find dominant effect for material name
      const activeEffects = Object.entries(effectValues).filter(([_, params]) => 
        (params.intensity as number) > 0
      );
      
      const dominantEffect = activeEffects.reduce((max, current) => 
        (current[1].intensity as number) > (max[1].intensity as number) ? current : max
      );

      const materialNames: Record<string, string> = {
        holographic: 'Holographic',
        crystal: 'Crystal',
        chrome: 'Chrome',
        gold: 'Gold',
        vintage: 'Vintage',
        prizm: 'Prizm',
        interference: 'Ice Crystal',
        foilspray: 'Starlight'
      };

      const materialName = materialNames[dominantEffect[0]] || 'Default';
      
      console.log('🔄 Material loading triggered for:', materialName);
      startLoading(materialName);
    }
  }, [effectValues, getEffectsSignature]);

  const startLoading = useCallback((materialName: string) => {
    // Clear any existing timers
    if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

    setLoadingState({
      phase: 'preparing',
      progress: 0,
      message: `Preparing ${materialName} Material...`,
      isLoading: true,
      materialName
    });

    let progress = 0;
    
    // Simulate loading progress
    progressIntervalRef.current = setInterval(() => {
      progress += Math.random() * 15 + 5; // 5-20% increments
      
      if (progress < 30) {
        setLoadingState(prev => ({
          ...prev,
          phase: 'preparing',
          progress: Math.min(progress, 30),
          message: `Preparing ${materialName} Material...`
        }));
      } else if (progress < 70) {
        setLoadingState(prev => ({
          ...prev,
          phase: 'applying',
          progress: Math.min(progress, 70),
          message: `Applying ${materialName} Effects...`
        }));
      } else if (progress < 90) {
        setLoadingState(prev => ({
          ...prev,
          phase: 'rendering',
          progress: Math.min(progress, 90),
          message: `Rendering ${materialName} Surface...`
        }));
      } else {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
        
        setLoadingState({
          phase: 'complete',
          progress: 100,
          message: `${materialName} Material Ready!`,
          isLoading: false,
          materialName
        });
        
        // Auto-hide after completion
        setTimeout(() => {
          setLoadingState(prev => ({
            ...prev,
            phase: 'idle',
            message: 'Ready'
          }));
        }, 1000);
      }
    }, 100);

    // Safety timeout to prevent infinite loading
    loadingTimeoutRef.current = setTimeout(() => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      
      setLoadingState({
        phase: 'complete',
        progress: 100,
        message: `${materialName} Material Ready!`,
        isLoading: false,
        materialName
      });
    }, 3000);
  }, []);

  const forceComplete = useCallback(() => {
    if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    
    setLoadingState(prev => ({
      phase: 'complete',
      progress: 100,
      message: `${prev.materialName || 'Material'} Ready!`,
      isLoading: false,
      materialName: prev.materialName
    }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  return {
    loadingState,
    forceComplete
  };
};
