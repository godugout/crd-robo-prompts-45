
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
  return layer.properties?.visible !== false;
};

export const getLayerOpacity = (layer: ProcessedPSDLayer): number => {
  return layer.properties?.opacity ?? 1;
};
