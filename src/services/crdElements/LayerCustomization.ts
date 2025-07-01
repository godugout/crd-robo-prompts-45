
import { PSDLayer } from './PSDProcessor';

export interface LayerCustomizer {
  adjustStyle(layerId: string, styles: StyleAdjustment): void;
  replaceContent(layerId: string, newContent: Content): void;
  applyEffect(layerId: string, effect: CardEffect): void;
  animateLayer(layerId: string, animation: Animation): void;
}

export interface StyleAdjustment {
  hue?: number;
  saturation?: number;
  brightness?: number;
  contrast?: number;
  filters?: CSSFilter[];
  blendMode?: BlendMode;
}

export interface Content {
  type: 'image' | 'text' | 'vector';
  data: string | ArrayBuffer;
  // Remove metadata property as it doesn't exist in PSDLayer content type
}

export interface CardEffect {
  type: 'holographic' | 'metallic' | 'glow' | 'shadow' | 'blur';
  intensity: number;
  parameters: Record<string, any>;
}

export interface Animation {
  type: 'fade' | 'slide' | 'rotate' | 'scale' | 'bounce';
  duration: number;
  easing: string;
  loop: boolean;
  delay?: number;
}

export type CSSFilter = 'blur' | 'brightness' | 'contrast' | 'hue-rotate' | 'saturate';
export type BlendMode = 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten';

export class CardCustomizationEngine implements LayerCustomizer {
  private originalPSD: PSDDocument;
  private currentState: CardState;
  private history: StateHistory;

  constructor(originalPSD: PSDDocument) {
    this.originalPSD = originalPSD;
    this.currentState = this.initializeState(originalPSD);
    this.history = new StateHistory();
  }

  adjustStyle(layerId: string, styles: StyleAdjustment): void {
    const layer = this.findLayer(layerId);
    if (!layer) return;

    // Apply style modifications
    if (styles.hue !== undefined) {
      layer.styleOverrides = { ...layer.styleOverrides, hue: styles.hue };
    }
    if (styles.saturation !== undefined) {
      layer.styleOverrides = { ...layer.styleOverrides, saturation: styles.saturation };
    }
    if (styles.brightness !== undefined) {
      layer.styleOverrides = { ...layer.styleOverrides, brightness: styles.brightness };
    }
    if (styles.contrast !== undefined) {
      layer.styleOverrides = { ...layer.styleOverrides, contrast: styles.contrast };
    }
    if (styles.blendMode) {
      layer.styleOverrides = { ...layer.styleOverrides, blendMode: styles.blendMode };
    }

    this.updateState();
  }

  replaceContent(layerId: string, newContent: Content): void {
    const layer = this.findLayer(layerId);
    if (!layer) return;

    layer.content = {
      data: newContent.data,
      format: this.getFormatFromContent(newContent)
    };

    this.updateState();
  }

  applyEffect(layerId: string, effect: CardEffect): void {
    const layer = this.findLayer(layerId);
    if (!layer) return;

    if (!layer.effects) layer.effects = [];
    
    // Remove existing effect of the same type
    layer.effects = layer.effects.filter(e => e.type !== effect.type);
    
    // Add new effect
    layer.effects.push({
      type: effect.type,
      intensity: effect.intensity,
      parameters: effect.parameters
    });

    this.updateState();
  }

  animateLayer(layerId: string, animation: Animation): void {
    const layer = this.findLayer(layerId);
    if (!layer) return;

    if (!layer.animations) layer.animations = [];
    layer.animations.push(animation);

    this.updateState();
  }

  generateVariation(seed: number): CardVariation {
    const variations: LayerModification[] = [];
    
    this.currentState.layers.forEach(layer => {
      if (Math.random() < 0.3) { // 30% chance to modify each layer
        const modification = this.generateRandomModification(layer, seed);
        variations.push(modification);
      }
    });

    return {
      id: `variation-${seed}`,
      modifications: variations,
      preview: this.generatePreview(variations)
    };
  }

  private initializeState(psd: PSDDocument): CardState {
    return {
      layers: psd.layers.map(layer => ({
        ...layer,
        styleOverrides: {},
        effects: [],
        animations: []
      })),
      metadata: {
        created: new Date(),
        modified: new Date(),
        version: 1
      }
    };
  }

  private findLayer(layerId: string): CardLayer | undefined {
    return this.currentState.layers.find(layer => layer.id === layerId);
  }

  private updateState(): void {
    this.currentState.metadata.modified = new Date();
    this.currentState.metadata.version++;
    this.history.push(this.cloneState(this.currentState));
  }

  private cloneState(state: CardState): CardState {
    return JSON.parse(JSON.stringify(state));
  }

  private getFormatFromContent(content: Content): 'png' | 'jpeg' | 'text' | 'vector' {
    switch (content.type) {
      case 'image': return 'png';
      case 'text': return 'text';
      case 'vector': return 'vector';
      default: return 'png';
    }
  }

  private generateRandomModification(layer: CardLayer, seed: number): LayerModification {
    const random = new SeededRandom(seed + layer.id.charCodeAt(0));
    
    return {
      layerId: layer.id,
      type: 'style',
      data: {
        hue: random.next() * 360,
        saturation: 0.5 + random.next() * 0.5,
        brightness: 0.8 + random.next() * 0.4
      }
    };
  }

  private generatePreview(modifications: LayerModification[]): string {
    // Generate a preview URL - in real implementation would render the modified card
    return `data:image/png;base64,preview-${modifications.length}`;
  }
}

// Helper classes and interfaces
interface PSDDocument {
  name: string;
  width: number;
  height: number;
  layers: PSDLayer[];
}

interface CardState {
  layers: CardLayer[];
  metadata: {
    created: Date;
    modified: Date;
    version: number;
  };
}

interface CardLayer extends PSDLayer {
  styleOverrides: Record<string, any>;
  effects: CardEffect[];
  animations: Animation[];
}

interface LayerModification {
  layerId: string;
  type: 'style' | 'content' | 'effect' | 'animation';
  data: any;
}

interface CardVariation {
  id: string;
  modifications: LayerModification[];
  preview: string;
}

class StateHistory {
  private states: CardState[] = [];
  private maxStates = 50;

  push(state: CardState): void {
    this.states.push(state);
    if (this.states.length > this.maxStates) {
      this.states.shift();
    }
  }

  pop(): CardState | undefined {
    return this.states.pop();
  }

  clear(): void {
    this.states = [];
  }
}

class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
}
