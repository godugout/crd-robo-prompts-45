
import { ProcessedPSDLayer } from '@/types/psdTypes';

export const findLargestLayerByVolume = (layers: ProcessedPSDLayer[]): string | null => {
  if (!layers || layers.length === 0) return null;
  
  let largestLayer = layers[0];
  let largestVolume = 0;
  
  for (const layer of layers) {
    const width = layer.bounds.right - layer.bounds.left;
    const height = layer.bounds.bottom - layer.bounds.top;
    const volume = width * height;
    
    if (volume > largestVolume) {
      largestVolume = volume;
      largestLayer = layer;
    }
  }
  
  return largestLayer.id;
};

export const calculateLayerArea = (layer: ProcessedPSDLayer): number => {
  const width = layer.bounds.right - layer.bounds.left;
  const height = layer.bounds.bottom - layer.bounds.top;
  return Math.max(0, width * height);
};

export const isLayerVisible = (layer: ProcessedPSDLayer): boolean => {
  return layer.properties?.visible !== false && layer.isVisible;
};

export const getLayerOpacity = (layer: ProcessedPSDLayer): number => {
  return layer.properties?.opacity ?? layer.opacity ?? 1;
};

export const getLayerDimensions = (layer: ProcessedPSDLayer): { width: number; height: number } => {
  return {
    width: Math.round(layer.bounds.right - layer.bounds.left),
    height: Math.round(layer.bounds.bottom - layer.bounds.top)
  };
};

export const filterVisibleLayers = (layers: ProcessedPSDLayer[]): ProcessedPSDLayer[] => {
  return layers.filter(isLayerVisible);
};

export const sortLayersByArea = (layers: ProcessedPSDLayer[], descending: boolean = true): ProcessedPSDLayer[] => {
  return [...layers].sort((a, b) => {
    const areaA = calculateLayerArea(a);
    const areaB = calculateLayerArea(b);
    return descending ? areaB - areaA : areaA - areaB;
  });
};
