
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
      layerIndex: currentLayerIndex,
      type: layer.type || 'image',
      isVisible: properties.visible,
      visible: properties.visible, // Add this for compatibility
      opacity: properties.opacity,
      blendMode: properties.blendMode,
      dimensions: {
        x: bounds.left,
        y: bounds.top,
        width: bounds.right - bounds.left,
        height: bounds.bottom - bounds.top
      },
      effects: [],
      confidence: 0.8,
      analysis: {
        isBackground: currentLayerIndex === 0,
        isText: !!layer.text,
        hasEffects: false,
        complexity: 'simple',
        semantic: {
          category: layer.text ? 'text' : 'image',
          importance: 'secondary'
        },
        spatial: {
          depth: currentLayerIndex / 10,
          parallaxFactor: 1
        },
        complexityScore: {
          score: 1,
          factors: {
            size: bounds.right - bounds.left,
            hasEffects: false,
            hasRealContent: !!(layer.canvas || layer.imageData),
            semanticImportance: 1
          }
        }
      }
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
