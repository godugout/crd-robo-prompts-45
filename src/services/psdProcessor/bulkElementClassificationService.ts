
import { ProcessedPSDLayer, EnhancedProcessedPSD, LayerAnalysis } from '@/types/psdTypes';
import { getSemanticTypeColor, isValidSemanticType } from '@/utils/semanticTypeColors';

export interface LayerInsights {
  totalLayers: number;
  layersWithImages: number;
  averageOpacity: number;
  semanticDistribution: Record<string, number>;
  complexityAnalysis: {
    simple: number;
    moderate: number;
    complex: number;
  };
}

export interface LayerComplexity {
  score: number;
  factors: {
    size: number;
    hasEffects: boolean;
    hasRealContent: boolean;
    semanticImportance: number;
  };
}

export type LayerType = 'text' | 'image' | 'border' | 'background' | 'player' | 'stats' | 'logo' | 'effect';

export interface ElementClassificationResult {
  type: LayerType;
  confidence: number;
}

export const analyzeLayerComplexity = (layer: ProcessedPSDLayer): LayerComplexity => {
  const width = layer.bounds.right - layer.bounds.left;
  const height = layer.bounds.bottom - layer.bounds.top;
  const area = width * height;
  
  const opacity = layer.opacity;
  
  let complexityScore = 0;
  
  // Size contribution
  complexityScore += Math.min(area / 10000, 50);
  
  // Opacity contribution
  if (opacity < 1 && opacity > 0) {
    complexityScore += 20;
  }
  
  // Real image contribution
  if (layer.hasRealImage) {
    complexityScore += 30;
  }
  
  // Semantic type contribution
  if (layer.semanticType && isValidSemanticType(layer.semanticType)) {
    complexityScore += 15;
  }

  return {
    score: Math.min(complexityScore, 100),
    factors: {
      size: area,
      hasEffects: opacity < 1,
      hasRealContent: layer.hasRealImage || false,
      semanticImportance: layer.semanticType ? 1 : 0
    }
  };
};

export const classifyLayerByContent = (layer: ProcessedPSDLayer): ElementClassificationResult | null => {
  if (layer.hasRealImage) {
    return {
      type: 'image',
      confidence: 0.8
    };
  }
  return null;
};

export const classifyLayerBySemanticType = (layer: ProcessedPSDLayer): ElementClassificationResult | null => {
  if (layer.semanticType && isValidSemanticType(layer.semanticType)) {
    return {
      type: layer.semanticType as LayerType,
      confidence: layer.confidence || 0.9
    };
  }
  return null;
};

export const generateLayerInsights = (layers: ProcessedPSDLayer[]): LayerInsights => {
  const totalLayers = layers.length;
  const layersWithImages = layers.filter(l => l.hasRealImage).length;
  
  const averageOpacity = layers.reduce((sum, layer) => {
    return sum + layer.opacity;
  }, 0) / totalLayers;

  const semanticDistribution: Record<string, number> = layers.reduce((acc, layer) => {
    if (layer.semanticType && isValidSemanticType(layer.semanticType)) {
      acc[layer.semanticType] = (acc[layer.semanticType] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  
  const complexityAnalysis = {
    simple: layers.filter(l => analyzeLayerComplexity(l).score < 30).length,
    moderate: layers.filter(l => {
      const score = analyzeLayerComplexity(l).score;
      return score >= 30 && score < 70;
    }).length,
    complex: layers.filter(l => analyzeLayerComplexity(l).score >= 70).length
  };
  
  return {
    totalLayers,
    layersWithImages,
    averageOpacity,
    semanticDistribution,
    complexityAnalysis
  };
};

export const generatePSDInsights = (psd: EnhancedProcessedPSD): LayerInsights => {
  return generateLayerInsights(psd.layers);
};
