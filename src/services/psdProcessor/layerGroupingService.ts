
import { ProcessedPSDLayer } from './psdProcessingService';

export interface LayerGroup {
  id: string;
  name: string;
  type: 'background' | 'character' | 'ui' | 'effects' | 'branding' | 'mixed';
  color: string;
  layers: ProcessedPSDLayer[];
  averageDepth: number;
  bounds: {
    left: number;
    top: number;
    right: number;
    bottom: number;
  };
}

export class LayerGroupingService {
  private readonly GROUP_COLORS = {
    background: '#1e40af', // blue-800
    character: '#16a34a', // green-600
    ui: '#ea580c', // orange-600
    effects: '#9333ea', // purple-600
    branding: '#dc2626', // red-600
    mixed: '#6b7280' // gray-500
  };

  groupLayers(layers: ProcessedPSDLayer[]): LayerGroup[] {
    const groups: LayerGroup[] = [];
    const processedLayers = new Set<string>();

    // Group by semantic type first
    const semanticGroups = this.groupBySemanticType(layers);
    
    // Then group by depth proximity within semantic groups
    for (const [semanticType, semanticLayers] of Object.entries(semanticGroups)) {
      const depthGroups = this.groupByDepthProximity(semanticLayers);
      
      for (const depthGroup of depthGroups) {
        // Further group by spatial proximity
        const spatialGroups = this.groupBySpatialProximity(depthGroup);
        
        for (const spatialGroup of spatialGroups) {
          if (spatialGroup.length > 0) {
            const group = this.createGroup(spatialGroup, semanticType);
            groups.push(group);
            spatialGroup.forEach(layer => processedLayers.add(layer.id));
          }
        }
      }
    }

    // Handle any remaining ungrouped layers
    const ungroupedLayers = layers.filter(layer => !processedLayers.has(layer.id));
    if (ungroupedLayers.length > 0) {
      const mixedGroup = this.createGroup(ungroupedLayers, 'mixed');
      groups.push(mixedGroup);
    }

    return groups.sort((a, b) => a.averageDepth - b.averageDepth);
  }

  private groupBySemanticType(layers: ProcessedPSDLayer[]): Record<string, ProcessedPSDLayer[]> {
    const groups: Record<string, ProcessedPSDLayer[]> = {};
    
    layers.forEach(layer => {
      const type = this.getGroupType(layer.semanticType);
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(layer);
    });
    
    return groups;
  }

  private groupByDepthProximity(layers: ProcessedPSDLayer[]): ProcessedPSDLayer[][] {
    if (layers.length === 0) return [];
    
    // Sort by depth
    const sortedLayers = [...layers].sort((a, b) => (a.inferredDepth || 0) - (b.inferredDepth || 0));
    const groups: ProcessedPSDLayer[][] = [];
    let currentGroup: ProcessedPSDLayer[] = [sortedLayers[0]];
    
    for (let i = 1; i < sortedLayers.length; i++) {
      const currentDepth = sortedLayers[i].inferredDepth || 0;
      const lastDepth = sortedLayers[i - 1].inferredDepth || 0;
      
      // If depth difference is > 0.15, start a new group
      if (Math.abs(currentDepth - lastDepth) > 0.15) {
        groups.push(currentGroup);
        currentGroup = [sortedLayers[i]];
      } else {
        currentGroup.push(sortedLayers[i]);
      }
    }
    
    groups.push(currentGroup);
    return groups;
  }

  private groupBySpatialProximity(layers: ProcessedPSDLayer[]): ProcessedPSDLayer[][] {
    if (layers.length <= 1) return [layers];
    
    const groups: ProcessedPSDLayer[][] = [];
    const processed = new Set<string>();
    
    layers.forEach(layer => {
      if (processed.has(layer.id)) return;
      
      const group = [layer];
      processed.add(layer.id);
      
      // Find spatially close layers
      layers.forEach(otherLayer => {
        if (processed.has(otherLayer.id)) return;
        
        if (this.areSpatiallyClose(layer, otherLayer)) {
          group.push(otherLayer);
          processed.add(otherLayer.id);
        }
      });
      
      groups.push(group);
    });
    
    return groups;
  }

  private areSpatiallyClose(layer1: ProcessedPSDLayer, layer2: ProcessedPSDLayer): boolean {
    const threshold = 50; // pixels
    
    const center1 = {
      x: (layer1.bounds.left + layer1.bounds.right) / 2,
      y: (layer1.bounds.top + layer1.bounds.bottom) / 2
    };
    
    const center2 = {
      x: (layer2.bounds.left + layer2.bounds.right) / 2,
      y: (layer2.bounds.top + layer2.bounds.bottom) / 2
    };
    
    const distance = Math.sqrt(
      Math.pow(center1.x - center2.x, 2) + Math.pow(center1.y - center2.y, 2)
    );
    
    return distance < threshold;
  }

  private createGroup(layers: ProcessedPSDLayer[], semanticType: string): LayerGroup {
    const groupType = this.getGroupType(semanticType);
    const averageDepth = layers.reduce((sum, layer) => sum + (layer.inferredDepth || 0), 0) / layers.length;
    
    // Calculate group bounds
    const bounds = {
      left: Math.min(...layers.map(l => l.bounds.left)),
      top: Math.min(...layers.map(l => l.bounds.top)),
      right: Math.max(...layers.map(l => l.bounds.right)),
      bottom: Math.max(...layers.map(l => l.bounds.bottom))
    };
    
    return {
      id: `group-${groupType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: this.getGroupName(groupType, layers.length),
      type: groupType as LayerGroup['type'],
      color: this.GROUP_COLORS[groupType] || this.GROUP_COLORS.mixed,
      layers,
      averageDepth,
      bounds
    };
  }

  private getGroupType(semanticType?: string): string {
    switch (semanticType) {
      case 'background':
        return 'background';
      case 'player':
        return 'character';
      case 'stats':
      case 'text':
        return 'ui';
      case 'effect':
        return 'effects';
      case 'logo':
        return 'branding';
      default:
        return 'mixed';
    }
  }

  private getGroupName(type: string, layerCount: number): string {
    const names = {
      background: 'Background Elements',
      character: 'Character/Player',
      ui: 'UI & Text',
      effects: 'Effects & Shadows',
      branding: 'Logos & Branding',
      mixed: 'Other Elements'
    };
    
    return `${names[type] || 'Group'} (${layerCount})`;
  }
}

export const layerGroupingService = new LayerGroupingService();
