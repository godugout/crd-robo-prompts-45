
import { ProcessedPSDLayer } from './psdProcessingService';

export interface LayerAnalysisResult {
  semanticType: ProcessedPSDLayer['semanticType'];
  confidence: number;
  inferredDepth: number;
  positionCategory: 'header' | 'center' | 'footer' | 'edge' | 'overlay';
  analysisReasons: string[];
  materialHints: {
    isMetallic: boolean;
    isHolographic: boolean;
    hasGlow: boolean;
    isTransparent: boolean;
  };
}

export interface ColorAnalysis {
  dominantColors: string[];
  hasGradient: boolean;
  contrastRatio: number;
  transparencyPattern: 'none' | 'cutout' | 'fade' | 'complex';
}

export interface PositionAnalysis {
  relativePosition: { x: number; y: number }; // 0-1 normalized
  sizeRatio: { width: number; height: number }; // relative to canvas
  edgeDistance: { top: number; right: number; bottom: number; left: number };
  aspectRatio: number;
}

class EnhancedLayerAnalysisService {
  analyzeLayer(layer: ProcessedPSDLayer, canvasWidth: number, canvasHeight: number): LayerAnalysisResult {
    const positionAnalysis = this.analyzePosition(layer, canvasWidth, canvasHeight);
    const nameAnalysis = this.analyzeLayerName(layer.name);
    const structuralAnalysis = this.analyzeStructure(layer, positionAnalysis);
    
    // Combine all analyses for final classification
    const result = this.combineAnalyses(nameAnalysis, positionAnalysis, structuralAnalysis, layer);
    
    return result;
  }

  private analyzePosition(layer: ProcessedPSDLayer, canvasWidth: number, canvasHeight: number): PositionAnalysis {
    const width = layer.bounds.right - layer.bounds.left;
    const height = layer.bounds.bottom - layer.bounds.top;
    
    const relativePosition = {
      x: layer.bounds.left / canvasWidth,
      y: layer.bounds.top / canvasHeight
    };
    
    const sizeRatio = {
      width: width / canvasWidth,
      height: height / canvasHeight
    };
    
    const edgeDistance = {
      top: layer.bounds.top / canvasHeight,
      right: (canvasWidth - layer.bounds.right) / canvasWidth,
      bottom: (canvasHeight - layer.bounds.bottom) / canvasHeight,
      left: layer.bounds.left / canvasWidth
    };
    
    return {
      relativePosition,
      sizeRatio,
      edgeDistance,
      aspectRatio: width / height
    };
  }

  private analyzeLayerName(name: string): { semanticType: ProcessedPSDLayer['semanticType']; confidence: number; reasons: string[] } {
    const lowerName = name.toLowerCase();
    const reasons: string[] = [];
    
    // Enhanced keyword patterns with confidence scoring
    const patterns = [
      { keywords: ['bg', 'background', 'backdrop'], type: 'background' as const, confidence: 0.9 },
      { keywords: ['player', 'character', 'hero', 'person', 'athlete'], type: 'player' as const, confidence: 0.85 },
      { keywords: ['stat', 'number', 'data', 'score', 'rating'], type: 'stats' as const, confidence: 0.8 },
      { keywords: ['logo', 'brand', 'team', 'club', 'emblem'], type: 'logo' as const, confidence: 0.8 },
      { keywords: ['border', 'frame', 'edge', 'outline'], type: 'border' as const, confidence: 0.85 },
      { keywords: ['effect', 'glow', 'fx', 'shadow', 'light'], type: 'effect' as const, confidence: 0.75 },
      { keywords: ['text', 'title', 'label', 'name', 'caption'], type: 'text' as const, confidence: 0.8 },
    ];
    
    for (const pattern of patterns) {
      for (const keyword of pattern.keywords) {
        if (lowerName.includes(keyword)) {
          reasons.push(`Name contains "${keyword}"`);
          return { semanticType: pattern.type, confidence: pattern.confidence, reasons };
        }
      }
    }
    
    return { semanticType: 'image', confidence: 0.3, reasons: ['No specific keywords found'] };
  }

  private analyzeStructure(layer: ProcessedPSDLayer, position: PositionAnalysis): { 
    semanticType: ProcessedPSDLayer['semanticType']; 
    confidence: number; 
    reasons: string[];
    positionCategory: LayerAnalysisResult['positionCategory'];
  } {
    const reasons: string[] = [];
    let semanticType: ProcessedPSDLayer['semanticType'] = 'image';
    let confidence = 0.5;
    
    // Position-based classification
    let positionCategory: LayerAnalysisResult['positionCategory'] = 'center';
    
    // Header detection (top 20% of canvas)
    if (position.relativePosition.y < 0.2) {
      positionCategory = 'header';
      if (position.sizeRatio.width > 0.8) {
        semanticType = 'text';
        confidence = 0.7;
        reasons.push('Full-width element in header area');
      } else if (position.sizeRatio.width < 0.3) {
        semanticType = 'logo';
        confidence = 0.65;
        reasons.push('Small element in header area');
      }
    }
    
    // Footer detection (bottom 20% of canvas)
    else if (position.relativePosition.y > 0.8) {
      positionCategory = 'footer';
      semanticType = 'text';
      confidence = 0.6;
      reasons.push('Element in footer area');
    }
    
    // Edge detection (near canvas edges)
    else if (Math.min(...Object.values(position.edgeDistance)) < 0.05) {
      positionCategory = 'edge';
      if (position.sizeRatio.width > 0.9 && position.sizeRatio.height > 0.9) {
        semanticType = 'background';
        confidence = 0.8;
        reasons.push('Full-canvas element');
      } else if (position.sizeRatio.width > 0.9 || position.sizeRatio.height > 0.9) {
        semanticType = 'border';
        confidence = 0.75;
        reasons.push('Edge-aligned element');
      }
    }
    
    // Center area detection
    else if (position.relativePosition.x > 0.2 && position.relativePosition.x < 0.8 &&
             position.relativePosition.y > 0.2 && position.relativePosition.y < 0.8) {
      positionCategory = 'center';
      if (position.sizeRatio.width > 0.4 && position.sizeRatio.height > 0.4) {
        semanticType = 'player';
        confidence = 0.7;
        reasons.push('Large element in center area');
      }
    }
    
    // Overlay detection (high opacity, small size)
    if (layer.opacity > 0.9 && position.sizeRatio.width < 0.3 && position.sizeRatio.height < 0.3) {
      positionCategory = 'overlay';
      semanticType = 'effect';
      confidence = 0.6;
      reasons.push('Small, high-opacity overlay element');
    }
    
    // Aspect ratio analysis
    if (position.aspectRatio > 2.5) {
      semanticType = 'text';
      confidence = Math.max(confidence, 0.65);
      reasons.push('Wide aspect ratio suggests text');
    } else if (Math.abs(position.aspectRatio - 1) < 0.2) {
      if (position.sizeRatio.width < 0.4) {
        semanticType = 'logo';
        confidence = Math.max(confidence, 0.6);
        reasons.push('Square aspect ratio suggests logo');
      }
    }
    
    return { semanticType, confidence, reasons, positionCategory };
  }

  private combineAnalyses(
    nameAnalysis: { semanticType: ProcessedPSDLayer['semanticType']; confidence: number; reasons: string[] },
    positionAnalysis: PositionAnalysis,
    structuralAnalysis: { semanticType: ProcessedPSDLayer['semanticType']; confidence: number; reasons: string[]; positionCategory: LayerAnalysisResult['positionCategory'] },
    layer: ProcessedPSDLayer
  ): LayerAnalysisResult {
    
    // Weight the analyses (name analysis is most reliable)
    const nameWeight = 0.6;
    const structuralWeight = 0.4;
    
    let finalSemanticType: ProcessedPSDLayer['semanticType'];
    let finalConfidence: number;
    
    if (nameAnalysis.confidence > structuralAnalysis.confidence) {
      finalSemanticType = nameAnalysis.semanticType;
      finalConfidence = nameAnalysis.confidence * nameWeight + structuralAnalysis.confidence * structuralWeight;
    } else {
      finalSemanticType = structuralAnalysis.semanticType;
      finalConfidence = structuralAnalysis.confidence * structuralWeight + nameAnalysis.confidence * nameWeight;
    }
    
    // Calculate inferred depth based on semantic type and position
    const inferredDepth = this.calculateDepth(finalSemanticType, structuralAnalysis.positionCategory, positionAnalysis);
    
    // Enhanced material hints
    const materialHints = this.analyzeMaterialHints(layer, finalSemanticType);
    
    const analysisReasons = [...nameAnalysis.reasons, ...structuralAnalysis.reasons];
    
    return {
      semanticType: finalSemanticType,
      confidence: Math.min(finalConfidence, 1),
      inferredDepth,
      positionCategory: structuralAnalysis.positionCategory,
      analysisReasons,
      materialHints
    };
  }

  private calculateDepth(semanticType: ProcessedPSDLayer['semanticType'], positionCategory: string, position: PositionAnalysis): number {
    // Base depth by semantic type
    const baseDepths = {
      background: 0,
      border: 0.2,
      player: 0.5,
      logo: 0.6,
      stats: 0.7,
      text: 0.8,
      effect: 0.9,
      image: 0.4
    };
    
    let depth = baseDepths[semanticType || 'image'];
    
    // Adjust based on position category
    const positionAdjustments = {
      header: 0.1,
      footer: 0.1,
      edge: -0.1,
      center: 0,
      overlay: 0.2
    };
    
    depth += positionAdjustments[positionCategory as keyof typeof positionAdjustments] || 0;
    
    // Fine-tune based on size (smaller elements tend to be on top)
    const sizeMultiplier = Math.max(position.sizeRatio.width, position.sizeRatio.height);
    if (sizeMultiplier < 0.3) {
      depth += 0.1; // Small elements go forward
    } else if (sizeMultiplier > 0.8) {
      depth -= 0.1; // Large elements go back
    }
    
    return Math.max(0, Math.min(1, depth));
  }

  private analyzeMaterialHints(layer: ProcessedPSDLayer, semanticType: ProcessedPSDLayer['semanticType']) {
    const name = layer.name.toLowerCase();
    
    return {
      isMetallic: name.includes('metal') || name.includes('chrome') || name.includes('gold') || name.includes('silver') || semanticType === 'border',
      isHolographic: name.includes('holo') || name.includes('rainbow') || name.includes('prism') || name.includes('iridescent'),
      hasGlow: name.includes('glow') || name.includes('light') || name.includes('bright') || semanticType === 'effect',
      isTransparent: layer.opacity < 0.8 || name.includes('transparent') || name.includes('fade')
    };
  }
}

export const enhancedLayerAnalysisService = new EnhancedLayerAnalysisService();
