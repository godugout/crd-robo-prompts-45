
import { Psd } from 'ag-psd';
import { ProcessedPSDLayer, LayerBounds, LayerProperties } from '@/types/psdTypes';

export interface PSDProcessingResult {
  layers: ProcessedPSDLayer[];
  width: number;
  height: number;
  totalLayers: number;
}

export const processPSDLayers = (psd: Psd): PSDProcessingResult => {
  const layers: ProcessedPSDLayer[] = [];
  let layerIndex = 0;

  const processLayer = (layer: any): ProcessedPSDLayer => {
    const bounds: LayerBounds = {
      left: layer.left || 0,
      top: layer.top || 0,
      right: layer.right || layer.left || 0,
      bottom: layer.bottom || layer.top || 0
    };

    const properties: LayerProperties = {
      opacity: (layer.opacity || 255) / 255,
      blendMode: layer.blendMode || 'normal',
      visible: layer.visible !== false,
      locked: layer.locked || false
    };

    const currentLayerIndex = layerIndex++;

    return {
      id: `layer_${currentLayerIndex}`,
      name: layer.name || `Layer ${currentLayerIndex}`,
      bounds,
      properties,
      hasRealImage: !!(layer.canvas || layer.imageData),
      layerIndex: currentLayerIndex, // Add the layerIndex property
      type: layer.type || 'layer',
      isVisible: properties.visible,
      opacity: properties.opacity,
      confidence: 0.8
    };
  };

  if (psd.children) {
    psd.children.forEach(layer => {
      layers.push(processLayer(layer));
    });
  }

  return {
    layers,
    width: psd.width || 0,
    height: psd.height || 0,
    totalLayers: layers.length
  };
};
