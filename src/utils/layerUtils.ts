
import { ProcessedPSDLayer } from '@/services/psdProcessor/psdProcessingService';

export const calculateLayerVolume = (layer: ProcessedPSDLayer): number => {
  const width = layer.bounds.right - layer.bounds.left;
  const height = layer.bounds.bottom - layer.bounds.top;
  return Math.max(0, width * height);
};

export const findLargestLayerByVolume = (layers: ProcessedPSDLayer[]): string => {
  if (layers.length === 0) return '';
  
  let largestLayer = layers[0];
  let maxVolume = calculateLayerVolume(largestLayer);
  
  for (const layer of layers) {
    const volume = calculateLayerVolume(layer);
    if (volume > maxVolume) {
      maxVolume = volume;
      largestLayer = layer;
    }
  }
  
  return largestLayer.id;
};
