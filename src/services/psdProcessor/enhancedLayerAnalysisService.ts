
import { ProcessedPSDLayer } from './psdProcessingService';

export interface LayerAnalysisData {
  id: string;
  confidence: number;
  semanticType: 'background' | 'player' | 'stats' | 'logo' | 'border' | 'decoration' | 'text' | 'unknown';
  positionCategory: 'header' | 'center' | 'footer' | 'left' | 'right' | 'corner' | 'overlay';
  materialHints: ('metallic' | 'holographic' | 'glow' | 'transparent' | 'textured')[];
  analysisReason: string;
  frameElementPotential: 'high' | 'medium' | 'low';
  threeDReadiness: number; // 0-1 score
  relationships: string[]; // IDs of related layers
  extractionQuality: 'excellent' | 'good' | 'fair' | 'poor';
  suggestedFrameRole: string;
}

export interface LayerPreviewData {
  layerId: string;
  thumbnailUrl: string;
  fullPreviewUrl: string;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

class EnhancedLayerAnalysisService {
  analyzeLayer(layer: ProcessedPSDLayer): LayerAnalysisData {
    const semanticType = this.detectSemanticType(layer);
    const positionCategory = this.analyzePosition(layer);
    const materialHints = this.detectMaterialHints(layer);
    const confidence = this.calculateConfidence(layer, semanticType);
    
    return {
      id: layer.id,
      confidence,
      semanticType,
      positionCategory,
      materialHints,
      analysisReason: this.generateAnalysisReason(layer, semanticType, positionCategory),
      frameElementPotential: this.assessFrameElementPotential(layer, semanticType),
      threeDReadiness: this.calculate3DReadiness(layer),
      relationships: this.findRelatedLayers(layer),
      extractionQuality: this.assessExtractionQuality(layer),
      suggestedFrameRole: this.suggestFrameRole(layer, semanticType, positionCategory)
    };
  }

  private detectSemanticType(layer: ProcessedPSDLayer): LayerAnalysisData['semanticType'] {
    const name = layer.name.toLowerCase();
    
    if (name.includes('background') || name.includes('bg')) return 'background';
    if (name.includes('player') || name.includes('character') || name.includes('person')) return 'player';
    if (name.includes('stat') || name.includes('number') || name.includes('score')) return 'stats';
    if (name.includes('logo') || name.includes('brand')) return 'logo';
    if (name.includes('border') || name.includes('frame') || name.includes('edge')) return 'border';
    if (name.includes('text') || name.includes('label') || name.includes('title')) return 'text';
    if (name.includes('decoration') || name.includes('ornament')) return 'decoration';
    
    return 'unknown';
  }

  private analyzePosition(layer: ProcessedPSDLayer): LayerAnalysisData['positionCategory'] {
    const bounds = layer.bounds;
    const centerX = bounds.left + (bounds.right - bounds.left) / 2;
    const centerY = bounds.top + (bounds.bottom - bounds.top) / 2;
    
    // Assuming canvas dimensions for relative positioning
    const canvasWidth = 400; // Default card width
    const canvasHeight = 600; // Default card height
    
    const relativeX = centerX / canvasWidth;
    const relativeY = centerY / canvasHeight;
    
    if (relativeY < 0.2) return 'header';
    if (relativeY > 0.8) return 'footer';
    if (relativeX < 0.2) return 'left';
    if (relativeX > 0.8) return 'right';
    if ((relativeX < 0.15 || relativeX > 0.85) && (relativeY < 0.15 || relativeY > 0.85)) return 'corner';
    if (relativeX > 0.3 && relativeX < 0.7 && relativeY > 0.3 && relativeY < 0.7) return 'center';
    
    return 'overlay';
  }

  private detectMaterialHints(layer: ProcessedPSDLayer): LayerAnalysisData['materialHints'] {
    const hints: LayerAnalysisData['materialHints'] = [];
    const name = layer.name.toLowerCase();
    
    if (name.includes('metal') || name.includes('chrome') || name.includes('silver')) {
      hints.push('metallic');
    }
    if (name.includes('holo') || name.includes('rainbow') || name.includes('prismatic')) {
      hints.push('holographic');
    }
    if (name.includes('glow') || name.includes('shine') || name.includes('bright')) {
      hints.push('glow');
    }
    if (layer.opacity < 0.9) {
      hints.push('transparent');
    }
    if (name.includes('texture') || name.includes('rough') || name.includes('pattern')) {
      hints.push('textured');
    }
    
    return hints;
  }

  private calculateConfidence(layer: ProcessedPSDLayer, semanticType: string): number {
    let confidence = 0.5; // Base confidence
    
    // Boost confidence based on clear naming
    if (semanticType !== 'unknown') confidence += 0.3;
    
    // Boost confidence based on layer properties
    if (layer.imageData) confidence += 0.2;
    
    return Math.min(confidence, 1.0);
  }

  private generateAnalysisReason(layer: ProcessedPSDLayer, semanticType: string, positionCategory: string): string {
    return `Identified as ${semanticType} based on layer name "${layer.name}" and ${positionCategory} positioning`;
  }

  private assessFrameElementPotential(layer: ProcessedPSDLayer, semanticType: string): 'high' | 'medium' | 'low' {
    if (['border', 'decoration', 'logo'].includes(semanticType)) return 'high';
    if (['background', 'text'].includes(semanticType)) return 'medium';
    return 'low';
  }

  private calculate3DReadiness(layer: ProcessedPSDLayer): number {
    let score = 0.5;
    
    if (layer.imageData) score += 0.3;
    if (layer.opacity === 1) score += 0.2;
    
    return Math.min(score, 1.0);
  }

  private findRelatedLayers(layer: ProcessedPSDLayer): string[] {
    // Placeholder for relationship detection
    return [];
  }

  private assessExtractionQuality(layer: ProcessedPSDLayer): 'excellent' | 'good' | 'fair' | 'poor' {
    if (layer.imageData && layer.opacity === 1) return 'excellent';
    if (layer.imageData) return 'good';
    return 'fair';
  }

  private suggestFrameRole(layer: ProcessedPSDLayer, semanticType: string, positionCategory: string): string {
    return `${semanticType}-${positionCategory}`;
  }

  generateLayerPreview(layer: ProcessedPSDLayer): LayerPreviewData {
    return {
      layerId: layer.id,
      thumbnailUrl: layer.imageData || '',
      fullPreviewUrl: layer.imageData || '',
      bounds: {
        x: layer.bounds.left,
        y: layer.bounds.top,
        width: layer.bounds.right - layer.bounds.left,
        height: layer.bounds.bottom - layer.bounds.top
      }
    };
  }
}

export const enhancedLayerAnalysisService = new EnhancedLayerAnalysisService();
