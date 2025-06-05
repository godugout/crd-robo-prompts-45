
import { useMemo, useRef, useCallback } from 'react';
import type { EffectValues } from './useEnhancedCardEffects';

interface CacheEntry {
  effectValues: EffectValues;
  computedStyles: Record<string, any>;
  timestamp: number;
}

interface EffectCacheConfig {
  maxSize: number;
  ttl: number; // Time to live in milliseconds
}

export const useEffectCache = (config: EffectCacheConfig = { maxSize: 50, ttl: 300000 }) => {
  const cacheRef = useRef<Map<string, CacheEntry>>(new Map());
  const accessOrderRef = useRef<string[]>([]);

  // Generate cache key from effect values
  const generateCacheKey = useCallback((effectValues: EffectValues): string => {
    const sortedEntries = Object.entries(effectValues)
      .filter(([_, effect]) => {
        const intensity = effect.intensity;
        return intensity && typeof intensity === 'number' && intensity > 0;
      })
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([effectId, params]) => {
        const sortedParams = Object.entries(params)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([key, value]) => `${key}:${value}`)
          .join(',');
        return `${effectId}(${sortedParams})`;
      });
    
    return sortedEntries.join('|');
  }, []);

  // Clean expired entries
  const cleanExpiredEntries = useCallback(() => {
    const now = Date.now();
    const expiredKeys: string[] = [];
    
    cacheRef.current.forEach((entry, key) => {
      if (now - entry.timestamp > config.ttl) {
        expiredKeys.push(key);
      }
    });
    
    expiredKeys.forEach(key => {
      cacheRef.current.delete(key);
      const index = accessOrderRef.current.indexOf(key);
      if (index > -1) {
        accessOrderRef.current.splice(index, 1);
      }
    });
  }, [config.ttl]);

  // LRU eviction
  const evictLRU = useCallback(() => {
    if (accessOrderRef.current.length > 0) {
      const oldestKey = accessOrderRef.current.shift()!;
      cacheRef.current.delete(oldestKey);
    }
  }, []);

  // Get cached effect styles
  const getCachedStyles = useCallback((effectValues: EffectValues): Record<string, any> | null => {
    cleanExpiredEntries();
    
    const key = generateCacheKey(effectValues);
    const entry = cacheRef.current.get(key);
    
    if (entry) {
      // Move to end (most recently used)
      const index = accessOrderRef.current.indexOf(key);
      if (index > -1) {
        accessOrderRef.current.splice(index, 1);
      }
      accessOrderRef.current.push(key);
      
      return entry.computedStyles;
    }
    
    return null;
  }, [generateCacheKey, cleanExpiredEntries]);

  // Cache effect styles
  const setCachedStyles = useCallback((effectValues: EffectValues, computedStyles: Record<string, any>) => {
    const key = generateCacheKey(effectValues);
    
    // Evict if at capacity
    if (cacheRef.current.size >= config.maxSize) {
      evictLRU();
    }
    
    cacheRef.current.set(key, {
      effectValues: JSON.parse(JSON.stringify(effectValues)), // Deep copy
      computedStyles: JSON.parse(JSON.stringify(computedStyles)), // Deep copy
      timestamp: Date.now()
    });
    
    // Update access order
    const index = accessOrderRef.current.indexOf(key);
    if (index > -1) {
      accessOrderRef.current.splice(index, 1);
    }
    accessOrderRef.current.push(key);
  }, [generateCacheKey, config.maxSize, evictLRU]);

  // Clear cache
  const clearCache = useCallback(() => {
    cacheRef.current.clear();
    accessOrderRef.current.length = 0;
  }, []);

  // Get cache stats
  const getCacheStats = useCallback(() => ({
    size: cacheRef.current.size,
    maxSize: config.maxSize,
    hitRate: 0, // Could be implemented with counters
    oldestEntry: accessOrderRef.current[0] || null,
    newestEntry: accessOrderRef.current[accessOrderRef.current.length - 1] || null
  }), [config.maxSize]);

  return {
    getCachedStyles,
    setCachedStyles,
    clearCache,
    getCacheStats
  };
};
