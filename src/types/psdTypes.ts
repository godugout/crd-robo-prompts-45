
// Unified PSD type definitions - Single source of truth
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

export interface ProcessedPSDLayer {
  id: string;
  name: string;
  bounds: LayerBounds;
  properties: LayerProperties;
  semanticType?: string;
  hasRealImage: boolean;
  imageUrl?: string;
  thumbnailUrl?: string;
  inferredDepth?: number; // Added missing property
  // Unified compatibility fields
  type: 'text' | 'image' | 'group' | 'shape' | 'layer';
  isVisible: boolean;
  opacity: number;
  confidence?: number;
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
  // Required fields for all PSD objects
  flattenedImageUrl: string;
  transparentFlattenedImageUrl?: string;
  thumbnailUrl: string;
  layerImages: ExtractedLayerImage[];
}

export interface EnhancedProcessedPSD extends ProcessedPSD {
  extractedImages: ExtractedPSDImages;
  layerPreviews: Map<string, string>;
}

// Processing states
export interface PSDProcessingState {
  isProcessing: boolean;
  progress: number;
  stage: string;
  error: string | null;
  success: boolean;
}

// Analysis types
export interface LayerAnalysis {
  semantic: {
    category: 'player' | 'background' | 'stats' | 'logo' | 'effect' | 'border' | 'text' | 'image';
    importance: 'primary' | 'secondary' | 'decorative';
  };
  spatial: {
    depth: number;
    parallaxFactor: number;
  };
  complexity: {
    score: number;
    factors: {
      size: number;
      hasEffects: boolean;
      hasRealContent: boolean;
      semanticImportance: number;
    };
  };
}
