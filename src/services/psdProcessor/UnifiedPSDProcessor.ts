import { Psd } from 'ag-psd';
import { ProcessedPSDLayer, LayerBounds, LayerProperties, ProcessedPSD } from '@/types/psdTypes';

// Utility function to check if a layer name contains certain keywords
const containsKeyword = (layerName: string, keywords: string[]): boolean => {
  const lowerName = layerName.toLowerCase();
  return keywords.some(keyword => lowerName.includes(keyword));
};

// Heuristic function to infer semantic type based on layer properties
const inferLayerSemanticType = (layer: any): string => {
  if (!layer || !layer.name) return 'unknown';

  const layerName = layer.name.toLowerCase();

  if (containsKeyword(layerName, ['avatar', 'player', 'profile'])) {
    return 'player';
  }

  if (containsKeyword(layerName, ['background', 'backdrop', 'bg'])) {
    return 'background';
  }

  if (containsKeyword(layerName, ['logo', 'emblem', 'icon'])) {
    return 'logo';
  }

  if (containsKeyword(layerName, ['stats', 'score', 'timer'])) {
    return 'stats';
  }

  if (containsKeyword(layerName, ['button', 'cta', 'call-to-action'])) {
    return 'button';
  }

  if (containsKeyword(layerName, ['text', 'label', 'title'])) {
    return 'text';
  }

  if (containsKeyword(layerName, ['image', 'photo', 'picture'])) {
    return 'image';
  }

  return 'unknown';
};

export class UnifiedPSDProcessor {
  private psd: Psd;
  private flattenedImageUrl: string | null = null;
  private transparentFlattenedImageUrl: string | null = null;
  private thumbnailUrl: string | null = null;

  constructor(psd: Psd) {
    this.psd = psd;
  }

  public async process(): Promise<ProcessedPSD> {
    const layers = this.processLayers(this.psd.children || []);

    return {
      id: 'psd_123', // Generate a proper unique ID here
      fileName: 'example.psd', // Extract file name if available
      width: this.psd.width || 0,
      height: this.psd.height || 0,
      layers: layers,
      totalLayers: layers.length,
      metadata: {
        documentName: this.psd.documentName,
        colorMode: this.psd.header.colorMode,
        created: new Date().toISOString()
      },
      flattenedImageUrl: this.flattenedImageUrl || 'url_to_flattened_image',
      transparentFlattenedImageUrl: this.transparentFlattenedImageUrl || 'url_to_transparent_flattened_image',
      thumbnailUrl: this.thumbnailUrl || 'url_to_thumbnail',
      layerImages: [] // Populate this with actual extracted image data
    };
  }

  private processLayers(layerData: any[], parentName: string = 'root'): ProcessedPSDLayer[] {
    const layers: ProcessedPSDLayer[] = [];
    layerData.forEach((layer, index) => {
      const layerIndex = index;
      const processedLayer = this.processLayer(layer, layerIndex);
      layers.push(processedLayer);

      if (layer.children && layer.children.length > 0) {
        const groupName = layer.name || `Group ${index + 1}`;
        const childLayers = this.processLayers(layer.children, groupName);
        layers.push(...childLayers);
      }
    });
    return layers;
  }

  private inferSemanticType(layer: any): string {
    return inferLayerSemanticType(layer);
  }

  private processLayer(layer: any, layerIndex: number): ProcessedPSDLayer {
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

    return {
      id: `layer_${layerIndex}`,
      name: layer.name || `Layer ${layerIndex}`,
      bounds,
      properties,
      semanticType: this.inferSemanticType(layer),
      hasRealImage: !!(layer.canvas || layer.imageData),
      layerIndex: layerIndex, // Add the missing layerIndex property
      type: layer.type || 'layer',
      isVisible: properties.visible,
      opacity: properties.opacity,
      confidence: 0.8
    };
  }
}
