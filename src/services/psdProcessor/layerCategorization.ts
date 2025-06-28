
import { ProcessedPSDLayer } from './psdProcessingService';
import { LayerCategoryType } from '@/components/ui/design-system/psd-tokens';

export interface CategorizedLayer {
  layer: ProcessedPSDLayer;
  category: LayerCategoryType;
  confidence: number;
  reasoning: string;
}

export interface LayerCategory {
  type: LayerCategoryType;
  name: string;
  description: string;
  layers: CategorizedLayer[];
  totalLayers: number;
}

class LayerCategorizationService {
  categorizeLayer(layer: ProcessedPSDLayer): CategorizedLayer {
    const name = layer.name.toLowerCase();
    
    // Character/Player detection
    if (this.isCharacterLayer(name, layer)) {
      return {
        layer,
        category: 'character',
        confidence: 0.9,
        reasoning: 'Detected as main subject or character'
      };
    }
    
    // Background detection
    if (this.isBackgroundLayer(name, layer)) {
      return {
        layer,
        category: 'background',
        confidence: 0.85,
        reasoning: 'Detected as background element'
      };
    }
    
    // Text detection
    if (this.isTextLayer(name, layer)) {
      return {
        layer,
        category: 'text',
        confidence: 0.95,
        reasoning: 'Detected as text or numeric content'
      };
    }
    
    // Effects detection
    if (this.isEffectLayer(name, layer)) {
      return {
        layer,
        category: 'effects',
        confidence: 0.8,
        reasoning: 'Detected as visual effect or enhancement'
      };
    }
    
    // UI elements (default fallback)
    return {
      layer,
      category: 'ui',
      confidence: 0.6,
      reasoning: 'Classified as UI element or frame component'
    };
  }

  private isCharacterLayer(name: string, layer: ProcessedPSDLayer): boolean {
    const characterKeywords = ['player', 'character', 'person', 'face', 'portrait', 'athlete', 'subject'];
    const hasKeyword = characterKeywords.some(keyword => name.includes(keyword));
    
    // Large layers are often the main subject
    const area = (layer.bounds.right - layer.bounds.left) * (layer.bounds.bottom - layer.bounds.top);
    const isLarge = area > 50000; // Arbitrary threshold
    
    return hasKeyword || (isLarge && !name.includes('background') && !name.includes('bg'));
  }

  private isBackgroundLayer(name: string, layer: ProcessedPSDLayer): boolean {
    const backgroundKeywords = ['background', 'bg', 'backdrop', 'texture', 'fill', 'pattern', 'landscape'];
    const hasKeyword = backgroundKeywords.some(keyword => name.includes(keyword));
    
    // Very large layers at bottom of stack are often backgrounds
    const area = (layer.bounds.right - layer.bounds.left) * (layer.bounds.bottom - layer.bounds.top);
    const isVeryLarge = area > 100000;
    
    return hasKeyword || (isVeryLarge && layer.bounds.left <= 10 && layer.bounds.top <= 10);
  }

  private isTextLayer(name: string, layer: ProcessedPSDLayer): boolean {
    const textKeywords = ['text', 'title', 'name', 'stat', 'number', 'score', 'rating', 'label', 'caption'];
    return textKeywords.some(keyword => name.includes(keyword));
  }

  private isEffectLayer(name: string, layer: ProcessedPSDLayer): boolean {
    const effectKeywords = ['glow', 'shadow', 'effect', 'particle', 'shine', 'highlight', 'overlay', 'filter'];
    const hasKeyword = effectKeywords.some(keyword => name.includes(keyword));
    
    // Semi-transparent layers are often effects
    const isTransparent = layer.opacity < 0.8;
    
    return hasKeyword || isTransparent;
  }

  categorizeAllLayers(layers: ProcessedPSDLayer[]): LayerCategory[] {
    const categorizedLayers = layers.map(layer => this.categorizeLayer(layer));
    
    const categories: Record<LayerCategoryType, LayerCategory> = {
      background: {
        type: 'background',
        name: 'Background',
        description: 'Backgrounds, textures, and base elements',
        layers: [],
        totalLayers: 0,
      },
      character: {
        type: 'character',
        name: 'Character/Player',
        description: 'Main subjects, people, and focal points',
        layers: [],
        totalLayers: 0,
      },
      ui: {
        type: 'ui',
        name: 'UI Elements',
        description: 'Frames, buttons, and interface components',
        layers: [],
        totalLayers: 0,
      },
      text: {
        type: 'text',
        name: 'Text/Numbers',
        description: 'Statistics, names, titles, and labels',
        layers: [],
        totalLayers: 0,
      },
      effects: {
        type: 'effects',
        name: 'Effects',
        description: 'Glows, shadows, and visual enhancements',
        layers: [],
        totalLayers: 0,
      },
    };

    // Group layers by category
    categorizedLayers.forEach(catLayer => {
      categories[catLayer.category].layers.push(catLayer);
      categories[catLayer.category].totalLayers++;
    });

    // Sort layers within each category by confidence (highest first)
    Object.values(categories).forEach(category => {
      category.layers.sort((a, b) => b.confidence - a.confidence);
    });

    return Object.values(categories);
  }
}

export const layerCategorizationService = new LayerCategorizationService();
