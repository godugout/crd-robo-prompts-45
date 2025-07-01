
import * as THREE from 'three';

export interface PSDLayer {
  id: string;
  name: string;
  type: 'text' | 'image' | 'shape' | 'group' | 'adjustment';
  properties: {
    position: { x: number; y: number };
    dimensions: { width: number; height: number };
    zIndex: number;
    opacity: number;
    blendMode: string;
    effects: LayerEffect[];
  };
  metadata: {
    isVisible: boolean;
    isLocked: boolean;
    parent?: string;
    children?: string[];
  };
  content: {
    data: ArrayBuffer | string;
    format: 'png' | 'jpeg' | 'text' | 'vector';
  };
}

export interface LayerEffect {
  type: 'shadow' | 'glow' | 'bevel' | 'gradient';
  parameters: Record<string, any>;
}

export interface LayerAnalysis {
  semantic: {
    category: 'player' | 'background' | 'stats' | 'logo' | 'effect' | 'border';
    importance: 'primary' | 'secondary' | 'decorative';
    relationship: LayerRelationship[];
  };
  spatial: {
    depth: number;
    parallaxFactor: number;
    occlusionMask?: string;
  };
  animation: {
    potential: AnimationType[];
    suggestedDuration: number;
    triggerEvent: 'hover' | 'click' | 'load' | 'continuous';
  };
}

export interface LayerRelationship {
  targetLayerId: string;
  relationshipType: 'overlay' | 'background' | 'sibling' | 'child';
  strength: number;
}

export type AnimationType = 'fade' | 'slide' | 'rotate' | 'scale' | 'parallax';

export class PSDProcessor {
  async parsePSD(file: File): Promise<PSDDocument> {
    const buffer = await file.arrayBuffer();
    // Mock PSD parsing - in real implementation would use psd.js
    return this.mockPSDParsing(file.name, buffer);
  }

  async analyzeLayers(layers: PSDLayer[]): Promise<LayerAnalysis[]> {
    return layers.map(layer => this.analyzeIndividualLayer(layer, layers));
  }

  generate3DScene(layers: PSDLayer[], analysis: LayerAnalysis[]): THREE.Scene {
    const scene = new THREE.Scene();
    
    layers.forEach((layer, index) => {
      const plane = this.createLayerPlane(layer, analysis[index]);
      scene.add(plane);
    });
    
    return scene;
  }

  private mockPSDParsing(filename: string, buffer: ArrayBuffer): PSDDocument {
    return {
      name: filename,
      width: 400,
      height: 600,
      layers: [
        {
          id: 'layer-1',
          name: 'Background',
          type: 'image',
          properties: {
            position: { x: 0, y: 0 },
            dimensions: { width: 400, height: 600 },
            zIndex: 0,
            opacity: 1,
            blendMode: 'normal',
            effects: []
          },
          metadata: {
            isVisible: true,
            isLocked: false
          },
          content: {
            data: 'mock-image-data',
            format: 'png'
          }
        },
        {
          id: 'layer-2',
          name: 'Player Image',
          type: 'image',
          properties: {
            position: { x: 50, y: 50 },
            dimensions: { width: 300, height: 400 },
            zIndex: 1,
            opacity: 1,
            blendMode: 'normal',
            effects: []
          },
          metadata: {
            isVisible: true,
            isLocked: false
          },
          content: {
            data: 'mock-player-data',
            format: 'png'
          }
        }
      ]
    };
  }

  private analyzeIndividualLayer(layer: PSDLayer, allLayers: PSDLayer[]): LayerAnalysis {
    return {
      semantic: {
        category: this.determineLayerCategory(layer),
        importance: this.determineLayerImportance(layer),
        relationship: this.findLayerRelationships(layer, allLayers)
      },
      spatial: {
        depth: layer.properties.zIndex * 0.1,
        parallaxFactor: this.calculateParallaxFactor(layer),
        occlusionMask: undefined
      },
      animation: {
        potential: this.suggestAnimations(layer),
        suggestedDuration: 300,
        triggerEvent: 'hover'
      }
    };
  }

  private determineLayerCategory(layer: PSDLayer): LayerAnalysis['semantic']['category'] {
    const name = layer.name.toLowerCase();
    if (name.includes('background') || name.includes('bg')) return 'background';
    if (name.includes('player') || name.includes('character')) return 'player';
    if (name.includes('stat') || name.includes('number')) return 'stats';
    if (name.includes('logo') || name.includes('brand')) return 'logo';
    if (name.includes('border') || name.includes('frame')) return 'border';
    return 'effect';
  }

  private determineLayerImportance(layer: PSDLayer): LayerAnalysis['semantic']['importance'] {
    if (layer.properties.dimensions.width * layer.properties.dimensions.height > 50000) {
      return 'primary';
    }
    if (layer.properties.opacity > 0.8) {
      return 'secondary';
    }
    return 'decorative';
  }

  private findLayerRelationships(layer: PSDLayer, allLayers: PSDLayer[]): LayerRelationship[] {
    return allLayers
      .filter(l => l.id !== layer.id)
      .map(otherLayer => ({
        targetLayerId: otherLayer.id,
        relationshipType: this.determineRelationshipType(layer, otherLayer),
        strength: this.calculateRelationshipStrength(layer, otherLayer)
      }))
      .filter(rel => rel.strength > 0.3);
  }

  private determineRelationshipType(layer1: PSDLayer, layer2: PSDLayer): LayerRelationship['relationshipType'] {
    if (layer1.properties.zIndex > layer2.properties.zIndex) return 'overlay';
    if (layer1.properties.zIndex < layer2.properties.zIndex) return 'background';
    return 'sibling';
  }

  private calculateRelationshipStrength(layer1: PSDLayer, layer2: PSDLayer): number {
    const zDiff = Math.abs(layer1.properties.zIndex - layer2.properties.zIndex);
    const positionDiff = Math.sqrt(
      Math.pow(layer1.properties.position.x - layer2.properties.position.x, 2) +
      Math.pow(layer1.properties.position.y - layer2.properties.position.y, 2)
    );
    
    return Math.max(0, 1 - (zDiff * 0.2 + positionDiff * 0.001));
  }

  private calculateParallaxFactor(layer: PSDLayer): number {
    return layer.properties.zIndex * 0.05;
  }

  private suggestAnimations(layer: PSDLayer): AnimationType[] {
    const animations: AnimationType[] = [];
    
    if (layer.properties.opacity < 1) animations.push('fade');
    if (layer.properties.zIndex > 0) animations.push('parallax');
    if (layer.type === 'text') animations.push('slide');
    
    return animations;
  }

  private createLayerPlane(layer: PSDLayer, analysis: LayerAnalysis): THREE.Mesh {
    const geometry = new THREE.PlaneGeometry(
      layer.properties.dimensions.width / 100,
      layer.properties.dimensions.height / 100
    );
    
    const material = new THREE.MeshBasicMaterial({
      opacity: layer.properties.opacity,
      transparent: true
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(
      layer.properties.position.x / 100,
      -layer.properties.position.y / 100,
      analysis.spatial.depth
    );
    
    return mesh;
  }
}

export interface PSDDocument {
  name: string;
  width: number;
  height: number;
  layers: PSDLayer[];
}
