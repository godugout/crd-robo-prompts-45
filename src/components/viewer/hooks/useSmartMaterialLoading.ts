
import { useState, useEffect, useRef, useCallback } from 'react';
import type { EffectValues } from './useEnhancedCardEffects';
import { useMaterialCache } from './useMaterialCache';

export interface SmartLoadingState {
  isLoading: boolean;
  progress: number;
  message: string;
  materialName?: string;
}

export const useSmartMaterialLoading = (effectValues: EffectValues) => {
  const [loadingState, setLoadingState] = useState<SmartLoadingState>({
    isLoading: false,
    progress: 0,
    message: 'Ready'
  });

  const { isCached } = useMaterialCache();
  const loadingTimeoutRef = useRef<NodeJS.Timeout>();
  const lastEffectsRef = useRef<string>('');

  // Create signature for effect values
  const getEffectsSignature = useCallback((effects: EffectValues): string => {
    return Object.entries(effects)
      .filter(([_, params]) => (params.intensity as number) > 0)
      .map(([id, params]) => `${id}:${params.intensity}`)
      .sort()
      .join('|');
  }, []);

  // Only show loading for uncached, complex material combinations
  useEffect(() => {
    const currentSignature = getEffectsSignature(effectValues);
    
    if (currentSignature !== lastEffectsRef.current && currentSignature !== '') {
      lastEffectsRef.current = currentSignature;
      
      // Check if this combination is cached
      const cached = isCached(effectValues);
      
      if (cached) {
        // Instant switching for cached materials
        console.log('⚡ Instant material switch - cached');
        setLoadingState({
          isLoading: false,
          progress: 100,
          message: 'Ready'
        });
        return;
      }
      
      // Count active effects to determine complexity
      const activeEffectsCount = Object.values(effectValues).filter(
        params => (params.intensity as number) > 50 // Only high-intensity effects trigger loading
      ).length;
      
      // Only show loading for complex combinations (2+ high-intensity effects)
      if (activeEffectsCount >= 2) {
        console.log('🔄 Complex material loading for uncached combination');
        startLoading(activeEffectsCount);
      } else {
        console.log('⚡ Simple material switch - no loading needed');
        setLoadingState({
          isLoading: false,
          progress: 100,
          message: 'Ready'
        });
      }
    }
  }, [effectValues, getEffectsSignature, isCached]);

  const startLoading = useCallback((complexity: number) => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }

    setLoadingState({
      isLoading: true,
      progress: 0,
      message: 'Computing material...'
    });

    // Simulate realistic loading time based on complexity
    const loadingDuration = Math.min(800 + (complexity * 200), 1500);
    let progress = 0;
    
    const progressInterval = setInterval(() => {
      progress += Math.random() * 20 + 10;
      
      if (progress >= 100) {
        clearInterval(progressInterval);
        setLoadingState({
          isLoading: false,
          progress: 100,
          message: 'Ready'
        });
      } else {
        setLoadingState(prev => ({
          ...prev,
          progress: Math.min(progress, 95),
          message: progress < 50 ? 'Computing material...' : 'Applying effects...'
        }));
      }
    }, loadingDuration / 10);

    // Safety timeout
    loadingTimeoutRef.current = setTimeout(() => {
      clearInterval(progressInterval);
      setLoadingState({
        isLoading: false,
        progress: 100,
        message: 'Ready'
      });
    }, loadingDuration);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  return {
    loadingState,
    isReallyLoading: loadingState.isLoading
  };
};
