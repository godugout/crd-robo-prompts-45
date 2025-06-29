
// Unified PSD type definitions
export interface LayerBounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface LayerProperties {
  opacity: number;
  blendMode?: string;
  visible: boolean;
  locked?: boolean;
}

export interface ExtractedLayerImage {
  id: string;
  name: string;
  imageUrl: string;
  thumbnailUrl: string;
  bounds: LayerBounds;
  width: number;
  height: number;
  properties: LayerProperties;
}

export interface ProcessedPSDLayer {
  id: string;
  name: string;
  bounds: LayerBounds;
  properties: LayerProperties;
  semanticType?: string;
  hasRealImage: boolean;
  imageUrl?: string;
  thumbnailUrl?: string;
}

export interface ExtractedPSDImages {
  flattenedImageUrl: string;
  layerImages: ExtractedLayerImage[];
  thumbnailUrl: string;
  archiveUrls: {
    originalPsd: string;
    layerArchive: string;
  };
}

export interface ProcessedPSD {
  id: string;
  fileName: string;
  width: number;
  height: number;
  layers: ProcessedPSDLayer[];
  totalLayers: number;
  metadata?: {
    documentName?: string;
    colorMode?: string;
    created?: string;
  };
}

export interface EnhancedProcessedPSD extends ProcessedPSD {
  extractedImages: ExtractedPSDImages;
  layerPreviews: Map<string, string>;
}
