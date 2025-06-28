
import { BulkPSDData } from '@/pages/BulkPSDAnalysisPage';
import { ProcessedPSDLayer } from './psdProcessingService';

export interface StandardizedElement {
  type: string;
  displayName: string;
  category: 'background' | 'player' | 'text' | 'logo' | 'border' | 'stats' | 'effect' | 'unknown';
  foundInPSDs: string[];
  commonProperties: {
    averageOpacity: number;
    commonPositions: Array<{ x: number; y: number }>;
    sizesRange: { min: number; max: number };
  };
}

export interface BulkAnalysisResult {
  standardizedElements: StandardizedElement[];
  commonElements: StandardizedElement[];
  uniqueElements: StandardizedElement[];
  consistencyScore: number;
  elementDistribution: Record<string, number>;
  recommendations: string[];
}

class BulkElementClassificationService {
  private elementMappings: Record<string, { displayName: string; category: StandardizedElement['category'] }> = {
    'background': { displayName: 'Background', category: 'background' },
    'player': { displayName: 'Player Image', category: 'player' },
    'text': { displayName: 'Text Elements', category: 'text' },
    'logo': { displayName: 'Logo/Brand', category: 'logo' },
    'border': { displayName: 'Border/Frame', category: 'border' },
    'stats': { displayName: 'Statistics', category: 'stats' },
    'effect': { displayName: 'Effects/Glow', category: 'effect' },
    'image': { displayName: 'Generic Image', category: 'unknown' }
  };

  analyzeBulkPSDs(psdData: BulkPSDData[]): BulkAnalysisResult {
    const elementMap = new Map<string, {
      psdIds: Set<string>;
      layers: ProcessedPSDLayer[];
    }>();

    // Collect all elements across PSDs
    psdData.forEach(psd => {
      psd.processedPSD.layers.forEach(layer => {
        const elementType = layer.semanticType || 'unknown';
        
        if (!elementMap.has(elementType)) {
          elementMap.set(elementType, {
            psdIds: new Set(),
            layers: []
          });
        }

        const element = elementMap.get(elementType)!;
        element.psdIds.add(psd.id);
        element.layers.push(layer);
      });
    });

    // Create standardized elements
    const standardizedElements: StandardizedElement[] = Array.from(elementMap.entries()).map(([type, data]) => {
      const mapping = this.elementMappings[type] || { displayName: type, category: 'unknown' as const };
      
      return {
        type,
        displayName: mapping.displayName,
        category: mapping.category,
        foundInPSDs: Array.from(data.psdIds),
        commonProperties: this.analyzeCommonProperties(data.layers)
      };
    });

    // Analyze patterns
    const totalPSDs = psdData.length;
    const commonElements = standardizedElements.filter(element => 
      element.foundInPSDs.length === totalPSDs
    );
    
    const uniqueElements = standardizedElements.filter(element => 
      element.foundInPSDs.length === 1
    );

    // Calculate consistency score
    const consistencyScore = totalPSDs > 0 
      ? commonElements.length / standardizedElements.length 
      : 0;

    // Element distribution
    const elementDistribution: Record<string, number> = {};
    standardizedElements.forEach(element => {
      elementDistribution[element.category] = (elementDistribution[element.category] || 0) + 1;
    });

    // Generate recommendations
    const recommendations = this.generateRecommendations(
      standardizedElements,
      commonElements,
      uniqueElements,
      totalPSDs
    );

    return {
      standardizedElements: standardizedElements.sort((a, b) => b.foundInPSDs.length - a.foundInPSDs.length),
      commonElements,
      uniqueElements,
      consistencyScore,
      elementDistribution,
      recommendations
    };
  }

  private analyzeCommonProperties(layers: ProcessedPSDLayer[]) {
    if (layers.length === 0) {
      return {
        averageOpacity: 1,
        commonPositions: [],
        sizesRange: { min: 0, max: 0 }
      };
    }

    const averageOpacity = layers.reduce((sum, layer) => sum + layer.opacity, 0) / layers.length;
    
    const positions = layers.map(layer => ({
      x: layer.bounds.left,
      y: layer.bounds.top
    }));

    const sizes = layers.map(layer => 
      (layer.bounds.right - layer.bounds.left) * (layer.bounds.bottom - layer.bounds.top)
    );

    return {
      averageOpacity,
      commonPositions: positions,
      sizesRange: {
        min: Math.min(...sizes),
        max: Math.max(...sizes)
      }
    };
  }

  private generateRecommendations(
    allElements: StandardizedElement[],
    commonElements: StandardizedElement[],
    uniqueElements: StandardizedElement[],
    totalPSDs: number
  ): string[] {
    const recommendations: string[] = [];

    // Consistency recommendations
    if (commonElements.length < allElements.length * 0.5) {
      recommendations.push('Consider standardizing element placement for better consistency across cards');
    }

    // Missing element recommendations
    const backgroundElements = allElements.filter(e => e.category === 'background');
    if (backgroundElements.length === 0) {
      recommendations.push('No background elements detected - ensure proper layer naming');
    }

    const playerElements = allElements.filter(e => e.category === 'player');
    if (playerElements.some(e => e.foundInPSDs.length < totalPSDs)) {
      recommendations.push('Player elements are not consistent across all cards');
    }

    // Unique element recommendations
    if (uniqueElements.length > allElements.length * 0.3) {
      recommendations.push('High number of unique elements - consider creating reusable templates');
    }

    // Quality recommendations
    const lowOpacityElements = allElements.filter(e => e.commonProperties.averageOpacity < 0.5);
    if (lowOpacityElements.length > 0) {
      recommendations.push(`${lowOpacityElements.length} element(s) have low opacity - verify visibility`);
    }

    return recommendations;
  }

  exportAnalysisReport(analysis: BulkAnalysisResult, psdData: BulkPSDData[]): string {
    const report = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalPSDs: psdData.length,
        totalElements: analysis.standardizedElements.length,
        consistencyScore: analysis.consistencyScore,
        commonElements: analysis.commonElements.length,
        uniqueElements: analysis.uniqueElements.length
      },
      psdFiles: psdData.map(psd => ({
        fileName: psd.fileName,
        dimensions: `${psd.processedPSD.width}x${psd.processedPSD.height}`,
        totalLayers: psd.processedPSD.totalLayers,
        elements: psd.processedPSD.layers.map(layer => ({
          name: layer.name,
          type: layer.semanticType || 'unknown',
          opacity: layer.opacity
        }))
      })),
      elementAnalysis: analysis.standardizedElements,
      recommendations: analysis.recommendations
    };

    return JSON.stringify(report, null, 2);
  }
}

export const bulkElementClassificationService = new BulkElementClassificationService();
