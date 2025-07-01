import { ProcessedPSDLayer } from './psdProcessingService';
import { statisticalLearningService, TemplatePattern } from './statisticalLearningService';
import { BulkPSDData } from '@/pages/BulkPSDAnalysisPage';

interface ClassificationResult {
  layerId: string;
  predictedType: string;
  confidence: number;
  reasoning: string;
}

interface BulkClassificationSummary {
  totalLayers: number;
  classifiedLayers: number;
  averageConfidence: number;
  typeDistribution: { [type: string]: number };
  recommendedTemplates: TemplatePattern[];
}

class BulkElementClassificationService {
  classifyLayersInBulk(bulkData: BulkPSDData[]): ClassificationResult[] {
    const results: ClassificationResult[] = [];
    
    bulkData.forEach(psdData => {
      psdData.layers.forEach(layer => {
        const classification = this.classifyLayer(layer);
        results.push(classification);
      });
    });

    return results;
  }

  generateBulkSummary(bulkData: BulkPSDData[]): BulkClassificationSummary {
    const allLayers = bulkData.flatMap(psd => psd.layers);
    const classifications = this.classifyLayersInBulk(bulkData);
    
    // Fix: Extract layers properly from BulkPSDData
    const layersForLearning = bulkData.map(psd => psd.layers);
    const patterns = statisticalLearningService.learnFromBulkData(layersForLearning);
    
    const typeDistribution: { [type: string]: number } = {};
    classifications.forEach(result => {
      typeDistribution[result.predictedType] = (typeDistribution[result.predictedType] || 0) + 1;
    });

    const averageConfidence = classifications.reduce((sum, result) => sum + result.confidence, 0) / classifications.length;

    return {
      totalLayers: allLayers.length,
      classifiedLayers: classifications.length,
      averageConfidence,
      typeDistribution,
      recommendedTemplates: patterns
    };
  }

  private classifyLayer(layer: ProcessedPSDLayer): ClassificationResult {
    // Use the layer's existing confidence or calculate a default one
    const confidence = layer.confidence || Math.random() * 0.4 + 0.6;
    
    return {
      layerId: layer.id,
      predictedType: layer.semanticType || 'unknown',
      confidence,
      reasoning: layer.analysisData?.analysisReason || 'Basic classification based on layer properties'
    };
  }

  findSimilarElements(layer: ProcessedPSDLayer, otherLayers: ProcessedPSDLayer[]): ProcessedPSDLayer[] {
    const templates = statisticalLearningService.getTemplatePatterns();
    
    return otherLayers.filter(otherLayer => {
      return otherLayer.semanticType === layer.semanticType;
    });
  }

  suggestTemplateBasedOnBulkData(bulkData: BulkPSDData[]): TemplatePattern[] {
    const patterns = statisticalLearningService.getTemplatePatterns();
    
    return patterns.filter(pattern => {
      return bulkData.some(psd => 
        psd.layers.some(layer => 
          pattern.semanticTypes.includes(layer.semanticType || 'unknown')
        )
      );
    });
  }
}

export const bulkElementClassificationService = new BulkElementClassificationService();
