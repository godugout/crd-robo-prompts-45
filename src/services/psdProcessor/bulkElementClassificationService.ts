import { BulkPSDData } from '@/pages/BulkPSDAnalysisPage';
import { ProcessedPSDLayer } from './psdProcessingService';
import { statisticalLearningService, TemplatePattern } from './statisticalLearningService';

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
  // Enhanced properties
  avgConfidence: number;
  confidenceRange: { min: number; max: number };
  positionConsistency: number;
}

export interface BulkAnalysisResult {
  standardizedElements: StandardizedElement[];
  commonElements: StandardizedElement[];
  uniqueElements: StandardizedElement[];
  consistencyScore: number;
  elementDistribution: Record<string, number>;
  recommendations: string[];
  // Enhanced results
  templatePatterns: TemplatePattern[];
  analysisQuality: {
    overallScore: number;
    highConfidencePercentage: number;
    positionConsistencyAvg: number;
    recommendations: string[];
  };
  lowConfidenceElements: StandardizedElement[];
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
    console.log('Starting enhanced bulk analysis with statistical learning');
    
    // Train statistical learning service with bulk data
    statisticalLearningService.learnFromBulkData(psdData);
    
    const elementMap = new Map<string, {
      psdIds: Set<string>;
      layers: ProcessedPSDLayer[];
      confidenceScores: number[];
    }>();

    // Collect all elements across PSDs with confidence tracking
    psdData.forEach(psd => {
      psd.processedPSD.layers.forEach(layer => {
        const elementType = layer.semanticType || 'unknown';
        
        if (!elementMap.has(elementType)) {
          elementMap.set(elementType, {
            psdIds: new Set(),
            layers: [],
            confidenceScores: []
          });
        }

        const element = elementMap.get(elementType)!;
        element.psdIds.add(psd.id);
        element.layers.push(layer);
        element.confidenceScores.push(layer.confidence || 0);
      });
    });

    // Create enhanced standardized elements
    const standardizedElements: StandardizedElement[] = Array.from(elementMap.entries()).map(([type, data]) => {
      const mapping = this.elementMappings[type] || { displayName: type, category: 'unknown' as const };
      
      return {
        type,
        displayName: mapping.displayName,
        category: mapping.category,
        foundInPSDs: Array.from(data.psdIds),
        commonProperties: this.analyzeCommonProperties(data.layers),
        // Enhanced properties
        avgConfidence: data.confidenceScores.length > 0 
          ? data.confidenceScores.reduce((a, b) => a + b, 0) / data.confidenceScores.length 
          : 0,
        confidenceRange: data.confidenceScores.length > 0 
          ? { min: Math.min(...data.confidenceScores), max: Math.max(...data.confidenceScores) }
          : { min: 0, max: 0 },
        positionConsistency: this.calculatePositionConsistency(data.layers, psdData)
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

    // Generate enhanced recommendations
    const recommendations = this.generateEnhancedRecommendations(
      standardizedElements,
      commonElements,
      uniqueElements,
      totalPSDs,
      statisticalLearningService.getTemplatePatterns()
    );

    return {
      standardizedElements: standardizedElements.sort((a, b) => b.foundInPSDs.length - a.foundInPSDs.length),
      commonElements,
      uniqueElements,
      consistencyScore,
      elementDistribution,
      recommendations,
      // Enhanced analysis results
      templatePatterns: statisticalLearningService.getTemplatePatterns(),
      analysisQuality: this.calculateAnalysisQuality(standardizedElements),
      lowConfidenceElements: standardizedElements.filter(el => el.avgConfidence < 0.6)
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

  private calculatePositionConsistency(layers: ProcessedPSDLayer[], psdData: BulkPSDData[]): number {
    if (layers.length < 2) return 1;
    
    const positions = layers.map(layer => {
      const psd = psdData.find(p => p.processedPSD.layers.some(l => l.id === layer.id));
      if (!psd) return { x: 0, y: 0 };
      
      return {
        x: layer.bounds.left / psd.processedPSD.width,
        y: layer.bounds.top / psd.processedPSD.height
      };
    });
    
    // Calculate standard deviation of positions
    const avgX = positions.reduce((sum, pos) => sum + pos.x, 0) / positions.length;
    const avgY = positions.reduce((sum, pos) => sum + pos.y, 0) / positions.length;
    
    const variance = positions.reduce((sum, pos) => {
      return sum + Math.pow(pos.x - avgX, 2) + Math.pow(pos.y - avgY, 2);
    }, 0) / positions.length;
    
    const standardDeviation = Math.sqrt(variance);
    
    // Convert to consistency score (lower deviation = higher consistency)
    return Math.max(0, 1 - standardDeviation * 2);
  }

  private calculateAnalysisQuality(elements: StandardizedElement[]): {
    overallScore: number;
    highConfidencePercentage: number;
    positionConsistencyAvg: number;
    recommendations: string[];
  } {
    const totalElements = elements.length;
    if (totalElements === 0) {
      return {
        overallScore: 0,
        highConfidencePercentage: 0,
        positionConsistencyAvg: 0,
        recommendations: ['No elements found for analysis']
      };
    }
    
    const highConfidenceCount = elements.filter(el => el.avgConfidence >= 0.8).length;
    const highConfidencePercentage = (highConfidenceCount / totalElements) * 100;
    
    const positionConsistencyAvg = elements.reduce((sum, el) => sum + el.positionConsistency, 0) / totalElements;
    
    const overallScore = (highConfidencePercentage / 100) * 0.6 + positionConsistencyAvg * 0.4;
    
    const qualityRecommendations: string[] = [];
    
    if (highConfidencePercentage < 70) {
      qualityRecommendations.push('Consider improving layer naming conventions for better automatic classification');
    }
    
    if (positionConsistencyAvg < 0.7) {
      qualityRecommendations.push('Element positioning varies significantly - consider standardizing layouts');
    }
    
    if (overallScore > 0.8) {
      qualityRecommendations.push('Excellent analysis quality - your PSDs follow consistent patterns');
    }
    
    return {
      overallScore,
      highConfidencePercentage,
      positionConsistencyAvg,
      recommendations: qualityRecommendations
    };
  }

  private generateEnhancedRecommendations(
    allElements: StandardizedElement[],
    commonElements: StandardizedElement[],
    uniqueElements: StandardizedElement[],
    totalPSDs: number,
    templatePatterns: TemplatePattern[]
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

    // Enhanced recommendations based on statistical learning
    const lowConfidenceElements = allElements.filter(el => el.avgConfidence < 0.6);
    if (lowConfidenceElements.length > 0) {
      recommendations.push(`${lowConfidenceElements.length} elements have low confidence scores - review naming or positioning`);
    }
    
    const inconsistentElements = allElements.filter(el => el.positionConsistency < 0.5);
    if (inconsistentElements.length > 0) {
      recommendations.push(`${inconsistentElements.length} elements have inconsistent positioning across cards`);
    }
    
    if (templatePatterns.length > 0) {
      const mostCommonTemplate = templatePatterns[0];
      recommendations.push(`Detected ${templatePatterns.length} template patterns - most common: ${mostCommonTemplate.name}`);
    }
    
    // Template-specific recommendations
    if (templatePatterns.length > 3) {
      recommendations.push('Multiple template patterns detected - consider standardizing to fewer layouts');
    } else if (templatePatterns.length === 0) {
      recommendations.push('No consistent template patterns found - PSDs vary significantly in structure');
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
