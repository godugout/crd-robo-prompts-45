import { ProcessedPSDLayer } from './psdProcessingService';
import { LayerGroup } from './layerGroupingService';
import { LayerAnalysisResult } from './enhancedLayerAnalysisService';

interface SemanticPattern {
  id: string;
  type: string;
  frequency: number;
  confidence: number;
  attributes: {
    position: string;
    materialHints: string[];
    analysisReason: string;
  };
}

interface LayerInsight {
  layerId: string;
  confidence: number;
  semanticType: string;
  positionCategory: string;
  materialHints: string[];
  analysisReason: string;
  frameElementPotential: string;
  threeDReadiness: number;
  relationships: string[];
  extractionQuality: string;
  suggestedFrameRole: string;
}

class StatisticalLearningService {
  analyzeLayers(layers: ProcessedPSDLayer[], layerGroups: LayerGroup[]): void {
    const patterns = this.extractPatterns(layers);
    const groupedPatterns = this.groupPatterns(patterns);
    const layerInsights = this.generateLayerInsights(layers);

    console.log('Extracted Patterns:', patterns);
    console.log('Grouped Patterns:', groupedPatterns);
    console.log('Layer Insights:', layerInsights);
  }

  private extractPatterns(layers: ProcessedPSDLayer[]): SemanticPattern[] {
    const patterns: SemanticPattern[] = [];
    
    layers.forEach(layer => {
      if (layer.analysisData) {
        const pattern: SemanticPattern = {
          id: `pattern-${layer.id}`,
          type: layer.semanticType || 'unknown',
          frequency: 1,
          confidence: layer.analysisData.confidence,
          attributes: {
            position: layer.positionCategory || 'unknown',
            materialHints: layer.materialHints ? Object.keys(layer.materialHints).filter(key => 
              layer.materialHints![key as keyof typeof layer.materialHints]
            ) : [],
            analysisReason: layer.analysisData.analysisReason
          }
        };
        patterns.push(pattern);
      }
    });

    return patterns;
  }

  private groupPatterns(patterns: SemanticPattern[]): SemanticPattern[][] {
    const grouped: { [key: string]: SemanticPattern[] } = {};
    
    patterns.forEach(pattern => {
      const key = pattern.type;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(pattern);
    });

    return Object.values(grouped);
  }

  generateLayerInsights(layers: ProcessedPSDLayer[]): LayerInsight[] {
    return layers
      .filter(layer => layer.analysisData)
      .map(layer => ({
        layerId: layer.id,
        confidence: layer.analysisData!.confidence,
        semanticType: layer.semanticType || 'unknown',
        positionCategory: layer.positionCategory || 'unknown',
        materialHints: layer.materialHints ? Object.keys(layer.materialHints).filter(key => 
          layer.materialHints![key as keyof typeof layer.materialHints]
        ) : [],
        analysisReason: layer.analysisData!.analysisReason,
        frameElementPotential: layer.analysisData!.frameElementPotential,
        threeDReadiness: layer.analysisData!.threeDReadiness,
        relationships: layer.analysisData!.relationships,
        extractionQuality: layer.analysisData!.extractionQuality,
        suggestedFrameRole: layer.analysisData!.suggestedFrameRole
      }));
  }
}

export const statisticalLearningService = new StatisticalLearningService();
