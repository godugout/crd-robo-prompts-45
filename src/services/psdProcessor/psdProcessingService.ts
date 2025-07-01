import { LayerAnalysisData, LayerAnalysisResult, enhancedLayerAnalysisService } from './enhancedLayerAnalysisService';

export interface PSDFile {
  name: string;
  width: number;
  height: number;
  layers: any[];
}

export interface ProcessedPSD {
  fileId: string;
  fileName: string;
  width: number;
  height: number;
  layers: ProcessedPSDLayer[];
  totalLayers: number;
  fileSize: number;
  analysisSummary: {
    semanticTypeCounts: { [key: string]: number };
    positionCategoryCounts: { [key: string]: number };
    materialHintCounts: { [key: string]: number };
  };
}

export interface ProcessedPSDLayer {
  id: string;
  name: string;
  bounds: {
    top: number;
    left: number;
    right: number;
    bottom: number;
  };
  opacity: number;
  visible: boolean;
  imageData?: string;
  semanticType?: 'background' | 'player' | 'stats' | 'logo' | 'border' | 'text' | 'image' | 'effect';
  materialHints?: {
    isMetallic: boolean;
    isHolographic: boolean;
    hasGlow: boolean;
    isTransparent?: boolean;
  };
  positionCategory?: 'header' | 'center' | 'footer' | 'overlay' | 'edge';
  analysisData?: LayerAnalysisResult;
}

export interface LayerBounds {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export interface SemanticTypeCounts {
  [semanticType: string]: number;
}

export interface PositionCategoryCounts {
  [positionCategory: string]: number;
}

export interface MaterialHintCounts {
  [materialHint: string]: number;
}

class PSDProcessingService {
  async processPSD(psdFile: PSDFile, fileId: string, fileSize: number): Promise<ProcessedPSD> {
    const layers = psdFile.layers;
    const processedLayers: ProcessedPSDLayer[] = [];

    for (let i = 0; i < layers.length; i++) {
      const layer = layers[i];
      const processedLayer = await this.processLayer(layer, i);
      processedLayers.push(processedLayer);
    }

    const analysisSummary = this.analyzeLayers(processedLayers);

    return {
      fileId: fileId,
      fileName: psdFile.name,
      width: psdFile.width,
      height: psdFile.height,
      layers: processedLayers,
      totalLayers: layers.length,
      fileSize: fileSize,
      analysisSummary: analysisSummary,
    };
  }

  private analyzeLayers(layers: ProcessedPSDLayer[]): {
    semanticTypeCounts: { [key: string]: number; };
    positionCategoryCounts: { [key: string]: number; };
    materialHintCounts: { [key: string]: number; };
  } {
    const semanticTypeCounts: { [key: string]: number } = {};
    const positionCategoryCounts: { [key: string]: number } = {};
    const materialHintCounts: { [key: string]: number } = {};

    layers.forEach(layer => {
      if (layer.semanticType) {
        semanticTypeCounts[layer.semanticType] = (semanticTypeCounts[layer.semanticType] || 0) + 1;
      }
      if (layer.positionCategory) {
        positionCategoryCounts[layer.positionCategory] = (positionCategoryCounts[layer.positionCategory] || 0) + 1;
      }
      if (layer.materialHints) {
        Object.keys(layer.materialHints).forEach(hint => {
          materialHintCounts[hint] = (materialHintCounts[hint] || 0) + 1;
        });
      }
    });

    return {
      semanticTypeCounts,
      positionCategoryCounts,
      materialHintCounts,
    };
  }

  async processLayer(layer: any, index: number): Promise<ProcessedPSDLayer> {
    const processedLayer: ProcessedPSDLayer = {
      id: `layer-${index}`,
      name: layer.name || `Layer ${index}`,
      bounds: {
        top: layer.top || 0,
        left: layer.left || 0,
        right: layer.right || 100,
        bottom: layer.bottom || 100,
      },
      opacity: layer.opacity !== undefined ? layer.opacity / 255 : 1,
      visible: layer.visible !== false,
      imageData: layer.canvas ? layer.canvas.toDataURL() : undefined,
    };

    // Enhanced analysis
    const analysisData = enhancedLayerAnalysisService.analyzeLayer(processedLayer);
    const analysisResult = enhancedLayerAnalysisService.convertToAnalysisResult(analysisData);
    
    // Map semantic type with proper type checking
    const validSemanticTypes = ['background', 'player', 'stats', 'logo', 'border', 'text', 'image', 'effect'] as const;
    processedLayer.semanticType = validSemanticTypes.includes(analysisData.semanticType as any) 
      ? analysisData.semanticType as typeof validSemanticTypes[number]
      : 'image';
    
    // Map material hints properly
    processedLayer.materialHints = {
      isMetallic: analysisData.materialHints.includes('metallic'),
      isHolographic: analysisData.materialHints.includes('holographic'),
      hasGlow: analysisData.materialHints.includes('glow'),
      isTransparent: analysisData.materialHints.includes('transparent'),
    };

    // Map position category with proper type checking
    const validPositionCategories = ['header', 'center', 'footer', 'overlay', 'edge'] as const;
    processedLayer.positionCategory = validPositionCategories.includes(analysisData.positionCategory as any)
      ? analysisData.positionCategory as typeof validPositionCategories[number]
      : 'overlay';

    // Store analysis data
    processedLayer.analysisData = analysisResult;

    return processedLayer;
  }
}

export const psdProcessingService = new PSDProcessingService();
