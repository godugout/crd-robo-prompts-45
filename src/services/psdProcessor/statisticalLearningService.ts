import { ProcessedPSDLayer } from '@/types/psdTypes';
import { SemanticType, isValidSemanticType } from '@/utils/semanticTypeColors';

interface LearnedPattern {
  semanticType: SemanticType;
  features: LayerFeatures;
  confidence: number;
  frequency: number;
}

interface LayerFeatures {
  area: number;
  aspectRatio: number;
  centerDistance: number;
  opacity: number;
  hasText: boolean;
  hasImage: boolean;
  edgeProximity: number;
}

interface StatisticalModel {
  patterns: LearnedPattern[];
  version: string;
  lastUpdated: Date;
}

export class StatisticalLearningService {
  private static instance: StatisticalLearningService;
  private patterns: LearnedPattern[] = [];
  private modelVersion: string = 'v1.0';
  private lastUpdated: Date = new Date();

  private constructor() {
    // Private constructor to prevent direct instantiation
  }

  public static getInstance(): StatisticalLearningService {
    if (!StatisticalLearningService.instance) {
      StatisticalLearningService.instance = new StatisticalLearningService();
    }
    return StatisticalLearningService.instance;
  }

  predictSemanticType(layer: ProcessedPSDLayer): SemanticType | null {
    const features = this.extractLayerFeatures(layer);
    
    // Enhanced prediction logic
    const nameScore = this.analyzeLayerName(layer.name);
    const spatialScore = this.analyzeSpatialFeatures(features);
    const contentScore = this.analyzeContentFeatures(features);
    
    // Combine scores and find best match
    const scores: Record<SemanticType, number> = {
      'player': nameScore.player + contentScore.hasImage * 0.8,
      'background': nameScore.background + spatialScore.area * 0.6,
      'stats': nameScore.stats + spatialScore.position * 0.7,
      'logo': nameScore.logo + spatialScore.position * 0.5,
      'border': nameScore.border + spatialScore.edge * 0.9,
      'text': nameScore.text + contentScore.hasText * 0.8,
      'image': contentScore.hasImage * 0.9,
      'effect': nameScore.effect + features.opacity < 1 ? 0.6 : 0
    };
    
    // Find highest scoring semantic type
    let bestType: SemanticType = 'image';
    let bestScore = 0;
    
    for (const [type, score] of Object.entries(scores)) {
      if (score > bestScore && isValidSemanticType(type)) {
        bestScore = score;
        bestType = type as SemanticType;
      }
    }
    
    return bestScore > 0.3 ? bestType : null;
  }

  private extractLayerFeatures(layer: ProcessedPSDLayer): LayerFeatures {
    const width = layer.bounds.right - layer.bounds.left;
    const height = layer.bounds.bottom - layer.bounds.top;
    const area = width * height;
    const aspectRatio = width / height;
    const centerDistance = Math.sqrt(
      Math.pow(layer.bounds.left + width / 2 - 0.5, 2) +
      Math.pow(layer.bounds.top + height / 2 - 0.5, 2)
    );
    
    return {
      area: Math.min(area / 10000, 1),
      aspectRatio: Math.min(aspectRatio, 5),
      centerDistance: Math.min(centerDistance, 1),
      opacity: layer.properties?.opacity ?? 1,
      hasText: layer.name.toLowerCase().includes('text'),
      hasImage: layer.hasRealImage,
      edgeProximity: Math.min(
        layer.bounds.left,
        layer.bounds.top,
        1 - layer.bounds.right,
        1 - layer.bounds.bottom
      )
    };
  }

  private analyzeLayerName(name: string): Record<SemanticType, number> {
    const lowerName = name.toLowerCase();
    
    return {
      'player': lowerName.includes('player') || lowerName.includes('person') ? 0.7 : 0,
      'background': lowerName.includes('background') || lowerName.includes('bg') ? 0.8 : 0,
      'stats': lowerName.includes('stats') || lowerName.includes('score') ? 0.6 : 0,
      'logo': lowerName.includes('logo') || lowerName.includes('brand') ? 0.7 : 0,
      'border': lowerName.includes('border') || lowerName.includes('frame') ? 0.5 : 0,
      'text': lowerName.includes('text') || lowerName.includes('title') ? 0.9 : 0,
      'image': lowerName.includes('image') || lowerName.includes('photo') ? 0.4 : 0,
      'effect': lowerName.includes('effect') || lowerName.includes('shadow') ? 0.6 : 0
    };
  }

  private learnFromProcessedPSD(layers: ProcessedPSDLayer[]): void {
    layers.forEach(layer => {
      if (layer.semanticType && isValidSemanticType(layer.semanticType)) {
        const features = this.extractLayerFeatures(layer);
        const pattern: LearnedPattern = {
          semanticType: layer.semanticType,
          features,
          confidence: 0.8,
          frequency: 1
        };
        
        this.patterns.push(pattern);
      }
    });
  }

  private analyzeSpatialFeatures(features: LayerFeatures): { area: number; position: number; edge: number } {
    return {
      area: features.area,
      position: 1 - features.centerDistance,
      edge: features.edgeProximity
    };
  }

  private analyzeContentFeatures(features: LayerFeatures): { hasText: number; hasImage: number } {
    return {
      hasText: features.hasText ? 0.8 : 0,
      hasImage: features.hasImage ? 0.9 : 0
    };
  }

  private classifyBySpatialRules(features: LayerFeatures): SemanticType | null {
    // Rule-based classification fallback
    if (features.area > 0.7) return 'background';
    if (features.aspectRatio > 2 || features.aspectRatio < 0.5) return 'border';
    if (features.centerDistance < 0.3 && features.area > 0.2) return 'player';
    
    return null;
  }

  getConfidenceForPrediction(layer: ProcessedPSDLayer, predictedType: SemanticType): number {
    const features = this.extractLayerFeatures(layer);
    const matchingPatterns = this.patterns.filter(p => p.semanticType === predictedType);
    
    if (matchingPatterns.length === 0) return 0.5;
    
    // Calculate similarity to learned patterns
    const similarities = matchingPatterns.map(pattern => 
      this.calculateFeatureSimilarity(features, pattern.features)
    );
    
    return Math.max(...similarities);
  }

  private calculateFeatureSimilarity(featuresA: LayerFeatures, featuresB: LayerFeatures): number {
    let similarity = 0;
    
    similarity += Math.abs(featuresA.area - featuresB.area);
    similarity += Math.abs(featuresA.aspectRatio - featuresB.aspectRatio);
    similarity += Math.abs(featuresA.centerDistance - featuresB.centerDistance);
    similarity += Math.abs(featuresA.opacity - featuresB.opacity);
    
    return 1 - Math.min(similarity / 4, 1);
  }
}

export const statisticalLearningService = StatisticalLearningService.getInstance();
