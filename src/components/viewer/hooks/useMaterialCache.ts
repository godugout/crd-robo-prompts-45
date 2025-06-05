
import { useState, useEffect, useCallback, useRef } from 'react';
import type { EffectValues } from './useEnhancedCardEffects';
import type { CardBackMaterial } from './useDynamicCardBackMaterials';

interface CachedMaterial {
  id: string;
  css: React.CSSProperties;
  timestamp: number;
}

interface MaterialCacheState {
  materials: Map<string, CachedMaterial>;
  isLoading: boolean;
  currentMaterial?: CardBackMaterial;
}

export const useMaterialCache = () => {
  const [cacheState, setCacheState] = useState<MaterialCacheState>({
    materials: new Map(),
    isLoading: false
  });
  
  const cacheTimeoutRef = useRef<NodeJS.Timeout>();
  
  // Load cache from localStorage on mount
  useEffect(() => {
    const loadCache = () => {
      try {
        const cached = localStorage.getItem('cardMaterialCache');
        if (cached) {
          const parsed = JSON.parse(cached);
          const materialsMap = new Map();
          
          Object.entries(parsed).forEach(([key, value]: [string, any]) => {
            // Only load recent cache entries (last 24 hours)
            if (Date.now() - value.timestamp < 24 * 60 * 60 * 1000) {
              materialsMap.set(key, value);
            }
          });
          
          setCacheState(prev => ({ ...prev, materials: materialsMap }));
          console.log('📦 Loaded material cache with', materialsMap.size, 'entries');
        }
      } catch (error) {
        console.warn('Failed to load material cache:', error);
      }
    };
    
    loadCache();
  }, []);
  
  // Generate cache key from effect values
  const generateCacheKey = useCallback((effectValues: EffectValues): string => {
    const activeEffects = Object.entries(effectValues)
      .filter(([_, params]) => (params.intensity as number) > 0)
      .map(([id, params]) => `${id}:${params.intensity}`)
      .sort()
      .join('|');
    
    return activeEffects || 'default';
  }, []);
  
  // Get cached material CSS
  const getCachedMaterial = useCallback((effectValues: EffectValues): React.CSSProperties | null => {
    const key = generateCacheKey(effectValues);
    const cached = cacheState.materials.get(key);
    
    if (cached) {
      console.log('💾 Using cached material for:', key);
      return cached.css;
    }
    
    return null;
  }, [cacheState.materials, generateCacheKey]);
  
  // Cache material CSS
  const cacheMaterial = useCallback((effectValues: EffectValues, material: CardBackMaterial) => {
    const key = generateCacheKey(effectValues);
    
    const cssProperties: React.CSSProperties = {
      background: material.background,
      borderColor: material.borderColor,
      opacity: material.opacity,
      backdropFilter: material.blur ? `blur(${material.blur}px)` : undefined,
      boxShadow: `0 0 30px ${material.borderColor}, inset 0 0 20px rgba(255, 255, 255, 0.1)`
    };
    
    const cachedMaterial: CachedMaterial = {
      id: material.id,
      css: cssProperties,
      timestamp: Date.now()
    };
    
    setCacheState(prev => {
      const newMaterials = new Map(prev.materials);
      newMaterials.set(key, cachedMaterial);
      
      // Debounced save to localStorage
      if (cacheTimeoutRef.current) {
        clearTimeout(cacheTimeoutRef.current);
      }
      
      cacheTimeoutRef.current = setTimeout(() => {
        try {
          const cacheObject = Object.fromEntries(newMaterials);
          localStorage.setItem('cardMaterialCache', JSON.stringify(cacheObject));
          console.log('💾 Saved material cache with', newMaterials.size, 'entries');
        } catch (error) {
          console.warn('Failed to save material cache:', error);
        }
      }, 500);
      
      return { ...prev, materials: newMaterials };
    });
    
    console.log('💾 Cached material:', key, material.name);
  }, [generateCacheKey]);
  
  // Check if material is cached
  const isCached = useCallback((effectValues: EffectValues): boolean => {
    const key = generateCacheKey(effectValues);
    return cacheState.materials.has(key);
  }, [cacheState.materials, generateCacheKey]);
  
  // Clear old cache entries
  const clearOldCache = useCallback(() => {
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000; // 7 days
    
    setCacheState(prev => {
      const newMaterials = new Map();
      
      prev.materials.forEach((value, key) => {
        if (value.timestamp > cutoff) {
          newMaterials.set(key, value);
        }
      });
      
      return { ...prev, materials: newMaterials };
    });
  }, []);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cacheTimeoutRef.current) {
        clearTimeout(cacheTimeoutRef.current);
      }
    };
  }, []);
  
  return {
    getCachedMaterial,
    cacheMaterial,
    isCached,
    clearOldCache,
    cacheSize: cacheState.materials.size
  };
};
